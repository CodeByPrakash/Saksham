"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  User,
  MapPin,
  Wrench,
  GraduationCap,
  Briefcase,
  ChevronRight,
  RotateCcw,
  Sparkle,
  Radio,
  VolumeX,
  Globe,
  Lock,
  Edit3,
  Save,
  Check,
  X,
  Pencil,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import confetti from "canvas-confetti";

export interface BeneficiaryProfileData {
  fullName: string;
  district: string;
  state: string;
  skills: string[];
  nsqfCode: string;
  nsqfLevel: number;
  nsqfCourse: string;
  education: string;
  aspiration: string;
  recommendedPathway: string;
  grantEligibility: string;
  matchScore: number;
}

interface PersonalVoiceOnboardingProps {
  onComplete: (profile: BeneficiaryProfileData) => void;
  onSkip?: () => void;
  onBack?: () => void;
  initialLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

interface StepQuestion {
  id: "name_location" | "skills_experience" | "education" | "aspiration";
  title: string;
  subtitle: Record<string, string>;
  aiPromptText: Record<string, string>;
  sampleChips: {
    label: Record<string, string> | string;
    spokenText: Record<string, string> | string;
  }[];
}

const ONBOARDING_QUESTIONS: StepQuestion[] = [
  {
    id: "name_location",
    title: "Step 1 of 4 • Name & Location",
    subtitle: {
      en: "Your Name and District",
      hi: "आपका नाम और जिला",
      or: "ଆପଣଙ୍କ ନାମ ଏବଂ ଜିଲ୍ଲା",
      sat: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨ ᱡᱤᱞᱟ",
      bn: "আপনার নাম এবং জেলা",
      bho: "रउरा नाम आ जिला",
      mr: "तुमचे नाव आणि जिल्हा"
    },
    aiPromptText: {
      en: "Namaste! What is your name and which village or district are you from?",
      hi: "नमस्ते! आपका नाम क्या है और आप किस गाँव या जिले से हैं?",
      or: "ନମସ୍କାର! ଆପଣଙ୍କ ନାମ କ’ଣ ଏବଂ ଆପଣ କେଉଁ ଗାଁ ବା ଜିଲ୍ଲାରୁ ଆସିଛନ୍ତି?",
      sat: "ᱡᱚᱦᱟᱨ! ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱟᱨ ᱟᱢ ᱚᱠᱟ ᱟᱹᱛᱩ ᱥᱮ ᱡᱤᱞᱟ ᱠᱷᱚᱱ ᱦᱮᱡ ᱟᱠᱟᱱᱟᱢ?",
      bn: "নমস্কার! আপনার নাম কি এবং আপনি কোন গ্রাম বা জেলা থেকে এসেছেন?",
      bho: "प्रणाम! रउरा नाम का ह आ रउरा कवन गाँव भा जिला से बानी?",
      mr: "नमस्ते! आपले नाव काय आहे आणि आपण कोणत्या गावातून किंवा जिल्ह्यातून आला आहात?"
    },
    sampleChips: [
      {
        label: {
          en: "👤 Ramesh Soren (Sundargarh)",
          hi: "👤 रमेश सोरेन (सुंदरगढ़)",
          or: "👤 ରମେଶ ସୋରେନ (ସୁନ୍ଦରଗଡ଼)",
          sat: "👤 ᱨᱚᱢᱮᱥ ᱥᱚᱨᱮᱱ (ᱥᱩᱱᱫᱚᱨᱜᱚᱲ)",
          bn: "👤 রমেশ সোরেন (সুন্দরগড়)",
          bho: "👤 रमेश सोरेन (सुंदरगढ़)",
          mr: "👤 रमेश सोरेन (सुंदरगड)",
          te: "👤 రమేష్ సోరెన్ (సుందర్‌గఢ్)",
          ta: "👤 ரமேஷ் சோரன் (சுந்தர்கர்)"
        },
        spokenText: {
          en: "My name is Ramesh Soren and I am from Sundargarh district.",
          hi: "मेरा नाम रमेश सोरेन है और मैं सुंदरगढ़ जिले से हूँ।",
          or: "ମୋର ନାମ ରମେଶ ସୋରେନ ଏବଂ ମୁଁ ସୁନ୍ଦରଗଡ଼ ଜିଲ୍ଲାରୁ ଆସିଛି।",
          sat: "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱨᱚᱢᱮᱥ ᱥᱚᱨᱮᱱ ᱠᱟᱱᱟ ᱟᱨ ᱤᱧ ᱥᱩᱱᱫᱚᱨᱜᱚᱲ ᱡᱤᱞᱟ ᱠᱷᱚᱱ ᱦᱮᱡ ᱟᱠᱟᱱᱟᱹᱧ।",
          bn: "আমার নাম রমেশ সোরেন এবং আমি সুন্দরগড় জেলা থেকে এসেছি।",
          bho: "हमार नाम रमेश सोरेन ह आ हम सुंदरगढ़ जिला से बानी।",
          mr: "माझे नाव रमेश सोरेन आहे आणि मी सुंदरगड जिल्ह्यातून आहे.",
          te: "నా పేరు రమేష్ సోరెన్ మరియు నేను సుందర్‌గఢ్ జిల్లాకు చెందినవాడిని.",
          ta: "என் பெயர் ரமேஷ் சோரன், நான் சுந்தர்கர் மாவட்டத்தைச் சேர்ந்தவன்."
        }
      },
      {
        label: {
          en: "👤 Savitri Devi (Kalahandi)",
          hi: "👤 सावित्री देवी (कालाहांडी)",
          or: "👤 ସାବିତ୍ରୀ ଦେବୀ (କଳାହାଣ୍ଡି)",
          sat: "👤 ᱥᱟᱵᱤᱛᱨᱤ ᱫᱮᱵᱤ (ᱠᱟᱞᱟᱦᱟᱱᱰᱤ)",
          bn: "👤 সাবিত্রী দেবী (কালাহান্ডি)",
          bho: "👤 सावित्री देवी (कालाहांडी)",
          mr: "👤 सावित्री देवी (कालाहांडी)",
          te: "👤 సావిత్రి దేవి (కలహండి)",
          ta: "👤 சாவித்ரி தேவி (காலாஹண்டி)"
        },
        spokenText: {
          en: "My name is Savitri Devi, from Kalahandi Odisha.",
          hi: "मेरा नाम सावित्री देवी है, कालाहांडी ओडिशा से।",
          or: "ମୋର ନାମ ସାବିତ୍ରୀ ଦେବୀ, କଳାହାଣ୍ଡି ଓଡ଼ିଶାରୁ।",
          sat: "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱥᱟᱵᱤᱛᱨᱤ ᱫᱮᱵᱤ ᱠᱟᱱᱟ, ᱠᱟᱞᱟᱦᱟᱱᱰᱤ ᱳᱰᱤᱥᱟ ᱠᱷᱚᱱ।",
          bn: "আমার নাম সাবিত্রী দেবী, কালাহান্ডি ওড়িশা থেকে।",
          bho: "हमार नाम सावित्री देवी ह, कालाहांडी ओडिशा से।",
          mr: "माझे नाव सावित्री देवी आहे, कालाहांडी ओडिशातून.",
          te: "నా పేరు సావిత్రి దేవి, కలహండి ఒడిశా నుండి.",
          ta: "என் பெயர் சாவித்ரி தேவி, காலாஹண்டி ஒடிசா."
        }
      },
      {
        label: {
          en: "👤 Amit Kumar (Varanasi)",
          hi: "👤 अमित कुमार (वाराणसी)",
          or: "👤 ଅମିତ କୁମାର (ବାରାଣାସୀ)",
          sat: "👤 ᱚᱢᱤᱛ ᱠᱩᱢᱟᱨ (ᱵᱟᱨᱟᱬᱟᱥᱤ)",
          bn: "👤 অমিত কুমার (বারাণসী)",
          bho: "👤 अमित कुमार (वाराणसी)",
          mr: "👤 अमित कुमार (वाराणसी)",
          te: "👤 అమిత్ కుమార్ (వారణాసి)",
          ta: "👤 அமித் குமார் (வாரணாசி)"
        },
        spokenText: {
          en: "My name is Amit Kumar, Varanasi Uttar Pradesh.",
          hi: "मेरा नाम अमित कुमार है, वाराणसी उत्तर प्रदेश।",
          or: "ମୋର ନାମ ଅମିତ କୁମାର, ବାରାଣାସୀ ଉତ୍ତର ପ୍ରଦେଶ।",
          sat: "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱚᱢᱤᱛ ᱠᱩᱢᱟᱨ ᱠᱟᱱᱟ, ᱵᱟᱨᱟᱬᱟᱥᱤ ᱩᱛᱛᱚᱨ ᱯᱨᱚᱫᱮᱥ ᱠᱷᱚᱱ।",
          bn: "আমার নাম অমিত কুমার, বারাণসী উত্তর প্রদেশ।",
          bho: "हमार नाम अमित कुमार ह, वाराणसी उत्तर प्रदेश से।",
          mr: "माझे नाव अमित कुमार आहे, वाराणसी उत्तर प्रदेश.",
          te: "నా పేరు అమిత్ కుమార్, వారణాసి ఉత్తర ప్రదేశ్.",
          ta: "என் பெயர் அமித் குமார், வாரணாசி உத்தரப் பிரதேசம்."
        }
      }
    ]
  },
  {
    id: "skills_experience",
    title: "Step 2 of 4 • Daily Skills & Trade",
    subtitle: {
      en: "Your Practical Skills & Work",
      hi: "आपका हुनर और दैनिक काम",
      or: "ଆପଣଙ୍କ କୌଶଳ ଓ ଦୈନନ୍ଦିନ କାମ",
      sat: "ᱟᱢᱟᱜ ᱦᱩᱱᱟᱹᱨ ᱟᱨ ᱫᱤᱱᱟᱹᱢ ᱠᱟᱹᱢᱤ",
      bn: "আপনার দক্ষতা এবং কাজ",
      bho: "रउरा हुनर आ रोज के काम",
      mr: "तुमचे कौशल्य आणि दैनंदिन काम"
    },
    aiPromptText: {
      en: "What informal work, trade, or practical skills do you have experience in? (e.g. pump repair, farming, stitching, electrical)",
      hi: "आप वर्तमान में क्या काम करते हैं या आपको किस काम का अनुभव है? जैसे खेती, मोटर रिपेयर, सिलाई या बिजली का काम।",
      or: "ଆପଣ କେଉଁ କାମ କରନ୍ତି କିମ୍ବା ଆପଣଙ୍କର କେଉଁଥିରେ ଅଭିଜ୍ଞତା ଅଛି? ଯେପରି ଚାଷ, ମୋଟର ମରାମତି, ସିଲେଇ ବା ବିଦ୍ୟୁତ କାମ।",
      sat: "ᱟᱢ ᱱᱤᱛᱚᱜ ᱪᱮᱫ ᱠᱟᱹᱢᱤᱭᱮᱫᱟᱢ ᱥᱮ ᱪᱮᱫ ᱦᱩᱱᱟᱹᱨ ᱢᱮᱱᱟᱜᱼᱟ? ᱡᱮᱞᱮᱠᱟ ᱪᱟᱥ, ᱢᱚᱴᱚᱨ ᱵᱮᱱᱟᱣ, ᱞᱩᱜᱽᱲᱤ ᱥᱤᱞᱟᱹᱭ ᱥᱮ ᱵᱤᱡᱽᱞᱤ ᱠᱟᱹᱢᱤ।",
      bn: "আপনি বর্তমানে কি কাজ করেন বা কি কাজের অভিজ্ঞতা আছে? যেমন মোটর মেরামত, সেলাই বা বিদ্যুতের কাজ।",
      bho: "रउरा कवन काम करीं भा कवन काम के अनुभव बा? जइसे खेती, मोटर रिपेयर, सिलाई भा बिजली के काम।",
      mr: "तुम्ही सध्या काय काम करता किंवा तुम्हाला कोणत्या कामाचा अनुभव आहे? जसे की मोटर दुरुस्ती, टेलरिंग किंवा इलेक्ट्रिकल काम."
    },
    sampleChips: [
      {
        label: {
          en: "⚡ Motor & Agri-Pump Repair",
          hi: "⚡ मोटर व कृषि पंप रिपेयर",
          or: "⚡ ମୋଟର ଓ କୃଷି ପମ୍ପ ମରାମତି",
          sat: "⚡ ᱢᱚᱴᱚᱨ ᱟᱨ ᱪᱟᱥ ᱯᱟᱢᱯ ᱵᱮᱱᱟᱣ",
          bn: "⚡ মোটর ও কৃষি পাম্প মেরামত",
          bho: "⚡ मोटर आ कृषि पंप रिपेयर",
          mr: "⚡ मोटर आणि कृषी पंप दुरुस्ती",
          te: "⚡ మోటార్ మరియు అగ్రి-పంప్ మరమ్మతు",
          ta: "⚡ மோட்டார் & வேளாண் பம்ப் பழுது"
        },
        spokenText: {
          en: "I do farming and also repair electric motors and water pumps in my village.",
          hi: "खेती करता हूँ और थोड़ा बहुत मोटर और पानी का पंप भी ठीक कर लेता हूँ।",
          or: "ଚାଷ କରେ ଏବଂ ମୋଟର ଓ ପାଣି ପମ୍ପ ମଧ୍ୟ ମରାମତି କରିପାରେ।",
          sat: "ᱪᱟᱥ ᱠᱟᱹᱢᱤ ᱟᱨ ᱢᱚᱴᱚᱨ ᱟᱨ ᱫᱟᱜ ᱯᱟᱢᱯ ᱦᱚᱸ ᱴᱷᱤᱠ ᱵᱟᱰᱟᱭᱟᱹᱧ।",
          bn: "চাষ করি এবং কিছুটা মোটর ও পানির পাম্প মেরামত করতে পারি।",
          bho: "खेती करीं ला आ मोटर आ पानी के पंपो ठीक क लेवेनी।",
          mr: "शेती करतो आणि थोडीफार मोटर आणि पाण्याचा पंपही दुरुस्त करतो.",
          te: "నేను వ్యవసాయం చేస్తాను మరియు మోటార్లు, నీటి పంపులను కూడా రిపేర్ చేస్తాను.",
          ta: "விவசாயம் செய்கிறேன், மோட்டார் மற்றும் தண்ணீர் பம்புகளையும் சரிசெய்கிறேன்."
        }
      },
      {
        label: {
          en: "✂️ Tailoring & Garment Stitching",
          hi: "✂️ सिलाई व परिधान निर्माण",
          or: "✂️ ସିଲେଇ ଓ ପୋଷାକ ତିଆରି",
          sat: "✂️ ᱞᱩᱜᱽᱲᱤ ᱥᱤᱞᱟᱹᱭ ᱠᱟᱹᱢᱤ",
          bn: "✂️ সেলাই ও পোশাক তৈরি",
          bho: "✂️ सिलाई आ कपड़ा सिलाई",
          mr: "✂️ शिलाई आणि कपडे शिवणे",
          te: "✂️ టైలరింగ్ & దుస్తుల కుట్టు పని",
          ta: "✂️ தையல் & ஆடை தயாரிப்பு"
        },
        spokenText: {
          en: "I operate a sewing machine at home and stitch clothes and garments.",
          hi: "घर पर सिलाई मशीन चलाती हूँ और कपड़े सिलती हूँ।",
          or: "ଘରେ ସିଲେଇ ମେସିନ୍ ଚଳାଏ ଏବଂ କପଡ଼ା ସିଲେଇ କରେ।",
          sat: "ᱚᱲᱟᱜ ᱨᱮ ᱥᱤᱞᱟᱹᱭ ᱢᱮᱥᱤᱱ ᱪᱟᱞᱟᱣ ᱟᱨ ᱞᱩᱜᱽᱲᱤ ᱥᱤᱞᱟᱹᱭᱟᱹᱧ।",
          bn: "বাড়িতে সেলাই মেশিন চালাই এবং পোশাক তৈরি করি।",
          bho: "घर पर सिलाई मशीन चलाईं ला आ कपड़ा सींवेनी।",
          mr: "घरी शिलाई मशीन चालवते आणि कपडे शिवते.",
          te: "ఇంట్లో కుట్టు మిషన్ నడుపుతూ బట్టలు కుడతాను.",
          ta: "வீட்டில் தையல் இயந்திரம் இயக்கி துணிகள் தைக்கிறேன்."
        }
      },
      {
        label: {
          en: "🔌 Domestic Electrician",
          hi: "🔌 घरेलू इलेक्ट्रीशियन व वायरिंग",
          or: "🔌 ଘରୋଇ ଇଲେକ୍ଟ୍ରିସିଆନ୍ ଓ ୱାୟରିଂ",
          sat: "🔌 ᱚᱲᱟᱜ ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱣᱟᱭᱨᱤᱝ",
          bn: "🔌 গৃহস্থালি ইলেকট্রিশিয়ান",
          bho: "🔌 घरेलू इलेक्ट्रीशियन आ वायरिंग",
          mr: "🔌 घरगुती इलेक्ट्रिशियन आणि वायरिंग",
          te: "🔌 గృహ ఎలక్ట్రీషియన్ & వైరింగ్",
          ta: "🔌 வீட்டு எலக்ட்ரீசியன் & வயரிங்"
        },
        spokenText: {
          en: "I do house wiring, fan and motor electrical repair work in my locality.",
          hi: "गांव में घरों की वायरिंग और पंखा-मोटर रिपेयर करता हूँ।",
          or: "ଗାଁରେ ଘରର ୱାୟରିଂ ଏବଂ ପଙ୍ଖା-ମୋଟର ମରାମତି କରେ।",
          sat: "ᱟᱹᱛᱩ ᱨᱮ ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱵᱤᱡᱽᱞᱤ ᱣᱟᱭᱨᱤᱝ ᱟᱨ ᱯᱷᱮᱱ-ᱢᱚᱴᱚᱨ ᱴᱷᱤᱠᱟᱹᱧ।",
          bn: "গ্রামে বাড়ির ওয়্যারিং এবং ফ্যান-মোটর মেরামত করি।",
          bho: "गांव में घर के वायरिंग आ पंखा-मोटर ठीक करीं ला।",
          mr: "गावात घरांची वायरिंग आणि पंखा-मोटर दुरुस्त करतो.",
          te: "గ్రామంలో ఇళ్ల వైరింగ్ మరియు ఫ్యాన్లు, మోటార్లు రిపేర్ చేస్తాను.",
          ta: "கிராமத்தில் வீட்டு வயரிங் மற்றும் மின் விசிறி, மோட்டார் பழுதுபார்க்கிறேன்."
        }
      }
    ]
  },
  {
    id: "education",
    title: "Step 3 of 4 • Education Level",
    subtitle: {
      en: "Your Education & Literacy Level",
      hi: "आपकी पढ़ाई व साक्षरता",
      or: "ଆପଣଙ୍କ ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା",
      sat: "ᱟᱢᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱞᱮᱵᱮᱞ",
      bn: "আপনার শিক্ষাগত যোগ্যতা",
      bho: "रउरा पढ़ाई आ साक्षरता",
      mr: "तुमचे शिक्षण आणि साक्षरता"
    },
    aiPromptText: {
      en: "What is your highest education level? (e.g., 5th pass, 8th pass, 10th pass, or practical experience without formal schooling)",
      hi: "आपकी पढ़ाई कहाँ तक हुई है? जैसे 5वीं, 8वीं, 10वीं पास या बिना औपचारिक पढ़ाई के व्यावहारिक हुनर।",
      or: "ଆପଣଙ୍କର ପାଠପଢ଼ା କେତେ ପର୍ଯ୍ୟନ୍ତ ହୋଇଛି? ଯେପରି ୫ମ, ୮ମ, ୧୦ମ ପାସ ବା ବ୍ୟବହାରିକ ଜ୍ଞାନ।",
      sat: "ᱟᱢᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱛᱤᱱᱟᱹᱜ ᱦᱩᱭ ᱟᱠᱟᱱᱟ? ᱡᱮᱞᱮᱠᱟ ᱕, ᱘, ᱑᱐ ᱯᱟᱥ ᱥᱮ ᱵᱤᱱᱟᱹ ᱯᱟᱲᱦᱟᱣ ᱛᱮ ᱠᱟᱹᱢᱤ ᱦᱩᱱᱟᱹᱨ।",
      bn: "আপনার পড়াশোনা কতদূর হয়েছে? যেমন ৫ম, ৮ম, ১০ম পাশ বা ব্যবহারিক কাজের অভিজ্ঞতা।",
      bho: "रउरा पढ़ाई कहाँ ले भइल बा? जइसे 5वीं, 8वीं, 10वीं पास भा बिना पढ़ले हुनर।",
      mr: "आपले शिक्षण कितपत झाले आहे? जसे की ५ वी, ८ वी, १० वी पास किंवा अनुभवावर काम."
    },
    sampleChips: [
      {
        label: {
          en: "🎓 10th Pass (Matriculation)",
          hi: "🎓 10वीं पास (मैट्रिक)",
          or: "🎓 ୧୦ମ ପାସ (ମ୍ୟାଟ୍ରିକ)",
          sat: "🎓 ᱑᱐ ᱯᱟᱥ (ᱢᱮᱴᱨᱤᱠ)",
          bn: "🎓 ১০ম পাস (ম্যাট্রিক)",
          bho: "🎓 10वीं पास (मैट्रिक)",
          mr: "🎓 १० वी पास (मॅट्रिक)",
          te: "🎓 10వ తరగతి పాస్",
          ta: "🎓 10ஆம் வகுப்பு தேர்ச்சி"
        },
        spokenText: {
          en: "I have completed my 10th standard matriculation education.",
          hi: "मैंने 10वीं तक की पढ़ाई पूरी की है।",
          or: "ମୁଁ ଦଶମ ଶ୍ରେଣୀ ପର୍ଯ୍ୟନ୍ତ ପାଠ ପଢ଼ିଛି।",
          sat: "ᱤᱧ ᱑᱐ ᱪᱟᱱᱟᱪ ᱦᱟᱹᱵᱤᱡ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱨᱟᱹᱣ ᱟᱠᱟᱫᱟᱹᱧ।",
          bn: "আমি দশম শ্রেণী পর্যন্ত পড়াশোনা করেছি।",
          bho: "हम 10वीं ले पढ़ाई पूरा कइले बानी।",
          mr: "मी दहावीपर्यंत शिक्षण पूर्ण केले आहे.",
          te: "నేను 10వ తరగతి వరకు చదువుకున్నాను.",
          ta: "நான் 10ஆம் வகுப்பு வரை படித்துள்ளேன்."
        }
      },
      {
        label: {
          en: "📖 8th Standard Completed",
          hi: "📖 8वीं कक्षा उत्तीर्ण",
          or: "📖 ୮ମ ଶ୍ରେଣୀ ପାସ",
          sat: "📖 ᱘ ᱪᱟᱱᱟᱪ ᱯᱟᱲᱦᱟᱣ",
          bn: "📖 ৮ম শ্রেণী উত্তীর্ণ",
          bho: "📖 8वीं पास",
          mr: "📖 ८ वी उत्तीर्ण",
          te: "📖 8వ తరగతి పాస్",
          ta: "📖 8ஆம் வகுப்பு தேர்ச்சி"
        },
        spokenText: {
          en: "I studied up to 8th standard in school.",
          hi: "मैंने आठवीं कक्षा तक पढ़ाई की है।",
          or: "ମୁଁ ଅଷ୍ଟମ ଶ୍ରେଣୀ ପର୍ଯ୍ୟନ୍ତ ପାଠ ପଢ଼ିଛି।",
          sat: "ᱤᱧ ᱘ ᱪᱟᱱᱟᱪ ᱦᱟᱹᱵᱤᱡ ᱤᱥᱠᱩᱞ ᱨᱮ ᱯᱟᱲᱦᱟᱣ ᱟᱠᱟᱱᱟᱹᱧ।",
          bn: "আমি অষ্টম শ্রেণী পর্যন্ত স্কুলে পড়াশোনা করেছি।",
          bho: "हम आठवीं तक स्कूल गइले बानी।",
          mr: "मी आठवीपर्यंत शाळेत शिकलो आहे.",
          te: "నేను 8వ తరగతి వరకు చదువుకున్నాను.",
          ta: "நான் எட்டாம் வகுப்பு வரை பள்ளியில் படித்துள்ளேன்."
        }
      },
      {
        label: {
          en: "🛠️ Practical Learner (5th / Non-formal)",
          hi: "🛠️ व्यावहारिक हुनर (5वीं / गैर-औपचारिक)",
          or: "🛠️ ବ୍ୟବହାରିକ ଜ୍ଞାନ (୫ମ / ଅଣ-ଆନୁଷ୍ଠାନିକ)",
          sat: "🛠️ ᱵᱮᱵᱷᱟᱨᱤᱠ ᱦᱩᱱᱟᱹᱨ (᱕ ᱯᱟᱥ / ᱵᱤᱱᱟᱹ ᱤᱥᱠᱩᱞ)",
          bn: "🛠️ ব্যবহারিক জ্ঞান (৫ম শ্রেণী / নন-ফর্মাল)",
          bho: "🛠️ व्यावहारिक हुनर (5वीं / गैर-औपचारिक)",
          mr: "🛠️ प्रत्यक्ष कामाचा अनुभव (५ वी / अनौपचारिक)",
          te: "🛠️ ప్రాక్టికల్ అనుభవం (5వ తరగతి)",
          ta: "🛠️ நேரடி வேலை அனுபவம் (5ஆம் வகுப்பு)"
        },
        spokenText: {
          en: "I studied up to 5th standard, but I have full practical skills and hands-on experience.",
          hi: "पाँचवीं तक पढ़ा हूँ, लेकिन काम का पूरा हुनर और अनुभव है।",
          or: "ପଞ୍ଚମ ଯାଏଁ ପଢ଼ିଛି, କିନ୍ତୁ କାମର ପୂରା ଅନୁଭବ ଓ କୌଶଳ ଅଛି।",
          sat: "᱕ ᱪᱟᱱᱟᱪ ᱦᱟᱹᱵᱤᱡ ᱯᱟᱲᱦᱟᱣ ᱢᱮᱱᱟᱜᱼᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱯᱩᱨᱟᱹ ᱦᱩᱱᱟᱹᱨ ᱢᱮᱱᱟᱜᱼᱟ।",
          bn: "পঞ্চম পর্যন্ত পড়েছি, তবে কাজের পুরো অভিজ্ঞতা ও দক্ষতা রয়েছে।",
          bho: "पाँचवीं ले पढ़ले बानी, बाकिर काम के पूरा हुनर आ तजुर्बा बा।",
          mr: "पाचवीपर्यंत शिकलो आहे, पण कामाचा पूर्ण अनुभव आणि कौशल्य आहे.",
          te: "5వ తరగతి వరకే చదివాను, కానీ పనిలో పూర్తి ప్రాక్టికల్ అనుభవం ఉంది.",
          ta: "ஐந்தாம் வகுப்பு வரை படித்துள்ளேன், ஆனால் முழுமையான செய்முறை அனுபவம் உள்ளது."
        }
      }
    ]
  },
  {
    id: "aspiration",
    title: "Step 4 of 4 • Goal & Aspiration",
    subtitle: {
      en: "Your Career Goal or Enterprise Plan",
      hi: "आपका लक्ष्य व स्वरोजगार योजना",
      or: "ଆପଣଙ୍କ ଲକ୍ଷ୍ୟ ଓ ସ୍ୱରୋଜଗାର ଯୋଜନା",
      sat: "ᱟᱢᱟᱜ ᱡᱚᱥ ᱟᱨ ᱱᱤᱡᱮᱨᱟᱜ ᱵᱮᱯᱟᱨ",
      bn: "আপনার লক্ষ্য ও স্বরোজগার পরিকল্পনা",
      bho: "रउरा लक्ष्य आ स्वरोजगार योजना",
      mr: "तुमचे ध्येय आणि स्वयंरोजगार योजना"
    },
    aiPromptText: {
      en: "What is your main aspiration? Would you like to start your own village repair clinic/business with PM-AJAY grant support, or get assured wage placement?",
      hi: "आप आगे क्या करना चाहते हैं? पीएम-अजय अनुदान से अपना खुद का काम/दुकान शुरू करना चाहते हैं या पक्की नौकरी?",
      or: "ଆପଣ ଆଗକୁ କ’ଣ କରିବାକୁ ଚାହାଁନ୍ତି? ପିଏମ-ଅଜୟ ଅନୁଦାନ ସହିତ ନିଜର ଦୋକାନ ଆରମ୍ଭ କରିବେ କିମ୍ବା ଚାକିରି କରିବେ?",
      sat: "ᱟᱢ ᱞᱟᱦᱟ ᱛᱮ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱥᱟᱱᱟᱭᱮᱫ ᱢᱮᱭᱟ? ᱯᱤᱮᱢ-ᱚᱡᱚᱭ ᱜᱚᱲᱚ ᱛᱮ ᱱᱤᱡᱮᱨᱟᱜ ᱫᱩᱠᱟᱱ ᱠᱷᱩᱞᱟᱹᱣ ᱥᱮ ᱪᱟᱹᱠᱨᱤ?",
      bn: "আপনি পরবর্তীতে কি করতে চান? পিএম-অজয় অনুদানে নিজের ব্যবসা/দোকান শুরু করবেন নাকি চাকরি?",
      bho: "रउरा आगे का करे के चाहत बानी? पीएम-अजय अनुदान से आपन रोजगार/दुकान शुरू करे के बा कि पक्का नौकरी?",
      mr: "तुम्हाला पुढे काय करायचे आहे? पीएम-अजय अनुदानातून स्वतःचा व्यवसाय सुरू करायचा आहे की नोकरी?"
    },
    sampleChips: [
      {
        label: {
          en: "🏪 Own Village Repair Clinic / Shop",
          hi: "🏪 गांव में अपनी रिपेयरिंग दुकान",
          or: "🏪 ଗାଁରେ ନିଜର ମରାମତି ଦୋକାନ",
          sat: "🏪 ᱟᱹᱛᱩ ᱨᱮ ᱱᱤᱡᱮᱨᱟᱜ ᱵᱮᱱᱟᱣ ᱫᱩᱠᱟᱱ",
          bn: "🏪 গ্রামে নিজস্ব মেরামতের দোকান",
          bho: "🏪 गाँव में आपन रिपेयरिंग के दुकान",
          mr: "🏪 गावात स्वतःचे दुरुस्ती केंद्र / दुकान",
          te: "🏪 గ్రామంలో సొంత రిపేర్ షాప్",
          ta: "🏪 கிராமத்தில் சொந்த பழுதுபார்க்கும் கடை"
        },
        spokenText: {
          en: "I want to start my own solar and pump repair clinic in my village with PM-AJAY capital subsidy.",
          hi: "मैं पीएम-अजय अनुदान से अपने गांव में सोलर और मोटर रिपेयरिंग की दुकान शुरू करना चाहता हूँ।",
          or: "ମୁଁ ପିଏମ-ଅଜୟ ଅନୁଦାନରେ ଗାଁରେ ସୋଲାର ଓ ମୋଟର ମରାମତି ଦୋକାନ ଆରମ୍ଭ କରିବାକୁ ଚାହୁଁଛି।",
          sat: "ᱤᱧ ᱯᱤᱮᱢ-ᱚᱡᱚᱭ ᱜᱚᱲᱚ ᱛᱮ ᱟᱹᱛᱩ ᱨᱮ ᱥᱳᱞᱟᱨ ᱟᱨ ᱢᱚᱴᱚᱨ ᱵᱮᱱᱟᱣ ᱫᱩᱠᱟᱱ ᱠᱷᱩᱞᱟᱹᱣ ᱥᱟᱱᱟᱭᱮᱫᱤᱧᱟ।",
          bn: "আমি পিএম-অজয় অনুদানের সাহায্যে গ্রামে সোলার ও মোটর মেরামতের দোকান शुरू করতে চাই।",
          bho: "हम पीएम-अजय अनुदान से अपना गांव में सोलर आ मोटर रिपेयर के दुकान खोले के चाहत बानी।",
          mr: "मला पीएम-अजय अनुदानातून गावात सोलर आणि मोटर दुरुस्तीचे दुकान सुरू करायचे आहे.",
          te: "నేను పీఎం-అజయ్ గ్రాంట్‌తో నా గ్రామంలో సోలార్, మోటార్ రిపేరింగ్ షాప్ ప్రారంభించాలనుకుంటున్నాను.",
          ta: "நான் PM-AJAY மானியத்துடன் என் கிராமத்தில் சோலார் மற்றும் மோட்டார் பழுதுபார்க்கும் கடையைத் தொடங்க விரும்புகிறேன்."
        }
      },
      {
        label: {
          en: "💼 Assured Wage Job (Factory/Company)",
          hi: "💼 पक्की मासिक नौकरी (फैक्ट्री/कंपनी)",
          or: "💼 ନିଶ୍ଚିତ ନିଯୁକ୍ତି / ଚାକିରି",
          sat: "💼 ᱱᱤᱥᱪᱤᱛ ᱪᱟᱹᱠᱨᱤ (ᱠᱚᱢᱯᱟᱱᱤ ᱨᱮ)",
          bn: "💼 নিশ্চিত মাসিক চাকরি (কোম্পানি/কারখানা)",
          bho: "💼 पक्की नौकरी (फैक्ट्री/कंपनी में)",
          mr: "💼 खात्रीशीर नोकरी (कंपनी/फॅक्टरी)",
          te: "💼 గ్యారెంటీ ఉద్యోగం (కంపెనీ/ఫ్యాక్టరీ)",
          ta: "💼 உத்தரவாதமான ஊதிய வேலை (நிறுவனம்/தொழிற்சாலை)"
        },
        spokenText: {
          en: "I want wage employment or a steady job in a good enterprise or manufacturing company.",
          hi: "मुझे किसी अच्छी कंपनी में काम या नौकरी चाहिए।",
          or: "ମୋତେ ଭଲ କମ୍ପାନୀରେ କାମ କିମ୍ବା ନିଯୁକ୍ତି ଦରକାର।",
          sat: "ᱤᱧ ᱢᱤᱫ ᱵᱷᱟᱹᱜᱤ ᱠᱚᱢᱯᱟᱱᱤ ᱨᱮ ᱠᱟᱹᱢᱤ ᱥᱮ ᱪᱟᱹᱠᱨᱤ ᱠᱷᱚᱡᱚᱜ ᱠᱟᱱᱟᱹᱧ।",
          bn: "আমি একটি ভালো কোম্পানিতে নিশ্চিত কাজ বা চাকরি চাই।",
          bho: "हमरा कवनो बढ़िया कंपनी में काम भा नौकरी चाहीं।",
          mr: "मला चांगल्या कंपनीमध्ये स्थिर नोकरी किंवा काम हवे आहे.",
          te: "నాకు మంచి కంపెనీలో స్థిరమైన ఉద్యోగం లేదా ఉపాధి కావాలి.",
          ta: "எனக்கு ஒரு நல்ல நிறுவனத்தில் வேலை அல்லது நிலையான ஊதிய வேலை வேண்டும்."
        }
      },
      {
        label: {
          en: "🚀 Self-Employed Tailoring Unit",
          hi: "🚀 स्वरोजगार सिलाई केंद्र / बुटीक",
          or: "🚀 ସ୍ୱରୋଜଗାର ସିଲେଇ କେନ୍ଦ୍ର",
          sat: "🚀 ᱱᱤᱡᱮᱨᱟᱜ ᱥᱤᱞᱟᱹᱭ ᱥᱮᱱᱴᱟᱨ",
          bn: "🚀 স্বরোজগার সেলাই কেন্দ্র / বুটিক",
          bho: "🚀 स्वरोजगार सिलाई केंद्र / बुटीक",
          mr: "🚀 स्वयंरोजगार शिलाई केंद्र / बुटीक",
          te: "🚀 స్వయం ఉపాధి టైలరింగ్ యూనిట్",
          ta: "🚀 சுயதொழில் தையல் மையம் / பூட்டிக்"
        },
        spokenText: {
          en: "I want to get a sewing machine with grant support and run my own tailoring and boutique unit.",
          hi: "सिलाई की मशीन लेकर अपना खुद का बुटीक और सिलाई केंद्र चलाना चाहती हूँ।",
          or: "ସିଲେଇ ମେସିନ୍ ସହିତ ନିଜର ବୁଟିକ୍ ଏବଂ ସିଲେଇ କେନ୍ଦ୍ର ଚଳାଇବାକୁ ଚାହୁଁଛି।",
          sat: "ᱥᱤᱞᱟᱹᱭ ᱢᱮᱥᱤᱱ ᱦᱟᱛᱟᱣ ᱠᱟᱛᱮ ᱱᱤᱡᱮᱨᱟᱜ ᱥᱤᱞᱟᱹᱭ ᱥᱮᱱᱴᱟᱨ ᱪᱟᱞᱟᱣ ᱥᱟᱱᱟᱭᱮᱫᱤᱧᱟ।",
          bn: "সেলাই মেশিন নিয়ে নিজের বুটিক ও সেলাই কেন্দ্র চালাতে চাই।",
          bho: "सिलाई मशीन लेके आपन बुटीक आ सिलाई केंद्र चलावे के चाहत बानी।",
          mr: "शिलाई मशीन घेऊन स्वतःचे बुटीक आणि टेलरिंग केंद्र चालवायचे आहे.",
          te: "కుట్టు మిషన్ తీసుకుని నా సొంత టైలరింగ్ మరియు బోటిక్ యూనిట్ నడపాలనుకుంటున్నాను.",
          ta: "தையல் இயந்திரம் பெற்று சொந்தமாக தையல் மையம் மற்றும் பூட்டிக் நடத்த விரும்புகிறேன்."
        }
      }
    ]
  }
];

export function getChipLabel(
  chip: { label: Record<string, string> | string; spokenText: Record<string, string> | string },
  lang: string
): string {
  if (typeof chip.label === "string") return chip.label;
  const cleanLang = (lang || "en").toLowerCase();
  return chip.label[cleanLang] || chip.label.en || chip.label.hi || Object.values(chip.label)[0] || "";
}

export function getChipSpokenText(
  chip: { label: Record<string, string> | string; spokenText: Record<string, string> | string },
  lang: string
): string {
  if (typeof chip.spokenText === "string") return chip.spokenText;
  const cleanLang = (lang || "en").toLowerCase();
  return chip.spokenText[cleanLang] || chip.spokenText.en || chip.spokenText.hi || Object.values(chip.spokenText)[0] || "";
}

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
    /\s+(?:from|form|frm|frum|fram|rom|se|hai|h|hu|hoon|hume|living|residing|belongs?|rehta|rehti|rahata|rahati|ka|ke|ki|district|dist|zilla|zila|gaon|gram|village|city|state|odisha|jharkhand|up|bihar|uttar\s*pradesh|sundargarh|kalahandi|mayurbhanj|varanasi|ranchi|sambalpur|bhubaneswar|cuttack|koraput|balasore|patna|delhi|mumbai|kolkata|है|हूँ|हू|से|का|के|की|जिला|गाँव|गांव|ओडिशा|सुंदरगढ़|सुन्दरगढ़|कालाहांडी|मयूरभंज|वाराणसी|राँची|ବାରାଣାସୀ|ସୁନ୍ଦରଗଡ଼|କଳାହାଣ୍ଡି|ମୟୂରଭଞ୍ଜ|ଝାଡ଼ଖଣ୍ଡ|ଓଡ଼ିଶା).*$/iu,
    ""
  );

  // 3. Strip standalone noise words if any remain
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

