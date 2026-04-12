/**
 * VAkeely AI Engine — Production-Grade RAG (Retrieval-Augmented Generation) Pipeline
 * 
 * Architecture:
 *   userMessage 
 *     → retrieveLegalContext()   (MongoDB full-text + keyword search)
 *     → buildSystemPrompt()      (inject retrieved law context)
 *     → OpenAI gpt-4o-mini       (structured JSON response)
 *     → parseAndValidate()       (JSON parse with fallback)
 * 
 * The LLM is GROUNDED in VAkeely's own law database — it cites actual sections
 * from MongoDB, not generic training data knowledge.
 */

import OpenAI from 'openai';
import { Model } from 'mongoose';
import { ILegalAct, IAIStatus, IAIResult, IAIResponse, IChatMessage } from '../types/index.js';

// ─── CLIENT SETUP ────────────────────────────────────────────────────────────

let openaiClient: OpenAI | null = null;
let activeModel = 'gpt-4o-mini';
let isGeminiMode = false;
let geminiApiKeyStr = '';

export const getOpenAIClient = (): OpenAI | null => {
  if (!openaiClient) {
    const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!key || key === 'your_openai_api_key_here') {
      return null;
    }
    
    isGeminiMode = key.startsWith('AIza') || !!process.env.GEMINI_API_KEY;
    if (isGeminiMode) {
      activeModel = 'gemini-2.5-flash';
      geminiApiKeyStr = key;
      // Return a dummy client so ai status shows available
      return {} as any;
    }

    openaiClient = new OpenAI({ apiKey: key });
  }
  return openaiClient;
};

// Model config Defaults
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.2; // Low temp = more precise, less hallucination

// ─── RAG: RETRIEVE LEGAL CONTEXT FROM MONGODB ────────────────────────────────

/**
 * Retrieves the most relevant Indian law acts and sections from MongoDB
 * based on the user's query using full-text search + keyword matching.
 */
const retrieveLegalContext = async (userMessage: string, LegalActModel: Model<ILegalAct> | null, CaseModel: Model<any> | null): Promise<string> => {
  if (!LegalActModel) return '';

  try {
    const lowerMsg = userMessage.toLowerCase();
    const queryWords = lowerMsg
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 10); // take up to 10 significant words

    // Strategy 1: MongoDB full-text search
    let acts: any[] = [];
    try {
      acts = await LegalActModel.find(
        { $text: { $search: userMessage }, isActive: true },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } as any })
        .limit(4)
        .lean();
    } catch (err) {
      // text index might not be ready — fall through to keyword search
    }

    // Strategy 2: Keyword regex search if full-text returns < 2 results
    if (acts.length < 2) {
      const keywordQuery = {
        isActive: true,
        $or: [
          { keywords: { $in: queryWords } },
          { 'sections.keywords': { $in: queryWords } },
          { title: { $regex: queryWords.slice(0, 5).join('|'), $options: 'i' } },
          { description: { $regex: queryWords.slice(0, 5).join('|'), $options: 'i' } }
        ]
      };
      const keywordActs = await LegalActModel.find(keywordQuery).limit(4).lean();
      
      // Merge, deduplicate
      const existingIds = new Set(acts.map(a => a._id.toString()));
      for (const act of keywordActs) {
        if (!existingIds.has(act._id.toString())) {
          acts.push(act);
          if (acts.length >= 5) break;
        }
      }
    }

    if (acts.length === 0) return '';

    // Build a concise context block — focus on most relevant sections
    const contextLines: string[] = [];
    contextLines.push('=== VAKEELY LAW DATABASE CONTEXT ===');
    contextLines.push('The following Indian laws are retrieved from our verified database and may be relevant to this query. Cite them directly in your response.\n');

    for (const act of acts.slice(0, 4)) {
      contextLines.push(`ACT: ${act.title} (${act.shortTitle}, ${act.year}) — Category: ${act.category}`);

      // Score and pick the most relevant sections
      const scoredSections = (act.sections || []).map((section: any) => {
        const sectionText = `${section.title} ${section.description} ${(section.keywords || []).join(' ')}`.toLowerCase();
        const score = queryWords.reduce((acc, word) => acc + (sectionText.includes(word) ? 1 : 0), 0);
        return { ...section, _score: score };
      });

      const topSections = scoredSections
        .sort((a: any, b: any) => b._score - a._score)
        .slice(0, 4); // max 4 sections per act

      for (const section of topSections) {
        contextLines.push(`  § ${section.number} — ${section.title}`);
        contextLines.push(`    Description: ${section.description}`);
        if (section.penalty) contextLines.push(`    Penalty/Consequence: ${section.penalty}`);
      }
      contextLines.push('');
    }

    // Strategy 3: Retrieve Supreme Court judgments
    if (CaseModel) {
      try {
        const cases = await CaseModel.find(
          { $text: { $search: userMessage } },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } as any }).limit(3).lean();
        
        if (cases.length > 0) {
          contextLines.push('=== SUPREME COURT PRECEDENTS ===');
          for (const c of cases) {
            contextLines.push(`Case: ${c.title}`);
            contextLines.push(`Date: ${c.date ? new Date(c.date).toISOString().split('T')[0] : 'N/A'}`);
            contextLines.push(`Bench: ${c.bench || 'N/A'}`);
          }
          contextLines.push('=============================\n');
        }
      } catch (err) {
        // text index might not be ready
      }
    }

    contextLines.push('=== END OF LAW DATABASE CONTEXT ===\n');
    return contextLines.join('\n');

  } catch (err: any) {
    console.error('[RAG] Context retrieval error:', err.message);
    return '';
  }
};

