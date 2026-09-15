import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Gemini client:', err);
  }
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Medical Diagnosis System',
    geminiAvailable: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// 2. Gemini AI Clinical Consultation & Medical Explanation
app.post('/api/ai-explain', async (req, res) => {
  try {
    const { diseaseName, symptoms, userQuestion } = req.body;

    if (!diseaseName) {
      return res.status(400).json({ error: 'Disease name is required' });
    }

    // If Gemini is available, query gemini-3.8-flash
    if (ai && process.env.GEMINI_API_KEY) {
      const prompt = `You are an expert, compassionate clinical educator and academic AI mentor.
The user's symptom assessment indicated a possible match with: "${diseaseName}".
Selected symptoms: ${(symptoms || []).join(', ') || 'Not specified'}.
${userQuestion ? `The user asks: "${userQuestion}"` : 'Please provide: 1) What this condition is in clear, simple language. 2) Common biological causes. 3) What typical questions the patient should bring to their doctor. 4) Urgent red-flag warning signs that require emergency room care.'}

CRITICAL MEDICAL SAFETY RULES:
- Never provide definitive medical diagnosis or prescribe drugs/dosages.
- Emphasize that this is educational triage, not a replacement for a doctor.
- Keep tone objective, reassuring, and grounded.
- Maximum 250-300 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const explanation = response.text || '';
      return res.json({
        success: true,
        source: 'gemini-3.8-flash',
        explanation,
      });
    }

    // Fallback response when GEMINI_API_KEY is not configured
    const fallbackExplanation = `### Understanding ${diseaseName}
**Overview:** ${diseaseName} is a recognized medical condition that shares strong clinical overlap with the symptoms you reported (${(symptoms || []).slice(0, 4).join(', ')}).

**What to Discuss with Your Doctor:**
1. When did these symptoms first appear, and do they fluctuate in intensity?
2. Are there any prescription medications, allergies, or chronic conditions that might interact?
3. What standard diagnostic tests (e.g., blood panel, imaging, cultures) are recommended to confirm or rule out this condition?

**⚠️ Critical Red-Flag Warning:**
If you develop sudden chest pain, severe difficulty breathing, high fever with neck stiffness, or sudden weakness/numbness on one side of your body, do not wait—seek immediate emergency medical services (911 / emergency room).`;

    return res.json({
      success: true,
      source: 'offline-clinical-rules',
      explanation: fallbackExplanation,
    });
  } catch (error: any) {
    console.error('Error generating AI explanation:', error);
    return res.status(500).json({
      error: 'Failed to generate medical explanation',
      details: error?.message || 'Internal server error',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Medical Diagnosis System running on port ${PORT}`);
  });
}

startServer();
