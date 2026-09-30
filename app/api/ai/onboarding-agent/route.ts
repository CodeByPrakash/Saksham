import { NextRequest, NextResponse } from "next/server";
import { generateGoogleSpeechBase64 } from "@/lib/ai/gemini";
import { getNSQFAgeBracket, getAvatarForGender } from "@/lib/nsqfAge";

export const maxDuration = 30;

interface OnboardingStepConfig {
  step: "name_location" | "skills_experience" | "education" | "aspiration";
  userSpokenText: string;
  language: "hi" | "or" | "sat" | "en";
  currentProfile: {
    fullName?: string;
    district?: string;
    state?: string;
    skills?: string[];
    nsqfCode?: string;
    nsqfLevel?: number;
    nsqfCourse?: string;
    education?: string;
    aspiration?: string;
    recommendedPathway?: string;
    grantEligibility?: string;
  };
}

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-lite-latest",
  "gemini-1.5-flash-8b"
];

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export function cleanHumanName(raw: string): string {
  if (!raw) return "";
  let name = raw.trim();

  // 1. Remove introductory prefixes (English, Hindi, Odia, Santhali, Bhojpuri, Marathi, etc.)
  name = name.replace(
    /^(?:my\s*name\s*is|i\s*am|im|i'm|this\s*is|myself|मेरा\s*नाम\s*है|मेरा\s*नाम|हमार\s*नाम|ମୋର\s*ନାମ|ଇଁᱧᱟᱜ\s*ᱧᱩᱛᱩᱢ|माझे\s*नाव|नाव|नाम|name\s*is)\s*[:=,-]?\s*/iu,
    ""
  );

  // 2. Remove trailing locations, connectors, and prepositions (including common STT mishearings like 'form', 'frm', 'rom' for 'from')
  name = name.replace(
    /\s+(?:from|form|frm|frum|fram|rom|se|hai|h|hu|hoon|hume|living|residing|belongs?|rehta|rehti|rahata|rahati|ka|ke|ki|district|dist|zilla|zila|gaon|gram|village|city|state|odisha|jharkhand|up|bihar|uttar\s*pradesh|sundargarh|kalahandi|mayurbhanj|varanasi|ranchi|sambalpur|bhubaneswar|cuttack|koraput|balasore|patna|delhi|mumbai|kolkata|है|हूँ|हू|से|का|के|की|जिला|गाँव|गांव|ओडिशा|सुंदरगढ़|सुन्दरगढ़|कालाहांडी|मयूरभंज|वाराणसी|राँची|ବାରାଣାସୀ|ସୁନ୍ଦରଗଡ଼|କଳାହାଣ୍ଡି|ମୟୂରଭଞ୍ଜ|ଝାଡ଼ଖଣ୍ڈ|ଓଡ଼ିଶା).*$/iu,
    ""
  );

  // 3. Strip standalone noise words if any remain (from, form, frm, se, hai, hu, hoon, etc.)
  name = name.replace(
    /\b(?:from|form|frm|frum|fram|rom|se|hai|hu|hoon|h|of|in|at|the|and|is|am|are|aur|e|tatha|ji|sahab|sir|madam|है|हूँ|हू|से|का|के|की|जिला|गाँव|गांव|ओडिशा|ସୁନ୍ଦରଗଡ଼|ସେ|ହୁଁ|ହୈ)\b/giu,
    " "
  ).trim();

  // 4. Clean extra punctuation, quotes, symbols (preserve Latin, Devanagari, Odia, Ol Chiki, Bengali)
  name = name.replace(/[^\w\s\u0900-\u097F\u0B00-\u0B7F\u1C50-\u1C7F\u0980-\u09FF]/gi, " ").replace(/\s+/g, " ").trim();

  // 5. If word ended with dangling connectors or leftover noise:
  name = name.replace(/\b(?:from|form|frm|se|hai|है|हूँ|से)\b/giu, "").trim();

  // 6. Capitalize Latin words properly
  const capitalized = name
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^[a-zA-Z]+$/.test(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    })
    .join(" ");

  return capitalized || (raw ? raw.replace(/\b(?:from|form|frm|se|hai)\b/gi, "").trim() : "");
}

