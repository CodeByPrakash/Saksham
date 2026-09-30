import { CourseItem, RECOMMENDED_COURSES } from "@/components/dashboard/DashboardShared";
import { BeneficiaryProfileData } from "@/components/onboarding/PersonalVoiceOnboarding";

export type TrainingCategory =
  | "all"
  | "technical"
  | "agriculture"
  | "service"
  | "self_employment"
  | "digital_construction"
  | "healthcare";

export interface NSQFCourseExtra extends CourseItem {
  category: TrainingCategory;
  sectorId: string;
  sectorName: string;
  shortDesc: string;
  isDetectedSkill?: boolean;
  detectedReason?: string;
  syllabusModules?: {
    title: string;
    duration: string;
    topics: string[];
  }[];
  careerOutcomes?: string[];
  subsidyGrantAmount?: string;
  wageRange?: string;
  microEnterpriseRange?: string;
  aiInsights?: string;
}

export interface SectorDefinition {
  id: string;
  name: string;
  shortName: string;
  iconName: "wrench" | "sprout" | "sparkles" | "heart" | "laptop" | "store";
  badgeColor: "blue" | "emerald" | "amber" | "purple";
  gradient: string;
  description: string;
  category: TrainingCategory;
}

export const SECTOR_DEFINITIONS: SectorDefinition[] = [
  {
    id: "all",
    name: "All Training Programs",
    shortName: "All",
    iconName: "sparkles",
    badgeColor: "purple",
    gradient: "from-purple-600 to-indigo-600",
    description: "Explore all verified NSQF certification courses and PM-AJAY subsidized livelihood programs.",
    category: "all"
  },
  {
    id: "green_energy_tech",
    name: "Green Energy & Technical Trades",
    shortName: "Green Tech",
    iconName: "wrench",
    badgeColor: "blue",
    gradient: "from-blue-600 to-cyan-600",
    description: "Solar PV, EV repair, submersible pump rewinding, biogas, and electrical maintenance.",
    category: "technical"
  },
  {
    id: "agriculture_allied",
    name: "Agriculture & Allied Enterprise",
    shortName: "Agri-Allied",
    iconName: "sprout",
    badgeColor: "emerald",
    gradient: "from-emerald-600 to-teal-600",
    description: "Kisan drones, mushroom cultivation, organic vermicomposting, dairy, and polyhouses.",
    category: "agriculture"
  },
  {
    id: "crafts_textiles",
    name: "Handicrafts & Women SHG",
    shortName: "Crafts & SHG",
    iconName: "store",
    badgeColor: "amber",
    gradient: "from-amber-500 to-orange-600",
    description: "Jacquard handloom weaving, bamboo crafts, tailoring boutiques, and jute packaging.",
    category: "self_employment"
  },
  {
    id: "healthcare_services",
    name: "Healthcare & Community Welfare",
    shortName: "Healthcare",
    iconName: "heart",
    badgeColor: "purple",
    gradient: "from-purple-600 to-pink-600",
    description: "General Duty Assistants (GDA), telemedicine operators, Ayush therapy, and elderly care.",
    category: "healthcare"
  },
  {
    id: "digital_construction",
    name: "Digital, Infrastructure & Construction",
    shortName: "Digital & Infra",
    iconName: "laptop",
    badgeColor: "blue",
    gradient: "from-indigo-600 to-blue-700",
    description: "CSC e-Gram digital centers, solar CCTV installer, plumbing RO plants, and modern masonry.",
    category: "digital_construction"
  },
  {
    id: "micro_enterprise_grants",
    name: "Agro-Mills & PM-AJAY Grants",
    shortName: "Agro-Mills",
    iconName: "store",
    badgeColor: "emerald",
    gradient: "from-emerald-600 to-amber-600",
    description: "Cold-press oil expellers, spice pulverizers, millet bakeries, and logistics hubs.",
    category: "self_employment"
  }
];

export interface SkillKnowledgeBaseItem {
  keywords: string[];
  title: string;
  nsqfLevel: number;
  qpCode: string;
  category: TrainingCategory;
  sectorId: string;
  sectorName: string;
  badge: string;
  badgeColor: "blue" | "amber" | "emerald" | "purple";
  duration: string;
  image: string;
  description: string;
  stipend: string;
  eligibility: string;
  shortDesc: string;
  subsidyGrantAmount: string;
  wageRange: string;
  microEnterpriseRange: string;
  aiInsights: string;
  careerOutcomes: string[];
  syllabusModules: {
    title: string;
    duration: string;
    topics: string[];
  }[];
}

