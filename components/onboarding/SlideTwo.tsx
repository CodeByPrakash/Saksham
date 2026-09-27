"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ArrowRight, GraduationCap, Briefcase, MapPin, Heart, Cloud, Mic, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingProgressDots } from "./OnboardingProgressDots";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface SlideTwoProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isNativeMobile?: boolean;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const SLIDE2_TRANSLATIONS: Record<
  string,
  {
    step: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    speechBubble: string;
    aiBadge: string;
    aiTitle: string;
    tag1: string;
    tag2: string;
    ctaButton: string;
  }
> = {
  hi: {
    step: "चरण 2 / 3",
    title: "अपना हुनर व",
    titleHighlight: "दैनिक अनुभव बताएं",
    subtitle: "अपनी भाषा में बोलकर बताएं। कोई फॉर्म नहीं, कोई टाइपिंग नहीं। बस सहजता से बात करें।",
    speechBubble: "खेती करता हूँ और मोटर-पंप भी ठीक कर लेता हूँ...",
    aiBadge: "एआई एनएसक्यूएफ मैपिंग",
    aiTitle: "पहचाने गए हुनर (Skills Detected)",
    tag1: "पंप रिपेयर (Pump Diagnostics)",
    tag2: "मोटर वायरिंग (ELE/Q5901)",
    ctaButton: "अगला कदम (Next Step)"
  },
  or: {
    step: "ପଦକ୍ଷେପ ୨ / ୩",
    title: "ନିଜ ଦକ୍ଷତା ଓ",
    titleHighlight: "ଅଭିଜ୍ଞତା ବିଷୟରେ କୁହନ୍ତୁ",
    subtitle: "ନିଜ ଭାଷାରେ ସରଳ ସ୍ୱରରେ କଥା ହୁଅନ୍ତୁ। କୌଣସି ଫର୍ମ ନାହିଁ, କୌଣସି ଟାଇପିଂ ନାହିଁ।",
    speechBubble: "ମୁଁ ଚାଷ କରେ ଏବଂ ମୋଟର-ପମ୍ପ ମରାମତି ମଧ୍ୟ ଜାଣିଛି...",
    aiBadge: "ଏଆଇ NSQF ମ୍ୟାପିଂ",
    aiTitle: "ଚିହ୍ନଟ ହୋଇଥିବା ଦକ୍ଷତା",
    tag1: "ପମ୍ପ ମରାମତି (Pump Repair)",
    tag2: "ମୋଟର ୱାୟାରିଂ (ELE/Q5901)",
    ctaButton: "ଆଗକୁ ବଢ଼ନ୍ତୁ (Next Step)"
  },
  sat: {
    step: "Step 2 of 3",
    title: "Apanak hunar r",
    titleHighlight: "Kami katha rod me",
    subtitle: "Apanak ror te rod me. Cet form baanu. Khali ror me.",
    speechBubble: "Khet kam sangte motor-pump ho thik dadiaya...",
    aiBadge: "AI NSQF Mapping",
    aiTitle: "Namakan Hunar (Skills)",
    tag1: "Pump Repair (NSQF L3)",
    tag2: "Motor Wiring (ELE/Q5901)",
    ctaButton: "Lahaag me (Next Step)"
  },
  en: {
    step: "Step 2 of 3",
    title: "Tell Us About",
    titleHighlight: "Your Skills & Interests",
    subtitle: "Have a simple voice conversation in your language. No forms. No typing. Just speak naturally.",
    speechBubble: "I do farming and pump motor maintenance...",
    aiBadge: "AI NSQF Ontologist",
    aiTitle: "Skills Detected",
    tag1: "Pump Diagnostics (NSQF L3)",
    tag2: "Motor Wiring (ELE/Q5901)",
    ctaButton: "Next Step"
  },
  bho: {
    step: "चरण 2 / 3",
    title: "आपन हुनर आ",
    titleHighlight: "दैनिक काम बताईं",
    subtitle: "आपन भोजपुरी में बोलीं। कवनो फॉर्म ना, कवनो टाइपिंग ना।",
    speechBubble: "खेती करीं ला आ मोटर-पंप भी बना लेवेनी...",
    aiBadge: "एआई एनएसक्यूएफ मैपिंग",
    aiTitle: "पहचानल गइल हुनर",
    tag1: "पंप रिपेयर (Pump Diagnostics)",
    tag2: "मोटर वायरिंग (ELE/Q5901)",
    ctaButton: "आगे बढ़ीं (Next Step)"
  },
  bn: {
    step: "ধাপ ২ / ৩",
    title: "আপনার দক্ষতা ও",
    titleHighlight: "অভিজ্ঞতা জানান",
    subtitle: "আপনার মাতৃভাষায় কথা বলুন। কোনো ফর্ম নেই, কোনো টাইপিং নেই।",
    speechBubble: "চাষাবাদ করি এবং মোটর-পাম্প মেরামত করতে পারি...",
    aiBadge: "এআই এনএসকিউএফ ম্যাপিং",
    aiTitle: "শনাক্তকৃত দক্ষতা",
    tag1: "পাম্প মেরামত (Pump Diagnostics)",
    tag2: "মোটর ওয়্যারিং (ELE/Q5901)",
    ctaButton: "পরবর্তী ধাপ (Next Step)"
  },
  te: {
    step: "దశ 2 / 3",
    title: "మీ నైపుణ్యాలు మరియు",
    titleHighlight: "అనుభవం తెలపండి",
    subtitle: "మీ భాషలో సులభంగా మాట్లాడండి. ఫారమ్‌లు లేవు. టైపింగ్ లేదు.",
    speechBubble: "వ్యవసాయం మరియు మోటార్ పంప్ మరమ్మతులు చేస్తాను...",
    aiBadge: "ఏఐ NSQF మ్యాపింగ్",
    aiTitle: "గుర్తించిన నైపుణ్యాలు",
    tag1: "పంప్ రిపేర్ (Pump Diagnostics)",
    tag2: "మోటార్ వైరింగ్ (ELE/Q5901)",
    ctaButton: "తదుపరి దశ (Next Step)"
  },
  mr: {
    step: "टप्पा २ / ३",
    title: "तुमचे कौशल्य व",
    titleHighlight: "अनुभव सांगा",
    subtitle: "तुमच्या भाषेत बोलून सांगा. कोणतेही फॉर्म नाही. फक्त सहज बोला.",
    speechBubble: "शेती करतो आणि मोटर-पंप दुरुस्ती करतो...",
    aiBadge: "एआय एनएसक्यूएफ मॅपिंग",
    aiTitle: "ओळखलेली कौशल्ये",
    tag1: "पंप दुरुस्ती (Pump Diagnostics)",
    tag2: "मोटर वायरिंग (ELE/Q5901)",
    ctaButton: "पुढील टप्पा (Next Step)"
  },
  ta: {
    step: "படி 2 / 3",
    title: "உங்கள் திறமை மற்றும்",
    titleHighlight: "அனுபவத்தைக் கூறுங்கள்",
    subtitle: "உங்கள் தாய்மொழியில் எளிதாகப் பேசுங்கள். படிவங்கள் தேவையில்லை.",
    speechBubble: "விவசாயம் செய்கிறேன், மோட்டார்-பம்ப் பழுதுபார்க்கவும் தெரியும்...",
    aiBadge: "ஏஐ NSQF மேப்பிங்",
    aiTitle: "கண்டறியப்பட்ட திறன்கள்",
    tag1: "பம்ப் பழுது (Pump Repair)",
    tag2: "மோட்டார் வயரிங் (ELE/Q5901)",
    ctaButton: "அடுத்த படி (Next Step)"
  },
  gu: {
    step: "પગલું 2 / 3",
    title: "તમારું હુનર અને",
    titleHighlight: "અનુભવ જણાવો",
    subtitle: "તમારી ભાષામાં બોલીને જણાવો. કોઈ ફોર્મ કે ટાઈપિંગની જરૂર નથી.",
    speechBubble: "ખેતી કરું છું અને મોટર-પંપ રિપેરિંગ પણ આવડે છે...",
    aiBadge: "એઆઈ NSQF મેપિંગ",
    aiTitle: "ઓળખાયેલા હુનર",
    tag1: "પંપ રિપેર (Pump Repair)",
    tag2: "મોટર વાયરિંગ (ELE/Q5901)",
    ctaButton: "આગળ વધો (Next Step)"
  },
  pa: {
    step: "ਕਦਮ 2 / 3",
    title: "ਆਪਣਾ ਹੁਨਰ ਅਤੇ",
    titleHighlight: "ਕੰਮ ਦਾ ਤਜਰਬਾ ਦੱਸੋ",
    subtitle: "ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਬੋਲੋ। ਕੋਈ ਫਾਰਮ ਜਾਂ ਟਾਈਪਿੰਗ ਨਹੀਂ।",
    speechBubble: "ਖੇਤੀ ਕਰਦਾ ਹਾਂ ਅਤੇ ਮੋਟਰ-ਪੰਪ ਠੀਕ ਕਰਨਾ ਵੀ ਜਾਣਦਾ ਹਾਂ...",
    aiBadge: "ਏਆਈ NSQF ਮੈਪਿੰਗ",
    aiTitle: "ਪਛਾਣੇ ਗਏ ਹੁਨਰ",
    tag1: "ਪੰਪ ਮੁਰੰਮਤ (Pump Repair)",
    tag2: "ਮੋਟਰ ਵਾਇਰਿੰਗ (ELE/Q5901)",
    ctaButton: "ਅਗਲਾ ਕਦਮ (Next Step)"
  },
  kn: {
    step: "ಹಂತ 2 / 3",
    title: "ನಿಮ್ಮ ಕೌಶಲ್ಯ ಮತ್ತು",
    titleHighlight: "ಅನುಭವ ತಿಳಿಸಿ",
    subtitle: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ. ಯಾವುದೇ ಫಾರ್ಮ್ ಇಲ್ಲ, ಟೈಪಿಂಗ್ ಇಲ್ಲ.",
    speechBubble: "ಕೃಷಿ ಮಾಡುತ್ತೇನೆ ಮತ್ತು ಮೋಟಾರ್ ಪಂಪ್ ರಿಪೇರಿ ಗೊತ್ತು...",
    aiBadge: "AI NSQF ಮ್ಯಾಪಿಂಗ್",
    aiTitle: "ಗುರುತಿಸಲಾದ ಕೌಶಲ್ಯಗಳು",
    tag1: "ಪಂಪ್ ರಿಪೇರಿ (Pump Repair)",
    tag2: "ಮೋಟಾರ್ ವೈರಿಂಗ್ (ELE/Q5901)",
    ctaButton: "ಮುಂದಿನ ಹಂತ (Next Step)"
  },
  as: {
    step: "পদক্ষেপ ২ / ৩",
    title: "আপোনাৰ দক্ষতা আৰু",
    titleHighlight: "অভিজ্ঞতা জনাওক",
    subtitle: "আপোনাৰ ভাষাত কওক। কোনো ফৰ্ম নাই, কোনো টাইপিং নাই।",
    speechBubble: "খেতি কৰোঁ আৰু মটৰ-পাম্প মেৰামতিও জানো...",
    aiBadge: "এআই NSQF মেপিং",
    aiTitle: "চিনাক্ত কৰা দক্ষতা",
    tag1: "পাম্প মেৰামতি (Pump Repair)",
    tag2: "মটৰ ৱায়াৰিং (ELE/Q5901)",
    ctaButton: "পৰৱৰ্তী পদক্ষেপ (Next Step)"
  },
  ur: {
    step: "مرحلہ 2 / 3",
    title: "اپنا ہنر اور",
    titleHighlight: "کام کا تجربہ بتائیں",
    subtitle: "اپنی زبان میں بولیں۔ کوئی فارم نہیں، کوئی ٹائپنگ نہیں۔",
    speechBubble: "کھیتی کرتا ہوں اور موٹر پمپ ٹھیک کرنا بھی جانتا ہوں...",
    aiBadge: "اے آئی این ایس کیو ایف",
    aiTitle: "پہچانے گئے ہنر",
    tag1: "پمپ مرمت (Pump Repair)",
    tag2: "موٹر وائرنگ (ELE/Q5901)",
    ctaButton: "اگلا قدم (Next Step)"
  }
};