export async function POST(req: NextRequest) {
  let requestLanguage = "en";
  try {
    const body: OnboardingStepConfig = await req.json();
    const { step, userSpokenText, language = "hi", currentProfile = {} } = body;
    requestLanguage = language;

    if (!userSpokenText || userSpokenText.trim().length === 0) {
      return NextResponse.json({
        isRelevant: false,
        relevanceReason: "No audio or speech detected",
        feedbackText: getEmptyFeedback(step, language),
        extractedData: {},
        nextStep: step
      });
    }

    // Step-specific system prompts for relevance validation and data extraction
    const stepPrompts: Record<string, string> = {
      name_location: `
You are an AI Onboarding Agent for PM-AJAY rural livelihood platform (Sakhyam-AI).
Question asked: "What is your name, age, gender, and which village or district are you from?"
User's spoken answer: "${userSpokenText}"

CRITICAL RULES FOR EXTRACTION:
1. Extract STRICTLY the human person's name (e.g. "Omprakash", "Ramesh Soren", "Amit Kumar", "Savitri Devi").
2. NEVER include prepositions, location connectors, or filler words like "from", "form", "se", "is", "am", "i am", "of", "and", "hail from", "rehta hu", "district", "village", "city" in fullName!
3. Extract:
   - fullName: string (only the clean first and last name, capitalized)
   - gender: "male" | "female" | "other" (determine from words like male/female/purush/mahila/devi/kumar/etc.)
   - age: number (e.g. 28, 52, 19, etc. If not explicitly spoken, infer from standard context or default to 28)
   - ageCategory: string ("<18 (Pre-Vocational / Foundation)" if age < 18, "50+ (Senior RPL & Master Artisan)" if age >= 50, otherwise ">=18 (NSQF L3–5 Core & RPL)")
   - district: string (e.g. "Sundargarh", "Kalahandi", "Mayurbhanj", "Varanasi", etc.)
   - state: string (e.g. "Odisha", "Jharkhand", "Uttar Pradesh", "Bihar", etc.)
4. Provide a warm 1-sentence feedback in ${language === "hi" ? "Hindi" : language === "or" ? "Odia" : "English"} acknowledging their name, age, and district.
`,
      skills_experience: `
You are an AI Skill & Job Ontology Agent for PM-AJAY & National Skills Qualifications Framework (NSQF).
Question asked: "What informal work, daily job, trade, or practical skills do you have experience in? (e.g. drone flying, solar installation, tailoring, electrical, hospital care, computer/CSC, plumbing, carpentry, dairy, mushroom farming, food processing)"
User's spoken answer: "${userSpokenText}"

CRITICAL INSTRUCTIONS:
1. Determine if the answer is RELEVANT (mentions ANY work, hobby, trade, chore, craft, agricultural activity, tech, caregiving, repair, shopkeeping, driving, construction, etc.).
   If the user does not mention any work or says random unrelated things, mark isRelevant: false.
2. EXTRACT PRECISELY WHAT THE USER ACTUALLY SPOKE:
   - Do NOT default everything to Pump repair or Tailoring if the user spoke about something else!
   - If user said "drone / ड्रोन", map to Kisan Drone Pilot (AGR/Q7004, Level 4).
   - If user said "solar / सोलर / suryamitra", map to Solar PV Rooftop Grid Specialist (SGJ/Q0101, Level 4).
   - If user said "hospital / gda / मरीज / nurse / स्वास्थ्य", map to General Duty Hospital Assistant (HSS/Q5101, Level 4).
   - If user said "computer / csc / digital / data entry", map to CSC Digital Seva Operator (SSC/Q2212, Level 4).
   - If user said "carpenter / लकड़ी / बढ़ई", map to Carpenter & Furniture Artisan (CON/Q0602, Level 4).
   - If user said "plumber / नल / पाइप", map to Rural Domestic Plumber (PSC/Q0104, Level 3).
   - If user said "mushroom / मशरूम", map to Commercial Mushroom Cultivator (AGR/Q7801, Level 4).
   - If user said "dairy / दूध / गाय / भैंस", map to Automated Dairy & Milk Chilling Tech (AGR/Q4101, Level 4).
   - If user said "fish / मछली / biofloc", map to Biofloc Aquaculture Enterprise (AGR/Q4901, Level 4).
   - If user said "tailor / सिलाई / कपड़ा", map to Self Employed Tailor & Apparel SHG (AMH/Q0102, Level 3).
   - If user said "electrician / बिजली / वायरिंग", map to Assistant Electrician & DISCOM Wireman (ELE/Q5901, Level 4).
   - If user speaks any other custom trade (e.g. mobile repair, cooking, driving, welding), extract that exact skill into skills!
3. Extracted fields:
   - skills: string[] (3 specific practical skill tags matching what they said)
   - nsqfCourse: string (official NSQF course title)
   - nsqfCode: string (e.g. "AGR/Q7004", "SGJ/Q0101", "HSS/Q5101", etc.)
   - nsqfLevel: number (3, 4, or 5)
   - matchedJobTitle: string (title of the matching job opening)
   - matchedJobId: string (e.g. "job-drone-pilot", "job-solar-technician", etc.)
   - matchScore: number (88 to 98)
4. Provide a warm 1-sentence feedback in ${language === "hi" ? "Hindi" : language === "or" ? "Odia" : "English"} acknowledging their exact skills and how NSQF certifies it.
`,
      education: `
You are an AI Onboarding Agent for PM-AJAY livelihood qualifications.
Question asked: "What is your education background? (e.g. 5th, 8th, 10th pass, 12th, or non-formal literacy)"
User's spoken answer: "${userSpokenText}"

Task:
1. Determine if the answer is RELEVANT (mentions schooling level, literacy, college, ITI, or informal education).
2. If relevant, extract:
   - education: string (e.g. "10th Pass", "8th Pass", "12th Standard", "Literate / Non-formal", "Graduate")
3. Provide a warm 1-sentence feedback in ${language === "hi" ? "Hindi" : language === "or" ? "Odia" : "English"}.
`,
      aspiration: `
You are an AI Livelihood Pathway Agent under Government PM-AJAY scheme.
Question asked: "What is your main livelihood goal? (Fast income job, Skill certification, or Starting your own micro-enterprise with PM-AJAY capital subsidy ₹35,000)"
User's spoken answer: "${userSpokenText}"

Task:
1. Determine if the answer is RELEVANT (mentions starting a shop/business, getting a job, earning money, learning solar/electrical, etc.).
2. If relevant, extract:
   - aspiration: string (e.g. "Self-Employment Hub with PM-AJAY Grant", "Fast Income Wage Employment (35 Days)", "Skill Upgradation")
   - recommendedPathway: string (e.g. "PM-AJAY Agri-Pump & Solar Repair Hub", "Suryamitra Certified Technician", "Rural Micro-Enterprise")
   - grantEligibility: string ("₹35,000 Capital Subsidy + ₹3,500/mo Training Stipend")
3. Provide a warm 1-sentence celebration feedback in ${language === "hi" ? "Hindi" : language === "or" ? "Odia" : "English"}.
`
    };

    let aiResult: any = null;

    if (apiKey) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
          const prompt = `
${stepPrompts[step] || stepPrompts.name_location}

Current Beneficiary Profile state:
${JSON.stringify(currentProfile)}

OUTPUT STRICT JSON FORMAT:
{
  "isRelevant": boolean,
  "relevanceReason": string,
  "extractedData": object,
  "feedbackText": string,
  "guidanceTip": string
}
`;

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });

          if (res.ok) {
            const data = await res.json();
            const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (raw) {
              aiResult = JSON.parse(raw);
              if (aiResult && typeof aiResult.isRelevant === "boolean") {
                if (aiResult.extractedData && aiResult.extractedData.fullName) {
                  aiResult.extractedData.fullName = cleanHumanName(aiResult.extractedData.fullName);
                }
                break;
              }
            }
          }
        } catch (err: any) {
          console.warn(`Gemini evaluation with ${modelName} failed, trying next candidate...`);
        }
      }
    }

    // Heuristic intelligent fallback if Gemini API is offline or key missing
    if (!aiResult) {
      aiResult = fallbackHeuristicExtraction(step, userSpokenText, language);
    } else if (aiResult.extractedData && aiResult.extractedData.fullName) {
      aiResult.extractedData.fullName = cleanHumanName(aiResult.extractedData.fullName);
    }

    // Generate spoken audio for the feedback/next question using Gemini & Google Speech
    let audioUrl: string | null = null;
    if (aiResult.feedbackText) {
      try {
        const googleB64 = await generateGoogleSpeechBase64(aiResult.feedbackText, language);
        if (googleB64) {
          audioUrl = `data:audio/mp3;base64,${googleB64}`;
        }
      } catch (err) {
        console.warn("Audio synthesis error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      step,
      isRelevant: aiResult.isRelevant,
      relevanceReason: aiResult.relevanceReason || "",
      extractedData: aiResult.extractedData || {},
      feedbackText: aiResult.feedbackText || "",
      guidanceTip: aiResult.guidanceTip || "",
      audioUrl: audioUrl
    });
  } catch (err: any) {
    console.error("Onboarding agent endpoint error:", err);
    return NextResponse.json({
      success: false,
      isRelevant: true,
      extractedData: {},
      feedbackText:
        requestLanguage === "hi"
          ? "जानकारी दर्ज हो गई है। आगे बढ़ते हैं।"
          : requestLanguage === "or"
            ? "ତଥ୍ୟ ଯୋଡ଼ାଗଲା। ଆଗକୁ ବଢ଼ିବା।"
            : requestLanguage === "sat"
              ? "ᱠᱟᱛᱷᱟ ᱨᱮᱠᱚᱨᱰ ᱮᱱᱟ᱾ ᱞᱟᱦᱟ ᱥᱮᱫ ᱵᱚᱱ ᱪᱟᱞᱟᱜᱼᱟ᱾"
              : requestLanguage === "bn"
                ? "তথ্য সংরক্ষিত হয়েছে। এগিয়ে যাওয়া যাক।"
                : "Information recorded. Moving forward.",
      error: err.message
    });
  }
}

