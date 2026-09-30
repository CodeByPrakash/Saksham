"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Mic, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingProgressDots } from "./OnboardingProgressDots";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface SlideOneProps {
  onNext: () => void;
  onSkip: () => void;
  isNativeMobile?: boolean;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const SLIDE1_TRANSLATIONS: Record<
  string,
  {
    badge: string;
    subLogo: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    floatingChip: string;
    ctaButton: string;
  }
> = {
  hi: {
    badge: "पीएम-अजय योजना",
    subLogo: "हुनर आज • बेहतर कल",
    title: "आपकी आवाज़ से",
    titleHighlight: "उज्ज्वल भविष्य",
    subtitle: "पीएम-अजय के तहत आजीविका और कौशल मार्गदर्शन के लिए एआई वॉयस साथी।",
    floatingChip: "अपनी मातृभाषा में बोलें",
    ctaButton: "आगे बढ़ें (Get Started)"
  },
  or: {
    badge: "ପିଏମ-ଅଜୟ ଯୋଜନା",
    subLogo: "ଆଜିର ଦକ୍ଷତା • ଉଜ୍ଜ୍ୱଳ ଭବିଷ୍ୟତ",
    title: "ଆପଣଙ୍କ ସ୍ୱରରେ",
    titleHighlight: "ଉଜ୍ଜ୍ୱଳ ଭବିଷ୍ୟତ",
    subtitle: "ପିଏମ-ଅଜୟ ଅଧୀନରେ ଜୀବିକା ଏବଂ ଦକ୍ଷତା ମାର୍ଗଦର୍ଶନ ପାଇଁ ଏଆଇ ସହାୟକ।",
    floatingChip: "ନିଜ ମାତୃଭାଷାରେ ସହଜରେ କୁହନ୍ତୁ",
    ctaButton: "ଆରମ୍ଭ କରନ୍ତୁ (Get Started)"
  },
  sat: {
    badge: "PM-AJAY Scheme",
    subLogo: "Teheñak hunar • Gapaak bhalo",
    title: "Aamaga rod te",
    titleHighlight: "Marsal Din",
    subtitle: "PM-AJAY bhetor te rozgar r hunar laha lagid AI copilot.",
    floatingChip: "Apanag ror te rod me",
    ctaButton: "Lahaag me (Get Started)"
  },
  en: {
    badge: "PM-AJAY Initiative",
    subLogo: "Skills Today • Better Tomorrow",
    title: "Your Voice to a",
    titleHighlight: "Brighter Future",
    subtitle: "An AI-powered voice assistant for livelihood mapping and skill recommendations under PM-AJAY.",
    floatingChip: "Speak in your native language",
    ctaButton: "Get Started"
  },
  bho: {
    badge: "पीएम-अजय योजना",
    subLogo: "हुनर आज • बेहतर कल",
    title: "रउआ के आवाज से",
    titleHighlight: "उज्ज्वल भविष्य",
    subtitle: "पीएम-अजय योजना के तहत रोजगार आ हुनर खातिर एआई वॉयस साथी।",
    floatingChip: "आपन भोजपुरी में बोलीं",
    ctaButton: "आगे बढ़ीं (Get Started)"
  },
  bn: {
    badge: "পিএম-অজয় যোজনা",
    subLogo: "আজকের দক্ষতা • উজ্জ্বল ভবিষ্যৎ",
    title: "আপনার কণ্ঠে",
    titleHighlight: "উজ্জ্বল ভবিষ্যৎ",
    subtitle: "পিএম-অজয় প্রকল্পের অধীনে জীবিকা ও দক্ষতা নির্দেশিকার জন্য এআই সহকারী।",
    floatingChip: "আপনার মাতৃভাষায় কথা বলুন",
    ctaButton: "শুরু করুন (Get Started)"
  },
  te: {
    badge: "పీఎం-అజయ్ పథకం",
    subLogo: "నేటి నైపుణ్యం • రేపటి భవిష్యత్తు",
    title: "మీ స్వరంతో",
    titleHighlight: "ఉజ్వల భవిష్యత్తు",
    subtitle: "పీఎం-అజయ్ కింద జీవనోపాధి మరియు నైపుణ్య మార్గదర్శకత్వం కోసం ఏఐ సహచరుడు.",
    floatingChip: "మీ మాతృభాషలో మాట్లాడండి",
    ctaButton: "ప్రారంభించండి (Get Started)"
  },
  mr: {
    badge: "पीएम-अजय योजना",
    subLogo: "आजचे कौशल्य • उद्याचे भविष्य",
    title: "तुमच्या आवाजाने",
    titleHighlight: "उज्ज्वल भविष्य",
    subtitle: "पीएम-अजय अंतर्गत उपजीविका व कौशल्य मार्गदर्शनासाठी एआय व्हॉईस साथी.",
    floatingChip: "तुमच्या भाषेत सहज बोला",
    ctaButton: "पुढे चला (Get Started)"
  },
  ta: {
    badge: "பிஎம்-அஜய் திட்டம்",
    subLogo: "இன்றைய திறன் • நாளைய ஒளி",
    title: "உங்கள் குரலால்",
    titleHighlight: "ஒளிரும் எதிர்காலம்",
    subtitle: "பிஎம்-அஜய் கீழ் வாழ்வாதாரம் மற்றும் திறன் வழிகாட்டலுக்கான ஏஐ குரல் துணை.",
    floatingChip: "உங்கள் தாய்மொழியில் பேசுங்கள்",
    ctaButton: "தொடங்குங்கள் (Get Started)"
  },
  gu: {
    badge: "પીએમ-અજય યોજના",
    subLogo: "આજનું હુનર • કાલનું ભવિષ્ય",
    title: "તમારા અવાજથી",
    titleHighlight: "ઉજ્જવળ ભવિષ્ય",
    subtitle: "પીએમ-અજય હેઠળ આજીવિકા અને કૌશલ્ય માર્ગદર્શન માટે એઆઈ વોઈસ સાથી.",
    floatingChip: "તમારી માતૃભાષામાં બોલો",
    ctaButton: "શરૂ કરો (Get Started)"
  },
  pa: {
    badge: "ਪੀਐਮ-ਅਜੈ ਯੋਜਨਾ",
    subLogo: "ਅੱਜ ਦਾ ਹੁਨਰ • ਕੱਲ੍ਹ ਦਾ ਭਵਿੱਖ",
    title: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਨਾਲ",
    titleHighlight: "ਸੁਨਹਿਰੀ ਭਵਿੱਖ",
    subtitle: "ਪੀਐਮ-ਅਜੈ ਤਹਿਤ ਰੋਜ਼ਗਾਰ ਅਤੇ ਹੁਨਰ ਸਿਖਲਾਈ ਲਈ ਏਆਈ ਵੌਇਸ ਸਹਾਇਕ।",
    floatingChip: "ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਬੋਲੋ",
    ctaButton: "ਸ਼ੁਰੂ ਕਰੋ (Get Started)"
  },
  kn: {
    badge: "ಪಿಎಂ-ಅಜಯ್ ಯೋಜನೆ",
    subLogo: "ಇಂದಿನ ಕೌಶಲ್ಯ • ನಾಳೆಯ ಭವಿಷ್ಯ",
    title: "ನಿಮ್ಮ ಧ್ವನಿಯಿಂದ",
    titleHighlight: "ಉಜ್ವಲ ಭವಿಷ್ಯ",
    subtitle: "ಪಿಎಂ-ಅಜಯ್ ಅಡಿಯಲ್ಲಿ ಜೀವನೋಪಾಯ ಮತ್ತು ಕೌಶಲ್ಯ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ AI ಸಹಾಯಕ.",
    floatingChip: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ",
    ctaButton: "ಪ್ರಾರಂಭಿಸಿ (Get Started)"
  },
  as: {
    badge: "পিএম-অজয় যোজনা",
    subLogo: "আজিৰ দক্ষতা • উজ্জ্বল ভৱিষ্যত",
    title: "আপোনাৰ কণ্ঠেৰে",
    titleHighlight: "উজ্জ্বল ভৱিষ্যত",
    subtitle: "পিএম-অজয়ৰ অধীনত জীৱিকা আৰু দক্ষতা নিৰ্দেশনাৰ বাবে এআই সহায়ক।",
    floatingChip: "আপোনাৰ ভাষাত কওক",
    ctaButton: "আৰম্ভ কৰক (Get Started)"
  },
  ur: {
    badge: "پی ایم اجے یوجنا",
    subLogo: "آج کا ہنر • روشن کل",
    title: "آپ کی آواز سے",
    titleHighlight: "روشن مستقبل",
    subtitle: "پی ایم اجے کے تحت روزگار اور ہنر رہنمائی کے لیے اے آئی وائس ساتھی۔",
    floatingChip: "اپنی مادری زبان میں بولیں",
    ctaButton: "شروع کریں (Get Started)"
  }
};

