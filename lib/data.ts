export interface SkillItem {
  id: string;
  name: string;
  category: 'formal' | 'informal' | 'latent';
  nsqfLevel: number;
  qpCode: string;
  confidence: number;
}

export interface BeneficiaryProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  education: string;
  district: string;
  state: string;
  languages: string[];
  currentOccupation: string;
  rawSpokenInput: string;
  extractedSkills: SkillItem[];
  mobilityConstraintKm: number;
  timeToIncomeUrgency: 'immediate' | 'moderate' | 'flexible';
  householdContext: {
    membersCount: number;
    primaryEarners: number;
    agriculturalLand: string;
    seasonalMigrationHistory: boolean;
  };
}

export interface PathwayOption {
  id: string;
  type: 'fast_income' | 'career_growth' | 'entrepreneurship';
  title: string;
  badge: string;
  role: string;
  nsqfLevel: number;
  qpCode: string;
  matchScore: number;
  estimatedTimeToIncomeDays: number;
  incomePotentialMonthly: string;
  trainingDurationDays: number;
  nearestCentre: {
    name: string;
    distanceKm: number;
    hostelAvailable: boolean;
    womenFriendly: boolean;
    rating: number;
    nextBatchDate: string;
  };
  localDemandStatus: 'Very High' | 'High' | 'Moderate';
  localJobCountWithinRadius: number;
  whyThisRecommendation: string[];
  skillGaps: {
    existing: string[];
    needed: string[];
  };
  enterpriseDetails?: {
    estimatedStartupCost: string;
    schemeSupport: string;
    breakevenMonths: number;
    marketLinkage: string;
  };
}

export interface DistrictMetric {
  districtName: string;
  state: string;
  profiledCount: number;
  verifiedTransitionsPercent: number;
  avgTimeToIncomeDays: number;
  sustainableLivelihoodRatePercent: number;
  topAspirations: { sector: string; count: number; percentage: number }[];
  highDemandSectors: {
    sector: string;
    openJobs: number;
    growthPercent: number;
    mismatchIndex: 'Low' | 'Medium' | 'Critical';
  }[];
  trainingCentres: {
    id: string;
    name: string;
    enrolled: number;
    certified: number;
    placed: number;
    retention6MonthsPercent: number;
    anomalyFlag: boolean;
    anomalyReason?: string;
  }[];
}

export const INITIAL_BENEFICIARIES: BeneficiaryProfile[] = [
  {
    id: "BEN-2026-901",
    name: "Ramesh Soren",
    age: 23,
    gender: "Male",
    education: "10th Pass",
    district: "Sundargarh",
    state: "Odisha",
    languages: ["Hindi", "Odia", "Santhali"],
    currentOccupation: "Smallholder Agriculture & Informal Repair",
    rawSpokenInput: "खेती करता हूं और थोड़ा बहुत मोटर और पंप का काम भी कर लेता हूं। गांव के पास ही काम चाहिए।",
    mobilityConstraintKm: 35,
    timeToIncomeUrgency: "moderate",
    householdContext: {
      membersCount: 5,
      primaryEarners: 1,
      agriculturalLand: "1.2 Acres (Rainfed)",
      seasonalMigrationHistory: true
    },
    extractedSkills: [
      { id: "s1", name: "Submersible Pump Troubleshooting", category: "informal", nsqfLevel: 3, qpCode: "AGR/Q1102", confidence: 92 },
      { id: "s2", name: "Single-phase Motor Wiring", category: "informal", nsqfLevel: 3, qpCode: "ELE/Q5901", confidence: 88 },
      { id: "s3", name: "Agricultural Equipment Handling", category: "formal", nsqfLevel: 2, qpCode: "AGR/Q1001", confidence: 95 },
      { id: "s4", name: "Hand Tool Safety & Diagnostics", category: "latent", nsqfLevel: 3, qpCode: "CSC/Q0801", confidence: 81 }
    ]
  },
  {
    id: "BEN-2026-902",
    name: "Sunita Majhi",
    age: 28,
    gender: "Female",
    education: "8th Pass",
    district: "Mayurbhanj",
    state: "Odisha",
    languages: ["Odia", "Hindi"],
    currentOccupation: "Traditional Bamboo & Sabai Grass Weaver",
    rawSpokenInput: "मैं घर पर हाथ से चटाई और टोकरी बनाती हूँ। सिलाई मशीन भी चलाती हूँ।",
    mobilityConstraintKm: 15,
    timeToIncomeUrgency: "immediate",
    householdContext: {
      membersCount: 4,
      primaryEarners: 2,
      agriculturalLand: "None",
      seasonalMigrationHistory: false
    },
    extractedSkills: [
      { id: "s5", name: "Natural Fiber Weaving & Braiding", category: "informal", nsqfLevel: 3, qpCode: "HCS/Q7301", confidence: 96 },
      { id: "s6", name: "Basic Garment Stitching", category: "informal", nsqfLevel: 2, qpCode: "AMH/Q0102", confidence: 85 },
      { id: "s7", name: "Local Material Sourcing & Finishing", category: "latent", nsqfLevel: 3, qpCode: "HCS/Q7303", confidence: 90 }
    ]
  },
  {
    id: "BEN-2026-903",
    name: "Vikram Kumar",
    age: 21,
    gender: "Male",
    education: "12th Pass (Science)",
    district: "Varanasi",
    state: "Uttar Pradesh",
    languages: ["Hindi", "English", "Bhojpuri"],
    currentOccupation: "Freelance Phone Hardware & Battery Repair",
    rawSpokenInput: "दुकान पर बैठकर मोबाइल स्क्रीन और चार्जिंग पोर्ट रिपेयर करता हूँ, ड्रोन और सोलर भी सीखना है।",
    mobilityConstraintKm: 60,
    timeToIncomeUrgency: "flexible",
    householdContext: {
      membersCount: 4,
      primaryEarners: 2,
      agriculturalLand: "0.5 Acres",
      seasonalMigrationHistory: false
    },
    extractedSkills: [
      { id: "s8", name: "SMD Component Desoldering", category: "informal", nsqfLevel: 4, qpCode: "ELE/Q4605", confidence: 94 },
      { id: "s9", name: "Circuit Continuity & Multimeter Testing", category: "informal", nsqfLevel: 4, qpCode: "ELE/Q5901", confidence: 91 },
      { id: "s10", name: "Customer Technical Support", category: "latent", nsqfLevel: 3, qpCode: "SSC/Q0110", confidence: 87 }
    ]
  }
];