export const COMPREHENSIVE_SKILL_KNOWLEDGE_BASE: Record<string, SkillKnowledgeBaseItem> = {
  // ==========================================
  // 1. GREEN ENERGY & TECHNICAL TRADES
  // ==========================================
  solar_agri_pump: {
    keywords: ["solar", "pump", "submersible", "agri-pump", "motor rewinding", "borewell", "irrigation pump", "solar pv"],
    title: "Solar PV Agri-Pump Specialist (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "ELE/Q5901",
    category: "technical",
    sectorId: "green_energy_tech",
    sectorName: "Green Energy & Technical Trades",
    badge: "PM-AJAY Skill Match",
    badgeColor: "emerald",
    duration: "3.5 Months",
    image: "/dashboard/electrician.jpg",
    description: "Specialized training in solar-powered submersible pumps, BLDC controller wiring, inverter maintenance, and PM-KUSUM / PM-AJAY farm solar installations.",
    stipend: "₹3,500/month (PM-AJAY DBT Support) + ₹35,000 Tool Kit Grant",
    eligibility: "10th Standard or Vocational ITI",
    shortDesc: "Borewell solar pump installation, inverter repair & PM-KUSUM diagnostics.",
    subsidyGrantAmount: "₹35,000 Micro-Enterprise Capital Subsidy",
    wageRange: "₹18,000 – ₹28,000 / mo",
    microEnterpriseRange: "₹30,000 – ₹55,000 / mo",
    aiInsights: "High regional demand across Kalahandi & Sundargarh farm clusters under PM-KUSUM solarization scheme.",
    careerOutcomes: [
      "Solar Pump Service Center Entrepreneur",
      "PM-KUSUM Authorized Rural Installation Contractor",
      "Average Monthly Earnings: ₹25,000 – ₹45,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: High-Voltage Safety & Solar PV Array Setup",
        duration: "45 Hours",
        topics: [
          "DC/AC disconnect safety and lightning arrester grounding",
          "Monocrystalline panel mounting, tilt calibration & MPPT wiring",
          "Electrical hazard protection and BIS compliance protocols"
        ]
      },
      {
        title: "Module 2: Submersible Pump Diagnostics & Motor Rewinding",
        duration: "130 Hours",
        topics: [
          "Borewell pump impeller assembly and mechanical seal replacement",
          "BLDC submersible motor winding and insulation resistance testing",
          "Controller firmware configuration and low-sunlight voltage boosting"
        ]
      },
      {
        title: "Module 3: Digital Monitoring, Invoicing & Financial Schemes",
        duration: "35 Hours",
        topics: [
          "IoT remote monitoring app setup and fault code analysis",
          "UPI digital collections and DigiLocker service warranty cards",
          "PM-AJAY grant claim filing and Mudra loan documentation"
        ]
      },
      {
        title: "Module 4: Field Apprenticeship & Micro-Enterprise Launch",
        duration: "140 Hours",
        topics: [
          "Live installation at 5+ village farm borewell clusters",
          "Customer relationship and annual maintenance contract (AMC) setup",
          "NSDC Skill India Certificate & PM-AJAY Enterprise Launch"
        ]
      }
    ]
  },

  solar_rooftop_tech: {
    keywords: ["rooftop solar", "suryamitra", "grid connected", "solar installer", "panel installation", "solar technician"],
    title: "Solar Rooftop & Micro-Grid Technician (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "SGJ/Q0101",
    category: "technical",
    sectorId: "green_energy_tech",
    sectorName: "Green Energy & Technical Trades",
    badge: "High Demand",
    badgeColor: "blue",
    duration: "3 Months",
    image: "/dashboard/electrician.jpg",
    description: "Certified Suryamitra program covering residential rooftop solar structures, on-grid string inverters, net-metering synchronization, and battery storage banks.",
    stipend: "₹4,500/month (PM-AJAY Stipend) + Rooftop Tool Kit",
    eligibility: "10th Pass / ITI Electrical",
    shortDesc: "Rooftop solar PV assembly, net metering & PM Surya Ghar Muft Bijli Yojana installation.",
    subsidyGrantAmount: "₹35,000 Capital Subsidy for Solar Tooling",
    wageRange: "₹16,000 – ₹25,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹50,000 / mo",
    aiInsights: "Direct recruitment tie-up with PM Surya Ghar Muft Bijli Yojana rooftop installation vendors.",
    careerOutcomes: [
      "Certified Suryamitra Solar Installation Lead",
      "Rooftop Solar Maintenance Contractor",
      "Average Monthly Earnings: ₹22,000 – ₹40,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Rooftop Structural Assessment & Civil Anchoring",
        duration: "40 Hours",
        topics: [
          "Roof load-bearing analysis and shade path mapping",
          "Hot-dip galvanized structure assembly and weatherproofing",
          "Fall-arrest harness safety and OHSAS rooftop protocols"
        ]
      },
      {
        title: "Module 2: String Inverters & Bi-directional Net Metering",
        duration: "130 Hours",
        topics: [
          "String sizing, DC fuse protection and lightning arresters",
          "Discom net-metering synchronization and anti-islanding tests",
          "Earth pit resistance testing (below 5 Ohms benchmark)"
        ]
      },
      {
        title: "Module 3: Battery Energy Storage Systems (BESS)",
        duration: "35 Hours",
        topics: [
          "Lithium Iron Phosphate (LFP) vs Tubular gel battery charging",
          "Hybrid inverter programming and critical load management",
          "Digital energy audits and customer savings calculations"
        ]
      },
      {
        title: "Module 4: Discom Inspection & Enterprise Accreditation",
        duration: "145 Hours",
        topics: [
          "Practical commissioning of 10kW residential rooftop plants",
          "Discom CEIG safety approval documentation",
          "NSDC Skill India Certification & Vendor Registration"
        ]
      }
    ]
  },

  ev_servicing: {
    keywords: ["ev", "electric vehicle", "battery", "e-rickshaw", "2-wheeler ev", "scooter repair", "auto rickshaw ev"],
    title: "Electric Vehicle (EV) 2W/3W & E-Rickshaw Technician (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "AUT/Q0101",
    category: "technical",
    sectorId: "green_energy_tech",
    sectorName: "Green Energy & Technical Trades",
    badge: "Emerging Tech",
    badgeColor: "purple",
    duration: "4 Months",
    image: "/dashboard/electrician.jpg",
    description: "Hands-on diagnostic training for electric 2-wheelers, 3-wheelers (E-Rickshaws), BLDC hub motors, battery management systems (BMS), and charging infrastructure.",
    stipend: "₹3,500/month (PM-AJAY Stipend) + EV Diagnostic Tool Kit",
    eligibility: "10th Standard Pass",
    shortDesc: "E-rickshaw controller repair, Li-ion cell testing & EV charging setups.",
    subsidyGrantAmount: "₹40,000 Micro-Enterprise Grant for EV Garage",
    wageRange: "₹18,000 – ₹30,000 / mo",
    microEnterpriseRange: "₹35,000 – ₹60,000 / mo",
    aiInsights: "Rapid expansion of E-rickshaw fleets in district transit hubs creates high recurring maintenance demand.",
    careerOutcomes: [
      "Authorized EV Service Station Owner",
      "E-Rickshaw Fleet Maintenance Contractor",
      "Average Monthly Earnings: ₹25,000 – ₹48,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: High-Voltage Safety & EV Powertrain Architecture",
        duration: "40 Hours",
        topics: [
          "High voltage safety equipment, insulated tools and hazard lockouts",
          "EV powertrain components: Motor, Inverter, BMS, DC-DC converter",
          "Wiring harness inspection and thermal management systems"
        ]
      },
      {
        title: "Module 2: Lithium-ion Battery Packs & Cell Balancing",
        duration: "120 Hours",
        topics: [
          "18650/21700 cell impedance testing and capacity degradation analysis",
          "BMS circuit troubleshooting, temperature sensor diagnostics",
          "Safe battery pack fabrication, spot welding and fire protection"
        ]
      },
      {
        title: "Module 3: BLDC Hub Motor & Smart Controller Repair",
        duration: "60 Hours",
        topics: [
          "Hall effect sensor replacement and oscilloscope phase testing",
          "Regenerative braking system calibration and throttle sensor tuning",
          "AC and DC charging port diagnostics (Type-2 and Bharat EV AC-001)"
        ]
      },
      {
        title: "Module 4: EV Garage Business & Franchise Management",
        duration: "130 Hours",
        topics: [
          "Establishing a rural EV quick-repair bay with solar backup",
          "Spare parts supply chain integration via OEM platforms",
          "National Skill Qualification Certificate in EV Maintenance"
        ]
      }
    ]
  },

  biogas_plant_operator: {
    keywords: ["biogas", "cbg", "gobar dhan", "bio-gas", "waste to energy", "slurry", "methane"],
    title: "Biogas & Rural Waste-to-Energy Plant Operator (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "SGJ/Q0601",
    category: "technical",
    sectorId: "green_energy_tech",
    sectorName: "Green Energy & Technical Trades",
    badge: "GOBAR-dhan Scheme",
    badgeColor: "emerald",
    duration: "3 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Operational management of community biogas digesters, cattle manure slurry feeding, methane purification, bottling, and bio-slurry fertilizer bagging.",
    stipend: "₹3,500/month + Plant Safety Kit",
    eligibility: "8th / 10th Standard",
    shortDesc: "Biogas digester maintenance, GOBAR-dhan compressed gas bottling & enriched slurry packaging.",
    subsidyGrantAmount: "₹45,000 Capital Subsidy for Community Bio-Gas Unit",
    wageRange: "₹15,000 – ₹24,000 / mo",
    microEnterpriseRange: "₹26,000 – ₹45,000 / mo",
    aiInsights: "Aligned with Swachh Bharat Mission (Grameen) and GOBAR-dhan clean cooking fuel initiative.",
    careerOutcomes: [
      "Village Biogas Plant Chief Operator",
      "Organic Bio-Slurry Fertilizer Supplier",
      "Average Monthly Earnings: ₹20,000 – ₹36,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Anaerobic Digestion Principles & Feedstock Mixing",
        duration: "35 Hours",
        topics: [
          "Cattle dung, agri-residue and organic waste slurry ratios",
          "pH, temperature (35°C mesophilic range) and C:N ratio monitoring",
          "Digester leak detection using combustible gas detectors"
        ]
      },
      {
        title: "Module 2: Gas Purification & Moisture Scrubbing",
        duration: "120 Hours",
        topics: [
          "H2S biological scrubber and silica gel moisture separator maintenance",
          "Pressure regulation valves and gas flow meter calibration",
          "Piped biogas distribution network to 50+ village households"
        ]
      },
      {
        title: "Module 3: Enriched Fermented Organic Manure (FOM) Processing",
        duration: "45 Hours",
        topics: [
          "Solid-liquid decanter separator operation for digested slurry",
          "Enrichment with Trichoderma and Phosphate Solubilizing Bacteria (PSB)",
          "Moisture reduction, bagging and FCO compliance standards"
        ]
      },
      {
        title: "Module 4: Commercial Plant Safety & SHG Revenue Model",
        duration: "150 Hours",
        topics: [
          "Hazard containment and explosive gas safety protocols",
          "Subscription billing model for clean cooking gas supply",
          "Skill India Certified Biogas Operator Qualification"
        ]
      }
    ]
  },

  // ==========================================
  // 2. AGRICULTURE, HORTICULTURE & ALLIED
  // ==========================================
  drone_pilot_agri: {
    keywords: ["drone", "uav", "spraying", "kisan drone", "aerial", "remote pilot", "drone operator"],
    title: "Kisan Drone Pilot & Crop Health Analyst (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "AGR/Q4901",
    category: "agriculture",
    sectorId: "agriculture_allied",
    sectorName: "Agriculture & Allied Enterprise",
    badge: "DGCA Certified",
    badgeColor: "purple",
    duration: "3 Months",
    image: "/dashboard/electrician.jpg",
    description: "Certified DGCA & NSDC drone pilot training covering precision nano-urea/pesticide crop spraying, flight simulation, battery safety, and micro-drone repair.",
    stipend: "₹3,500/month (PM-AJAY Stipend) + DGCA Pilot License",
    eligibility: "10th Pass + Valid Aadhaar / Age 18+",
    shortDesc: "DGCA Kisan drone flight control, nano-urea spraying & drone repairs.",
    subsidyGrantAmount: "₹50,000 Capital Subsidy for Drone SHG Hub",
    wageRange: "₹20,000 – ₹32,000 / mo",
    microEnterpriseRange: "₹35,000 – ₹65,000 / mo",
    aiInsights: "High per-acre spraying fees (₹400–₹600/acre) enable immediate positive cash flow for certified pilots.",
    careerOutcomes: [
      "Commercial Kisan Drone Operator (Per-acre spraying model)",
      "Custom Hiring Center (CHC) Drone Entrepreneur",
      "Average Monthly Earnings: ₹28,000 – ₹55,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: DGCA Regulations, Airspace & Flight Physics",
        duration: "40 Hours",
        topics: [
          "DGCA DigitalSky clearance protocols and geo-fencing",
          "Aerodynamics, payload balance and emergency return-to-home (RTH)",
          "Lithium-polymer battery safety, thermal runaway prevention"
        ]
      },
      {
        title: "Module 2: Precision Agricultural Spraying & Sensor Calibration",
        duration: "120 Hours",
        topics: [
          "Nozzle selection (centrifugal vs hydraulic) for nano-urea and bio-inputs",
          "Autonomous waypoint mission planning via GIS ground control software",
          "Multispectral crop health indexing and field boundary mapping"
        ]
      },
      {
        title: "Module 3: Drone Hardware Maintenance & Soldering",
        duration: "40 Hours",
        topics: [
          "Brushless DC motor replacement, ESC calibration and propeller balancing",
          "Flight controller soldering and sensor diagnostic tests",
          "Field repairs and IP-rated waterproof casing maintenance"
        ]
      },
      {
        title: "Module 4: Commercial Spraying Operations & SHG Linkage",
        duration: "150 Hours",
        topics: [
          "100+ Acre field flight logging under certified flight instructor",
          "Farmer cluster service contracts and digital billing via FPO app",
          "DGCA Remote Pilot Certificate (RPC) issuance"
        ]
      }
    ]
  },

  organic_mushroom: {
    keywords: ["mushroom", "spawn", "organic", "horticulture", "vermicompost", "farming", "crop", "fungi"],
    title: "Commercial Mushroom & Spawn Production (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "AGR/Q0801",
    category: "agriculture",
    sectorId: "agriculture_allied",
    sectorName: "Agriculture & Allied Enterprise",
    badge: "High Profit",
    badgeColor: "emerald",
    duration: "3 Months",
    image: "/dashboard/food_processing.jpg",
    description: "High-yield cultivation of Oyster, Button and Milky mushrooms, sterile substrate sterilization, master spawn creation, and drying/packaging for urban retail.",
    stipend: "₹3,500/month (PM-AJAY Support) + Free Spawn Culture Starter",
    eligibility: "8th / 10th Standard Pass",
    shortDesc: "Sterile spawn preparation, temperature climate chambers & value added sales.",
    subsidyGrantAmount: "₹35,000 Capital Subsidy for Mushroom Shed Construction",
    wageRange: "₹14,000 – ₹22,000 / mo",
    microEnterpriseRange: "₹25,000 – ₹48,000 / mo",
    aiInsights: "Year-round indoor production cycle unaffected by erratic seasonal rainfall or weather shocks.",
    careerOutcomes: [
      "Commercial Mushroom Farm & Spawn Lab Entrepreneur",
      "FPO Value-Added Mushroom Powder Supplier",
      "Average Monthly Earnings: ₹22,000 – ₹40,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Substrate Preparation & Sterile Autoclaving",
        duration: "35 Hours",
        topics: [
          "Paddy straw and sawdust pasteurization techniques",
          "pH balance and moisture monitoring for maximum biological efficiency",
          "Sterile lab protocols and contamination identification (Trichoderma prevention)"
        ]
      },
      {
        title: "Module 2: Inoculation, Spawn Production & Cropping Chambers",
        duration: "110 Hours",
        topics: [
          "Grain master spawn preparation using Laminar Air Flow hoods",
          "Bag filling, spawning ratios and dark-room mycelium running",
          "Cropping room relative humidity (RH 85-90%) and temperature automation"
        ]
      },
      {
        title: "Module 3: Harvesting, Solar Dehydration & Value Addition",
        duration: "45 Hours",
        topics: [
          "Clean pinhead harvesting and grading (Grade A, B, C standards)",
          "Solar dehydration for mushroom chips, powder and pickle formulation",
          "FSSAI compliance, vacuum packaging and barcode labeling"
        ]
      },
      {
        title: "Module 4: Market Linkages, TRIFED & PM-AJAY SHG Scale-up",
        duration: "130 Hours",
        topics: [
          "Direct B2B supply contracts with local restaurants and supermarkets",
          "Online sales via ONDC and organic wholesale mandis",
          "NSDC Certification & PM-AJAY Mushroom Enterprise Establishment"
        ]
      }
    ]
  },

  dairy_processing: {
    keywords: ["dairy", "milk", "chilling", "paneer", "ghee", "curd", "livestock", "cow", "buffalo", "dairy farm"],
    title: "Dairy Processing & Milk Value-Addition Hub (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "AGR/Q4101",
    category: "agriculture",
    sectorId: "agriculture_allied",
    sectorName: "Agriculture & Allied Enterprise",
    badge: "Daily Cash Flow",
    badgeColor: "blue",
    duration: "3.5 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Clean milk harvesting, bulk milk chilling unit (BMC) operation, paneer, ghee, curd and flavored milk production, testing fat/SNF, and cold-chain marketing.",
    stipend: "₹3,500/month + Dairy Testing Kit",
    eligibility: "10th Standard Pass",
    shortDesc: "Bulk milk chilling, fat/SNF testing & organic ghee/paneer manufacturing.",
    subsidyGrantAmount: "₹45,000 Capital Subsidy for Mini Milk Chilling Unit",
    wageRange: "₹16,000 – ₹26,000 / mo",
    microEnterpriseRange: "₹30,000 – ₹55,000 / mo",
    aiInsights: "Provides guaranteed daily morning & evening cash collections for rural dairy producers.",
    careerOutcomes: [
      "Village Milk Collection & Value-Addition Center Owner",
      "Dairy Cooperative Quality Controller",
      "Average Monthly Earnings: ₹26,000 – ₹50,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Hygienic Milk Sourcing & Adulteration Testing",
        duration: "40 Hours",
        topics: [
          "Automated ultrasonic milk analyzer operation (Fat & SNF measurement)",
          "Screening for common adulterants (urea, starch, detergent, water)",
          "Clean milking machine operation and stainless steel can sterilization"
        ]
      },
      {
        title: "Module 2: Bulk Chilling & Pasteurization Standards",
        duration: "120 Hours",
        topics: [
          "Bulk milk cooler (BMC 4°C chilling) compressor maintenance",
          "Batch pasteurizer operation and cream separator calibration",
          "Cold chain logistics from village center to district dairy plant"
        ]
      },
      {
        title: "Module 3: Ghee, Paneer & Probiotic Curd Production",
        duration: "50 Hours",
        topics: [
          "Traditional bilona ghee processing and moisture reduction",
          "Acid coagulation for high-yield fresh paneer pressing",
          "Controlled incubation for probiotic curd and buttermilk bottling"
        ]
      },
      {
        title: "Module 4: FSSAI Compliance & Brand Launch",
        duration: "140 Hours",
        topics: [
          "Food safety management systems (FSMS) and cold storage hygiene",
          "Branded pouch packing and daily retail route distribution",
          "NSDC Skill India Certificate & PM-AJAY Dairy Grant Sanction"
        ]
      }
    ]
  },

  apiculture_honey: {
    keywords: ["honey", "bee", "beekeeping", "apiculture", "wax", "hive", "honeybee"],
    title: "Commercial Honey Bee Keeping & Processing (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "AGR/Q1101",
    category: "agriculture",
    sectorId: "agriculture_allied",
    sectorName: "Agriculture & Allied Enterprise",
    badge: "KVIC Supported",
    badgeColor: "amber",
    duration: "2 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Scientific apiculture using modern Langstroth bee boxes, seasonal flora migration, royal jelly extraction, bee wax refinement, and purity certification.",
    stipend: "₹3,000/month + 2 Free Bee Colony Boxes",
    eligibility: "Functional Literacy",
    shortDesc: "Langstroth bee box rearing, pure raw honey extraction & bee wax candle making.",
    subsidyGrantAmount: "₹30,000 KVIC / PM-AJAY Grant for 10 Bee Boxes",
    wageRange: "₹12,000 – ₹20,000 / mo",
    microEnterpriseRange: "₹24,000 – ₹42,000 / mo",
    aiInsights: "Boosts surrounding crop pollination yields by 20–30% while creating high-margin pure honey revenue.",
    careerOutcomes: [
      "Commercial Apiary Owner & Honey Producer",
      "Organic Bee Wax & Royal Jelly Supplier",
      "Average Monthly Earnings: ₹20,000 – ₹38,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Honey Bee Species & Colony Dynamics",
        duration: "30 Hours",
        topics: [
          "Identification of Apis cerana indica and Apis mellifera",
          "Queen bee rearing, worker roles and drone management",
          "Seasonal floral calendar mapping in tribal forest fringes"
        ]
      },
      {
        title: "Module 2: Hive Inspection & Disease Prevention",
        duration: "90 Hours",
        topics: [
          "Using smokers, hive tools and protective bee veils",
          "Mite prevention (Varroa control) and organic hive sanitization",
          "Swarm prevention and artificial colony division techniques"
        ]
      },
      {
        title: "Module 3: Honey Extraction, Filtration & Wax Processing",
        duration: "40 Hours",
        topics: [
          "Centrifugal stainless steel honey extractor operation",
          "Multi-stage mesh filtering and moisture reduction (under 20% standard)",
          "Bee wax melting, purification and cosmetic grade slab preparation"
        ]
      },
      {
        title: "Module 4: Agmark Certification & Honey Brand Marketing",
        duration: "100 Hours",
        topics: [
          "Agmark purity testing and pollen profile verification",
          "Glass jar packaging, anti-tamper sealing and organic brand creation",
          "NSDC Apiculture Certificate & PM-AJAY Livelihood Grant"
        ]
      }
    ]
  },

  // ==========================================
  // 3. HANDICRAFTS, TRADITIONAL TEXTILES & SHG
  // ==========================================
  handloom_jacquard: {
    keywords: ["handloom", "weaving", "jacquard", "textile", "saree", "embroidery", "garment", "sewing", "loom"],
    title: "Jacquard Handloom & Traditional Textile Master (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "TSC/Q2201",
    category: "self_employment",
    sectorId: "crafts_textiles",
    sectorName: "Handicrafts & Women SHG",
    badge: "GI Tag Linked",
    badgeColor: "amber",
    duration: "4 Months",
    image: "/dashboard/tailoring.jpg",
    description: "Advanced pit-loom and frame-loom weaving, jacquard card punching, organic vegetable dye extraction, and high-value ethnic motif development for export.",
    stipend: "₹3,500/month (PM-AJAY Stipend) + Weaving Yarn Subsidy",
    eligibility: "Basic Literacy / 8th Standard",
    shortDesc: "Jacquard design punching, organic herbal dyeing & e-commerce handloom export.",
    subsidyGrantAmount: "₹45,000 Capital Subsidy for Modern Jacquard Loom",
    wageRange: "₹15,000 – ₹25,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹55,000 / mo",
    aiInsights: "Direct buyer linkage with TRIFED, FabIndia, and international GI-tagged handloom exhibitions.",
    careerOutcomes: [
      "Master Handloom Artisan & Weaver Cooperative Lead",
      "Direct Artisan Seller on TRIFED, Amazon Karigar & ONDC",
      "Average Monthly Earnings: ₹25,000 – ₹45,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Yarn Sizing, Warping & Loom Drafting",
        duration: "40 Hours",
        topics: [
          "Yarn count identification (Cotton, Tussar Silk, Linen blends)",
          "Sectional warping and reed drafting calculations",
          "Eco-friendly scouring, bleaching and organic vegetable dyeing"
        ]
      },
      {
        title: "Module 2: Jacquard Harness & Graph Design Punching",
        duration: "130 Hours",
        topics: [
          "Translating traditional tribal motifs into jacquard punch cards",
          "Tension control, shuttle throwing and double-cloth construction",
          "Zero-defect weaving and selvedge perfection protocols"
        ]
      },
      {
        title: "Module 3: Garment Tailoring, Finishing & Quality Control",
        duration: "45 Hours",
        topics: [
          "Fabric pre-shrinking, steam iron calendering and stain removal",
          "Contemporary designer cut: Stoles, Kurtas, Sarees and Home Furnishings",
          "Handloom Mark and Silk Mark GI tag certification standards"
        ]
      },
      {
        title: "Module 4: Craft Exports, ONDC Listing & Cooperative Formation",
        duration: "135 Hours",
        topics: [
          "Digital product photography and cataloging on e-commerce platforms",
          "Participation in Saras Mela, Dilli Haat and National Handloom Expos",
          "NSQF Level 4 Handloom Certification & PM-AJAY Grant Sanction"
        ]
      }
    ]
  },

  bamboo_craft_design: {
    keywords: ["bamboo", "craft", "furniture", "cane", "artisan", "weaving", "woodcraft", "mat"],
    title: "Bamboo Craft Design & Eco-Lifestyle Products (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "HCS/Q8701",
    category: "self_employment",
    sectorId: "crafts_textiles",
    sectorName: "Handicrafts & Women SHG",
    badge: "Eco-Friendly",
    badgeColor: "emerald",
    duration: "3 Months",
    image: "/dashboard/tailoring.jpg",
    description: "Treatment of raw bamboo species, seasoning, mechanical splitting, fine slivering, and manufacturing eco-friendly lifestyle furniture, lampshades, and baskets.",
    stipend: "₹3,000/month + ₹10,000 Raw Material Grant",
    eligibility: "Open to all Artisans & Youth",
    shortDesc: "Bamboo chemical seasoning, fine sliver weaving & contemporary eco-furniture design.",
    subsidyGrantAmount: "₹35,000 Capital Subsidy for Bamboo Tooling Unit",
    wageRange: "₹14,000 – ₹22,000 / mo",
    microEnterpriseRange: "₹25,000 – ₹45,000 / mo",
    aiInsights: "Growing urban demand for sustainable plastic-free bamboo homeware and decor.",
    careerOutcomes: [
      "Bamboo Lifestyle Product Studio Owner",
      "TRIFED Master Artisan Supplier",
      "Average Monthly Earnings: ₹22,000 – ₹38,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Bamboo Harvesting & Chemical Seasoning",
        duration: "35 Hours",
        topics: [
          "Selection of mature bamboo (Bambusa balcooa, Dendrocalamus strictus)",
          "Boric-Borax chemical preservation to prevent borer attack",
          "Solar drying kiln operation for optimal moisture content"
        ]
      },
      {
        title: "Module 2: Mechanical Slicing & Precision Sliver Weaving",
        duration: "120 Hours",
        topics: [
          "Electric bamboo sliver machine operation and thickness gauging",
          "Radial and circular weaving for lampshades, baskets and planters",
          "Jointing techniques using wooden dowels and organic resins"
        ]
      },
      {
        title: "Module 3: Contemporary Furniture Fabrication & Polishing",
        duration: "45 Hours",
        topics: [
          "Bending bamboo poles using blow-torch heat techniques",
          "Eco-friendly polyurethane finishing and water-resistant polishing",
          "Quality testing for structural load-bearing and aesthetics"
        ]
      },
      {
        title: "Module 4: E-Commerce Cataloging & Craft Fair Exhibitions",
        duration: "140 Hours",
        topics: [
          "Product photography for Amazon Karigar and Etsy marketplace",
          "Packaging design using biodegradable corrugated boxes",
          "NSDC Skill India Certificate & PM-AJAY Tool Kit Disbursal"
        ]
      }
    ]
  },

  tailoring_boutique: {
    keywords: ["tailor", "sewing", "stitching", "boutique", "fashion", "garment", "dressmaker", "embroidery"],
    title: "Tailoring, Garment Making & Fashion Boutique (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "AMH/Q0102",
    category: "self_employment",
    sectorId: "crafts_textiles",
    sectorName: "Handicrafts & Women SHG",
    badge: "100% Women SHG",
    badgeColor: "amber",
    duration: "6 Months",
    image: "/dashboard/tailoring.jpg",
    description: "Master modern garment drafting, machine embroidery, industrial motorized stitching, and Self-Help Group (SHG) bulk school uniform / hospital linen orders.",
    stipend: "₹4,000/month + Free Motorized Sewing Machine on Completion",
    eligibility: "8th Standard onwards",
    shortDesc: "Commercial garment drafting, motorized sewing & SHG boutique establishment.",
    subsidyGrantAmount: "₹35,000 Capital Subsidy for Boutique Studio",
    wageRange: "₹12,000 – ₹20,000 / mo",
    microEnterpriseRange: "₹22,000 – ₹45,000 / mo",
    aiInsights: "Immediate local revenue through school uniform contracts and wedding season designer apparel.",
    careerOutcomes: [
      "Village Fashion Boutique & Stitching Studio Owner",
      "SHG Bulk Uniform Manufacturing Lead",
      "Average Monthly Earnings: ₹20,000 – ₹38,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Pattern Drafting & Fabric Anatomy",
        duration: "50 Hours",
        topics: [
          "Body measurement standards and pattern drafting on cardboard",
          "Grain line identification and fabric layout to minimize wastage",
          "Sewing machine maintenance, bobbin winding and tension tuning"
        ]
      },
      {
        title: "Module 2: Industrial Motorized Stitching & Overlocking",
        duration: "150 Hours",
        topics: [
          "Operating single needle lockstitch and 4-thread overlock machines",
          "Stitching blouses, kurtis, trousers, shirts and children garments",
          "Piping, zipper insertion, buttonhole making and collar attachment"
        ]
      },
      {
        title: "Module 3: Surface Ornamentation & Machine Embroidery",
        duration: "40 Hours",
        topics: [
          "Zig-zag machine embroidery and zari/sequin work",
          "Applique work, patchwork and ethnic border detailing",
          "Pressing, iron steam calendering and garment quality inspection"
        ]
      },
      {
        title: "Module 4: Bulk Order Sourcing & Micro-Boutique Management",
        duration: "160 Hours",
        topics: [
          "Government school uniform and hospital linen tendering",
          "Costing, pricing and digital UPI customer ledger maintenance",
          "NSDC Certificate & Free Sewing Machine Handover"
        ]
      }
    ]
  },

  // ==========================================
  // 4. HEALTHCARE, WELLNESS & COMMUNITY
  // ==========================================
  healthcare_gda: {
    keywords: ["healthcare", "nurse", "gda", "hospital", "patient care", "clinic", "phc", "medical assistant", "health worker"],
    title: "General Duty Assistant (GDA) & PHC Healthcare (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "HSS/Q5101",
    category: "healthcare",
    sectorId: "healthcare_services",
    sectorName: "Healthcare & Community Welfare",
    badge: "100% Placement",
    badgeColor: "purple",
    duration: "6 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Hospital patient care assistance, vital signs monitoring (BP, Pulse, SpO2, Blood Sugar), infection control protocols, and bedside assistance in rural PHCs and clinics.",
    stipend: "₹3,800/month + Free Medical Uniform & Stethoscope",
    eligibility: "10th Standard Pass",
    shortDesc: "Patient vital monitoring, emergency first-aid & rural PHC bedside care.",
    subsidyGrantAmount: "₹30,000 Subsidy for Village First-Aid Diagnostic Point",
    wageRange: "₹16,000 – ₹24,000 / mo",
    microEnterpriseRange: "₹25,000 – ₹40,000 / mo",
    aiInsights: "Guaranteed placement linkage with district hospitals, private nursing homes, and Ayushman Bharat health centers.",
    careerOutcomes: [
      "Certified Hospital General Duty Assistant (GDA)",
      "Village First-Aid & Patient Care Provider",
      "Average Monthly Earnings: ₹18,000 – ₹32,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Human Anatomy, Vital Signs & Infection Control",
        duration: "50 Hours",
        topics: [
          "Digital & analog blood pressure, SpO2, temperature and pulse checks",
          "Hand hygiene (WHO 6-step protocol) and biomedical waste segregation",
          "Personal protective equipment (PPE) donning and doffing"
        ]
      },
      {
        title: "Module 2: Patient Bedside Care & Safe Mobility",
        duration: "130 Hours",
        topics: [
          "Bed making, sponge baths and pressure ulcer prevention",
          "Safe patient transfer (Wheelchair, Stretcher, Bed-to-Chair)",
          "Oral medication assistance and feeding tube monitoring"
        ]
      },
      {
        title: "Module 3: Emergency First Aid & BLS Protocols",
        duration: "40 Hours",
        topics: [
          "Cardiopulmonary resuscitation (CPR) & Automated External Defibrillator (AED)",
          "Bleeding containment, fracture splinting and burn management",
          "Ambulance coordination and emergency triage reporting"
        ]
      },
      {
        title: "Module 4: Clinical Internship at District Hospital",
        duration: "180 Hours",
        topics: [
          "Full-time rotational internship across ICU, OPD and General Wards",
          "Patient record keeping and doctor assistance protocols",
          "Healthcare Sector Skill Council (HSSC) National Certification"
        ]
      }
    ]
  },

  telemedicine_operator: {
    keywords: ["telemedicine", "e-sanjeevani", "digital health", "diagnostic", "blood test", "ecg", "health clinic"],
    title: "Telemedicine & Village Diagnostic Point Operator (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "HSS/Q3401",
    category: "healthcare",
    sectorId: "healthcare_services",
    sectorName: "Healthcare & Community Welfare",
    badge: "Digital Health",
    badgeColor: "blue",
    duration: "3.5 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Operating point-of-care digital health diagnostic devices (Rapid blood tests, Digital ECG, SpO2, Blood Sugar), e-Sanjeevani doctor consultations, and medicine dispensing.",
    stipend: "₹3,500/month + Point-of-Care Diagnostic Kit",
    eligibility: "10th / 12th Pass with basic computer knowledge",
    shortDesc: "e-Sanjeevani remote doctor video clinic, digital ECG & rapid blood test hub.",
    subsidyGrantAmount: "₹40,000 PM-AJAY Capital Subsidy for Village Health Clinic",
    wageRange: "₹15,000 – ₹24,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹50,000 / mo",
    aiInsights: "Connects remote unserved rural villages directly to specialist doctors at AIIMS and district hospitals.",
    careerOutcomes: [
      "Village Telemedicine & Diagnostic Hub Owner",
      "e-Sanjeevani Ayushman Bharat Coordinator",
      "Average Monthly Earnings: ₹24,000 – ₹45,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Point-of-Care Medical Diagnostics Devices",
        duration: "40 Hours",
        topics: [
          "Rapid diagnostic test kits for malaria, dengue, hemoglobin and blood sugar",
          "12-lead portable Bluetooth ECG machine operation and lead placement",
          "Digital dermatoscope and otoscope camera operation"
        ]
      },
      {
        title: "Module 2: e-Sanjeevani National Teleconsultation Platform",
        duration: "120 Hours",
        topics: [
          "Patient demographic registration and ABHA (Ayushman Bharat Health Account) creation",
          "Scheduling remote video consultations with specialist doctors",
          "Digital prescription generation and pharmacy dispensary linkage"
        ]
      },
      {
        title: "Module 3: Medical Ethics, Privacy & Bio-Medical Waste",
        duration: "35 Hours",
        topics: [
          "Patient data confidentiality and telemedicine practice guidelines",
          "Safe disposal of used lancets, test strips and biohazard waste",
          "Medical emergency escalation protocols and ambulance dispatch"
        ]
      },
      {
        title: "Module 4: Clinic Enterprise & Jan Aushadhi Linkage",
        duration: "145 Hours",
        topics: [
          "Setting up a village digital health kiosk with solar UPS",
          "Jan Aushadhi generic medicine supply chain partnership",
          "National Skill Qualification Certificate & PM-AJAY Grant Award"
        ]
      }
    ]
  },

  // ==========================================
  // 5. DIGITAL, INFRASTRUCTURE & CONSTRUCTION
  // ==========================================
  csc_digital_gram: {
    keywords: ["csc", "computer", "digital", "e-governance", "aadhar", "pan card", "digilocker", "internet", "dbt", "e-gram"],
    title: "Common Service Center (CSC) & Digital e-Gram Operator (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "SSC/Q1401",
    category: "digital_construction",
    sectorId: "digital_construction",
    sectorName: "Digital, Infrastructure & Construction",
    badge: "Govt Services",
    badgeColor: "blue",
    duration: "3 Months",
    image: "/dashboard/electrician.jpg",
    description: "Providing G2C (Govt to Citizen) digital services: Aadhaar enabled payments (AePS), PM-Kisan verification, DigiLocker, PAN card, utility bill payments, and online job applications.",
    stipend: "₹3,500/month + Digital Kiosk Starter Kit",
    eligibility: "10th Standard Pass",
    shortDesc: "Aadhaar banking AePS, PM-Kisan KYC, PAN card & digital citizen services hub.",
    subsidyGrantAmount: "₹35,000 Capital Subsidy for Laptop, Biometric & Printer Setup",
    wageRange: "₹14,000 – ₹22,000 / mo",
    microEnterpriseRange: "₹26,000 – ₹48,000 / mo",
    aiInsights: "High recurring commission model on utility bills, AePS cash withdrawals, and welfare scheme enrollments.",
    careerOutcomes: [
      "Village CSC e-Gram Kendra Entrepreneur",
      "Bank Mitra / Customer Service Point (CSP) Operator",
      "Average Monthly Earnings: ₹24,000 – ₹45,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Computer Fundamentals & High-Speed Scanning",
        duration: "40 Hours",
        topics: [
          "Operating system navigation, fast typing and keyboard shortcuts",
          "High-resolution document scanning, PDF compression and image cropping",
          "Laser and thermal printer maintenance, paper jam troubleshooting"
        ]
      },
      {
        title: "Module 2: AePS Micro-ATM Banking & Aadhaar Verification",
        duration: "120 Hours",
        topics: [
          "Biometric fingerprint / iris scanner integration and driver setup",
          "Aadhaar enabled payment system (AePS) cash withdrawal and balance check",
          "PM-Kisan e-KYC, DBT seed checking and Jan Dhan account linking"
        ]
      },
      {
        title: "Module 3: G2C Government Schemes & Certificate Portals",
        duration: "40 Hours",
        topics: [
          "State revenue portals: Caste, Income, Residence and Land Mutation certificates",
          "Ayushman Bharat PM-JAY Golden Card registration",
          "DigiLocker document retrieval and student scholarship submissions"
        ]
      },
      {
        title: "Module 4: Cyber Security & Kendra Revenue Optimization",
        duration: "140 Hours",
        topics: [
          "Cyber fraud prevention, OTP scam awareness and customer data privacy",
          "Commission tracking, UPI QR payments and daily transaction ledger",
          "NSDC Skill India Certificate & CSC VLE ID Accreditation"
        ]
      }
    ]
  },

  plumbing_water_plant: {
    keywords: ["plumbing", "pipe", "water", "ro plant", "water treatment", "tap", "jal jeevan", "sanitation", "plumber"],
    title: "Plumbing & Village RO Water Plant Operator (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "PSC/Q0104",
    category: "digital_construction",
    sectorId: "digital_construction",
    sectorName: "Digital, Infrastructure & Construction",
    badge: "Jal Jeevan Mission",
    badgeColor: "blue",
    duration: "3 Months",
    image: "/dashboard/electrician.jpg",
    description: "Jal Jeevan Mission community water pipeline jointing, PVC/CPVC pipe fitting, multi-media sand filters, RO membrane descaling, and household tap maintenance.",
    stipend: "₹3,500/month + Complete Plumbing Tool Kit",
    eligibility: "8th / 10th Standard",
    shortDesc: "Jal Jeevan pipeline jointing, RO membrane descaling & village water plant maintenance.",
    subsidyGrantAmount: "₹35,000 Tool Kit & Mobile Service Grant",
    wageRange: "₹16,000 – ₹26,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹50,000 / mo",
    aiInsights: "Guaranteed contract opportunities with Gram Panchayats under Har Ghar Jal maintenance protocols.",
    careerOutcomes: [
      "Jal Jeevan Mission Certified Village Plumber",
      "Community RO Water Plant Technical Operator",
      "Average Monthly Earnings: ₹22,000 – ₹42,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Pipe Cutting, Threading & Solvents",
        duration: "35 Hours",
        topics: [
          "GI, HDPE, PVC, CPVC and PPR pipe identification",
          "Die stock threading, solvent cement jointing and Teflon sealing",
          "Pressure testing to detect sub-surface water leakage"
        ]
      },
      {
        title: "Module 2: Community RO Plant & Sand Filter Maintenance",
        duration: "120 Hours",
        topics: [
          "Multi-grade sand filter backwashing and activated carbon replacement",
          "High-pressure RO pump maintenance and antiscalant chemical dosing",
          "TDS, pH, turbidity and residual chlorine testing kits"
        ]
      },
      {
        title: "Module 3: Household Sanitary Fixtures & Valves",
        duration: "45 Hours",
        topics: [
          "Overhead water tank float valve and automatic level switch wiring",
          "Bathroom and kitchen bib cock, angle valve and waste pipe fitting",
          "Underground septic tank and soak pit drainage connections"
        ]
      },
      {
        title: "Module 4: Panchayat Maintenance AMC & Entrepreneurship",
        duration: "140 Hours",
        topics: [
          "Gram Panchayat Har Ghar Jal annual maintenance contract (AMC)",
          "Mobile emergency plumbing service van setup",
          "NSDC Skill India Plumber Certificate & Tool Kit Handover"
        ]
      }
    ]
  },

  // ==========================================
  // 6. MICRO-ENTERPRISE & AGRO-PROCESSING MILLS
  // ==========================================
  cold_press_oil_mill: {
    keywords: ["oil", "oil expeller", "cold press", "mustard oil", "groundnut", "oil mill", "seed pressing", "edible oil"],
    title: "Cold-Press Oil Expeller & Seed Processing (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "FIC/Q0103",
    category: "self_employment",
    sectorId: "micro_enterprise_grants",
    sectorName: "Agro-Mills & PM-AJAY Grants",
    badge: "High Margin",
    badgeColor: "emerald",
    duration: "3.5 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Cold-press wooden kachi ghani and stainless steel oil expeller operations for pure mustard, groundnut and sesame oil, seed cleaning, filter press filtration, and FSSAI packaging.",
    stipend: "₹3,500/month (PM-AJAY Stipend) + Food Safety Testing Kit",
    eligibility: "10th Standard Pass",
    shortDesc: "Kachi ghani mustard oil extraction, filter press clarity & branded retail packaging.",
    subsidyGrantAmount: "₹50,000 PM-AJAY Capital Subsidy + PMFME 35% Credit Subsidy",
    wageRange: "₹18,000 – ₹28,000 / mo",
    microEnterpriseRange: "₹35,000 – ₹70,000 / mo",
    aiInsights: "Pure chemical-free cold-pressed edible oils command 40–60% higher retail market price in urban centers.",
    careerOutcomes: [
      "Village Kachi Ghani Oil Mill Owner",
      "FPO Branded Edible Oil Production Lead",
      "Average Monthly Earnings: ₹30,000 – ₹65,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Oilseed Cleaning, Moisture & Pre-Treatment",
        duration: "40 Hours",
        topics: [
          "Seed sorting, destoning and moisture calibration (6-8% optimal)",
          "Aflatoxin screening in groundnut and mustard seeds",
          "FSSAI Schedule 4 sanitary hygiene protocols in oil mills"
        ]
      },
      {
        title: "Module 2: Cold-Press Expeller Calibration & Extraction",
        duration: "130 Hours",
        topics: [
          "Temperature monitoring (below 45°C cold-press benchmark)",
          "Worm shaft clearance tuning for maximum oil yield recovery",
          "Recovered oil cake (Khal) grading for high-protein cattle feed sales"
        ]
      },
      {
        title: "Module 3: Filter Press Filtration & Bottle Filling",
        duration: "45 Hours",
        topics: [
          "Plate-and-frame cotton filter press operation for sparkling clarity",
          "Food-grade PET/glass bottle automatic filling and induction sealing",
          "Nutritional facts calculation, batch coding and FSSAI QR labeling"
        ]
      },
      {
        title: "Module 4: Local Brand Launch, B2B Mandi & PM-AJAY Grant",
        duration: "145 Hours",
        topics: [
          "Setting up village retail distribution with 40+ local grocery stores",
          "PM-AJAY ₹50k capital grant disbursal & bank loan linkage",
          "NSDC Skill India Certificate & FSSAI Business License Award"
        ]
      }
    ]
  },

  spice_pulverizer_unit: {
    keywords: ["spice", "masala", "pulverizer", "turmeric", "chilli", "coriander", "grinding", "packaging", "flour mill"],
    title: "Spice Pulverization & Masala Packaging Enterprise (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "FIC/Q0201",
    category: "self_employment",
    sectorId: "micro_enterprise_grants",
    sectorName: "Agro-Mills & PM-AJAY Grants",
    badge: "PMFME Supported",
    badgeColor: "amber",
    duration: "3 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Low-heat stainless steel spice pulverization for pure turmeric, red chilli, coriander, and garam masala blends, nitrogen packaging, and TRIFED brand linkage.",
    stipend: "₹3,500/month (PM-AJAY Stipend) + Spice Grinding Kit",
    eligibility: "8th / 10th Standard",
    shortDesc: "Low-temperature spice grinding, moisture testing & nitrogen flushed pouch packaging.",
    subsidyGrantAmount: "₹45,000 Capital Subsidy for Micro-Pulverizer Setup",
    wageRange: "₹15,000 – ₹24,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹55,000 / mo",
    aiInsights: "High margin (35–50%) trade with continuous household consumption and long shelf-life.",
    careerOutcomes: [
      "Village Pure Masala Mill & Brand Owner",
      "Organic Turmeric & Spice Supplier to District FPOs",
      "Average Monthly Earnings: ₹26,000 – ₹50,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Raw Spice Grading & Moisture Dehydration",
        duration: "35 Hours",
        topics: [
          "Curcumin percentage testing in raw tribal turmeric fingers",
          "Solar dehydration to reduce moisture below 10% benchmark",
          "Foreign matter magnetic separation and destoning"
        ]
      },
      {
        title: "Module 2: Micro-Pulverizer Operation & Aroma Retention",
        duration: "120 Hours",
        topics: [
          "Low-temperature water-cooled stainless steel pulverizer tuning",
          "Sieve mesh sizing (60 to 100 mesh) for ultra-fine powder texture",
          "Formulating signature curry masala and garam masala blends"
        ]
      },
      {
        title: "Module 3: Nitrogen Packaging & Shelf-Life Extension",
        duration: "40 Hours",
        topics: [
          "Nitrogen gas flushing to prevent oil oxidation and color fading",
          "Multi-layer aluminum foil pouch heat sealing",
          "FSSAI barcode labeling and batch expiry printing"
        ]
      },
      {
        title: "Module 4: Weekly Haat & E-Commerce Retail Distribution",
        duration: "135 Hours",
        topics: [
          "Direct sales in 10+ weekly rural haats and village retail networks",
          "Listing on ONDC, Amazon Karigar and tribal trade fairs",
          "NSDC Skill India Certificate & PM-AJAY Grant Award"
        ]
      }
    ]
  },

  poultry_hatchery: {
    keywords: ["poultry", "chicken", "hatchery", "murgi", "broiler", "layer", "egg", "birds", "birds farming", "kukuda"],
    title: "Poultry & Backyard Hatchery Specialist (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "AGR/Q4301",
    category: "agriculture",
    sectorId: "agriculture_allied",
    sectorName: "Agriculture & Allied Enterprise",
    badge: "High Turnover",
    badgeColor: "emerald",
    duration: "2.5 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Scientific poultry management of Kadaknath, Kuroiler and Vanaraja indigenous breeds, automatic solar incubator hatching, chick brooding, vaccination, and organic poultry feed formulation.",
    stipend: "₹3,500/month (PM-AJAY Support) + 50 Free Kuroiler Chicks",
    eligibility: "8th / 10th Standard",
    shortDesc: "Automatic solar incubator hatching, chick brooding & high-protein Kadaknath egg production.",
    subsidyGrantAmount: "₹35,000 Capital Subsidy for Solar Hatchery Shed",
    wageRange: "₹14,000 – ₹22,000 / mo",
    microEnterpriseRange: "₹26,000 – ₹50,000 / mo",
    aiInsights: "Quick 45-day broiler production cycle and steady premium egg demand in local mandis.",
    careerOutcomes: [
      "Village Backyard Solar Hatchery Entrepreneur",
      "Indigenous Kuroiler & Kadaknath Supplier",
      "Average Monthly Earnings: ₹24,000 – ₹45,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Breed Selection & Biosecurity Shelter Setup",
        duration: "30 Hours",
        topics: [
          "Indigenous breeds (Kadaknath, Kuroiler, Aseel, Vanaraja) characteristics",
          "Low-cost ventilated bamboo and wire-mesh poultry shed construction",
          "Biosecurity sanitation, footbaths and wild predator protection"
        ]
      },
      {
        title: "Module 2: Solar Egg Incubator & Brooding Management",
        duration: "100 Hours",
        topics: [
          "Fertile egg candling, humidity (55-60%) and 37.5°C temperature calibration",
          "Automatic egg turning mechanisms and solar battery backup",
          "Day-old chick brooding, infrared heater lamps and glucose water hydration"
        ]
      },
      {
        title: "Module 3: Vaccination, Disease Prevention & Organic Feeds",
        duration: "40 Hours",
        topics: [
          "Ranikhet (F1/Lasota/R2B), Gumboro and Fowl Pox vaccination schedule",
          "On-farm organic feed formulation with maize, azolla, soya and mineral premix",
          "Herbal preventative tonics (Turmeric, Garlic, Tulsi decoctions)"
        ]
      },
      {
        title: "Module 4: Egg Packaging, Retail Mandi & SHG Market Linkage",
        duration: "130 Hours",
        topics: [
          "Egg grading, date stamping and eco-friendly carton packaging",
          "B2B broiler contracts with local eateries and weekly rural haats",
          "NSDC Skill India Certificate & PM-AJAY Poultry Grant Disbursal"
        ]
      }
    ]
  },

  aquaculture_biofloc: {
    keywords: ["fish", "fisheries", "biofloc", "pond", "carp", "rohu", "prawn", "aqua", "matsya", "machli", "aquaculture"],
    title: "Fisheries, Biofloc Farming & Aqua-Tech Hub (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "AGR/Q5101",
    category: "agriculture",
    sectorId: "agriculture_allied",
    sectorName: "Agriculture & Allied Enterprise",
    badge: "PMMSY Supported",
    badgeColor: "blue",
    duration: "3 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Modern high-density Biofloc tank fish farming, Rohu/Catla/Pangasius fingerling rearing, dissolved oxygen aeration, water probiotics management, and cold-chain marketing under PM Matsya Sampada Yojana.",
    stipend: "₹3,500/month + Water Quality Testing Kit",
    eligibility: "10th Standard Pass",
    shortDesc: "High-density Biofloc tank fish rearing, water probiotic balance & PMMSY subsidy.",
    subsidyGrantAmount: "₹50,000 PM-AJAY Subsidy + 60% PMMSY Fisheries Grant",
    wageRange: "₹16,000 – ₹26,000 / mo",
    microEnterpriseRange: "₹32,000 – ₹65,000 / mo",
    aiInsights: "Produces 15x higher fish yield per square meter compared to traditional earthen ponds.",
    careerOutcomes: [
      "Commercial Biofloc Fish Farm Owner",
      "Aquaculture Nursery Fingerling Provider",
      "Average Monthly Earnings: ₹28,000 – ₹60,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Biofloc Tank Engineering & Aeration Blowers",
        duration: "35 Hours",
        topics: [
          "Circular HDPE tarpaulin tank assembly and drainage slope design",
          "Continuous air blower installation, venturi injectors and oxygen diffusers",
          "Solar power backup integration for non-stop dissolved oxygen (DO > 5 ppm)"
        ]
      },
      {
        title: "Module 2: Microbial Floc Culture & C:N Ratio Optimization",
        duration: "115 Hours",
        topics: [
          "Inoculating beneficial Bacillus probiotics and jaggery molasses carbon sources",
          "Floc volume index (FVI 25-40 ml/L) measurement using Imhoff cones",
          "Ammonia, Nitrite, Nitrate and pH (7.5-8.2) digital sensor monitoring"
        ]
      },
      {
        title: "Module 3: Fingerling Stocking, Feeding & Disease Management",
        duration: "45 Hours",
        topics: [
          "Acclimatization and salt bath dip treatment for healthy fry/fingerlings",
          "Floating pellet feed schedule and feed conversion ratio (FCR < 1.2) tracking",
          "Parasite control, gill rot remedies and clean harvesting techniques"
        ]
      },
      {
        title: "Module 4: Live Fish Transportation, Mandi & PMMSY Grant",
        duration: "145 Hours",
        topics: [
          "Oxygenated live fish transport containers for premium fresh market pricing",
          "Direct supply to urban fish hubs and cooperative chilling centers",
          "NSDC Skill India Certificate & PMMSY / PM-AJAY Grant Disbursal"
        ]
      }
    ]
  },

  millet_bakery: {
    keywords: ["millet", "mandia", "ragi", "shree anna", "bakery", "biscuit", "flour", "nutrition", "jowar", "bajra", "cookies"],
    title: "Shree Anna Millet Processing & Bakery Hub (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "FIC/Q0801",
    category: "self_employment",
    sectorId: "micro_enterprise_grants",
    sectorName: "Agro-Mills & PM-AJAY Grants",
    badge: "Shree Anna Mission",
    badgeColor: "amber",
    duration: "3 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Processing indigenous millets (Ragi/Mandia, Kodo, Kutki, Little Millet), dehulling, rotary baking oven operations, gluten-free cookies, millet flakes, and fortified nutritional snacks for Odisha Millet Mission.",
    stipend: "₹3,500/month (PM-AJAY Support) + Bakery Tool Kit",
    eligibility: "8th / 10th Standard",
    shortDesc: "Ragi dehulling, rotary oven baking & packaged gluten-free millet snacks.",
    subsidyGrantAmount: "₹45,000 Capital Subsidy for Commercial Baking Unit",
    wageRange: "₹15,000 – ₹24,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹55,000 / mo",
    aiInsights: "Odisha Millet Mission and POSHAN Abhiyaan offer guaranteed procurement for school mid-day meal snacks.",
    careerOutcomes: [
      "Village Millet Bakery & Snack Cafe Owner",
      "SHG Nutrition Product Supplier to Anganwadis",
      "Average Monthly Earnings: ₹25,000 – ₹48,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Millet Dehulling, Cleaning & Flour Milling",
        duration: "35 Hours",
        topics: [
          "Abrasive dehuller operation for small millets without nutrient loss",
          "Stone burr milling and sieve classification for ultra-fine gluten-free flour",
          "Moisture control, pest prevention and airtight silaged storage"
        ]
      },
      {
        title: "Module 2: Commercial Baking & Rotary Oven Operation",
        duration: "120 Hours",
        topics: [
          "Planetary dough mixer operation and recipe standardization",
          "Baking Ragi cookies, millet muffins, bread and roasted snack mixtures",
          "Temperature profile calibration and moisture crust optimization"
        ]
      },
      {
        title: "Module 3: Fortification, FSSAI Quality & Vacuum Sealing",
        duration: "40 Hours",
        topics: [
          "Fortification with jaggery, moringa powder, dates and nuts",
          "FSSAI food safety audit, nutritional labeling and shelf-life testing",
          "Nitrogen flush pouch sealing and eye-catching tribal graphic branding"
        ]
      },
      {
        title: "Module 4: Odisha Millet Mission Tenders & ONDC Listing",
        duration: "145 Hours",
        topics: [
          "Supplying snacks to ICDS Anganwadi centers and government hostels",
          "Listing on ONDC, local supermarts and organic health stores",
          "NSDC Skill India Certificate & PM-AJAY Micro-Enterprise Grant"
        ]
      }
    ]
  },

  auto_tractor_mechanic: {
    keywords: ["mechanic", "tractor", "motorcycle", "bike repair", "automobile", "diesel engine", "garage", "vehicle service", "auto"],
    title: "2W/4W Auto Mechanic & Farm Tractor Service Hub (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "ASC/Q1401",
    category: "technical",
    sectorId: "green_energy_tech",
    sectorName: "Green Energy & Technical Trades",
    badge: "Essential Service",
    badgeColor: "blue",
    duration: "4 Months",
    image: "/dashboard/electrician.jpg",
    description: "Diesel and petrol engine overhaul, tractor hydraulic lift repair, electronic fuel injection (EFI) OBD-II diagnostics, clutch and gearbox overhaul, and rural mobile service van setup.",
    stipend: "₹3,500/month (PM-AJAY Stipend) + Complete Mechanic Tool Chest",
    eligibility: "10th Standard or ITI Mechanical",
    shortDesc: "Tractor hydraulic lift overhaul, EFI diagnostics & rural multi-brand auto garage.",
    subsidyGrantAmount: "₹40,000 Capital Subsidy for Hydraulic Lift & Tools",
    wageRange: "₹18,000 – ₹30,000 / mo",
    microEnterpriseRange: "₹32,000 – ₹60,000 / mo",
    aiInsights: "Heavy seasonal demand during sowing and harvesting seasons for quick on-field tractor breakdown servicing.",
    careerOutcomes: [
      "Authorized Rural Automobile & Tractor Garage Owner",
      "Farm Equipment Custom Hiring Service Lead",
      "Average Monthly Earnings: ₹28,000 – ₹55,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: 4-Stroke Engine Principles & Component Dismantling",
        duration: "40 Hours",
        topics: [
          "Cylinder head, piston, crankshaft and camshaft inspection",
          "Valve clearance (tappet) adjustment and cylinder head torque specs",
          "Engine oil viscosity grading, coolant flush and filter replacement"
        ]
      },
      {
        title: "Module 2: Diesel Fuel Injection Pump & Tractor Hydraulics",
        duration: "135 Hours",
        topics: [
          "Inline and rotary diesel injection pump timing calibration",
          "Common Rail Direct Injection (CRDI) and injector nozzle pressure testing",
          "Tractor 3-point linkage hydraulic pump, spool valve and seal replacement"
        ]
      },
      {
        title: "Module 3: BS-VI OBD-II Scanner & Electrical Wiring",
        duration: "45 Hours",
        topics: [
          "Handheld OBD-II diagnostic scanner fault code diagnosis and clearing",
          "Starter motor, alternator rewinding and battery load testing",
          "Disc brake pad replacement, hydraulic bleeding and suspension bushing"
        ]
      },
      {
        title: "Module 4: Garage Business Setup & Spare Parts Inventory",
        duration: "140 Hours",
        topics: [
          "Designing an ergonomic 2-bay rural auto garage layout",
          "OEM spare parts tie-up and digital customer service record app",
          "Automotive Skills Development Council (ASDC) Certificate & PM-AJAY Grant"
        ]
      }
    ]
  },

  cctv_village_security: {
    keywords: ["cctv", "camera", "security", "wifi", "internet", "solar cctv", "surveillance", "networking", "broadband"],
    title: "Solar CCTV & Smart Village Wi-Fi Network Specialist (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "ELE/Q4601",
    category: "digital_construction",
    sectorId: "digital_construction",
    sectorName: "Digital, Infrastructure & Construction",
    badge: "Smart Village",
    badgeColor: "purple",
    duration: "3 Months",
    image: "/dashboard/electrician.jpg",
    description: "Installation of solar-powered 4G/IP security cameras, wireless point-to-point bridges, NVR configuration, Gram Panchayat surveillance systems, and BharatNet rural Wi-Fi hotspot deployment.",
    stipend: "₹3,500/month + CCTV Installation & Crimping Tool Kit",
    eligibility: "10th Standard Pass",
    shortDesc: "Solar 4G IP camera mounting, NVR remote app viewing & village Wi-Fi hotspot setup.",
    subsidyGrantAmount: "₹35,000 Capital Subsidy for CCTV Testing Equipment",
    wageRange: "₹16,000 – ₹25,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹52,000 / mo",
    aiInsights: "Rapid demand from Gram Panchayats, schools, grain warehouses, and rural banks for continuous CCTV coverage.",
    careerOutcomes: [
      "Smart Village Security & Network Installation Contractor",
      "Gram Panchayat BharatNet Wi-Fi Maintenance Partner",
      "Average Monthly Earnings: ₹25,000 – ₹45,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: IP Camera Optics, Solar Power & Mast Mounting",
        duration: "35 Hours",
        topics: [
          "Focal length, IR night vision, PTZ controls and weatherproof IP67 ratings",
          "Solar panel, MPPT controller and lithium battery sizing for 24x7 autonomy",
          "Outdoor pole mast civil grouting and lightning surge protection"
        ]
      },
      {
        title: "Module 2: Network Video Recorders (NVR) & Cat-6 Structured Cabling",
        duration: "120 Hours",
        topics: [
          "Cat-6 cable crimping, RJ45 punching and PoE (Power over Ethernet) switches",
          "NVR hard drive formatting, H.265+ compression and motion alert triggers",
          "Mobile smartphone remote viewing app setup and static IP configuration"
        ]
      },
      {
        title: "Module 3: Long-Range Wireless Point-to-Point Bridges",
        duration: "40 Hours",
        topics: [
          "5GHz outdoor wireless dish antenna alignment for 5km–10km line-of-sight",
          "Rural Wi-Fi hotspot access point configuration and captive portal billing",
          "Fiber optic patch cord splicing and optical power meter testing"
        ]
      },
      {
        title: "Module 4: Panchayat Security Contracts & Enterprise Launch",
        duration: "145 Hours",
        topics: [
          "Gram Panchayat and warehouse surveillance tender bidding",
          "Annual Maintenance Contracts (AMC) and emergency breakdown repair",
          "Electronics Sector Skills Council Certificate & PM-AJAY Grant Award"
        ]
      }
    ]
  },

  masonry_flyash_brick: {
    keywords: ["mason", "masonry", "brick", "flyash", "construction", "cement", "building", "pmay", "house", "concrete", "rajmistri"],
    title: "Modern Masonry, Fly-Ash Brick & PMAY Rural Housing (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "CON/Q0102",
    category: "digital_construction",
    sectorId: "digital_construction",
    sectorName: "Digital, Infrastructure & Construction",
    badge: "PMAY Mission",
    badgeColor: "blue",
    duration: "3 Months",
    image: "/dashboard/electrician.jpg",
    description: "Earthquake-resilient RCC construction, automatic hydraulic fly-ash brick manufacturing, bar bending, laser leveling, and construction of durable houses under Pradhan Mantri Awas Yojana (PMAY-G).",
    stipend: "₹3,500/month + Full Masonry Tool Kit & Safety Boots",
    eligibility: "8th / 10th Standard or construction experience",
    shortDesc: "PMAY earthquake-safe RCC framing, hydraulic fly-ash brick unit & precision plastering.",
    subsidyGrantAmount: "₹45,000 Capital Subsidy for Hydraulic Brick Making Machine",
    wageRange: "₹18,000 – ₹28,000 / mo",
    microEnterpriseRange: "₹35,000 – ₹70,000 / mo",
    aiInsights: "Over 50,000 PMAY-G rural houses sanction in the region ensures round-the-year high-wage masonry demand.",
    careerOutcomes: [
      "PMAY-G Certified Master Mason (Rajmistri)",
      "Hydraulic Fly-Ash Brick Micro-Enterprise Owner",
      "Average Monthly Earnings: ₹28,000 – ₹55,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Hydraulic Fly-Ash Brick Pressing & Curing",
        duration: "35 Hours",
        topics: [
          "Fly-ash, lime, gypsum and sand mixing proportions",
          "Hydraulic automatic brick moulding machine operation (1500 bricks/hr)",
          "Water mist curing methods and compressive strength testing (IS 12894)"
        ]
      },
      {
        title: "Module 2: RCC Foundation, Bar Bending & Column Shuttering",
        duration: "125 Hours",
        topics: [
          "Plinth beam reinforcement, stirrup spacing and bar bending table techniques",
          "Laser level alignment, right-angle squaring and plumb bob verticality",
          "Concrete slump testing, mechanical vibrator compaction and honeycombing prevention"
        ]
      },
      {
        title: "Module 3: Precision Bricklaying Plastering & Waterproofing",
        duration: "45 Hours",
        topics: [
          "English bond, Flemish bond and cavity wall thermal insulation",
          "Smooth interior plastering, exterior sand-faced stucco and tile fixing",
          "Rooftop chemical waterproofing membranes and rainwater harvesting integration"
        ]
      },
      {
        title: "Module 4: PMAY Civil Contracting & Safety Compliance",
        duration: "135 Hours",
        topics: [
          "PMAY-G housing completion stage Geo-tagging photo validation",
          "Scaffolding safety, hardhats, safety belts and OHSAS compliance",
          "Construction Skill Development Council (CSDC) Certificate & PM-AJAY Grant"
        ]
      }
    ]
  },

  terracotta_pottery: {
    keywords: ["pottery", "clay", "terracotta", "ceramic", "artisan", "earthenware", "kumhar", "kulhad", "potter", "handicraft"],
    title: "Terracotta, Ceramic Pottery & Earthenware Studio (NSQF Level 3)",
    nsqfLevel: 3,
    qpCode: "HCS/Q0701",
    category: "self_employment",
    sectorId: "crafts_textiles",
    sectorName: "Handicrafts & Women SHG",
    badge: "KVIC Supported",
    badgeColor: "amber",
    duration: "3 Months",
    image: "/dashboard/tailoring.jpg",
    description: "Operating motorized electric potter wheels, clay filtration, natural mineral glazing, low-smoke energy-efficient wood/gas kilns, and creating aesthetic terracotta cookware, kulhads, and home decor.",
    stipend: "₹3,000/month + Free Electric Potter Wheel on Completion",
    eligibility: "Open to all traditional artisans and youth",
    shortDesc: "Electric potter wheel turning, non-toxic glazing & commercial terracotta cookware studio.",
    subsidyGrantAmount: "₹35,000 KVIC / PM-AJAY Grant for Kiln & Pottery Studio",
    wageRange: "₹12,000 – ₹20,000 / mo",
    microEnterpriseRange: "₹24,000 – ₹45,000 / mo",
    aiInsights: "Nationwide ban on single-use plastic drives massive demand for terracotta kulhads at railway stations and tea cafes.",
    careerOutcomes: [
      "Commercial Terracotta Studio & Kiln Owner",
      "Railway Kulhad & Organic Cookware Supplier",
      "Average Monthly Earnings: ₹22,000 – ₹40,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Clay Sourcing, Slaking & Pugmill Processing",
        duration: "30 Hours",
        topics: [
          "Clay identification, plastic limit testing and removing stone impurities",
          "Motorized pugmill blending with fine sand and organic grog for crack resistance",
          "Clay aging and wedge kneading to eliminate micro-air pockets"
        ]
      },
      {
        title: "Module 2: Motorized Potter Wheel Turning & Throwing",
        duration: "120 Hours",
        topics: [
          "Centering clay on variable-speed electric wheels (0-300 RPM)",
          "Throwing uniform kulhads, water pots, cookware handis and aesthetic planters",
          "Trimming, foot ring carving and handle/spout attachment techniques"
        ]
      },
      {
        title: "Module 3: Mineral Glazing, Kiln Stacking & Firing",
        duration: "45 Hours",
        topics: [
          "Applying non-toxic natural mineral slips (Geru) and lead-free glazes",
          "Energy-efficient downdraft kiln stacking to maximize heat circulation",
          "Temperature pyrometric cone monitoring (850°C - 1050°C biscuit and glaze firing)"
        ]
      },
      {
        title: "Module 4: TRIFED Marketing, Rail Kulhad Scheme & Grant",
        duration: "145 Hours",
        topics: [
          "Supplying bulk kulhad lots to Indian Railways catering stalls",
          "Direct artisan listing on TRIFED Tribes India and urban craft bazaars",
          "Handicrafts and Carpet Sector Skill Council Certificate & Electric Wheel Disbursal"
        ]
      }
    ]
  },

  ayush_herbal_distillation: {
    keywords: ["ayush", "herbal", "medicinal", "lemongrass", "tulsi", "distillation", "essential oil", "ayurveda", "ashwagandha", "plants"],
    title: "Ayush Herbal Medicine & Essential Oil Distillation (NSQF Level 4)",
    nsqfLevel: 4,
    qpCode: "AGR/Q0901",
    category: "healthcare",
    sectorId: "healthcare_services",
    sectorName: "Healthcare & Community Welfare",
    badge: "Ayush Mission",
    badgeColor: "purple",
    duration: "3 Months",
    image: "/dashboard/food_processing.jpg",
    description: "Cultivation and processing of medicinal plants (Lemongrass, Tulsi, Ashwagandha, Kalmegh, Moringa), hydro-steam distillation of pure therapeutic essential oils, and Ayush herbal formulation packaging.",
    stipend: "₹3,500/month (PM-AJAY Support) + Herbal Starter Seeds",
    eligibility: "10th Standard Pass",
    shortDesc: "Lemongrass essential oil steam distillation, herbal powdering & Ayush wellness exports.",
    subsidyGrantAmount: "₹45,000 PM-AJAY Capital Subsidy for Distillation Still Unit",
    wageRange: "₹16,000 – ₹26,000 / mo",
    microEnterpriseRange: "₹30,000 – ₹60,000 / mo",
    aiInsights: "Pure therapeutic essential oils (Lemongrass, Citronella, Vetiver) fetch high prices (₹1,500–₹3,000/liter) from cosmetic and aroma brands.",
    careerOutcomes: [
      "Village Essential Oil Distillation Unit Owner",
      "Ayush Certified Medicinal Herbs Cultivator & Supplier",
      "Average Monthly Earnings: ₹26,000 – ₹52,000"
    ],
    syllabusModules: [
      {
        title: "Module 1: Medicinal & Aromatic Plants (MAP) Cultivation",
        duration: "35 Hours",
        topics: [
          "Identification of Lemongrass, Palmarosa, Tulsi, Ashwagandha and Kalmegh",
          "Organic cultivation on degraded/tribal lands with minimal irrigation",
          "Optimal harvesting stage for peak active phytochemical and aroma content"
        ]
      },
      {
        title: "Module 2: Stainless Steel Steam Distillation Extraction",
        duration: "120 Hours",
        topics: [
          "Biomass loading, boiler pressure regulation and steam flow calibration",
          "Shell-and-tube condenser cooling water circulation",
          "Florentine flask separator operation for separating pure oil from hydrosol water"
        ]
      },
      {
        title: "Module 3: Gas Chromatography Quality Testing & Bottling",
        duration: "40 Hours",
        topics: [
          "Specific gravity, optical rotation and refractive index testing of oil purity",
          "Amber glass bottle filling, dropper caps and tamper-evident sealing",
          "Herbal leaf solar drying and pulverization for triphala and green tea blends"
        ]
      },
      {
        title: "Module 4: National Medicinal Plants Board (NMPB) & Export Linkage",
        duration: "145 Hours",
        topics: [
          "Direct buyback agreements with Ayurvedic pharmaceutical companies (Dabur, Patanjali, Zandu)",
          "Listing on TRIFED and organic wellness e-commerce portals",
          "NSDC Skill India Certificate & PM-AJAY Micro-Enterprise Grant Disbursal"
        ]
      }
    ]
  }
};

