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
export interface JobSearchLLMResponse {
  matchingJobIds: string[];
  recommendedSector: string;
  summaryAdvice: string;
  confidenceScore: number;
}

/**
 * Fetch and rank matching jobs for any voice transcript or query using Gemini LLM reasoning
 */
export async function fetchMatchingJobsWithGemini(
  userQuery: string,
  beneficiaryContext?: { name?: string; district?: string; education?: string; skills?: string[] }
): Promise<JobSearchLLMResponse | null> {
  if (!apiKey || !userQuery.trim()) return null;

  const prompt = `
You are the Job & Opportunity Matching Engine for Sakhyam-AI (Government of India PM-AJAY and NSQF ecosystem).
The user query / spoken request is: "${userQuery}"
Beneficiary background:
- Name: ${beneficiaryContext?.name || "Beneficiary"}
- District: ${beneficiaryContext?.district || "Kalahandi, Odisha"}
- Education: ${beneficiaryContext?.education || "10th Standard"}
- Verified Skills: ${beneficiaryContext?.skills?.join(", ") || "General"}

Available Verified Jobs:
1. job-solar-field-eng (Solar PV Installation & Field Maintenance, ₹18k-28k, Green Tech)
2. job-5 (PM Surya Ghar Rooftop Solar Technician, ₹16k-25k, Green Tech)
3. job-ev-service-tech (E-Rickshaw & EV Service Tech, ₹18k-30k, Green Tech)
4. job-biogas-plant-operator (Biogas & GOBAR-dhan Operator, ₹15k-24k, Green Tech)
5. job-tractor-mechanic-lead (Farm Tractor & Diesel Mechanic, ₹18k-32k, Green Tech)
6. job-1 (DISCOM Substation Assistant Wireman, ₹15k-22k, Green Tech)
7. job-mobile-smd-lead (Mobile Hardware & SMD Diagnostics, ₹16k-26k, Green Tech)
8. job-kisan-drone-pilot (Kisan Drone Spraying Pilot, ₹22k-35k, Agriculture)
9. job-chc-drone-enterprise (Custom Hiring Center Drone Hub, ₹35k-65k, Agriculture)
10. job-mushroom-production-sup (Commercial Mushroom & Spawn Lab, ₹14k-22k, Agriculture)
11. job-omfed-dairy-lead (OMFED Bulk Milk Chilling Supervisor, ₹16k-26k, Agriculture)
12. job-honey-apiary-lead (Honey Apiary & Wax Studio, ₹20k-38k, Agriculture)
13. job-poultry-hatchery-owner (Solar Poultry Hatchery Kadaknath, ₹25k-45k, Agriculture)
14. job-biofloc-aqua-tech (Biofloc Fish Tank Farm Operator, ₹18k-28k, Agriculture)
15. job-vermicompost-hub-mgr (Organic Vermicompost Unit Manager, ₹14k-22k, Agriculture)
16. job-handloom-jacquard-lead (Jacquard Handloom Master Artisan, ₹18k-30k, Crafts)
17. job-2 (Sakhi Garments Sewing Machine Operator, ₹13k-19.5k, Crafts)
18. job-bamboo-craft-designer (Bamboo Lifestyle Homeware Designer, ₹22k-40k, Crafts)
19. job-terracotta-railway-kulhad (Terracotta & Railway Kulhad Supplier, ₹20k-38k, Crafts)
20. job-beauty-wellness-salon (Beauty Salon & Bridal Wellness, ₹22k-42k, Crafts)
21. job-csc-egram-officer (CSC e-Gram Citizen Services, ₹15k-25k, Digital)
22. job-4 (Block Data Entry Operator, ₹12k-18k, Digital)
23. job-jal-jeevan-plumber (Jal Jeevan Mission Har Ghar Jal Plumber, ₹16k-24k, Infrastructure)
24. job-cctv-wifi-tech (Solar CCTV & BharatNet Wi-Fi Tech, ₹16k-25k, Digital)
25. job-pmay-master-mason (PMAY-G Master Mason Rajmistri, ₹20k-30k, Construction)
26. job-cold-press-oil-owner (Cold-Press Oil Expeller Mill, ₹32k-65k, Agro-Mills)
27. job-spice-pulverizer-lead (Spice Pulverizer & Masala Mill, ₹16k-25k, Agro-Mills)
28. job-millet-bakery-lead (Shree Anna Millet Bakery Hub, ₹24k-48k, Agro-Mills)
29. job-3 (Food Processing Assistant, ₹14k-20k, Agro-Mills)
30. job-hospital-gda (Hospital General Duty Assistant GDA, ₹15k-22k, Healthcare)
31. job-telemedicine-point-operator (e-Sanjeevani Village Telemedicine, ₹16k-25k, Healthcare)
32. job-ayush-herbal-distillation (Ayush Essential Oil Distillation, ₹28k-55k, Healthcare)
33. job-6 (Mission Shakti SHG Community Mobilizer, ₹13k-17.5k, Healthcare)
34. job-naps-solar-apprentice (NAPS Solar Apprentice, ₹11.5k, Apprenticeship)
35. job-ohpc-electromechanical-apprentice (OHPC Industrial Apprentice, ₹12k, Apprenticeship)
36. job-drone-ops-apprentice (Kisan Drone Flight Apprentice, ₹14k, Apprenticeship)

TASK:
Identify 1 to 4 best matching job IDs for the user's intent. Output STRICT JSON only.
{
  "matchingJobIds": ["string"],
  "recommendedSector": "string",
  "summaryAdvice": "string (1 simple line explaining match)",
  "confidenceScore": 0.95
}
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
        if (parsed?.matchingJobIds && Array.isArray(parsed.matchingJobIds)) {
          return parsed;
        }
      }
    } catch (e) { }
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

Provide a warm, empathetic, simple, low-literacy friendly response in 2 short sentences. Mention relevant verified jobs (with ₹15k–₹35k wage potential), NSQF courses (Electrician, Tailoring, Food Processing, Solar, Drone, Dairy), PM-AJAY ₹3,500/month stipend and ₹35,000 grants in the chosen language without markdown or asterisks.
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
