'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../lib/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    siteName: 'YojanaMitra',
    tagline: 'The Right Government Schemes, Made Simple.',
    navHome: 'Home',
    navSchemes: 'Schemes Directory',
    navAssistant: 'AI Voice Assistant',
    navAbout: 'About',
    navAdmin: 'Admin Portal',
    searchPlaceholder: 'Search schemes by name, keyword, or benefits (e.g. Kisan, Health, Scholarship)...',
    searchButton: 'Search',
    voicePrompt: 'Click microphone to speak in Hindi or English',
    categoriesTitle: 'Browse by Category',
    howItWorksTitle: 'How YojanaMitra Works',
    step1Title: '1. Share Profile or Voice',
    step1Desc: 'State your age, occupation, state, or income in plain Hindi or English.',
    step2Title: '2. Deterministic Rule Matching',
    step2Desc: 'Our verified criteria engine checks rules without hallucination.',
    step3Title: '3. Grounded Results & Application',
    step3Desc: 'Receive clear, grounded explanations and direct official application links.',
    viewAllSchemes: 'View All Schemes',
    eligibleBadge: 'Potentially Eligible',
    needsInfoBadge: 'Needs Information',
    notEligibleBadge: 'Not Eligible',
    verifiedPortal: 'Verified Official Portal',
    checkEligibility: 'Check My Eligibility',
    disclaimerTitle: 'Official Public Service & Privacy Disclaimer',
    disclaimerText:
      'YojanaMitra is an open public-service guidance system. Eligibility assessments are indicative calculations based on verified Government of India portal guidelines. Please verify details on the respective ministry portal before formal application submission.',
    poweredBy: 'Grounded by Official Data (myScheme, india.gov.in) & Gemini 2.5 Flash',
  },
  hi: {
    siteName: 'योजनामित्र',
    tagline: 'सरकारी योजनाओं की सही जानकारी, आसानी से।',
    navHome: 'मुखपृष्ठ',
    navSchemes: 'योजना निर्देशिका',
    navAssistant: 'एआई वॉइस सहायक',
    navAbout: 'परिचय',
    navAdmin: 'प्रशासन पोर्टल',
    searchPlaceholder: 'योजना का नाम, कीवर्ड या लाभ खोजें (जैसे: किसान, स्वास्थ्य, छात्रवृत्ति)...',
    searchButton: 'खोजें',
    voicePrompt: 'हिंदी या अंग्रेजी में बोलने के लिए माइक पर क्लिक करें',
    categoriesTitle: 'श्रेणी के अनुसार देखें',
    howItWorksTitle: 'योजनामित्र कैसे काम करता है',
    step1Title: '1. विवरण या आवाज़ साझा करें',
    step1Desc: 'अपनी उम्र, व्यवसाय, राज्य या आय सामान्य हिंदी या अंग्रेजी में बताएं।',
    step2Title: '2. सटीक नियम-आधारित जांच',
    step2Desc: 'हमारा प्रमाणित इंजन बिना किसी भ्रामक अनुमान के नियमों की जांच करता है।',
    step3Title: '3. प्रमाणित परिणाम और आवेदन',
    step3Desc: 'स्पष्ट, तथ्यपरक स्पष्टीकरण और सीधे आधिकारिक सरकारी आवेदन लिंक प्राप्त करें।',
    viewAllSchemes: 'सभी योजनाएं देखें',
    eligibleBadge: 'संभावित पात्र',
    needsInfoBadge: 'अतिरिक्त जानकारी चाहिए',
    notEligibleBadge: 'अपात्र',
    verifiedPortal: 'सत्यापित सरकारी पोर्टल',
    checkEligibility: 'पात्रता जांचें',
    disclaimerTitle: 'आधिकारिक लोक सेवा एवं गोपनीयता अस्वीकरण',
    disclaimerText:
      'योजनामित्र एक जनसेवा सहायता प्रणाली है। पात्रता का यह मूल्यांकन भारत सरकार के आधिकारिक पोर्टल्स के नियमों पर आधारित सांकेतिक आकलन है। कृपया औपचारिक आवेदन से पूर्व संबंधित मंत्रालय के पोर्टल पर अवश्य जांच करें।',
    poweredBy: 'प्रमाणित सरकारी डेटा (myScheme, india.gov.in) और जेमिनी 2.5 फ्लैश द्वारा संचालित',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('ym_language') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ym_language', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'hi' ? 'en' : 'hi';
    handleSetLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
