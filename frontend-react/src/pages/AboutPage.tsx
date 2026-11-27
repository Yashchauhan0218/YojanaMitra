import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchHealth } from '../lib/api';
import type { HealthStatus } from '../lib/types';
import {
  ShieldCheck,
  Server,
  Cpu,
  Database,
  ExternalLink,
  Code2,
  CheckCircle2,
  Activity,
  Layers,
  Landmark,
} from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    async function checkSystemHealth() {
      try {
        const res = await fetchHealth();
        setHealth(res);
      } catch (e) {
        console.warn('System health check failed:', e);
      }
    }
    checkSystemHealth();
  }, []);

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10 sm:py-16 text-[#202923]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1] mb-2.5">
            <Landmark className="w-3.5 h-3.5 text-[#2F6B52]" />
            <span>{isHi ? 'परियोजना परिचय एवं वास्तुकला' : 'Project Architecture & Standards'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#202923] tracking-tight mb-3">
            {isHi ? 'योजनामित्र: भारत के लिए नागरिक कल्याण मंच' : 'About YojanaMitra'}
          </h1>
          <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
            {isHi
              ? 'बी.टेक कंप्यूटर साइंस एंड इंजीनियरिंग (CSE) कैपस्टोन प्रोजेक्ट के रूप में निर्मित। इसका उद्देश्य भारत के प्रत्येक नागरिक तक सरकारी कल्याणकारी योजनाओं की सटीक व निष्पक्ष जानकारी पहुंचाना है।'
              : 'Built as a B.Tech Computer Science & Engineering capstone project. Designed to bridge the digital divide in Indian public welfare access through voice, natural language understanding, and grounded deterministic rule matching.'}
          </p>
        </div>

        {/* Live System Health Badge (Minimal Fintech card) */}
        {health && (
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 mb-8 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-[#E3E7E1] pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#202923] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2F6B52]" />
                <span>{isHi ? 'लाइव सिस्टम स्थिति' : 'Live System Health & Services'}</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1]">
                API {health.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#F7F5EF] rounded-lg p-3.5 border border-[#E3E7E1]">
                <div className="font-bold text-[#202923] flex items-center gap-1.5 mb-1">
                  <Server className="w-3.5 h-3.5 text-[#69756D]" />
                  <span>Express API Server</span>
                </div>
                <div className="text-[#69756D] font-mono text-[11px]">Uptime: {health.uptimeSeconds}s</div>
              </div>

              <div className="bg-[#F7F5EF] rounded-lg p-3.5 border border-[#E3E7E1]">
                <div className="font-bold text-[#202923] flex items-center gap-1.5 mb-1">
                  <Database className="w-3.5 h-3.5 text-[#69756D]" />
                  <span>PostgreSQL (Prisma)</span>
                </div>
                <div className={health.database.connected ? 'text-[#1B6A47] font-semibold text-[11px]' : 'text-[#9E6714] font-semibold text-[11px]'}>
                  {health.database.connected ? 'Connected' : 'Offline (Verified Cache Active)'}
                </div>
              </div>

              <div className="bg-[#F7F5EF] rounded-lg p-3.5 border border-[#E3E7E1]">
                <div className="font-bold text-[#202923] flex items-center gap-1.5 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-[#69756D]" />
                  <span>Google Gemini AI</span>
                </div>
                <div className={health.ai.configured ? 'text-[#1B6A47] font-semibold text-[11px]' : 'text-[#9E6714] font-semibold text-[11px]'}>
                  {health.ai.configured ? `Configured (${health.ai.model})` : 'Offline Mode (Deterministic)'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#202923] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2F6B52]" />
              <span>{isHi ? '1. शून्य मतिभ्रम नियम इंजन' : '1. Deterministic Rule Engine'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
              {isHi
                ? 'एलएलएम कभी भी अंतिम पात्रता का निर्णय नहीं लेता। पात्रता का मूल्यांकन एक पारदर्शी नियम इंजन द्वारा किया जाता है जिसमें eq, neq, gte, gt, lte, lt, in, exists ऑपरेटर्स का उपयोग होता है।'
                : 'The LLM never makes the final eligibility determination. All decisions are evaluated deterministically using rigorous rule operations (eq, neq, gte, lte, in, exists). Unknown attributes never count as eligible.'}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#202923] mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#2F6B52]" />
              <span>{isHi ? '2. केवल प्रमाणित सरकारी स्रोत' : '2. Verified Government Sources'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
              {isHi
                ? 'सभी योजनाएं आधिकारिक स्रोतों (myScheme, india.gov.in, data.gov.in) और संबंधित मंत्रालयों के राजपत्रों से सत्यापित की जाती हैं। बिना अनुमति के कोई अनधिकृत वेब स्क्रैपिंग नहीं की जाती।'
                : 'All scheme records are curated and verified against official portals (myScheme.gov.in, National Portal of India, OGD Platform India). Unauthorized web scraping is strictly disallowed.'}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#202923] mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2F6B52]" />
              <span>{isHi ? '3. आधिकारिक @google/genai एसडीके' : '3. Official @google/genai SDK'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
              {isHi
                ? 'नवीनतम जेमिनी 2.5 फ्लैश मॉडल का उपयोग केवल नागरिक भाषा को समझने और पुष्ट व्याख्या तैयार करने के लिए किया जाता है।'
                : 'Google Gemini 2.5 Flash is integrated via the official @google/genai SDK solely for bilingual extraction of stated citizen facts and for generating empathetic explanations grounded in rule verdicts.'}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#202923] mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#2F6B52]" />
              <span>{isHi ? '4. आधुनिक वास्तुकला' : '4. Modern Scalable Stack'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#69756D] leading-relaxed font-normal">
              {isHi
                ? 'रिएक्ट एसपीए (टाइपस्क्रिप्ट, टेलविंड सीएसएस), नोड.जेएस एक्सप्रेस बैकएंड, और पोस्टग्रेएसक्यूएल प्रिज्मा ओआरएम के साथ निर्मित।'
                : 'React SPA and Next.js App Router frontends with TypeScript & Tailwind CSS; decoupled Node.js Express REST API, PostgreSQL with Prisma ORM, and automated Node test suites on the backend.'}
            </p>
          </div>
        </div>

        {/* Official Data Sources References */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#202923] mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2F6B52]" />
            <span>{isHi ? 'आधिकारिक संदर्भ एवं मान्यता प्राप्त पोर्टल' : 'Official Portals & Verification Citations'}</span>
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm text-[#69756D]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2F6B52] shrink-0" />
              <a
                href="https://www.myscheme.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#173F35] font-semibold hover:underline"
              >
                myScheme Portal (Government of India)
              </a>
              <span className="text-[#69756D]">• National Public Services Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2F6B52] shrink-0" />
              <a
                href="https://www.india.gov.in/my-government/schemes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#173F35] font-semibold hover:underline"
              >
                National Portal of India
              </a>
              <span className="text-[#69756D]">• Single window access to government services</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2F6B52] shrink-0" />
              <a
                href="https://www.data.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#173F35] font-semibold hover:underline"
              >
                Open Government Data (OGD) Platform India
              </a>
              <span className="text-[#69756D]">• Department of Electronics & IT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
