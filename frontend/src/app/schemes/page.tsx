'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { fetchSchemes, fetchCategories } from '../../lib/api';
import { Scheme } from '../../lib/types';
import SchemeCard from '../../components/SchemeCard';
import {
  Search,
  Filter,
  ShieldCheck,
  RotateCcw,
  Layers,
  Sparkles,
} from 'lucide-react';

function SchemesContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

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
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHi ? 'प्रमाणित सरकारी डेटाबेस' : 'Verified Welfare Directory'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {isHi ? 'सरकारी योजना निर्देशिका' : 'Government Welfare Schemes Directory'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
            {isHi
              ? 'केंद्र एवं राज्य सरकारों द्वारा संचालित सभी सत्यापित कल्याणकारी योजनाओं का अन्वेषण करें।'
              : 'Browse authenticated central and state government schemes across sectors with verified criteria and authentic source portals.'}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 mb-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input (5 Cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isHi ? 'योजना खोजें (जैसे: किसान, छात्रवृत्ति, आवास)...' : 'Search by name, code, or keyword...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Category Filter (4 Cols) */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? (isHi ? 'सभी श्रेणियां (All Categories)' : 'All Categories') : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter (2 Cols) */}
            <div className="md:col-span-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                <option value="">{isHi ? 'सभी राज्य' : 'All States'}</option>
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button (1 Col) */}
            <div className="md:col-span-1 flex items-center">
              <button
                onClick={resetFilters}
                className="w-full h-full py-2.5 px-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center justify-center text-xs font-semibold cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {isHi ? (
              <>
                कुल <span className="font-bold text-gray-900">{totalCount}</span> योजनाएं उपलब्ध
              </>
            ) : (
              <>
                Showing <span className="font-bold text-gray-900">{totalCount}</span> verified schemes
              </>
            )}
          </div>
        </div>

        {/* Schemes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-white border border-gray-200 animate-pulse p-6" />
            ))}
          </div>
        ) : schemes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-xl mx-auto">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isHi ? 'कोई योजना नहीं मिली' : 'No Schemes Found'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {isHi
                ? 'आपके खोज मापदंड से मेल खाती कोई योजना नहीं मिली। कृपया फ़िल्टर बदलें।'
                : 'No schemes matched your search or category filter. Try clearing filters.'}
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
            >
              {isHi ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
          Loading government schemes...
        </div>
      }
    >
      <SchemesContent />
    </Suspense>
  );
}
