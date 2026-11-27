import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchSchemes, fetchCategories } from '../lib/api';
import type { Scheme } from '../lib/types';
import SchemeCard from '../components/SchemeCard';
import {
  Mic,
  Search,
  ArrowRight,
  ShieldCheck,
  Bot,
  Wheat,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Baby,
  Home,
  CheckCircle2,
  Landmark,
  Scale,
  Languages,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [, setCategories] = useState<string[]>([]);
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
      navigate(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/schemes');
    }
  };

  const civicCategories = [
    {
      id: 'Agriculture',
      name: isHi ? 'कृषि एवं किसान कल्याण' : 'Agriculture',
      desc: isHi ? 'किसान आय, फसल बीमा और सिंचाई अनुदान' : 'Farmer income support, crop insurance & subsidies',
      icon: Wheat,
    },
    {
      id: 'Education',
      name: isHi ? 'शिक्षा एवं छात्रवृत्ति' : 'Education',
      desc: isHi ? 'छात्रवृत्ति, उच्च शिक्षा शुल्क छूट और फ़ेलोशिप' : 'Pre/post-matric scholarships & fee concessions',
      icon: GraduationCap,
    },
    {
      id: 'Employment',
      name: isHi ? 'रोजगार एवं कौशल' : 'Employment',
      desc: isHi ? 'युवा कौशल प्रशिक्षण और स्वरोजगार योजनाएं' : 'Skill development, apprenticeships & job loans',
      icon: Briefcase,
    },
    {
      id: 'Women & Child',
      name: isHi ? 'महिला एवं बाल विकास' : 'Women & Child',
      desc: isHi ? 'मातृत्व पोषण, बालिका समृद्धि व सुरक्षा सहायता' : 'Maternity benefits, girl child savings & nutrition',
      icon: Baby,
    },
    {
      id: 'Housing',
      name: isHi ? 'आवास एवं शहरी विकास' : 'Housing',
      desc: isHi ? 'पक्के मकान निर्माण व ग्रामीण आवास अनुदान' : 'Pucca housing grants for rural & urban families',
      icon: Home,
    },
    {
      id: 'Healthcare',
      name: isHi ? 'स्वास्थ्य एवं चिकित्सा' : 'Healthcare',
      desc: isHi ? 'निःशुल्क चिकित्सा बीमा और स्वास्थ्य सुरक्षा कार्ड' : 'Universal medical coverage & cashless treatment',
      icon: HeartPulse,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5EF] text-[#202923]">
      {/* Editorial Civic Hero */}
      <section className="border-b border-[#E3E7E1] py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8F0E8] border border-[#E3E7E1] text-[#173F35] text-xs font-semibold mb-6">
            <Landmark className="w-3.5 h-3.5 text-[#2F6B52]" />
            <span>
              {isHi
                ? 'प्रमाणित सरकारी डेटाबेस • आधिकारिक स्रोतों से संरेखित'
                : 'National Citizen Welfare Platform • Grounded in Official Portals'}
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202923] tracking-tight leading-tight mb-4">
            {isHi
              ? 'सरकारी योजनाओं की सही जानकारी, अब और भी आसान।'
              : 'Government schemes made easier to find.'}
          </h1>

          <p className="text-base sm:text-lg text-[#69756D] max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            {isHi
              ? 'अपनी प्रोफाइल, आवश्यकता और राज्य के अनुसार सत्यापित सरकारी योजनाओं का पता लगाएं। निष्पक्ष नियम, पारदर्शी पात्रता और सीधे आधिकारिक आवेदन लिंक।'
              : 'Discover verified benefits tailored to your profile, needs, and state. Evaluated with transparent eligibility criteria grounded in official government gazettes.'}
          </p>

          {/* Primary Search Container (Minimal Fintech style) */}
          <div className="max-w-2xl mx-auto bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-2.5 sm:p-3 shadow-xs mb-6">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#69756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isHi
                      ? 'योजना का नाम, अपनी श्रेणी या ज़रूरत लिखें...'
                      : 'Search by scheme name, category, or need...'
                  }
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E3E7E1] bg-[#F7F5EF]/40 text-[#202923] placeholder:text-[#69756D] focus:outline-none focus:border-[#173F35] focus:bg-[#FFFFFF] text-sm transition"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-[#173F35] hover:bg-[#2F6B52] text-[#FFFFFF] font-semibold rounded-lg text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>{isHi ? 'खोजें' : 'Search'}</span>
                </button>

                {/* Direct Voice Assistant Option */}
                <Link
                  to="/assistant"
                  className="px-3.5 py-2.5 bg-[#E8F0E8] hover:bg-[#dce8dc] text-[#173F35] border border-[#E3E7E1] rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
                  title={isHi ? 'आवाज से पूछें' : 'Ask with Voice'}
                >
                  <Mic className="w-4 h-4 text-[#D99A42]" />
                  <span className="hidden sm:inline">
                    {isHi ? 'बोलकर पूछें' : 'Voice'}
                  </span>
                </Link>
              </div>
            </form>

            {/* Quick Filter Chips */}
            <div className="mt-2.5 pt-2.5 border-t border-[#E3E7E1] flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#69756D]">
              <span className="font-medium text-[#202923] mr-1">
                {isHi ? 'लोकप्रिय खोजें:' : 'Quick shortcuts:'}
              </span>
              <Link
                to="/schemes?category=Agriculture"
                className="px-2.5 py-0.5 rounded-md bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] border border-[#E3E7E1] transition"
              >
                {isHi ? 'किसान (Agriculture)' : 'Farmers'}
              </Link>
              <Link
                to="/schemes?category=Education"
                className="px-2.5 py-0.5 rounded-md bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] border border-[#E3E7E1] transition"
              >
                {isHi ? 'विद्यार्थी (Students)' : 'Students'}
              </Link>
              <Link
                to="/schemes?category=Healthcare"
                className="px-2.5 py-0.5 rounded-md bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] border border-[#E3E7E1] transition"
              >
                {isHi ? 'स्वास्थ्य (Healthcare)' : 'Healthcare'}
              </Link>
              <Link
                to="/schemes?category=Women%20%26%20Child"
                className="px-2.5 py-0.5 rounded-md bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] border border-[#E3E7E1] transition"
              >
                {isHi ? 'महिलाएं (Women)' : 'Women'}
              </Link>
            </div>
          </div>

          {/* Civic Trust Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left pt-4">
            <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E3E7E1] shadow-xs">
              <div className="flex items-center gap-1.5 text-[#173F35] font-semibold text-xs mb-0.5">
                <Scale className="w-3.5 h-3.5 text-[#2F6B52]" />
                <span>{isHi ? 'सत्यापित नियम' : 'Deterministic Rules'}</span>
              </div>
              <p className="text-[11px] text-[#69756D] leading-tight">
                {isHi ? 'तार्किक पात्रता मिलान' : 'Zero hallucination logic'}
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E3E7E1] shadow-xs">
              <div className="flex items-center gap-1.5 text-[#173F35] font-semibold text-xs mb-0.5">
                <Landmark className="w-3.5 h-3.5 text-[#2F6B52]" />
                <span>{isHi ? 'आधिकारिक स्रोत' : 'Official Sources'}</span>
              </div>
              <p className="text-[11px] text-[#69756D] leading-tight">
                {isHi ? 'myScheme से सत्यापित' : 'myScheme & Gazettes'}
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E3E7E1] shadow-xs">
              <div className="flex items-center gap-1.5 text-[#173F35] font-semibold text-xs mb-0.5">
                <Languages className="w-3.5 h-3.5 text-[#2F6B52]" />
                <span>{isHi ? 'द्विभाषी सहायता' : 'Bilingual Support'}</span>
              </div>
              <p className="text-[11px] text-[#69756D] leading-tight">
                {isHi ? 'हिंदी एवं अंग्रेजी' : 'Hindi & English'}
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E3E7E1] shadow-xs">
              <div className="flex items-center gap-1.5 text-[#173F35] font-semibold text-xs mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B52]" />
                <span>{isHi ? 'नागरिक गोपनीयता' : 'Privacy First'}</span>
              </div>
              <p className="text-[11px] text-[#69756D] leading-tight">
                {isHi ? 'सुरक्षित व निःशुल्क' : 'No tracking or data sales'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts Section */}
      <section className="py-14 bg-[#FFFFFF] border-b border-[#E3E7E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#173F35] mb-1">
                {isHi ? 'योजना श्रेणियां' : 'Category Shortcuts'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202923] tracking-tight">
                {isHi ? 'अपनी आवश्यकतानुसार योजनाएं खोजें' : 'Browse by Public Welfare Sector'}
              </h2>
            </div>
            <Link
              to="/schemes"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#173F35] hover:text-[#2F6B52] transition"
            >
              <span>{t('viewAllSchemes')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {civicCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/schemes?category=${encodeURIComponent(cat.id)}`}
                  className="p-5 rounded-xl border border-[#E3E7E1] bg-[#FFFFFF] hover:bg-[#F7F5EF] hover:border-[#2F6B52]/40 transition group flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E8F0E8] text-[#173F35] flex items-center justify-center shrink-0 group-hover:bg-[#173F35] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#202923] group-hover:text-[#173F35] text-base mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#69756D] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured / Popular Schemes */}
      <section className="py-14 bg-[#F7F5EF] border-b border-[#E3E7E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#173F35] mb-1">
                {isHi ? 'प्रमाणित योजनाएं' : 'Featured Schemes'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202923] tracking-tight">
                {isHi ? 'प्रमुख कल्याणकारी योजनाएं' : 'Popular Central & State Schemes'}
              </h2>
            </div>
            <Link
              to="/schemes"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E3E7E1] text-[#202923] text-xs font-semibold hover:border-[#173F35] transition"
            >
              <span>{t('viewAllSchemes')}</span>
              <span className="px-1.5 py-0.5 rounded bg-[#E8F0E8] text-[#173F35] font-bold">
                {totalSchemes}
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-72 rounded-xl bg-[#FFFFFF] border border-[#E3E7E1] animate-pulse p-5"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Three-step How It Works Section */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E3E7E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-[#173F35] mb-1">
              {isHi ? 'प्रक्रिया' : 'How It Works'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202923] tracking-tight mb-2">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed">
              {isHi
                ? 'सरल, निष्पक्ष व पारदर्शी 3 चरणों में अपनी योजनाएं खोजें।'
                : 'A transparent 3-step workflow ensuring accurate welfare discovery.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#F7F5EF] border border-[#E3E7E1]">
              <div className="w-8 h-8 rounded-lg bg-[#173F35] text-[#FFFFFF] flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-[#202923] mb-2">{t('step1Title')}</h3>
              <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
                {t('step1Desc')}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F7F5EF] border border-[#E3E7E1]">
              <div className="w-8 h-8 rounded-lg bg-[#173F35] text-[#FFFFFF] flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-[#202923] mb-2">{t('step2Title')}</h3>
              <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
                {t('step2Desc')}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F7F5EF] border border-[#E3E7E1]">
              <div className="w-8 h-8 rounded-lg bg-[#173F35] text-[#FFFFFF] flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-[#202923] mb-2">{t('step3Title')}</h3>
              <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
                {t('step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust, Data Verification & Language Support Section */}
      <section className="py-14 bg-[#F7F5EF] border-b border-[#E3E7E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#173F35]">
                <FileText className="w-3.5 h-3.5 text-[#2F6B52]" />
                <span>{isHi ? 'प्रमाणिकता एवं स्रोत' : 'Data Integrity & Official Sources'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202923] tracking-tight">
                {isHi
                  ? 'सत्यापित सरकारी पोर्टल एवं नियम इंजन'
                  : 'Grounded in Official Portals & Deterministic Rules'}
              </h2>
              <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed">
                {isHi
                  ? 'योजनामित्र केवल आधिकारिक सरकारी गजट, myScheme.gov.in एवं भारत सरकार के मंत्रालयों द्वारा प्रकाशित नियमों पर काम करता है। हम किसी भी अनुमान या मतिभ्रम पर आधारित सलाह नहीं देते।'
                  : 'YojanaMitra relies strictly on verified criteria published in official ministry portals and gazette notifications. Our deterministic rule engine evaluates eligibility without hallucination.'}
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B52]" />
                  <span className="font-medium text-[#202923]">
                    {isHi ? 'द्विभाषी समर्थन (हिंदी और अंग्रेजी)' : 'Native Bilingual Interface (Hindi & English)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B52]" />
                  <span className="font-medium text-[#202923]">
                    {isHi ? 'प्रत्येक योजना के साथ मूल आधिकारिक आवेदन लिंक' : 'Direct official application links for all schemes'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B52]" />
                  <span className="font-medium text-[#202923]">
                    {isHi ? 'सार्वजनिक डिजिटल सेवा • कोई शुल्क नहीं' : 'Public Digital Good • 100% Free Information Service'}
                  </span>
                </div>
              </div>
            </div>

            {/* Civic Callout Card */}
            <div className="bg-[#173F35] text-[#FFFFFF] rounded-2xl p-7 sm:p-9 border border-[#2F6B52] shadow-sm">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D99A42] mb-3">
                <Bot className="w-4 h-4 text-[#D99A42]" />
                <span>{isHi ? 'एआई एवं वॉइस सहायक' : 'Interactive Assistant'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 text-white">
                {isHi
                  ? 'बोलकर या लिखकर अपनी पात्रता तुरंत जांचें'
                  : 'Ask in plain language with voice or text.'}
              </h3>
              <p className="text-xs sm:text-sm text-[#E8F0E8]/80 mb-6 leading-relaxed">
                {isHi
                  ? 'अपनी उम्र, आय और आवश्यकता बताएं। हमारा नियम इंजन तुरंत आपको योग्य योजनाओं की सूची देगा।'
                  : 'Speak naturally in Hindi or English to discover which welfare benefits your family qualifies for.'}
              </p>

              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#173F35] font-semibold text-sm transition shadow-xs"
              >
                <span>{isHi ? 'सहायक प्रारंभ करें' : 'Open Scheme Assistant'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