export function SlideTwo({
  onNext,
  onPrev,
  onSkip,
  isNativeMobile = false,
  language = "hi",
  onLanguageChange
}: SlideTwoProps) {
  const normLang = (language || "hi").toLowerCase();
  const t = SLIDE2_TRANSLATIONS[normLang] || SLIDE2_TRANSLATIONS.hi;

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
          src={isNativeMobile ? "/landingPage/bg_2_landing_mob.webp" : "/landingPage/bg_2_landing.webp"}
          alt="Village landscape backdrop"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          quality={90}
          className="object-cover object-center opacity-70"
          priority
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAABwBACdASoNABQAPu1iqU2ppaOiMAgBMB2JbACdMoR4PoM4ABOBVsGgqsh8gAD+AT7ABDA7zf/79ViluKjKReuzWetWk0pG+rtn4XwJ6mpZkcoo3aoBaBbWSMbrkBQ3lE5KKpo8F8mrOfzXtO93GkBckPyUm2dhUjP9c/dyBMlkqOB4dtGr/Hw7XhXNQJGAAAA="
        />

        {/* Top Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/90 to-transparent backdrop-blur-[1.5px]" />

        {/* Bottom Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/95 to-transparent backdrop-blur-[2px]" />

        {/* Soft Dreamy Ambient Cloud Glows */}
        <div className="absolute top-8 -left-8 w-44 h-20 bg-white/80 rounded-full blur-xl animate-float" />
        <div className="absolute top-20 -right-8 w-52 h-24 bg-white/75 rounded-full blur-2xl animate-float-delayed" />
        <div className="absolute bottom-16 left-1/4 w-48 h-16 bg-white/70 rounded-full blur-xl animate-pulse-glow" />
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


      {/* Title & Copy */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading drop-shadow-2xs">
          {t.title}<br />
          <span className="text-purple-700">{t.titleHighlight}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[310px] mt-1.5">
          {t.subtitle}
        </p>
      </div>

      {/* Center 3D Scene */}
      <div className="relative flex-1 min-h-0 w-full flex items-end justify-center overflow-visible z-10 mb-[-6px]">
        <div className="relative w-full h-full max-h-[420px] min-h-[280px] flex items-end justify-center">
          {/* Person holding smartphone */}
          <div className="absolute left-[-14px] sm:left-[-6px] bottom-[-6px] sm:bottom-[-2px] w-[62%] sm:w-[58%] h-[96%] sm:h-[98%] z-10">
            <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)]">
              <Image
                src={isNativeMobile ? "/landingPage/person_2_landing_mob.webp" : "/landingPage/person_2_landing.webp"}
                alt="Person holding smartphone"
                fill
                sizes="(max-width: 768px) 65vw, 320px"
                quality={90}
                className="object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Speech bubble from person */}
          <div className="absolute top-[28%] left-[2%] sm:left-[6%] z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-purple-100 max-w-[170px] animate-fade-in-up">
            <p className="text-[10px] font-bold text-slate-800 leading-tight">
              "{t.speechBubble}"
            </p>
          </div>

          {/* AI Bot Center Right */}
          <div className="absolute right-[-10px] sm:right-[4px] bottom-[8%] sm:bottom-[10%] w-[52%] sm:w-[48%] h-[68%] sm:h-[72%] z-20 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={isNativeMobile ? "/landingPage/ai_2_landing_mob.webp" : "/landingPage/ai_2_landing.webp"}
                alt="AI Copilot Assistant"
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                quality={90}
                className="object-contain drop-shadow-2xl animate-float-delayed"
                priority
              />
            </div>
          </div>

          {/* Extracted Skills Card Overlay */}
          <div className="absolute right-[2px] sm:right-[10px] top-[14%] z-30 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-2xl border border-purple-100/90 w-[185px] sm:w-[200px] space-y-1.5 animate-scale-in">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                {t.aiBadge}
              </span>
              <Sparkles className="size-3 text-amber-500" />
            </div>

            <p className="text-[11px] font-extrabold text-slate-900 leading-snug">
              {t.aiTitle}
            </p>

            <div className="flex flex-wrap gap-1">
              <span className="text-[9px] font-semibold bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded-md border border-purple-200">
                {t.tag1}
              </span>
              <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
                {t.tag2}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="w-full flex flex-col items-center gap-3 pt-1 pb-4 z-20 shrink-0">
        <OnboardingProgressDots currentStep={1} />


        {/* Buttons Row with Back and Next */}
        <div className="w-full flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrev}
            type="button"
            className="size-13 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200/90 shadow-md flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
          >
            <ChevronLeft className="size-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onNext}
            type="button"
            className="flex-1 h-13 text-base font-bold rounded-2xl bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20 active:scale-95"
          >
            <span>{t.ctaButton}</span>
            <ArrowRight className="size-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