export function formatLocation(district: string, state: string, lang: string): string {
  const d = (district || "").trim();
  const s = (state || "").trim();
  const cleanLang = (lang || "en").toLowerCase();

  const districtMap: Record<string, Record<string, string>> = {
    sundargarh: {
      en: "Sundargarh",
      hi: "सुंदरगढ़",
      or: "ସୁନ୍ଦରଗଡ଼",
      sat: "ᱥᱩᱱᱫᱚᱨᱜᱚᱲ",
      bn: "সুন্দরগড়",
      bho: "सुंदरगढ़",
      mr: "सुंदरगड",
      te: "సుందర్‌గఢ్",
      ta: "சுந்தர்கர்",
      gu: "સુંદરગઢ",
      ur: "سندرگڑھ",
      kn: "ಸುಂದರಗಢ",
      ml: "സുന്ദർഗഡ്",
      pa: "ਸੁੰਦਰਗੜ੍ਹ",
      as: "সুন্দৰগড়",
      mai: "सुंदरगढ़"
    },
    kalahandi: {
      en: "Kalahandi",
      hi: "कालाहांडी",
      or: "କଳାହାଣ୍ଡି",
      sat: "ᱠᱟᱞᱟᱦᱟᱱᱰᱤ",
      bn: "কালাহান্ডি",
      bho: "कालाहांडी",
      mr: "कालाहांडी",
      te: "కలహండి",
      ta: "கலஹண்டி",
      gu: "કાલાહાંડી",
      ur: "کالاہانڈی",
      kn: "ಕಲಹಂಡಿ",
      ml: "കലഹണ്ടി",
      pa: "ਕਾਲਾਹਾਂਡੀ",
      as: "কালাহাণ্ডি",
      mai: "कालाहांडी"
    },
    mayurbhanj: {
      en: "Mayurbhanj",
      hi: "मयूरभंज",
      or: "ମୟୂରଭଞ୍ଜ",
      sat: "ᱢᱚᱭᱩᱨᱵᱷᱚᱸᱡᱽ",
      bn: "ময়ূরভঞ্জ",
      bho: "मयूरभंज",
      mr: "मयूरभंज",
      te: "మయూర్‌భంజ్",
      ta: "மயூர்பஞ்ச்",
      gu: "મયૂરભંજ",
      ur: "میوربھنج",
      kn: "ಮಯೂರಭಂಜ್",
      ml: "മയൂർഭഞ്ച്",
      pa: "ਮਯੂਰਭੰਜ",
      as: "ময়ূৰভঞ্জ",
      mai: "मयूरभंज"
    },
    varanasi: {
      en: "Varanasi",
      hi: "वाराणसी",
      or: "ବାରାଣାସୀ",
      sat: "ᱵᱟᱨᱟᱬᱟᱥᱤ",
      bn: "বারাণসী",
      bho: "बनारस",
      mr: "वाराणसी",
      te: "వారణాసి",
      ta: "வாரணாசி",
      gu: "વારાણસી",
      ur: "وارانسی",
      kn: "ವಾರಣಾಸಿ",
      ml: "വാരാണസി",
      pa: "ਵਾਰਾਣਸੀ",
      as: "বাৰাণসী",
      mai: "वाराणसी"
    },
    ranchi: {
      en: "Ranchi",
      hi: "राँची",
      or: "ରାଞ୍ଚି",
      sat: "ᱨᱟᱺᱪᱤ",
      bn: "রাঁচি",
      bho: "राँची",
      mr: "रांची",
      te: "రాంచీ",
      ta: "ராஞ்சி",
      gu: "રાંચી",
      ur: "رانچی",
      kn: "ರಾಂಚಿ",
      ml: "റാഞ്ചി",
      pa: "ਰਾਂਚੀ",
      as: "ৰাঁচী",
      mai: "राँची"
    }
  };

  const stateMap: Record<string, Record<string, string>> = {
    odisha: {
      en: "Odisha",
      hi: "ओडिशा",
      or: "ଓଡ଼ିଶା",
      sat: "ᱳᱰᱤᱥᱟ",
      bn: "ওড়িশা",
      bho: "ओडिशा",
      mr: "ओडिशा",
      te: "ఒడిశా",
      ta: "ஒடிசா",
      gu: "ઓડિશા",
      ur: "اوڈیشہ",
      kn: "ಒಡಿಶಾ",
      ml: "ഒഡീഷ",
      pa: "ਓਡੀਸ਼ਾ",
      as: "ওড়িশা",
      mai: "ओडिशा"
    },
    "uttar pradesh": {
      en: "Uttar Pradesh",
      hi: "उत्तर प्रदेश",
      or: "ଉତ୍ତର ପ୍ରଦେଶ",
      sat: "ᱩᱛᱛᱚᱨ ᱯᱨᱚᱫᱮᱥ",
      bn: "উত্তর প্রদেশ",
      bho: "उत्तर प्रदेश",
      mr: "उत्तर प्रदेश",
      te: "ఉత్తర ప్రదేశ్",
      ta: "உத்தரப் பிரதேசம்",
      gu: "ઉત્તર પ્રદેશ",
      ur: "اتر پردیش",
      kn: "ಉತ್ತರ ಪ್ರದೇಶ",
      ml: "ഉത്തർപ്രദേശ്",
      pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼",
      as: "উত্তৰ প্ৰদেশ",
      mai: "उत्तर प्रदेश"
    },
    jharkhand: {
      en: "Jharkhand",
      hi: "झारखंड",
      or: "ଝାଡ଼ଖଣ୍ଡ",
      sat: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ",
      bn: "ঝাড়খণ্ড",
      bho: "झारखंड",
      mr: "झारखंड",
      te: "జార్ఖండ్",
      ta: "ஜார்க்கண்ட்",
      gu: "ઝારખંડ",
      ur: "جھارکھنڈ",
      kn: "ಜಾರ್ಖಂಡ್",
      ml: "ജാർഖണ്ഡ്",
      pa: "ਝਾਰਖੰਡ",
      as: "ঝাৰখণ্ড",
      mai: "झारखंड"
    },
    bihar: {
      en: "Bihar",
      hi: "बिहार",
      or: "ବିହାର",
      sat: "ᱵᱤᱦᱟᱨ",
      bn: "বিহার",
      bho: "बिहार",
      mr: "बिहार",
      te: "బీహార్",
      ta: "பீகார்",
      gu: "બિહાર",
      ur: "بہار",
      kn: "ಬಿಹಾರ",
      ml: "ബീഹാർ",
      pa: "ਬਿਹਾਰ",
      as: "বিহাৰ",
      mai: "बिहार"
    }
  };

  const dKey =
    d.toLowerCase().replace(/[\u0900-\u097F\u0B00-\u0B7F\u1C50-\u1C7F]/g, "").trim() ||
    (/सुंदरगढ़|ସୁନ୍ଦରଗଡ଼|ᱥᱩᱱᱫᱚᱨᱜᱚᱲ/i.test(d)
      ? "sundargarh"
      : /कालाहांडी|କଳାହାଣ୍ଡି/i.test(d)
      ? "kalahandi"
      : /मयूरभंज|ମୟୂରଭଞ୍ଜ/i.test(d)
      ? "mayurbhanj"
      : /वाराणसी|बनारस|ବାରାଣାସୀ/i.test(d)
      ? "varanasi"
      : /राँची|ରାଞ୍ଚି/i.test(d)
      ? "ranchi"
      : "sundargarh");

  const sKey =
    s.toLowerCase().replace(/[\u0900-\u097F\u0B00-\u0B7F\u1C50-\u1C7F]/g, "").trim() ||
    (/ओडिशा|ଓଡ଼ିଶା|ᱳᱰᱤᱥᱟ/i.test(s)
      ? "odisha"
      : /उत्तर प्रदेश|ଉତ୍ତର ପ୍ରଦେଶ/i.test(s)
      ? "uttar pradesh"
      : /झारखंड|ଝାଡ଼ଖଣ୍ଡ/i.test(s)
      ? "jharkhand"
      : /बिहार|ବିହାର/i.test(s)
      ? "bihar"
      : "odisha");

  const localizedDistrict = districtMap[dKey]?.[cleanLang] || districtMap[dKey]?.en || d || "Sundargarh";
  const localizedState = stateMap[sKey]?.[cleanLang] || stateMap[sKey]?.en || s || "Odisha";

  return `${localizedDistrict}, ${localizedState}`;
}

