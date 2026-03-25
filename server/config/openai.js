const OpenAI = require('openai');

let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

const SYSTEM_PROMPT = `You are VAkeely AI, an expert Indian legal assistant acting in the capacity of a professional, highly experienced trial lawyer giving an official case evaluation to a client. Your role is to:
1. Understand the user's legal query and classify it into core Indian legal categories.
2. Draft a precise, highly professional 'Case Summary' (like a lawyer's case brief) detailing the core facts, the primary legal issues at hand, and any relevant data queries or evidence required for the lawsuit. 
3. Identify all exact Indian laws, acts, and sections that apply to their situation. 
4. Provide a deep, strategic legal explanation outlining their rights, potential liabilities, the burden of proof, and typical judicial precedents related to the matter.
5. Provide actionable, strict legal recommendations (e.g., file a writ, send a legal notice under specific sections, mediation, etc.).
6. Estimate the general complexity and timeline of their case in the Indian Judiciary system.

Always respond in a structured JSON format:
{
  "caseType": "Specific Category of the case (e.g., Criminal - Bail Application, Civil - Property Dispute)",
  "summary": "A highly detailed, professional lawyer's case brief summarizing the facts, identifying the core legal injury, and outlining the immediate data/evidence required from the client.",
  "relevantLaws": [
    { "act": "Name of the Act (e.g., Indian Penal Code 1860, Constitution of India)", "section": "Specific Section/Article", "description": "How this specific law applies to the facts" }
  ],
  "explanation": "A deep strategic explanation written like an original lawyer's legal opinion. Discuss the strengths & weaknesses of the case, the burden of proof, potential defenses by the opposition, and possible judicial precedents.",
  "recommendations": "Step-by-step strategic legal actions the client must take immediately.",
  "lawyerType": "Specific type of lawyer required (e.g., Supreme Court Advocate, Family Court litigator)",
  "complexity": "Low/Medium/High - with brief justification",
  "estimatedTimeline": "Realistic timeline estimate considering Indian court pendency"
}

Be authoritative, professional, and strategic, exactly as a senior lawyer advising a client in chambers would speak. Always mention that this is AI-generated guidance and not a substitute for retained professional legal counsel.`;

const generateLegalResponse = async (userMessage, chatHistory = []) => {
  const client = getOpenAIClient();
  
  if (!client) {
    return getFallbackResponse(userMessage);
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.3,
      max_tokens: 1500
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(responseText);
      return { success: true, data: parsed, raw: responseText };
    } catch {
      return { success: true, data: null, raw: responseText };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return getFallbackResponse(userMessage);
  }
};

