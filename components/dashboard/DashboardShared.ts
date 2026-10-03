export interface CourseItem {
  id: string;
  title: string;
  nsqfLevel: number;
  qpCode: string;
  badge: string;
  badgeColor: 'blue' | 'amber' | 'emerald' | 'purple';
  duration: string;
  location: string;
  image: string;
  description: string;
  stipend: string;
  eligibility: string;
  centerName: string;
  centerDistance: string;
  batchDate: string;
  openings: number;
}

export interface StepItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'mic' | 'book' | 'pin' | 'file';
  color: 'purple' | 'amber' | 'blue' | 'emerald';
  status: 'completed' | 'active' | 'pending';
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'training' | 'job' | 'enterprise' | 'center' | 'scheme' | 'progress';
  iconColor: string;
  bgColor: string;
  category: string;
}

export interface BeneficiaryData {
  name: string;
  avatarUrl: string;
  district: string;
  state: string;
  beneficiaryType: string;
  education: string;
  familyOccupation: string;
  lookingFor: string;
  progressPercent: number;
  gender?: "male" | "female" | "other";
  age?: number;
  ageCategory?: string;
  progressSteps: {
    title: string;
    status: 'completed' | 'active' | 'pending';
  }[];
}

export const CURRENT_BENEFICIARY: BeneficiaryData = {
  name: "Savitri Devi",
  avatarUrl: "/landingPage/person_1_landing.webp",
  district: "Kalahandi",
  state: "Odisha",
  beneficiaryType: "SC Beneficiary | PM-AJAY",
  education: "10th Pass",
  familyOccupation: "Agriculture",
  lookingFor: "Both (Job & Self-Employment)",
  gender: "female",
  age: 52,
  ageCategory: "50+ (Senior RPL & Master Artisan)",
  progressPercent: 60,
  progressSteps: [
    { title: "Profile Completed", status: "completed" },
    { title: "Skills Assessed", status: "completed" },
    { title: "Recommendations", status: "active" },
    { title: "Enrolled in Training", status: "pending" },
    { title: "Certification & Placement", status: "pending" },
  ]
};