export function formatGrantSupport(rawGrant: string, lang: string): string {
  const cleanLang = (lang || "en").toLowerCase();
  const g = rawGrant || "";

  if (/stipend|placement|3,500|3500|रोजगार|নিয়োগ/i.test(g)) {
    switch (cleanLang) {
      case "hi":
        return "₹3,500/माह प्रशिक्षण स्टाइपेंड + सुनिश्चित रोजगार";
      case "or":
        return "₹3,500/ମାସ ତାଲିମ ଷ୍ଟାଇପେଣ୍ଡ + ନିଶ୍ଚିତ ନିଯୁକ୍ତି";
      case "sat":
        return "₹3,500/ᱪᱟᱸᱫᱚ ᱥᱮᱪᱮᱫ ᱥᱴᱟᱭᱯᱮᱱᱰ + ᱴᱷᱟᱹᱣᱠᱟᱹ ᱠᱟᱹᱢᱤ";
      case "bn":
        return "₹3,500/মাস প্রশিক্ষণ বৃত্তি + নিশ্চিত নিয়োগ";
      case "bho":
        return "₹3,500/महीना ट्रेनिंग स्टाइपेंड + पक्का नौकरी";
      case "mr":
        return "₹3,500/महिना प्रशिक्षण विद्यावेतन + हमी नोकरी";
      case "te":
        return "₹3,500/నెల శిక్షణ స్టైపెండ్ + ఖచ్చితమైన ఉపాధి";
      case "ta":
        return "₹3,500/மாத பயிற்சி உதவித்தொகை + வேலைவாய்ப்பு";
      case "gu":
        return "₹3,500/મહિનો તાલીમ સ્ટાઈપેન્ડ + ખાતરીપૂર્વક રોજગાર";
      case "ur":
        return "₹3,500/ماہانہ تربیتی وظیفہ + یقینی ملازمت";
      case "kn":
        return "₹3,500/ತಿಂಗಳು ತರಬೇತಿ ಸ್ಟೈಪೆಂಡ್ + ಖಚಿತ ಉದ್ಯೋಗ";
      case "ml":
        return "₹3,500/മാസം പരിശീലന സ്റ്റൈപ്പന്റ് + ഉറപ്പായ ജോലി";
      case "pa":
        return "₹3,500/ਮਹੀਨਾ ਸਿਖਲਾਈ ਵਜ਼ੀਫ਼ਾ + ਪੱਕਾ ਰੁਜ਼ਗਾਰ";
      case "as":
        return "₹3,500/মাহ প্ৰশিক্ষণ বৃত্তি + নিশ্চিত সংস্থাপন";
      case "mai":
        return "₹3,500/माह प्रशिक्षण स्टाइपेंड + पक्का रोजगार";
      default:
        return "₹3,500/mo Training Stipend + Assured Placement";
    }
  }

  // Capital Subsidy fallback
  switch (cleanLang) {
    case "hi":
      return "₹35,000 पूंजीगत अनुदान + ₹3,500/माह स्टाइपेंड";
    case "or":
      return "₹35,000 ପୁଞ୍ଜି ଅନୁଦାନ + ₹3,500/ମାସ ଷ୍ଟାଇପେଣ୍ଡ";
    case "sat":
      return "₹35,000 ᱯᱩᱸᱡᱤ ᱜᱚᱲᱚ + ₹3,500/ᱪᱟᱸᱫᱚ ᱥᱴᱟᱭᱯᱮᱱᱰ";
    case "bn":
      return "₹35,000 মূলধন অনুদান + ₹3,500/মাস বৃত্তি";
    case "bho":
      return "₹35,000 पूंजी अनुदान + ₹3,500/महीना स्टाइपेंड";
    case "mr":
      return "₹35,000 भांडवली अनुदान + ₹3,500/महिना विद्यावेतन";
    case "te":
      return "₹35,000 మూలధన రాయితీ + ₹3,500/నెల స్టైపెండ్";
    case "ta":
      return "₹35,000 மூலதன மானியம் + ₹3,500/மாத உதவித்தொகை";
    case "gu":
      return "₹35,000 મૂડી સબસિડી + ₹3,500/મહિનો સ્ટાઈપેન્ડ";
    case "ur":
      return "₹35,000 کیپیٹل گرانٹ + ₹3,500/ماہانہ وظیفہ";
    case "kn":
      return "₹35,000 ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ + ₹3,500/ತಿಂಗಳು ಸ್ಟೈಪೆಂಡ್";
    case "ml":
      return "₹35,000 മൂലധന ഗ്രാന്റ് + ₹3,500/മാസം സ്റ്റൈപ്പന്റ്";
    case "pa":
      return "₹35,000 ਪੂੰਜੀ ਗ੍ਰਾਂਟ + ₹3,500/ਮਹੀਨਾ ਵਜ਼ੀਫ਼ਾ";
    case "as":
      return "₹35,000 মূলধন অনুদান + ₹3,500/মাহ বৃত্তি";
    case "mai":
      return "₹35,000 पूंजी अनुदान + ₹3,500/माह स्टाइपेंड";
    default:
      return "₹35,000 Capital Subsidy + ₹3,500/mo Stipend";
  }
}

export function formatNsqfCourse(rawCourse: string, lang: string): string {
  const cleanLang = (lang || "en").toLowerCase();
  const c = rawCourse || "";

  if (/tailor|सिलाई|সিল|silai|garment/i.test(c)) {
    switch (cleanLang) {
      case "hi":
        return "स्वरोजगार दर्जी (Self Employed Tailor)";
      case "or":
        return "ସ୍ୱରୋଜଗାର ଟେଲର୍ (Self Employed Tailor)";
      case "sat":
        return "ᱱᱤᱡᱮᱨᱟᱜ ᱞᱩᱜᱽᱲᱤ ᱥᱤᱞᱟᱹᱭ (Self Employed Tailor)";
      case "bn":
        return "স্বরোজগার দর্জি (Self Employed Tailor)";
      case "bho":
        return "स्वरोजगार दरजी (Self Employed Tailor)";
      case "mr":
        return "स्वयंरोजगार टेलर (Self Employed Tailor)";
      case "te":
        return "స్వయం ఉపాధి టైలర్ (Self Employed Tailor)";
      case "ta":
        return "சுயதொழில் தையலர் (Self Employed Tailor)";
      default:
        return "Self Employed Tailor (NSQF Level 3)";
    }
  }

  if (/electric|बिजली|ବିଦ୍ୟୁତ|wiring|वायरिंग/i.test(c)) {
    switch (cleanLang) {
      case "hi":
        return "घरेलू इलेक्ट्रीशियन (Domestic Electrician)";
      case "or":
        return "ଘରୋଇ ଇଲେକ୍ଟ୍ରିସିଆନ୍ (Domestic Electrician)";
      case "sat":
        return "ᱚᱲᱟᱜ ᱵᱤᱡᱽᱞᱤ ᱠᱟᱹᱢᱤ (Domestic Electrician)";
      case "bn":
        return "গার্হস্থ্য ইলেকট্রিশিয়ান (Domestic Electrician)";
      case "bho":
        return "घरेलू इलेक्ट्रीशियन (Domestic Electrician)";
      case "mr":
        return "घरगुती इलेक्ट्रिशियन (Domestic Electrician)";
      case "te":
        return "డొమెస్టిక్ ఎలక్ట్రీషియన్ (Domestic Electrician)";
      case "ta":
        return "வீட்டு எலக்ட்ரீசியன் (Domestic Electrician)";
      default:
        return "Domestic Electrician";
    }
  }

  // Solar Agri Pump default
  switch (cleanLang) {
    case "hi":
      return "सोलर पीवी कृषि-पंप विशेषज्ञ (Solar PV Agri-Pump Specialist)";
    case "or":
      return "ସୌର ପିଭି କୃଷି-ପମ୍ପ ବିଶେଷଜ୍ଞ (Solar PV Agri-Pump Specialist)";
    case "sat":
      return "ᱥᱳᱞᱟᱨ ᱯᱤᱵᱷᱤ ᱪᱟᱥ-ᱯᱟᱢᱯ ᱦᱩᱱᱟᱹᱨ (Solar PV Specialist)";
    case "bn":
      return "সোলার পিভি কৃষি-পাম্প বিশেষজ্ঞ (Solar PV Specialist)";
    case "bho":
      return "सोलर पीवी कृषि-पंप विशेषज्ञ (Solar PV Specialist)";
    case "mr":
      return "सोलर पीव्ही कृषी-पंप तज्ज्ञ (Solar PV Specialist)";
    case "te":
      return "సోలార్ పీవీ అగ్రి-పంప్ నిపుణుడు (Solar PV Specialist)";
    case "ta":
      return "சூரிய ஒளி வேளாண்-பம்ப் நிபுணர் (Solar PV Specialist)";
    default:
      return "Solar PV Agri-Pump Specialist";
  }
}

export function formatEducation(rawEdu: string, lang: string): string {
  const cleanLang = (lang || "en").toLowerCase();
  const e = rawEdu || "";

  if (/10|matric|दशम|दसवीं|দশম/i.test(e)) {
    switch (cleanLang) {
      case "hi":
        return "10वीं पास (मैट्रिक)";
      case "or":
        return "୧୦ମ ପାସ (ମ୍ୟାଟ୍ରିକ)";
      case "sat":
        return "᱑᱐ ᱯᱟᱥ (ᱢᱮᱴᱨᱤᱠ)";
      case "bn":
        return "১০ম পাস (ম্যাট্রিক)";
      case "bho":
        return "10वीं पास (मैट्रिक)";
      case "mr":
        return "१० वी पास (मॅट्रिक)";
      case "te":
        return "10వ తరగతి పాస్ (మ్యాట్రిక్)";
      case "ta":
        return "10ஆம் வகுப்பு தேர்ச்சி";
      default:
        return "10th Standard (Matriculation)";
    }
  }

  if (/8|eight|अष्टम|आठवीं|অষ্টম/i.test(e)) {
    switch (cleanLang) {
      case "hi":
        return "8वीं कक्षा उत्तीर्ण";
      case "or":
        return "୮ମ ଶ୍ରେଣୀ ପାସ";
      case "sat":
        return "᱘ ᱪᱟᱱᱟᱪ ᱯᱟᱲᱦᱟᱣ";
      case "bn":
        return "৮ম শ্রেণী উত্তীর্ণ";
      case "bho":
        return "8वीं पास";
      case "mr":
        return "८ वी उत्तीर्ण";
      case "te":
        return "8వ తరగతి పాస్";
      case "ta":
        return "8ஆம் வகுப்பு தேர்ச்சி";
      default:
        return "8th Standard Completed";
    }
  }

  if (/5|practical|non-formal|साक्षर|non formal|anpadh|literate|পঞ্চম/i.test(e)) {
    switch (cleanLang) {
      case "hi":
        return "व्यावहारिक हुनर (5वीं / गैर-औपचारिक)";
      case "or":
        return "ବ୍ୟବହାରିକ ଜ୍ଞାନ (୫ମ / ଅଣ-ଆନୁଷ୍ଠାନିକ)";
      case "sat":
        return "ᱵᱮᱵᱷᱟᱨᱤᱠ ᱦᱩᱱᱟᱹᱨ (᱕ ᱯᱟᱥ / ᱵᱤᱱᱟᱹ ᱤᱥᱠᱩᱞ)";
      case "bn":
        return "ব্যবহারিক জ্ঞান (৫ম শ্রেণী / নন-ফর্মাল)";
      case "bho":
        return "व्यावहारिक हुनर (5वीं / गैर-औपचारिक)";
      case "mr":
        return "प्रत्यक्ष कामाचा अनुभव (५ वी / अनौपचारिक)";
      case "te":
        return "ప్రాక్టికల్ అనుభవం (5వ తరగతి)";
      case "ta":
        return "நேரடி வேலை அனுபவம் (5ஆம் வகுப்பு)";
      default:
        return "Practical Learner (5th pass / Non-formal)";
    }
  }

  return rawEdu || "10th Standard (Matriculation)";
}

