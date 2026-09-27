import { NextRequest, NextResponse } from "next/server";
import { generateGeminiLivelihoodAdvice } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, language = "hindi", beneficiaryName = "Savitri Devi", district = "Kalahandi" } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Map language string to language codes
    const langCodeMap: Record<string, "hi" | "or" | "sat" | "en"> = {
      hindi: "hi",
      odia: "or",
      santhali: "sat",
      english: "en"
    };

    const targetLang = langCodeMap[language] || "hi";

    // 1. Generate Intelligent Answer via Google Gemini AI
    const replyText = await generateGeminiLivelihoodAdvice({
      userQuery: query,
      beneficiaryName,
      district,
      language: targetLang
    });

    return NextResponse.json({
      success: true,
      query,
      replyText,
      audioBase64: null,
      provider: {
        reasoning: "Google Gemini AI",
        speech: "Browser SpeechSynthesis / Native Voice"
      }
    });
  } catch (error: any) {
    console.error("AI Copilot API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process AI request"
      },
      { status: 500 }
    );
  }
}