export const RECOMMENDED_COURSES: CourseItem[] = [
  {
    id: "course-1",
    title: "Electrician (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "ELE/Q5901",
    badge: "High Demand",
    badgeColor: "blue",
    duration: "3 Months",
    location: "Kalahandi",
    image: "/dashboard/electrician.jpg",
    description: "Learn residential and commercial electrical wiring, circuit breaker installation, inverter setup, and domestic safety protocols.",
    stipend: "₹3,500/month (PM-AJAY Support)",
    eligibility: "10th Standard or equivalent",
    centerName: "PMKK Center, Bhawanipatna, Kalahandi",
    centerDistance: "14 km away",
    batchDate: "15 Oct 2026",
    openings: 35
  },
  {
    id: "course-2",
    title: "Tailoring & Apparel (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "AMH/Q0102",
    badge: "Suitable for You",
    badgeColor: "amber",
    duration: "6 Months",
    location: "Nearby Center",
    image: "/dashboard/tailoring.jpg",
    description: "Master modern garment drafting, machine embroidery, industrial stitching, and Self-Help Group (SHG) bulk order management.",
    stipend: "₹4,000/month + Free Sewing Kit on Completion",
    eligibility: "8th Standard onwards",
    centerName: "RSETI Rural Skill Hub, Junagarh Block",
    centerDistance: "6 km away",
    batchDate: "20 Oct 2026",
    openings: 28
  },
  {
    id: "course-3",
    title: "Food Processing (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "FIC/Q0103",
    badge: "Good Opportunity",
    badgeColor: "blue",
    duration: "4 Months",
    location: "District Level",
    image: "/dashboard/food_processing.jpg",
    description: "Training on organic food preservation, post-harvest packaging, pickle & squash manufacturing, and FSSAI hygiene standards.",
    stipend: "₹3,500/month + FPO Linkage",
    eligibility: "10th Standard or equivalent",
    centerName: "District Agri-Business Training Institute, Kalahandi",
    centerDistance: "18 km away",
    batchDate: "01 Nov 2026",
    openings: 22
  },
  {
    id: "course-4",
    title: "Solar PV Technician (Suryamitra)",
    nsqfLevel: 4,
    qpCode: "SGJ/Q0101",
    badge: "Fast Income",
    badgeColor: "amber",
    duration: "2 Months",
    location: "Bhawanipatna",
    image: "/dashboard/electrician.jpg",
    description: "Specialized training on rooftop solar panel installation, DC inverter connection, grid synchronization, and PM-KUSUM maintenance.",
    stipend: "₹4,500/month + Tool Kit Grant",
    eligibility: "10th Pass / ITI",
    centerName: "National Institute of Solar Energy Accredited Centre",
    centerDistance: "12 km away",
    batchDate: "10 Nov 2026",
    openings: 40
  },
  {
    id: "course-5",
    title: "Healthcare General Duty Assistant",
    nsqfLevel: 4,
    qpCode: "HSS/Q5101",
    badge: "High Demand",
    badgeColor: "blue",
    duration: "6 Months",
    location: "District Hospital",
    image: "/dashboard/food_processing.jpg",
    description: "Hospital patient care assistance, emergency vital checks, hygiene protocols, and bedside assistance in rural PHCs and clinics.",
    stipend: "₹3,800/month + Uniform Allowance",
    eligibility: "10th Standard pass",
    centerName: "District Red Cross & Skill Academy, Kalahandi",
    centerDistance: "15 km away",
    batchDate: "25 Oct 2026",
    openings: 30
  },
  {
    id: "course-6",
    title: "Handicraft & Bamboo Artisan",
    nsqfLevel: 3,
    qpCode: "HCS/Q7301",
    badge: "Micro-Enterprise",
    badgeColor: "emerald",
    duration: "3 Months",
    location: "Junagarh Hub",
    image: "/dashboard/tailoring.jpg",
    description: "Traditional and contemporary bamboo weaving, eco-friendly lifestyle product fabrication, and TRIFED export market linkage.",
    stipend: "₹3,000/month + ₹10,000 Raw Material Subsidy",
    eligibility: "Open to all artisans",
    centerName: "Tribal Artisan Development Centre, Junagarh",
    centerDistance: "8 km away",
    batchDate: "05 Nov 2026",
    openings: 25
  },
  {
    id: "course-7",
    title: "Mobile Hardware & SMD Diagnostics",
    nsqfLevel: 4,
    qpCode: "ELE/Q4605",
    badge: "High Growth",
    badgeColor: "blue",
    duration: "3 Months",
    location: "ITI Campus",
    image: "/dashboard/electrician.jpg",
    description: "Smartphone screen replacement, PCB micro-soldering, battery testing, software flashing, and rural mobile repair clinic setup.",
    stipend: "₹3,500/month + Diagnostic Kit",
    eligibility: "10th Pass",
    centerName: "Govt ITI Digital Skill Hub, Bhawanipatna",
    centerDistance: "11 km away",
    batchDate: "18 Oct 2026",
    openings: 20
  },
  {
    id: "course-8",
    title: "Organic Farming & Vermicompost Hub",
    nsqfLevel: 3,
    qpCode: "AGR/Q1201",
    badge: "PM-AJAY Grant",
    badgeColor: "emerald",
    duration: "1.5 Months",
    location: "Agri Vigyan Kendra",
    image: "/dashboard/food_processing.jpg",
    description: "Bio-fertilizer manufacturing, organic seed multiplication, pest bio-control, and direct supply tie-ups with 12 local FPOs.",
    stipend: "₹2,500/month + ₹35,000 Seed Capital Grant",
    eligibility: "Small & Marginal Farmers",
    centerName: "Krishi Vigyan Kendra (KVK) Kalahandi",
    centerDistance: "16 km away",
    batchDate: "12 Nov 2026",
    openings: 50
  },
  {
    id: "course-9",
    title: "Two-Wheeler EV Repair Technician",
    nsqfLevel: 4,
    qpCode: "ASC/Q1411",
    badge: "Emerging Tech",
    badgeColor: "purple",
    duration: "4 Months",
    location: "Rourkela Hub",
    image: "/dashboard/electrician.jpg",
    description: "Electric scooter BLDC motor diagnostics, lithium battery BMS troubleshooting, controller wiring, and fast charging setup.",
    stipend: "₹4,200/month + OEM Placement",
    eligibility: "10th Standard or basic mechanical background",
    centerName: "Automotive Skill Excellence Centre",
    centerDistance: "32 km away (Free Bus Pass)",
    batchDate: "28 Oct 2026",
    openings: 30
  },
  {
    id: "course-10",
    title: "Beauty & Wellness Therapist",
    nsqfLevel: 3,
    qpCode: "BWS/Q0102",
    badge: "Self-Employment",
    badgeColor: "amber",
    duration: "3 Months",
    location: "Women SHG Center",
    image: "/dashboard/tailoring.jpg",
    description: "Skin care, bridal grooming, herbal cosmetic treatments, and setting up village-level women beauty salons under Mudra loan.",
    stipend: "₹3,500/month + Beauty Parlour Starter Kit",
    eligibility: "8th Standard onwards",
    centerName: "Pragati Women Empowerment Hub, Dharmagarh",
    centerDistance: "9 km away",
    batchDate: "02 Nov 2026",
    openings: 35
  }
];

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "action-1",
    title: "Find Skill Training",
    subtitle: "NSQF-aligned courses near you",
    iconName: "training",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-100",
    category: "training"
  },
  {
    id: "action-2",
    title: "Explore Job Opportunities",
    subtitle: "Local and regional openings",
    iconName: "job",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-100",
    category: "jobs"
  },
  {
    id: "action-3",
    title: "Self-Employment Ideas",
    subtitle: "Business ideas and scheme support",
    iconName: "enterprise",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-100",
    category: "self_employment"
  },
  {
    id: "action-4",
    title: "Find Centers Near You",
    subtitle: "Training centers, common service centers",
    iconName: "center",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-100",
    category: "centers"
  },
  {
    id: "action-5",
    title: "Government Schemes",
    subtitle: "Financial aid & PM-AJAY grants",
    iconName: "scheme",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50 border-rose-100",
    category: "schemes"
  },
  {
    id: "action-6",
    title: "My Progress",
    subtitle: "Check certificate & application status",
    iconName: "progress",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-100",
    category: "progress"
  }
];