export const ONBOARDING_I18N: Record<string, {
  headerTitle: string;
  headerSubtitle: string;
  back: string;
  manualEdit: string;
  skip: string;
  previous: string;
  nextStep: string;
  viewPassport: string;
  voiceCopilot: string;
  editDetails: string;
  replayAudio: string;
  irrelevantTitle: string;
  yourResponse: string;
  listening: string;
  typeManually: string;
  cancelTyping: string;
  typePlaceholder: string;
  confirmAndAnalyze: string;
  cancel: string;
  tapToSpeakOrSelect: string;
  quickExamples: string;
  passportTitle: string;
  verified: string;
  building: string;
  awaitingInput: string;
  slot1Title: string;
  slot2Title: string;
  slot3Title: string;
  slot4Title: string;
  editAllFields: string;
  tapMicToSpeak: string;
  listeningSpeakNow: string;
  celebrationBadge: string;
  congratulations: (name: string) => string;
  celebrationSubtitle: string;
  fitMatch: string;
  mappedSkill: string;
  nsqfLevel: string;
  grantSupport: string;
  enterDashboard: string;
  reviewSteps: string;
  modalTitle: string;
  modalSubtitle: string;
  modalCandidateName: string;
  modalDistrict: string;
  modalState: string;
  modalSkill: string;
  modalEducation: string;
  modalGrant: string;
  modalSave: string;
  modalSaveAndComplete: string;
  completeAndIssuePassport: string;
}> = {
  en: {
    headerTitle: "Personal Voice Onboarding",
    headerSubtitle: "PM-AJAY AI Livelihood Profiler",
    back: "Back",
    manualEdit: "Manual Edit",
    skip: "Skip",
    previous: "Previous",
    nextStep: "Next Step",
    viewPassport: "View Passport",
    voiceCopilot: "Saksham-AI Voice Copilot",
    editDetails: "Edit Details",
    replayAudio: "Replay Question",
    irrelevantTitle: "Incomplete or Unrelated Answer",
    yourResponse: "Your Response:",
    listening: "Listening to your voice...",
    typeManually: "✏️ Type / Edit Manually",
    cancelTyping: "Cancel Typing",
    typePlaceholder: "Type or edit your response here...",
    confirmAndAnalyze: "Confirm & Analyze",
    cancel: "Cancel",
    tapToSpeakOrSelect: "Tap mic or choose an option below...",
    quickExamples: "Or Tap to Speak (Quick Samples):",
    passportTitle: "PM-AJAY Livelihood Passport",
    verified: "✓ Verified (4/4)",
    building: "Building",
    awaitingInput: "Awaiting Input (0/4)",
    slot1Title: "Candidate Name & Location",
    slot2Title: "NSQF Skill Alignment",
    slot3Title: "Qualification & Literacy",
    slot4Title: "PM-AJAY Capital Support",
    editAllFields: "Edit All Passport Fields",
    tapMicToSpeak: "Tap Mic to Speak",
    listeningSpeakNow: "Listening... (Please speak now)",
    celebrationBadge: "LIVELIHOOD PASSPORT ISSUED",
    congratulations: (name) => `Congratulations, ${name}!`,
    celebrationSubtitle: "Based on your profile and practical skills, your PM-AJAY skill and self-employment pathway is ready.",
    fitMatch: "Fit Match",
    mappedSkill: "Mapped Skill:",
    nsqfLevel: "NSQF Level:",
    grantSupport: "Grant Support:",
    enterDashboard: "Enter My Beneficiary Dashboard",
    reviewSteps: "Review Steps",
    modalTitle: "Edit Passport Details",
    modalSubtitle: "You can modify name, location, trade or qualification manually",
    modalCandidateName: "Candidate Full Name",
    modalDistrict: "District",
    modalState: "State",
    modalSkill: "NSQF Mapped Skill / Trade",
    modalEducation: "Education Qualification",
    modalGrant: "PM-AJAY Capital Support / Goal",
    modalSave: "Save Changes",
    modalSaveAndComplete: "✨ Save & Complete Passport",
    completeAndIssuePassport: "✨ Complete Profile & View Passport"
  },
  hi: {
    headerTitle: "व्यक्तिगत वॉयस ऑनबोर्डिंग",
    headerSubtitle: "पीएम-अजय एआई आजीविका प्रोफाइलर",
    back: "वापस",
    manualEdit: "मैन्युअल सुधार",
    skip: "छोड़ें",
    previous: "पिछला",
    nextStep: "अगला चरण",
    viewPassport: "पासपोर्ट देखें",
    voiceCopilot: "सक्षम-एआई वॉयस कोपायलट",
    editDetails: "सुधारें",
    replayAudio: "प्रश्न पुनः सुनें",
    irrelevantTitle: "अपूर्ण या असंबंधित उत्तर",
    yourResponse: "आपका उत्तर:",
    listening: "आपकी आवाज़ सुन रहे हैं...",
    typeManually: "✏️ मैन्युअल लिखें / सुधारें",
    cancelTyping: "टाइपिंग रद्द करें",
    typePlaceholder: "यहाँ अपना उत्तर लिखें या सुधारें...",
    confirmAndAnalyze: "दर्ज व विश्लेषण करें",
    cancel: "रद्द करें",
    tapToSpeakOrSelect: "माइक दबाकर बोलें, या नीचे दिए गए विकल्पों में से चुनें...",
    quickExamples: "या त्वरित उदाहरण चुनें:",
    passportTitle: "पीएम-अजय आजीविका पासपोर्ट",
    verified: "✓ सत्यापित (4/4)",
    building: "तैयार हो रहा है",
    awaitingInput: "इनपुट की प्रतीक्षा (0/4)",
    slot1Title: "उम्मीदवार का नाम व जिला",
    slot2Title: "एनएसक्यूएफ कौशल ट्रेड",
    slot3Title: "शैक्षणिक योग्यता व साक्षरता",
    slot4Title: "पीएम-अजय पूंजीगत सहायता",
    editAllFields: "सभी पासपोर्ट विवरण सुधारें",
    tapMicToSpeak: "माइक दबाकर बोलें",
    listeningSpeakNow: "सुन रहे हैं... (कृपया बोलिए)",
    celebrationBadge: "आजीविका पासपोर्ट जारी (LIVELIHOOD PASSPORT ISSUED)",
    congratulations: (name) => `बधाई हो, ${name}!`,
    celebrationSubtitle: "आपकी प्रोफाइल और हुनर के आधार पर पीएम-अजय कौशल व स्वरोजगार मार्ग तैयार है।",
    fitMatch: "उपयुक्तता मैच",
    mappedSkill: "मैप किया गया हुनर:",
    nsqfLevel: "एनएसक्यूएफ स्तर:",
    grantSupport: "अनुदान व सहायता:",
    enterDashboard: "मेरे लाभार्थी डैशबोर्ड में प्रवेश करें",
    reviewSteps: "समीक्षा करें",
    modalTitle: "पासपोर्ट विवरण सुधारें (मैन्युअल सुधार)",
    modalSubtitle: "आप नाम, जिला, कौशल या शैक्षणिक स्तर में सुधार कर सकते हैं",
    modalCandidateName: "उम्मीदवार का पूरा नाम",
    modalDistrict: "जिला",
    modalState: "राज्य",
    modalSkill: "एनएसक्यूएफ कौशल / ट्रेड",
    modalEducation: "शैक्षणिक स्तर",
    modalGrant: "पीएम-अजय अनुदान / लक्ष्य",
    modalSave: "बदलाव सहेजें",
    modalSaveAndComplete: "✨ सहेजें और पासपोर्ट पूरा करें",
    completeAndIssuePassport: "✨ प्रोफ़ाइल पूरा करें और पासपोर्ट देखें"
  },
  or: {
    headerTitle: "ବ୍ୟକ୍ତିଗତ ଭଏସ୍ ଅନବୋର୍ଡିଂ",
    headerSubtitle: "ପିଏମ୍-ଅଜୟ ଏଆଇ ଜୀବିକା ପ୍ରୋଫାଇଲର୍",
    back: "ପଛକୁ",
    manualEdit: "ମାନୁଆଲ୍ ସଂଶୋଧନ",
    skip: "ଛାଡ଼ନ୍ତୁ",
    previous: "ପୂର୍ବବର୍ତ୍ତୀ",
    nextStep: "ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ",
    viewPassport: "ପାସପୋର୍ଟ ଦେଖନ୍ତୁ",
    voiceCopilot: "ସକ୍ଷମ-ଏଆଇ ଭଏସ୍ କୋପାଇଲଟ୍",
    editDetails: "ସଂଶୋଧନ",
    replayAudio: "ପ୍ରଶ୍ନ ପୁନଃ ଶୁଣନ୍ତୁ",
    irrelevantTitle: "ଅସମ୍ପୂର୍ଣ୍ଣ ବା ଅପ୍ରାସଙ୍ଗିକ ଉତ୍ତର",
    yourResponse: "ଆପଣଙ୍କ ଉତ୍ତର:",
    listening: "ଆପଣଙ୍କ ସ୍ୱର ଶୁଣୁଛୁ...",
    typeManually: "✏️ ଟାଇପ୍ / ସଂଶୋଧନ କରନ୍ତୁ",
    cancelTyping: "ବାତିଲ୍ କରନ୍ତୁ",
    typePlaceholder: "ଏଠାରେ ଆପଣଙ୍କ ଉତ୍ତର ଲେଖନ୍ତୁ ବା ସଂଶୋଧନ କରନ୍ତୁ...",
    confirmAndAnalyze: "ନିଶ୍ଚିତ ଓ ବିଶ୍ଳେଷଣ କରନ୍ତୁ",
    cancel: "ବାତିଲ୍",
    tapToSpeakOrSelect: "ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ କିମ୍ବା ତଳ ବିକଳ୍ପ ଚୟନ କରନ୍ତୁ...",
    quickExamples: "କିମ୍ବା ତ୍ୱରିତ ଉଦାହରଣ ଚୟନ କରନ୍ତୁ:",
    passportTitle: "ପିଏମ୍-ଅଜୟ ଜୀବିକା ପାସପୋର୍ଟ",
    verified: "✓ ପ୍ରମାଣିତ (4/4)",
    building: "ଗଠନ ହେଉଛି",
    awaitingInput: "ଇନପୁଟ୍ ଅପେକ୍ଷାରେ (0/4)",
    slot1Title: "ପ୍ରାର୍ଥୀଙ୍କ ନାମ ଓ ଜିଲ୍ଲା",
    slot2Title: "ଏନ୍ଏସକ୍ୟୁଏଫ୍ କୌଶଳ ଟ୍ରେଡ୍",
    slot3Title: "ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା",
    slot4Title: "ପିଏମ୍-ଅଜୟ ପୁଞ୍ଜି ସହାୟତା",
    editAllFields: "ସମସ୍ତ ପାସପୋର୍ଟ ବିବରଣୀ ସଂଶୋଧନ କରନ୍ତୁ",
    tapMicToSpeak: "ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ",
    listeningSpeakNow: "ଶୁଣୁଛୁ... (ଦୟାକରି କୁହନ୍ତୁ)",
    celebrationBadge: "ଜୀବିକା ପାସପୋର୍ଟ ପ୍ରଦାନ କରାଗଲା",
    congratulations: (name) => `ଅଭିନନ୍ଦନ, ${name}!`,
    celebrationSubtitle: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଏବଂ କୌଶଳ ଆଧାରରେ ପିଏମ୍-ଅଜୟ କୌଶଳ ଓ ସ୍ୱରୋଜଗାର ମାର୍ଗ ପ୍ରସ୍ତୁତ ଅଛି।",
    fitMatch: "ଯୋଗ୍ୟତା ମ୍ୟାଚ୍",
    mappedSkill: "ଯୋଡ଼ା ଯାଇଥିବା କୌଶଳ:",
    nsqfLevel: "ଏନ୍ଏସକ୍ୟୁଏଫ୍ ସ୍ତର:",
    grantSupport: "ଅନୁଦାନ ସହାୟତା:",
    enterDashboard: "ମୋର ହିତାଧିକାରୀ ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ",
    reviewSteps: "ପୁନର୍ବାର ଯାଞ୍ଚ କରନ୍ତୁ",
    modalTitle: "ପାସପୋର୍ଟ ବିବରଣୀ ସଂଶୋଧନ",
    modalSubtitle: "ଆପଣ ନାମ, ଜିଲ୍ଲା, କୌଶଳ ବା ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା ବଦଳାଇ ପାରିବେ",
    modalCandidateName: "ପ୍ରାର୍ଥୀଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ",
    modalDistrict: "ଜିଲ୍ଲା",
    modalState: "ରାଜ୍ୟ",
    modalSkill: "ଏନ୍ଏସକ୍ୟୁଏଫ୍ କୌଶଳ / ଟ୍ରେଡ୍",
    modalEducation: "ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା",
    modalGrant: "ପିଏମ୍-ଅଜୟ ଅନୁଦାନ / ଲକ୍ଷ୍ୟ",
    modalSave: "ପରିବର୍ତ୍ତନ ସଂରକ୍ଷଣ କରନ୍ତୁ",
    modalSaveAndComplete: "✨ ସଂରକ୍ଷଣ କରନ୍ତୁ ଓ ପାସପୋର୍ଟ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ",
    completeAndIssuePassport: "✨ ପ୍ରୋଫାଇଲ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ ଓ ପାସପୋର୍ଟ ଦେଖନ୍ତୁ"
  },
  sat: {
    headerTitle: "ᱱᱤᱡᱮᱨᱟᱜ ᱨᱚᱲ ᱚᱱᱵᱚᱨᱰᱤᱝ",
    headerSubtitle: "PM-AJAY AI ᱡᱤᱵᱤᱠᱟ ᱯᱨᱚᱯᱷᱟᱭᱤᱞᱟᱨ",
    back: "ᱛᱟᱭᱚᱢ",
    manualEdit: "ᱛᱤᱛᱮ ᱵᱚᱫᱚᱞ",
    skip: "ᱵᱟᱹᱜᱤ",
    previous: "ᱢᱟᱲᱟᱝ",
    nextStep: "ᱞᱟᱦᱟ ᱛᱷᱚᱠ",
    viewPassport: "ᱯᱟᱥᱯᱳᱨᱴ ᱧᱮᱞ",
    voiceCopilot: "Saksham-AI ᱨᱚᱲ ᱜᱚᱲᱚᱭᱤᱡ",
    editDetails: "ᱵᱚᱫᱚᱞ",
    replayAudio: "ᱠᱩᱠᱞᱤ ᱫᱚᱦᱲᱟ ᱟᱸᱡᱚᱢ",
    irrelevantTitle: "ᱵᱟᱝ ᱯᱩᱨᱟᱹᱣ ᱨᱚᱲ",
    yourResponse: "ᱟᱢᱟᱜ ᱨᱚᱲ:",
    listening: "ᱟᱸᱡᱚᱢᱮᱫᱟᱞᱮ...",
    typeManually: "✏️ ᱚᱞ / ᱵᱚᱫᱚᱞ ᱢᱮ",
    cancelTyping: "ᱵᱟᱹᱜᱤ",
    typePlaceholder: "ᱱᱚᱸᱰᱮ ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱚᱞ ᱢᱮ...",
    confirmAndAnalyze: "ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱨ ᱡᱟᱸᱪ ᱢᱮ",
    cancel: "ᱵᱟᱹᱜᱤ",
    tapToSpeakOrSelect: "ᱢᱟᱭᱤᱠ ᱚᱛᱟ ᱠᱟᱛᱮ ᱨᱚᱲ ᱢᱮ...",
    quickExamples: "ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:",
    passportTitle: "PM-AJAY ᱡᱤᱵᱤᱠᱟ ᱯᱟᱥᱯᱚᱨᱴ",
    verified: "✓ ᱴᱷᱟᱹᱣᱠᱟᱹ (4/4)",
    building: "ᱛᱮᱭᱟᱨᱚᱜ ᱠᱟᱱᱟ",
    awaitingInput: "ᱨᱚᱲ ᱵᱟᱹᱱᱩᱜᱼᱟ (0/4)",
    slot1Title: "ᱠᱟᱱᱰᱤᱰᱮᱴ ᱧᱩᱛᱩᱢ ᱟᱨ ᱡᱤᱞᱟ",
    slot2Title: "NSQF ᱦᱩᱱᱟᱹᱨ ᱴᱨᱮᱰ",
    slot3Title: "ᱯᱟᱲᱦᱟᱣ ᱞᱮᱵᱮᱞ",
    slot4Title: "PM-AJAY ᱜᱚᱲᱚ ᱴᱟᱠᱟ",
    editAllFields: "ᱡᱚᱛᱚ ᱯᱟᱥᱯᱚᱨᱴ ᱵᱚᱫᱚᱞ ᱢᱮ",
    tapMicToSpeak: "ᱢᱟᱭᱤᱠ ᱚᱛᱟ ᱠᱟᱛᱮ ᱨᱚᱲ ᱢᱮ",
    listeningSpeakNow: "ᱟᱸᱡᱚᱢᱮᱫᱟᱞᱮ... (ᱨᱚᱲ ᱢᱮ)",
    celebrationBadge: "ᱡᱤᱵᱤᱠᱟ ᱯᱟᱥᱯᱚᱨᱴ ᱮᱢ ᱮᱱᱟ",
    congratulations: (name) => `ᱥᱟᱨᱦᱟᱣ, ${name}!`,
    celebrationSubtitle: "ᱟᱢᱟᱜ ᱯᱨᱚᱯᱷᱟᱭᱤᱞ ᱟᱨ ᱦᱩᱱᱟᱹᱨ ᱞᱮᱠᱟᱛᱮ PM-AJAY ᱦᱩᱱᱟᱹᱨ ᱟᱨ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱛᱮᱭᱟᱨ ᱮᱱᱟ।",
    fitMatch: "ᱯᱷᱤᱴ ᱢᱮᱪ",
    mappedSkill: "ᱡᱚᱲᱟᱣ ᱦᱩᱱᱟᱹᱨ:",
    nsqfLevel: "NSQF ᱛᱷᱚᱠ:",
    grantSupport: "ᱜᱚᱲᱚ ᱴᱟᱠᱟ:",
    enterDashboard: "ᱤᱧᱟᱜ ᱦᱤᱛᱟᱹᱫᱷᱤᱠᱟᱨᱤ ᱰᱮᱥᱵᱚᱨᱰ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ",
    reviewSteps: "ᱡᱟᱸᱪ ᱢᱮ",
    modalTitle: "ᱯᱟᱥᱯᱚᱨᱴ ᱵᱚᱫᱚᱞ ᱢᱮ",
    modalSubtitle: "ᱧᱩᱛᱩᱢ, ᱡᱤᱞᱟ, ᱦᱩᱱᱟᱹᱨ ᱟᱨ ᱯᱟᱲᱦᱟᱣ ᱵᱚᱫᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱢ",
    modalCandidateName: "ᱠᱟᱱᱰᱤᱰᱮᱴ ᱧᱩᱛᱩᱢ",
    modalDistrict: "ᱡᱤᱞᱟ",
    modalState: "ᱯᱚᱱᱚᱛ",
    modalSkill: "NSQF ᱦᱩᱱᱟᱹᱨ / ᱴᱨᱮᱰ",
    modalEducation: "ᱯᱟᱲᱦᱟᱣ",
    modalGrant: "PM-AJAY ᱜᱚᱲᱚ",
    modalSave: "ᱵᱚᱫᱚᱞ ᱥᱟᱧᱪᱟᱣ ᱢᱮ",
    modalSaveAndComplete: "✨ ᱥᱟᱧᱪᱟᱣ ᱟᱨ ᱯᱟᱥᱯᱳᱨᱴ ᱯᱩᱨᱟᱹᱣ ᱢᱮ",
    completeAndIssuePassport: "✨ ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱯᱩᱨᱟᱹᱣ ᱟᱨ ᱯᱟᱥᱯᱳᱨᱴ ᱧᱮᱞ ᱢᱮ"
  },
  bn: {
    headerTitle: "ব্যক্তিগত ভয়েস অনবোর্ডিং",
    headerSubtitle: "পিএম-অজয় এআই জীবিকা প্রোফাইলার",
    back: "পেছনে",
    manualEdit: "ম্যানুয়াল এডিট",
    skip: "এড়িয়ে যান",
    previous: "পূর্ববর্তী",
    nextStep: "পরবর্তী ধাপ",
    viewPassport: "পাসপোর্ট দেখুন",
    voiceCopilot: "সক্ষম-এআই ভয়েস কোপাইলট",
    editDetails: "এডিট",
    replayAudio: "প্রশ্ন পুনরায় শুনুন",
    irrelevantTitle: "অসম্পূর্ণ বা অপ্রাসঙ্গিক উত্তর",
    yourResponse: "আপনার উত্তর:",
    listening: "আপনার ভয়েস শুনছি...",
    typeManually: "✏️ টাইপ / এডিট করুন",
    cancelTyping: "বাতিল",
    typePlaceholder: "এখানে আপনার উত্তর লিখুন বা এডিট করুন...",
    confirmAndAnalyze: "নিশ্চিত ও বিশ্লেষণ করুন",
    cancel: "বাতিল",
    tapToSpeakOrSelect: "মাইক চেপে বলুন অথবা বিকল্প নির্বাচন করুন...",
    quickExamples: "বা দ্রুত উদাহরণ নির্বাচন করুন:",
    passportTitle: "পিএম-অজয় জীবিকা পাসপোর্ট",
    verified: "✓ যাচাইকৃত (4/4)",
    building: "তৈরি হচ্ছে",
    awaitingInput: "ইনপুট প্রয়োজন (0/4)",
    slot1Title: "প্রার্থীর নাম ও জেলা",
    slot2Title: "এনএসকিউএফ দক্ষতা ট্রেড",
    slot3Title: "শিক্ষাগত যোগ্যতা",
    slot4Title: "পিএম-অজয় আর্থিক অনুদান",
    editAllFields: "সমস্ত পাসপোর্ট বিবরণ এডিট করুন",
    tapMicToSpeak: "মাইক চেপে বলুন",
    listeningSpeakNow: "শুনছি... (অনুগ্রহ করে বলুন)",
    celebrationBadge: "জীবিকা পাসপোর্ট প্রদান করা হলো",
    congratulations: (name) => `অভিনন্দন, ${name}!`,
    celebrationSubtitle: "আপনার প্রোফাইল এবং দক্ষতার ভিত্তিতে পিএম-অজয় দক্ষতা ও স্বরোজগার পথ প্রস্তুত।",
    fitMatch: "ফিট ম্যাচ",
    mappedSkill: "ম্যাপ করা দক্ষতা:",
    nsqfLevel: "এনএসকিউএফ স্তর:",
    grantSupport: "অনুদান সহায়তা:",
    enterDashboard: "আমার সুবিধাভোগী ড্যাশবোর্ডে প্রবেশ করুন",
    reviewSteps: "পর্যালোচনা করুন",
    modalTitle: "পাসপোর্ট বিবরণ এডিট করুন",
    modalSubtitle: "নাম, জেলা, ট্রেড বা যোগ্যতা ম্যানুয়ালি পরিবর্তন করতে পারেন",
    modalCandidateName: "প্রার্থীর পুরো নাম",
    modalDistrict: "জেলা",
    modalState: "রাজ্য",
    modalSkill: "এনএসকিউএফ দক্ষতা / ট্রেড",
    modalEducation: "শিক্ষাগত স্তর",
    modalGrant: "পিএম-অজয় অনুদান / লক্ষ্য",
    modalSave: "পরিবর্তন সংরক্ষণ করুন",
    modalSaveAndComplete: "✨ সংরক্ষণ ও পাসপোর্ট সম্পন্ন করুন",
    completeAndIssuePassport: "✨ প্রোফাইল সম্পন্ন করুন ও পাসপোর্ট দেখুন"
  },
  bho: {
    headerTitle: "व्यक्तिगत आवाज ऑनबोर्डिंग",
    headerSubtitle: "पीएम-अजय एआई रोजी-रोटी प्रोफाइलर",
    back: "पीछे",
    manualEdit: "हाथ से सुधार",
    skip: "छोड़ीं",
    previous: "पिछिला",
    nextStep: "अगिला चरण",
    viewPassport: "पासपोर्ट देखीं",
    voiceCopilot: "सक्षम-एआई वॉयस कोपायलट",
    editDetails: "सुधारीं",
    replayAudio: "सवाल फेर से सुनीं",
    irrelevantTitle: "अधूरा भा असंबंधित जवाब",
    yourResponse: "रउरा जवाब:",
    listening: "आवाज सुनत बानी...",
    typeManually: "✏️ हाथ से लिखीं / सुधारीं",
    cancelTyping: "रद्द करीं",
    typePlaceholder: "हियां आपन जवाब लिखीं भा सुधारीं...",
    confirmAndAnalyze: "दर्ज आ जांच करीं",
    cancel: "रद्द",
    tapToSpeakOrSelect: "माइक दबा के बोलीं भा नीचे से चुनीं...",
    quickExamples: "भा तुरंत उदाहरण चुनीं:",
    passportTitle: "पीएम-अजय आजीविका पासपोर्ट",
    verified: "✓ सत्यापित (4/4)",
    building: "तइयार होत बा",
    awaitingInput: "इनपुट चाहीं (0/4)",
    slot1Title: "उम्मीदवार के नाम आ जिला",
    slot2Title: "एनएसक्यूएफ हुनर ट्रेड",
    slot3Title: "पढ़ाई आ साक्षरता",
    slot4Title: "पीएम-अजय अनुदान सहायता",
    editAllFields: "सभ पासपोर्ट विवरण सुधारीं",
    tapMicToSpeak: "माइक दबा के बोलीं",
    listeningSpeakNow: "सुनत बानी... (बोलीं)",
    celebrationBadge: "आजीविका पासपोर्ट जारी भइल",
    congratulations: (name) => `बधाई होखे, ${name}!`,
    celebrationSubtitle: "रउरा प्रोफाइल आ हुनर के हिसाब से पीएम-अजय कौशल आ रोजगार राह तइयार बा।",
    fitMatch: "मैच",
    mappedSkill: "जोड़ल हुनर:",
    nsqfLevel: "एनएसक्यूएफ लेवल:",
    grantSupport: "अनुदान सहायता:",
    enterDashboard: "हमार लाभार्थी डैशबोर्ड में जाईं",
    reviewSteps: "समीक्षा करीं",
    modalTitle: "पासपोर्ट विवरण सुधारीं",
    modalSubtitle: "नाम, जिला, काम भा पढ़ाई में सुधार कर सकीं",
    modalCandidateName: "उम्मीदवार के पूरा नाम",
    modalDistrict: "जिला",
    modalState: "राज्य",
    modalSkill: "एनएसक्यूएफ काम / ट्रेड",
    modalEducation: "पढ़ाई के स्तर",
    modalGrant: "पीएम-अजय अनुदान / लक्ष्य",
    modalSave: "सुधार सहेजीं",
    modalSaveAndComplete: "✨ सहेजीं आ पासपोर्ट पूरा करीं",
    completeAndIssuePassport: "✨ प्रोफाइल पूरा करीं आ पासपोर्ट देखीं"
  },
  mr: {
    headerTitle: "वैयक्तिक व्हॉइस ऑनबोर्डिंग",
    headerSubtitle: "पीएम-अजय एआय उपजीविका प्रोफायलर",
    back: "मागे",
    manualEdit: "मॅन्युअल बदल",
    skip: "वगळा",
    previous: "मागील",
    nextStep: "पुढील टप्पा",
    viewPassport: "पासपोर्ट पहा",
    voiceCopilot: "सक्षम-एआई व्हॉइस कोपायलट",
    editDetails: "बदला",
    replayAudio: "प्रश्न पुन्हा ऐका",
    irrelevantTitle: "अपूर्ण किंवा असंबंधित उत्तर",
    yourResponse: "तुमचे उत्तर:",
    listening: "तुमचा आवाज ऐकत आहोत...",
    typeManually: "✏️ मॅन्युअल टाईप / बदल करा",
    cancelTyping: "रद्द करा",
    typePlaceholder: "येथे तुमचे उत्तर लिहा किंवा दुरुस्त करा...",
    confirmAndAnalyze: "नोंदवा व विश्लेषण करा",
    cancel: "रद्द करा",
    tapToSpeakOrSelect: "माईक दाबून बोला किंवा खालील पर्याय निवडा...",
    quickExamples: "किंवा द्रुत उदाहरणे निवडा:",
    passportTitle: "पीएम-अजय उपजीविका पासपोर्ट",
    verified: "✓ पडताळणी पूर्ण (4/4)",
    building: "तयार होत आहे",
    awaitingInput: "इनपुट प्रलंबित (0/4)",
    slot1Title: "उमेदवाराचे नाव व जिल्हा",
    slot2Title: "एनएसक्यूएफ कौशल्य ट्रेड",
    slot3Title: "शैक्षणिक पात्रता",
    slot4Title: "पीएम-अजय भांडवली सहाय्य",
    editAllFields: "सर्व पासपोर्ट माहिती बदला",
    tapMicToSpeak: "माईक दाबून बोला",
    listeningSpeakNow: "ऐकत आहोत... (कृपया बोला)",
    celebrationBadge: "उपजीविका पासपोर्ट जारी (LIVELIHOOD PASSPORT ISSUED)",
    congratulations: (name) => `अभिनंदन, ${name}!`,
    celebrationSubtitle: "तुमच्या प्रोफाइल आणि कौशल्याच्या आधारे पीएम-अजय कौशल्य व स्वयंरोजगार मार्ग तयार आहे.",
    fitMatch: "योग्य मॅच",
    mappedSkill: "मॅप केलेले कौशल्य:",
    nsqfLevel: "एनएसक्यूएफ पातळी:",
    grantSupport: "अनुदान सहाय्य:",
    enterDashboard: "माझ्या लाभार्थी डॅशबोर्डवर जा",
    reviewSteps: "पुनरावलोकन करा",
    modalTitle: "पासपोर्ट तपशील बदला",
    modalSubtitle: "नाव, जिल्हा, कौशल्य किंवा पात्रता मॅन्युअली दुरुस्त करा",
    modalCandidateName: "उमेदवाराचे पूर्ण नाव",
    modalDistrict: "जिल्हा",
    modalState: "राज्य",
    modalSkill: "एनएसक्यूएफ कौशल्य / ट्रेड",
    modalEducation: "शैक्षणिक स्तर",
    modalGrant: "पीएम-अजय अनुदान / उद्दिष्ट",
    modalSave: "बदल जतन करा",
    modalSaveAndComplete: "✨ जतन करा आणि पासपोर्ट पूर्ण करा",
    completeAndIssuePassport: "✨ प्रोफाइल पूर्ण करा आणि पासपोर्ट पहा"
  },
  te: {
    headerTitle: "వ్యక్తిగత వాయిస్ ఆన్‌బోర్డింగ్",
    headerSubtitle: "పీఎం-అజయ్ ఏఐ జీవనోపాధి ప్రొఫైలర్",
    back: "వెనుకకు",
    manualEdit: "మాన్యువల్ మార్పు",
    skip: "దాటవేయి",
    previous: "మునుపటి",
    nextStep: "తదుపరి దశ",
    viewPassport: "పాస్‌పోర్ట్ చూడండి",
    voiceCopilot: "సక్షమ్-ఏఐ వాయిస్ కోపైలట్",
    editDetails: "సవరించు",
    replayAudio: "ప్రశ్నను మళ్లీ వినండి",
    irrelevantTitle: "అసంపూర్ణ సమాధానం",
    yourResponse: "మీ సమాధానం:",
    listening: "మీ స్వరాన్ని వింటున్నాము...",
    typeManually: "✏️ మాన్యువల్ టైప్ / సవరించు",
    cancelTyping: "రద్దు చేయి",
    typePlaceholder: "ఇక్కడ టైప్ చేయండి...",
    confirmAndAnalyze: "నిర్ధారించి విశ్లేషించు",
    cancel: "రద్దు",
    tapToSpeakOrSelect: "మైక్ నొక్కి మాట్లాడండి...",
    quickExamples: "లేదా శీఘ్ర ఎంపికలు:",
    passportTitle: "పీఎం-అజయ్ జీవనోపాధి పాస్‌పోర్ట్",
    verified: "✓ ధృవీకరించబడింది (4/4)",
    building: "రూపొందుతోంది",
    awaitingInput: "ఇన్‌పుట్ అవసరం (0/4)",
    slot1Title: "అభ్యర్థి పేరు & జిల్లా",
    slot2Title: "NSQF నైపుణ్య ట్రేడ్",
    slot3Title: "విద్యార్హత",
    slot4Title: "పీఎం-అజయ్ మూలధన సహాయం",
    editAllFields: "అన్ని వివరాలను సవరించండి",
    tapMicToSpeak: "మైక్ నొక్కి మాట్లాడండి",
    listeningSpeakNow: "వింటున్నాము... (మాట్లాడండి)",
    celebrationBadge: "జీవనోపాధి పాస్‌పోర్ట్ జారీ చేయబడింది",
    congratulations: (name) => `అభినందనలు, ${name}!`,
    celebrationSubtitle: "మీ ప్రొఫైల్ మరియు నైపుణ్యాల ఆధారంగా పీఎం-అజయ్ నైపుణ్య మరియు స్వయం ఉపాధి మార్గం సిద్ధంగా ఉంది.",
    fitMatch: "ఫిట్ మ్యాచ్",
    mappedSkill: "జోడించిన నైపుణ్యం:",
    nsqfLevel: "NSQF స్థాయి:",
    grantSupport: "గ్రాంట్ సహాయం:",
    enterDashboard: "నా లబ్ధిదారు డాష్‌బోర్డ్‌లోకి ప్రవేశించండి",
    reviewSteps: "సమీక్షించండి",
    modalTitle: "పాస్‌పోర్ట్ వివరాలను సవరించండి",
    modalSubtitle: "పేరు, జిల్లా, నైపుణ్యం లేదా విద్యార్హతను మాన్యువల్‌గా మార్చవచ్చు",
    modalCandidateName: "అభ్యర్థి పూర్తి పేరు",
    modalDistrict: "జిల్లా",
    modalState: "రాష్ట్రం",
    modalSkill: "NSQF నైపుణ్యం / ట్రేడ్",
    modalEducation: "విద్యార్హత",
    modalGrant: "పీఎం-అజయ్ గ్రాంట్ / లక్ష్యం",
    modalSave: "మార్పులను సేవ్ చేయండి",
    modalSaveAndComplete: "✨ సేవ్ చేసి పాస్‌పోర్ట్ పూర్తి చేయండి",
    completeAndIssuePassport: "✨ ప్రొఫైల్ పూర్తి చేసి పాస్‌పోర్ట్ చూడండి"
  },
  ta: {
    headerTitle: "தனிப்பயன் குரல் ஆன்போர்டிங்",
    headerSubtitle: "பிஎம்-அஜய் ஏஐ வாழ்வாதார சுயவிவரம்",
    back: "பின்னால்",
    manualEdit: "கைமுறை திருத்தம்",
    skip: "தவிர்",
    previous: "முந்தைய",
    nextStep: "அடுத்த படி",
    viewPassport: "பாஸ்போர்ட்டைப் பார்க்கவும்",
    voiceCopilot: "சக்ஷம்-ஏஐ குரல் வழிகாட்டி",
    editDetails: "திருத்து",
    replayAudio: "மீண்டும் கேள்",
    irrelevantTitle: "முழுமையற்ற பதில்",
    yourResponse: "உங்கள் பதில்:",
    listening: "உங்கள் குரலைக் கேட்கிறோம்...",
    typeManually: "✏️ கைமுறையாக தட்டச்சு செய்க",
    cancelTyping: "ரத்து செய்",
    typePlaceholder: "உங்கள் பதிலை இங்கே தட்டச்சு செய்க...",
    confirmAndAnalyze: "உறுதிசெய்து பகுப்பாய்வு செய்க",
    cancel: "ரத்து",
    tapToSpeakOrSelect: "மைக் அழுத்தி பேசவும்...",
    quickExamples: "அல்லது விரைவுத் தேர்வுகள்:",
    passportTitle: "பிஎம்-அஜய் வாழ்வாதார பாஸ்போர்ட்",
    verified: "✓ சரிபார்க்கப்பட்டது (4/4)",
    building: "உருவாகிறது",
    awaitingInput: "உள்ளீடு தேவை (0/4)",
    slot1Title: "விண்ணப்பதாரர் பெயர் & மாவட்டம்",
    slot2Title: "NSQF திறன் தொழில்",
    slot3Title: "கல்வித் தகுதி",
    slot4Title: "பிஎம்-அஜய் மூலதன உதவி",
    editAllFields: "அனைத்து விவரங்களையும் திருத்து",
    tapMicToSpeak: "மைக் அழுத்தி பேசவும்",
    listeningSpeakNow: "கேட்கிறோம்... (பேசவும்)",
    celebrationBadge: "வாழ்வாதார பாஸ்போர்ட் வழங்கப்பட்டது",
    congratulations: (name) => `வாழ்த்துகள், ${name}!`,
    celebrationSubtitle: "உங்கள் சுயவிவரம் மற்றும் திறன்களின் அடிப்படையில் பிஎம்-அஜய் திறன் மற்றும் சுயதொழில் பாதை தயாராக உள்ளது.",
    fitMatch: "பொருத்தம்",
    mappedSkill: "இணைக்கப்பட்ட திறன்:",
    nsqfLevel: "NSQF நிலை:",
    grantSupport: "மானிய உதவி:",
    enterDashboard: "என் பயனாளி டாஷ்போர்டில் நுழையவும்",
    reviewSteps: "மறுபரிசீலனை செய்க",
    modalTitle: "பாஸ்போர்ட் விவரங்களை திருத்து",
    modalSubtitle: "பெயர், மாவட்டம், தொழில் அல்லது கல்வித் தகுதியை மாற்றலாம்",
    modalCandidateName: "விண்ணப்பதாரர் முழுப் பெயர்",
    modalDistrict: "மாவட்டம்",
    modalState: "மாநிலம்",
    modalSkill: "NSQF திறன் / தொழில்",
    modalEducation: "கல்வி நிலை",
    modalGrant: "பிஎம்-அஜய் மானியம் / இலக்கு",
    modalSave: "மாற்றங்களைச் சேமிக்கவும்",
    modalSaveAndComplete: "✨ சேமித்து பாஸ்போர்ட்டை முடிக்கவும்",
    completeAndIssuePassport: "✨ சுயவிவரத்தை முடித்து பாஸ்போர்ட்டைப் பார்க்கவும்"
  },
  gu: {
    headerTitle: "વ્યક્તિગત વોઇસ ઓનબોર્ડિંગ",
    headerSubtitle: "પીએમ-અજય એઆઈ આજીવિકા પ્રોફાઇલર",
    back: "પાછળ",
    manualEdit: "મેન્યુઅલ સુધારો",
    skip: "છોડો",
    previous: "પાછલું",
    nextStep: "આગળનું પગલું",
    viewPassport: "પાસપોર્ટ જુઓ",
    voiceCopilot: "સક્ષમ-એઆઈ વોઇસ કોપાયલટ",
    editDetails: "સુધારો",
    replayAudio: "પ્રશ્ન ફરીથી સાંભળો",
    irrelevantTitle: "અપૂર્ણ જવાબ",
    yourResponse: "તમારો જવાબ:",
    listening: "તમારો અવાજ સાંભળી રહ્યા છીએ...",
    typeManually: "✏️ મેન્યુઅલ લખો / સુધારો",
    cancelTyping: "રદ કરો",
    typePlaceholder: "અહીં લખો...",
    confirmAndAnalyze: "પુષ્ટિ અને વિશ્લેષણ કરો",
    cancel: "રદ",
    tapToSpeakOrSelect: "માઇક દબાવીને બોલો...",
    quickExamples: "અથવા ઝડપી ઉદાહરણો:",
    passportTitle: "પીએમ-અજય આજીવિકા પાસપોર્ટ",
    verified: "✓ ચકાસાયેલ (4/4)",
    building: "તૈયાર થઈ રહ્યું છે",
    awaitingInput: "ઇનપુટ બાકી (0/4)",
    slot1Title: "ઉમેદવારનું નામ અને જિલ્લો",
    slot2Title: "NSQF કૌશલ્ય ટ્રેડ",
    slot3Title: "શૈક્ષણિક લાયકાત",
    slot4Title: "પીએમ-અજય મૂડી સહાય",
    editAllFields: "બધી વિગતો સુધારો",
    tapMicToSpeak: "માઇક દબાવીને બોલો",
    listeningSpeakNow: "સાંભળી રહ્યા છીએ... (બોલો)",
    celebrationBadge: "આજીવિકા પાસપોર્ટ જારી કરાયો",
    congratulations: (name) => `અભિનંદન, ${name}!`,
    celebrationSubtitle: "તમારી પ્રોફાઇલ અને કૌશલ્યના આધારે પીએમ-અજય કૌશલ્ય અને સ્વરોજગાર માર્ગ તૈયાર છે.",
    fitMatch: "યોગ્યતા મેચ",
    mappedSkill: "મેપ કરેલ કૌશલ્ય:",
    nsqfLevel: "NSQF સ્તર:",
    grantSupport: "ગ્રાન્ટ સહાય:",
    enterDashboard: "મારા લાભાર્થી ડેશબોર્ડમાં પ્રવેશ કરો",
    reviewSteps: "સમીક્ષા કરો",
    modalTitle: "પાસપોર્ટ વિગતો સુધારો",
    modalSubtitle: "નામ, જિલ્લો, કૌશલ્ય અથવા લાયકાત મેન્યુઅલી બદલો",
    modalCandidateName: "ઉમેદવારનું પૂરું નામ",
    modalDistrict: "જિલ્લો",
    modalState: "રાજ્ય",
    modalSkill: "NSQF કૌશલ્ય / ટ્રેડ",
    modalEducation: "શૈક્ષણિક સ્તર",
    modalGrant: "પીએમ-અજય ગ્રાન્ટ / લક્ષ્ય",
    modalSave: "ફેરફારો સાચવો",
    modalSaveAndComplete: "✨ સાચવો અને પાસપોર્ટ પૂર્ણ કરો",
    completeAndIssuePassport: "✨ પ્રોફાઇલ પૂર્ણ કરો અને પાસપોર્ટ જુઓ"
  },
  ur: {
    headerTitle: "ذاتی وائس آن بورڈنگ",
    headerSubtitle: "پی ایم-اجے اے آئی روزگار پروفائلر",
    back: "پیچھے",
    manualEdit: "دستی ترمیم",
    skip: "چھوڑیں",
    previous: "پچھلا",
    nextStep: "اگلا مرحلہ",
    viewPassport: "پاسپورٹ دیکھیں",
    voiceCopilot: "سکشم-اے آئی وائس کوپائلٹ",
    editDetails: "ترمیم کریں",
    replayAudio: "سوال دوبارہ سنیں",
    irrelevantTitle: "نامکمل جواب",
    yourResponse: "آپ کا جواب:",
    listening: "آپ کی آواز سن رہے ہیں...",
    typeManually: "✏️ دستی ٹائپ / ترمیم کریں",
    cancelTyping: "منسوخ کریں",
    typePlaceholder: "یہاں اپنا جواب لکھیں...",
    confirmAndAnalyze: "تصدیق اور تجزیہ کریں",
    cancel: "منسوخ",
    tapToSpeakOrSelect: "مائیک دبا کر بولیں...",
    quickExamples: "یا فوری مثالیں منتخب کریں:",
    passportTitle: "پی ایم-اجے روزگار پاسپورٹ",
    verified: "✓ تصدیق شدہ (4/4)",
    building: "تیار ہو رہا ہے",
    awaitingInput: "ان پٹ درکار (0/4)",
    slot1Title: "امیدوار کا نام اور ضلع",
    slot2Title: "NSQF ہنر مند ٹریڈ",
    slot3Title: "تعلیمی قابلیت",
    slot4Title: "پی ایم-اجے مالی امداد",
    editAllFields: "تمام تفصیلات میں ترمیم کریں",
    tapMicToSpeak: "مائیک دبا کر بولیں",
    listeningSpeakNow: "سن رہے ہیں... (برائے مہربانی بولیں)",
    celebrationBadge: "روزگار پاسپورٹ جاری کر دیا گیا",
    congratulations: (name) => `مبارک ہو، ${name}!`,
    celebrationSubtitle: "آپ کے پروفائل اور ہنر کی بنیاد پر پی ایم-اجے خود روزگار کا راستہ تیار ہے۔",
    fitMatch: "مناسبت",
    mappedSkill: "منسلک ہنر:",
    nsqfLevel: "NSQF سطح:",
    grantSupport: "امداد:",
    enterDashboard: "میرے ڈیش بورڈ پر جائیں",
    reviewSteps: "جائزہ لیں",
    modalTitle: "پاسپورٹ کی تفصیلات درست کریں",
    modalSubtitle: "نام، ضلع، ہنر یا تعلیم دستی طور پر تبدیل کر سکتے ہیں",
    modalCandidateName: "امیدوار کا پورا نام",
    modalDistrict: "ضلع",
    modalState: "ریاست",
    modalSkill: "NSQF ہنر / ٹریڈ",
    modalEducation: "تعلیمی سطح",
    modalGrant: "پی ایم-اجے گرانٹ / مقصد",
    modalSave: "تبدیلیاں محفوظ کریں",
    modalSaveAndComplete: "✨ محفوظ کریں اور پاسپورٹ مکمل کریں",
    completeAndIssuePassport: "✨ پروفائل مکمل کریں اور پاسپورٹ دیکھیں"
  },
  kn: {
    headerTitle: "ವೈಯಕ್ತಿಕ ಧ್ವನಿ ಆನ್‌ಬೋರ್ಡಿಂಗ್",
    headerSubtitle: "ಪಿಎಂ-ಅಜಯ್ ಎಐ ಜೀವನೋಪಾಯ ಪ್ರೊಫೈಲರ್",
    back: "ಹಿಂದಕ್ಕೆ",
    manualEdit: "ಹಸ್ತಚಾಲಿತ ಬದಲಾವಣೆ",
    skip: "ಬಿಟ್ಟುಬಿಡಿ",
    previous: "ಹಿಂದಿನ",
    nextStep: "ಮುಂದಿನ ಹಂತ",
    viewPassport: "ಪಾಸ್‌ಪೋರ್ಟ್ ವೀಕ್ಷಿಸಿ",
    voiceCopilot: "ಸಕ್ಷಮ್-ಎಐ ಧ್ವನಿ ಸಹಾಯಕ",
    editDetails: "ತಿದ್ದು",
    replayAudio: "ಪ್ರಶ್ನೆ ಮತ್ತೆ ಕೇಳಿ",
    irrelevantTitle: "ಅಪೂರ್ಣ ಉತ್ತರ",
    yourResponse: "ನಿಮ್ಮ ಉತ್ತರ:",
    listening: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    typeManually: "✏️ ಟೈಪ್ ಮಾಡಿ / ತಿದ್ದಿ",
    cancelTyping: "ರದ್ದುಮಾಡಿ",
    typePlaceholder: "ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
    confirmAndAnalyze: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ವಿಶ್ಲೇಷಿಸಿ",
    cancel: "ರದ್ದು",
    tapToSpeakOrSelect: "ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ...",
    quickExamples: "ತ್ವರಿತ ಉದಾಹರಣೆಗಳು:",
    passportTitle: "ಪಿಎಂ-ಅಜಯ್ ಜೀವನೋಪಾಯ ಪಾಸ್‌ಪೋರ್ಟ್",
    verified: "✓ ಪರಿಶೀಲಿಸಲಾಗಿದೆ (4/4)",
    building: "ರೂಪಗೊಳ್ಳುತ್ತಿದೆ",
    awaitingInput: "ಇನ್‌ಪುಟ್ ಬಾಕಿ (0/4)",
    slot1Title: "ಅಭ್ಯರ್ಥಿಯ ಹೆಸರು ಮತ್ತು ಜಿಲ್ಲೆ",
    slot2Title: "NSQF ಕೌಶಲ್ಯ ಟ್ರೇಡ್",
    slot3Title: "ವಿದ್ಯಾರ್ಹತೆ",
    slot4Title: "ಪಿಎಂ-ಅಜಯ್ ಬಂಡವಾಳ ಬೆಂಬಲ",
    editAllFields: "ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ತಿದ್ದಿ",
    tapMicToSpeak: "ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ",
    listeningSpeakNow: "ಆಲಿಸಲಾಗುತ್ತಿದೆ... (ಮಾತನಾಡಿ)",
    celebrationBadge: "ಜೀವನೋಪಾಯ ಪಾಸ್‌ಪೋರ್ಟ್ ನೀಡಲಾಗಿದೆ",
    congratulations: (name) => `ಅಭಿನಂದನೆಗಳು, ${name}!`,
    celebrationSubtitle: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಕೌಶಲ್ಯದ ಆಧಾರದ ಮೇಲೆ ಪಿಎಂ-ಅಜಯ್ ಕೌಶಲ್ಯ ಮತ್ತು ಸ್ವಯಂ ಉದ್ಯೋಗ ಮಾರ್ಗ ಸಿದ್ಧವಾಗಿದೆ.",
    fitMatch: "ಹೊಂದಾಣಿಕೆ",
    mappedSkill: "ಮ್ಯಾಪ್ ಮಾಡಿದ ಕೌಶಲ್ಯ:",
    nsqfLevel: "NSQF ಹಂತ:",
    grantSupport: "ಅನುದಾನ ಬೆಂಬಲ:",
    enterDashboard: "ನನ್ನ ಫಲಾನುಭವಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ",
    reviewSteps: "ಪರಿಶೀಲಿಸಿ",
    modalTitle: "ಪಾಸ್‌ಪೋರ್ಟ್ ವಿವರಗಳನ್ನು ತಿದ್ದಿ",
    modalSubtitle: "ಹೆಸರು, ಜಿಲ್ಲೆ, ಕೌಶಲ್ಯ ಅಥವಾ ವಿದ್ಯಾರ್ಹತೆಯನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ಬದಲಾಯಿಸಿ",
    modalCandidateName: "ಅಭ್ಯರ್ಥಿಯ ಪೂರ್ಣ ಹೆಸರು",
    modalDistrict: "ಜಿಲ್ಲೆ",
    modalState: "ರಾಜ್ಯ",
    modalSkill: "NSQF ಕೌಶಲ್ಯ / ಟ್ರೇಡ್",
    modalEducation: "ವಿದ್ಯಾರ್ಹತೆ",
    modalGrant: "ಪಿಎಂ-ಅಜಯ್ ಅನುದಾನ / ಗುರಿ",
    modalSave: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    modalSaveAndComplete: "✨ ಉಳಿಸಿ ಮತ್ತು ಪಾಸ್‌ಪೋರ್ಟ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    completeAndIssuePassport: "✨ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ಪಾಸ್‌ಪೋರ್ಟ್ ನೋಡಿ"
  },
  ml: {
    headerTitle: "വ്യക്തിഗത വോയ്‌സ് ഓൺബോർഡിംഗ്",
    headerSubtitle: "പിഎം-അജയ് എഐ തൊഴിൽ പ്രൊഫൈലർ",
    back: "പിന്നിലേക്ക്",
    manualEdit: "മാനുവൽ എഡിറ്റ്",
    skip: "ഒഴിവാക്കുക",
    previous: "മുമ്പത്തേത്",
    nextStep: "അടുത്ത ഘട്ടം",
    viewPassport: "പാസ്പോർട്ട് കാണുക",
    voiceCopilot: "സക്ഷം-എഐ വോയ്‌സ് കോപൈലറ്റ്",
    editDetails: "തിരുത്തുക",
    replayAudio: "ചോദ്യം വീണ്ടും കേൾക്കുക",
    irrelevantTitle: "അപൂർണ്ണമായ ഉത്തരം",
    yourResponse: "നിങ്ങളുടെ മറുപടി:",
    listening: "നിങ്ങളുടെ ശബ്ദം കേൾക്കുന്നു...",
    typeManually: "✏️ ടൈപ്പ് ചെയ്യുക / തിരുത്തുക",
    cancelTyping: "റദ്ദാക്കുക",
    typePlaceholder: "ഇവിടെ ടൈപ്പ് ചെയ്യുക...",
    confirmAndAnalyze: "സ്ഥിരീകരിച്ച് വിശകലനം ചെയ്യുക",
    cancel: "റദ്ദാക്കുക",
    tapToSpeakOrSelect: "മൈക്ക് അമർത്തി സംസാരിക്കുക...",
    quickExamples: "ദ്രുത ഉദാഹരണങ്ങൾ:",
    passportTitle: "പിഎം-അജയ് ഉപജീവന പാസ്‌പോർട്ട്",
    verified: "✓ സ്ഥിരീകരിച്ചു (4/4)",
    building: "തയ്യാറാക്കുന്നു",
    awaitingInput: "ഇൻപുട്ട് ആവശ്യമാണ് (0/4)",
    slot1Title: "പേരും ജില്ലയും",
    slot2Title: "NSQF തൊഴിൽ നൈപുണ്യം",
    slot3Title: "വിദ്യാഭ്യാസ യോഗ്യത",
    slot4Title: "പിഎം-അജയ് സാമ്പത്തിക സഹായം",
    editAllFields: "എല്ലാ വിവരങ്ങളും തിരുത്തുക",
    tapMicToSpeak: "മൈക്ക് അമർത്തി സംസാരിക്കുക",
    listeningSpeakNow: "കേൾക്കുന്നു... (സംസാരിക്കുക)",
    celebrationBadge: "ഉപജീവന പാസ്‌പോർട്ട് നൽകി",
    congratulations: (name) => `അഭിനന്ദനങ്ങൾ, ${name}!`,
    celebrationSubtitle: "നിങ്ങളുടെ പ്രൊഫൈലിന്റെയും കഴിവിന്റെയും അടിസ്ഥാനത്തിൽ പിഎം-അജയ് സ്വയംതൊഴിൽ പാത തയ്യാറാണ്.",
    fitMatch: "ഫിറ്റ് മാച്ച്",
    mappedSkill: "തിരഞ്ഞെടുത്ത തൊഴിൽ:",
    nsqfLevel: "NSQF ലെവൽ:",
    grantSupport: "സഹായധനം:",
    enterDashboard: "ഡാഷ്‌ബോർഡിലേക്ക് പോകുക",
    reviewSteps: "പരിശോധിക്കുക",
    modalTitle: "പാസ്‌പോർട്ട് വിവരങ്ങൾ തിരുത്തുക",
    modalSubtitle: "പേര്, ജില്ല, തൊഴിൽ എന്നിവ മാറ്റാം",
    modalCandidateName: "പൂർണ്ണമായ പേര്",
    modalDistrict: "ജില്ല",
    modalState: "സംസ്ഥാനം",
    modalSkill: "NSQF നൈപുണ്യം / ട്രേഡ്",
    modalEducation: "വിദ്യാഭ്യാസം",
    modalGrant: "പിഎം-അജയ് ഗ്രാന്റ്",
    modalSave: "മാറ്റങ്ങൾ സേവ് ചെയ്യുക",
    modalSaveAndComplete: "✨ സംരക്ഷിച്ച് പാസ്‌പോർട്ട് പൂർത്തിയാക്കുക",
    completeAndIssuePassport: "✨ പ്രൊഫൈൽ പൂർത്തിയാക്കി പാസ്‌പോർട്ട് കാണുക"
  },
  pa: {
    headerTitle: "ਨਿੱਜੀ ਵੌਇਸ ਔਨਬੋਰਡਿੰਗ",
    headerSubtitle: "ਪੀਐਮ-ਅਜੇ ਏਆਈ ਰੁਜ਼ਗਾਰ ਪ੍ਰੋਫਾਈਲਰ",
    back: "ਪਿੱਛੇ",
    manualEdit: "ਮੈਨੂਅਲ ਸੋਧ",
    skip: "ਛੱਡੋ",
    previous: "ਪਿਛਲਾ",
    nextStep: "ਅਗਲਾ ਕਦਮ",
    viewPassport: "ਪਾਸਪੋਰਟ ਵੇਖੋ",
    voiceCopilot: "ਸਕਸ਼ਮ-ਏਆਈ ਵੌਇਸ ਕੋਪਾਇਲਟ",
    editDetails: "ਸੋਧੋ",
    replayAudio: "ਸਵਾਲ ਦੁਬਾਰਾ ਸੁਣੋ",
    irrelevantTitle: "ਅਧੂਰਾ ਜਵਾਬ",
    yourResponse: "ਤੁਹਾਡਾ ਜਵਾਬ:",
    listening: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣ ਰਹੇ ਹਾਂ...",
    typeManually: "✏️ ਮੈਨੂਅਲ ਲਿਖੋ / ਸੋਧੋ",
    cancelTyping: "ਰੱਦ ਕਰੋ",
    typePlaceholder: "ਇੱਥੇ ਲਿਖੋ...",
    confirmAndAnalyze: "ਦਰਜ ਕਰੋ ਅਤੇ ਜਾਂਚੋ",
    cancel: "ਰੱਦ",
    tapToSpeakOrSelect: "ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ...",
    quickExamples: "ਜਾਂ ਤੁਰੰਤ ਉਦਾਹਰਣਾਂ:",
    passportTitle: "ਪੀਐਮ-ਅਜੇ ਰੁਜ਼ਗਾਰ ਪਾਸਪੋਰਟ",
    verified: "✓ ਤਸਦੀਕਸ਼ੁਦਾ (4/4)",
    building: "ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ",
    awaitingInput: "ਇਨਪੁਟ ਦੀ ਉਡੀਕ (0/4)",
    slot1Title: "ਉਮੀਦਵਾਰ ਦਾ ਨਾਮ ਅਤੇ ਜ਼ਿਲ੍ਹਾ",
    slot2Title: "NSQF ਹੁਨਰ ਟਰੇਡ",
    slot3Title: "ਵਿੱਦਿਅਕ ਯੋਗਤਾ",
    slot4Title: "ਪੀਐਮ-ਅਜੇ ਵਿੱਤੀ ਸਹਾਇਤਾ",
    editAllFields: "ਸਾਰੇ ਵੇਰਵੇ ਸੋਧੋ",
    tapMicToSpeak: "ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ",
    listeningSpeakNow: "ਸੁਣ ਰਹੇ ਹਾਂ... (ਬੋਲੋ ਜੀ)",
    celebrationBadge: "ਰੁਜ਼ਗਾਰ ਪਾਸਪੋਰਟ ਜਾਰੀ ਕੀਤਾ ਗਿਆ",
    congratulations: (name) => `ਮੁਬਾਰਕਾਂ, ${name}!`,
    celebrationSubtitle: "ਤੁਹਾਡੇ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਹੁਨਰ ਦੇ ਆਧਾਰ 'ਤੇ ਪੀਐਮ-ਅਜੇ ਸਵੈ-ਰੁਜ਼ਗਾਰ ਮਾਰਗ ਤਿਆਰ ਹੈ।",
    fitMatch: "ਮੈਚ",
    mappedSkill: "ਜੋੜਿਆ ਗਿਆ ਹੁਨਰ:",
    nsqfLevel: "NSQF ਪੱਧਰ:",
    grantSupport: "ਗ੍ਰਾਂਟ ਸਹਾਇਤਾ:",
    enterDashboard: "ਮੇਰੇ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਜਾਓ",
    reviewSteps: "ਜਾਂਚ ਕਰੋ",
    modalTitle: "ਪਾਸਪੋਰਟ ਵੇਰਵੇ ਸੋਧੋ",
    modalSubtitle: "ਨਾਮ, ਜ਼ਿਲ੍ਹਾ, ਹੁਨਰ ਜਾਂ ਪੜ੍ਹਾਈ ਵਿੱਚ ਸੋਧ ਕਰੋ",
    modalCandidateName: "ਪੂਰਾ ਨਾਮ",
    modalDistrict: "ਜ਼ਿਲ੍ਹਾ",
    modalState: "ਰਾਜ",
    modalSkill: "NSQF ਹੁਨਰ / ਟਰੇਡ",
    modalEducation: "ਵਿੱਦਿਅਕ ਪੱਧਰ",
    modalGrant: "ਪੀਐਮ-ਅਜੇ ਗ੍ਰਾਂਟ",
    modalSave: "ਬਦਲਾਅ ਸੁਰੱਖਿਅਤ ਕਰੋ",
    modalSaveAndComplete: "✨ ਸੰਭਾਲੋ ਅਤੇ ਪਾਸਪੋਰਟ ਪੂਰਾ ਕਰੋ",
    completeAndIssuePassport: "✨ ਪ੍ਰੋਫਾਈਲ ਪੂਰਾ ਕਰੋ ਅਤੇ ਪਾਸਪੋਰਟ ਦੇਖੋ"
  },
  as: {
    headerTitle: "ব্যক্তিগত ভয়েচ অনবৰ্ডিং",
    headerSubtitle: "পিএম-অজয় এআই জীৱিকা প্ৰফাইলেৰ",
    back: "পিছলৈ",
    manualEdit: "মেনুৱেল সম্পাদনা",
    skip: "এৰক",
    previous: "পূৰ্বৱৰ্তী",
    nextStep: "পৰৱৰ্তী স্তৰ",
    viewPassport: "পাছপ’ৰ্ট চাওক",
    voiceCopilot: "সক্ষম-এআই ভয়েচ সহায়ক",
    editDetails: "সম্পাদনা",
    replayAudio: "প্ৰশ্ন পুনৰ শুনক",
    irrelevantTitle: "অসম্পূৰ্ণ উত্তৰ",
    yourResponse: "আপোনাৰ উত্তৰ:",
    listening: "আপোনাৰ মাত শুনি আছো...",
    typeManually: "✏️ টাইপ / সম্পাদনা কৰক",
    cancelTyping: "বাতিল কৰক",
    typePlaceholder: "ইয়াত উত্তৰ লিখক...",
    confirmAndAnalyze: "নিশ্চিত আৰু বিশ্লেষণ কৰক",
    cancel: "বাতিল",
    tapToSpeakOrSelect: "মাইক টিপি কওক...",
    quickExamples: "বা দ্ৰুত উদাহৰণ বাছক:",
    passportTitle: "পিএম-অজয় জীৱিকা পাছপ’ৰ্ট",
    verified: "✓ প্ৰমাণিত (4/4)",
    building: "প্ৰস্তুত হৈ আছে",
    awaitingInput: "ইনপুট প্ৰয়োজন (0/4)",
    slot1Title: "প্ৰাৰ্থীৰ নাম আৰু জিলা",
    slot2Title: "NSQF দক্ষতা ট্ৰেড",
    slot3Title: "শিক্ষাগত অৰ্হতা",
    slot4Title: "পিএম-অজয় পুঁজি সাহায্য",
    editAllFields: "সকলো বিৱৰণ সম্পাদনা কৰক",
    tapMicToSpeak: "মাইক টিপি কওক",
    listeningSpeakNow: "শুনি আছো... (কওক)",
    celebrationBadge: "জীৱিকা পাছপ’ৰ্ট প্ৰদান কৰা হ’ল",
    congratulations: (name) => `অভিনন্দন, ${name}!`,
    celebrationSubtitle: "আপোনাৰ প্ৰফাইল আৰু দক্ষতাৰ ভিত্তিত পিএম-অজয় স্বনিৰ্ভৰ পথ প্ৰস্তুত।",
    fitMatch: "ফিট মেচ",
    mappedSkill: "সংযুক্ত দক্ষতা:",
    nsqfLevel: "NSQF স্তৰ:",
    grantSupport: "অনুদান সাহায্য:",
    enterDashboard: "মোৰ হিতাধিকাৰী ডেচবৰ্ডলৈ যাওক",
    reviewSteps: "পুনৰীক্ষণ কৰক",
    modalTitle: "পাছপ’ৰ্ট বিৱৰণ সম্পাদনা",
    modalSubtitle: "নাম, জিলা, দক্ষতা বা অৰ্হতা সলনি কৰিব পাৰে",
    modalCandidateName: "প্ৰাৰ্থীৰ সম্পূৰ্ণ নাম",
    modalDistrict: "জিলা",
    modalState: "ৰাজ্য",
    modalSkill: "NSQF দক্ষতা / ট্ৰেড",
    modalEducation: "শিক্ষাগত স্তৰ",
    modalGrant: "পিএম-অজয় অনুদান",
    modalSave: "পৰিৱৰ্তন সংৰক্ষণ কৰক",
    modalSaveAndComplete: "✨ সংৰক্ষণ কৰক আৰু পাছপ'ৰ্ট সম্পূৰ্ণ কৰক",
    completeAndIssuePassport: "✨ প্ৰ'ফাইল সম্পূৰ্ণ কৰক আৰু পাছপ'ৰ্ট চাওক"
  },
  mai: {
    headerTitle: "व्यक्तिगत आवाज अनबोर्डिंग",
    headerSubtitle: "पीएम-अजय एआई आजीविका प्रोफाइलर",
    back: "पाछू",
    manualEdit: "मैन्युअल सुधार",
    skip: "छोड़ू",
    previous: "पिछला",
    nextStep: "अगिला चरण",
    viewPassport: "पासपोर्ट देखू",
    voiceCopilot: "सक्षम-एआई वॉयस कोपायलट",
    editDetails: "सुधारू",
    replayAudio: "सवाल फेर सुनू",
    irrelevantTitle: "अपूर्ण उत्तर",
    yourResponse: "अहाँक उत्तर:",
    listening: "अहाँक आवाज सुनि रहल छी...",
    typeManually: "✏️ हाथ सं लिखू / सुधारू",
    cancelTyping: "रद्द करू",
    typePlaceholder: "एतय लिखू...",
    confirmAndAnalyze: "दर्ज आ जांच करू",
    cancel: "रद्द",
    tapToSpeakOrSelect: "माइक दबा क' बोलू...",
    quickExamples: "त्वरित उदाहरण:",
    passportTitle: "पीएम-अजय आजीविका पासपोर्ट",
    verified: "✓ सत्यापित (4/4)",
    building: "तैयार भ' रहल अछि",
    awaitingInput: "इनपुट चाही (0/4)",
    slot1Title: "उम्मीदवारक नाम आ जिला",
    slot2Title: "एनएसक्यूएफ हुनर ट्रेड",
    slot3Title: "पढ़ाई-लिखाई",
    slot4Title: "पीएम-अजय अनुदान सहायता",
    editAllFields: "सभ पासपोर्ट विवरण सुधारू",
    tapMicToSpeak: "माइक दबा क' बोलू",
    listeningSpeakNow: "सुनि रहल छी... (बोलू)",
    celebrationBadge: "आजीविका पासपोर्ट जारी भेल",
    congratulations: (name) => `बधाई हो, ${name}!`,
    celebrationSubtitle: "अहाँक प्रोफाइल आ हुनरक आधार पर पीएम-अजय कौशल आ स्वरोजगार मार्ग तैयार अछि।",
    fitMatch: "मैच",
    mappedSkill: "जोड़ल हुनर:",
    nsqfLevel: "एनएसक्यूएफ स्तर:",
    grantSupport: "अनुदान सहायता:",
    enterDashboard: "हमर लाभार्थी डैशबोर्ड मे जाऊ",
    reviewSteps: "समीक्षा करू",
    modalTitle: "पासपोर्ट विवरण सुधारू",
    modalSubtitle: "नाम, जिला, काम या पढ़ाई मे सुधार करू",
    modalCandidateName: "उम्मीदवारक पूरा नाम",
    modalDistrict: "जिला",
    modalState: "राज्य",
    modalSkill: "एनएसक्यूएफ काम / ट्रेड",
    modalEducation: "शैक्षणिक स्तर",
    modalGrant: "पीएम-अजय अनुदान",
    modalSave: "बदलाव सहेजू",
    modalSaveAndComplete: "✨ सहेजू आ पासपोर्ट पूरा करू",
    completeAndIssuePassport: "✨ प्रोफाइल पूरा करू आ पासपोर्ट देखू"
  }
};