export function SlideOne({
  onNext,
  onSkip,
  isNativeMobile = false,
  language = "hi",
  onLanguageChange
}: SlideOneProps) {
  const normLang = (language || "hi").toLowerCase();
  const t = SLIDE1_TRANSLATIONS[normLang] || SLIDE1_TRANSLATIONS.hi;
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioRequestIdRef = useRef<number>(0);

  const stopAudio = () => {
    audioRequestIdRef.current++;
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
      } catch { }
      audioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch { }
    }
  };

  const playVoicePrompt = async () => {
    stopAudio();
    const myReqId = ++audioRequestIdRef.current;
    const textToSpeak = `${t.title} ${t.titleHighlight}। ${t.subtitle}`;

    try {
      const cleanLang = (normLang || "hi").toLowerCase().split("-")[0].split("_")[0];
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak, language: cleanLang })
      });

      if (myReqId !== audioRequestIdRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (myReqId !== audioRequestIdRef.current) return;

        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audioPlayerRef.current = audio;
          audio.onended = () => {
            audioPlayerRef.current = null;
          };
          audio.onerror = () => {
            audioPlayerRef.current = null;
          };
          await audio.play();
          return;
        }
      }
    } catch { }

    if (myReqId === audioRequestIdRef.current && typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(textToSpeak);
        u.lang = normLang === "en" ? "en-IN" : "hi-IN";
        window.speechSynthesis.speak(u);
      } catch { }
    }
  };

  return (
    <div
      translate="no"
      className={`notranslate relative flex flex-col justify-between w-full mx-auto bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] overflow-hidden text-slate-900 select-none ${isNativeMobile
        ? "h-full max-h-[100dvh] px-5 pt-4 pb-0"
        : "h-full max-w-md rounded-[44px] shadow-2xl border-[8px] border-slate-900/10 px-5 pt-3 pb-0"
        }`}
    >
      {/* Background Ambient Cloud Puffs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-4 -left-6 w-40 h-20 bg-white/70 rounded-full blur-xl animate-float" />
        <div className="absolute top-16 -right-6 w-48 h-24 bg-white/60 rounded-full blur-2xl animate-float-delayed" />
      </div>

      {/* Top Header with Step Badge, Language Selector & Skip */}
      <div className="w-full flex items-center justify-between pt-1 pb-1 relative z-50 shrink-0">
        {!isNativeMobile ? (
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white/60 px-2.5 py-0.5 rounded-full">
            <span>9:41</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-800 border border-amber-100/80 shadow-2xs">
            <span className="size-1.5 rounded-full bg-purple-600 animate-pulse"></span>
            <span>{t.badge}</span>
          </div>
        )}

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

      {/* Brand Logo & Title Area */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        {/* Custom Saksham-AI Logo Emblem */}
        <div className="flex flex-col items-center mb-1">
          <div className="relative size-11 sm:size-12 mb-0.5">
            <Image
              src="/logo.png"
              alt="Saksham AI Logo"
              fill
              className="object-contain drop-shadow-sm"
              sizes="48px"
              priority
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-heading notranslate" translate="no">
              Saksham-AI
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5 notranslate" translate="no">
            {t.subLogo}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mt-0.5 font-heading drop-shadow-2xs notranslate" translate="no">
          {t.title}<br />
          <span className="text-purple-700 notranslate" translate="no">{t.titleHighlight}</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[290px] mt-1.5 notranslate" translate="no">
          {t.subtitle}
        </p>
      </div>

      {/* Hero Illustration with Layered Artwork and Character */}
      <div className="relative flex-1 min-h-0 w-full flex items-end justify-center overflow-visible my-1 z-10">
        {/* Village Backdrop Image with Soft Mist Blend */}
        <div className="absolute inset-0 top-1 overflow-hidden rounded-3xl opacity-95">
          <Image
            src={isNativeMobile ? "/landingPage/bg_1_landing_mob.webp" : "/landingPage/bg_1_landing.webp"}
            alt="Village backdrop"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            quality={90}
            className="object-cover object-bottom"
            priority
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRm4BAABXRUJQVlA4WAoAAAAQAAAADAAAEwAAQUxQSKYAAAAFgFvbtmpl7fvdUiLLqYAWSBlUQSWUQT2Enrm7O9wVPOghIiagBJG/K5RWm19FFvqDt/L9M7h7en79XJsaXD9cHfc3rm5PP6eT3u/P+8ctvfpZEiutj9Lplp+2gV8pSZVIFEJM0AggAUQikaaGfyUVggKINKtEGgZpRht8pZVg1RLWVvgqpg3Vurq8NG/vcu/q+vD867TOLU697a7fCKT90568fgQCVlA4IKIAAADwBACdASoNABQAPu1iqU2ppaOiMAgBMB2JbACdMoMYPYAQV4xB5VD5aMYSc0PAc0AA/OU9tZ19ps3FIH/eptTVyyTE6fh7MXJHznXu3lc9/2C0lskkwXr5p5hm2f3a9OEXzQmVnTE+EUaEM33ZSESw3pU7yAru3Ge0LFU2YKpy6GGlKOgBSboLnqfv3AkNXUQOV3vDNlrjmyf09IS7U2ZNAAA="
          />
          {/* Top Foggy Mist Cloud Blend */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/60 to-transparent" />
        </div>

        {/* 3D Character (Woman with smartphone) */}
        <div className="relative z-10 w-[240px] sm:w-[270px] h-[95%] max-h-[290px] mb-[-6px]">
          <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)]">
            <Image
              src={isNativeMobile ? "/landingPage/person_1_landing_mob.webp" : "/landingPage/person_1_landing.webp"}
              alt="Beneficiary speaking with voice assistant"
              fill
              sizes="(max-width: 768px) 270px, 300px"
              quality={90}
              className="object-contain object-bottom"
              priority
              loading="eager"
            />
          </div>
        </div>

        {/* Floating Voice Capability Pill */}
        <div className="absolute top-4 -right-1 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-purple-100/90 animate-bounce-subtle flex items-center gap-1.5">
          <Mic className="size-3.5 text-purple-600 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-800">
            {t.floatingChip}
          </span>
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="w-full flex flex-col items-center gap-3 pt-1 pb-4 z-20 shrink-0">
        {/* Progress Dots */}
        <OnboardingProgressDots currentStep={0} />


        {/* Primary CTA Button with Spring Physics */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={onNext}
          type="button"
          className="w-full h-13 text-base font-bold rounded-2xl bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20 active:scale-95"
        >
          <span>{t.ctaButton}</span>
          <ArrowRight className="size-5" />
        </motion.button>
      </div>
    </div>
  );
}