export const SAMPLE_PATHWAYS: Record<string, PathwayOption[]> = {
  "BEN-2026-901": [
    {
      id: "path-1",
      type: "fast_income",
      title: "Solar Agri-Pump & Micro-Grid Technician",
      badge: "Fastest Time-to-Income (35 Days)",
      role: "Solar PV Installer & Field Maintenance (Suryamitra)",
      nsqfLevel: 4,
      qpCode: "SGJ/Q0101",
      matchScore: 94,
      estimatedTimeToIncomeDays: 35,
      incomePotentialMonthly: "₹18,000 – ₹24,000",
      trainingDurationDays: 28,
      nearestCentre: {
        name: "PMKK / RSETI District Skill Centre, Sundargarh",
        distanceKm: 22,
        hostelAvailable: true,
        womenFriendly: true,
        rating: 4.8,
        nextBatchDate: "15 Oct 2026"
      },
      localDemandStatus: "Very High",
      localJobCountWithinRadius: 42,
      whyThisRecommendation: [
        "Your existing motor pump repair skills cover 65% of practical prerequisites.",
        "PM-KUSUM solar pump installations in Sundargarh created 120+ verified technician openings.",
        "Matches your 35 km travel radius with free transport subsidy under PM-AJAY."
      ],
      skillGaps: {
        existing: ["Submersible pump diagnostics", "Single-phase motor wiring", "Manual tool safety"],
        needed: ["Solar DC inverter connection", "Lightning surge safety protocol", "Digital net-metering configuration"]
      }
    },
    {
      id: "path-2",
      type: "career_growth",
      title: "Certified Industrial Motor & EV Powertrain Specialist",
      badge: "High Growth & Apprenticeship",
      role: "Advanced Electromechanical Technician",
      nsqfLevel: 5,
      qpCode: "ELE/Q7303",
      matchScore: 89,
      estimatedTimeToIncomeDays: 75,
      incomePotentialMonthly: "₹24,000 – ₹32,000",
      trainingDurationDays: 60,
      nearestCentre: {
        name: "Govt Industrial Training Institute (ITI) Rourkela",
        distanceKm: 38,
        hostelAvailable: true,
        womenFriendly: true,
        rating: 4.9,
        nextBatchDate: "01 Nov 2026"
      },
      localDemandStatus: "High",
      localJobCountWithinRadius: 68,
      whyThisRecommendation: [
        "Offers formal dual-certification recognized across manufacturing hubs in Rourkela and Jharsuguda.",
        "Includes 3-month stipend-backed On-the-Job Training (OJT) with certified industrial suppliers."
      ],
      skillGaps: {
        existing: ["AC/DC circuit basics", "Physical motor assembly"],
        needed: ["PLC automated controller diagnostics", "High-voltage battery safety protocol", "CAD schematic reading"]
      }
    },
    {
      id: "path-3",
      type: "entrepreneurship",
      title: "Rural Farm Equipment & Solar Clinic (Micro-Enterprise)",
      badge: "Self-Employment & PM-AJAY Grant",
      role: "Independent Village Repair & Solar Maintenance Hub Owner",
      nsqfLevel: 4,
      qpCode: "ENT/Q0012",
      matchScore: 91,
      estimatedTimeToIncomeDays: 45,
      incomePotentialMonthly: "₹22,000 – ₹35,000 (Net Margin)",
      trainingDurationDays: 14,
      nearestCentre: {
        name: "RSETI Sundargarh Rural Entrepreneurship Wing",
        distanceKm: 22,
        hostelAvailable: false,
        womenFriendly: true,
        rating: 4.7,
        nextBatchDate: "10 Oct 2026"
      },
      localDemandStatus: "Very High",
      localJobCountWithinRadius: 18,
      whyThisRecommendation: [
        "High concentration of 450+ tubewells in 6 adjacent Gram Panchayats with zero certified repair hub.",
        "Eligible for PM-AJAY capital grant + Mudra Shishu loan (₹50,000) for diagnostic kit and spare parts inventory."
      ],
      skillGaps: {
        existing: ["Hands-on mechanical repair", "Local customer trust network"],
        needed: ["Digital UPI ledger & billing", "OEM spare supply chain linkage", "Warranty claim filing"]
      },
      enterpriseDetails: {
        estimatedStartupCost: "₹65,000 (₹40,000 toolkit + ₹25,000 initial spares)",
        schemeSupport: "PM-AJAY Livelihood Grant (₹35,000) + PM Mudra Loan (₹30,000)",
        breakevenMonths: 3,
        marketLinkage: "Direct tie-up with 12 Farmer Producer Organisations (FPOs) in Sundargarh"
      }
    }
  ]
};

