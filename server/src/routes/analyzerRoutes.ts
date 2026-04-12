import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import { getOpenAIClient } from '../config/openai.js';
import { auth } from '../middleware/auth.js';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', auth, upload.single('document'), async (req: Request, res: Response) => {
  try {
    let documentText = '';

    // Handle File Upload (PDFs)
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        documentText = pdfData.text;
      } else {
        return res.status(400).json({ message: 'Only PDF documents are supported for now.' });
      }
    } else if (req.body.text) {
      documentText = req.body.text;
    }

    if (!documentText || documentText.trim().length === 0) {
      return res.status(400).json({ message: 'No text or valid document provided.' });
    }

    const client = getOpenAIClient();
    if (!client) {
      return res.status(503).json({ message: 'OpenAI client is not configured yet. Please try again later.' });
    }

    const prompt = `You are a Senior Legal Case Analyzer working for VAkeely in India.
Your task is to analyze the following legal document or text and provide a highly professional, structured analysis.

Document Text:
"""
${documentText.length > 15000 ? documentText.substring(0, 15000) + '...' : documentText}
"""

Provide your analysis in EXACT JSON FORMAT with the following fields:
{
  "summary": "A concise, professional brief of the case facts.",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2 (loopholes)"],
  "strategy": "A step-by-step recommended legal strategy.",
  "relevantLaws": ["Relevant Act/Section 1", "Relevant Act/Section 2"]
}
Respond ONLY with valid JSON. Do not include markdown formatting like \`\`\`json.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content || '{}';
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch {
      analysis = {
        summary: "Could not parse AI response",
        strengths: [],
        weaknesses: [],
        strategy: "Please try again.",
        relevantLaws: []
      };
    }

    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('[Analyzer] Error processing document:', error);
    res.status(500).json({ message: 'Failed to process document', error: error.message });
  }
});

export default router;
