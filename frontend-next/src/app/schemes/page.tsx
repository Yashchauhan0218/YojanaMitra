'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { fetchSchemes, fetchCategories } from '../../lib/api';
import type { Scheme } from '../../lib/types';
import SchemeCard from '../../components/SchemeCard';
import {
  Search,
  RotateCcw,
  Landmark,
  SlidersHorizontal,
} from 'lucide-react';

function SchemesContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const initialSearch = searchParams?.get('search') || '';
  const initialCategory = searchParams?.get('category') || 'All';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const indianStates = [
    'All India',
    'Uttar Pradesh',
    'Bihar',
    'Madhya Pradesh',
    'Rajasthan',
    'Maharashtra',
    'West Bengal',
    'Gujarat',
    'Karnataka',
    'Tamil Nadu',
    'Punjab',
    'Haryana',
  ];

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchCategories();
        setCategories(['All', ...res.categories]);
      } catch (e) {
        console.warn('Could not load categories:', e);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadSchemes() {
      setIsLoading(true);
      try {
        const res = await fetchSchemes({
          search: search.trim() || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          state: selectedState && selectedState !== 'All India' ? selectedState : undefined,
        });
        setSchemes(res.schemes || []);
        setTotalCount(res.total || 0);
      } catch (err) {
        console.warn('Failed to load schemes:', err);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(loadSchemes, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedState]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedState('');
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-8 sm:py-12 text-[#202923]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1] mb-2.5">
            <Landmark className="w-3.5 h-3.5 text-[#2F6B52]" />
            <span>{isHi ? 'प्रमाणित सरकारी डेटाबेस' : 'Verified Welfare Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202923] tracking-tight">
            {isHi ? 'सरकारी योजना निर्देशिका' : 'Government Welfare Schemes Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-[#69756D] mt-1.5 max-w-2xl font-normal leading-relaxed">
            {isHi
              ? 'केंद्र एवं राज्य सरकारों की सभी सत्यापित योजनाओं का अन्वेषण करें। पारदर्शी पात्रता नियम व आधिकारिक सरकारी पोर्टल।'
              : 'Explore verified welfare schemes across sectors with deterministic criteria and official government application links.'}
          </p>
        </div>

        {/* Minimal Fintech Filter Bar */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-3.5 sm:p-4 mb-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input (5 Cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#69756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isHi
                    ? 'योजना खोजें (उदा: किसान, आवास, पेंशन)...'
                    : 'Search by scheme name, code, or keyword...'
                }
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E3E7E1] text-xs sm:text-sm focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] transition"
              />
            </div>

            {/* Category Filter (4 Cols) */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E3E7E1] text-xs sm:text-sm focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] text-[#202923] font-medium transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All'
                      ? isHi
                        ? 'सभी श्रेणियां (All Categories)'
                        : 'All Categories'
                      : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter (2 Cols) */}
            <div className="md:col-span-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E3E7E1] text-xs sm:text-sm focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] text-[#202923] font-medium transition"
              >
                <option value="">{isHi ? 'सभी राज्य' : 'All States'}</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button (1 Col) */}
            <div className="md:col-span-1 flex items-center">
              <button
                onClick={resetFilters}
                title={isHi ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
                className="w-full h-full min-h-[38px] px-2 py-2 border border-[#E3E7E1] bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="md:hidden">{isHi ? 'रीसेट' : 'Reset'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter and Active Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-[#69756D]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#202923]">
              {isLoading ? (
                isHi ? 'खोज जारी है...' : 'Searching...'
              ) : (
                isHi
                  ? `${totalCount} प्रमाणित योजनाएं उपलब्ध हैं`
                  : `Showing ${totalCount} verified schemes`
              )}
            </span>
            {(search || selectedCategory !== 'All' || selectedState) && (
              <span className="px-2 py-0.5 rounded-md bg-[#E8F0E8] text-[#173F35] font-semibold">
                {isHi ? 'फ़िल्टर लागू' : 'Filtered'}
              </span>
            )}
          </div>

          {(search || selectedCategory !== 'All' || selectedState) && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#173F35] hover:underline cursor-pointer"
            >
              {isHi ? 'सभी फ़िल्टर साफ़ करें' : 'Clear all filters'}
            </button>
          )}
        </div>

        {/* Schemes Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-72 rounded-xl bg-[#FFFFFF] border border-[#E3E7E1] animate-pulse p-5"
              />
            ))}
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-8 max-w-lg mx-auto">
            <SlidersHorizontal className="w-10 h-10 text-[#69756D] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#202923] mb-1">
              {isHi ? 'कोई योजना नहीं मिली' : 'No matching schemes found'}
            </h3>
            <p className="text-xs text-[#69756D] mb-4">
              {isHi
                ? 'कृपया अपने खोज शब्दों या फ़िल्टर को बदलकर पुनः प्रयास करें।'
                : 'Try adjusting your search query, selecting another category, or clearing state filters.'}
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#2F6B52] text-[#FFFFFF] font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              {isHi ? 'सभी योजनाएं देखें' : 'View all schemes'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchemesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5EF] p-8 text-center text-xs text-[#69756D]">Loading...</div>}>
      <SchemesContent />
    </Suspense>
  );
}
