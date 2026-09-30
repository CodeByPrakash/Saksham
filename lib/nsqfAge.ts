export type GenderType = "male" | "female" | "other";

export interface NSQFAgeBracket {
  age: number;
  category: "<18" | ">=18" | "50+";
  tag: string;
  badgeLabel: string;
  categoryTitle: string;
  nsqfLevelBand: string;
  description: string;
}

/**
 * Categorizes beneficiary age into NSQF & PM-AJAY skilling brackets:
 * - <18: Pre-Vocational / Foundation (NSQF L1–2)
 * - >=18: Core Youth / Adult Skilling (NSQF L3–5)
 * - 50+: Senior Master Craftsman & RPL Specialist
 */
export function getNSQFAgeBracket(ageInput?: number | string | null): NSQFAgeBracket {
  const age = typeof ageInput === "string" ? parseInt(ageInput, 10) : (ageInput ?? 28);
  const validAge = isNaN(age) || age <= 0 ? 28 : age;

  if (validAge < 18) {
    return {
      age: validAge,
      category: "<18",
      tag: "<18",
      badgeLabel: "<18 (Pre-Vocational / Foundation)",
      categoryTitle: "Pre-Vocational Foundation",
      nsqfLevelBand: "NSQF Level 1–2",
      description: "Foundational & school-integrated vocational orientation under PM-AJAY youth wing."
    };
  }

  if (validAge >= 50) {
    return {
      age: validAge,
      category: "50+",
      tag: "50+",
      badgeLabel: "50+ (Senior RPL & Master Artisan)",
      categoryTitle: "Master Craftsman & RPL Mentorship",
      nsqfLevelBand: "NSQF RPL / Level 4–6 Specialist",
      description: "Eligible for Recognition of Prior Learning (RPL), Master Artisan mentorship, and PM Vishwakarma traditional grants."
    };
  }

  // 18 - 49
  return {
    age: validAge,
    category: ">=18",
    tag: ">=18",
    badgeLabel: ">=18 (NSQF L3–5 Core & RPL)",
    categoryTitle: "Core Livelihood & Trade Certification",
    nsqfLevelBand: "NSQF Level 3–5",
    description: "Eligible for full PM-AJAY skill training stipend (₹3,500/mo) and ₹35,000 micro-enterprise capital grant."
  };
}

/**
 * Returns dynamic avatar image URL based on gender:
 * - Female: /landingPage/person_1_landing.webp
 * - Male: /landingPage/person_3_landing.webp
 */
export function getAvatarForGender(gender?: GenderType | string): string {
  if (gender === "female") {
    return "/landingPage/person_1_landing.webp";
  }
  return "/landingPage/person_3_landing.webp";
}