// ─── SYSTEM PROMPT BUILDER ────────────────────────────────────────────────────

const buildSystemPrompt = (legalContext: string, userContext: string = ''): string => {
  const contextSection = legalContext
    ? `\n${legalContext}\nIMPORTANT: You MUST cite sections from the above database context in your relevantLaws array. These are verified, accurate Indian laws from VAkeely's database — prefer them over generic knowledge.\n`
    : '';

  return `You are VAkeely AI, an expert Indian legal assistant operating with the authority and precision of a senior trial lawyer. You have access to VAkeely's verified Indian law database.
${contextSection}
${userContext}
CRITICAL LANGUAGE INSTRUCTION: You must strictly understand and fluently respond in the exact language the user used (English, pure Hindi, or Hinglish - Hindi written in English alphabet). All content values in the JSON (summary, explanation, recommendations, expected timeline) MUST be translated to the user's language. The JSON keys and lawyerType must remain in English.

Your role is to:
1. Understand the user's legal situation in English, Hindi, or Hinglish.
2. Draft a precise professional Case Summary detailing core facts, legal issues, and evidence required.
3. Identify exact Indian laws, acts, and sections — PRIORITIZE sections from the VAKEELY LAW DATABASE CONTEXT.
4. Provide a strategic legal analysis: rights, liabilities, burden of proof, key precedents.
5. Give concrete, actionable legal recommendations.
6. Estimate case complexity and timeline in the Indian judiciary.

STRICT OUTPUT FORMAT — respond ONLY with valid JSON, no markdown, no extra text:
{
  "caseType": "Specific category (e.g., Criminal - Bail Application, Civil - Tenant Dispute, Labour - Wrongful Termination)",
  "summary": "Professional lawyer's case brief: facts, core legal injury, evidence needed from client.",
  "relevantLaws": [
    { "act": "Full Act Name (Year)", "section": "Section/Article number", "description": "How this applies to the facts" }
  ],
  "explanation": "Strategic legal opinion: strengths, weaknesses, burden of proof, likely opposition defenses, key precedents.",
  "recommendations": "Numbered, step-by-step immediate legal actions the client must take.",
  "lawyerType": "Specific type of lawyer required",
  "complexity": "Low/Medium/High — with brief justification",
  "estimatedTimeline": "Realistic timeline in Indian courts",
  "legalDBSources": ["Act Short Title §Section", "..."],
  "precedents": [
    { "title": "Case Title", "date": "YYYY-MM-DD", "bench": "Judge Name", "summary": "Why it matters" }
  ]
}

The legalDBSources field must list the section references you cited from the database context (e.g., ["IPC §302", "CrPC §154"]). 
The precedents array MUST list the Supreme Court Precedents precisely as provided in the VAKEELY LAW DATABASE CONTEXT.
Be authoritative and professional. Always note this is AI guidance, not a substitute for retained legal counsel.`;
};

