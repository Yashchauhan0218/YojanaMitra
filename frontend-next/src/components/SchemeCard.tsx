'use client';

import React from 'react';
import Link from 'next/link';
import { Scheme } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import {
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
}

const categoryColors: Record<string, string> = {
  Agriculture: 'bg-green-100 text-green-800 border-green-200',
  Healthcare: 'bg-blue-100 text-blue-800 border-blue-200',
  Education: 'bg-amber-100 text-amber-800 border-amber-200',
  'Social Security': 'bg-purple-100 text-purple-800 border-purple-200',
  'Women & Child': 'bg-pink-100 text-pink-800 border-pink-200',
  Housing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const { language } = useLanguage();

  const isHi = language === 'hi';
  const primaryTitle = isHi ? scheme.titleHi : scheme.titleEn;
  const secondaryTitle = isHi ? scheme.titleEn : scheme.titleHi;
  const summary = isHi ? scheme.summaryHi : scheme.summaryEn;
  const benefits = isHi ? scheme.benefitsHi : scheme.benefitsEn;

  const badgeClass =
    categoryColors[scheme.category] || 'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:border-emerald-600/40 group overflow-hidden">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
              {scheme.category}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-gray-100 text-gray-700 font-mono">
              {scheme.code}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{scheme.level === 'CENTRAL' ? (isHi ? 'केंद्रीय' : 'Central') : scheme.state || 'State'}</span>
          </div>
        </div>

        {/* Scheme Titles */}
        <Link href={`/schemes/${encodeURIComponent(scheme.code || scheme.id)}`}>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition leading-snug mb-1">
            {primaryTitle}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-3 italic">{secondaryTitle}</p>

        {/* Summary */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">{summary}</p>

        {/* Key Benefits Highlight Box */}
        <div className="bg-emerald-50/70 border border-emerald-200/50 rounded-lg p-3 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isHi ? 'प्रमुख लाभ' : 'Key Benefit'}</span>
          </div>
          <p className="text-xs text-emerald-950 font-medium line-clamp-2">{benefits}</p>
        </div>

        {/* Criteria summary */}
        {scheme.criteria && scheme.criteria.length > 0 && (
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="font-medium text-gray-700">
              {scheme.criteria.length} {isHi ? 'पात्रता शर्तें' : 'Eligibility Criteria'}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              {isHi ? 'सत्यापित' : 'Verified'}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <a
          href={scheme.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-emerald-800 flex items-center gap-1 transition"
        >
          <span>{isHi ? 'आधिकारिक पोर्टल' : 'Official Portal'}</span>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </a>

        <Link
          href={`/schemes/${encodeURIComponent(scheme.code || scheme.id)}`}
          className="font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition"
        >
          <span>{isHi ? 'विवरण एवं पात्रता' : 'Details & Eligibility'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
