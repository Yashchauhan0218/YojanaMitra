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
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased font-sans">
        <LanguageProvider>
          <Suspense fallback={<div className="h-16 border-b border-gray-100 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