const getFallbackResponse = (userMessage) => {
  const lowerMsg = userMessage.toLowerCase();
  
  const categoryMap = {
    criminal: { keywords: ['theft', 'murder', 'assault', 'robbery', 'fraud', 'cheating', 'fir', 'police', 'bail', 'arrest', 'criminal'], type: 'Criminal' },
    civil: { keywords: ['property', 'land', 'dispute', 'contract', 'agreement', 'money', 'debt', 'loan', 'tenant', 'landlord', 'rent'], type: 'Civil' },
    family: { keywords: ['divorce', 'marriage', 'custody', 'alimony', 'maintenance', 'domestic violence', 'dowry', 'child'], type: 'Family' },
    corporate: { keywords: ['company', 'business', 'startup', 'incorporation', 'director', 'shareholder', 'gst', 'compliance'], type: 'Corporate' },
    labour: { keywords: ['employment', 'salary', 'termination', 'fired', 'workplace', 'harassment', 'pf', 'gratuity', 'employee'], type: 'Labour' },
    consumer: { keywords: ['consumer', 'product', 'defective', 'refund', 'warranty', 'service', 'complaint'], type: 'Consumer' },
    tax: { keywords: ['tax', 'income tax', 'gst', 'tax evasion', 'return', 'assessment'], type: 'Tax' },
    ip: { keywords: ['patent', 'copyright', 'trademark', 'intellectual property', 'infringement', 'design'], type: 'Intellectual Property' },
    constitutional: { keywords: ['fundamental rights', 'constitution', 'article', 'writ', 'pil', 'freedom', 'liberty', 'equality', 'discrimination', 'habeas corpus', 'rti'], type: 'Constitutional' },
    property: { keywords: ['real estate', 'registration', 'mutation', 'encroachment', 'title', 'deed', 'possession'], type: 'Property' }
  };

  let detectedType = 'General';
  for (const [, value] of Object.entries(categoryMap)) {
    if (value.keywords.some(kw => lowerMsg.includes(kw))) {
      detectedType = value.type;
      break;
    }
  }

  const fallbackResponses = {
    Criminal: {
      caseType: 'Criminal',
      summary: 'Your query appears to be related to criminal law matters.',
      relevantLaws: [
        { act: 'Indian Penal Code (IPC), 1860', section: 'Various', description: 'Defines criminal offenses and their punishments' },
        { act: 'Code of Criminal Procedure (CrPC), 1973', section: 'Various', description: 'Procedures for criminal cases' },
        { act: 'Indian Evidence Act, 1872', section: 'Various', description: 'Rules of evidence in legal proceedings' }
      ],
      explanation: 'Criminal matters in India are governed primarily by the IPC and CrPC. The severity of punishment depends on the nature of the offense. You should file an FIR at your nearest police station if you are a victim, or consult a criminal lawyer immediately if you are accused.',
      recommendations: '1. File an FIR at the nearest police station if you are the victim.\n2. Consult a criminal defense lawyer immediately.\n3. Gather and preserve all evidence.\n4. Do not make any statements without legal counsel.',
      lawyerType: 'Criminal Defense Lawyer',
      complexity: 'High',
      estimatedTimeline: '6 months to 3 years depending on case complexity'
    },
    Constitutional: {
      caseType: 'Constitutional',
      summary: 'Your query relates to constitutional law and fundamental rights.',
      relevantLaws: [
        { act: 'Constitution of India, 1950', section: 'Part III', description: 'Fundamental Rights (Articles 12 to 35)' },
        { act: 'Constitution of India, 1950', section: 'Article 32/226', description: 'Right to constitutional remedies via Writs' },
        { act: 'Right to Information Act, 2005', section: 'Various', description: 'Right to access information' }
      ],
      explanation: 'Constitutional law deals with the fundamental rights guaranteed to citizens and the powers of the state. If your fundamental rights are violated, you have the right to approach the High Court (Art. 226) or the Supreme Court (Art. 32) directly through Writ petitions.',
      recommendations: '1. Identify which fundamental right has been violated.\n2. Collect evidence of state action or omission.\n3. Consult a Constitutional lawyer or a Senior Advocate.\n4. Consider filing a Public Interest Litigation (PIL) if the issue affects the public at large.',
      lawyerType: 'Constitutional Lawyer / Supreme Court Advocate',
      complexity: 'High',
      estimatedTimeline: '1 to 4 years for High Court/Supreme Court matters'
    },
    Civil: {
      caseType: 'Civil',
      summary: 'Your query relates to civil law matters involving disputes between parties.',
      relevantLaws: [
        { act: 'Code of Civil Procedure (CPC), 1908', section: 'Various', description: 'Procedures for civil cases' },
        { act: 'Indian Contract Act, 1872', section: 'Various', description: 'Governs contracts and agreements' },
        { act: 'Transfer of Property Act, 1882', section: 'Various', description: 'Governs property transfers' }
      ],
      explanation: 'Civil disputes are resolved through civil courts. You may need to file a civil suit to claim your rights. Mediation is also an option for faster resolution.',
      recommendations: '1. Gather all relevant documents and evidence.\n2. Try to resolve the matter through negotiation first.\n3. Send a legal notice through a lawyer.\n4. File a civil suit if negotiation fails.',
      lawyerType: 'Civil Litigation Lawyer',
      complexity: 'Medium',
      estimatedTimeline: '1 to 5 years in civil courts'
    },
    Family: {
      caseType: 'Family',
      summary: 'Your query relates to family law matters.',
      relevantLaws: [
        { act: 'Hindu Marriage Act, 1955', section: 'Various', description: 'Governs Hindu marriages, divorce, and maintenance' },
        { act: 'Protection of Women from Domestic Violence Act, 2005', section: 'Various', description: 'Protection against domestic violence' },
        { act: 'Hindu Succession Act, 1956', section: 'Various', description: 'Governs inheritance and succession' }
      ],
      explanation: 'Family law matters are handled by Family Courts. Issues like divorce, custody, and maintenance have specific legal procedures. Mediation is often encouraged before litigation.',
      recommendations: '1. Document all incidents if violence is involved.\n2. Approach a family counselor or mediator.\n3. File a complaint under DV Act if needed.\n4. Consult a family lawyer for divorce/custody matters.',
      lawyerType: 'Family Law Lawyer',
      complexity: 'Medium',
      estimatedTimeline: '6 months to 2 years'
    },
    Corporate: {
      caseType: 'Corporate',
      summary: 'Your query relates to corporate and business law.',
      relevantLaws: [
        { act: 'Companies Act, 2013', section: 'Various', description: 'Governs company formation and management' },
        { act: 'Partnership Act, 1932', section: 'Various', description: 'Governs partnership firms' },
        { act: 'LLP Act, 2008', section: 'Various', description: 'Governs Limited Liability Partnerships' }
      ],
      explanation: 'Corporate law matters are complex and require specialized legal advice. Compliance with MCA, ROC filings, and statutory requirements are essential.',
      recommendations: '1. Ensure all statutory compliances are up to date.\n2. Consult a corporate lawyer for specific issues.\n3. Maintain proper documentation.\n4. File necessary forms with ROC on time.',
      lawyerType: 'Corporate Lawyer',
      complexity: 'Medium to High',
      estimatedTimeline: 'Varies based on the matter'
    },
    General: {
      caseType: 'General Legal Query',
      summary: 'Thank you for your legal query. Let me help you understand your situation better.',
      relevantLaws: [
        { act: 'Constitution of India', section: 'Part III', description: 'Fundamental Rights' },
        { act: 'Right to Information Act, 2005', section: 'Various', description: 'Right to access government information' }
      ],
      explanation: 'Based on your query, I recommend consulting with a qualified lawyer who can provide specific advice for your situation. Every legal matter has unique aspects that require professional assessment.',
      recommendations: '1. Document your issue clearly.\n2. Gather all relevant evidence and documents.\n3. Consult a qualified lawyer.\n4. Consider legal aid if you cannot afford a lawyer.',
      lawyerType: 'General Practice Lawyer',
      complexity: 'Varies',
      estimatedTimeline: 'Depends on the nature of the case'
    }
  };

  const response = fallbackResponses[detectedType] || fallbackResponses.General;
  return { 
    success: true, 
    data: response, 
    raw: JSON.stringify(response), 
    isFallback: true 
  };
};

module.exports = { generateLegalResponse, getOpenAIClient };
