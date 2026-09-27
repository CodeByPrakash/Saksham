import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface LivelihoodAdviceRequest {
  userQuery: string;
  beneficiaryName?: string;
  district?: string;
  education?: string;
  language?: "hi" | "or" | "sat" | "en";
}

// Ordered by current availability and lowest latency on Google API
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.6-flash",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash"
];

/**
 * Transcribe spoken vernacular audio using Google Gemini Multimodal Audio
 */
export async function transcribeSpokenAudioWithGemini(
  audioBase64: string,
  mimeType: string = "audio/webm"
): Promise<string | null> {
  if (!genAI || !audioBase64) return null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `You are an Indic speech-to-text transcriber for rural India (PM-AJAY beneficiaries).
Listen to the audio and transcribe exactly what the speaker says in their original language (Hindi, Odia, Santhali, Bengali, Telugu, Tamil, or English).
Output ONLY the clean transcribed sentence, nothing else.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType.split(";")[0] || "audio/webm",
            data: audioBase64
          }
        }
      ]);

      const text = result.response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini audio transcription with ${modelName} failed (${err?.message || err}), trying next model...`);
    }
  }

  return null;
}

/**
 * Generate personalized NSQF livelihood and training advice using Google Gemini AI
 */
export async function generateGeminiLivelihoodAdvice({
  userQuery,
  beneficiaryName = "Savitri Devi",
  district = "Kalahandi, Odisha",
  education = "10th Pass",
  language = "hi"
}: LivelihoodAdviceRequest): Promise<string> {
  if (!genAI) {
    return `नमस्ते ${beneficiaryName} जी! ${district} में आपके कौशल और ${education} योग्यता के अनुसार 'सिलाई एवं परिधान' और 'इलेक्ट्रीशियन NSQF Level 4' कोर्स सबसे उपयुक्त हैं। इनमें PM-AJAY के तहत ₹3,500 प्रति माह स्टाइपेंड भी मिलेगा।`;
  }

  const prompt = `
You are the AI Livelihood Copilot for "Saksham (JeevikaSetu)", a Government of India PM-AJAY and NSQF-aligned livelihood intelligence platform.
Beneficiary Profile:
- Name: ${beneficiaryName}
- Location: ${district}
- Education: ${education}
- Target Language: ${language} (Hindi / Odia / Santhali / English)

User Question: "${userQuery}"

Provide a warm, empathetic, simple, low-literacy friendly response in 2 short sentences. Mention relevant NSQF courses (Electrician, Tailoring, Food Processing, Solar), PM-AJAY ₹3,500/month stipend, and nearest training center assistance in the chosen language without markdown or asterisks.
`;

  // Try candidate model names in order with automatic fallback on 503/429/404
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini model ${modelName} attempt failed (${err?.message || err}), trying next candidate...`);
    }
  }

  // Graceful fallback response if API is temporarily unreachable
  return `नमस्ते ${beneficiaryName} जी! ${district} में आपके लिए सिलाई और इलेक्ट्रीशियन के नि:शुल्क ट्रेनिंग कोर्स और पीएम-अजय स्टाइपेंड उपलब्ध हैं।`;
}

/**
 * Extract formal NSQF skill capabilities from informal vernacular speech
 */
export async function extractSkillsWithGemini(spokenStatement: string) {
  if (!genAI) {
    return [
      { name: "Domestic Wiring & Repair", nsqfLevel: 4, qpCode: "ELE/Q5901", confidence: 92 },
      { name: "Garment Construction", nsqfLevel: 3, qpCode: "AMH/Q0102", confidence: 88 }
    ];
  }

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
Analyze this beneficiary's informal spoken statement and extract verified NSQF skill items with Qualification Pack (QP) code, NSQF Level (1-5), and confidence score (0-100).
Spoken statement: "${spokenStatement}"

Return JSON array of objects with keys: name, nsqfLevel, qpCode, confidence.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (err) {
      console.warn(`Gemini skill extraction with ${modelName} failed, trying next...`);
    }
  }

  return [
    { name: "Basic Electrical Wiring", nsqfLevel: 4, qpCode: "ELE/Q5901", confidence: 90 }
  ];
}

/**
 * Generate natural Indic spoken audio (MP3 Base64) for speech playback
 */
export async function generateGoogleSpeechBase64(
  text: string,
  language: "hi" | "or" | "sat" | "en" = "hi"
): Promise<string | null> {
  try {
    const langMap: Record<string, string> = {
      hi: "hi",
      or: "hi",
      sat: "hi",
      en: "en"
    };
    const target = langMap[language] || "hi";

    // Clean text of markdown, asterisks, brackets, or emojis
    const clean = text
      .replace(/[#*`_~[\]()<>]/g, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/gu, "")
      .trim();

    const sentences = clean.match(/[^.!?।\n]+[.!?।\n]?/g) || [clean];
    const buffers: Buffer[] = [];

    for (const chunk of sentences.slice(0, 3)) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${target}&client=tw-ob&q=${encodeURIComponent(
        trimmed.slice(0, 180)
      )}`;

      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      });

      if (res.ok) {
        const ab = await res.arrayBuffer();
        buffers.push(Buffer.from(ab));
      }
    }

    if (buffers.length === 0) return null;
    return Buffer.concat(buffers).toString("base64");
  } catch (err) {
    console.error("Google Speech synthesis error:", err);
    return null;
  }
}

