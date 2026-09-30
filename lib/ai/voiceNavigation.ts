"use client";

import { RECOMMENDED_COURSES, RECOMMENDED_JOBS, SCHEMES_LIST, CourseItem, JobItem } from "@/components/dashboard/DashboardShared";
import { ALL_EXPANDED_NSQF_COURSES } from "@/lib/skillTrainingGenerator";

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

  // 3. Comprehensive NSQF Course Voice Intent Matching
  // Helper to find course from ALL_EXPANDED_NSQF_COURSES or RECOMMENDED_COURSES
  const findCourse = (id: string, keywordFallback?: string) => {
    return (
      ALL_EXPANDED_NSQF_COURSES.find((c) => c.id === id) ||
      RECOMMENDED_COURSES.find((c) => c.id === id) ||
      (keywordFallback ? ALL_EXPANDED_NSQF_COURSES.find((c) => c.title.toLowerCase().includes(keywordFallback)) : undefined) ||
      ALL_EXPANDED_NSQF_COURSES[0]
    );
  };

  // Course 1: Kisan Drone Pilot & Spraying
  if (
    t.includes("drone") ||
    t.includes("kisan drone") ||
    t.includes("ड्रोन") ||
    t.includes("किसान ड्रोन") ||
    t.includes("छिड़काव") ||
    t.includes("ଡ୍ରୋନ") ||
    t.includes("uav")
  ) {
    const course = findCourse("nsqf-course-drone-pilot-agri", "drone");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "किसान ड्रोन पायलट एवं फसल स्वास्थ्य (NSQF Level 4)",
      spokenFeedback: {
        hi: "किसान ड्रोन पायलट NSQF Level 4 कोर्स का विवरण खोला जा रहा है।",
        or: "କିଷାନ ଡ୍ରୋନ ପାଇଲଟ୍ NSQF ଲେଭଲ ୪ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱠᱤᱥᱟᱱ ᱰᱨᱳᱱ ᱯᱟᱭᱞᱚᱴ NSQF Level 4 ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Kisan Drone Pilot & Crop Health Analyst Course."
      }
    };
  }

  // Course 2: Commercial Mushroom & Spawn
  if (
    t.includes("mushroom") ||
    t.includes("मशरूम") ||
    t.includes("मशरूम की खेती") ||
    t.includes("छातु") ||
    t.includes("ଛତୁ") ||
    t.includes("ଛତୁ ଚାଷ") ||
    t.includes("spawn")
  ) {
    const course = findCourse("nsqf-course-organic-mushroom", "mushroom");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "मशरूम उत्पादन एवं स्पॉन लैब (NSQF Level 3)",
      spokenFeedback: {
        hi: "कमर्शियल मशरूम एवं स्पॉन उत्पादन कोर्स खोला जा रहा है।",
        or: "ଛତୁ ଚାଷ ଓ ସ୍ପନ୍ ଉତ୍ପାଦନ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱢᱟᱥᱨᱩᱢ ᱪᱟᱥ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Commercial Mushroom & Spawn Production Course."
      }
    };
  }

  // Course 3: Dairy Processing & Milk Hub
  if (
    t.includes("dairy") ||
    t.includes("milk") ||
    t.includes("paneer") ||
    t.includes("ghee") ||
    t.includes("दूध") ||
    t.includes("डेयरी") ||
    t.includes("पनीर") ||
    t.includes("घी") ||
    t.includes("ଖୀର") ||
    t.includes("ପନିର") ||
    t.includes("ଘିଅ") ||
    t.includes("ଗୋପାଳନ")
  ) {
    const course = findCourse("nsqf-course-dairy-processing", "dairy");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "डेयरी प्रोसेसिंग एवं दुग्ध केंद्र (NSQF Level 4)",
      spokenFeedback: {
        hi: "डेयरी प्रोसेसिंग एवं दुग्ध मूल्य-संवर्धन कोर्स खोला जा रहा है।",
        or: "ଡାଏରୀ ପ୍ରକ୍ରିୟାକରଣ ଓ ଦୁଗ୍ଧ କେନ୍ଦ୍ର କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱰᱮᱭᱨᱤ ᱯᱨᱚᱥᱮᱥᱤᱝ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Dairy Processing & Milk Value-Addition Course."
      }
    };
  }

  // Course 4: Honey Bee Keeping & Apiculture
  if (
    t.includes("honey") ||
    t.includes("bee") ||
    t.includes("beekeeping") ||
    t.includes("apiculture") ||
    t.includes("मधुमक्खी") ||
    t.includes("शहद") ||
    t.includes("मौन पालन") ||
    t.includes("ମହୁ") ||
    t.includes("ମହୁମାଛି")
  ) {
    const course = findCourse("nsqf-course-apiculture-honey", "honey");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "मधुमक्खी पालन एवं शहद प्रसंस्करण (NSQF Level 3)",
      spokenFeedback: {
        hi: "व्यावसायिक मधुमक्खी पालन कोर्स का विवरण खोला जा रहा है।",
        or: "ମହୁମାଛି ପାଳନ ଓ ମହୁ ପ୍ରକ୍ରିୟାକରଣ କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱢᱟᱦᱩ ᱢᱟᱪᱷᱤ ᱪᱟᱥ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Commercial Honey Bee Keeping Course."
      }
    };
  }

  // Course 5: Poultry & Hatchery
  if (
    t.includes("poultry") ||
    t.includes("chicken") ||
    t.includes("hatchery") ||
    t.includes("murgi") ||
    t.includes("मुर्गी") ||
    t.includes("मुर्गी पालन") ||
    t.includes("कड़कनाथ") ||
    t.includes("हॅचरी") ||
    t.includes("କୁକୁଡ଼ା") ||
    t.includes("କୁକୁଡ଼ା ଚାଷ")
  ) {
    const course = findCourse("nsqf-course-poultry-hatchery", "poultry");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "पोल्ट्री एवं सोलर हैचरी विशेषज्ञ (NSQF Level 3)",
      spokenFeedback: {
        hi: "पोल्ट्री फार्मिंग एवं सोलर हैचरी कोर्स खोला जा रहा है।",
        or: "କୁକୁଡ଼ା ପାଳନ ଓ ସୋଲାର ହ୍ୟାଚେରୀ ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱤᱢ ᱪᱟᱥ ᱟᱨ ᱦᱮᱪᱮᱨᱤ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Poultry & Solar Hatchery Training Course."
      }
    };
  }

  // Course 6: Fisheries & Biofloc Aquaculture
  if (
    t.includes("fish") ||
    t.includes("fisheries") ||
    t.includes("biofloc") ||
    t.includes("aquaculture") ||
    t.includes("मछली") ||
    t.includes("मत्स्य") ||
    t.includes("मछली पालन") ||
    t.includes("बायोफ्लॉक") ||
    t.includes("ମାଛ") ||
    t.includes("ମାଛ ଚାଷ")
  ) {
    const course = findCourse("nsqf-course-aquaculture-biofloc", "fisheries");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "मत्स्य पालन एवं बायोफ्लॉक फार्मिंग (NSQF Level 4)",
      spokenFeedback: {
        hi: "मत्स्य पालन एवं बायोफ्लॉक फिश फार्मिंग कोर्स खोला जा रहा है।",
        or: "ମାଛ ଚାଷ ଓ ବାୟୋଫ୍ଲକ୍ ତାଲିମ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱦᱟᱹᱠᱩ ᱪᱟᱥ ᱟᱨ ᱵᱟᱭᱳᱯᱷᱞᱚᱠ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Fisheries, Biofloc Farming & Aqua-Tech Course."
      }
    };
  }

  // Course 7: Shree Anna Millet Bakery & Processing
  if (
    t.includes("millet") ||
    t.includes("mandia") ||
    t.includes("ragi") ||
    t.includes("shree anna") ||
    t.includes("मिलेट") ||
    t.includes("श्री अन्न") ||
    t.includes("रागी") ||
    t.includes("मड़ुआ") ||
    t.includes("ମାଣ୍ଡିଆ") ||
    t.includes("ମିଲେଟ") ||
    t.includes("बेकरी") ||
    t.includes("बिस्कुट")
  ) {
    const course = findCourse("nsqf-course-millet-bakery", "millet");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "श्री अन्न मिलेट प्रोसेसिंग एवं बेकरी (NSQF Level 4)",
      spokenFeedback: {
        hi: "श्री अन्न रागी मिलेट प्रोसेसिंग एवं बेकरी कोर्स खोला जा रहा है।",
        or: "ଶ୍ରୀ ଅନ୍ନ ମାଣ୍ଡିଆ ପ୍ରକ୍ରିୟାକରଣ ଓ ବେକେରୀ କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱢᱤᱞᱮᱴ ᱯᱨᱚᱥᱮᱥᱤᱝ ᱟᱨ ᱵᱮᱠᱟᱨᱤ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Shree Anna Millet Processing & Bakery Course."
      }
    };
  }

  // Course 8: Cold-Press Oil Expeller & Kachi Ghani
  if (
    t.includes("oil mill") ||
    t.includes("cold press") ||
    t.includes("kachi ghani") ||
    t.includes("mustard oil") ||
    t.includes("तेल मिल") ||
    t.includes("कच्ची घानी") ||
    t.includes("तेल पेराई") ||
    t.includes("ତେଲ") ||
    t.includes("ତେଲ ମିଲ୍") ||
    t.includes("ତେଲ ଘଣା")
  ) {
    const course = findCourse("nsqf-course-cold-press-oil-mill", "oil");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "कोल्ड-प्रेस कच्ची घानी तेल मिल (NSQF Level 4)",
      spokenFeedback: {
        hi: "कोल्ड-प्रेस कच्ची घानी तेल पेराई उद्यम कोर्स खोला जा रहा है।",
        or: "କୋଲ୍ଡ-ପ୍ରେସ୍ ତେଲ ଘଣା ଓ ପ୍ରକ୍ରିୟାକରଣ କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱩᱱᱩᱢ ᱯᱮᱲᱟᱣ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Cold-Press Oil Expeller & Processing Course."
      }
    };
  }

  // Course 9: Spice Pulverizer & Masala Packaging
  if (
    t.includes("spice") ||
    t.includes("masala") ||
    t.includes("pulverizer") ||
    t.includes("मसाला") ||
    t.includes("हल्दी") ||
    t.includes("धनिया") ||
    t.includes("मिर्च") ||
    t.includes("मसाला पिसाई") ||
    t.includes("ମସଲା") ||
    t.includes("ହଳଦୀ") ||
    t.includes("ମସଲା ପେଷାଇ")
  ) {
    const course = findCourse("nsqf-course-spice-pulverizer-unit", "spice");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "मसाला पिसाई एवं पैकेजिंग उद्यम (NSQF Level 4)",
      spokenFeedback: {
        hi: "मसाला पिसाई एवं पैकेजिंग इकाई कोर्स का विवरण खोला जा रहा है।",
        or: "ମସଲା ପେଷାଇ ଓ ପ୍ୟାକେଜିଂ ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱢᱚᱥᱞᱟ ᱜᱩᱸᱰᱟᱹ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Spice Pulverization & Packaging Course."
      }
    };
  }

  // Course 10: Auto Mechanic & Tractor Service Hub
  if (
    t.includes("tractor") ||
    t.includes("auto mechanic") ||
    t.includes("motorcycle repair") ||
    t.includes("bike repair") ||
    t.includes("ट्रैक्टर") ||
    t.includes("मैकेनिक") ||
    t.includes("गाड़ी मरम्मत") ||
    t.includes("ऑटो मैकेनिक") ||
    t.includes("ଟ୍ରାକ୍ଟର") ||
    t.includes("ମରାମତି")
  ) {
    const course = findCourse("nsqf-course-auto-tractor-mechanic", "tractor");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "ऑटो मैकेनिक एवं फार्म ट्रैक्टर सर्विस (NSQF Level 4)",
      spokenFeedback: {
        hi: "ऑटोमोबाइल एवं फार्म ट्रैक्टर सर्विस मैकेनिक कोर्स खोला जा रहा है।",
        or: "ଅଟୋ ମେକାନିକ ଓ ଟ୍ରାକ୍ଟର ମରାମତି କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱴᱨᱮᱠᱴᱚᱨ ᱟᱨ ᱜᱟᱹᱰᱤ ᱵᱮᱱᱟᱣ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Auto Mechanic & Farm Tractor Service Course."
      }
    };
  }

  // Course 11: Electric Vehicle (EV) Servicing
  if (
    t.includes("ev") ||
    t.includes("electric vehicle") ||
    t.includes("e-rickshaw") ||
    t.includes("ई-रिक्शा") ||
    t.includes("इलेक्ट्रिक वाहन") ||
    t.includes("ଇ-ରିକ୍ସା") ||
    t.includes("ଇଲେକ୍ଟ୍ରିକ")
  ) {
    const course = findCourse("nsqf-course-ev-servicing", "electric vehicle");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "इलेक्ट्रिक वाहन (EV) एवं ई-रिक्शा टेक्नीशियन (NSQF Level 4)",
      spokenFeedback: {
        hi: "ई-रिक्शा एवं इलेक्ट्रिक वाहन टेक्नीशियन कोर्स खोला जा रहा है।",
        or: "ଇ-ରିକ୍ସା ଓ ଇଭି ମରାମତି କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "EV ᱟᱨ ᱤ-ᱨᱤᱠᱥᱟ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening EV & E-Rickshaw Technician Course."
      }
    };
  }

  // Course 12: Biogas & GOBAR-dhan Plant
  if (
    t.includes("biogas") ||
    t.includes("gobar dhan") ||
    t.includes("बायोगैस") ||
    t.includes("गोबर गैस") ||
    t.includes("गोबर धन") ||
    t.includes("ବାୟୋଗ୍ୟାସ")
  ) {
    const course = findCourse("nsqf-course-biogas-plant-operator", "biogas");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "बायोगैस एवं गोबर-धन प्लांट ऑपरेटर (NSQF Level 4)",
      spokenFeedback: {
        hi: "बायोगैस एवं ग्रामीण अपशिष्ट ऊर्जा प्लांट ऑपरेटर कोर्स खोला जा रहा है।",
        or: "ବାୟୋଗ୍ୟାସ ପ୍ଲାଣ୍ଟ ଅପରେଟର କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱵᱟᱭᱳᱜᱮᱥ ᱯᱞᱟᱱᱴ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Biogas & Rural Waste-to-Energy Plant Course."
      }
    };
  }

  // Course 13: Solar Agri-Pump & Borewell Specialist
  if (
    t.includes("solar pump") ||
    t.includes("agri pump") ||
    t.includes("submersible") ||
    t.includes("borewell") ||
    t.includes("सोलर पंप") ||
    t.includes("कृषि पंप") ||
    t.includes("बोरवेल") ||
    t.includes("ସୌର ପମ୍ପ") ||
    t.includes("ପମ୍ପ ମରାମତି")
  ) {
    const course = findCourse("nsqf-course-solar-agri-pump", "solar pv agri-pump");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "सोलर पीवी कृषि पंप विशेषज्ञ (NSQF Level 4)",
      spokenFeedback: {
        hi: "सोलर कृषि पंप एवं सबमर्सिबल मोटर विशेषज्ञ कोर्स खोला जा रहा है।",
        or: "ସୌର କୃଷି ପମ୍ପ ଓ ମୋଟର ୱାଇଣ୍ଡିଂ କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱳᱞᱟᱨ ᱯᱟᱢᱯ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Solar PV Agri-Pump Specialist Course."
      }
    };
  }

  // Course 14: Solar Rooftop & Suryamitra
  if (
    t.includes("solar") ||
    t.includes("suryamitra") ||
    t.includes("rooftop") ||
    t.includes("सूर्यमित्र") ||
    t.includes("सोलर") ||
    t.includes("रूफटॉप") ||
    t.includes("ସୋଲାର") ||
    t.includes("ସୌର") ||
    t.includes("ସୂର୍ଯ୍ୟମିତ୍ର")
  ) {
    const course = findCourse("nsqf-course-solar-rooftop-tech", "solar rooftop");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "सोलर रूफटॉप एवं सूर्यमित्र (NSQF Level 4)",
      spokenFeedback: {
        hi: "सोलर रूफटॉप एवं सूर्यमित्र कोर्स का विवरण खोला जा रहा है।",
        or: "ସୌର ପିଭି ସୂର୍ଯ୍ୟମିତ୍ର କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱳᱞᱟᱨ ᱯᱤᱵᱷᱤ ᱥᱩᱨᱭᱚᱢᱤᱛᱨᱚ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Solar Rooftop & Suryamitra Course."
      }
    };
  }

  // Course 15: Solar CCTV & Smart Village Wi-Fi
  if (
    t.includes("cctv") ||
    t.includes("camera") ||
    t.includes("wifi") ||
    t.includes("surveillance") ||
    t.includes("कैमरा") ||
    t.includes("सीसीटीवी") ||
    t.includes("वाईफाई") ||
    t.includes("ସିସିଟିଭି") ||
    t.includes("କ୍ୟାମେରା")
  ) {
    const course = findCourse("nsqf-course-cctv-village-security", "cctv");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "सोलर सीसीटीवी एवं स्मार्ट वाई-फाई नेटवर्क (NSQF Level 4)",
      spokenFeedback: {
        hi: "सोलर सीसीटीवी कैमरा एवं ग्राम वाई-फाई नेटवर्क कोर्स खोला जा रहा है।",
        or: "ସୋଲାର ସିସିଟିଭି ଓ ଗ୍ରାମ ୱାଇ-ଫାଇ ନେଟୱର୍କ କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "CCTV ᱟᱨ Wi-Fi ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Solar CCTV & Smart Village Wi-Fi Course."
      }
    };
  }

  // Course 16: Modern Masonry, Fly-Ash Brick & PMAY
  if (
    t.includes("mason") ||
    t.includes("masonry") ||
    t.includes("brick") ||
    t.includes("flyash") ||
    t.includes("मिस्त्री") ||
    t.includes("राजमिस्त्री") ||
    t.includes("ईंट") ||
    t.includes("फ्लाई ऐश") ||
    t.includes("भवन निर्माण") ||
    t.includes("ରାଜମିସ୍ତ୍ରୀ") ||
    t.includes("ଇଟା")
  ) {
    const course = findCourse("nsqf-course-masonry-flyash-brick", "masonry");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "आधुनिक राजमिस्त्री एवं फ्लाई-ऐश ईंट निर्माण (NSQF Level 4)",
      spokenFeedback: {
        hi: "आधुनिक राजमिस्त्री एवं फ्लाई-ऐश ईंट निर्माण कोर्स खोला जा रहा है।",
        or: "ଆଧୁନିକ ରାଜମିସ୍ତ୍ରୀ ଓ ଫ୍ଲାଏ-ଆଶ ଇଟା ନିର୍ମାଣ କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "ᱨᱟᱡᱽᱢᱤᱥᱛᱨᱤ ᱟᱨ ᱤᱴᱟᱹ ᱵᱮᱱᱟᱣ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Modern Masonry & Fly-Ash Brick Course."
      }
    };
  }

  // Course 17: Plumbing & Village RO Water Plant
  if (
    t.includes("plumbing") ||
    t.includes("ro plant") ||
    t.includes("pipe") ||
    t.includes("tap") ||
    t.includes("water treatment") ||
    t.includes("नल") ||
    t.includes("प्लंबर") ||
    t.includes("प्लंबिंग") ||
    t.includes("आरओ प्लांट") ||
    t.includes("जल जीवन") ||
    t.includes("ପାଇପ୍") ||
    t.includes("ପାଣି ଫିଲ୍ଟର")
  ) {
    const course = findCourse("nsqf-course-plumbing-water-plant", "plumbing");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "प्लंबिंग एवं आरओ वाटर प्लांट ऑपरेटर (NSQF Level 3)",
      spokenFeedback: {
        hi: "जल जीवन मिशन प्लंबिंग एवं आरओ वाटर प्लांट कोर्स खोला जा रहा है।",
        or: "ପ୍ଲମ୍ବିଂ ଓ ଗ୍ରାମ ଆରଓ ପାଣି ପ୍ଲାଣ୍ଟ ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱯᱞᱟᱢᱵᱤᱝ ᱟᱨ ᱫᱟᱜ ᱯᱞᱟᱱᱴ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Plumbing & RO Water Plant Operator Course."
      }
    };
  }

  // Course 18: Common Service Center (CSC) & e-Gram
  if (
    t.includes("csc") ||
    t.includes("computer") ||
    t.includes("digital") ||
    t.includes("e-gram") ||
    t.includes("aadhar") ||
    t.includes("pan card") ||
    t.includes("कंप्यूटर") ||
    t.includes("सीएससी") ||
    t.includes("ई-ग्राम") ||
    t.includes("आधार") ||
    t.includes("ସିଏସସି") ||
    t.includes("କମ୍ପ୍ୟୁଟର") ||
    t.includes("ଆଧାର")
  ) {
    const course = findCourse("nsqf-course-csc-digital-gram", "csc");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "कॉमन सर्विस सेंटर (CSC) एवं डिजिटल ई-ग्राम (NSQF Level 4)",
      spokenFeedback: {
        hi: "सीएससी एवं डिजिटल ई-ग्राम केंद्र ऑपरेटर कोर्स खोला जा रहा है।",
        or: "ସିଏସସି ଓ ଡିଜିଟାଲ ଇ-ଗ୍ରାମ କେନ୍ଦ୍ର କୋର୍ସ ଖୋଲାଯାଉଛି।",
        sat: "CSC ᱟᱨ ᱠᱚᱢᱯᱤᱭᱩᱴᱟᱨ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening CSC & Digital e-Gram Operator Course."
      }
    };
  }

  // Course 19: Telemedicine & Village Diagnostic Point
  if (
    t.includes("telemedicine") ||
    t.includes("e-sanjeevani") ||
    t.includes("diagnostic") ||
    t.includes("टेलीमेडिसिन") ||
    t.includes("ई-संजीवनी") ||
    t.includes("जांच केंद्र") ||
    t.includes("ଇ-ସଞ୍ଜୀବନୀ") ||
    t.includes("ରକ୍ତ ପରୀକ୍ଷା")
  ) {
    const course = findCourse("nsqf-course-telemedicine-operator", "telemedicine");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "टेलीमेडिसिन एवं ग्राम डायग्नोस्टिक पॉइंट (NSQF Level 4)",
      spokenFeedback: {
        hi: "टेलीमेडिसिन एवं डिजिटल हेल्थ डायग्नोस्टिक कोर्स खोला जा रहा है।",
        or: "ଟେଲିମେଡିସିନ ଓ ଡାଇଗ୍ନୋଷ୍ଟିକ୍ କେନ୍ଦ୍ର ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱴᱮᱞᱤᱢᱮᱰᱤᱥᱤᱱ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Telemedicine & Village Diagnostic Point Course."
      }
    };
  }

  // Course 20: Healthcare General Duty Assistant (GDA)
  if (
    t.includes("hospital") ||
    t.includes("health") ||
    t.includes("nursing") ||
    t.includes("gda") ||
    t.includes("patient") ||
    t.includes("स्वास्थ्य") ||
    t.includes("अस्पताल") ||
    t.includes("नर्सिंग") ||
    t.includes("जीडीए") ||
    t.includes("ଡାକ୍ତରଖାନା") ||
    t.includes("ସ୍ୱାସ୍ଥ୍ୟ") ||
    t.includes("ରୋଗୀ ସେବା")
  ) {
    const course = findCourse("nsqf-course-healthcare-gda", "healthcare");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "हेल्थकेयर जनरल ड्यूटी असिस्टेंट (NSQF Level 4)",
      spokenFeedback: {
        hi: "हेल्थकेयर जनरल ड्यूटी असिस्टेंट कोर्स का विवरण खोला जा रहा है।",
        or: "ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ କୋର୍ସ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱦᱟᱥᱯᱟᱛᱟᱞ ᱜᱚᱲᱚ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Healthcare General Duty Assistant Course."
      }
    };
  }

  // Course 21: Ayush Herbal Medicine & Distillation
  if (
    t.includes("ayush") ||
    t.includes("herbal") ||
    t.includes("medicinal") ||
    t.includes("lemongrass") ||
    t.includes("tulsi") ||
    t.includes("essential oil") ||
    t.includes("जड़ी बूटी") ||
    t.includes("आयुष") ||
    t.includes("आयुर्वेद") ||
    t.includes("तुलसी") ||
    t.includes("ଆୟୁଷ") ||
    t.includes("ତୁଳସୀ") ||
    t.includes("ଔଷଧୀୟ ଗଛ")
  ) {
    const course = findCourse("nsqf-course-ayush-herbal-distillation", "ayush");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "आयुष हर्बल एवं एसेंशियल ऑयल डिस्टिलेशन (NSQF Level 4)",
      spokenFeedback: {
        hi: "आयुष हर्बल औषधि एवं तेल डिस्टिलेशन कोर्स खोला जा रहा है।",
        or: "ଆୟୁଷ ଔଷଧୀୟ ଉଦ୍ଭିଦ ଓ ତେଲ ନିଷ୍କାସନ ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱡᱟᱹᱲᱤ ᱵᱩᱴᱤ ᱟᱨ ᱟᱭᱩᱥ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Ayush Herbal & Essential Oil Distillation Course."
      }
    };
  }

  // Course 22: Jacquard Handloom Weaving
  if (
    t.includes("handloom") ||
    t.includes("weaving") ||
    t.includes("jacquard") ||
    t.includes("saree") ||
    t.includes("loom") ||
    t.includes("हथकरघा") ||
    t.includes("बुनकर") ||
    t.includes("साड़ी") ||
    t.includes("ଜାକାର୍ଡ") ||
    t.includes("ବୁଣାକାର") ||
    t.includes("ଶାଢ଼ୀ")
  ) {
    const course = findCourse("nsqf-course-handloom-jacquard", "handloom");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "जैकर्ड हथकरघा एवं पारंपरिक वस्त्र (NSQF Level 4)",
      spokenFeedback: {
        hi: "जैकर्ड हथकरघा एवं पारंपरिक वस्त्र बुनाई कोर्स खोला जा रहा है।",
        or: "ଜାକାର୍ଡ ହସ୍ତତନ୍ତ ଓ ଶାଢ଼ୀ ବୁଣା ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱞᱩᱜᱽᱲᱤ ᱛᱮᱧ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Jacquard Handloom & Traditional Textile Course."
      }
    };
  }

  // Course 23: Bamboo Craft & Eco Lifestyle
  if (
    t.includes("bamboo") ||
    t.includes("craft") ||
    t.includes("cane") ||
    t.includes("बांस") ||
    t.includes("बांस शिल्प") ||
    t.includes("हस्तशिल्प") ||
    t.includes("ବାଉଁଶ") ||
    t.includes("ବାଉଁଶ କାମ") ||
    t.includes("ମᱟᱫ")
  ) {
    const course = findCourse("nsqf-course-bamboo-craft-design", "bamboo");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "बांस शिल्प एवं इको-लाइफस्टाइल उत्पाद (NSQF Level 3)",
      spokenFeedback: {
        hi: "बांस शिल्प एवं इको-लाइफस्टाइल उत्पाद कोर्स खोला जा रहा है।",
        or: "ବାଉଁଶ ହସ୍ତଶିଳ୍ପ ଓ ଉତ୍ପାଦ ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱢᱟᱫ ᱦᱩᱱᱟᱹᱨ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Bamboo Craft Design Course."
      }
    };
  }

  // Course 24: Tailoring, Garment & Boutique
  if (
    t.includes("tailor") ||
    t.includes("tailoring") ||
    t.includes("silai") ||
    t.includes("sewing") ||
    t.includes("boutique") ||
    t.includes("सिलाई") ||
    t.includes("दर्जी") ||
    t.includes("सिलाई मशीन") ||
    t.includes("बुटीक") ||
    t.includes("ସିଲେଇ") ||
    t.includes("ସିଲେଇ ମେସିନ") ||
    t.includes("ଲୁଗା")
  ) {
    const course = findCourse("nsqf-course-tailoring-boutique", "tailoring");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "सिलाई, परिधान एवं फैशन बुटीक (NSQF Level 3)",
      spokenFeedback: {
        hi: "सिलाई, गारमेंट एवं बुटीक कोर्स का विवरण खोला जा रहा है।",
        or: "ସିଲେଇ ଓ ଫ୍ୟାସନ ବୁଟିକ୍ ତାଲିମ ବିବରଣୀ ଖୋଲାଯାଉଛି।",
        sat: "ᱥᱤᱞᱟᱹᱭ NSQF Level 3 ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Tailoring, Garment Making & Boutique Course."
      }
    };
  }

  // Course 25: Terracotta & Ceramic Pottery
  if (
    t.includes("pottery") ||
    t.includes("clay") ||
    t.includes("terracotta") ||
    t.includes("ceramic") ||
    t.includes("earthenware") ||
    t.includes("kulhad") ||
    t.includes("कुम्हार") ||
    t.includes("मिट्टी के बर्तन") ||
    t.includes("टेराकोटा") ||
    t.includes("कुल्हड़") ||
    t.includes("ମାଟି ପାତ୍ର") ||
    t.includes("କୁମ୍ଭାର")
  ) {
    const course = findCourse("nsqf-course-terracotta-pottery", "pottery");
    return {
      target: "training",
      courseId: course.id,
      course: course,
      confidence: 0.98,
      displayText: "टेराकोटा एवं सेरेमिक पॉटरी स्टूडियो (NSQF Level 3)",
      spokenFeedback: {
        hi: "टेराकोटा एवं इलेक्ट्रिक व्हील पॉटरी कोर्स खोला जा रहा है।",
        or: "ମାଟି ପାତ୍ର ଓ ଟେରାକୋଟା ତାଲିମ ଖୋଲାଯାଉଛି।",
        sat: "ᱦᱟᱥᱟ ᱵᱟᱥᱚᱱ ᱵᱮᱱᱟᱣ ᱴᱨᱮᱱᱤᱝ ᱠᱷᱩᱞᱟᱹᱜ ᱠᱟᱱᱟ।",
        en: "Opening Terracotta & Ceramic Pottery Course."
      }
    };
  }

  // Course 26: Electrician
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
    const course = findCourse("course-1", "electrician");
    return {
      target: "training",
      courseId: course.id,
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
        sat: "Sakhyam AI ᱵᱷᱚᱭᱮᱥ ᱜᱚᱲᱚ ᱪᱟᱹᱞᱩ ᱮᱱᱟ।",
        en: "Opening Sakhyam AI Voice Copilot."
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
    } catch { }
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
