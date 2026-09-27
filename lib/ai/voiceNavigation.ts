"use client";

import { RECOMMENDED_COURSES, RECOMMENDED_JOBS, SCHEMES_LIST, CourseItem, JobItem } from "@/components/dashboard/DashboardShared";

export type VoiceNavTarget =
  | "home"
  | "dashboard"
  | "recommendations"
  | "training"
  | "jobs"
  | "schemes"
  | "self_employment"
  | "profile"
  | "progress"
  | "centers"
  | "messages"
  | "role_beneficiary"
  | "role_field_worker"
  | "role_government"
  | "onboarding"
  | "login"
  | "logout"
  | "set_language";

export interface VoiceNavIntent {
  target: VoiceNavTarget;
  courseId?: string;
  course?: CourseItem;
  jobId?: string;
  job?: JobItem;
  schemeId?: string;
  languageCode?: string;
  languageName?: string;
  confidence: number;
  displayText: string;
  spokenFeedback: {
    hi: string;
    or: string;
    sat: string;
    en: string;
    [key: string]: string;
  };
}

/**
 * Clean & normalize text for Indic phonetic comparison
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'।]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fast client-side multilingual phonetic & keyword intent classifier for Instant Voice Navigation
 */
export function parseVoiceNavigationIntent(
  rawTranscript: string,
  currentLanguage: string = "hi"
): VoiceNavIntent | null {
  if (!rawTranscript || !rawTranscript.trim()) return null;

  const t = normalizeText(rawTranscript);

  // 1. Language Change Intents
  // Odia
  if (
    t.includes("odia") ||
    t.includes("oriya") ||
    t.includes("ଓଡ଼ିଆ") ||
    t.includes("ओड़िया") ||
    t.includes("ओडिया") ||
    t.includes("odia re katha") ||
    t.includes("odia bhasha") ||
    t.includes("speak odia")
  ) {
    return {
      target: "set_language",
      languageCode: "or",
      languageName: "ଓଡ଼ିଆ (Odia)",
      confidence: 0.98,
      displayText: "ଭାଷା ବଦଳାନ୍ତୁ: ଓଡ଼ିଆ",
      spokenFeedback: {
        hi: "भाषा ओड़िया में बदल दी गई है।",
        or: "ଭାଷା ଓଡ଼ିଆରେ ପରିବର୍ତ୍ତନ କରାଗଲା।",
        sat: "ᱯᱟᱹᱨᱥᱤ ᱳᱰᱤᱭᱟ ᱨᱮ ᱵᱚᱫᱚᱞ ᱮᱱᱟ।",
        en: "Language switched to Odia."
      }
    };
  }

  // Hindi
  if (
    t.includes("hindi") ||
    t.includes("हिन्दी") ||
    t.includes("हिंदी") ||
    t.includes("hindi bhasha") ||
    t.includes("speak hindi")
  ) {
    return {
      target: "set_language",
      languageCode: "hi",
      languageName: "हिन्दी (Hindi)",
      confidence: 0.98,
      displayText: "भाषा बदलें: हिन्दी",
      spokenFeedback: {
        hi: "भाषा हिन्दी में बदल दी गई है।",
        or: "ଭାଷା ହିନ୍ଦୀରେ ପରିବର୍ତ୍ତନ କରାଗଲା।",
        sat: "ᱯᱟᱹᱨᱥᱤ ᱦᱤᱱᱫᱤ ᱨᱮ ᱵᱚᱫᱚᱞ ᱮᱱᱟ।",
        en: "Language switched to Hindi."
      }
    };
  }

  // Santhali
  if (
    t.includes("santhali") ||
    t.includes("santali") ||
    t.includes("संताली") ||
    t.includes("ᱥᱟᱱᱛᱟᱲᱤ") ||
    t.includes("ol chiki")
  ) {
    return {
      target: "set_language",
      languageCode: "sat",
      languageName: "संताली (Santhali)",
      confidence: 0.98,
      displayText: "भाषा बदलें: संताली (ᱥᱟᱱᱛᱟᱲᱤ)",
      spokenFeedback: {
        hi: "भाषा संताली में बदल दी गई है।",
        or: "ଭାଷା ସାନ୍ତାଳୀରେ ପରିବର୍ତ୍ତନ କରାଗଲା।",
        sat: "ᱯᱟᱹᱨᱥᱤ ᱥᱟᱱᱛᱟᱲᱤ ᱨᱮ ᱵᱚᱫᱚᱞ ᱮᱱᱟ।",
        en: "Language switched to Santhali."
      }
    };
  }

  // English
  if (
    t.includes("english") ||
    t.includes("अंग्रेजी") ||
    t.includes("इंग्लिश") ||
    t.includes("ଇଂରାଜୀ") ||
    t.includes("speak english")
  ) {
    return {
      target: "set_language",
      languageCode: "en",
      languageName: "English",
      confidence: 0.98,
      displayText: "Switch Language: English",
      spokenFeedback: {
        hi: "भाषा अंग्रेजी में बदल दी गई है।",
        or: "ଭାଷା ଇଂରାଜୀରେ ପରିବର୍ତ୍ତନ କରାଗଲା।",
        sat: "ᱯᱟᱹᱨᱥᱤ ᱤᱝᱨᱟᱹᱡᱤ ᱨᱮ ᱵᱚᱫᱚᱞ ᱮᱱᱟ।",
        en: "Language switched to English."
      }
    };
  }

  // 2. Role / Mode Switching
  // Field Worker Mode
  if (
    t.includes("field worker") ||
    t.includes("fieldworker") ||
    t.includes("सर्वेक्षक") ||
    t.includes("फील्ड वर्कर") ||
    t.includes("सफ़ेद") ||
    t.includes("ସର୍ଭେ") ||
    t.includes("ଫିଲ୍ଡ ୱାର୍କର") ||
    t.includes("surveyor")
  ) {
    return {
      target: "role_field_worker",
      confidence: 0.96,
      displayText: "फील्ड वर्कर कोपायलट मोड",
      spokenFeedback: {
        hi: "फील्ड वर्कर कोपायलट मोड खोला जा रहा है।",
        or: "ଫିଲ୍ଡ ୱାର୍କର କୋପାଇଲଟ୍ ମୋଡ୍ ଖୋଲାଯାଉଛି।",
        sat: "ᱯᱷᱤᱞᱰ ᱣᱟᱨᱠᱟᱨ ᱢᱳᱰ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Field Worker Copilot Mode."
      }
    };
  }

  // Government Dashboard Mode
  if (
    t.includes("government") ||
    t.includes("district admin") ||
    t.includes("officer") ||
    t.includes("सरकार") ||
    t.includes("सरकारी डैशबोर्ड") ||
    t.includes("अधिकारी") ||
    t.includes("ପ୍ରଶାସନ") ||
    t.includes("ସରକାରୀ ଡ୍ୟାସବୋର୍ଡ") ||
    t.includes("govt dashboard")
  ) {
    return {
      target: "role_government",
      confidence: 0.96,
      displayText: "सरकारी / जिला डैशबोर्ड",
      spokenFeedback: {
        hi: "सरकारी जिला डैशबोर्ड खोला जा रहा है।",
        or: "ସରକାରୀ ଜିଲ୍ଲା ଡ୍ୟାସବୋର୍ଡ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱚᱨᱠᱟᱨᱤ ᱰᱮᱥᱵᱳᱨᱰ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Government District Dashboard."
      }
    };
  }

  // Beneficiary Experience Mode
  if (
    t.includes("beneficiary") ||
    t.includes("लाभार्थी") ||
    t.includes("बेनेफिशियरी") ||
    t.includes("ହିତାଧିକାରୀ") ||
    t.includes("savitri") ||
    t.includes("सावित्री")
  ) {
    return {
      target: "role_beneficiary",
      confidence: 0.96,
      displayText: "लाभार्थी डैशबोर्ड",
      spokenFeedback: {
        hi: "सावित्री देवी लाभार्थी डैशबोर्ड खोला जा रहा है।",
        or: "ସାବିତ୍ରୀ ଦେବୀ ହିତାଧିକାରୀ ଡ୍ୟାସବୋର୍ଡ ଖୋଲାଯାଉଛି।",
        sat: "ᱞᱟᱵᱷᱟᱨᱛᱷᱤ ᱰᱮᱥᱵᱳᱨᱰ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Beneficiary Livelihood Dashboard."
      }
    };
  }

  // Logout / Login / Onboarding
  if (
    t.includes("logout") ||
    t.includes("log out") ||
    t.includes("sign out") ||
    t.includes("लॉगआउट") ||
    t.includes("लॉग आउट") ||
    t.includes("बाहर") ||
    t.includes("ଲଗଆଉଟ")
  ) {
    return {
      target: "logout",
      confidence: 0.95,
      displayText: "लॉगआउट (Logout)",
      spokenFeedback: {
        hi: "सत्र समाप्त कर लॉगिन पेज पर जाया जा रहा है।",
        or: "ଲଗଆଉଟ୍ କରି ଲଗଇନ୍ ପୃଷ୍ଠାକୁ ଯାଉଛି।",
        sat: "ᱞᱚᱜᱽᱟᱣᱩᱴ ᱠᱟᱛᱮ ᱞᱚᱜᱤᱱ ᱥᱟᱦᱴᱟ ᱨᱮ ᱥᱮᱱᱚᱜ ᱠᱟᱱᱟ।",
        en: "Logging out and navigating to login page."
      }
    };
  }

  if (
    t.includes("onboarding") ||
    t.includes("walkthrough") ||
    t.includes("शुरुआत") ||
    t.includes("परिचय") ||
    t.includes("ଆରମ୍ଭ")
  ) {
    return {
      target: "onboarding",
      confidence: 0.92,
      displayText: "परिचय / ऑनबोर्डिंग (Onboarding)",
      spokenFeedback: {
        hi: "ऑनबोर्डिंग परिचय स्क्रीन खोली जा रही है।",
        or: "ଅନବୋର୍ଡିଂ ପରିଚୟ ସ୍କ୍ରିନ୍ ଖୋଲାଯାଉଛି।",
        sat: "ᱚᱱᱵᱳᱨᱰᱤᱝ ᱥᱠᱨᱤᱱ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Onboarding Walkthrough."
      }
    };
  }

  // 3. Specific Course Requests
  // Course 1: Electrician
  if (
    t.includes("electrician") ||
    t.includes("electrical") ||
    t.includes("wiring") ||
    t.includes("bijli") ||
    t.includes("ଇଲେକ୍ଟ୍ରିସିଆନ୍") ||
    t.includes("ବିଜୁଳି") ||
    t.includes("इलेक्ट्रीशियन") ||
    t.includes("बिजली") ||
    t.includes("बिजली मिस्त्री")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-1") || RECOMMENDED_COURSES[0];
    return {
      target: "training",
      courseId: "course-1",
      course: course,
      confidence: 0.98,
      displayText: "इलेक्ट्रीशियन कोर्स (NSQF Level 4)",
      spokenFeedback: {
        hi: "इलेक्ट्रीशियन NSQF Level 4 कोर्स का विवरण खोला जा रहा है।",
        or: "ଇଲେକ୍ଟ୍ରିସିଆନ୍ NSQF ଲେଭଲ ୪ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱤᱞᱮᱠᱴᱨᱤᱥᱤᱭᱟᱱ NSQF Level 4 ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Electrician NSQF Level 4 Course."
      }
    };
  }

  // Course 2: Tailoring / Sewing
  if (
    t.includes("tailor") ||
    t.includes("tailoring") ||
    t.includes("silai") ||
    t.includes("sewing") ||
    t.includes("kapda") ||
    t.includes("dress") ||
    t.includes("apparel") ||
    t.includes("ସିଲେଇ") ||
    t.includes("ଲୁଗା") ||
    t.includes("सिलाई") ||
    t.includes("दर्जी") ||
    t.includes("कपड़े")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-2") || RECOMMENDED_COURSES[1];
    return {
      target: "training",
      courseId: "course-2",
      course: course,
      confidence: 0.98,
      displayText: "सिलाई एवं परिधान (Tailoring)",
      spokenFeedback: {
        hi: "सिलाई एवं परिधान NSQF Level 3 कोर्स का विवरण खोला जा रहा है।",
        or: "ସିଲେଇ ଓ ପରିଧାନ NSQF ଲେଭଲ ୩ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱤᱞᱟᱹᱭ NSQF Level 3 ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Tailoring & Apparel Training Course."
      }
    };
  }

  // Course 3: Food Processing
  if (
    t.includes("food processing") ||
    t.includes("food") ||
    t.includes("achar") ||
    t.includes("papad") ||
    t.includes("preservation") ||
    t.includes("खाद्य प्रसंस्करण") ||
    t.includes("खाद्य") ||
    t.includes("आचार") ||
    t.includes("ଖାଦ୍ୟ") ||
    t.includes("ଖାଦ୍ୟ ପ୍ରକ୍ରିୟାକରଣ")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-3") || RECOMMENDED_COURSES[2];
    return {
      target: "training",
      courseId: "course-3",
      course: course,
      confidence: 0.98,
      displayText: "खाद्य प्रसंस्करण (Food Processing)",
      spokenFeedback: {
        hi: "खाद्य प्रसंस्करण NSQF Level 4 कोर्स का विवरण खोला जा रहा है।",
        or: "ଖାଦ୍ୟ ପ୍ରକ୍ରିୟାକରଣ NSQF ଲେଭଲ ୪ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱡᱚᱢᱟᱜ ᱯᱨᱚᱥᱮᱥᱤᱝ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Food Processing Training Course."
      }
    };
  }

  // Course 4: Solar PV Technician
  if (
    t.includes("solar") ||
    t.includes("suryamitra") ||
    t.includes("rooftop") ||
    t.includes("सूर्यमित्र") ||
    t.includes("सोलर") ||
    t.includes("ସୋଲାର") ||
    t.includes("ସୌର")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-4") || RECOMMENDED_COURSES[3];
    return {
      target: "training",
      courseId: "course-4",
      course: course,
      confidence: 0.98,
      displayText: "सोलर पीवी टेक्नीशियन (Suryamitra)",
      spokenFeedback: {
        hi: "सोलर पीवी सूर्यमित्र कोर्स का विवरण खोला जा रहा है।",
        or: "ସୌର ପିଭି ସୂର୍ଯ୍ୟମିତ୍ର କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱳᱞᱟᱨ ᱯᱤᱵᱷᱤ ᱥᱩᱨᱭᱚᱢᱤᱛᱨᱚ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Solar PV Technician Suryamitra Course."
      }
    };
  }

  // Course 5: Healthcare GDA
  if (
    t.includes("hospital") ||
    t.includes("health") ||
    t.includes("nursing") ||
    t.includes("gda") ||
    t.includes("patient") ||
    t.includes("स्वास्थ्य") ||
    t.includes("अस्पताल") ||
    t.includes("ଡାକ୍ତରଖାନା") ||
    t.includes("ସ୍ୱାସ୍ଥ୍ୟ")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-5") || RECOMMENDED_COURSES[4];
    return {
      target: "training",
      courseId: "course-5",
      course: course,
      confidence: 0.98,
      displayText: "हेल्थकेयर असिस्टेंट (GDA)",
      spokenFeedback: {
        hi: "हेल्थकेयर जनरल ड्यूटी असिस्टेंट कोर्स का विवरण खोला जा रहा है।",
        or: "ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱦᱟᱥᱯᱟᱛᱟᱞ ᱜᱚᱲᱚ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Healthcare General Duty Assistant Course."
      }
    };
  }

  // Course 6: Bamboo Handicraft
  if (
    t.includes("bamboo") ||
    t.includes("handicraft") ||
    t.includes("artisan") ||
    t.includes("बांस") ||
    t.includes("हस्तशिल्प") ||
    t.includes("ବାଉଁଶ") ||
    t.includes("ହସ୍ତଶିଳ୍ପ")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-6") || RECOMMENDED_COURSES[5];
    return {
      target: "training",
      courseId: "course-6",
      course: course,
      confidence: 0.98,
      displayText: "बांस एवं हस्तशिल्प (Bamboo Artisan)",
      spokenFeedback: {
        hi: "बांस एवं हस्तशिल्प ट्रेनिंग का विवरण खोला जा रहा है।",
        or: "ବାଉଁଶ ଓ ହସ୍ତଶିଳ୍ପ ତାଲିମ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱢᱟᱫ ᱟᱨ ᱦᱩᱱᱟᱹᱨ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Bamboo Handicraft Artisan Course."
      }
    };
  }

  // Course 7: Mobile Repair
  if (
    t.includes("mobile") ||
    t.includes("smartphone") ||
    t.includes("phone repair") ||
    t.includes("मोबाइल") ||
    t.includes("फोन") ||
    t.includes("ମୋବାଇଲ") ||
    t.includes("ଫୋନ")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-7") || RECOMMENDED_COURSES[6];
    return {
      target: "training",
      courseId: "course-7",
      course: course,
      confidence: 0.98,
      displayText: "मोबाइल रिपेयर एवं डायग्नोस्टिक्स",
      spokenFeedback: {
        hi: "मोबाइल हार्डवेयर रिपेयर कोर्स का विवरण खोला जा रहा है।",
        or: "ମୋବାଇଲ୍ ମରାମତି କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱢᱳᱵᱟᱭᱤᱞ ᱵᱮᱱᱟᱣ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Mobile Hardware & Diagnostics Course."
      }
    };
  }

  // Course 8: Organic Farming
  if (
    t.includes("organic") ||
    t.includes("farming") ||
    t.includes("compost") ||
    t.includes("kheti") ||
    t.includes("krishi") ||
    t.includes("जैविक खेती") ||
    t.includes("कृषि") ||
    t.includes("खाद") ||
    t.includes("ଜୈବିକ କୃଷି") ||
    t.includes("ଚାଷ")
  ) {
    const course = RECOMMENDED_COURSES.find((c) => c.id === "course-8") || RECOMMENDED_COURSES[7];
    return {
      target: "training",
      courseId: "course-8",
      course: course,
      confidence: 0.98,
      displayText: "जैविक खेती एवं वर्मीकम्पोस्ट",
      spokenFeedback: {
        hi: "जैविक खेती एवं वर्मीकम्पोस्ट कोर्स का विवरण खोला जा रहा है।",
        or: "ଜୈବିକ କୃଷି ଓ ଖତ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱡᱮᱣᱤᱠ ᱪᱟᱥ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Organic Farming & Vermicompost Course."
      }
    };
  }

  // 4. Specific Job Requests
  if (
    t.includes("job") ||
    t.includes("jobs") ||
    t.includes("naukri") ||
    t.includes("vacancy") ||
    t.includes("opening") ||
    t.includes("रोजगार") ||
    t.includes("नौकरी") ||
    t.includes("काम चाहिए") ||
    t.includes("ଚାକିରି") ||
    t.includes("ନିଯୁକ୍ତି") ||
    t.includes("କାମ") ||
    t.includes("kami")
  ) {
    // Check if user specifically mentioned a job type
    if (t.includes("electrician") || t.includes("बिजली") || t.includes("ଇଲେକ୍ଟ୍ରିସିଆନ୍")) {
      const job = RECOMMENDED_JOBS.find((j) => j.id === "job-1") || RECOMMENDED_JOBS[0];
      return {
        target: "jobs",
        jobId: "job-1",
        job: job,
        confidence: 0.98,
        displayText: "इलेक्ट्रीशियन नौकरी (₹15,000 - ₹22,000)",
        spokenFeedback: {
          hi: "इलेक्ट्रीशियन टेक्नीशियन नौकरी के अवसर खोले जा रहे हैं।",
          or: "ଇଲେକ୍ଟ୍ରିସିଆନ୍ ଚାକିରି ସୁଯୋଗ ଦେଖାଯାଉଛି।",
          sat: "ᱤᱞᱮᱠᱴᱨᱤᱥᱤᱭᱟᱱ ᱪᱟᱹᱠᱨᱤ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
          en: "Opening Electrician Technician Job Opportunities."
        }
      };
    }
    if (t.includes("tailor") || t.includes("silai") || t.includes("सिलाई") || t.includes("ସିଲେଇ")) {
      const job = RECOMMENDED_JOBS.find((j) => j.id === "job-2") || RECOMMENDED_JOBS[1];
      return {
        target: "jobs",
        jobId: "job-2",
        job: job,
        confidence: 0.98,
        displayText: "सिलाई मशीन ऑपरेटर नौकरी (₹12,000 - ₹18,000)",
        spokenFeedback: {
          hi: "सखी गारमेंट्स सिलाई नौकरी का विवरण खोला जा रहा है।",
          or: "ସିଲେଇ ଚାକିରି ସୁଯୋଗ ଖୋଲାଯାଉଛି।",
          sat: "ᱥᱤᱞᱟᱹᱭ ᱪᱟᱹᱠᱨᱤ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
          en: "Opening Tailor Sewing Operator Job Details."
        }
      };
    }
    if (t.includes("data entry") || t.includes("computer") || t.includes("डेटा") || t.includes("କମ୍ପ୍ୟୁଟର")) {
      const job = RECOMMENDED_JOBS.find((j) => j.id === "job-4") || RECOMMENDED_JOBS[3];
      return {
        target: "jobs",
        jobId: "job-4",
        job: job,
        confidence: 0.98,
        displayText: "डाटा एंट्री ऑपरेटर नौकरी (Block Office)",
        spokenFeedback: {
          hi: "ब्लॉक ऑफिस डाटा एंट्री ऑपरेटर नौकरी खोली जा रही है।",
          or: "ବ୍ଲକ ଡାଟା ଏଣ୍ଟ୍ରି ଚାକିରି ଖୋଲାଯାଉଛି।",
          sat: "ᱰᱟᱴᱟ ᱮᱱᱴᱨᱤ ᱪᱟᱹᱠᱨᱤ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
          en: "Opening Data Entry Operator Vacancies."
        }
      };
    }

    // General Job Opportunities
    return {
      target: "jobs",
      confidence: 0.95,
      displayText: "नौकरी के अवसर (Job Opportunities)",
      spokenFeedback: {
        hi: "आपके जिले में उपलब्ध सभी नौकरियों की सूची दिखाई जा रही है।",
        or: "ଆପଣଙ୍କ ଜିଲ୍ଲାରେ ଉପଲବ୍ଧ ଚାକିରି ତାଲିକା ଦେଖାଯାଉଛି।",
        sat: "ᱟᱢᱟᱜ ᱡᱤᱞᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱪᱟᱹᱠᱨᱤ ᱠᱚ ᱫᱮᱠᱷᱟᱣᱜ ᱠᱟᱱᱟ।",
        en: "Showing verified job vacancies in your area."
      }
    };
  }

  // 5. Training / Courses General
  if (
    t.includes("course") ||
    t.includes("courses") ||
    t.includes("training") ||
    t.includes("skilling") ||
    t.includes("nsqf") ||
    t.includes("कोर्स") ||
    t.includes("ट्रेनिंग") ||
    t.includes("प्रशिक्षण") ||
    t.includes("कौशल") ||
    t.includes("सीखना") ||
    t.includes("କୋର୍ସ") ||
    t.includes("ଟ୍ରେନିଂ") ||
    t.includes("ତାଲିମ") ||
    t.includes("ଶିଖିବା") ||
    t.includes("ᱴᱨᱮᱱᱤᱝ")
  ) {
    return {
      target: "training",
      confidence: 0.96,
      displayText: "स्किल ट्रेनिंग कोर्स (Skill Training)",
      spokenFeedback: {
        hi: "आपके लिए उपलब्ध सभी NSQF ट्रेनिंग कोर्स खोले जा रहे हैं।",
        or: "ଆପଣଙ୍କ ପାଇଁ ସମସ୍ତ NSQF ଟ୍ରେନିଂ କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ NSQF ᱴᱨᱮᱱᱤᱝ ᱠᱳᱨᱥ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening NSQF Skill Training Courses."
      }
    };
  }

  // 6. PM-AJAY Schemes, Grants & Self Employment (₹35,000 / Mudra / Grants)
  if (
    t.includes("scheme") ||
    t.includes("schemes") ||
    t.includes("grant") ||
    t.includes("subsidy") ||
    t.includes("35000") ||
    t.includes("35,000") ||
    t.includes("50000") ||
    t.includes("pmajay") ||
    t.includes("pm ajay") ||
    t.includes("mudra") ||
    t.includes("loan") ||
    t.includes("stipend") ||
    t.includes("self employment") ||
    t.includes("business") ||
    t.includes("योजना") ||
    t.includes("अनुदान") ||
    t.includes("मुद्रा") ||
    t.includes("लोन") ||
    t.includes("स्टाइपेंड") ||
    t.includes("स्वरोजगार") ||
    t.includes("दुकान") ||
    t.includes("योजनाएं") ||
    t.includes("ଯୋଜନା") ||
    t.includes("ଅନୁଦାନ") ||
    t.includes("ଟଙ୍କା") ||
    t.includes("ସ୍ୱରୋଜଗାର") ||
    t.includes("୩୫୦୦୦")
  ) {
    return {
      target: "schemes",
      schemeId: "pm-ajay",
      confidence: 0.98,
      displayText: "पीएम-अजय अनुदान एवं योजनाएं (₹35,000 Grants)",
      spokenFeedback: {
        hi: "पीएम-अजय ₹35,000 अनुदान, मासिक स्टाइपेंड और योजनाओं की सूची खोली जा रही है।",
        or: "ପିଏମ-ଅଜୟ ₹୩୫,୦୦୦ ଅନୁଦାନ ଓ ସରକାରୀ ଯୋଜନା ଖୋଲାଯାଉଛି।",
        sat: "PM-AJAY ₹35,000 ᱟᱱᱩᱫᱟᱱ ᱟᱨ ᱥᱚᱨᱠᱟᱨᱤ ᱡᱳᱡᱚᱱᱟ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening PM-AJAY Grants and Self-Employment Schemes."
      }
    };
  }

  // 7. AI Recommendations Hub
  if (
    t.includes("recommend") ||
    t.includes("recommendation") ||
    t.includes("suggest") ||
    t.includes("for me") ||
    t.includes("सिफारिश") ||
    t.includes("सुझाव") ||
    t.includes("मेरे लिए क्या है") ||
    t.includes("ସୁପାରିଶ") ||
    t.includes("ମୋ ପାଇଁ")
  ) {
    return {
      target: "recommendations",
      confidence: 0.96,
      displayText: "एआई सुझाव (Recommended For You)",
      spokenFeedback: {
        hi: "आपकी प्रोफाइल के अनुसार सर्वश्रेष्ठ सिफारिशें दिखाई जा रही हैं।",
        or: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ ଅନୁଯାୟୀ ସର୍ବୋତ୍ତମ ସୁପାରିଶ ଦେଖାଯାଉଛି।",
        sat: "ᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱱᱟᱢ ᱠᱷᱚᱱ ᱵᱷᱟᱹᱜᱤ ᱥᱩᱡᱷᱟᱹᱣ ᱫᱮᱠᱷᱟᱣᱜ ᱠᱟᱱᱟ।",
        en: "Showing personalized AI recommendations for you."
      }
    };
  }

  // 8. Profile & Skills Passport
  if (
    t.includes("profile") ||
    t.includes("passport") ||
    t.includes("my details") ||
    t.includes("certificate") ||
    t.includes("प्रोफाइल") ||
    t.includes("पासपोर्ट") ||
    t.includes("मेरी प्रोफाइल") ||
    t.includes("सर्टिफिकेट") ||
    t.includes("ପ୍ରୋଫାଇଲ") ||
    t.includes("ପାସପୋର୍ଟ") ||
    t.includes("ମୋ ବିଷୟରେ") ||
    t.includes("ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ")
  ) {
    return {
      target: "profile",
      confidence: 0.97,
      displayText: "मेरी प्रोफाइल एवं स्किल्स पासपोर्ट",
      spokenFeedback: {
        hi: "आपकी सत्यापित प्रोफाइल और डिजिटल स्किल्स पासपोर्ट खोला जा रहा है।",
        or: "ଆପଣଙ୍କ ସତ୍ୟାପିତ ପ୍ରୋଫାଇଲ ଓ ସ୍କିଲ୍ସ ପାସପୋର୍ଟ ଖୋଲାଯାଉଛି।",
        sat: "ᱟᱢᱟᱜ ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱟᱨ ᱥᱠᱤᱞ ᱯᱟᱥᱯᱳᱨᱴ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening your verified profile and digital skills passport."
      }
    };
  }

  // 9. Progress Journey
  if (
    t.includes("progress") ||
    t.includes("status") ||
    t.includes("percentage") ||
    t.includes("kitna hua") ||
    t.includes("प्रगति") ||
    t.includes("स्टेटस") ||
    t.includes("कितना पूरा हुआ") ||
    t.includes("ପ୍ରଗତି") ||
    t.includes("କେତେ ହେଲା")
  ) {
    return {
      target: "progress",
      confidence: 0.95,
      displayText: "मेरी प्रगति (My Progress 60%)",
      spokenFeedback: {
        hi: "आपकी प्रगति 60% पूर्ण है, अगला चरण देखा जा रहा है।",
        or: "ଆପଣଙ୍କ ପ୍ରଗତି ୬୦% ସମ୍ପୂର୍ଣ୍ଣ ଅଛି, ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ଦେଖାଯାଉଛି।",
        sat: "ᱟᱢᱟᱜ ᱞᱟᱦᱟᱱᱛᱤ ᱖᱐% ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ।",
        en: "Your profile is 60% complete, showing next milestones."
      }
    };
  }

  // 10. Centers & Map Location
  if (
    t.includes("center") ||
    t.includes("centers") ||
    t.includes("location") ||
    t.includes("kahan") ||
    t.includes("kendra") ||
    t.includes("kalahandi") ||
    t.includes("center near me") ||
    t.includes("सेंटर") ||
    t.includes("केंद्र") ||
    t.includes("कहाँ है") ||
    t.includes("नजदीकी केंद्र") ||
    t.includes("कालाहांडी") ||
    t.includes("ସେଣ୍ଟର") ||
    t.includes("କେନ୍ଦ୍ର") ||
    t.includes("କେଉଁଠି") ||
    t.includes("କଳାହାଣ୍ଡି")
  ) {
    return {
      target: "centers",
      confidence: 0.95,
      displayText: "नजदीकी ट्रेनिंग सेंटर (PMKK Kalahandi)",
      spokenFeedback: {
        hi: "कालाहांडी के नजदीकी प्रधानमंत्री कौशल केंद्र का विवरण खोला जा रहा है।",
        or: "କଳାହାଣ୍ଡିର ନିକଟତମ ପ୍ରଧାନମନ୍ତ୍ରୀ କୌଶଳ କେନ୍ଦ୍ର ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱠᱟᱞᱟᱦᱟᱱᱰᱤ ᱨᱮᱱᱟᱜ ᱴᱨᱮᱱᱤᱝ ᱥᱮᱱᱴᱟᱨ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening nearest training centers in Kalahandi district."
      }
    };
  }

  // 11. Home / Dashboard Return
  if (
    t.includes("home") ||
    t.includes("dashboard") ||
    t.includes("main page") ||
    t.includes("back") ||
    t.includes("होम") ||
    t.includes("डैशबोर्ड") ||
    t.includes("मुख्य पृष्ठ") ||
    t.includes("वापस") ||
    t.includes("ପ୍ରଧାନ ପୃଷ୍ଠା") ||
    t.includes("ଡ୍ୟାସବୋର୍ଡ")
  ) {
    return {
      target: "dashboard",
      confidence: 0.95,
      displayText: "मुख्य डैशबोर्ड (Main Dashboard)",
      spokenFeedback: {
        hi: "मुख्य डैशबोर्ड पर वापस ले जाया जा रहा है।",
        or: "ମୁଖ୍ୟ ଡ୍ୟାସବୋର୍ଡକୁ ଫେରି ଯାଉଛି।",
        sat: "ᱢᱩᱞ ᱰᱮᱥᱵᱳᱨᱰ ᱨᱮ ᱨᱩᱣᱟᱹᱲ ᱮᱱᱟ।",
        en: "Returning to main dashboard."
      }
    };
  }

  // 12. Voice AI Assistant
  if (
    t.includes("assistant") ||
    t.includes("copilot") ||
    t.includes("voice") ||
    t.includes("talk") ||
    t.includes("message") ||
    t.includes("सहायक") ||
    t.includes("बात करनी है") ||
    t.includes("बोलकर") ||
    t.includes("କଥା ହେବା") ||
    t.includes("ସହାୟକ")
  ) {
    return {
      target: "messages",
      confidence: 0.95,
      displayText: "एआई वॉयस सहायक (Voice Copilot)",
      spokenFeedback: {
        hi: "सक्षम एआई वॉयस सहायक चालू किया जा रहा है।",
        or: "ସକ୍ଷମ ଏଆଇ ଭଏସ୍ ସହାୟକ ଚାଲୁ କରାଗଲା।",
        sat: "Saksham AI ᱵᱷᱚᱭᱮᱥ ᱜᱚᱲᱚ ᱪᱟᱹᱞᱩ ᱮᱱᱟ।",
        en: "Opening Saksham AI Voice Copilot."
      }
    };
  }

  return null;
}

/**
 * Play synthesized voice confirmation audio cleanly without overlap or echo
 */
let activeAudioElement: HTMLAudioElement | null = null;

export function playVoiceNavigationConfirmation(
  spokenText: string,
  lang: string = "hi"
): void {
  // Stop existing audio playback immediately
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement = null;
    } catch {}
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(spokenText);
      const langCodeMap: Record<string, string> = {
        hi: "hi-IN",
        or: "hi-IN",
        sat: "hi-IN",
        en: "en-IN",
        bho: "hi-IN",
        mr: "mr-IN",
        bn: "bn-IN",
        te: "te-IN"
      };

      utterance.lang = langCodeMap[lang.toLowerCase()] || "hi-IN";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(
        (v) => v.lang.startsWith("hi") || v.name.includes("India") || v.lang.startsWith("en-IN")
      );
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
    }
  }
}
