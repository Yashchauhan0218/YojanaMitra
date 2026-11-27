import { Link } from 'react-router-dom';
import type { Scheme } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import {
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Landmark,
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const { language } = useLanguage();

  const isHi = language === 'hi';
  const primaryTitle = isHi ? scheme.titleHi : scheme.titleEn;
  const secondaryTitle = isHi ? scheme.titleEn : scheme.titleHi;
  const summary = isHi ? scheme.summaryHi : scheme.summaryEn;
  const benefits = isHi ? scheme.benefitsHi : scheme.benefitsEn;

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] shadow-xs hover:border-[#2F6B52]/50 hover:shadow-sm transition-all duration-150 flex flex-col justify-between group overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1]">
              {scheme.category}
            </span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#69756D] border border-[#E3E7E1]">
              {scheme.code}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#173F35]">
            <Landmark className="w-3.5 h-3.5 text-[#2F6B52]" />
            <span>
              {scheme.level === 'CENTRAL'
                ? isHi
                  ? 'केंद्रीय सरकार'
                  : 'Central Gov'
                : scheme.state || 'State'}
            </span>
          </div>
        </div>

        {/* Scheme Titles */}
        <Link to={`/schemes/${encodeURIComponent(scheme.code || scheme.id)}`}>
          <h3 className="text-base sm:text-lg font-bold text-[#202923] group-hover:text-[#173F35] transition-colors leading-snug mb-1">
            {primaryTitle}
          </h3>
        </Link>
        <p className="text-xs text-[#69756D] mb-3 line-clamp-1 font-normal">
          {secondaryTitle}
        </p>

        {/* Short Summary */}
        <p className="text-xs sm:text-sm text-[#202923]/90 line-clamp-2 mb-4 leading-relaxed font-normal">
          {summary}
        </p>

        {/* Key Benefits Highlight Box (Clean warm ivory surface, no gradient) */}
        {benefits && (
          <div className="bg-[#F7F5EF] border border-[#E3E7E1] rounded-lg p-3 mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#173F35] flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B52]" />
              <span>{isHi ? 'प्रमाणित सरकारी लाभ' : 'Verified Benefit'}</span>
            </div>
            <p className="text-xs text-[#202923] font-medium line-clamp-2 leading-relaxed">
              {benefits}
            </p>
          </div>
        )}

        {/* Eligibility Criteria count */}
        {scheme.criteria && scheme.criteria.length > 0 && (
          <div className="text-xs text-[#69756D] flex items-center gap-2 pt-1">
            <span className="font-medium text-[#202923] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B52]" />
              {scheme.criteria.length} {isHi ? 'पात्रता नियम' : 'Criteria Rules'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#69756D]" />
              {isHi ? 'आधिकारिक गजट से सत्यापित' : 'Official Guidelines'}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="bg-[#F7F5EF]/60 px-5 sm:px-6 py-3 border-t border-[#E3E7E1] flex items-center justify-between text-xs">
        <a
          href={scheme.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#69756D] hover:text-[#173F35] flex items-center gap-1 font-medium transition"
        >
          <span>{isHi ? 'सरकारी पोर्टल' : 'Official Portal'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <Link
          to={`/schemes/${encodeURIComponent(scheme.code || scheme.id)}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#173F35] hover:bg-[#2F6B52] text-[#FFFFFF] font-semibold text-xs transition"
        >
          <span>{isHi ? 'विवरण व पात्रता' : 'View Details'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
