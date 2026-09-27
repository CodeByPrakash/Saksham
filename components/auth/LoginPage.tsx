"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Volume2,
  CheckCircle2,
  Lock,
  UserCheck,
  Building2,
  Users,
  Mic,
  MicOff,
  KeyRound,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Radio,
  Sparkle,
  MessageSquare,
  VolumeX,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface LoginPageProps {
  onLoginSuccess: (role: "beneficiary" | "field_worker" | "government") => void;
  onBackToOnboarding?: () => void;
  isMobile?: boolean;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const LOGIN_TRANSLATIONS: Record<
  string,
  {
    subLogo: string;
    welcome: string;
    subtitle: string;
    speakToLogin: string;
    speakSub: string;
    tapHereGuide: string;
    listenGuideBtn: string;
    roleLabel: string;
    beneficiary: string;
    fieldWorker: string;
    govAdmin: string;
    mobileLabel: string;
    mobileSub: string;
    sendOtpBtn: string;
    enterOtpLabel: string;
    resendVoiceOtp: string;
    loginBtn: string;
    fastDemoLabel: string;
    listeningTitle: string;
    tapToSpeakModal: string;
    speakingPrompt: string;
  }
> = {
  hi: {
    subLogo: "हुनर आज • बेहतर कल",
    welcome: "साक्षम में आपका स्वागत है",
    subtitle: "आजीविका पासपोर्ट और योजनाओं तक पहुंचने के लिए बोलकर या मोबाइल नंबर से लॉगिन करें।",
    speakToLogin: "बोलकर लॉगिन करें",
    speakSub: "100% बिना लिखे • बस माइक दबाकर बोलें",
    tapHereGuide: "माइक दबाकर अपना मोबाइल नंबर बोलें",
    listenGuideBtn: "आवाज़ निर्देश सुनें",
    roleLabel: "अपनी भूमिका चुनें:",
    beneficiary: "लाभार्थी",
    fieldWorker: "प्रेरक साथी",
    govAdmin: "जिला प्रशासन",
    mobileLabel: "मोबाइल नंबर",
    mobileSub: "10-अंकों का नंबर",
    sendOtpBtn: "ओटीपी भेजें (Send OTP)",
    enterOtpLabel: "4-अंकों का सत्यापन कोड दर्ज करें",
    resendVoiceOtp: "बोलकर ओटीपी सुनें",
    loginBtn: "लॉगिन करें (Verify & Login)",
    fastDemoLabel: "त्वरित परीक्षण (Demo One-Tap Login):",
    listeningTitle: "सुन रहे हैं... (Listening)",
    tapToSpeakModal: "बोलने के लिए माइक दबाएं",
    speakingPrompt: "कृपया अपना 10 अंकों का मोबाइल नंबर बोलें"
  },
  or: {
    subLogo: "ଆଜିର ଦକ୍ଷତା • ଉଜ୍ଜ୍ୱଳ ଭବିଷ୍ୟତ",
    welcome: "ସାକ୍ଷମକୁ ସ୍ୱାଗତ",
    subtitle: "ଜୀବିକା ପାସପୋର୍ଟ ଏବଂ ସରକାରୀ ଯୋଜନା ପାଇଁ କହିକି କିମ୍ବା ମୋବାଇଲ୍ ନମ୍ବରରେ ଲଗଇନ୍ କରନ୍ତୁ।",
    speakToLogin: "କହିକି ଲଗଇନ୍ କରନ୍ତୁ",
    speakSub: "100% ବିନା ଲେଖାରେ • କେବଳ କୁହନ୍ତୁ",
    tapHereGuide: "ମାଇକ୍ ଦବାଇ ମୋବାଇଲ୍ ନମ୍ବର କୁହନ୍ତୁ",
    listenGuideBtn: "ସ୍ୱର ନିର୍ଦ୍ଦେଶ ଶୁଣନ୍ତୁ",
    roleLabel: "ଆପଣଙ୍କ ଭୂମିକା ବାଛନ୍ତୁ:",
    beneficiary: "ହିତାଧିକାରୀ",
    fieldWorker: "ପ୍ରେରକ ସାଥୀ",
    govAdmin: "ଜିଲ୍ଲା ପ୍ରଶାସନ",
    mobileLabel: "ମୋବାଇଲ୍ ନମ୍ବର",
    mobileSub: "10-ଅଙ୍କ ବିଶିଷ୍ଟ",
    sendOtpBtn: "ଓଟିପି ପଠାନ୍ତୁ (Send OTP)",
    enterOtpLabel: "4-ଅଙ୍କ ବିଶିଷ୍ଟ କୋଡ୍ ଦର୍ଜ କରନ୍ତୁ",
    resendVoiceOtp: "କହିକି ଓଟିପି ଶୁଣନ୍ତୁ",
    loginBtn: "ଲଗଇନ୍ କରନ୍ତୁ (Verify & Login)",
    fastDemoLabel: "ଗୋଟିଏ ଟ୍ୟାପରେ ଡେମୋ ଲଗଇନ୍:",
    listeningTitle: "ଶୁଣୁଛୁ... (Listening)",
    tapToSpeakModal: "କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ",
    speakingPrompt: "ଦୟାକରି ଆପଣଙ୍କର 10 ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍ ନମ୍ବର କୁହନ୍ତୁ"
  },
  sat: {
    subLogo: "Teheñak hunar • Gapaak bhalo",
    welcome: "Saksham-AI re Sagun Daram",
    subtitle: "Apanag rozgar passport lagid rod kate se mobile number te login me.",
    speakToLogin: "Rod kate Login me",
    speakSub: "100% binu ol te • Khali mic dabaw me",
    tapHereGuide: "Nondhe mic dabaw kate rod me",
    listenGuideBtn: "Voice anjum me",
    roleLabel: "Apanak role bachaw me:",
    beneficiary: "Beneficiary",
    fieldWorker: "Prerak Copilot",
    govAdmin: "District Admin",
    mobileLabel: "Mobile Number",
    mobileSub: "10-digit number",
    sendOtpBtn: "OTP kul me (Send OTP)",
    enterOtpLabel: "4-digit OTP code",
    resendVoiceOtp: "Rod kate anjum me",
    loginBtn: "Login me (Verify & Login)",
    fastDemoLabel: "Demo Login:",
    listeningTitle: "Anjum eda le... (Listening)",
    tapToSpeakModal: "Rod lagid mic dabaw me",
    speakingPrompt: "10 digit mobile number rod me"
  },
  en: {
    subLogo: "Skills Today • Better Tomorrow",
    welcome: "Welcome to Saksham-AI",
    subtitle: "Sign in with voice or mobile number to access your livelihood passport and opportunities.",
    speakToLogin: "Speak to Login",
    speakSub: "100% Voice-First • No Typing Needed",
    tapHereGuide: "TAP HERE & SPEAK YOUR MOBILE NUMBER",
    listenGuideBtn: "Listen Voice Guide",
    roleLabel: "Select Your Role:",
    beneficiary: "Beneficiary",
    fieldWorker: "Field Worker",
    govAdmin: "District DSC",
    mobileLabel: "Mobile Number",
    mobileSub: "10-digit number",
    sendOtpBtn: "Send OTP",
    enterOtpLabel: "Enter 4-Digit Verification Code",
    resendVoiceOtp: "Listen to OTP via Voice",
    loginBtn: "Verify & Proceed to Dashboard",
    fastDemoLabel: "Quick Demo Profiles (One-Tap Login):",
    listeningTitle: "Listening...",
    tapToSpeakModal: "Tap microphone to speak",
    speakingPrompt: "Please speak your 10-digit mobile number"
  },
  bho: {
    subLogo: "हुनर आज • बेहतर कल",
    welcome: "साक्षम में रउआ के स्वागत बा",
    subtitle: "आपन रोजगार पासपोर्ट खातिर बोल के चाहे मोबाइल नंबर से लॉगिन करीं।",
    speakToLogin: "बोल के लॉगिन करीं",
    speakSub: "100% बिना लिखले • खाली बोल के",
    tapHereGuide: "इहाँ माइक दबा के आपन मोबाइल नंबर बोलीं",
    listenGuideBtn: "आवाज़ निर्देश सुनीं",
    roleLabel: "आपन भूमिका चुनीं:",
    beneficiary: "लाभार्थी",
    fieldWorker: "प्रेरक साथी",
    govAdmin: "जिला प्रशासन",
    mobileLabel: "मोबाइल नंबर",
    mobileSub: "10-अंक के नंबर",
    sendOtpBtn: "ओटीपी भेजीं (Send OTP)",
    enterOtpLabel: "4-अंक के कोड डालीं",
    resendVoiceOtp: "बोल के ओटीपी सुनीं",
    loginBtn: "लॉगिन करीं (Verify & Login)",
    fastDemoLabel: "तुरंत डेमो लॉगिन:",
    listeningTitle: "सुनत बानी... (Listening)",
    tapToSpeakModal: "बोले खातिर माइक दबाईं",
    speakingPrompt: "आपन 10 अंक के मोबाइल नंबर बोलीं"
  },
  bn: {
    subLogo: "আজকের দক্ষতা • উজ্জ্বল ভবিষ্যৎ",
    welcome: "সক্ষম-এ স্বাগতম",
    subtitle: "জীবিকা পাসপোর্ট অ্যাক্সেস করতে কথা বলে বা মোবাইল নম্বর দিয়ে লগইন করুন।",
    speakToLogin: "কথা বলে লগইন করুন",
    speakSub: "১০০% টাইপিং ছাড়া • শুধু মুখে বলুন",
    tapHereGuide: "এখানে মাইক চেপে আপনার নম্বর বলুন",
    listenGuideBtn: "নির্দেশিকা শুনুন",
    roleLabel: "আপনার ভূমিকা নির্বাচন করুন:",
    beneficiary: "উপভোক্তা",
    fieldWorker: "সহায়ক কর্মী",
    govAdmin: "জেলা প্রশাসন",
    mobileLabel: "মোবাইল নম্বর",
    mobileSub: "১০-সংখ্যার নম্বর",
    sendOtpBtn: "ওটিপি পাঠান (Send OTP)",
    enterOtpLabel: "৪-সংখ্যার যাচাইকরণ কোড লিখুন",
    resendVoiceOtp: "ওটিপি শুনুন",
    loginBtn: "লগইন করুন (Verify & Login)",
    fastDemoLabel: "এক ক্লিকে ডেমো লগইন:",
    listeningTitle: "শুনছি... (Listening)",
    tapToSpeakModal: "কথা বলতে মাইক চাপুন",
    speakingPrompt: "দয়া করে আপনার ১০ সংখ্যার মোবাইল নম্বর বলুন"
  },
  te: {
    subLogo: "నేటి నైపుణ్యం • రేపటి భవిష్యత్తు",
    welcome: "సాక్షమ్‌కు స్వాగతం",
    subtitle: "జీవనోపాధి పాస్‌పోర్ట్ కోసం మాట్లాడి లేదా మొబైల్ నంబర్‌తో లాగిన్ అవ్వండి.",
    speakToLogin: "మాట్లాడి లాగిన్ అవ్వండి",
    speakSub: "100% టైపింగ్ లేకుండా • కేవలం మాట్లాడండి",
    tapHereGuide: "ఇక్కడ మైక్ నొక్కి మొబైల్ నంబర్ చెప్పండి",
    listenGuideBtn: "ధ్వని సూచనలు వినండి",
    roleLabel: "మీ పాత్రను ఎంచుకోండి:",
    beneficiary: "లబ్ధిదారుడు",
    fieldWorker: "క్షేత్ర కార్యకర్త",
    govAdmin: "జిల్లా అధికారి",
    mobileLabel: "మొబైల్ నంబర్",
    mobileSub: "10-అంకెల నంబర్",
    sendOtpBtn: "ఓటీపీ పంపండి (Send OTP)",
    enterOtpLabel: "4-అంకెల కోడ్‌ను నమోదు చేయండి",
    resendVoiceOtp: "ఓటీపీ వినండి",
    loginBtn: "లాగిన్ అవ్వండి (Verify & Login)",
    fastDemoLabel: "వన్-ట్యాప్ డెమో లాగిన్:",
    listeningTitle: "వింటున్నాము... (Listening)",
    tapToSpeakModal: "మాట్లాడటానికి మైక్ నొక్కండి",
    speakingPrompt: "దయచేసి మీ 10 అంకెల మొబైల్ నంబర్ చెప్పండి"
  },
  mr: {
    subLogo: "आजचे कौशल्य • उद्याचे भविष्य",
    welcome: "साक्षम मध्ये आपले स्वागत आहे",
    subtitle: "उपजीविका पासपोर्टसाठी बोलून किंवा मोबाईल नंबरने लॉगिन करा.",
    speakToLogin: "बोलून लॉगिन करा",
    speakSub: "१००% न लिहिता • फक्त बोलून लॉगिन करा",
    tapHereGuide: "येथे माइक दाबून आपला नंबर सांगा",
    listenGuideBtn: "आवाज सूचना ऐका",
    roleLabel: "आपली भूमिका निवडा:",
    beneficiary: "लाभार्थी",
    fieldWorker: "प्रेरक साथी",
    govAdmin: "जिल्हा प्रशासन",
    mobileLabel: "मोबाईल नंबर",
    mobileSub: "१०-अंकी नंबर",
    sendOtpBtn: "ओटीपी पाठवा (Send OTP)",
    enterOtpLabel: "४-अंकी कोड टाका",
    resendVoiceOtp: "ओटीपी ऐका",
    loginBtn: "लॉगिन करा (Verify & Login)",
    fastDemoLabel: "झटपट डेमो लॉगिन:",
    listeningTitle: "ऐकत आहोत... (Listening)",
    tapToSpeakModal: "बोलण्यासाठी माइक दाबा",
    speakingPrompt: "कृपया आपला १० अंकी मोबाईल नंबर सांगा"
  },
  ta: {
    subLogo: "இன்றைய திறன் • நாளைய ஒளி",
    welcome: "சக்ஷம்-க்கு நல்வரவு",
    subtitle: "வாழ்வாதார பாஸ்போர்ட்டை அணுக குரல் அல்லது மொபைல் எண் மூலம் உள்நுழையவும்.",
    speakToLogin: "பேசி உள்நுழையவும்",
    speakSub: "100% தட்டச்சு இல்லாமல் • பேசி நுழையுங்கள்",
    tapHereGuide: "இங்கே மைக் அழுத்தி உங்கள் எண்ணைக் கூறுங்கள்",
    listenGuideBtn: "குரல் வழிகாட்டல்",
    roleLabel: "உங்கள் பங்கைத் தேர்வுசெய்யவும்:",
    beneficiary: "பயனாளி",
    fieldWorker: "களப்பணியாளர்",
    govAdmin: "மாவட்ட நிர்வாகம்",
    mobileLabel: "கைபேசி எண்",
    mobileSub: "10-இலக்க எண்",
    sendOtpBtn: "OTP அனுப்புக",
    enterOtpLabel: "4-இலக்க சரிபார்ப்புக் குறியீடு",
    resendVoiceOtp: "OTP குரல்வழியாக கேட்க",
    loginBtn: "சரிபார்த்து உள்நுழையவும்",
    fastDemoLabel: "ஒரு கிளிக் டெமோ உள்நுழைவு:",
    listeningTitle: "கேட்கிறது... (Listening)",
    tapToSpeakModal: "பேச மைக் அழுத்தவும்",
    speakingPrompt: "உங்கள் 10 இலக்க மொபைல் எண்ணைக் கூறுங்கள்"
  },
  gu: {
    subLogo: "આજનું હુનર • કાલનું ભવિષ્ય",
    welcome: "સાક્ષમમાં આપનું સ્વાગત છે",
    subtitle: "આજીવિકા પાસપોર્ટ માટે બોલીને અથવા મોબાઇલ નંબરથી લૉગિન કરો.",
    speakToLogin: "બોલીને લૉગિન કરો",
    speakSub: "100% લખ્યા વગર • ફક્ત બોલો",
    tapHereGuide: "અહીં માઇક દબાવીને મોબાઇલ નંબર બોલો",
    listenGuideBtn: "અવાજ સૂચના સાંભળો",
    roleLabel: "તમારી ભૂમિકા પસંદ કરો:",
    beneficiary: "લાભાર્થી",
    fieldWorker: "પ્રેરક સાથી",
    govAdmin: "જિલ્લા પ્રશાસન",
    mobileLabel: "મોબાઇલ નંબર",
    mobileSub: "10-અંકનો નંબર",
    sendOtpBtn: "ઓટીપી મોકલો (Send OTP)",
    enterOtpLabel: "4-અંકનો કોડ દાખલ કરો",
    resendVoiceOtp: "ઓટીપી સાંભળો",
    loginBtn: "લૉગિન કરો (Verify & Login)",
    fastDemoLabel: "ઝડપી ડેમો લૉગિન:",
    listeningTitle: "સાંભળી રહ્યા છીએ... (Listening)",
    tapToSpeakModal: "બોલવા માટે માઇક દબાવો",
    speakingPrompt: "કૃપા કરીને તમારો 10 અંકનો મોબાઇલ નંબર બોલો"
  },
  pa: {
    subLogo: "ਅੱਜ ਦਾ ਹੁਨਰ • ਕੱਲ੍ਹ ਦਾ ਭਵਿੱਖ",
    welcome: "ਸਾਕਸ਼ਮ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    subtitle: "ਆਪਣੇ ਰੋਜ਼ਗਾਰ ਪਾਸਪੋਰਟ ਲਈ ਬੋਲ ਕੇ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ ਨਾਲ ਲੌਗਇਨ ਕਰੋ।",
    speakToLogin: "ਬੋਲ ਕੇ ਲੌਗਇਨ ਕਰੋ",
    speakSub: "100% ਬਿਨਾਂ ਲਿਖੇ • ਸਿਰਫ਼ ਬੋਲੋ",
    tapHereGuide: "ਇੱਥੇ ਮਾਈਕ ਦਬਾ ਕੇ ਮੋਬਾਈਲ ਨੰਬਰ ਬੋਲੋ",
    listenGuideBtn: "ਆਵਾਜ਼ ਹਦਾਇਤਾਂ ਸੁਣੋ",
    roleLabel: "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ:",
    beneficiary: "ਲਾਭਪਾਤਰੀ",
    fieldWorker: "ਪ੍ਰੇਰਕ ਸਾਥੀ",
    govAdmin: "ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਸ਼ਾਸਨ",
    mobileLabel: "ਮੋਬਾਈਲ ਨੰਬਰ",
    mobileSub: "10-ਅੰਕਾਂ ਦਾ ਨੰਬਰ",
    sendOtpBtn: "OTP ਭੇਜੋ (Send OTP)",
    enterOtpLabel: "4-ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਾਖਲ ਕਰੋ",
    resendVoiceOtp: "OTP ਸੁਣੋ",
    loginBtn: "ਲੌਗਇਨ ਕਰੋ (Verify & Login)",
    fastDemoLabel: "ਡੈਮੋ ਲੌਗਇਨ:",
    listeningTitle: "ਸੁਣ ਰਹੇ ਹਾਂ... (Listening)",
    tapToSpeakModal: "ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ",
    speakingPrompt: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਬੋਲੋ"
  },
  kn: {
    subLogo: "ಇಂದಿನ ಕೌಶಲ್ಯ • ನಾಳೆಯ ಭವಿಷ್ಯ",
    welcome: "ಸಾಕ್ಷಮ್‌ಗೆ ಸುಸ್ವಾಗತ",
    subtitle: "ಜೀವನೋಪಾಯ ಪಾಸ್‌ಪೋರ್ಟ್‌ಗಾಗಿ ಮಾತನಾಡಿ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ.",
    speakToLogin: "ಮಾತನಾಡಿ ಲಾಗಿನ್ ಮಾಡಿ",
    speakSub: "100% ಟೈಪಿಂಗ್ ಇಲ್ಲದೆ • ಕೇವಲ ಮಾತನಾಡಿ",
    tapHereGuide: "ಇಲ್ಲಿ ಮೈಕ್ ಒತ್ತಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಹೇಳಿ",
    listenGuideBtn: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
    roleLabel: "ನಿಮ್ಮ ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ:",
    beneficiary: "ಫಲಾನುಭವಿ",
    fieldWorker: "ಕ್ಷೇತ್ರ ಕಾರ್ಯಕರ್ತ",
    govAdmin: "ಜಿಲ್ಲಾ ಆಡಳಿತ",
    mobileLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    mobileSub: "10-ಅಂಕಿಯ ಸಂಖ್ಯೆ",
    sendOtpBtn: "OTP ಕಳುಹಿಸಿ",
    enterOtpLabel: "4-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ",
    resendVoiceOtp: "OTP ಧ್ವನಿ ಆಲಿಸಿ",
    loginBtn: "ಲಾಗಿನ್ ಮಾಡಿ (Verify & Login)",
    fastDemoLabel: "ಡೆಮೊ ಲಾಗಿನ್:",
    listeningTitle: "ಕೇಳುತ್ತಿದ್ದೇವೆ... (Listening)",
    tapToSpeakModal: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ",
    speakingPrompt: "ದಯವಿಟ್ಟು ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ತಿಳಿಸಿ"
  },
  as: {
    subLogo: "আজিৰ দক্ষতা • উজ্জ্বল ভৱিষ্যত",
    welcome: "সক্ষমলৈ স্বাগতম",
    subtitle: "জীৱিকা পাছপ’ৰ্টৰ বাবে কথা কৈ বা মোবাইল নম্বৰেৰে লগইন কৰক।",
    speakToLogin: "কথা কৈ লগইন কৰক",
    speakSub: "১০০% টাইপিং অবিহনে • কেৱল কওক",
    tapHereGuide: "ইয়াত মাইক টিপি মোবাইল নম্বৰ কওক",
    listenGuideBtn: "শব্দ নিৰ্দেশনা শুনক",
    roleLabel: "আপোনাৰ ভূমিকা বাছক:",
    beneficiary: "হিতাধিকাৰী",
    fieldWorker: "সহায়ক কৰ্মী",
    govAdmin: "জিলা প্ৰশাসন",
    mobileLabel: "মোবাইল নম্বৰ",
    mobileSub: "১০-সংখ্যাৰ নম্বৰ",
    sendOtpBtn: "OTP পঠিয়াওক",
    enterOtpLabel: "৪-সংখ্যাৰ ক’ড দিয়ক",
    resendVoiceOtp: "OTP শুনক",
    loginBtn: "লগইন কৰক (Verify & Login)",
    fastDemoLabel: "ডেমো লগইন:",
    listeningTitle: "শুনি আছোঁ... (Listening)",
    tapToSpeakModal: "ক’বলৈ মাইਕ টিপক",
    speakingPrompt: "অনুগ্ৰহ কৰি আপোনাৰ ১০ সংখ্যাৰ মোবাইল নম্বৰ কওক"
  },
  ur: {
    subLogo: "آج کا ہنر • روشن کل",
    welcome: "ساکشم میں خوش آمدید",
    subtitle: "روزگار پاسپورٹ کے لیے بول کر یا موبائل نمبر سے لاگ ان کریں۔",
    speakToLogin: "بول کر لاگ ان کریں",
    speakSub: "100% بغیر لکھے • بس مائیک دبا کر بولیں",
    tapHereGuide: "یہاں مائیک دبا کر اپنا موبائل نمبر بولیں",
    listenGuideBtn: "آواز ہدایات سنیں",
    roleLabel: "اپنا کردار منتخب کریں:",
    beneficiary: "مستفید",
    fieldWorker: "پریرک ساتھی",
    govAdmin: "ضلعی انتظامیہ",
    mobileLabel: "موبائل نمبر",
    mobileSub: "10 ہندسوں کا نمبر",
    sendOtpBtn: "او ٹی پی بھیجیں",
    enterOtpLabel: "4 ہندسوں کا کوڈ درج کریں",
    resendVoiceOtp: "او ٹی پی سنیں",
    loginBtn: "لاگ ان کریں",
    fastDemoLabel: "ڈیمو لاگ ان:",
    listeningTitle: "سن رہے ہیں...",
    tapToSpeakModal: "بولنے کے لیے مائیک دبائیں",
    speakingPrompt: "براہ کرم اپنا 10 ہندسوں کا موبائل نمبر بولیں"
  }
};

/**
 * Robust Indic & English Multi-lingual Speech-to-PhoneNumber Parser
 * Handles numeric digits, Devanagari/Odia numerals, and number words
 */
export function parsePhoneNumberFromSpeech(rawText: string): string {
  if (!rawText) return "";
  let text = rawText.toLowerCase().trim();

  // Indic devanagari & odia digit glyph replacements
  const indicDigits: Record<string, string> = {
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
    "୦": "0", "୧": "1", "୨": "2", "୩": "3", "୪": "4", "୫": "5", "୬": "6", "୭": "7", "୮": "8", "୯": "9"
  };
  for (const [glyph, digit] of Object.entries(indicDigits)) {
    text = text.replaceAll(glyph, digit);
  }

  // Multi-lingual word-to-digit translation map
  const wordMap: [RegExp, string][] = [
    // Zero / शून्य / ଶୂନ
    [/\b(zero|shunya|sunya|shoonya|oh|शून्य|सुन्ना|सफर|ଶୂନ)\b/gi, "0"],
    // One / एक / ଏକ
    [/\b(one|wan|ek|aik|एक|एक्क|ଏକ)\b/gi, "1"],
    // Two / दो / ଦୁଇ
    [/\b(two|too|to|do|doo|dho|दो|ଦୁଇ)\b/gi, "2"],
    // Three / तीन / ତିନି
    [/\b(three|tree|teen|tin|तिन|तीन|ତିନି)\b/gi, "3"],
    // Four / चार / ଚାରି
    [/\b(four|for|char|chaar|चार|ଚାରି)\b/gi, "4"],
    // Five / पांच / ପାଞ୍ଚ
    [/\b(five|fiv|panch|paanch|पांच|पाँच|पंज|ପାଞ୍ଚ)\b/gi, "5"],
    // Six / छह / ଛଅ
    [/\b(six|siks|chhah|che|chhe|छह|छः|ଛଅ)\b/gi, "6"],
    // Seven / सात / ସାତ
    [/\b(seven|saat|sat|सात|ସାତ)\b/gi, "7"],
    // Eight / आठ / ଆଠ
    [/\b(eight|ate|aath|ath|आठ|ଆଠ)\b/gi, "8"],
    // Nine / नौ / ନଅ
    [/\b(nine|nin|nau|no|noh|नौ|नउ|ନଅ)\b/gi, "9"]
  ];

  for (const [regex, digit] of wordMap) {
    text = text.replace(regex, digit);
  }

  // Extract all digit characters
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function LoginPage({
  onLoginSuccess,
  onBackToOnboarding,
  isMobile = false,
  language = "hi",
  onLanguageChange
}: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("9876543210");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isAutoFillingOtp, setIsAutoFillingOtp] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"beneficiary" | "field_worker" | "government">("beneficiary");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isPlayingAudioPrompt, setIsPlayingAudioPrompt] = useState<boolean>(false);

  // Normalized language code (hi, or, sat, en, bho, bn, te, mr, etc.)
  const normLang = (language || "hi").toLowerCase();
  const t = LOGIN_TRANSLATIONS[normLang] || LOGIN_TRANSLATIONS.hi;

  // Voice Login State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [parsedDigits, setParsedDigits] = useState<string>("");
  const [voiceFeedbackText, setVoiceFeedbackText] = useState<string>("");

  const recognitionRef = useRef<any>(null);
  const spokenTranscriptRef = useRef<string>("");

  // Spoken native prompts
  const welcomePrompts: Record<string, { text: string; lang: string }> = {
    hi: {
      text: "नमस्ते! बोलकर लॉगिन करने के लिए, चमकते हुए बड़े बैंगनी माइक बटन को दबाएं और अपना मोबाइल नंबर बोलें।",
      lang: "hi-IN"
    },
    or: {
      text: "ନମସ୍କାର! କହିକି ଲଗଇନ୍ କରିବା ପାଇଁ, ଚମକୁଥିବା ବଡ଼ ମାଇକ୍ ବଟନ୍ ଦବାନ୍ତୁ ଏବଂ ଆପଣଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର କୁହନ୍ତୁ।",
      lang: "hi-IN"
    },
    sat: {
      text: "ᱡᱚᱦﺎᱨ! ᱨᱚᱲ ᱠᱟᱛᱮ ᱞᱚᱜᱤᱱ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱶᱟ ᱢᱟᱭᱤᱠ ᱵᱚᱴᱚᱱ ᱫᱟᱵᱟᱣ ᱢᱮ ᱟᱨ ᱟᱢᱟᱜ ᱢᱚᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ ᱨᱚᱲ ᱢᱮ।",
      lang: "hi-IN"
    },
    bho: {
      text: "प्रणाम! बोल के लॉगिन करे खातिर, चमकत भइल बड़का माइक बटन दबाईं आ आपन मोबाइल नंबर बोलीं।",
      lang: "hi-IN"
    },
    bn: {
      text: "নমস্কার! কথা বলে লগইন করতে উজ্জ্বল মাইক বোতামটি চাপুন এবং আপনার মোবাইল নম্বর বলুন।",
      lang: "bn-IN"
    },
    te: {
      text: "నమస్కారం! మాట్లాడి లాగిన్ అవ్వడానికి ఈ మైక్ బటన్‌ను నొక్కండి మరియు మీ మొబైల్ నంబర్ చెప్పండి.",
      lang: "te-IN"
    },
    mr: {
      text: "नमस्कार! बोलून लॉगिन करण्यासाठी हे मोठे चमकणारे माइक बटण दाबा आणि आपला मोबाइल नंबर सांगा.",
      lang: "mr-IN"
    },
    ta: {
      text: "வணக்கம்! பேச உள்நுழைய ஒளிரும் மைக் பொத்தானை அழுத்தவும்.",
      lang: "ta-IN"
    },
    gu: {
      text: "નમસ્તે! બોલીને લૉગિન કરવા માટે ચમકતું માઇક બટન દબાવો.",
      lang: "gu-IN"
    },
    pa: {
      text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਬੋਲ ਕੇ ਲੌਗਇਨ ਕਰਨ ਲਈ ਚਮਕਦਾ ਮਾਈਕ ਬਟਨ ਦਬਾਓ।",
      lang: "pa-IN"
    },
    kn: {
      text: "ನಮಸ್ಕಾರ! ಮಾತನಾಡಲು ಹೊಳೆಯುವ ಮೈಕ್ ಬಟನ್ ಒತ್ತಿರಿ.",
      lang: "kn-IN"
    },
    as: {
      text: "নমস্কাৰ! কথা কৈ লগইন কৰিবলৈ মাইক টিপক।",
      lang: "as-IN"
    },
    ur: {
      text: "خوش آمدید! بول کر لاگ ان کرنے کے لیے مائیک دبائیں۔",
      lang: "ur-IN"
    },
    en: {
      text: "Welcome to Saksham-AI! To log in using your voice, tap the glowing microphone button and speak your 10-digit mobile number.",
      lang: "en-IN"
    }
  };

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioRequestIdRef = useRef<number>(0);

  const stopAllAudio = () => {
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
    setIsPlayingAudioPrompt(false);
  };

  const playGeminiTts = async (text: string, langCode: string = "hi", onEnd?: () => void) => {
    stopAllAudio();
    const myReqId = ++audioRequestIdRef.current;
    setIsPlayingAudioPrompt(true);

    try {
      const cleanLang = (langCode || "hi").toLowerCase().split("-")[0].split("_")[0];
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: cleanLang })
      });

      if (myReqId !== audioRequestIdRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (myReqId !== audioRequestIdRef.current) return;

        if (data.audioUrl) {
          const audio = new Audio();
          audio.src = data.audioUrl;
          audioPlayerRef.current = audio;

          audio.onended = () => {
            audioPlayerRef.current = null;
            if (myReqId === audioRequestIdRef.current) {
              setIsPlayingAudioPrompt(false);
              if (onEnd) onEnd();
            }
          };
          audio.onerror = () => {
            audioPlayerRef.current = null;
            if (myReqId === audioRequestIdRef.current) {
              playBrowserSpeechFallback(text, cleanLang, myReqId, onEnd);
            }
          };

          try {
            await audio.play();
            return;
          } catch (e) {
            console.warn("Audio play rejected, falling back to speech synthesis:", e);
          }
        }
      }
    } catch (err) {
      console.warn("TTS fetch error:", err);
    }

    if (myReqId === audioRequestIdRef.current) {
      playBrowserSpeechFallback(text, langCode, myReqId, onEnd);
    }
  };

  const playBrowserSpeechFallback = (text: string, langCode: string, reqId: number, onEnd?: () => void) => {
    if (reqId !== audioRequestIdRef.current) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = langCode === "en" ? "en-IN" : "hi-IN";
        u.rate = 0.95;
        u.onend = () => {
          if (reqId === audioRequestIdRef.current) {
            setIsPlayingAudioPrompt(false);
            if (onEnd) onEnd();
          }
        };
        u.onerror = () => {
          if (reqId === audioRequestIdRef.current) {
            setIsPlayingAudioPrompt(false);
            if (onEnd) onEnd();
          }
        };
        window.speechSynthesis.speak(u);
      } catch {
        if (reqId === audioRequestIdRef.current) {
          setIsPlayingAudioPrompt(false);
          if (onEnd) onEnd();
        }
      }
    } else {
      if (reqId === audioRequestIdRef.current) {
        setIsPlayingAudioPrompt(false);
        if (onEnd) onEnd();
      }
    }
  };

  // Play audio guidance automatically on load for illiterate / low-literacy users
  useEffect(() => {
    const timer = setTimeout(() => {
      playSpokenHelpPrompt();
    }, 600);
    return () => {
      clearTimeout(timer);
      stopAllAudio();
    };
  }, [normLang]);

  const playSpokenHelpPrompt = () => {
    const promptObj = welcomePrompts[normLang] || welcomePrompts.hi;
    playGeminiTts(promptObj.text, promptObj.lang);
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpSent(true);
    triggerAutoFillOtp();
  };

  const triggerAutoFillOtp = () => {
    setIsAutoFillingOtp(true);
    setOtp("");
    const dummyOtp = "1234";

    dummyOtp.split("").forEach((digit, index) => {
      setTimeout(() => {
        setOtp((prev) => prev + digit);
        if (index === 3) {
          setIsAutoFillingOtp(false);
          setTimeout(() => {
            handleVerifyAndLogin();
          }, 800);
        }
      }, (index + 1) * 350);
    });
  };

  const handleVerifyAndLogin = (roleToLogin?: "beneficiary" | "field_worker" | "government") => {
    setIsVerifying(true);
    const targetRole = roleToLogin || selectedRole;
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess(targetRole);
    }, 600);
  };

  const playVoiceOtp = () => {
    const otpText = normLang === "or"
      ? "ଆପଣଙ୍କ ଡେମୋ ଓଟିପି ଏକ, ଦୁଇ, ତିନି, ଚାରି ଅଟେ।"
      : normLang === "en"
        ? "Your demo OTP is one, two, three, four."
        : "आपका डेमो ओटीपी एक, दो, तीन, चार है।";
    playGeminiTts(otpText, normLang);
  };

  /**
   * Start Live Voice Recognition for Phone Number
   */
  const startVoiceLogin = () => {
    setIsVoiceModalOpen(true);
    setIsListeningVoice(true);
    setSpokenTranscript("");
    setParsedDigits("");
    spokenTranscriptRef.current = "";

    const activePrompt = t.speakingPrompt;
    setVoiceFeedbackText(activePrompt + "...");

    // Voice instruction audio via Gemini TTS
    playGeminiTts(activePrompt, normLang);

    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SpeechRecognition();
        recognitionRef.current = rec;
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = normLang === "en" ? "en-IN" : "hi-IN";

        rec.onresult = (e: any) => {
          let text = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript + " ";
          }
          spokenTranscriptRef.current = text;
          setSpokenTranscript(text);

          // Real-time phone number extraction
          const digits = parsePhoneNumberFromSpeech(text);
          setParsedDigits(digits);

          if (digits.length === 10) {
            rec.stop();
            handleExtractedPhone(digits);
          }
        };

        rec.onend = () => {
          setIsListeningVoice(false);
          const finalDigits = parsePhoneNumberFromSpeech(spokenTranscriptRef.current);
          if (finalDigits.length >= 10) {
            handleExtractedPhone(finalDigits);
          }
        };

        rec.onerror = (err: any) => {
          console.warn("Speech recognition error:", err);
          setIsListeningVoice(false);
        };

        rec.start();
      } catch (e) {
        console.warn("Speech rec start failed:", e);
        setIsListeningVoice(false);
      }
    } else {
      // Automatic fallback simulation
      setTimeout(() => {
        handleExtractedPhone("9876543210", "मेरा मोबाइल नंबर 9876543210 है");
      }, 2500);
    }
  };

  const stopVoiceLogin = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
    }
    setIsListeningVoice(false);
    stopAllAudio();
  };

  const handleExtractedPhone = (digits: string, customTranscript?: string) => {
    const validPhone = digits.length >= 10 ? digits.slice(-10) : "9876543210";
    setPhoneNumber(validPhone);
    setParsedDigits(validPhone);
    if (customTranscript) setSpokenTranscript(customTranscript);

    const successFeedbacks: Record<string, { text: string; lang: string }> = {
      hi: { text: `मोबाइल नंबर +91 ${validPhone} दर्ज हो गया!`, lang: "hi" },
      or: { text: `ମୋବାଇଲ୍ ନମ୍ବର +91 ${validPhone} ସଫଳତାର ସହ ଦର୍ଜ ହେଲା!`, lang: "or" },
      sat: { text: `Mobile number +91 ${validPhone} dafa ena`, lang: "sat" },
      bho: { text: `मोबाइल नंबर +91 ${validPhone} दर्ज हो गइल!`, lang: "bho" },
      bn: { text: `মোবাইল নম্বর +91 ${validPhone} নিশ্চিত হয়েছে!`, lang: "bn" },
      te: { text: `మొబైల్ నంబర్ +91 ${validPhone} నమోదైంది!`, lang: "te" },
      mr: { text: `मोबाईल नंबर +91 ${validPhone} नोंदवला गेला!`, lang: "mr" },
      ta: { text: `மொபைல் எண் +91 ${validPhone} பதிவாகியது!`, lang: "ta" },
      gu: { text: `મોબાઇલ નંબર +91 ${validPhone} નોંધાઈ ગયો!`, lang: "gu" },
      pa: { text: `ਮੋਬਾਈਲ ਨੰਬਰ +91 ${validPhone} ਦਰਜ ਹੋ ਗਿਆ!`, lang: "pa" },
      kn: { text: `ಮೊಬೈಲ್ ಸಂಖ್ಯೆ +91 ${validPhone} ದಾಖಲಾಗಿದೆ!`, lang: "kn" },
      as: { text: `মোবাইল নম্বৰ +91 ${validPhone} লিপিবদ্ধ হ’ল!`, lang: "as" },
      ur: { text: `موبائل نمبر +91 ${validPhone} درج ہو گیا!`, lang: "ur" },
      en: { text: `Mobile number +91 ${validPhone} confirmed!`, lang: "en" }
    };
    const activeSuccess = successFeedbacks[normLang] || successFeedbacks.hi;

    setVoiceFeedbackText(activeSuccess.text);
    setOtpSent(true);

    playGeminiTts(activeSuccess.text, activeSuccess.lang);

    setTimeout(() => {
      setIsVoiceModalOpen(false);
      triggerAutoFillOtp();
    }, 1800);
  };

  return (
    <div
      translate="no"
      className={`notranslate relative w-full flex flex-col items-center justify-between bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] text-slate-900 select-none ${isMobile
          ? "min-h-[100dvh] px-4.5 pt-4 pb-8 overflow-y-auto"
          : "min-h-screen py-10 px-4"
        }`}
    >
      {/* Background Soft Cloud Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-12 -left-12 w-64 h-32 bg-white/70 rounded-full blur-3xl animate-float" />
        <div className="absolute top-48 -right-12 w-72 h-36 bg-amber-100/60 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/3 w-80 h-32 bg-white/80 rounded-full blur-2xl animate-pulse-glow" />
      </div>

      {/* Top Navigation Bar: Back & Language Selector */}
      <div className="w-full max-w-md flex items-center justify-between relative z-50 shrink-0 pb-1">
        {onBackToOnboarding ? (
          <button
            onClick={onBackToOnboarding}
            type="button"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Onboarding</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-800 border border-amber-100/80 shadow-2xs">
            <span className="size-1.5 rounded-full bg-purple-600 animate-pulse" />
            <span>PM-AJAY Portal</span>
          </div>
        )}

        <div className="flex items-center gap-2 relative z-50">
          <LanguageSelector
            variant="icon"
            currentLanguage={normLang}
            onLanguageChange={onLanguageChange}
          />
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full text-[11px] font-bold">
            <ShieldCheck className="size-3 text-emerald-600" />
            <span>Govt Verified</span>
          </div>
        </div>
      </div>

      {/* Main Login Card Area (Top-to-Bottom Flow) */}
      <div className="w-full max-w-md space-y-4 sm:space-y-5 relative z-10 pt-1">
        {/* Brand Logo Emblem & Unified Header */}
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="relative size-11 sm:size-12 mb-0.5 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <circle cx="50" cy="40" r="14" fill="#F59E0B" />
              <path d="M50 14 L50 20" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <path d="M28 22 L33 27" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <path d="M72 22 L67 27" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="52" r="5" fill="#3B82F6" />
              <path d="M42 66 C42 58, 58 58, 58 66 Z" fill="#3B82F6" />
              <circle cx="35" cy="56" r="4.5" fill="#10B981" />
              <path d="M28 70 C28 63, 42 63, 42 70 Z" fill="#10B981" />
              <circle cx="65" cy="56" r="4.5" fill="#F97316" />
              <path d="M58 70 C58 63, 72 63, 72 70 Z" fill="#F97316" />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-heading notranslate" translate="no">
              Saksham-AI
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            {t.subLogo}
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight pt-1">
            {t.welcome}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs leading-relaxed">
            {t.subtitle}
          </p>

          <button
            onClick={playSpokenHelpPrompt}
            type="button"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200/70 px-3 py-1 rounded-full border border-purple-200 cursor-pointer mt-1"
          >
            <Volume2 className="size-3.5 text-purple-700 animate-pulse" />
            <span>{t.listenGuideBtn}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* ULTRA-ACCESSIBLE HERO VOICE LOGIN BUTTON WITH RADIANT HIGHLIGHTING PULSES */}
        {/* ========================================================================= */}
        <div className="relative w-full group pt-1 notranslate" translate="no">
          {/* Multi-layered Neon Beacon Glow Pulsing Rings */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-purple-600 via-amber-400 to-indigo-600 opacity-75 blur-md animate-pulse pointer-events-none" />
          <div className="absolute -inset-1 rounded-2xl border-2 border-amber-300/80 animate-ping opacity-40 pointer-events-none" />

          {/* Bouncing Pointer Indicator Banner for Illiterate Beneficiaries */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-full flex items-center justify-center gap-1.5 mb-1.5 text-xs font-black text-purple-950 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 border-2 border-amber-400 px-3 py-1 rounded-full shadow-md relative z-20 notranslate"
            translate="no"
          >
            <ChevronDown className="size-4 text-purple-950 stroke-[3] animate-bounce" />
            <span className="tracking-wide uppercase text-[11px] font-black notranslate" translate="no">
              {t.tapHereGuide}
            </span>
            <ChevronDown className="size-4 text-purple-950 stroke-[3] animate-bounce" />
          </motion.div>

          {/* Main 3D Tactile Speak to Login Button */}
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.96 }}
            onClick={startVoiceLogin}
            type="button"
            className="relative w-full p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#4323A0] text-white shadow-2xl shadow-purple-900/40 flex items-center justify-between border-2 border-amber-300 cursor-pointer overflow-hidden z-10 ring-4 ring-purple-400/30 active:scale-95 notranslate"
            translate="no"
          >
            {/* Shimmer Sweep Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer pointer-events-none" />

            <div className="flex items-center gap-3.5 relative z-10 notranslate" translate="no">
              {/* Pulsing Glowing Golden Mic Orb */}
              <div className="size-12 sm:size-13 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center shadow-lg shadow-amber-400/50 relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-amber-300 animate-ping opacity-50 pointer-events-none" />
                <Mic className="size-6 sm:size-7 text-purple-950 stroke-[2.5] animate-pulse" />
              </div>

              <div className="text-left notranslate" translate="no">
                <span className="text-sm sm:text-base font-black tracking-tight text-white block drop-shadow-sm font-heading notranslate" translate="no">
                  {t.speakToLogin}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-amber-200 block mt-0.5 notranslate" translate="no">
                  {t.speakSub}
                </span>
              </div>
            </div>

            {/* Dancing Sound Equalizer Visualizer */}
            <div className="flex items-center gap-1 bg-white/15 px-2.5 py-2 rounded-xl backdrop-blur-sm border border-white/25 shrink-0">
              <span className="w-1 bg-amber-300 rounded-full animate-bounce h-3.5" style={{ animationDelay: "0ms" }} />
              <span className="w-1 bg-white rounded-full animate-bounce h-6" style={{ animationDelay: "150ms" }} />
              <span className="w-1 bg-amber-300 rounded-full animate-bounce h-4.5" style={{ animationDelay: "300ms" }} />
              <span className="w-1 bg-white rounded-full animate-bounce h-7" style={{ animationDelay: "75ms" }} />
              <span className="w-1 bg-amber-300 rounded-full animate-bounce h-4" style={{ animationDelay: "225ms" }} />
            </div>
          </motion.button>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-1.5 pt-1 notranslate" translate="no">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center notranslate" translate="no">
            {t.roleLabel}
          </span>
          <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-2xl relative">
            {(["beneficiary", "field_worker", "government"] as const).map((role) => {
              const isSelected = selectedRole === role;
              const icons = {
                beneficiary: <Mic className="size-4 text-purple-600" />,
                field_worker: <Users className="size-4 text-blue-600" />,
                government: <Building2 className="size-4 text-indigo-600" />,
              };
              const labels = {
                beneficiary: t.beneficiary,
                field_worker: t.fieldWorker,
                government: t.govAdmin,
              };

              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  type="button"
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer z-10 notranslate ${isSelected ? "text-purple-900 font-extrabold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  translate="no"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeRoleTabIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  {icons[role]}
                  <span className="notranslate" translate="no">{labels[role]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 space-y-4 notranslate" translate="no">
          {/* Mobile Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between notranslate" translate="no">
              <span>{t.mobileLabel}</span>
              <span className="text-[10px] text-purple-600 font-semibold">{t.mobileSub}</span>
            </label>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
              <span className="text-xs font-bold text-slate-500 border-r border-slate-200 pr-2">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit mobile"
                className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none tracking-wider notranslate"
                translate="no"
              />
              <button
                type="button"
                onClick={startVoiceLogin}
                className="text-purple-600 hover:text-purple-800 p-1 cursor-pointer"
                title="Speak mobile number"
              >
                <Mic className="size-4" />
              </button>
            </div>
          </div>

          {/* OTP Input with Autofill Notification */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between notranslate" translate="no">
              <label className="text-xs font-bold text-slate-800 notranslate" translate="no">
                4-Digit OTP / ओटीपी
              </label>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={triggerAutoFillOtp}
                  type="button"
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 cursor-pointer flex items-center gap-1 notranslate"
                  translate="no"
                >
                  <Sparkle className="size-3 text-purple-600" />
                  <span>Auto-Fill (1234)</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={playVoiceOtp}
                  type="button"
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer notranslate"
                  translate="no"
                >
                  <Volume2 className="size-3.5" />
                  <span>{isPlayingAudioPrompt ? "बोल रहे हैं..." : "Voice OTP"}</span>
                </motion.button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full bg-transparent text-base font-extrabold text-slate-900 focus:outline-none tracking-widest text-center notranslate"
                translate="no"
              />
              <KeyRound className="size-4 text-purple-600 shrink-0" />
            </div>

            {/* Simulated SMS Notification Popup */}
            {isAutoFillingOtp && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2 text-[11px] text-purple-900 font-bold notranslate"
                translate="no"
              >
                <MessageSquare className="size-3.5 text-purple-600 animate-bounce" />
                <span>Auto-filling verified OTP: 1234...</span>
              </motion.div>
            )}
          </div>

          {/* Verify & Login Button with Spring Physics */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 25 }}
            onClick={() => handleVerifyAndLogin()}
            disabled={isVerifying}
            type="button"
            className="w-full h-13 text-sm font-bold rounded-2xl bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 mt-2 cursor-pointer border border-purple-400/20 notranslate"
            translate="no"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2 notranslate" translate="no">
                <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <span className="notranslate" translate="no">{t.loginBtn}</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </motion.button>

          {/* One-Tap Demo Persona Fast-Logins */}
          <div className="pt-3 border-t border-slate-100 space-y-2 notranslate" translate="no">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center notranslate" translate="no">
              {t.fastDemoLabel}
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  setPhoneNumber("9876543210");
                  setSelectedRole("beneficiary");
                  handleVerifyAndLogin("beneficiary");
                }}
                type="button"
                className="w-full p-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/80 text-left flex items-center justify-between cursor-pointer transition-colors notranslate"
                translate="no"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    <UserCheck className="size-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Ramesh Soren (Rural Beneficiary • 100% Voice)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Sundargarh, Odisha • Odia/Hindi Speaker
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-purple-600" />
              </button>

              <button
                onClick={() => {
                  setPhoneNumber("9123456780");
                  setSelectedRole("field_worker");
                  handleVerifyAndLogin("field_worker");
                }}
                type="button"
                className="w-full p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 text-left flex items-center justify-between cursor-pointer transition-colors notranslate"
                translate="no"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    <Users className="size-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Priya Sharma (Prerak Field Worker)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Gajapati Cluster • Field Mobilizer
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-blue-600" />
              </button>

              <button
                onClick={() => {
                  setPhoneNumber("9011223344");
                  setSelectedRole("government");
                  handleVerifyAndLogin("government");
                }}
                type="button"
                className="w-full p-2 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/80 text-left flex items-center justify-between cursor-pointer transition-colors notranslate"
                translate="no"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    <Building2 className="size-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Rajesh Das (District Collector / DSC Officer)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      District Executive Monitoring
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-indigo-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FULL-SCREEN INTERACTIVE VOICE PHONE ENTRY MODAL                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isVoiceModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            translate="no"
            className="notranslate fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] rounded-3xl p-6 shadow-2xl border border-purple-200 text-center space-y-5 relative notranslate"
              translate="no"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  stopVoiceLogin();
                  setIsVoiceModalOpen(false);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  {t.listeningTitle}
                </span>
                <h3 className="text-xl font-black text-slate-900 font-heading pt-2">
                  {t.speakingPrompt}
                </h3>
                <p className="text-xs text-slate-600">
                  {voiceFeedbackText}
                </p>
              </div>

              {/* Glowing Pulse Mic Button */}
              <div className="relative size-28 mx-auto flex items-center justify-center">
                {isListeningVoice && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-purple-600/30 animate-ping" />
                    <div className="absolute -inset-3 rounded-full bg-amber-400/30 animate-pulse" />
                  </>
                )}
                <button
                  onClick={() => {
                    if (isListeningVoice) {
                      stopVoiceLogin();
                    } else {
                      startVoiceLogin();
                    }
                  }}
                  className={`size-20 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transition-all ${isListeningVoice ? "bg-red-500 scale-105" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                >
                  {isListeningVoice ? (
                    <Mic className="size-9 animate-pulse" />
                  ) : (
                    <MicOff className="size-9" />
                  )}
                </button>
              </div>

              {/* Detected Spoken Transcript & Extracted Digits */}
              <div className="p-4 bg-white/90 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Captured Voice Audio / आपकी आवाज़:
                </span>
                <p className="text-sm font-semibold text-slate-800 italic min-h-6">
                  {spokenTranscript ? `"${spokenTranscript}"` : "बोलिए... जैसे 'नौ आठ सात छह पाँच... '"}
                </p>

                {parsedDigits && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-purple-700">Phone Detected:</span>
                    <span className="text-base font-extrabold text-slate-900 tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                      +91 {parsedDigits}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Helper */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Supports Hindi, Odia, Santhali, English numbers</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
