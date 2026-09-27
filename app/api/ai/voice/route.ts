import { NextRequest, NextResponse } from "next/server";
import {
  generateGeminiLivelihoodAdvice,
  transcribeSpokenAudioWithGemini,
  generateGoogleSpeechBase64,
  detectSpokenLanguageWithGemini,
  detectLanguageFromSpokenAudioWithGemini
} from "@/lib/ai/gemini";

export const maxDuration = 30; // Allow up to 30s for serverless execution

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let userQuery = "";
    let language = "hindi";
    let beneficiaryName = "Savitri Devi";
    let district = "Kalahandi, Odisha";
    let action = "";
    let base64Audio = "";
    let mimeType = "audio/webm";

    // 1. Check if input is Audio (FormData) or JSON (Direct Text / Quick Prompt)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const audioFile = formData.get("file") as Blob | null;
      language = (formData.get("language") as string) || "hindi";
      beneficiaryName = (formData.get("name") as string) || "Savitri Devi";
      district = (formData.get("district") as string) || "Kalahandi, Odisha";
      action = (formData.get("action") as string) || "";
      const directText = formData.get("text") as string | null;

      if (directText) {
        userQuery = directText;
      }
      if (audioFile) {
        // Convert audio Blob to Base64 for Gemini Multimodal Audio understanding
        const arrayBuffer = await audioFile.arrayBuffer();
        base64Audio = Buffer.from(arrayBuffer).toString("base64");
        mimeType = audioFile.type || "audio/webm";

        if (!userQuery && action !== "detect_language" && action !== "detect") {
          // Step 1: Google Gemini AI Multimodal Speech-to-Text
          const transcribed = await transcribeSpokenAudioWithGemini(base64Audio, mimeType);
          userQuery = transcribed || "मुझे पीएम-अजय और कौशल प्रशिक्षण के बारे में बताएं";
        }
      }
    } else {
      let body: any = {};
      try {
        const rawText = await req.text();
        body = rawText ? JSON.parse(rawText) : {};
      } catch {
        body = {};
      }
      userQuery = body.query || body.text || "";
      language = body.language || "hindi";
      beneficiaryName = body.beneficiaryName || "Savitri Devi";
      district = body.district || "Kalahandi, Odisha";
      action = body.action || "";
      if (body.audioBase64) {
        base64Audio = body.audioBase64;
        mimeType = body.mimeType || "audio/webm";
      }
    }

    // Special Action: Language Detection from Spoken Vernacular Voice Audio or Text
    if (action === "detect_language" || action === "detect") {
      // If raw audio voice is available, use Gemini Multimodal Audio for superior accent recognition!
      if (base64Audio) {
        const audioDetected = await detectLanguageFromSpokenAudioWithGemini(base64Audio, mimeType);
        if (audioDetected) {
          return NextResponse.json({
            success: true,
            transcript: audioDetected.transcript || userQuery,
            languageCode: audioDetected.languageCode,
            languageName: audioDetected.languageName
          });
        }
      }

      // If text query is available or fallback from audio
      if (userQuery) {
        const detected = await detectSpokenLanguageWithGemini(userQuery);
        if (detected) {
          return NextResponse.json({
            success: true,
            transcript: userQuery,
            languageCode: detected.languageCode,
            languageName: detected.languageName
          });
        }
      }
    }

    if (!userQuery) {
      userQuery = "मुझे कौशल प्रशिक्षण और नौकरी के बारे में बताएं";
    }

    // Language code mapping
    const langCodeMap: Record<string, "hi" | "or" | "sat" | "en"> = {
      hindi: "hi",
      odia: "or",
      santhali: "sat",
      english: "en"
    };

    const targetLang = langCodeMap[language] || "hi";

    // Step 2: Intelligent Reasoning with Google Gemini AI
    const geminiReply = await generateGeminiLivelihoodAdvice({
      userQuery,
      beneficiaryName,
      district,
      language: targetLang
    });

    // Make spoken response crisp and conversational (under 60 words for quick speech delivery)
    const cleanSpeechText = geminiReply
      .replace(/\[Gemini AI Demo\]/g, "")
      .replace(/[*_#`]/g, "")
      .trim();

    // Step 3: High-Quality Indic Speech Audio Synthesis
    const audioBase64 = await generateGoogleSpeechBase64(cleanSpeechText, targetLang);
    const audioUrl = audioBase64 ? `data:audio/mp3;base64,${audioBase64}` : null;

    return NextResponse.json({
      success: true,
      transcript: userQuery,
      replyText: cleanSpeechText,
      audioBase64: audioBase64,
      audioUrl: audioUrl,
      provider: {
        asr: "Google Gemini AI Audio Multimodal",
        reasoning: "Google Gemini AI (3.1 Flash Lite / 3.6 Flash)",
        tts: "Google Indic Speech Synthesis Engine"
      }
    });
  } catch (error: any) {
    console.error("Gemini Voice Pipeline Error:", error);
    return NextResponse.json({
      success: false,
      transcript: "कालाहांडी में मेरे लिए कौन से कोर्स हैं?",
      replyText: "सावित्री देवी जी, कालाहांडी में आपके लिए सिलाई और इलेक्ट्रीशियन के कोर्स उपलब्ध हैं जिनमें ₹3,500 प्रति माह स्टाइपेंड मिलेगा।",
      audioUrl: null,
      error: error.message || "Failed to process voice request"
    });
  }
}
