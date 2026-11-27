'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Landmark,
} from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  return (
    <footer className="bg-[#173F35] text-[#E8F0E8] mt-auto border-t border-[#2F6B52]/40">
      {/* Top Civic Principles Ribbon */}
      <div className="border-b border-[#2F6B52]/40 bg-[#12332A] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#173F35] border border-[#2F6B52] text-[#D99A42] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#FFFFFF] block mb-0.5">
                  {isHi ? 'सत्यापित नियम इंजन' : 'Deterministic Rule Engine'}
                </span>
                <span className="text-[#E8F0E8]/70">
                  {isHi
                    ? 'पात्रता आकलन नियमों पर आधारित है'
                    : 'Zero-hallucination logic matching verified criteria'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#173F35] border border-[#2F6B52] text-[#D99A42] shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#FFFFFF] block mb-0.5">
                  {isHi ? 'आधिकारिक सरकारी स्रोत' : 'Official Portals'}
                </span>
                <span className="text-[#E8F0E8]/70">
                  {isHi
                    ? 'myScheme व मंत्रालयों से सत्यापित'
                    : 'Grounded in myScheme and Ministerial Gazettes'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#173F35] border border-[#2F6B52] text-[#D99A42] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#FFFFFF] block mb-0.5">
                  {isHi ? 'नागरिक डिजिटल सेवा' : 'Public Digital Good'}
                </span>
                <span className="text-[#E8F0E8]/70">
                  {isHi
                    ? 'निःशुल्क व पारदर्शी सूचना सेवा'
                    : 'Non-commercial public information service'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#173F35] border border-[#2F6B52] text-[#D99A42] shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#FFFFFF] block mb-0.5">
                  {isHi ? 'पूर्ण डेटा संप्रभुता' : 'Citizen Privacy'}
                </span>
                <span className="text-[#E8F0E8]/70">
                  {isHi
                    ? 'कोई व्यक्तिगत डेटा बेचा नहीं जाता'
                    : 'No tracking or monetization of personal data'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2F6B52] text-[#FFFFFF] flex items-center justify-center font-bold text-sm">
                यM
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-[#FFFFFF] block">
                  Yojana<span className="text-[#D99A42]">Mitra</span>
                </span>
                <span className="text-[11px] text-[#E8F0E8]/70">
                  {isHi ? 'राष्ट्रीय सरकारी योजना सूचना मंच' : 'National Welfare Guidance Platform'}
                </span>
              </div>
            </div>
            <p className="text-[#E8F0E8]/80 text-xs sm:text-sm leading-relaxed max-w-md">
              {isHi
                ? 'योजनामित्र भारत के नागरिकों को केंद्र एवं राज्य सरकारों की कल्याणकारी योजनाओं की पारदर्शी व सटीक जानकारी प्रदान करता है।'
                : 'YojanaMitra assists citizens in discovering welfare benefits and evaluating deterministic eligibility across verified Indian Central and State Government schemes.'}
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99A42] mb-3">
              {isHi ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs text-[#E8F0E8]/80">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-white transition">
                  {t('navSchemes')}
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-white transition">
                  {t('navAssistant')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  {t('navAdmin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99A42] mb-3">
              {isHi ? 'संबद्ध आधिकारिक पोर्टल' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-[#E8F0E8]/80">
              <li>
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>myScheme Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>Open Government Data</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://digitalindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>Digital India</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer Box */}
        <div className="rounded-xl bg-[#12332A] border border-[#2F6B52]/50 p-4 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-[#D99A42] shrink-0 mt-0.5" />
          <div className="text-xs text-[#E8F0E8]/80 leading-relaxed">
            <span className="font-bold text-[#FFFFFF] block mb-0.5">{t('disclaimerTitle')}</span>
            {t('disclaimerText')}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2F6B52]/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8F0E8]/60 gap-4">
          <p>© 2026 YojanaMitra. Grounded in Public Official Data.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition">
              RTI & Transparency
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition">
              Privacy Standards
            </Link>
            <span>•</span>
            <span>Non-Commercial Civic Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
