import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'YojanaMitra | AI-Powered Government Scheme Finder for India',
  description:
    'Discover verified Government of India schemes through natural language and voice in Hindi and English. Powered by deterministic rule evaluation and Gemini AI.',
  keywords: [
    'Government Schemes India',
    'YojanaMitra',
    'myScheme',
    'PM Kisan',
    'Ayushman Bharat',
    'Sarkari Yojana',
    'Voice Scheme Finder',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-civic-ivory text-civic-text antialiased">
        <LanguageProvider>
          <Suspense fallback={<div className="h-16 border-b border-civic-border bg-civic-card" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
