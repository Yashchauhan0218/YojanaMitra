'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, ExternalLink, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-emerald-950 text-white mt-auto border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-700 flex items-center justify-center font-bold text-white text-sm">
                यM
              </div>
              <span className="text-xl font-bold tracking-tight text-white">YojanaMitra</span>
            </div>
            <p className="text-emerald-200/80 text-sm leading-relaxed max-w-md">
              {language === 'hi'
                ? 'भारत सरकार एवं राज्य सरकारों की प्रमाणित योजनाओं की सटीक जानकारी प्रदान करने वाला एआई व वॉइस-आधारित लोकसेवा मंच।'
                : 'AI-powered, voice-enabled public service discovery platform grounded in official Government of India scheme guidelines.'}
            </p>
            <div className="text-xs text-emerald-300/70 pt-2 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>B.Tech CSE Capstone Project &bull; Built with Next.js, Express, PostgreSQL & Gemini</span>
            </div>
          </div>

          {/* Official Portals */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-emerald-300 mb-3">
              {language === 'hi' ? 'आधिकारिक सरकारी स्रोत' : 'Official Portals'}
            </h3>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li>
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition"
                >
                  myScheme Portal <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in/my-government/schemes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition"
                >
                  National Portal of India <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.data.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition"
                >
                  Open Government Data (OGD) <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-emerald-300 mb-3">
              {language === 'hi' ? 'नेविगेशन' : 'Navigation'}
            </h3>
            <ul className="space-y-2 text-sm text-emerald-100/80">
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
        </div>

        {/* Regulatory Disclaimer Box */}
        <div className="rounded-xl bg-emerald-900/60 border border-emerald-800/80 p-4 mb-8 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-100/90 leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-1">{t('disclaimerTitle')}</span>
            {t('disclaimerText')}
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="border-t border-emerald-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
          <div>&copy; 2026 YojanaMitra. Grounded Public Information System.</div>
          <div>{t('poweredBy')}</div>
        </div>
      </div>
    </footer>
  );
}