export const DISTRICT_INTELLIGENCE: DistrictMetric = {
  districtName: "Sundargarh",
  state: "Odisha",
  profiledCount: 14820,
  verifiedTransitionsPercent: 84.6,
  avgTimeToIncomeDays: 41,
  sustainableLivelihoodRatePercent: 78.4,
  topAspirations: [
    { sector: "Renewable Energy & Solar Pumps", count: 4820, percentage: 32.5 },
    { sector: "Industrial Maintenance & EV", count: 3510, percentage: 23.7 },
    { sector: "Handicrafts & Modern Apparel", count: 2940, percentage: 19.8 },
    { sector: "Agri-Processing & Cold Chain", count: 2150, percentage: 14.5 },
    { sector: "Digital Services & Healthcare", count: 1400, percentage: 9.5 }
  ],
  highDemandSectors: [
    { sector: "Solar PV & Rural Irrigation Tech", openJobs: 412, growthPercent: 34, mismatchIndex: "Critical" },
    { sector: "Heavy Engineering & Fabrication", openJobs: 620, growthPercent: 18, mismatchIndex: "Medium" },
    { sector: "Sustainable Agro-processing", openJobs: 290, growthPercent: 26, mismatchIndex: "Medium" },
    { sector: "Rural Micro-Retail & Logistics", openJobs: 340, growthPercent: 12, mismatchIndex: "Low" }
  ],
  trainingCentres: [
    {
      id: "TC-01",
      name: "Govt ITI Sundargarh Campus",
      enrolled: 820,
      certified: 790,
      placed: 710,
      retention6MonthsPercent: 88.2,
      anomalyFlag: false
    },
    {
      id: "TC-02",
      name: "PMKK Center Rourkela South",
      enrolled: 1200,
      certified: 1140,
      placed: 980,
      retention6MonthsPercent: 82.5,
      anomalyFlag: false
    },
    {
      id: "TC-03",
      name: "Pragati Skill Academy (Affiliated Pvt)",
      enrolled: 640,
      certified: 630,
      placed: 210,
      retention6MonthsPercent: 34.0,
      anomalyFlag: true,
      anomalyReason: "High certification with severe drop in 90-day retention & 3 unresolved stipend grievances."
    }
  ]
};

export const FIELD_WORKER_TASKS = [
  {
    id: "TSK-101",
    beneficiaryName: "Ramesh Soren",
    village: "Lathikata GP, Sundargarh",
    taskType: "Assisted Profiling Verification",
    priority: "High",
    dueTime: "Today, 4:00 PM",
    status: "Pending",
    notes: "Audio recorded; NSQF mapping suggested Solar Agri-Pump pathway. Consent required."
  },
  {
    id: "TSK-102",
    beneficiaryName: "Priyanka Naik",
    village: "Kuarmunda, Sundargarh",
    taskType: "AI Dropout Risk Intervention",
    priority: "Urgent",
    dueTime: "Today, 5:30 PM",
    status: "Action Needed",
    notes: "Missed 3 consecutive days at Solar Training Centre. Reason flagged: Bus breakdown + childcare conflict."
  },
  {
    id: "TSK-103",
    beneficiaryName: "Manoj Tudu",
    village: "Bargaon GP",
    taskType: "Post-Placement 90-Day Check-in",
    priority: "Medium",
    dueTime: "Tomorrow, 11:00 AM",
    status: "Scheduled",
    notes: "Employed as Substation Assistant at DISCOM. Confirm monthly wage receipt and workplace conditions."
  },
  {
    id: "TSK-104",
    beneficiaryName: "Gita Oram",
    village: "Rajgangpur",
    taskType: "Grievance Follow-up",
    priority: "High",
    dueTime: "Tomorrow, 2:00 PM",
    status: "In Progress",
    notes: "Spoken grievance: Delayed tool-kit disbursement under PM-AJAY GIA grant."
  }
];
