const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export interface LivelihoodAdviceRequest {
  userQuery: string;
  beneficiaryName?: string;
  district?: string;
  education?: string;
  language?: "hi" | "or" | "sat" | "en";
}

// Ordered by current availability and lowest latency on Google API
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-lite-latest",
  "gemini-1.5-flash-8b"
];

/**
 * Transcribe spoken vernacular audio using Google Gemini Multimodal Audio REST API
 */
export async function transcribeSpokenAudioWithGemini(
  audioBase64: string,
  mimeType: string = "audio/webm"
): Promise<string | null> {
  if (!apiKey || !audioBase64) return null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const prompt = `You are an Indic speech-to-text transcriber for rural India (PM-AJAY beneficiaries).
Listen to the audio and transcribe exactly what the speaker says in their original language (Hindi, Odia, Santhali, Bengali, Telugu, Tamil, or English).
Output ONLY the clean transcribed sentence, nothing else.`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType.split(";")[0] || "audio/webm",
                    data: audioBase64
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini audio transcription with ${modelName} failed, trying next model...`);
    }
  }

  return null;
}

/**
 * Generate personalized NSQF livelihood and training advice using Google Gemini AI REST API
 */
export async function generateGeminiLivelihoodAdvice({
  userQuery,
  beneficiaryName = "Savitri Devi",
  district = "Kalahandi, Odisha",
  education = "10th Pass",
  language = "hi"
}: LivelihoodAdviceRequest): Promise<string> {
  if (!apiKey) {
    return `नमस्ते ${beneficiaryName} जी! ${district} में आपके कौशल और ${education} योग्यता के अनुसार 'सिलाई एवं परिधान' और 'इलेक्ट्रीशियन NSQF Level 4' कोर्स सबसे उपयुक्त हैं। इनमें PM-AJAY के तहत ₹3,500 प्रति माह स्टाइपेंड भी मिलेगा।`;
  }

  const prompt = `
You are the AI Livelihood Copilot for "Sakhyam-AI (Sakhyam-AI)", a Government of India PM-AJAY and NSQF-aligned livelihood intelligence platform.
Beneficiary Profile:
- Name: ${beneficiaryName}
- Location: ${district}
- Education: ${education}
- Target Language: ${language} (Hindi / Odia / Santhali / English)

User Question: "${userQuery}"

Provide a warm, empathetic, simple, low-literacy friendly response in 2 short sentences. Mention relevant NSQF courses (Electrician, Tailoring, Food Processing, Solar), PM-AJAY ₹3,500/month stipend, and nearest training center assistance in the chosen language without markdown or asterisks.
`;

  // Try candidate model names in order with automatic fallback
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini generation with ${modelName} failed, trying next candidate...`);
    }
  }

  // Graceful rule-based fallback
  const fallbacks: Record<string, string> = {
    hi: `नमस्ते ${beneficiaryName} जी! आपके लिए PM-AJAY के अंतर्गत NSQF Level 4 सोलर एवं मोटर रिपेयर कोर्स उपलब्ध है। इसमें ₹3,500 मासिक स्टाइपेंड और ₹35,000 की टूलकिट सहायता मिलेगी।`,
    or: `ନମସ୍କାର ${beneficiaryName} ଜ୍ଞା! ଆପଣଙ୍କ ପାଇଁ PM-AJAY ଅନ୍ତର୍ଗତ NSQF ଲେଭଲ ୪ ସିଲେଇ ଓ ମୋଟର ରିପେୟାର କୋର୍ସ ଉପଲବ୍ଧ। ଏଥିରେ ମାସିକ ₹୩,୫୦୦ ଷ୍ଟାଇପେଣ୍ଡ ମିଳିବ।`,
    sat: `ᱡᱚᱦᱟᱨ ${beneficiaryName}! ᱟᱢ ᱞᱟᱹᱜᱤᱫ PM-AJAY ᱨᱮ NSQF Level 4 ᱴᱨᱮᱱᱤᱝ ᱢᱮᱱᱟᱜ-ᱟ ᱟᱨ ₹3,500 ᱥᱴᱟᱭᱯᱮᱱᱰ ᱧᱟᱢᱚᱜ-ᱟ।`,
    en: `Hello ${beneficiaryName}! Under PM-AJAY, NSQF Level 4 Solar and Motor Repair courses are available for you with a ₹3,500 monthly stipend and tool kit support.`
  };

  return fallbacks[language] || fallbacks.hi;
}