/**
 * Convert knowledge base dictionary into an enriched list of NSQFCourseExtra
 */
export const ALL_EXPANDED_NSQF_COURSES: NSQFCourseExtra[] = Object.entries(COMPREHENSIVE_SKILL_KNOWLEDGE_BASE).map(
  ([key, item]) => ({
    id: `nsqf-course-${key.replace(/_/g, "-")}`,
    title: item.title,
    nsqfLevel: item.nsqfLevel,
    qpCode: item.qpCode,
    badge: item.badge,
    badgeColor: item.badgeColor,
    duration: item.duration,
    location: "District Skill Hub, Kalahandi",
    image: item.image,
    description: item.description,
    stipend: item.stipend,
    eligibility: item.eligibility,
    centerName: "PMKK National Skill Center, Bhawanipatna",
    centerDistance: "10 km away",
    batchDate: "Batch: 15 Oct 2026",
    openings: 30,
    category: item.category,
    sectorId: item.sectorId,
    sectorName: item.sectorName,
    shortDesc: item.shortDesc,
    syllabusModules: item.syllabusModules,
    careerOutcomes: item.careerOutcomes,
    subsidyGrantAmount: item.subsidyGrantAmount,
    wageRange: item.wageRange,
    microEnterpriseRange: item.microEnterpriseRange,
    aiInsights: item.aiInsights
  })
);

