import axios from "axios";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || process.env.NEXT_PUBLIC_SARVAM_API_KEY || "";
const SARVAM_BASE_URL = "https://api.sarvam.ai";

export interface SarvamTTSRequest {
  inputs: string[];
  target_language_code: "hi-IN" | "od-IN" | "sat-IN" | "bn-IN" | "te-IN" | "ta-IN" | "en-IN";
  speaker?: "priya" | "kavya" | "shreya" | "aditya" | "rahul" | "roopa" | "ishita" | "ritu";
  pitch?: number;
  pace?: number;
  loudness?: number;
  speech_sample_rate?: number;
  enable_preprocessing?: boolean;
  model?: "bulbul:v3" | "bulbul:v3-beta" | "bulbul:v4-flash";
}

export interface SarvamTranslateRequest {
  input: string;
  source_language_code: string;
  target_language_code: string;
  speaker_gender?: "Male" | "Female";
  mode?: "formal" | "code-mixed";
}

/**
 * Clean and truncate input text for Sarvam TTS (max 450 chars, no markdown or emojis)
 */
function sanitizeForTTS(text: string): string {
  return text
    .replace(/[#*`_~[\]()<>]/g, "") // Remove markdown
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // Remove emojis
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 450);
}

/**
 * Sarvam AI Text-to-Speech (Bulbul v3 Indic Voice Model)
 */
export async function sarvamTextToSpeech({
  inputs,
  target_language_code = "hi-IN",
  speaker = "priya"
}: SarvamTTSRequest): Promise<{ audios: string[] } | null> {
  if (!SARVAM_API_KEY) {
    console.warn("SARVAM_API_KEY not configured.");
    return null;
  }

  const cleanedInputs = inputs.map(sanitizeForTTS).filter((t) => t.length > 0);
  if (cleanedInputs.length === 0) return null;

  try {
    const payload = {
      inputs: cleanedInputs,
      target_language_code: target_language_code === "sat-IN" ? "hi-IN" : target_language_code,
      speaker: speaker || "priya",
      pitch: 0,
      pace: 1.0,
      loudness: 1.0,
      speech_sample_rate: 8000,
      enable_preprocessing: true,
      model: "bulbul:v3"
    };

    const response = await axios.post(`${SARVAM_BASE_URL}/text-to-speech`, payload, {
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error("Sarvam TTS error details:", error?.response?.data || error?.message || error);
    return null;
  }
}

/**
 * Sarvam AI Translation (Mayura Indic Translation Model)
 */
export async function sarvamTranslate({
  input,
  source_language_code,
  target_language_code
}: SarvamTranslateRequest): Promise<string> {
  if (!SARVAM_API_KEY) {
    return input;
  }

  try {
    const response = await axios.post(
      `${SARVAM_BASE_URL}/translate`,
      {
        input: sanitizeForTTS(input),
        source_language_code,
        target_language_code,
        speaker_gender: "Female",
        mode: "formal",
        model: "mayura:v1"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": SARVAM_API_KEY
        }
      }
    );

    return response.data.translated_text || input;
  } catch (error: any) {
    console.error("Sarvam Translate error:", error?.response?.data || error?.message);
    return input;
  }
}

/**
 * Sarvam AI Speech-to-Text (Saaras Indic ASR Model)
 */
export async function sarvamSpeechToText(
  audioFileBlob: Blob,
  languageCode: string = "hi-IN"
): Promise<string | null> {
  if (!SARVAM_API_KEY) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("file", audioFileBlob, "recording.wav");
    formData.append("language_code", languageCode === "sat-IN" ? "hi-IN" : languageCode);
    formData.append("model", "saaras:v1");

    const response = await axios.post(`${SARVAM_BASE_URL}/speech-to-text`, formData, {
      headers: {
        "api-subscription-key": SARVAM_API_KEY
      }
    });

    return response.data.transcript || null;
  } catch (error: any) {
    console.error("Sarvam STT error:", error?.response?.data || error?.message);
    return null;
  }
}