/**
 * Detect Indian vernacular language from user utterance using Gemini AI
 */
export async function detectSpokenLanguageWithGemini(
  userUtterance: string
): Promise<{ languageCode: string; languageName: string } | null> {
  if (!apiKey || !userUtterance.trim()) return null;

  const prompt = `
You are an expert Indic language & accent classifier for rural India (PM-AJAY beneficiaries).
The user spoke: "${userUtterance}"

TASK:
Determine the exact Indian language the user is speaking in or intends to use.

CRITICAL ACCENT & REGIONAL RULES:
1. Odia (code "or"):
   - Words & phonetic variants (English / Devanagari / Odia script):
     "mote", "mu", "mun", "aame", "ame", "tame", "apana", "apananku", "nahanti", "asuchi", "heuchi", "dorkar", "darkar", "sikhiba", "sikhibaku", "sikhibara", "silai", "kam", "kaam", "katha", "jani", "bapa", "ghare", "bhalo", "namaskar", "odia", "oriya", "odisha", "pani", "kahuchi", "deba", "neba", "silai sikhba", "kam darkar", "mote kam", "मोते काम दरकार", "सिलाइ सिखिब", "आमे ओडिया", "कहूचि", "दरकार", "सिखिबा", "ओड़िआ", "ସିଲେଇ", "ଦରକାର", "ଶିଖିବା", "ଆମେ", "ମୋତେ"
   - Odia script Unicode: \\u0B00-\\u0B7F
   - MUST be classified as "or" (Odia)!

2. Santhali (code "sat"):
   - Words: "johar", "kami", "nyam", "santhal", "abon", "ing", "am", "ol chiki", "chando", "ᱥᱟᱱᱛᱟᱲᱤ", "ᱡᱚᱦᱟᱨ"
   - Ol Chiki script Unicode: \\u1C50-\\u1C7F
   - MUST be classified as "sat" (Santhali)!

3. Bhojpuri (code "bho"):
   - Words: "ba", "baate", "dikat ba", "kare ke", "hamra", "tohar", "kaisan", "bujhat", "raua", "हमार", "तोहार", "बाटे"
   - MUST be classified as "bho" (Bhojpuri)!

4. Marathi (code "mr"):
   - Words: "shikaycha", "karaycha", "aahe", "havay", "aamhi", "tumhi", "kasa", "ahes", "शिकायचं", "करायचं", "आहे"
   - MUST be classified as "mr" (Marathi)!

5. Bengali (code "bn"):
   - Words: "ami", "kaj", "korte chai", "shikhte", "amake", "bhalo", "আমি", "কাজ"
   - MUST be classified as "bn" (Bengali)!

6. English (code "en"):
   - Words: "i want", "i need", "job", "training", "computer", "skills", "learn", "course", "english"
   - MUST be classified as "en" (English)!

7. Hindi (code "hi"):
   - Words: "मुझे", "सीखना है", "काम चाहिए", "बताइए", "रोजगार", "योजना", "हिन्दी"
   - CRITICAL: Do NOT classify as Hindi if the utterance contains Odia, Santhali, Bhojpuri, or Marathi words!

Allowed language codes:
"hi", "or", "sat", "en", "bho", "bn", "te", "mr", "ta", "gu", "kn", "pa", "ur", "as"

Output STRICT JSON only:
{"languageCode": "hi"|"or"|"sat"|"en"|"bho"|"bn"|"te"|"mr"|"ta"|"gu"|"kn"|"pa"|"ur"|"as", "languageName": "string"}
`;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) continue;
      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.languageCode) {
          return parsed;
        }
      }
    } catch { }
  }

  return null;
}

/**
 * Detect language directly from raw human audio voice & accent using Google Gemini Multimodal Audio
 */