/**
 * Generate a complete, verified NSQF & PM-AJAY course from any detected skill name or phrase
 */
export function generateCourseFromDetectedSkill(
  rawSkill: string,
  district: string = "Kalahandi",
  state: string = "Odisha",
  customProfile?: BeneficiaryProfileData
): NSQFCourseExtra {
  const cleanSkill = (rawSkill || "Solar PV Specialist").trim();
  const lower = cleanSkill.toLowerCase();

  // 1. Check knowledge base for exact/partial domain matches
  let matchedKey: string | null = null;
  for (const [key, item] of Object.entries(COMPREHENSIVE_SKILL_KNOWLEDGE_BASE)) {
    if (item.keywords.some((k) => lower.includes(k) || k.includes(lower))) {
      matchedKey = key;
      break;
    }
  }

  const centerDist = district || "Kalahandi";
  const stateDist = state || "Odisha";

  if (matchedKey && COMPREHENSIVE_SKILL_KNOWLEDGE_BASE[matchedKey]) {
    const kb = COMPREHENSIVE_SKILL_KNOWLEDGE_BASE[matchedKey];
    const generatedId = `detected-skill-${lower.replace(/[^a-z0-9]/g, "-")}`;
    return {
      id: generatedId,
      title: `${cleanSkill} (NSQF Level ${kb.nsqfLevel})`,
      nsqfLevel: kb.nsqfLevel,
      qpCode: kb.qpCode,
      badge: "✨ Detected Worker Match",
      badgeColor: kb.badgeColor,
      duration: kb.duration,
      location: `${centerDist}, ${stateDist}`,
      image: kb.image,
      description: `${kb.description} Specially synthesized based on your verified background in ${cleanSkill}.`,
      stipend: kb.stipend,
      eligibility: customProfile?.education ? `${customProfile.education} or equivalent` : kb.eligibility,
      centerName: `PMKK National Skill Center, ${centerDist}`,
      centerDistance: "8 km away (Direct Bus Connectivity)",
      batchDate: "Next Batch: 15 Oct 2026",
      openings: 30,
      category: kb.category,
      sectorId: kb.sectorId,
      sectorName: kb.sectorName,
      shortDesc: kb.shortDesc,
      isDetectedSkill: true,
      detectedReason: `Automatically synthesized from your verified skill profile (${cleanSkill})`,
      syllabusModules: kb.syllabusModules,
      careerOutcomes: kb.careerOutcomes,
      subsidyGrantAmount: kb.subsidyGrantAmount,
      wageRange: kb.wageRange,
      microEnterpriseRange: kb.microEnterpriseRange,
      aiInsights: kb.aiInsights
    };
  }

  // 2. Generative fallback: Create full NSQF course for any unique custom skill
  const generatedId = `detected-skill-${lower.replace(/[^a-z0-9]/g, "-")}`;
  const isAgri = /agri|farm|crop|plant|soil|livestock|dairy|goat|poultry|fish|seed|honey|bee/i.test(lower);
  const isHandicraft = /craft|bamboo|pottery|artisan|tailor|cloth|handloom|wood|jewel/i.test(lower);
  const isHealth = /health|nurse|care|patient|medic|ayush|doctor|clinic/i.test(lower);
  const isDigital = /digital|comput|csc|web|it|plumb|mason|construct/i.test(lower);
  const isTech = /tech|repair|mechanic|electric|motor|wire|weld|machine|phone|auto|solar|ev/i.test(lower);

  const category: TrainingCategory = isAgri
    ? "agriculture"
    : isHandicraft
      ? "self_employment"
      : isHealth
        ? "healthcare"
        : isDigital
          ? "digital_construction"
          : isTech
            ? "technical"
            : "service";

  const sectorId = isAgri
    ? "agriculture_allied"
    : isHandicraft
      ? "crafts_textiles"
      : isHealth
        ? "healthcare_services"
        : isDigital
          ? "digital_construction"
          : isTech
            ? "green_energy_tech"
            : "micro_enterprise_grants";

  const sectorName = SECTOR_DEFINITIONS.find((s) => s.id === sectorId)?.name || "Technical & Vocational Trades";

  const qpPrefix = isAgri ? "AGR" : isHandicraft ? "HCS" : isHealth ? "HSS" : isDigital ? "SSC" : "ELE";
  const hashVal = Math.abs(cleanSkill.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const qpCode = `${qpPrefix}/Q${(hashVal % 8999) + 1000}`;

  return {
    id: generatedId,
    title: `${cleanSkill} (NSQF Level 4)`,
    nsqfLevel: 4,
    qpCode: qpCode,
    badge: "✨ Detected Worker Match",
    badgeColor: "purple",
    duration: "3 Months",
    location: `${centerDist}, ${stateDist}`,
    image: isAgri ? "/dashboard/food_processing.jpg" : isHandicraft ? "/dashboard/tailoring.jpg" : "/dashboard/electrician.jpg",
    description: `Comprehensive NSDC and PM-AJAY certified training program for ${cleanSkill}. Includes safety protocols, practical domain mastery, digital commerce enablement, and enterprise startup funding.`,
    stipend: "₹3,500/month (PM-AJAY DBT Support) + Tool Kit Allowance",
    eligibility: customProfile?.education || "10th Standard or Functional Literacy",
    centerName: `PMKK District Skill Development Hub, ${centerDist}`,
    centerDistance: "10 km away",
    batchDate: "Next Batch: 20 Oct 2026",
    openings: 25,
    category: category,
    sectorId: sectorId,
    sectorName: sectorName,
    shortDesc: `Master practical ${cleanSkill}, earn NSDC Skill India Certificate and get PM-AJAY funding.`,
    isDetectedSkill: true,
    detectedReason: `Custom NSQF training course generated for detected skill: ${cleanSkill}`,
    subsidyGrantAmount: "₹35,000 PM-AJAY Micro-Enterprise Capital Subsidy",
    wageRange: "₹15,000 – ₹24,000 / mo",
    microEnterpriseRange: "₹28,000 – ₹48,000 / mo",
    aiInsights: `Custom synthesized NSQF qualification curriculum matching your verified aptitude in ${cleanSkill}.`,
    careerOutcomes: [
      `Independent ${cleanSkill} Micro-Enterprise Entrepreneur`,
      `Certified Skilled Contractor in ${centerDist} region`,
      `Average Monthly Income Potential: ₹20,000 – ₹38,000`
    ],
    syllabusModules: [
      {
        title: `Module 1: Core Fundamentals & Safety Standards for ${cleanSkill}`,
        duration: "40 Hours",
        topics: [
          "Occupational health and safety guidelines (OHSAS protocols)",
          "Tool selection, calibration and workplace maintenance",
          "Quality standards and defect prevention methods"
        ]
      },
      {
        title: `Module 2: Practical Lab & Advanced ${cleanSkill} Mastery`,
        duration: "130 Hours",
        topics: [
          "Hands-on practical assemblies and diagnostic testing",
          "Micro-level troubleshooting and preventive maintenance",
          "Adherence to National Skills Qualification Framework (NSQF Level 4) benchmarks"
        ]
      },
      {
        title: "Module 3: Digital Payments, Invoicing & Financial Inclusion",
        duration: "35 Hours",
        topics: [
          "UPI digital collections and customer QR code invoicing",
          "DigiLocker certificate integration and online business portfolio",
          "PM-AJAY subsidy application and Jan Dhan banking procedures"
        ]
      },
      {
        title: "Module 4: Field Apprenticeship & Micro-Enterprise Launch",
        duration: "140 Hours",
        topics: [
          "Live project deployment with certified industry partners",
          "Customer relationship and local market distribution setup",
          "NSDC Skill India Certificate & PM-AJAY Grant Award"
        ]
      }
    ]
  };
}

/**
 * Helper to ensure a safe, verified image URL is always returned
 */
export function getSafeCourseImage(image?: string, title?: string, category?: string): string {
  const validImages = [
    "/dashboard/electrician.jpg",
    "/dashboard/food_processing.jpg",
    "/dashboard/tailoring.jpg"
  ];
  if (image && validImages.includes(image)) {
    return image;
  }
  const text = `${title || ""} ${category || ""}`.toLowerCase();
  if (/tailor|cloth|handloom|craft|bamboo|pottery|terracotta|garment|apparel|sewing|embroidery|artisan|beauty|wellness/i.test(text)) {
    return "/dashboard/tailoring.jpg";
  }
  if (/agri|farm|food|dairy|milk|poultry|fish|biofloc|honey|bee|mushroom|spice|oil|millet|herbal|health|gda|medic|telemed/i.test(text)) {
    return "/dashboard/food_processing.jpg";
  }
  return "/dashboard/electrician.jpg";
}

/**
 * Get unified list of training courses including any dynamically detected worker skills
 */
export function getPersonalizedTrainingCourses(
  profile: BeneficiaryProfileData | null,
  baseCourses: NSQFCourseExtra[] = ALL_EXPANDED_NSQF_COURSES
): {
  detectedCourses: NSQFCourseExtra[];
  allCourses: NSQFCourseExtra[];
  detectedSkillName: string | null;
} {
  const detectedSkills: string[] = [];

  if (profile) {
    if (profile.nsqfCourse && profile.nsqfCourse.trim().length > 0) {
      detectedSkills.push(profile.nsqfCourse);
    }
    if (profile.skills && profile.skills.length > 0) {
      profile.skills.forEach((s) => {
        if (s && s.trim().length > 0 && !detectedSkills.includes(s)) {
          detectedSkills.push(s);
        }
      });
    }
    if (profile.aspiration && profile.aspiration.trim().length > 0 && !detectedSkills.includes(profile.aspiration)) {
      detectedSkills.push(profile.aspiration);
    }
  }

  // Also check localStorage if available
  if (typeof window !== "undefined" && detectedSkills.length === 0) {
    try {
      const saved = localStorage.getItem("Sakhyam_beneficiary_profile");
      if (saved) {
        const parsed: BeneficiaryProfileData = JSON.parse(saved);
        if (parsed.nsqfCourse) detectedSkills.push(parsed.nsqfCourse);
        if (parsed.skills) parsed.skills.forEach((s) => detectedSkills.push(s));
      }
    } catch { }
  }

  const generatedCourses: NSQFCourseExtra[] = [];
  const seenTitles = new Set<string>();

  // Add detected skill courses first
  for (const skill of detectedSkills) {
    const clean = skill.replace(/\(.*?\)/g, "").trim();
    if (clean.length > 2 && !seenTitles.has(clean.toLowerCase())) {
      seenTitles.add(clean.toLowerCase());
      const customCourse = generateCourseFromDetectedSkill(
        clean,
        profile?.district || "Kalahandi",
        profile?.state || "Odisha",
        profile || undefined
      );
      // Ensure image is safe
      customCourse.image = getSafeCourseImage(customCourse.image, customCourse.title, customCourse.category);
      generatedCourses.push(customCourse);
    }
  }

  // Combine with base courses, ensuring no duplicate titles
  const combined = [...generatedCourses];
  const catalogToUse = baseCourses.length > 0 ? baseCourses : ALL_EXPANDED_NSQF_COURSES;

  catalogToUse.forEach((bc) => {
    const baseTitleClean = bc.title.replace(/\(.*?\)/g, "").toLowerCase().trim();
    const isAlreadyCovered = generatedCourses.some((gc) => {
      const gcTitleClean = gc.title.replace(/\(.*?\)/g, "").toLowerCase().trim();
      return gcTitleClean.includes(baseTitleClean) || baseTitleClean.includes(gcTitleClean);
    });
    if (!isAlreadyCovered) {
      combined.push({
        ...bc,
        image: getSafeCourseImage(bc.image, bc.title, bc.category)
      });
    }
  });

  return {
    detectedCourses: generatedCourses,
    allCourses: combined,
    detectedSkillName: detectedSkills.length > 0 ? detectedSkills[0] : null
  };
}

/**
 * Get personalized recommended courses array for horizontal carousels & previews
 */
export function getPersonalizedRecommendedCourses(
  profile: BeneficiaryProfileData | null,
  baseList?: CourseItem[]
): CourseItem[] {
  const { allCourses } = getPersonalizedTrainingCourses(
    profile,
    ALL_EXPANDED_NSQF_COURSES
  );

  return allCourses;
}