export const UPCOMING_STEPS: StepItem[] = [
  {
    id: "step-1",
    title: "Complete Skills Assessment",
    subtitle: "Take a short voice interview",
    iconName: "mic",
    color: "purple",
    status: "active"
  },
  {
    id: "step-2",
    title: "Explore Recommended Courses",
    subtitle: "Based on your interests",
    iconName: "book",
    color: "amber",
    status: "pending"
  },
  {
    id: "step-3",
    title: "Visit Nearest Training Center",
    subtitle: "Get location and details",
    iconName: "pin",
    color: "blue",
    status: "pending"
  },
  {
    id: "step-4",
    title: "Apply for Support Schemes",
    subtitle: "Financial support and benefits",
    iconName: "file",
    color: "emerald",
    status: "pending"
  }
];

export const SCHEMES_LIST = [
  {
    id: "pm-ajay",
    name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)",
    grantAmount: "Up to ₹50,000 Direct Subsidy",
    category: "Livelihood & Skill Development",
    eligibility: "SC beneficiary households with annual income < ₹2.5 Lakhs",
    benefits: ["100% Free NSQF Level 3-5 Skill Training", "Monthly stipend of ₹3,500 during course", "Seed grant for micro-enterprise equipment"],
    status: "Eligible & Pre-Approved"
  },
  {
    id: "pm-mudra",
    name: "Pradhan Mantri Mudra Yojana (Shishu Loan)",
    grantAmount: "Up to ₹50,000 Collateral-Free Loan",
    category: "Self-Employment Capital",
    eligibility: "Rural artisans, mechanics, tailoring entrepreneurs",
    benefits: ["Zero collateral security", "Low subsidized interest rate", "Direct disbursement to Jan Dhan account"],
    status: "Application Ready"
  },
  {
    id: "pm-daksh",
    name: "PM-DAKSH Portal Upskilling Scheme",
    grantAmount: "Full Tuition + ₹2,500 Wage Compensation",
    category: "Advanced Technology Training",
    eligibility: "SC / OBC / Sanitation Workers",
    benefits: ["Certified by National Skill Development Corporation", "On-The-Job Training (OJT) placement linkage"],
    status: "Active"
  }
];

export interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogoType: "shree" | "sakhi" | "ahaar" | "odisha" | "default";
  type: string;
  location: string;
  salary: string;
  badge: string;
  badgeColor: "emerald" | "purple" | "blue" | "amber";
  badgeIcon: "star" | "thumbs_up" | "chart" | "building";
  image: string;
  skills: string[];
  category: "all" | "government" | "private" | "apprenticeship" | "self_employment";
  description: string;
  openings: number;
  experience: string;
  benefits: string[];
  contactPhone: string;
  verifiedNCS: boolean;
  sectorId?: string;
  sectorName?: string;
  nsqfLevel?: number;
  qpCode?: string;
  trainingCourseId?: string;
  trainingCourseTitle?: string;
  subsidyGrant?: string;
  urgency?: "immediate" | "high" | "normal";
  voiceKeywords?: string[];
  district?: string;
  state?: string;
  salaryNumericMin?: number;
  salaryNumericMax?: number;
}

import { COMPREHENSIVE_JOBS_DATABASE } from "@/lib/jobOpportunityGenerator";

export const RECOMMENDED_JOBS: JobItem[] = COMPREHENSIVE_JOBS_DATABASE;


