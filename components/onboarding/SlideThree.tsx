"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Sprout,
  BarChart3,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Cloud
} from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingProgressDots } from "./OnboardingProgressDots";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface SlideThreeProps {
  onComplete: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onSelectPathway?: (type: string) => void;
  isNativeMobile?: boolean;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const SLIDE3_TRANSLATIONS: Record<
  string,
  {
    step: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    card1Title: string;
    card1Sub: string;
    card2Title: string;
    card2Sub: string;
    card3Title: string;
    card3Sub: string;
    badge1Top: string;
    badge1Bottom: string;
    badge2Top: string;
    badge2Bottom: string;
    badge3Top: string;
    badge3Bottom: string;
    ctaButton: string;
  }
> = {
  en: {
    step: "Step 3 of 3",
    title: "Get Personalized",
    titleHighlight: "Skill & Livelihood Paths",
    subtitle: "Receive NSQF-aligned training options, local job opportunities and self-employment ideas that match your goals.",
    card1Title: "Skill Training",
    card1Sub: "NSQF-aligned courses near you",
    card2Title: "Job Opportunities",
    card2Sub: "Local and regional openings",
    card3Title: "Self-Employment",
    card3Sub: "Enterprise ideas and scheme support",
    badge1Top: "Based on",
    badge1Bottom: "Your Profile",
    badge2Top: "Region-Specific",
    badge2Bottom: "Opportunities",
    badge3Top: "Trusted",
    badge3Bottom: "Government Schemes",
    ctaButton: "Get Started"
  },
  hi: {
    step: "चरण 3 / 3",
    title: "व्यक्तिगत कौशल व",
    titleHighlight: "आजीविका मार्गदर्शन",
    subtitle: "अपने लक्ष्यों के अनुसार कौशल प्रशिक्षण, स्थानीय रोजगार और स्वरोजगार के अवसर प्राप्त करें।",
    card1Title: "कौशल प्रशिक्षण",
    card1Sub: "आपके नजदीक NSQF प्रमाणित कोर्स",
    card2Title: "रोजगार अवसर",
    card2Sub: "स्थानीय व क्षेत्रीय नौकरियां",
    card3Title: "स्वरोजगार",
    card3Sub: "उद्यम विचार व सरकारी योजना सहायता",
    badge1Top: "आपकी प्रोफाइल",
    badge1Bottom: "के अनुसार",
    badge2Top: "क्षेत्रीय रोजगार",
    badge2Bottom: "के अवसर",
    badge3Top: "विश्वसनीय",
    badge3Bottom: "सरकारी योजनाएं",
    ctaButton: "आगे बढ़ें (Get Started)"
  },
  or: {
    step: "ପଦକ୍ଷେପ ୩ / ୩",
    title: "ବ୍ୟକ୍ତିଗତ ଦକ୍ଷତା ଓ",
    titleHighlight: "ଜୀବିକା ପଥ",
    subtitle: "ଆପଣଙ୍କ ଲକ୍ଷ୍ୟ ଅନୁଯାୟୀ ଦକ୍ଷତା ତାଲିମ, ସ୍ଥାନୀୟ ନିଯୁକ୍ତି ଏବଂ ସ୍ୱରୋଜଗାର ସୁଯୋଗ ପାଆନ୍ତୁ।",
    card1Title: "ଦକ୍ଷତା ତାଲିମ",
    card1Sub: "ଆପଣଙ୍କ ନିକଟରେ NSQF କୋର୍ସ",
    card2Title: "ନିଯୁକ୍ତି ସୁଯୋଗ",
    card2Sub: "ସ୍ଥାନୀୟ ଓ ଆଞ୍ଚଳିକ ନିଯୁକ୍ତି",
    card3Title: "ସ୍ୱରୋଜଗାର",
    card3Sub: "ବ୍ୟବସାୟ ଓ ସରକାରୀ ଯୋଜନା ସହାୟତା",
    badge1Top: "ପ୍ରୋଫାଇଲ୍",
    badge1Bottom: "ଅନୁଯାୟୀ",
    badge2Top: "ଆଞ୍ଚଳିକ",
    badge2Bottom: "ସୁଯୋଗ",
    badge3Top: "ବିଶ୍ୱାସଯୋଗ୍ୟ",
    badge3Bottom: "ସରକାରୀ ଯୋଜନା",
    ctaButton: "ଆରମ୍ଭ କରନ୍ତୁ (Get Started)"
  },
  sat: {
    step: "Step 3 of 3",
    title: "Apanak Hunar r",
    titleHighlight: "Rozgar Hor",
    subtitle: "Apanaga asha lekate training, kami r saman goro sorkar pahada khon nam me.",
    card1Title: "Hunar Training",
    card1Sub: "NSQF certified training",
    card2Title: "Kami Sujog",
    card2Sub: "Ato r shahar kami",
    card3Title: "Apanak Dukan",
    card3Sub: "Dukan saman r goro",
    badge1Top: "Aamaga",
    badge1Bottom: "Profile Lekate",
    badge2Top: "Zila",
    badge2Bottom: "Sujog",
    badge3Top: "Sorkar",
    badge3Bottom: "Scheme",
    ctaButton: "Lahaag me (Get Started)"
  },
  bho: {
    step: "चरण 3 / 3",
    title: "व्यक्तिगत हुनर आ",
    titleHighlight: "आजीविका के रास्ता",
    subtitle: "आपन लक्ष्य अनुसार कौशल प्रशिक्षण, स्थानीय नौकरी आ स्वरोजगार सहायता पाईं।",
    card1Title: "हुनर प्रशिक्षण",
    card1Sub: "नजदीक के NSQF कोर्स",
    card2Title: "रोजगार अवसर",
    card2Sub: "स्थानीय व जिला स्तर के काम",
    card3Title: "स्वरोजगार",
    card3Sub: "दुकान खातिर योजना सहायता",
    badge1Top: "रउआ प्रोफाइल",
    badge1Bottom: "के अनुसार",
    badge2Top: "स्थानीय",
    badge2Bottom: "रोजगार अवसर",
    badge3Top: "भरोसेमंद",
    badge3Bottom: "सरकारी योजना",
    ctaButton: "आगे बढ़ीं (Get Started)"
  },
  bn: {
    step: "ধাপ ৩ / ৩",
    title: "ব্যক্তিগত দক্ষতা ও",
    titleHighlight: "জীবিকা নির্দেশিকা",
    subtitle: "আপনার লক্ষ্য অনুযায়ী দক্ষতা প্রশিক্ষণ, স্থানীয় চাকরির সুযোগ এবং স্বনির্ভরতার সহায়তা পান।",
    card1Title: "দক্ষতা প্রশিক্ষণ",
    card1Sub: "কাছাকাছি NSQF কোর্স",
    card2Title: "চাকরির সুযোগ",
    card2Sub: "স্থানীয় ও আঞ্চলিক নিয়োগ",
    card3Title: "স্বনির্ভরতা",
    card3Sub: "উদ্যোগ ধারণা ও সরকারি সহায়তা",
    badge1Top: "আপনার প্রোফাইল",
    badge1Bottom: "অনুযায়ী",
    badge2Top: "আঞ্চলিক",
    badge2Bottom: "সুযোগ",
    badge3Top: "নির্ভরযোগ্য",
    badge3Bottom: "সরকারি প্রকল্প",
    ctaButton: "শুরু করুন (Get Started)"
  },
  te: {
    step: "దశ 3 / 3",
    title: "వ్యక్తిగత నైపుణ్యం మరియు",
    titleHighlight: "జీవనోపాధి మార్గాలు",
    subtitle: "మీ లక్ష్యాలకు సరిపోయే నైపుణ్య శిక్షణ, స్థానిక ఉపాధి మరియు స్వయం ఉపాధి అవకాశాలను పొందండి.",
    card1Title: "నైపుణ్య శిక్షణ",
    card1Sub: "మీ సమీపంలో NSQF కోర్సులు",
    card2Title: "ఉద్యోగ అవకాశాలు",
    card2Sub: "స్థానిక మరియు ప్రాంతీయ ఉద్యోగాలు",
    card3Title: "స్వయం ఉపాధి",
    card3Sub: "వ్యాపార ఆలోచనలు & పథకాల మద్దతు",
    badge1Top: "మీ ప్రొఫైల్",
    badge1Bottom: "ఆధారంగా",
    badge2Top: "ప్రాంతీయ",
    badge2Bottom: "అవకాశాలు",
    badge3Top: "విశ్వసనీయ",
    badge3Bottom: "ప్రభుత్వ పథకాలు",
    ctaButton: "ప్రారంభించండి (Get Started)"
  },
  mr: {
    step: "टप्पा ३ / ३",
    title: "वैयक्तिक कौशल्य व",
    titleHighlight: "उपजीविका मार्ग",
    subtitle: "तुमच्या उद्दिष्टांनुसार कौशल्य प्रशिक्षण, स्थानिक नोकऱ्या आणि स्वयंरोजगार संधी मिळवा.",
    card1Title: "कौशल्य प्रशिक्षण",
    card1Sub: "जवळचे NSQF प्रमाणित कोर्सेस",
    card2Title: "नोकरीच्या संधी",
    card2Sub: "स्थानिक व प्रादेशिक नोकऱ्या",
    card3Title: "स्वयंरोजगार",
    card3Sub: "व्यवसाय कल्पना व योजना मदत",
    badge1Top: "तुमच्या प्रोफाईल",
    badge1Bottom: "नुसार",
    badge2Top: "प्रादेशिक",
    badge2Bottom: "संधी",
    badge3Top: "विश्वासार्ह",
    badge3Bottom: "सरकारी योजना",
    ctaButton: "पुढे चला (Get Started)"
  },
  ta: {
    step: "படி 3 / 3",
    title: "தனிப்பயனாக்கப்பட்ட",
    titleHighlight: "வாழ்வாதார பாதைகள்",
    subtitle: "உங்கள் இலக்குகளுக்கு ஏற்ற திறன் பயிற்சி, உள்ளூர் வேலை வாய்ப்புகள் மற்றும் சுயதொழில் யோசனைகளைப் பெறுங்கள்.",
    card1Title: "திறன் பயிற்சி",
    card1Sub: "அருகிலுள்ள NSQF படிப்புகள்",
    card2Title: "வேலை வாய்ப்புகள்",
    card2Sub: "உள்ளூர் வேலை வாய்ப்புகள்",
    card3Title: "சுயதொழில்",
    card3Sub: "தொழில் யோசனைகள் & உதவி",
    badge1Top: "உங்கள் சுயவிவரத்தின்",
    badge1Bottom: "அடிப்படையில்",
    badge2Top: "பிராந்திய",
    badge2Bottom: "வாய்ப்புகள்",
    badge3Top: "நம்பகமான",
    badge3Bottom: "அரசு திட்டங்கள்",
    ctaButton: "தொடங்கவும் (Get Started)"
  },
  gu: {
    step: "પગલું 3 / 3",
    title: "વ્યક્તિગત કૌશલ્ય અને",
    titleHighlight: "આજીવિકા માર્ગ",
    subtitle: "તમારા લક્ષ્યો અનુસાર કૌશલ્ય તાલીમ, સ્થાનિક નોકરીઓ અને સ્વરોજગાર સહાય મેળવો.",
    card1Title: "કૌશલ્ય તાલીમ",
    card1Sub: "નજીકના NSQF કોર્સ",
    card2Title: "નોકરીની તકો",
    card2Sub: "સ્થાનિક અને પ્રાદેશિક ભરતી",
    card3Title: "સ્વરોજગાર",
    card3Sub: "વ્યવસાય વિચાર અને યોજના સહાય",
    badge1Top: "તમારી પ્રોફાઇલ",
    badge1Bottom: "આધારિત",
    badge2Top: "પ્રાદેશિક",
    badge2Bottom: "તકો",
    badge3Top: "વિશ્વસનીય",
    badge3Bottom: "સરકારી યોજનાઓ",
    ctaButton: "શરૂ કરો (Get Started)"
  },
  pa: {
    step: "ਕਦਮ 3 / 3",
    title: "ਨਿੱਜੀ ਹੁਨਰ ਅਤੇ",
    titleHighlight: "ਰੋਜ਼ੀ-ਰੋਟੀ ਦੇ ਰਾਹ",
    subtitle: "ਆਪਣੇ ਟੀਚਿਆਂ ਅਨੁਸਾਰ ਹੁਨਰ ਸਿਖਲਾਈ, ਸਥਾਨਕ ਨੌਕਰੀਆਂ ਅਤੇ ਸਵੈ-ਰੋਜ਼ਗਾਰ ਮੌਕੇ ਪ੍ਰਾਪਤ ਕਰੋ।",
    card1Title: "ਹੁਨਰ ਸਿਖਲਾਈ",
    card1Sub: "ਨੇੜਲੇ NSQF ਕੋਰਸ",
    card2Title: "ਨੌਕਰੀ ਦੇ ਮੌਕੇ",
    card2Sub: "ਸਥਾਨਕ ਅਤੇ ਖੇਤਰੀ ਨੌਕਰੀਆਂ",
    card3Title: "ਸਵੈ-ਰੋਜ਼ਗਾਰ",
    card3Sub: "ਕਾਰੋਬਾਰੀ ਵਿਚਾਰ ਅਤੇ ਸਹਾਇਤਾ",
    badge1Top: "ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ",
    badge1Bottom: "ਅਧਾਰਿਤ",
    badge2Top: "ਖੇਤਰੀ",
    badge2Bottom: "ਮੌਕੇ",
    badge3Top: "ਭਰੋਸੇਯੋਗ",
    badge3Bottom: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    ctaButton: "ਸ਼ੁਰੂ ਕਰੋ (Get Started)"
  },
  kn: {
    step: "ಹಂತ 3 / 3",
    title: "ವೈಯಕ್ತಿಕ ಕೌಶಲ್ಯ ಮತ್ತು",
    titleHighlight: "ಜೀವನೋಪಾಯ ಮಾರ್ಗಗಳು",
    subtitle: "ನಿಮ್ಮ ಗುರಿಗಳಿಗೆ ಸರಿಹೊಂದುವ ಕೌಶಲ್ಯ ತರಬೇತಿ, ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಮತ್ತು ಸ್ವಯಂ ಉದ್ಯೋಗ ಅವಕಾಶಗಳನ್ನು ಪಡೆಯಿರಿ.",
    card1Title: "ಕೌಶಲ್ಯ ತರಬೇತಿ",
    card1Sub: "ಹತ್ತಿರದ NSQF ಕೋರ್ಸ್‌ಗಳು",
    card2Title: "ಉದ್ಯೋಗಾವಕಾಶಗಳು",
    card2Sub: "ಸ್ಥಳೀಯ ಉದ್ಯೋಗಾವಕಾಶಗಳು",
    card3Title: "ಸ್ವಯಂ ಉದ್ಯೋಗ",
    card3Sub: "ವ್ಯವಹಾರ ಕಲ್ಪನೆಗಳು & ನೆರವು",
    badge1Top: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್",
    badge1Bottom: "ಆಧರಿಸಿ",
    badge2Top: "ಪ್ರಾದೇಶಿಕ",
    badge2Bottom: "ಅವಕಾಶಗಳು",
    badge3Top: "ವಿಶ್ವಾಸಾರ್ಹ",
    badge3Bottom: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    ctaButton: "ಪ್ರಾರಂಭಿಸಿ (Get Started)"
  },
  as: {
    step: "পদক্ষেপ ৩ / ৩",
    title: "ব্যক্তিগত দক্ষতা আৰু",
    titleHighlight: "জীৱিকা পথ",
    subtitle: "আপোনাৰ লক্ষ্য অনুসৰি দক্ষতা প্ৰশিক্ষণ, স্থানীয় নিয়োগ আৰু স্বনিয়োজন সুযোগ লাভ কৰক।",
    card1Title: "দক্ষতা প্ৰশিক্ষণ",
    card1Sub: "ওচৰৰ NSQF পাঠ্যক্ৰম",
    card2Title: "নিয়োগৰ সুযোগ",
    card2Sub: "স্থানীয় আৰু আঞ্চলিক নিয়োগ",
    card3Title: "স্বনিয়োজন",
    card3Sub: "ব্যৱসায়িক ধাৰণা আৰু সাহায্য",
    badge1Top: "আপোনাৰ প্ৰ'ফাইল",
    badge1Bottom: "অনুসৰি",
    badge2Top: "আঞ্চলিক",
    badge2Bottom: "সুযোগ",
    badge3Top: "নিৰ্ভৰযোগ্য",
    badge3Bottom: "চৰকাৰী আঁচনি",
    ctaButton: "আৰম্ভ কৰক (Get Started)"
  },
  ur: {
    step: "مرحلہ 3 / 3",
    title: "ذاتی ہنر اور",
    titleHighlight: "روزگار کی راہیں",
    subtitle: "اپنے اہداف کے مطابق ہنر کی تربیت، مقامی ملازمتوں اور خود روزگار کے مواقع حاصل کریں۔",
    card1Title: "ہنر تربیت",
    card1Sub: "قریبی این ایس کیو ایف کورسز",
    card2Title: "ملازمت کے مواقع",
    card2Sub: "مقامی اور علاقائی نوکریاں",
    card3Title: "خود روزگار",
    card3Sub: "کاروباری آئیڈیاز اور اسکیم امداد",
    badge1Top: "آپ کے پروفائل",
    badge1Bottom: "کے مطابق",
    badge2Top: "علاقائی",
    badge2Bottom: "مواقع",
    badge3Top: "قابل اعتماد",
    badge3Bottom: "سرکاری اسکیمیں",
    ctaButton: "شروع کریں (Get Started)"
  }
};

export function SlideThree({
  onComplete,
  onPrev,
  onSkip,
  onSelectPathway,
  isNativeMobile = false,
  language = "hi",
  onLanguageChange
}: SlideThreeProps) {
  const normLang = (language || "hi").toLowerCase();
  const t = SLIDE3_TRANSLATIONS[normLang] || SLIDE3_TRANSLATIONS.hi;

  return (
    <div
      translate="no"
      className={`notranslate relative flex flex-col justify-between w-full mx-auto bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] overflow-hidden text-slate-900 select-none ${
        isNativeMobile
          ? "h-full max-h-[100dvh] px-5 pt-4 pb-0"
          : "h-full max-w-md rounded-[44px] shadow-2xl border-[8px] border-slate-900/10 px-5 pt-3 pb-0"
      }`}
    >
      {/* Background Village Canvas with Foggy Clouds Blend */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={isNativeMobile ? "/landingPage/bg_3_landing_mob.webp" : "/landingPage/bg_3_landing.webp"}
          alt="Village scenic background"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          quality={90}
          className="object-cover object-center opacity-70"
          priority
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAACQBACdASoLABQAPu1iqU2ppaOiMAgBMB2JbACdMoGvVARQx9UCwTMjHq+fbgAA/pUEITCCuAocKbT2yHaXI0LbllVNJA4fuPY5TDjAg+Z30/YquenNOzrxo8raeDH6Ceebnm9ab9dn5ar67YomPM2BVezgqqo+IMrO9/kcg3vIBU+zbO57PDhsl3XdeIAAAAA="
        />

        {/* Top Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/90 to-transparent backdrop-blur-[1px]" />

        {/* Bottom Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/95 to-transparent backdrop-blur-[1.5px]" />

        {/* Soft Dreamy Ambient Cloud Glows */}
        <div className="absolute top-8 -left-8 w-44 h-20 bg-white/80 rounded-full blur-xl animate-float" />
        <div className="absolute top-20 -right-8 w-52 h-24 bg-white/75 rounded-full blur-2xl animate-float-delayed" />
      </div>

      {/* Top Header with Step Badge, Language Selector & Skip */}
      <div className="w-full flex items-center justify-between pt-1 pb-1 relative z-50 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full shadow-2xs border border-amber-100/80">
          <Cloud className="size-3 text-purple-600" />
          <span>{t.step}</span>
        </div>

        <div className="flex items-center gap-2 relative z-50">
          <LanguageSelector variant="icon" currentLanguage={normLang} onLanguageChange={onLanguageChange} />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            type="button"
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2.5 py-1 bg-white/60 backdrop-blur-sm rounded-lg"
          >
            Skip
          </motion.button>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading drop-shadow-2xs">
          {t.title}<br />
          <span className="text-purple-700">{t.titleHighlight}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[320px] mt-1.5">
          {t.subtitle}
        </p>
      </div>

      {/* Center 3D Scene: person_3_landing on Left, 3 Pathway Opportunity Cards on Right */}
      <div className="relative flex-1 min-h-0 w-full flex items-end justify-center overflow-visible z-10 my-1">
        <div className="relative w-full h-full max-h-[380px] min-h-[260px] flex items-end justify-between">
          {/* 1. Left: Young Beneficiary Character (person_3_landing) looking upward */}
          <div className="absolute left-[-16px] sm:left-[-10px] bottom-[-6px] sm:bottom-[-2px] w-[52%] sm:w-[48%] h-[98%] sm:h-full z-10 pointer-events-none">
            <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)]">
              <Image
                src={isNativeMobile ? "/landingPage/person_3_landing_mob.webp" : "/landingPage/person_3_landing.webp"}
                alt="Beneficiary looking at livelihood opportunities"
                fill
                sizes="(max-width: 768px) 55vw, 260px"
                quality={90}
                className="object-contain object-bottom drop-shadow-2xl"
                priority
                loading="eager"
              />
            </div>
          </div>

          {/* 2. Right: 3 Pathway Cards Stack (Skill Training, Job Opportunities, Self-Employment) */}
          <div className="absolute right-0 top-1 bottom-2 w-[55%] sm:w-[54%] flex flex-col justify-between gap-2 z-20">
            {/* Card 1: Skill Training */}
            <motion.div
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => onSelectPathway?.("skill_training")}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-md shadow-slate-900/5 border border-amber-100/90 cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* 3D Blue Cap Emblem */}
                <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 shrink-0">
                  <GraduationCap className="size-5 text-white drop-shadow-xs" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                    {t.card1Title}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 sm:line-clamp-2">
                    {t.card1Sub}
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.div>

            {/* Card 2: Job Opportunities */}
            <motion.div
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => onSelectPathway?.("job_opportunities")}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-md shadow-slate-900/5 border border-amber-100/90 cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* 3D Orange Briefcase Emblem */}
                <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30 shrink-0">
                  <Briefcase className="size-5 text-white drop-shadow-xs" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                    {t.card2Title}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 sm:line-clamp-2">
                    {t.card2Sub}
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.div>

            {/* Card 3: Self-Employment */}
            <motion.div
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => onSelectPathway?.("self_employment")}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-md shadow-slate-900/5 border border-amber-100/90 cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* 3D Green Sprout Emblem */}
                <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30 shrink-0">
                  <Sprout className="size-5 text-white drop-shadow-xs" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                    {t.card3Title}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 sm:line-clamp-2">
                    {t.card3Sub}
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Rounded White Card Container matching reference image */}
      <div className="w-[calc(100%+40px)] -mx-5 bg-white rounded-t-[36px] sm:rounded-t-[40px] shadow-[0_-10px_35px_rgba(0,0,0,0.06)] border-t border-slate-100/90 pt-4 pb-4 px-6 sm:px-7 flex flex-col gap-3.5 z-20 shrink-0">
        {/* Top: 3 Feature/Trust Badges Bar with subtle vertical dividers */}
        <div className="grid grid-cols-3 gap-1 text-center w-full">
          {/* Badge 1 */}
          <div className="flex flex-col items-center gap-1">
            <div className="size-9 rounded-full bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shadow-2xs">
              <BarChart3 className="size-4.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
              {t.badge1Top}<br />{t.badge1Bottom}
            </span>
          </div>

          {/* Badge 2 with Left & Right Dividers */}
          <div className="flex flex-col items-center gap-1 border-x border-slate-100">
            <div className="size-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shadow-2xs">
              <MapPin className="size-4.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
              {t.badge2Top}<br />{t.badge2Bottom}
            </span>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center gap-1">
            <div className="size-9 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="size-4.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
              {t.badge3Top}<br />{t.badge3Bottom}
            </span>
          </div>
        </div>

        {/* Bottom Row: Circular Back, 3-Dot Indicator (Step 3 Active), & Get Started CTA */}
        <div className="w-full flex items-center justify-between pt-0.5">
          {/* Left: Circular Back Button with Tap Spring */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            onClick={onPrev}
            aria-label="Previous slide"
            className="size-12 sm:size-12.5 rounded-full bg-white shadow-md shadow-slate-200/70 border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-50 cursor-pointer shrink-0"
          >
            <ChevronLeft className="size-5.5 text-slate-800 stroke-[2.4]" />
          </motion.button>

          {/* Center: 3-Dot Progress Indicator with Framer Motion Layout Animation */}
          <OnboardingProgressDots currentStep={2} />

          {/* Right: Get Started Final Pill Button with Tap Spring */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            onClick={onComplete}
            className="h-12 sm:h-12.5 px-6 sm:px-7 rounded-full bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white text-[15px] sm:text-base font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20 shrink-0"
          >
            <span>{t.ctaButton}</span>
            <ArrowRight className="size-4.5 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
