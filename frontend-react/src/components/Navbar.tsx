import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass,
  Bot,
  Info,
  ShieldCheck,
  Menu,
  X,
  Languages,
  CheckCircle,
} from 'lucide-react';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/schemes', label: t('navSchemes'), icon: Compass },
    { href: '/assistant', label: t('navAssistant'), icon: Bot, isAssistant: true },
    { href: '/about', label: t('navAbout'), icon: Info },
    { href: '/admin', label: t('navAdmin'), icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E3E7E1] shadow-xs">
      {/* Subtle National Tricolor Hairline */}
      <div className="tricolor-hairline w-full" />

      {/* Official Civic Ribbon */}
      <div className="bg-[#173F35] text-[#E8F0E8] text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D99A42]" />
            <span className="font-medium tracking-wide">
              {language === 'hi'
                ? 'भारत सरकार एवं राज्य सरकारों की प्रमाणित योजनाओं का नागरिक सूचना मंच'
                : 'National Civic Welfare Platform • Grounded in Official Portals'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[#E8F0E8]/80 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-[#E8F0E8]">
              <CheckCircle className="w-3.5 h-3.5 text-[#D99A42]" />
              {language === 'hi' ? '100% सत्यापित नियम' : 'Verified Rule-Engine'}
            </span>
            <span className="text-[#E8F0E8]/40">|</span>
            <span>myScheme • data.gov.in</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Civic Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#173F35] text-[#FFFFFF] flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-[#2F6B52] transition-colors">
              <span className="tracking-tight">यM</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#202923]">
                  Yojana<span className="text-[#173F35]">Mitra</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1]">
                  {language === 'hi' ? 'नागरिक सेवा' : 'Civic Portal'}
                </span>
              </div>
              <span className="text-[11px] text-[#69756D] font-normal hidden sm:block">
                {language === 'hi'
                  ? 'सरकारी योजनाओं की सही जानकारी, आसानी से'
                  : 'Transparent Public Welfare Discovery'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E8F0E8] text-[#173F35] font-semibold'
                      : 'text-[#69756D] hover:text-[#202923] hover:bg-[#F7F5EF]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* AI Voice Assistant CTA */}
            <Link
              to="/assistant"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#173F35] hover:bg-[#2F6B52] active:scale-98 transition shadow-xs"
            >
              <Bot className="w-3.5 h-3.5 text-[#D99A42]" />
              <span>{language === 'hi' ? 'वॉइस व एआई सहायक' : 'Voice Assistant'}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E3E7E1] bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#202923] text-xs font-semibold transition cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#2F6B52]" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#202923] hover:bg-[#F7F5EF] transition"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E3E7E1] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-1 shadow-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#E8F0E8] text-[#173F35] font-semibold'
                    : 'text-[#202923] hover:bg-[#F7F5EF]'
                }`}
              >
                <span>{link.label}</span>
                {link.isAssistant && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F0E8] text-[#173F35]">
                    Voice AI
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