function getEmptyFeedback(step: string, language: string) {
  if (language === "hi") {
    return "हमें आपकी आवाज सुनाई नहीं दी। कृपया माइक्रोफोन दबाकर फिर से बोलें।";
  }
  if (language === "or") {
    return "ଆମେ ଆପଣଙ୍କ ସ୍ୱର ଶୁଣିପାରିଲୁ ନାହିଁ। ଦୟାକରି ପୁନର୍ବାର କୁହନ୍ତୁ।";
  }
  if (language === "sat") {
    return "ᱟᱞᱮ ᱟᱢᱟᱜ ᱟᱲᱟᱝ ᱵᱟᱞᱮ ᱟᱧᱡᱚᱢ ᱧᱟᱢ ᱞᱮᱫᱟ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱢᱟᱭᱤᱠ ᱚᱛᱟ ᱠᱟᱛᱮ ᱨᱚᱲ ᱢᱮ᱾";
  }
  if (language === "bn") {
    return "আমরা আপনার কণ্ঠ শুনতে পাইনি। দয়া করে মাইক্রোফোন চেপে আবার বলুন।";
  }
  return "We could not hear your voice. Please tap the microphone and speak again.";
}

/**
 * Intelligent Rule-Based Fallback to guarantee 100% reliable onboarding without API dependency
 */
