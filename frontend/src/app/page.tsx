'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { fetchSchemes, fetchCategories } from '../lib/api';
import { Scheme } from '../lib/types';
import SchemeCard from '../components/SchemeCard';
import {
  Mic,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
  HeartHandshake,
  Users,
  Wheat,
  GraduationCap,
  HeartPulse,
  Coins,
  Baby,
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSchemes, setTotalSchemes] = useState(0);

  const isHi = language === 'hi';

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [schemesRes, catsRes] = await Promise.all([
          fetchSchemes({ limit: 6 }),
          fetchCategories(),
        ]);
        setFeaturedSchemes(schemesRes.schemes || []);
        setTotalSchemes(schemesRes.total || 0);
        setCategories(catsRes.categories || []);
      } catch (err) {
        console.warn('Could not load schemes from API:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/schemes');
    }
  };

  const categoryIcons: Record<string, any> = {
    Agriculture: Wheat,
    Healthcare: HeartPulse,
    Education: GraduationCap,
    'Social Security': Coins,
    'Women & Child': Baby,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-white py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Sovereign Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>
              {isHi
                ? 'सत्यापित सरकारी पोर्टल (myScheme व भारत सरकार स्रोतों पर आधारित)'
                : 'Verified Indian Government Welfare Portal Guidelines'}
            </span>
          </div>

          {/* Main Headings */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-4">
            {isHi ? 'सरकारी योजनाओं की सही जानकारी, आसानी से।' : 'The Right Government Schemes, Made Simple.'}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {isHi
              ? 'अपनी भाषा और आवाज़ में जानिए कौन सी सरकारी योजना आपके लिए बनी है। पारदर्शी पात्रता नियम एवं बिना किसी भ्रामक जानकारी के।'
              : 'Discover authentic central and state welfare benefits tailored to your profile through bilingual natural language and voice assistance.'}
          </p>

          {/* Central Search & Voice Action Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-emerald-900/10 p-3 sm:p-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('searchButton')}</span>
                </button>

                {/* Voice Assistant Shortcut Button */}
                <Link
                  href="/assistant"
                  className="px-4 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl transition flex items-center gap-2 font-medium text-sm group"
                  title={t('voicePrompt')}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                  <Mic className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition" />
                  <span className="hidden sm:inline font-semibold">
                    {isHi ? 'बोलकर पूछें' : 'Voice Assistant'}
                  </span>
                </Link>
              </div>
            </form>

            {/* Quick helper pills */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{isHi ? 'लोकप्रिय:' : 'Popular:'}</span>
              <Link
                href="/schemes?search=Kisan"
                className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 transition"
              >
                PM-KISAN (किसान)
              </Link>
              <Link
                href="/schemes?search=Arogya"
                className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 transition"
              >
                Ayushman Bharat (स्वास्थ्य)
              </Link>
              <Link
                href="/schemes?search=Sukanya"
                className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 transition"
              >
                Sukanya Samriddhi (बालिका)
              </Link>
              <Link
                href="/schemes?search=Pension"
                className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 transition"
              >
                Atal Pension (पेंशन)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {t('categoriesTitle')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isHi
                  ? 'अपनी आवश्यकता के अनुसार सरकारी कल्याणकारी श्रेणियों का चयन करें'
                  : 'Select public welfare categories tailored to your sector'}
              </p>
            </div>
            <Link
              href="/schemes"
              className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
            >
              <span>{t('viewAllSchemes')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || Layers;
              return (
                <Link
                  key={cat}
                  href={`/schemes?category=${encodeURIComponent(cat)}`}
                  className="p-5 rounded-xl border border-gray-200/80 hover:border-emerald-600/50 hover:bg-emerald-50/40 transition group flex flex-col items-center text-center shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-emerald-900 text-sm">
                    {cat}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Verified Schemes */}
      <section className="py-16 bg-gray-50/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHi ? 'प्रमाणित सरकारी योजनाएं' : 'Verified Welfare Schemes'}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                {isHi ? 'प्रमुख कल्याणकारी योजनाएं' : 'Featured Central & State Schemes'}
              </h2>
            </div>
            <Link
              href="/schemes"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-emerald-50 hover:text-emerald-900 transition self-start sm:self-auto shadow-2xs"
            >
              <span>{t('viewAllSchemes')}</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {totalSchemes}
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-72 rounded-xl bg-white border border-gray-200 animate-pulse p-6"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How YojanaMitra Works Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{t('howItWorksTitle')}</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {isHi
                ? 'पारदर्शी और सत्यापन-योग्य प्रक्रिया, जहां कृत्रिम बुद्धिमत्ता और नियम-आधारित निष्पक्षता एक साथ काम करते हैं।'
                : 'A transparent architecture ensuring accurate, non-hallucinated welfare discovery for every citizen.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('step1Title')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('step1Desc')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('step2Title')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('step2Desc')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('step3Title')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner / Call to Action */}
      <section className="py-14 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {isHi
                ? 'अभी बोलकर या लिखकर अपनी पात्रता जांचें'
                : 'Try the AI & Voice Scheme Assistant Now'}
            </h2>
            <p className="text-emerald-200 text-sm leading-relaxed">
              {isHi
                ? 'हिंदी और अंग्रेजी में तुरंत बातचीत करें और अपने परिवार के लिए उपलब्ध सभी लाभों का पता लगाएं।'
                : 'Interactive conversational guidance powered by Google Gemini and verified Government of India datasets.'}
            </p>
          </div>

          <Link
            href="/assistant"
            className="px-8 py-4 rounded-xl bg-white text-emerald-950 font-bold hover:bg-emerald-50 transition shadow-lg flex items-center gap-3 shrink-0"
          >
            <Bot className="w-5 h-5 text-emerald-700" />
            <span>{isHi ? 'सहायक से बात करें' : 'Open AI Assistant'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </Link>
        </div>
      </section>
    </div>
  );
}
