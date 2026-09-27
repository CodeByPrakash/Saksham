import { NextRequest, NextResponse } from "next/server";
import { generateGoogleSpeechBase64 } from "@/lib/ai/gemini";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = (body.text || body.query || "").trim();
    const language = (body.language || body.lang || "hi").toLowerCase();

    if (!text) {
      return NextResponse.json({ success: false, error: "Text is required for TTS" }, { status: 400 });
    }

    const audioBase64 = await generateGoogleSpeechBase64(text, language as any);

    if (!audioBase64) {
      return NextResponse.json({ success: false, error: "Audio synthesis failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      audioBase64,
      audioUrl: `data:audio/mp3;base64,${audioBase64}`,
      language
    });
  } catch (error: any) {
    console.error("TTS API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to generate TTS" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get("text") || searchParams.get("q") || "").trim();
  const language = (searchParams.get("lang") || searchParams.get("language") || "hi").toLowerCase();

  if (!text) {
    return NextResponse.json({ success: false, error: "Text query param 'text' is required" }, { status: 400 });
  }

  const audioBase64 = await generateGoogleSpeechBase64(text, language as any);
  if (!audioBase64) {
    return NextResponse.json({ success: false, error: "Audio synthesis failed" }, { status: 500 });
  }

  const audioBuffer = Buffer.from(audioBase64, "base64");
  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mp3",
      "Content-Length": audioBuffer.length.toString(),
      "Cache-Control": "public, max-age=86400"
    }
  });
}
