'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass,
  Bot,
  Info,
  ShieldCheck,
  Menu,
  X,
  Languages,
  Landmark,
} from 'lucide-react';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navHome'), icon: Landmark },
    { href: '/schemes', label: t('navSchemes'), icon: Compass },
    { href: '/assistant', label: t('navAssistant'), icon: Bot },
    { href: '/about', label: t('navAbout'), icon: Info },
    { href: '/admin', label: t('navAdmin'), icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      {/* Top Government-style Tricolor Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition">
              यM
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-emerald-950 flex items-center gap-1.5">
                YojanaMitra
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {language === 'hi' ? 'योजनामित्र' : 'Gov Scheme AI'}
                </span>
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                {language === 'hi'
                  ? 'सरकारी योजनाओं की सही जानकारी, आसानी से'
                  : 'The Right Government Schemes, Made Simple'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60'
                      : 'text-gray-700 hover:text-emerald-800 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-gray-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-700/30 bg-emerald-50/50 text-emerald-900 hover:bg-emerald-100 transition text-sm font-semibold cursor-pointer"
            >
              <Languages className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-700" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