export function getI18n(lang: string) {
  const cleanLang = (lang || "en").toLowerCase();
  return ONBOARDING_I18N[cleanLang] || ONBOARDING_I18N.en;
}

export function PersonalVoiceOnboarding({
  onComplete,
  onSkip,
  onBack,
  initialLanguage = "hi",
  onLanguageChange
}: PersonalVoiceOnboardingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [language, setLanguage] = useState<string>(
    initialLanguage ? initialLanguage.toLowerCase() : "hi"
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [relevanceStatus, setRelevanceStatus] = useState<"idle" | "relevant" | "irrelevant">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Sync initialLanguage prop when changed externally
  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage.toLowerCase());
    }
  }, [initialLanguage]);

  // Manual Editing States
  const [isManualEditModalOpen, setIsManualEditModalOpen] = useState<boolean>(false);
  const [isInlineTyping, setIsInlineTyping] = useState<boolean>(false);
  const [inlineTextInput, setInlineTextInput] = useState<string>("");

  // Saved spoken transcripts / text entries per step for review & back navigation
  const [stepTranscripts, setStepTranscripts] = useState<Record<number, string>>({});

  // Extracted Beneficiary Passport State - Progressively built step-by-step
  const [profile, setProfile] = useState<BeneficiaryProfileData>({
    fullName: "",
    district: "",
    state: "",
    skills: [],
    nsqfCode: "",
    nsqfLevel: 0,
    nsqfCourse: "",
    education: "",
    aspiration: "",
    recommendedPathway: "",
    grantEligibility: "",
    matchScore: 0
  });

  // Working copy for the manual edit modal
  const [editableProfile, setEditableProfile] = useState<BeneficiaryProfileData>({
    fullName: "",
    district: "",
    state: "",
    skills: [],
    nsqfCode: "",
    nsqfLevel: 4,
    nsqfCourse: "",
    education: "",
    aspiration: "",
    recommendedPathway: "",
    grantEligibility: "",
    matchScore: 94
  });

  const isStep1Done = Boolean(profile.fullName && profile.fullName.trim().length > 0);
  const isStep2Done = Boolean(profile.nsqfCourse && profile.nsqfCourse.trim().length > 0) || (profile.skills && profile.skills.length > 0);
  const isStep3Done = Boolean(profile.education && profile.education.trim().length > 0);
  const isStep4Done = Boolean(profile.grantEligibility && profile.grantEligibility.trim().length > 0) || Boolean(profile.aspiration && profile.aspiration.trim().length > 0);

  const completedCount = (isStep1Done ? 1 : 0) + (isStep2Done ? 1 : 0) + (isStep3Done ? 1 : 0) + (isStep4Done ? 1 : 0);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const latestTranscriptRef = useRef<string>("");
  const audioRequestIdRef = useRef<number>(0);

  const safeStepIndex = Math.min(Math.max(0, currentStepIndex), ONBOARDING_QUESTIONS.length - 1);
  const currentStep = ONBOARDING_QUESTIONS[safeStepIndex] || ONBOARDING_QUESTIONS[0];
  const t = getI18n(language);

  const handleLanguageChange = (code: string) => {
    const clean = (code || "en").toLowerCase();
    setLanguage(clean);
    onLanguageChange?.(clean);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("Saksham-AI_lang", clean);
        localStorage.setItem("language", clean);
      } catch { }
    }
    // If finished on celebration screen, announce in newly selected language
    if (isFinished) {
      const i18n = getI18n(clean);
      const cleanName = cleanHumanName(profile.fullName);
      const announceText = `${i18n.congratulations(cleanName)} ${i18n.celebrationSubtitle}`;
      playAiVoice(announceText);
    }
  };

  // Helper to retrieve saved or formatted response for a given step index
  const getStepExistingResponse = (stepIdx: number): string => {
    if (stepTranscripts[stepIdx] && stepTranscripts[stepIdx].trim().length > 0) {
      return stepTranscripts[stepIdx];
    }
    if (stepIdx === 0 && profile.fullName) {
      return `${cleanHumanName(profile.fullName)}${profile.district ? ` (${formatLocation(profile.district, profile.state, language)})` : ""}`;
    }
    if (stepIdx === 1 && (profile.nsqfCourse || (profile.skills && profile.skills.length > 0))) {
      return formatNsqfCourse(profile.nsqfCourse || profile.skills[0], language);
    }
    if (stepIdx === 2 && profile.education) {
      return formatEducation(profile.education, language);
    }
    if (stepIdx === 3 && (profile.grantEligibility || profile.aspiration)) {
      return formatGrantSupport(profile.grantEligibility || profile.aspiration, language);
    }
    return "";
  };

  // Speak initial question on step change and restore existing transcript if previously answered
  useEffect(() => {
    if (currentStepIndex >= ONBOARDING_QUESTIONS.length) {
      setCurrentStepIndex(ONBOARDING_QUESTIONS.length - 1);
      handleCompleteOnboarding();
      return;
    }
    if (currentStepIndex < 0) {
      setCurrentStepIndex(0);
      return;
    }
    if (!isFinished && currentStep) {
      const qText =
        currentStep.aiPromptText[language] || currentStep.aiPromptText.hi || currentStep.aiPromptText.en;
      playAiVoice(qText);

      // Check if we have an existing answer for this step
      const existingAnswer = getStepExistingResponse(safeStepIndex);

      if (existingAnswer) {
        setSpokenTranscript(existingAnswer);
        latestTranscriptRef.current = existingAnswer;
        setInlineTextInput(existingAnswer);
        setRelevanceStatus("relevant");
      } else {
        setSpokenTranscript("");
        latestTranscriptRef.current = "";
        setInlineTextInput("");
        setRelevanceStatus("idle");
      }

      setFeedbackMessage("");
      setIsInlineTyping(false);
    }
  }, [currentStepIndex, language, isFinished]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { }
      }
    };
  }, []);

  const stopAudioPlayback = () => {
    audioRequestIdRef.current++;
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
        audioPlayerRef.current.load();
      } catch { }
      audioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch { }
    }
    setIsAiSpeaking(false);
  };

  /**
   * Speak AI text out loud using Google & Gemini TTS with browser SpeechSynthesis fallback
   */
  const playAiVoice = async (text: string) => {
    stopAudioPlayback();
    const myReqId = ++audioRequestIdRef.current;
    setIsAiSpeaking(true);

    const clean = text.replace(/[*_#`]/g, "").trim();

    // 1. Try Gemini & Google TTS API for natural Indic voice
    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, language })
      });

      if (myReqId !== audioRequestIdRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (myReqId !== audioRequestIdRef.current) return;
        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audioPlayerRef.current = audio;
          audio.onended = () => {
            if (myReqId === audioRequestIdRef.current) {
              audioPlayerRef.current = null;
              setIsAiSpeaking(false);
            }
          };
          audio.onerror = () => {
            if (myReqId === audioRequestIdRef.current) {
              audioPlayerRef.current = null;
              playAiVoiceBrowserFallback(clean, myReqId);
            }
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Fall through to browser synthesis
    }

    if (myReqId === audioRequestIdRef.current) {
      playAiVoiceBrowserFallback(clean, myReqId);
    }
  };

  const playAiVoiceBrowserFallback = (clean: string, reqId: number) => {
    if (reqId !== audioRequestIdRef.current) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = language === "hi" ? "hi-IN" : language === "or" ? "hi-IN" : "en-IN";
        utterance.rate = 0.95;
        utterance.onend = () => {
          if (reqId === audioRequestIdRef.current) {
            setIsAiSpeaking(false);
          }
        };
        utterance.onerror = () => {
          if (reqId === audioRequestIdRef.current) {
            setIsAiSpeaking(false);
          }
        };
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("SpeechSynthesis error:", err);
        if (reqId === audioRequestIdRef.current) {
          setIsAiSpeaking(false);
        }
      }
    } else {
      if (reqId === audioRequestIdRef.current) {
        setIsAiSpeaking(false);
      }
    }
  };

  /**
   * Back Button Navigation Handler
   */
  const handleGoBack = () => {
    stopAudioPlayback();
    if (isFinished) {
      setIsFinished(false);
      setCurrentStepIndex(ONBOARDING_QUESTIONS.length - 1);
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  /**
   * Review Steps Handler from celebration screen
   */
  const handleReviewSteps = () => {
    stopAudioPlayback();
    setIsFinished(false);
    setCurrentStepIndex(ONBOARDING_QUESTIONS.length - 1);
  };

  /**
   * Open Manual Edit Modal
   */
  const handleOpenManualEdit = () => {
    stopAudioPlayback();
    setEditableProfile({
      fullName: profile.fullName || "रमेश सोरेन",
      district: profile.district || "Sundargarh",
      state: profile.state || "Odisha",
      skills: profile.skills && profile.skills.length > 0 ? profile.skills : ["Submersible Diagnostics", "Agri-Pump Repair"],
      nsqfCode: profile.nsqfCode || "ELE/Q5901",
      nsqfLevel: profile.nsqfLevel || 4,
      nsqfCourse: profile.nsqfCourse || "Solar PV Agri-Pump Specialist",
      education: profile.education || "10th Standard (10वीं पास)",
      aspiration: profile.aspiration || "Village Agri-Pump & Solar Repair Clinic",
      recommendedPathway: profile.recommendedPathway || "PM-AJAY Micro-Enterprise Hub",
      grantEligibility: profile.grantEligibility || "₹35,000 Capital Subsidy + ₹3,500/mo Stipend",
      matchScore: profile.matchScore || 94
    });
    setIsManualEditModalOpen(true);
  };

  /**
   * Save Manual Edit Updates
   * @param completeNow If true (default), immediately issues and completes the livelihood passport
   */
  const handleSaveManualEdit = (completeNow: boolean = true) => {
    const sanitized: BeneficiaryProfileData = {
      fullName: cleanHumanName(editableProfile.fullName) || profile.fullName || "रमेश सोरेन",
      district: editableProfile.district || profile.district || "Sundargarh",
      state: editableProfile.state || profile.state || "Odisha",
      skills: editableProfile.skills && editableProfile.skills.length > 0 ? editableProfile.skills : (profile.skills && profile.skills.length > 0 ? profile.skills : ["Submersible Diagnostics", "Agri-Pump Repair"]),
      nsqfCode: editableProfile.nsqfCode || profile.nsqfCode || "ELE/Q5901",
      nsqfLevel: editableProfile.nsqfLevel || profile.nsqfLevel || 4,
      nsqfCourse: editableProfile.nsqfCourse || profile.nsqfCourse || "Solar PV Agri-Pump Specialist",
      education: editableProfile.education || profile.education || "10th Standard (10वीं पास)",
      aspiration: editableProfile.aspiration || profile.aspiration || "Village Agri-Pump & Solar Repair Clinic",
      recommendedPathway: editableProfile.recommendedPathway || profile.recommendedPathway || "PM-AJAY Micro-Enterprise Hub",
      grantEligibility: editableProfile.grantEligibility || profile.grantEligibility || "₹35,000 Capital Subsidy + ₹3,500/mo Stipend",
      matchScore: editableProfile.matchScore || profile.matchScore || 94
    };

    setProfile(sanitized);
    setEditableProfile(sanitized);
    setIsManualEditModalOpen(false);

    // Sync all step transcripts with manual edits
    const s0 = `${sanitized.fullName}${sanitized.district ? ` (${formatLocation(sanitized.district, sanitized.state, language)})` : ""}`;
    const s1 = formatNsqfCourse(sanitized.nsqfCourse || sanitized.skills[0], language);
    const s2 = formatEducation(sanitized.education, language);
    const s3 = formatGrantSupport(sanitized.grantEligibility || sanitized.aspiration, language);

    setStepTranscripts({
      0: s0,
      1: s1,
      2: s2,
      3: s3
    });

    const currentAnswer = [s0, s1, s2, s3][currentStepIndex];
    if (currentAnswer) {
      setSpokenTranscript(currentAnswer);
      setInlineTextInput(currentAnswer);
      latestTranscriptRef.current = currentAnswer;
      setRelevanceStatus("relevant");
    }

    if (completeNow) {
      handleCompleteOnboarding(sanitized);
    } else {
      playAiVoice(`${t.congratulations(sanitized.fullName)} ${t.modalSubtitle}`);
    }
  };

  /**
   * Submit Inline Manual Text
   */
  const handleInlineTextSubmit = () => {
    if (!inlineTextInput || inlineTextInput.trim().length === 0) return;
    const text = inlineTextInput.trim();
    setSpokenTranscript(text);
    setStepTranscripts((prev) => ({ ...prev, [currentStepIndex]: text }));
    evaluateSpokenAnswer(text);
    setIsInlineTyping(false);
  };

  /**
   * Start live microphone speech recognition
   */
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { }
      }
      setIsListening(false);
      return;
    }

    stopAudioPlayback();
    setIsListening(true);
    setSpokenTranscript("");
    latestTranscriptRef.current = "";

    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "hi" ? "hi-IN" : language === "or" ? "or-IN" : "en-IN";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenTranscript(transcript);
        latestTranscriptRef.current = transcript;
      };

      recognition.onend = () => {
        setIsListening(false);
        const finalUtterance = latestTranscriptRef.current;
        if (finalUtterance && finalUtterance.trim().length > 0) {
          evaluateSpokenAnswer(finalUtterance.trim());
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        const finalUtterance = latestTranscriptRef.current;
        if (finalUtterance && finalUtterance.trim().length > 0) {
          evaluateSpokenAnswer(finalUtterance.trim());
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.warn("Speech recognition start failed:", e);
        setIsListening(false);
      }
    } else {
      // Fallback for browsers without Web Speech API
      setTimeout(() => {
        setIsListening(false);
        const fallbackUtterance = currentStep?.sampleChips?.[0] ? getChipSpokenText(currentStep.sampleChips[0], language) : "";
        if (fallbackUtterance) {
          setSpokenTranscript(fallbackUtterance);
          latestTranscriptRef.current = fallbackUtterance;
          evaluateSpokenAnswer(fallbackUtterance);
        }
      }, 2500);
    }
  };

  /**
   * Process and evaluate spoken utterance against the current question
   */
  const evaluateSpokenAnswer = async (spokenText: string) => {
    if (!spokenText || spokenText.trim().length === 0) return;
    setIsEvaluating(true);
    setStepTranscripts((prev) => ({ ...prev, [currentStepIndex]: spokenText }));

    try {
      const res = await fetch("/api/ai/onboarding-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: currentStep.id,
          userSpokenText: spokenText,
          language: language,
          currentProfile: profile
        })
      });

      const data = await res.json();

      if (data.isRelevant) {
        setRelevanceStatus("relevant");
        setFeedbackMessage(data.feedbackText || "Information verified successfully!");
        setStepTranscripts((prev) => ({ ...prev, [currentStepIndex]: spokenText }));

        // Agentically update personal passport profile with clean names
        setProfile((prev) => {
          const updated = { ...prev, ...data.extractedData };
          if (updated.fullName) {
            updated.fullName = cleanHumanName(updated.fullName);
          }
          return updated;
        });

        // Speak acknowledgment
        if (data.feedbackText) {
          playAiVoice(data.feedbackText);
        }

        // Auto progress to next step after brief celebration animation
        setTimeout(() => {
          setCurrentStepIndex((prev) => {
            if (prev < ONBOARDING_QUESTIONS.length - 1) {
              return prev + 1;
            } else {
              handleCompleteOnboarding();
              return ONBOARDING_QUESTIONS.length - 1;
            }
          });
        }, 2200);
      } else {
        // Not relevant: prompt kindly
        setRelevanceStatus("irrelevant");
        const guidance =
          data.feedbackText ||
          "Please answer according to your name, skills or qualifications.";
        setFeedbackMessage(guidance);
        playAiVoice(guidance);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      // Fallback: proceed gracefully
      setRelevanceStatus("relevant");
      setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev < ONBOARDING_QUESTIONS.length - 1) {
            return prev + 1;
          } else {
            handleCompleteOnboarding();
            return ONBOARDING_QUESTIONS.length - 1;
          }
        });
      }, 1500);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectSampleChip = (chip: {
    label: Record<string, string> | string;
    spokenText: Record<string, string> | string;
  } | {
    label: string;
    spokenText: string;
  }) => {
    const spoken = getChipSpokenText(chip, language);
    setSpokenTranscript(spoken);
    setStepTranscripts((prev) => ({ ...prev, [currentStepIndex]: spoken }));
    evaluateSpokenAnswer(spoken);
  };

  const handleCompleteOnboarding = (overrideProfile?: BeneficiaryProfileData) => {
    // Ensure all 4 slots are populated with clean verified values
    const profToUse = overrideProfile || profile;
    const finalProfile: BeneficiaryProfileData = {
      fullName: cleanHumanName(profToUse.fullName) || "रमेश सोरेन",
      district: profToUse.district || "Sundargarh",
      state: profToUse.state || "Odisha",
      skills: profToUse.skills && profToUse.skills.length > 0 ? profToUse.skills : ["Submersible Diagnostics", "Agri-Pump Repair"],
      nsqfCode: profToUse.nsqfCode || "ELE/Q5901",
      nsqfLevel: profToUse.nsqfLevel || 4,
      nsqfCourse: profToUse.nsqfCourse || "Solar PV Agri-Pump Specialist",
      education: profToUse.education || "10th Standard (10वीं पास)",
      aspiration: profToUse.aspiration || "Village Agri-Pump & Solar Repair Clinic",
      recommendedPathway: profToUse.recommendedPathway || "PM-AJAY Micro-Enterprise Hub",
      grantEligibility: profToUse.grantEligibility || "₹35,000 Capital Subsidy + ₹3,500/mo Stipend",
      matchScore: profToUse.matchScore || 94
    };

    setProfile(finalProfile);
    setEditableProfile(finalProfile);

    // Save transcripts for all slots so review will always show them
    setStepTranscripts({
      0: `${cleanHumanName(finalProfile.fullName)}${finalProfile.district ? ` (${formatLocation(finalProfile.district, finalProfile.state, language)})` : ""}`,
      1: formatNsqfCourse(finalProfile.nsqfCourse || finalProfile.skills[0], language),
      2: formatEducation(finalProfile.education, language),
      3: formatGrantSupport(finalProfile.grantEligibility || finalProfile.aspiration, language)
    });

    setIsFinished(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    const i18n = getI18n(language);
    const cleanName = cleanHumanName(finalProfile.fullName);
    const announceText = `${i18n.congratulations(cleanName)} ${i18n.celebrationSubtitle}`;
    playAiVoice(announceText);
  };

  const handleSkipFlow = () => {
    const finalProfile: BeneficiaryProfileData = {
      fullName: cleanHumanName(profile.fullName) || "रमेश सोरेन",
      district: profile.district || "Sundargarh",
      state: profile.state || "Odisha",
      skills: profile.skills && profile.skills.length > 0 ? profile.skills : ["Submersible Diagnostics", "Agri-Pump Repair"],
      nsqfCode: profile.nsqfCode || "ELE/Q5901",
      nsqfLevel: profile.nsqfLevel || 4,
      nsqfCourse: profile.nsqfCourse || "Solar PV Agri-Pump Specialist",
      education: profile.education || "10th Standard (10वीं पास)",
      aspiration: profile.aspiration || "Village Agri-Pump & Solar Repair Clinic",
      recommendedPathway: profile.recommendedPathway || "PM-AJAY Micro-Enterprise Hub",
      grantEligibility: profile.grantEligibility || "₹35,000 Capital Subsidy + ₹3,500/mo Stipend",
      matchScore: profile.matchScore || 94
    };
    setProfile(finalProfile);
    setEditableProfile(finalProfile);
    setStepTranscripts((prev) => ({
      ...prev,
      0: prev[0] || `${cleanHumanName(finalProfile.fullName)}${finalProfile.district ? ` (${formatLocation(finalProfile.district, finalProfile.state, language)})` : ""}`,
      1: prev[1] || formatNsqfCourse(finalProfile.nsqfCourse || finalProfile.skills[0], language),
      2: prev[2] || formatEducation(finalProfile.education, language),
      3: prev[3] || formatGrantSupport(finalProfile.grantEligibility || finalProfile.aspiration, language)
    }));
    if (onSkip) {
      onSkip();
    } else {
      onComplete(finalProfile);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] text-slate-900 select-none overflow-x-hidden">
      {/* Background Cloud Mist */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-6 -left-10 w-52 h-24 bg-white/70 rounded-full blur-2xl animate-float" />
        <div className="absolute top-28 -right-10 w-60 h-28 bg-purple-100/60 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-12 left-1/4 w-64 h-24 bg-amber-100/70 rounded-full blur-2xl" />
      </div>

      {/* Top Header Bar with Back Button, Language Selector & Manual Edit */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 pt-3 pb-2 relative z-50 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.04, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
            title="Go back to previous step"
          >
            <ArrowLeft className="size-3.5 text-purple-600" />
            <span className="hidden xs:inline">{t.back}</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight font-heading">
                {t.headerTitle}
              </span>
              <span className="text-[10px] font-bold text-purple-700">
                {t.headerSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 relative z-50">
          {/* Manual Edit Header Action Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleOpenManualEdit}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 shadow-2xs transition-all cursor-pointer"
            title="Manually edit passport details"
          >
            <Edit3 className="size-3.5 text-purple-600" />
            <span className="hidden sm:inline">{t.manualEdit}</span>
            <span className="sm:hidden">{t.editDetails}</span>
          </motion.button>

          {/* Dynamic Language Selector with current language sync */}
          <LanguageSelector
            variant="icon"
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />

          <button
            onClick={handleSkipFlow}
            type="button"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 cursor-pointer"
          >
            {t.skip}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between px-4 sm:px-6 py-2 z-10">
        {!isFinished ? (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {/* Step Progress Pills & Back Navigation Status */}
            <div className="w-full space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span>{currentStep?.title || ONBOARDING_QUESTIONS[0].title}</span>
                  {currentStepIndex > 0 && (
                    <button
                      onClick={handleGoBack}
                      type="button"
                      className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <ArrowLeft className="size-3" />
                      <span>{t.previous}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {completedCount >= 4 ? (
                    <button
                      onClick={() => handleCompleteOnboarding()}
                      type="button"
                      className="text-[11px] font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-xl border border-emerald-300 shadow-xs ring-2 ring-emerald-400/30 transition-all"
                    >
                      <Sparkles className="size-3 text-emerald-600" />
                      <span>{t.viewPassport}</span>
                      <ArrowRight className="size-3" />
                    </button>
                  ) : currentStepIndex < ONBOARDING_QUESTIONS.length - 1 && getStepExistingResponse(currentStepIndex) ? (
                    <button
                      onClick={() => {
                        if (currentStepIndex < ONBOARDING_QUESTIONS.length - 1) {
                          setCurrentStepIndex((prev) => Math.min(prev + 1, ONBOARDING_QUESTIONS.length - 1));
                        } else {
                          handleCompleteOnboarding();
                        }
                      }}
                      type="button"
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-200 transition-colors"
                    >
                      <span>{t.nextStep}</span>
                      <ArrowRight className="size-3" />
                    </button>
                  ) : null}
                  <span className="text-purple-700 font-extrabold">
                    {Math.round(((safeStepIndex + 1) / ONBOARDING_QUESTIONS.length) * 100)}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden flex">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${((safeStepIndex + 1) / ONBOARDING_QUESTIONS.length) * 100}%`
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </div>
            </div>

            {/* AI Assistant Question Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-lg border border-purple-100 space-y-3">
              <div className="flex items-start gap-3">
                {/* Pulsating Voice Bot Emblem */}
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className={`size-11 sm:size-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-md ${
                      isAiSpeaking ? "ring-4 ring-purple-300 animate-pulse" : ""
                    }`}
                  >
                    <Sparkles className="size-5" />
                  </div>
                  {isAiSpeaking && (
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-600"></span>
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {t.voiceCopilot}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleOpenManualEdit}
                        type="button"
                        className="text-slate-600 hover:text-purple-700 p-1 rounded-lg hover:bg-purple-50 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                        title={t.editDetails}
                      >
                        <Edit3 className="size-3.5 text-purple-600" />
                        <span className="hidden xs:inline">{t.editDetails}</span>
                      </button>
                      <button
                        onClick={() =>
                          playAiVoice(
                            currentStep?.aiPromptText?.[language] || currentStep?.aiPromptText?.hi || currentStep?.aiPromptText?.en || ""
                          )
                        }
                        type="button"
                        className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50 cursor-pointer"
                        title={t.replayAudio}
                      >
                        <Volume2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* The Main Spoken Question */}
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 font-heading leading-snug">
                    {currentStep?.aiPromptText?.[language] || currentStep?.aiPromptText?.hi || currentStep?.aiPromptText?.en || ""}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {currentStep?.subtitle?.[language] || currentStep?.subtitle?.hi || currentStep?.subtitle?.en || ""} • {currentStep?.aiPromptText?.en || ""}
                  </p>
                </div>
              </div>

              {/* Relevance Feedback Banner (if evaluated) */}
              <AnimatePresence>
                {relevanceStatus === "irrelevant" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-xs text-amber-900"
                  >
                    <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold block">{t.irrelevantTitle}</span>
                      <span className="text-amber-800">{feedbackMessage}</span>
                    </div>
                  </motion.div>
                )}

                {relevanceStatus === "relevant" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-bold"
                  >
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>{feedbackMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Middle Section: Spoken Transcript & Live Passport Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
              {/* Spoken Live Transcript Box & Manual Typing Option */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Radio className={`size-3.5 ${isListening ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
                    <span>{isListening ? t.listening : t.yourResponse}</span>
                  </span>
                  
                  {/* Toggle inline text typing */}
                  <button
                    onClick={() => {
                      setIsInlineTyping(!isInlineTyping);
                      if (!isInlineTyping) {
                        setInlineTextInput(spokenTranscript || getStepExistingResponse(currentStepIndex) || "");
                      }
                    }}
                    type="button"
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-lg transition-colors"
                  >
                    <Pencil className="size-3" />
                    <span>{isInlineTyping ? t.cancelTyping : t.typeManually}</span>
                  </button>
                </div>

                {/* Inline Manual Typing Editor Box */}
                {isInlineTyping ? (
                  <div className="space-y-2 p-2.5 rounded-2xl bg-purple-50/50 border border-purple-200">
                    <textarea
                      value={inlineTextInput}
                      onChange={(e) => setInlineTextInput(e.target.value)}
                      placeholder={t.typePlaceholder}
                      rows={2}
                      className="w-full text-xs font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsInlineTyping(false)}
                        type="button"
                        className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={handleInlineTextSubmit}
                        type="button"
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="size-3" />
                        <span>{t.confirmAndAnalyze}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[64px] p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 flex items-center justify-between group">
                    {spokenTranscript || getStepExistingResponse(currentStepIndex) ? (
                      <div className="flex-1">
                        <p className="italic font-semibold text-slate-900">"{spokenTranscript || getStepExistingResponse(currentStepIndex)}"</p>
                      </div>
                    ) : (
                      <p className="text-slate-400">
                        {t.tapToSpeakOrSelect}
                      </p>
                    )}

                    {(spokenTranscript || getStepExistingResponse(currentStepIndex)) && (
                      <button
                        onClick={() => {
                          const val = spokenTranscript || getStepExistingResponse(currentStepIndex);
                          setInlineTextInput(val);
                          setIsInlineTyping(true);
                        }}
                        className="opacity-80 group-hover:opacity-100 p-1 text-purple-700 hover:bg-purple-50 rounded-lg cursor-pointer shrink-0 ml-2"
                        title={t.editDetails}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Quick Spoken Chips for 1-Tap Voice Simulation */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.quickExamples}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {(currentStep?.sampleChips || []).map((chip, idx) => {
                      const chipLabel = getChipLabel(chip, language);
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectSampleChip(chip)}
                          type="button"
                          className="text-left p-2 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/70 text-xs text-slate-800 font-semibold transition-all cursor-pointer flex items-center justify-between"
                        >
                          <span className="line-clamp-1">{chipLabel}</span>
                          <ChevronRight className="size-3.5 text-purple-600 shrink-0" />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Agentic Live Passport Card Preview - Progressively Built & Manually Editable */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-4.5 shadow-xl border border-purple-800/40 space-y-3.5">
                {/* Header & Mini Progress Bar */}
                <div className="space-y-2 border-b border-white/15 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-emerald-400" />
                      <span className="text-xs font-extrabold tracking-wide uppercase font-heading">
                        {t.passportTitle}
                      </span>
                    </div>
                    <Badge
                      variant="purple"
                      className={`text-[9px] font-bold px-2 py-0.5 transition-all ${
                        completedCount === 4
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                          : completedCount > 0
                          ? `bg-purple-500/30 text-purple-200 border-purple-400/40`
                          : "bg-slate-800/80 text-slate-400 border-slate-700"
                      }`}
                    >
                      {completedCount === 4
                        ? t.verified
                        : completedCount > 0
                        ? `${t.building} (${completedCount}/4)`
                        : t.awaitingInput}
                    </Badge>
                  </div>

                  {/* Micro Progress Bar inside Passport */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(completedCount / 4) * 100}%` }}
                      transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    />
                  </div>
                </div>

                {/* Progressively Extracted 4 Slots Matrix with Direct Edit Options */}
                <div className="space-y-2 text-xs">
                  {/* Slot 1: Name & Location (Step 1) */}
                  {isStep1Done ? (
                    <motion.div
                      key="slot-1-done"
                      initial={{ opacity: 0, y: 3, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      onClick={() => setCurrentStepIndex(0)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border shadow-xs group cursor-pointer transition-all ${
                        currentStepIndex === 0
                          ? "bg-purple-950/90 border-purple-400 ring-2 ring-purple-400/40"
                          : "bg-white/10 hover:bg-white/15 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="size-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
                          <User className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-purple-200 block font-medium">{t.slot1Title}</span>
                          <span className="font-extrabold text-white truncate block">
                            {cleanHumanName(profile.fullName)} {profile.district ? `(${formatLocation(profile.district, profile.state, language)})` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenManualEdit();
                          }}
                          className="opacity-70 hover:opacity-100 p-1 text-purple-200 hover:text-white bg-white/10 rounded-lg cursor-pointer transition-colors"
                          title={t.editDetails}
                        >
                          <Edit3 className="size-3" />
                        </button>
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      </div>
                    </motion.div>
                  ) : currentStepIndex === 0 ? (
                    <div className="flex items-center justify-between bg-purple-950/50 p-2.5 rounded-xl border border-purple-400/40 ring-1 ring-purple-400/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300 shrink-0 animate-pulse">
                          <User className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-purple-300 block font-bold">{t.slot1Title}</span>
                          <span className="text-xs font-semibold text-purple-100 italic truncate block">
                            {isListening
                              ? t.listening
                              : isEvaluating
                              ? "Analyzing..."
                              : t.tapToSpeakOrSelect}
                          </span>
                        </div>
                      </div>
                      <span className="size-2 rounded-full bg-purple-400 animate-ping shrink-0" />
                    </div>
                  ) : (
                    <div
                      onClick={() => setCurrentStepIndex(0)}
                      className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.07] p-2.5 rounded-xl border border-dashed border-white/10 opacity-60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                          <User className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block">{t.slot1Title}</span>
                          <span className="text-xs font-medium text-slate-400 truncate block">
                            Step 1 (Pending)
                          </span>
                        </div>
                      </div>
                      <Lock className="size-3.5 text-slate-500 shrink-0" />
                    </div>
                  )}

                  {/* Slot 2: NSQF Skill Alignment (Step 2) */}
                  {isStep2Done ? (
                    <motion.div
                      key="slot-2-done"
                      initial={{ opacity: 0, y: 3, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      onClick={() => setCurrentStepIndex(1)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border shadow-xs group cursor-pointer transition-all ${
                        currentStepIndex === 1
                          ? "bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/40"
                          : "bg-white/10 hover:bg-white/15 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="size-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                          <Wrench className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-amber-200 block font-medium">{t.slot2Title}</span>
                          <span className="font-extrabold text-white truncate block">
                            {formatNsqfCourse(profile.nsqfCourse || profile.skills[0], language)} {profile.nsqfCode ? `(${profile.nsqfCode})` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenManualEdit();
                          }}
                          className="opacity-70 hover:opacity-100 p-1 text-amber-200 hover:text-white bg-white/10 rounded-lg cursor-pointer transition-colors"
                          title={t.editDetails}
                        >
                          <Edit3 className="size-3" />
                        </button>
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      </div>
                    </motion.div>
                  ) : currentStepIndex === 1 ? (
                    <div className="flex items-center justify-between bg-amber-950/40 p-2.5 rounded-xl border border-amber-400/40 ring-1 ring-amber-400/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 animate-pulse">
                          <Wrench className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-amber-300 block font-bold">{t.slot2Title}</span>
                          <span className="text-xs font-semibold text-amber-100 italic truncate block">
                            {isListening
                              ? t.listening
                              : isEvaluating
                              ? "Matching NSQF..."
                              : t.tapToSpeakOrSelect}
                          </span>
                        </div>
                      </div>
                      <span className="size-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                    </div>
                  ) : (
                    <div
                      onClick={() => setCurrentStepIndex(1)}
                      className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.07] p-2.5 rounded-xl border border-dashed border-white/10 opacity-60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                          <Wrench className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block">{t.slot2Title}</span>
                          <span className="text-xs font-medium text-slate-400 truncate block">
                            Step 2 (Pending)
                          </span>
                        </div>
                      </div>
                      <Lock className="size-3.5 text-slate-500 shrink-0" />
                    </div>
                  )}

                  {/* Slot 3: Qualification (Step 3) */}
                  {isStep3Done ? (
                    <motion.div
                      key="slot-3-done"
                      initial={{ opacity: 0, y: 3, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      onClick={() => setCurrentStepIndex(2)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border shadow-xs group cursor-pointer transition-all ${
                        currentStepIndex === 2
                          ? "bg-blue-950/90 border-blue-400 ring-2 ring-blue-400/40"
                          : "bg-white/10 hover:bg-white/15 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="size-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
                          <GraduationCap className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-blue-200 block font-medium">{t.slot3Title}</span>
                          <span className="font-extrabold text-white truncate block">
                            {formatEducation(profile.education, language)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenManualEdit();
                          }}
                          className="opacity-70 hover:opacity-100 p-1 text-blue-200 hover:text-white bg-white/10 rounded-lg cursor-pointer transition-colors"
                          title={t.editDetails}
                        >
                          <Edit3 className="size-3" />
                        </button>
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      </div>
                    </motion.div>
                  ) : currentStepIndex === 2 ? (
                    <div className="flex items-center justify-between bg-blue-950/40 p-2.5 rounded-xl border border-blue-400/40 ring-1 ring-blue-400/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0 animate-pulse">
                          <GraduationCap className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-blue-300 block font-bold">{t.slot3Title}</span>
                          <span className="text-xs font-semibold text-blue-100 italic truncate block">
                            {isListening
                              ? t.listening
                              : isEvaluating
                              ? "Recording Qualification..."
                              : t.tapToSpeakOrSelect}
                          </span>
                        </div>
                      </div>
                      <span className="size-2 rounded-full bg-blue-400 animate-ping shrink-0" />
                    </div>
                  ) : (
                    <div
                      onClick={() => setCurrentStepIndex(2)}
                      className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.07] p-2.5 rounded-xl border border-dashed border-white/10 opacity-60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                          <GraduationCap className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block">{t.slot3Title}</span>
                          <span className="text-xs font-medium text-slate-400 truncate block">
                            Step 3 (Pending)
                          </span>
                        </div>
                      </div>
                      <Lock className="size-3.5 text-slate-500 shrink-0" />
                    </div>
                  )}

                  {/* Slot 4: PM-AJAY Capital Support (Step 4) */}
                  {isStep4Done ? (
                    <motion.div
                      key="slot-4-done"
                      initial={{ opacity: 0, y: 3, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      onClick={() => setCurrentStepIndex(3)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border shadow-xs group cursor-pointer transition-all ${
                        currentStepIndex === 3
                          ? "bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/40"
                          : "bg-white/10 hover:bg-white/15 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="size-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                          <Briefcase className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-emerald-200 block font-medium">{t.slot4Title}</span>
                          <span className="font-extrabold text-white truncate block">
                            {formatGrantSupport(profile.grantEligibility || profile.aspiration, language)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenManualEdit();
                          }}
                          className="opacity-70 hover:opacity-100 p-1 text-emerald-200 hover:text-white bg-white/10 rounded-lg cursor-pointer transition-colors"
                          title={t.editDetails}
                        >
                          <Edit3 className="size-3" />
                        </button>
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      </div>
                    </motion.div>
                  ) : currentStepIndex === 3 ? (
                    <div className="flex items-center justify-between bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-400/40 ring-1 ring-emerald-400/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 animate-pulse">
                          <Briefcase className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-emerald-300 block font-bold">{t.slot4Title}</span>
                          <span className="text-xs font-semibold text-emerald-100 italic truncate block">
                            {isListening
                              ? t.listening
                              : isEvaluating
                              ? "Matching Grant..."
                              : t.tapToSpeakOrSelect}
                          </span>
                        </div>
                      </div>
                      <span className="size-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    </div>
                  ) : (
                    <div
                      onClick={() => setCurrentStepIndex(3)}
                      className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.07] p-2.5 rounded-xl border border-dashed border-white/10 opacity-60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                          <Briefcase className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block">{t.slot4Title}</span>
                          <span className="text-xs font-medium text-slate-400 truncate block">
                            Step 4 (Pending)
                          </span>
                        </div>
                      </div>
                      <Lock className="size-3.5 text-slate-500 shrink-0" />
                    </div>
                  )}
                </div>

                {/* Bottom Passport Actions: Complete Button (if verified) & Edit All Fields */}
                {completedCount >= 4 ? (
                  <div className="space-y-2 pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCompleteOnboarding()}
                      type="button"
                      className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40 ring-2 ring-emerald-400/30 transition-all"
                    >
                      <Sparkles className="size-4 text-emerald-200" />
                      <span>{t.completeAndIssuePassport}</span>
                      <ArrowRight className="size-3.5" />
                    </motion.button>

                    <button
                      onClick={handleOpenManualEdit}
                      type="button"
                      className="w-full text-center py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 hover:text-white text-[11px] font-bold border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="size-3 text-purple-300" />
                      <span>{t.editAllFields}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleOpenManualEdit}
                    type="button"
                    className="w-full text-center py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-purple-200 hover:text-white text-[11px] font-bold border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="size-3 text-purple-300" />
                    <span>{t.editAllFields}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Giant Microphone Action Center */}
            <div className="w-full flex flex-col items-center justify-center pt-2 pb-1 space-y-2">
              <div className="relative">
                {isListening && (
                  <div className="absolute -inset-4 rounded-full bg-purple-600/30 animate-ping" />
                )}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={toggleListening}
                  type="button"
                  aria-label={t.tapMicToSpeak}
                  className={`size-16 sm:size-18 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-rose-600 scale-105"
                      : "bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC]"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="size-8 animate-pulse" />
                  ) : (
                    <Mic className="size-8" />
                  )}
                </motion.button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-slate-800">
                  {isListening ? t.listeningSpeakNow : t.tapMicToSpeak}
                </span>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setIsInlineTyping(true)}
                  type="button"
                  className="text-xs font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Pencil className="size-3" />
                  <span>{t.typeManually}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* COMPLETION CELEBRATION & ISSUED PASSPORT VIEW (FULLY TRANSLATED)          */
          /* ========================================================================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-4"
          >
            <div className="size-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="size-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                {t.celebrationBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {t.congratulations(cleanHumanName(profile.fullName))}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                {t.celebrationSubtitle}
              </p>
            </div>

            {/* Issued Livelihood Card */}
            <div className="w-full max-w-md bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 shadow-2xl border border-purple-500/40 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
                <div>
                  <span className="text-base font-extrabold block font-heading">{cleanHumanName(profile.fullName)}</span>
                  <span className="text-[10px] text-purple-200">
                    ID: PMAJAY-OR-SUN-2026-8941 • {formatLocation(profile.district, profile.state, language)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-300 block">{t.fitMatch}</span>
                  <span className="text-sm font-extrabold text-emerald-400">94%</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">{t.mappedSkill}</span>
                  <span className="font-extrabold text-white">{formatNsqfCourse(profile.nsqfCourse || profile.skills[0], language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">{t.nsqfLevel}</span>
                  <span className="font-bold text-purple-200">Level {profile.nsqfLevel || 4} ({profile.nsqfCode || "ELE/Q5901"})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">{t.grantSupport}</span>
                  <span className="font-extrabold text-emerald-400">{formatGrantSupport(profile.grantEligibility || profile.aspiration, language)}</span>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons: Enter Dashboard + Edit Details + Review Steps */}
            <div className="w-full max-w-md flex flex-col gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onComplete(profile)}
                type="button"
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white text-sm sm:text-base font-bold shadow-xl shadow-purple-600/35 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20"
              >
                <span>{t.enterDashboard}</span>
                <ArrowRight className="size-4.5" />
              </motion.button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleOpenManualEdit}
                  type="button"
                  className="h-10 rounded-2xl bg-white hover:bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="size-3.5 text-purple-600" />
                  <span>{t.editDetails}</span>
                </button>

                <button
                  onClick={handleReviewSteps}
                  type="button"
                  className="h-10 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="size-3.5 text-slate-500" />
                  <span>{t.reviewSteps}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MANUAL EDIT MODAL: Allows full review and manual editing of all 4 slots    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isManualEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center text-purple-200">
                    <Edit3 className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight font-heading">
                      {t.modalTitle}
                    </h3>
                    <p className="text-[11px] text-purple-200/80">
                      {t.modalSubtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsManualEditModalOpen(false)}
                  className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="size-3.5 text-purple-600" />
                    <span>{t.modalCandidateName}</span>
                  </label>
                  <input
                    type="text"
                    value={editableProfile.fullName}
                    onChange={(e) =>
                      setEditableProfile((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="e.g. Ramesh Soren / सावित्री देवी"
                    className="w-full text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* 2. Location (District & State) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-purple-600" />
                      <span>{t.modalDistrict}</span>
                    </label>
                    <input
                      type="text"
                      value={editableProfile.district}
                      onChange={(e) =>
                        setEditableProfile((prev) => ({ ...prev, district: e.target.value }))
                      }
                      placeholder="e.g. Sundargarh / Kalahandi"
                      className="w-full text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-purple-600" />
                      <span>{t.modalState}</span>
                    </label>
                    <input
                      type="text"
                      value={editableProfile.state}
                      onChange={(e) =>
                        setEditableProfile((prev) => ({ ...prev, state: e.target.value }))
                      }
                      placeholder="e.g. Odisha / Jharkhand"
                      className="w-full text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* 3. NSQF Skill / Trade */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Wrench className="size-3.5 text-amber-600" />
                    <span>{t.modalSkill}</span>
                  </label>
                  <input
                    type="text"
                    value={editableProfile.nsqfCourse}
                    onChange={(e) =>
                      setEditableProfile((prev) => ({ ...prev, nsqfCourse: e.target.value }))
                    }
                    placeholder="e.g. Solar PV Agri-Pump Specialist / Self Employed Tailor"
                    className="w-full text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* 4. Education Level */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-blue-600" />
                    <span>{t.modalEducation}</span>
                  </label>
                  <input
                    type="text"
                    value={editableProfile.education}
                    onChange={(e) =>
                      setEditableProfile((prev) => ({ ...prev, education: e.target.value }))
                    }
                    placeholder="e.g. 10th Standard (10वीं पास) / 8th Pass / ITI"
                    className="w-full text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* 5. PM-AJAY Grant / Livelihood Goal */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-emerald-600" />
                    <span>{t.modalGrant}</span>
                  </label>
                  <input
                    type="text"
                    value={editableProfile.grantEligibility}
                    onChange={(e) =>
                      setEditableProfile((prev) => ({
                        ...prev,
                        grantEligibility: e.target.value,
                        aspiration: e.target.value
                      }))
                    }
                    placeholder="e.g. ₹35,000 Capital Subsidy + ₹3,500/mo Stipend"
                    className="w-full text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  onClick={() => setIsManualEditModalOpen(false)}
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 cursor-pointer text-center"
                >
                  {t.cancel}
                </button>
                <div className="w-full sm:w-auto flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleSaveManualEdit(false)}
                    type="button"
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    title="Save edits without closing step process"
                  >
                    <span>{t.modalSave}</span>
                  </button>
                  <button
                    onClick={() => handleSaveManualEdit(true)}
                    type="button"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5 text-purple-200" />
                    <span>{t.modalSaveAndComplete}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