function fallbackHeuristicExtraction(step: string, text: string, language: string) {
  const lower = text.toLowerCase();
  const cleanLang = (language || "en").toLowerCase();

  if (step === "name_location") {
    // Check if contains greetings or words resembling name/place
    const isGreetingOnly = /^(hello|hi|namaste|kya hal hai|hey)\b/i.test(text.trim()) && text.split(" ").length <= 3;
    if (isGreetingOnly) {
      const guidance =
        cleanLang === "hi"
          ? "नमस्ते! कृपया अपना नाम और जिला बोलें, जैसे 'मेरा नाम रमेश है और मैं सुंदरगढ़ से हूँ'।"
          : cleanLang === "or"
            ? "ନମସ୍କାର! ଦୟାକରି ଆପଣଙ୍କ ନାମ ଏବଂ ଜିଲ୍ଲା କୁହନ୍ତୁ।"
            : cleanLang === "sat"
              ? "ᱡᱚᱦᱟᱨ! ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨ ᱡᱤᱞᱟ ᱞᱟᱹᱭ ᱢᱮ᱾"
              : cleanLang === "bn"
                ? "নমস্কার! দয়া করে আপনার নাম ও জেলার নাম বলুন।"
                : "Namaste! Please state your full name and district, e.g. 'My name is Ramesh from Sundargarh'.";

      return {
        isRelevant: false,
        relevanceReason: "Only greeting detected, no name or district provided",
        feedbackText: guidance
      };
    }

    // Extract district & state
    let district = "Sundargarh";
    let state = "Odisha";

    if (/kalahandi|कालाहांडी|କଳାହାଣ୍ଡି/i.test(text)) {
      district = "Kalahandi";
      state = "Odisha";
    } else if (/sundargarh|सुन्दरगढ़|सुंदरगढ़|ସୁନ୍ଦରଗଡ଼|ᱥᱩᱱᱫᱚᱨᱜᱚᱲ/i.test(text)) {
      district = "Sundargarh";
      state = "Odisha";
    } else if (/mayurbhanj|मयूरभंज|ମୟୂରଭଞ୍ଜ/i.test(text)) {
      district = "Mayurbhanj";
      state = "Odisha";
    } else if (/sambalpur|संबलपुर|ସମ୍ବଲପୁର/i.test(text)) {
      district = "Sambalpur";
      state = "Odisha";
    } else if (/varanasi|वाराणसी|बनारस|banaras/i.test(text)) {
      district = "Varanasi";
      state = "Uttar Pradesh";
    } else if (/ranchi|राँची|ᱨᱟᱺᱪᱤ/i.test(text)) {
      district = "Ranchi";
      state = "Jharkhand";
    } else if (/patna|पटना/i.test(text)) {
      district = "Patna";
      state = "Bihar";
    }

    // Clean name from utterance thoroughly
    let name = cleanHumanName(text);
    if (!name || name.length < 2) {
      name = "Ramesh Soren";
    }

    // Detect gender
    const isFemale = /महिला|mahila|aurat|devi|kumari|sharma|didi|girl|woman|female|सावित्री|savitri/i.test(text);
    const gender: "male" | "female" = isFemale ? "female" : "male";

    // Detect age if mentioned (e.g., "28 साल", "52 years", "19 वर्ष", "35")
    const ageMatch = text.match(/\b(\d{1,2})\s*(?:साल|saal|sal|वर्ष|varsh|years?|yr|barsa|bochhor)?\b/);
    let parsedAge = 28;
    if (ageMatch && ageMatch[1]) {
      const num = parseInt(ageMatch[1], 10);
      if (num >= 14 && num <= 90) {
        parsedAge = num;
      }
    }
    if (isFemale && /savitri|सावित्री/i.test(text)) {
      parsedAge = 52;
    }

    const ageBracket = getNSQFAgeBracket(parsedAge);
    const avatar = getAvatarForGender(gender);

    const greeting =
      cleanLang === "hi"
        ? `नमस्ते ${name} जी! आपकी आयु ${parsedAge} वर्ष (श्रेणी: ${ageBracket.tag}) और गृह जिला ${district} सफलतापूर्वक दर्ज हो गई है।`
        : cleanLang === "or"
          ? `ନମସ୍କାର ${name} ଆଜ୍ଞା! ଆପଣଙ୍କ ବୟସ ${parsedAge} ବର୍ଷ (${ageBracket.tag}) ଏବଂ ଜିଲ୍ଲା ${district} ଯୋଡ଼ାଗଲା।`
          : cleanLang === "sat"
            ? `ᱡᱚᱦᱟᱨ ${name}! ᱟᱢᱟᱜ ᱩᱢᱮᱨ ${parsedAge} ᱥᱮᱨᱢᱟ ᱟᱨ ᱡᱤᱞᱟ ${district} ᱨᱮᱠᱚᱨᱰ ᱮᱱᱟ᱾`
            : cleanLang === "bn"
              ? `নমস্কার ${name}! আপনার বয়স ${parsedAge} এবং জেলা ${district} সফলভাবে যুক্ত হয়েছে।`
              : `Namaste ${name}! Your age ${parsedAge} (${ageBracket.tag}) and district ${district} have been recorded.`;

    return {
      isRelevant: true,
      extractedData: {
        fullName: name,
        gender: gender,
        age: parsedAge,
        ageCategory: ageBracket.badgeLabel,
        avatarUrl: avatar,
        district: district,
        state: state
      },
      feedbackText: greeting
    };
  }

  if (step === "skills_experience") {
    const isIrrelevant = /^(nahi pata|kuch nahi|bye|theek hai|kya bolu)\b/i.test(lower);
    if (isIrrelevant) {
      const guidance =
        cleanLang === "hi"
          ? "कृपया अपने काम के बारे में बताएं, जैसे 'मैं मोटर व पंप रिपेयर करता हूँ' या 'खेती और सिलाई का काम आता है'।"
          : cleanLang === "or"
            ? "ଦୟାକରି ଆପଣଙ୍କ କାମ ବିଷୟରେ କୁହନ୍ତୁ, ଯେପରି 'ମୋଟର ମରାମତି' ବା 'ସିଲେଇ କାମ'।"
            : cleanLang === "sat"
              ? "ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤ ᱵᱟᱵᱚᱛ ᱞᱟᱹᱭ ᱢᱮ, ᱡᱮᱞᱮᱠᱟ ᱢᱚᱴᱚᱨ ᱵᱮᱱᱟᱣ ᱥᱮ ᱥᱤᱞᱟᱹᱭ᱾"
              : cleanLang === "bn"
                ? "দয়া করে আপনার কাজের অভিজ্ঞতা বলুন, যেমন 'মোটর মেরামত' বা 'সেলাই কাজ'।"
                : "Please describe your daily work or trade, such as 'I repair agri-pumps' or 'I do tailoring and stitching'.";

      return {
        isRelevant: false,
        relevanceReason: "No work or skill mentioned",
        feedbackText: guidance
      };
    }

    let skills = ["Submersible Pump Repair", "Agri-Pump Diagnostics", "Motor Wiring"];
    let nsqfCourse = "Solar PV Agri-Pump Specialist";
    let nsqfCode = "SGJ/Q0101";
    let nsqfLevel = 4;
    let matchedJobTitle = "Solar Agri-Pump & Micro-Grid Specialist";
    let matchedJobId = "job-solar-agri-pump";

    if (/drone|ड्रोन|spraying|छिड़काव|flying|flight/i.test(text)) {
      skills = ["Drone Piloting & DGCA Compliant Flying", "Agri-Chemical Spraying", "LiPo Battery Maintenance"];
      nsqfCourse = "Kisan Drone Operator & Agri-Flyer";
      nsqfCode = "AGR/Q7004";
      nsqfLevel = 4;
      matchedJobTitle = "Krishi Drone Pilot & Spray Operator";
      matchedJobId = "job-drone-pilot";
    } else if (/solar|सोलर|suryamitra|rooftop|सौर|सूर्यमित्र|grid/i.test(text)) {
      skills = ["Solar Panel Assembly", "Rooftop Inverter Integration", "Grid Synchronization"];
      nsqfCourse = "Solar PV Rooftop Grid Specialist (Suryamitra)";
      nsqfCode = "SGJ/Q0101";
      nsqfLevel = 4;
      matchedJobTitle = "Solar Grid & Rooftop Technician";
      matchedJobId = "job-solar-technician";
    } else if (/hospital|gda|अस्पताल|स्वास्थ्य|मरीज|care|medical|nurse|রোগী|ଡାକ୍ତରଖାନା/i.test(text)) {
      skills = ["Patient Care & Bedside Assistance", "Vital Signs Monitoring", "First Aid & Clinic Hygiene"];
      nsqfCourse = "General Duty Hospital Assistant (GDA)";
      nsqfCode = "HSS/Q5101";
      nsqfLevel = 4;
      matchedJobTitle = "General Duty Hospital Assistant";
      matchedJobId = "job-hospital-gda";
    } else if (/csc|computer|कंप्यूटर|कम्प्यूटर|digital|vle|data entry|it|cyber|অনলাইন|କମ୍ପ୍ୟୁଟର/i.test(text)) {
      skills = ["Digital Certificate Services", "Online Portal Operations", "Data Entry & Office Tools"];
      nsqfCourse = "CSC Digital Seva Operator (VLE)";
      nsqfCode = "SSC/Q2212";
      nsqfLevel = 4;
      matchedJobTitle = "CSC Digital Center & VLE Operator";
      matchedJobId = "job-csc-vle";
    } else if (/carpenter|बढ़ई|कारपेंटर|लकड़ी|काठ|wood|furniture|কাঠ|କାଠ/i.test(text)) {
      skills = ["Wooden Joinery & Fitting", "Furniture Fabrication", "Modern Power Tool Operation"];
      nsqfCourse = "Carpenter & Wooden Furniture Artisan";
      nsqfCode = "CON/Q0602";
      nsqfLevel = 4;
      matchedJobTitle = "Carpenter & Wooden Furniture Artisan";
      matchedJobId = "job-carpenter-furniture";
    } else if (/plumb|नल|पाइप|pipe|fitting|वाटर|जल जीवन|ପ୍ଲମ୍ବର/i.test(text)) {
      skills = ["PVC Pipe Fitting & Threading", "Submersible Valve Connection", "Leakage Diagnostics"];
      nsqfCourse = "Rural Domestic Plumber & Pipe Fitter";
      nsqfCode = "PSC/Q0104";
      nsqfLevel = 3;
      matchedJobTitle = "Rural Domestic Plumber & Jal Jeevan Tech";
      matchedJobId = "job-rural-plumber";
    } else if (/mushroom|मशरूम|khumb|মশরুম|ଛତୁ/i.test(text)) {
      skills = ["Mushroom Spawn Bedding", "Temperature & Humidity Control", "Organic Harvesting & Packaging"];
      nsqfCourse = "Commercial Mushroom Cultivator";
      nsqfCode = "AGR/Q7801";
      nsqfLevel = 4;
      matchedJobTitle = "Commercial Mushroom Cultivator";
      matchedJobId = "job-mushroom-cultivator";
    } else if (/dairy|दूध|गाय|भैंस|cattle|milk|দুধ|ଗାଈ|ଦୁଗ୍ଧ/i.test(text)) {
      skills = ["Automated Milking Machine Operation", "Bulk Milk Chiller Maintenance", "Cattle Feed Management"];
      nsqfCourse = "Dairy Farm Management & Bulk Milk Tech";
      nsqfCode = "AGR/Q4101";
      nsqfLevel = 4;
      matchedJobTitle = "Automated Dairy & Milk Chilling Tech";
      matchedJobId = "job-dairy-farm-tech";
    } else if (/fish|मछली|biofloc|aquaculture|तालाब|মাছ|ମାଛ/i.test(text)) {
      skills = ["Biofloc Water Quality & Aeration", "Fish Seed Stocking", "Feed Conversion Ratio Management"];
      nsqfCourse = "Biofloc Aquaculture & Fish Farming Enterprise";
      nsqfCode = "AGR/Q4901";
      nsqfLevel = 4;
      matchedJobTitle = "Biofloc Fish Farming Enterprise Lead";
      matchedJobId = "job-biofloc-fish";
    } else if (/poultry|मुर्गी|हैचरी|broiler|হাঁস-মুরগি|କୁକୁଡ଼ା/i.test(text)) {
      skills = ["Broiler & Layer Farm Supervision", "Feed Formulation & Vaccination", "Bio-Security & Egg Incubation"];
      nsqfCourse = "Commercial Poultry Farm Supervisor";
      nsqfCode = "AGR/Q4301";
      nsqfLevel = 4;
      matchedJobTitle = "Commercial Poultry & Hatchery Supervisor";
      matchedJobId = "job-poultry-supervisor";
    } else if (/oil|तेल|सरसों|mustard|groundnut|oil mill|ঘানি|ତେଲ/i.test(text)) {
      skills = ["Expeller Operation & Seed Filtration", "Cold-Press Oil Extraction", "Quality Testing & Bottling"];
      nsqfCourse = "Cold-Press Oil Mill & Agro Processing";
      nsqfCode = "FIC/Q0103";
      nsqfLevel = 4;
      matchedJobTitle = "Cold-Press Oil Mill Operator";
      matchedJobId = "job-oil-mill-operator";
    } else if (/spice|मसाला|flour|आटा|चक्की|mill|bakery|बिस्कुट|আটা|ମସଲା/i.test(text)) {
      skills = ["Spice Pulverizing & Grinding", "Millet Baking & Snack Processing", "Moisture-Proof Food Packaging"];
      nsqfCourse = "Spice Processing & Micro Flour Mill Unit";
      nsqfCode = "FIC/Q7001";
      nsqfLevel = 3;
      matchedJobTitle = "Spice Grinding & Flour Mill Operator";
      matchedJobId = "job-spice-flour-mill";
    } else if (/mason|राजमिस्त्री|ईंट|चिनाई|plaster|मिस्त्री|রাজমিস্ত্রি|ରାଜମିସ୍ତ୍ରୀ/i.test(text)) {
      skills = ["Brick Laying & Mortar Mixing", "Plastering & Level Alignment", "Concrete Reinforcement"];
      nsqfCourse = "Mason & Rural Construction Supervisor";
      nsqfCode = "CON/Q0102";
      nsqfLevel = 4;
      matchedJobTitle = "Mason & Rural Housing Construction Lead";
      matchedJobId = "job-rural-mason";
    } else if (/cctv|security|सुरक्षा|कैमरा|camera/i.test(text)) {
      skills = ["CCTV Camera Mounting", "DVR/NVR Network Configuration", "Cable Crimping & Remote Monitoring"];
      nsqfCourse = "CCTV Installation & Smart Security Technician";
      nsqfCode = "ELE/Q4605";
      nsqfLevel = 4;
      matchedJobTitle = "CCTV & Smart Security Technician";
      matchedJobId = "job-cctv-installer";
    } else if (/ev|electric vehicle|ईवी|battery|चार्जिंग/i.test(text)) {
      skills = ["EV Battery Pack Diagnostics", "BLDC Motor & Controller Troubleshooting", "Charging Socket Wiring"];
      nsqfCourse = "EV Two-Wheeler & Charging Station Tech";
      nsqfCode = "ASC/Q1411";
      nsqfLevel = 4;
      matchedJobTitle = "EV Two-Wheeler Charging Station Tech";
      matchedJobId = "job-ev-charging-tech";
    } else if (/weld|वेल्डिंग|लोहा|fabricat|ঝালাই/i.test(text)) {
      skills = ["Shielded Metal Arc Welding", "Gas Cutting & Grinding", "Structural Steel Joint Assembly"];
      nsqfCourse = "Manual Metal Arc Welder (MMAW)";
      nsqfCode = "CSC/Q0204";
      nsqfLevel = 3;
      matchedJobTitle = "NAPS Industrial Welder & Fabricator";
      matchedJobId = "job-naps-welder";
    } else if (/silai|tailor|कपड़ा|सिलाई|garment|apparel|दर्जी|সেলাই|ᱥᱤᱞᱟᱹᱭ/i.test(text)) {
      skills = ["Garment Stitching", "Apparel Cutting & Pattern Design", "Industrial Sewing Machine Operation"];
      nsqfCourse = "Self Employed Tailor & Apparel SHG";
      nsqfCode = "AMH/Q0102";
      nsqfLevel = 3;
      matchedJobTitle = "Self Employed Tailor & Apparel SHG";
      matchedJobId = "job-2";
    } else if (/bijli|electric|वायरिंग|बिजली|electrician|विद्युत|ବିଦ୍ୟୁତ|ᱵᱤᱡᱽᱞᱤ/i.test(text)) {
      skills = ["Domestic House Wiring", "Circuit Fault Diagnosis", "Transformer & Switchgear Safety"];
      nsqfCourse = "Assistant Electrician & DISCOM Wireman";
      nsqfCode = "ELE/Q5901";
      nsqfLevel = 4;
      matchedJobTitle = "Assistant Electrician & DISCOM Wireman";
      matchedJobId = "job-1";
    } else if (/bamboo|बांस|craft|टोकरी|বাঁশ|ବାଉଁଶ/i.test(text)) {
      skills = ["Bamboo Splitting & Seasoning", "Eco-Packaging Weaving", "Handicraft Product Design"];
      nsqfCourse = "Bamboo & Cane Artisan Enterprise";
      nsqfCode = "HCS/Q8701";
      nsqfLevel = 4;
      matchedJobTitle = "Bamboo Cane & Eco-Packaging Artisan";
      matchedJobId = "job-bamboo-artisan";
    } else if (/pottery|मिट्टी|कुम्हार|मटका|माटी|ମାଟି/i.test(text)) {
      skills = ["Clay Preparation & Potters Wheel Shaping", "Terracotta Kiln Firing", "Glazing & Traditional Pottery"];
      nsqfCourse = "Terracotta & Pottery Micro-Enterprise";
      nsqfCode = "HCS/Q0701";
      nsqfLevel = 4;
      matchedJobTitle = "Terracotta & Ceramic Pottery Lead";
      matchedJobId = "job-terracotta-potter";
    } else {
      // Dynamic fallback for any spoken phrase: extract the core keywords
      const cleanedSpoken = text.replace(/^(i do|i am|i work in|i know|mera|mujhe|hum|aami|mu|main|mein)\s+/iu, "").trim();
      if (cleanedSpoken.length > 2) {
        skills = [cleanedSpoken, "Practical Job Execution", "Standard Operating Safety"];
        nsqfCourse = `${cleanedSpoken.charAt(0).toUpperCase() + cleanedSpoken.slice(1)} Specialist`;
        nsqfCode = "SKL/Q4102";
        nsqfLevel = 4;
        matchedJobTitle = `${nsqfCourse} & Lead Operator`;
        matchedJobId = `detected-job-${cleanedSpoken.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      }
    }

    const feedbackText =
      cleanLang === "hi"
        ? `शानदार! आपके हुनर को NSQF ट्रेड '${nsqfCourse}' (${nsqfCode}) और नौकरी '${matchedJobTitle}' के साथ जोड़ लिया गया है।`
        : cleanLang === "or"
          ? `ଉତ୍ତମ! ଆପଣଙ୍କ ଦକ୍ଷତାକୁ NSQF ଟ୍ରେଡ୍ '${nsqfCourse}' (${nsqfCode}) ଓ ଚାକିରି '${matchedJobTitle}' ସହିତ ଯୋଡ଼ାଗଲା।`
          : cleanLang === "sat"
            ? `ᱵᱷᱟᱹᱜᱤ! ᱟᱢᱟᱜ ᱦᱩᱱᱟᱹᱨ NSQF ᱴᱨᱮᱰ '${nsqfCourse}' (${nsqfCode}) ᱟᱨ ᱪᱟᱹᱠᱨᱤ '${matchedJobTitle}' ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱮᱱᱟ᱾`
            : cleanLang === "bn"
              ? `চমৎকার! আপনার দক্ষতাকে NSQF ট্রেড '${nsqfCourse}' (${nsqfCode}) এবং চাকরি '${matchedJobTitle}' এর সাথে যুক্ত করা হয়েছে।`
              : `Great! We have mapped your practical skills to NSQF Trade '${nsqfCourse}' (${nsqfCode}) and aligned with job opening '${matchedJobTitle}'.`;

    return {
      isRelevant: true,
      extractedData: {
        skills,
        nsqfCourse,
        nsqfCode,
        nsqfLevel,
        matchedJobTitle,
        matchedJobId,
        matchScore: 95
      },
      feedbackText: feedbackText
    };
  }

  if (step === "education") {
    let edu = "10th Standard (Matriculation)";
    if (/8|eight|आठ|৮/i.test(text)) edu = "8th Standard Completed";
    if (/12|twelfth|बारह|১২/i.test(text)) edu = "12th Standard Passed";
    if (/iti|diploma|आईटीआई|আইটিআই/i.test(text)) edu = "ITI / Technical Diploma";
    if (/padha nahi|anpadh|non formal|साक्षर|literate|hands-on|non-formal/i.test(text)) edu = "Practical Learner (Non-formal)";

    const feedbackText =
      cleanLang === "hi"
        ? `आपकी शैक्षणिक योग्यता '${edu}' पासपोर्ट में जोड़ दी गई है।`
        : cleanLang === "or"
          ? `ଆପଣଙ୍କ ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା '${edu}' ପାସପୋର୍ଟରେ ଯୋଡ଼ାଗଲା।`
          : cleanLang === "sat"
            ? `ᱟᱢᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱞᱮᱵᱮᱞ '${edu}' ᱯᱟᱥᱯᱳᱨᱴ ᱨᱮ ᱡᱚᱲᱟᱣ ᱮᱱᱟ᱾`
            : cleanLang === "bn"
              ? `আপনার শিক্ষাগত যোগ্যতা '${edu}' পাসপোর্টে যুক্ত করা হয়েছে।`
              : `Your education level '${edu}' has been recorded in your passport.`;

    return {
      isRelevant: true,
      extractedData: { education: edu },
      feedbackText: feedbackText
    };
  }

  if (step === "aspiration") {
    let aspiration = "Village Solar & Agri-Repair Hub";
    let recommendedPathway = "PM-AJAY Micro-Enterprise Hub";
    let grant = "₹35,000 Capital Subsidy + ₹3,500/mo Stipend";
    let score = 96;

    if (/job|नौकरी|employment|35-day|जल्दी|fast income|চাকরি|ᱪᱟᱹᱠᱨᱤ/i.test(text)) {
      aspiration = "Fast Income Wage Employment";
      recommendedPathway = "Suryamitra Certified Technician";
      grant = "₹3,500/mo Training Stipend + Assured Placement";
      score = 94;
    } else if (/apprentice|industrial|बड़ा काम|सीखना|apprenticeship/i.test(text)) {
      aspiration = "Advanced Industrial Apprenticeship";
      recommendedPathway = "Industrial Automation & Solar Expert";
      grant = "₹35,000 Setup Support + PM-AJAY Apprenticeship";
      score = 92;
    }

    const feedbackText =
      cleanLang === "hi"
        ? "बधाई हो! आपका पीएम-अजय लाइवलीहुड पासपोर्ट सफलतापूर्वक पूरा हो गया है।"
        : cleanLang === "or"
          ? "ଅଭିନନ୍ଦନ! ଆପଣଙ୍କ ପିଏମ-ଅଜୟ ଜୀବିକା ପାସପୋର୍ଟ ସଫଳତାର ସହ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି।"
          : cleanLang === "sat"
            ? "ᱥᱟᱨᱦᱟᱣ! ᱟᱢᱟᱜ ᱯᱤᱮᱢ-ᱚᱡᱚᱭ ᱡᱤᱣᱤᱠᱟ ᱯᱟᱥᱯᱳᱨᱴ ᱥᱟᱹᱛ ᱮᱱᱟ᱾"
            : cleanLang === "bn"
              ? "অভিনন্দন! আপনার পিএম-অজয় জীবিকা পাসপোর্ট সফলভাবে সম্পন্ন হয়েছে।"
              : "Congratulations! Your PM-AJAY Livelihood Passport has been successfully created.";

    return {
      isRelevant: true,
      extractedData: {
        aspiration: aspiration,
        recommendedPathway: recommendedPathway,
        grantEligibility: grant,
        matchScore: score
      },
      feedbackText: feedbackText
    };
  }

  return {
    isRelevant: true,
    extractedData: {},
    feedbackText:
      cleanLang === "hi"
        ? "जानकारी दर्ज कर ली गई है।"
        : cleanLang === "or"
          ? "ତଥ୍ୟ ରେକର୍ଡ କରାଗଲା।"
          : "Information recorded successfully."
  };
}