export async function detectLanguageFromSpokenAudioWithGemini(
  audioBase64: string,
  mimeType: string = "audio/webm"
): Promise<{ languageCode: string; languageName: string; transcript: string } | null> {
  if (!apiKey || !audioBase64) return null;

  const prompt = `You are an expert Indic language & accent classifier for rural India (PM-AJAY beneficiaries in Kalahandi/Mayurbhanj Odisha, Bihar, Jharkhand, etc.).
Listen to the human voice audio recording.
Determine the exact language the user is speaking in, recognizing their accent, pronunciation, and vocabulary.

RULES:
- If the user speaks in Odia (ଓଡ଼ିଆ) or with an Odia accent/words ("ମୋତେ", "କାମ", "ଦରକାର", "ଶିଖିବା", "ଆମେ", "କୁହନ୍ତୁ", "ନାହାନ୍ତି", "ଆସୁଛି", "ନମସ୍କାର", "ସିଲେଇ", "mote", "darkar", "kam", "sikhiba"), classify as "or" (Odia).
- If the user speaks Santhali (ᱥᱟᱱᱛᱟᱲᱤ) or uses Santhali words ("ᱡᱚᱦᱟᱨ", "କାᱹᱢᱤ", "ᱥᱟᱱᱛᱟᱲᱤ", "johar"), classify as "sat" (Santhali).
- If the user speaks Bhojpuri ("बा", "बाटे", "हमार", "तोहार", "करे के", "रउआ"), classify as "bho" (Bhojpuri).
- If the user speaks Marathi ("शिकायचं", "करायचं", "आहे", "हवंय", "आम्ही"), classify as "mr" (Marathi).
- If the user speaks Bengali ("আমি", "কাজ", "করতে চাই", "শিখতে"), classify as "bn" (Bengali).
- If the user speaks English ("I want", "need training", "skills", "job"), classify as "en" (English).
- If the user speaks Hindi ("मुझे", "काम चाहिए", "सीखना है"), classify as "hi" (Hindi).
- Also support "te" (Telugu), "ta" (Tamil), "gu" (Gujarati), "kn" (Kannada), "pa" (Punjabi), "ur" (Urdu), "as" (Assamese).

Output STRICT JSON only:
{"languageCode": "hi"|"or"|"sat"|"en"|"bho"|"bn"|"te"|"mr"|"ta"|"gu"|"kn"|"pa"|"ur"|"as", "languageName": "string", "transcript": "string"}
`;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType.split(";")[0] || "audio/webm",
                    data: audioBase64
                  }
                }
              ]
            }
          ],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) continue;
      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.languageCode) {
          return parsed;
        }
      }
    } catch (e) { }
  }

  return null;
}

/**
 * Generate high-quality audio Base64 for spoken vernacular responses using Google/Gemini TTS
 */
export async function generateGoogleSpeechBase64(
  text: string,
  lang: string = "hi"
): Promise<string | null> {
  try {
    const langMap: Record<string, string> = {
      hi: "hi",
      "hi-in": "hi",
      or: "hi", // Odia phonetic synthesis
      "or-in": "hi",
      sat: "hi", // Santhali phonetic synthesis
      "sat-in": "hi",
      bho: "hi", // Bhojpuri
      "bho-in": "hi",
      en: "en",
      "en-in": "en",
      "en-us": "en",
      bn: "bn", // Bengali
      "bn-in": "bn",
      te: "te", // Telugu
      "te-in": "te",
      mr: "mr", // Marathi
      "mr-in": "mr",
      ta: "ta", // Tamil
      "ta-in": "ta",
      gu: "gu", // Gujarati
      "gu-in": "gu",
      kn: "kn", // Kannada
      "kn-in": "kn",
      pa: "pa", // Punjabi
      "pa-in": "pa",
      ur: "ur", // Urdu
      "ur-in": "ur",
      as: "bn",  // Assamese via Bengali engine
      "as-in": "bn"
    };

    // Clean markdown, symbols, asterisks, emojis
    const cleanText = text
      .replace(/[*_#`~[\]]/g, "")
      .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();

    const normalizedLang = (lang || "hi").toLowerCase().trim();
    const primaryCode = normalizedLang.split("-")[0].split("_")[0];
    const targetLang = langMap[normalizedLang] || langMap[primaryCode] || "hi";

    const clean = encodeURIComponent(cleanText.slice(0, 200));
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${clean}`;

    const res = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  } catch (err) {
    console.warn("Google TTS generation error:", err);
    return null;
  }
}