// ─── MAIN RAG FUNCTION ───────────────────────────────────────────────────────

/**
 * Generates a grounded legal AI response using RAG pipeline.
 */
export const generateLegalResponse = async (
  userMessage: string, 
  chatHistory: IChatMessage[] = [], 
  LegalActModel: Model<ILegalAct> | null = null,
  CaseModel: Model<any> | null = null,
  userAppointments: any[] = []
): Promise<IAIResult> => {
  const client = getOpenAIClient();

  if (!client) {
    console.warn('[AI] No OpenAI key configured — using keyword fallback.');
    return getFallbackResponse(userMessage);
  }

  // Step 1: Retrieve relevant law context from MongoDB
  const legalContext = await retrieveLegalContext(userMessage, LegalActModel, CaseModel);
  if (legalContext) {
    console.log('[RAG] Retrieved law context for query — grounded response enabled.');
  } else {
    console.log('[RAG] No DB context found — using general knowledge.');
  }

  // Step 1.5: Build user context
  let userContextStr = '';
  if (userAppointments && userAppointments.length > 0) {
    userContextStr = '=== USER HISTORY ===\nPast appointments/case history recorded:\n';
    userAppointments.forEach((app, i) => {
      userContextStr += `${i+1}. Case Type: ${app.caseType || 'N/A'}, Description: ${app.description || 'N/A'}\n`;
    });
    userContextStr += 'Consider this context if the user refers to past situations.\n====================\n';
  }

  // Step 2: Build grounded system prompt
  const systemPrompt = buildSystemPrompt(legalContext, userContextStr);

  // Step 3: Prepare message history (keep last 6 messages for context window efficiency)
  const recentHistory = chatHistory.slice(-6).map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: typeof msg.content === 'string'
      ? (msg.content.length > 800 ? msg.content.slice(0, 800) + '...' : msg.content)
      : JSON.stringify(msg.content).slice(0, 800)
  }));

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: userMessage }
  ];

  // Step 4: Call AI with retry logic
  try {
    let responseText = '{}';
    let tokensUsed = 0;

    if (isGeminiMode) {
      // Execute native Gemini Request
      const contents = [];
      contents.push({ role: "user", parts: [{ text: systemPrompt }] });
      contents.push({ role: "model", parts: [{ text: "Understood. I will strictly follow this context." }] });
      
      messages.forEach(msg => {
        if (msg.role === 'system') return;
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(msg.content) }]
        });
      });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${geminiApiKeyStr}`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_TOKENS,
            responseMimeType: "application/json"
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Gemini Error: ${await res.text()}`);
      }
      
      const resData = await res.json();
      responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      tokensUsed = resData.usageMetadata?.totalTokenCount || 0;
    } else {
      // Execute standard OpenAI Request
      const completion = await client.chat.completions.create({
        model: activeModel,
        messages,
        temperature: TEMPERATURE,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      responseText = completion.choices[0].message.content || '{}';
      tokensUsed = completion.usage?.total_tokens || 0;
    }

    console.log(`[AI] Response generated. Tokens used: ${tokensUsed}. Model: ${activeModel}`);

    // Clean up Markdown backticks if the model returned them
    let cleanedResponseText = responseText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```\s*$/i, '').trim();

    // Step 5: Parse and validate JSON response
    try {
      const parsed = JSON.parse(cleanedResponseText) as IAIResponse;

      // Ensure required fields exist
      if (!parsed.caseType) parsed.caseType = 'General Legal Query';
      if (!parsed.relevantLaws) parsed.relevantLaws = [];
      if (!parsed.legalDBSources) parsed.legalDBSources = [];

      return {
        success: true,
        data: parsed,
        raw: responseText,
        model: activeModel,
        tokensUsed,
        isRAG: !!legalContext
      };
    } catch {
      // JSON parse failed — wrap raw text
      const fallbackData: IAIResponse = {
        explanation: responseText,
        caseType: 'General',
        relevantLaws: [],
        legalDBSources: [],
        summary: '',
        recommendations: '',
        lawyerType: '',
        complexity: '',
        estimatedTimeline: ''
      };
      return {
        success: true,
        data: fallbackData,
        raw: responseText,
        model: activeModel,
        tokensUsed,
        isRAG: !!legalContext
      };
    }

  } catch (error: any) {
    // Classify error for better debugging
    const errCode = error?.status || error?.code;
    if (errCode === 429) {
      console.error('[AI] OpenAI rate limit hit. Falling back.');
    } else if (errCode === 401) {
      console.error('[AI] Invalid OpenAI API key.');
    } else {
      console.error('[AI] OpenAI API error:', error.message);
    }
    return getFallbackResponse(userMessage);
  }
};

// ─── KEYWORD FALLBACK (when OpenAI unavailable) ───────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Criminal:       ['theft', 'murder', 'assault', 'robbery', 'fraud', 'cheating', 'fir', 'police', 'bail', 'arrest', 'criminal', 'ipc', 'accused', 'offense'],
  Civil:          ['property', 'land', 'dispute', 'contract', 'agreement', 'money', 'debt', 'loan', 'tenant', 'landlord', 'rent', 'deposit', 'lease'],
  Family:         ['divorce', 'marriage', 'custody', 'alimony', 'maintenance', 'domestic violence', 'dowry', 'child', 'separation', 'matrimonial'],
  Corporate:      ['company', 'business', 'startup', 'incorporation', 'director', 'shareholder', 'gst', 'compliance', 'board', 'registered'],
  Labour:         ['employee', 'employer', 'fired', 'termination', 'salary', 'wages', 'pf', 'epf', 'gratuity', 'retrenchment', 'layoff', 'workplace', 'sexual harassment Office'],
  Consumer:       ['consumer', 'product', 'defective', 'refund', 'warranty', 'service complaint', 'unfair trade', 'consumer forum'],
  Tax:            ['tax', 'income tax', 'gst', 'tds', 'itr', 'assessment', 'tax evasion', 'return filing'],
  IP:             ['patent', 'copyright', 'trademark', 'intellectual property', 'infringement', 'cyber', 'hacking', 'online fraud'],
  Constitutional: ['fundamental rights', 'constitution', 'article', 'writ', 'pil', 'freedom', 'liberty', 'equality', 'discrimination', 'rti'],
  Property:       ['real estate', 'sale deed', 'mutation', 'encroachment', 'title', 'deed', 'possession', 'registry'],
  Traffic:        ['accident', 'vehicle', 'driving', 'license', 'road accident', 'insurance claim', 'mact', 'challan'],
  Banking:        ['bank', 'loan default', 'npa', 'sarfaesi', 'bank notice', 'insolvency', 'ibc', 'nclt', 'bankruptcy']
};

const getFallbackResponse = (userMessage: string): IAIResult => {
  const lowerMsg = userMessage.toLowerCase();

  let detectedType = 'General';
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lowerMsg.includes(kw))) {
      detectedType = category;
      break;
    }
  }

  const FALLBACK_TEMPLATES: Record<string, IAIResponse> = {
    Criminal: {
      caseType: 'Criminal Law',
      summary: 'Your query pertains to criminal law in India. This requires immediate attention and professional legal counsel.',
      relevantLaws: [
        { act: 'Indian Penal Code (IPC), 1860', section: 'Various', description: 'Primary statute defining criminal offenses and punishments in India.' },
        { act: 'Code of Criminal Procedure (CrPC), 1973', section: 'Various', description: 'Governs the procedure for investigation, trial, and sentencing in criminal cases.' }
      ],
      explanation: 'Criminal matters in India are governed by the IPC and CrPC. Depending on whether the offense is cognizable or non-cognizable, the procedure differs. Victims should file an FIR; accused persons should seek legal counsel immediately.',
      recommendations: '1. If you are a victim, file an FIR at the nearest police station.\n2. If police refuse to register FIR, file a complaint before the Magistrate under Section 156(3) CrPC.\n3. If you are accused, engage a criminal defense lawyer before making any statement.\n4. Do not tamper with or destroy any evidence.',
      lawyerType: 'Criminal Defense / Litigation Lawyer',
      complexity: 'High — criminal cases involve liberty and require specialized counsel.',
      estimatedTimeline: '1 to 5 years depending on the nature of the offense and court.',
      legalDBSources: ['IPC §Various', 'CrPC §154']
    },
    Civil: {
      caseType: 'Civil Dispute',
      summary: 'Your matter appears to be a civil dispute involving rights, contracts, or property.',
      relevantLaws: [
        { act: 'Code of Civil Procedure (CPC), 1908', section: 'Various', description: 'Governs the procedure for filing and deciding civil suits.' },
        { act: 'Indian Contract Act, 1872', section: '73', description: 'Entitles the aggrieved party to compensation for breach.' }
      ],
      explanation: 'Civil disputes are resolved through civil courts. Sending a legal notice is typically the first step, followed by filing a civil suit if the dispute is not resolved.',
      recommendations: '1. Gather all agreements, receipts, and communications.\n2. Send a legal notice through a lawyer.\n3. If no resolution, file a civil suit in the appropriate court.\n4. Consider mediation for faster resolution.',
      lawyerType: 'Civil Litigation Lawyer',
      complexity: 'Medium',
      estimatedTimeline: '1 to 4 years in civil courts.',
      legalDBSources: ['CPC §Various', 'ICA §73']
    },
    Family: {
      caseType: 'Family Law',
      summary: 'Your query relates to a family law matter — matrimonial, custody, or domestic issues.',
      relevantLaws: [
        { act: 'Hindu Marriage Act, 1955', section: '13', description: 'Provides grounds for divorce.' },
        { act: 'Protection of Women from Domestic Violence Act, 2005', section: '18', description: 'Protection orders for victims of domestic violence.' }
      ],
      explanation: 'Family courts handle matrimonial disputes. Mediation is generally encouraged before litigation. Victims of domestic violence can seek interim protection orders immediately.',
      recommendations: '1. Document all incidents with dates and witnesses.\n2. Approach a family law lawyer for a detailed consultation.\n3. If violence is involved, approach a Protection Officer or file a complaint under DV Act immediately.\n4. Consider mediation for amicable settlement.',
      lawyerType: 'Family Law Lawyer / Family Court Advocate',
      complexity: 'Medium to High',
      estimatedTimeline: '6 months to 3 years.',
      legalDBSources: ['HMA §13', 'DV Act §18']
    },
    General: {
      caseType: 'General Legal Query',
      summary: 'Your legal query has been noted. For a precise analysis, additional details about your situation are needed.',
      relevantLaws: [
        { act: 'Constitution of India, 1950', section: 'Article 21', description: 'Right to life and personal liberty.' }
      ],
      explanation: 'Based on the information provided, a general legal assessment is being provided. Please provide more specific details for a more targeted legal analysis.',
      recommendations: '1. Clearly document the facts of your situation.\n2. Gather all relevant documents and evidence.\n3. Consult a qualified lawyer registered with the Bar Council of India.\n4. If you cannot afford a lawyer, seek help from the District Legal Services Authority (DLSA).',
      lawyerType: 'General Practice Lawyer',
      complexity: 'Depends on the specific nature of the case.',
      estimatedTimeline: 'Depends on the matter.',
      legalDBSources: []
    }
  };

  const response = FALLBACK_TEMPLATES[detectedType] || FALLBACK_TEMPLATES.General;

  return {
    success: true,
    data: response,
    raw: JSON.stringify(response),
    isFallback: true,
    model: 'fallback-keyword-engine',
    isRAG: false
  };
};

// ─── AI STATUS ────────────────────────────────────────────────────────────────

export const getAIStatus = (): IAIStatus => {
  const client = getOpenAIClient();
  return {
    available: !!client,
    model: client ? activeModel : null,
    mode: client ? ('rag-' + activeModel) as 'rag-gpt4o-mini' : 'keyword-fallback',
    features: {
      rag: true,
      lawDatabase: true,
      structuredJSON: true
    }
  };
};
