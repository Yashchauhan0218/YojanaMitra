'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchSchemeById, checkEligibility } from '../../../lib/api';
import { Scheme, SchemeEvaluation } from '../../../lib/types';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  HelpCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

function SchemeDetailContent() {
  const params = useParams();
  const schemeId = params?.id as string;

  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Eligibility Evaluation State
  const [userAge, setUserAge] = useState('');
  const [userGender, setUserGender] = useState('');
  const [userIncome, setUserIncome] = useState('');
  const [userOccupation, setUserOccupation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SchemeEvaluation | null>(null);
  const [explanationText, setExplanationText] = useState<string | null>(null);

  useEffect(() => {
    async function loadScheme() {
      if (!schemeId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchSchemeById(schemeId);
        setScheme(res.scheme);
      } catch (err: any) {
        setError(err.message || 'Scheme not found.');
      } finally {
        setIsLoading(false);
      }
    }
    loadScheme();
  }, [schemeId]);

  const handleQuickCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheme) return;

    setIsEvaluating(true);
    setEvaluationResult(null);
    setExplanationText(null);

    const profile: Record<string, any> = {};
    if (userAge) profile.age = parseInt(userAge, 10);
    if (userGender) profile.gender = userGender;
    if (userIncome) profile.annual_income = parseFloat(userIncome);
    if (userOccupation) profile.occupation = userOccupation;

    try {
      const res = await checkEligibility({
        profile,
        schemeId: scheme.id,
        language,
        includeExplanations: true,
      });

      if (res.results) {
        // Find in potentiallyEligible or needsInformation or notEligible
        const found =
          res.results.potentiallyEligible?.[0] ||
          res.results.needsInformation?.[0] ||
          res.results.notEligible?.[0];

        if (found) {
          setEvaluationResult(found);
          setExplanationText(found.explanation?.explanation || null);
        }
      }
    } catch (err: any) {
      console.warn('Evaluation check error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">
          {isHi ? 'योजना का विवरण लोड हो रहा है...' : 'Loading verified scheme details...'}
        </p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-red-900 mb-2">
            {isHi ? 'योजना नहीं मिली' : 'Scheme Not Found'}
          </h2>
          <p className="text-sm text-red-700 mb-6">{error || 'Requested scheme does not exist.'}</p>
          <Link
            href="/schemes"
            className="px-5 py-2.5 bg-emerald-800 text-white font-semibold rounded-xl text-sm"
          >
            {isHi ? 'योजना निर्देशिका पर वापस जाएं' : 'Back to Directory'}
          </Link>
        </div>
      </div>
    );
  }

  const primaryTitle = isHi ? scheme.titleHi : scheme.titleEn;
  const secondaryTitle = isHi ? scheme.titleEn : scheme.titleHi;
  const summary = isHi ? scheme.summaryHi : scheme.summaryEn;
  const details = isHi ? scheme.detailsHi || scheme.summaryHi : scheme.detailsEn || scheme.summaryEn;
  const benefits = isHi ? scheme.benefitsHi : scheme.benefitsEn;

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <Link
          href="/schemes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? 'योजना निर्देशिका' : 'Back to Schemes'}</span>
        </Link>

        {/* Scheme Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {scheme.category}
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-800">
                {scheme.code}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{scheme.level === 'CENTRAL' ? (isHi ? 'केंद्रीय सरकार' : 'Central Government') : scheme.state}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
            {primaryTitle}
          </h1>
          <p className="text-sm text-gray-500 italic mb-6">{secondaryTitle}</p>

          <p className="text-base text-gray-700 leading-relaxed mb-6">{summary}</p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            {scheme.applicationUrl && (
              <a
                href={scheme.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm transition flex items-center gap-2 shadow-xs"
              >
                <span>{isHi ? 'आधिकारिक आवेदन पोर्टल' : 'Official Application Portal'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <a
              href={scheme.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-sm transition flex items-center gap-2"
            >
              <span>{isHi ? 'मंत्रालय दिशानिर्देश' : 'Ministry Guidelines'}</span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>

            <div className="ml-auto text-xs text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{isHi ? 'सत्यापन तिथि:' : 'Verified on:'} {new Date(scheme.verifiedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Details & Criteria vs Quick Eligibility Check */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Benefits Box */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{isHi ? 'योजना के प्रमुख लाभ एवं वित्तीय सहायता' : 'Key Scheme Benefits & Assistance'}</span>
              </h2>
              <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-4 text-sm text-emerald-950 leading-relaxed font-medium">
                {benefits}
              </div>
            </div>

            {/* In-Depth Details */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>{isHi ? 'विस्तृत विवरण एवं उद्देश्य' : 'Detailed Overview & Objectives'}</span>
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{details}</p>
            </div>

            {/* Mandatory Criteria List */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>{isHi ? 'अनिवार्य पात्रता शर्तें (नियम इंजन)' : 'Mandatory Eligibility Criteria'}</span>
              </h2>

              {scheme.criteria && scheme.criteria.length > 0 ? (
                <div className="space-y-3">
                  {scheme.criteria.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm"
                    >
                      <div>
                        <span className="font-semibold text-gray-900 block mb-0.5">
                          {isHi ? c.labelHi : c.labelEn}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {c.field} {c.operator} {JSON.stringify(c.value)}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        {isHi ? 'अनिवार्य' : 'Mandatory'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {isHi ? 'सार्वभौमिक पात्रता लागू है।' : 'Universal public eligibility applies.'}
                </p>
              )}
            </div>
          </div>

          {/* Quick Eligibility Evaluator Sidebar (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-emerald-800/20 p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-gray-900">
                  {isHi ? 'त्वरित पात्रता जांच' : 'Check Your Eligibility'}
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-5">
                {isHi
                  ? 'अपना विवरण दर्ज करें और जानें कि क्या आप इस योजना के लिए पात्र हैं।'
                  : 'Enter your basic details to test deterministic rule compliance instantly.'}
              </p>

              <form onSubmit={handleQuickCheck} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {isHi ? 'आपकी आयु (Age in Years)' : 'Age (Years)'}
                  </label>
                  <input
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {isHi ? 'लिंग (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="">{isHi ? 'चयन करें' : 'Select'}</option>
                    <option value="MALE">{isHi ? 'पुरुष (Male)' : 'Male'}</option>
                    <option value="FEMALE">{isHi ? 'महिला (Female)' : 'Female'}</option>
                    <option value="OTHER">{isHi ? 'अन्य (Other)' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {isHi ? 'व्यवसाय (Occupation)' : 'Occupation'}
                  </label>
                  <select
                    value={userOccupation}
                    onChange={(e) => setUserOccupation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="">{isHi ? 'चयन करें' : 'Select'}</option>
                    <option value="FARMER">{isHi ? 'किसान (Farmer)' : 'Farmer'}</option>
                    <option value="STUDENT">{isHi ? 'छात्र (Student)' : 'Student'}</option>
                    <option value="VENDOR">{isHi ? 'रेहड़ी-पटरी वेंडर (Street Vendor)' : 'Street Vendor'}</option>
                    <option value="DAILY_WAGE_WORKER">{isHi ? 'दैनिक मजदूर (Daily Wage Worker)' : 'Daily Wage Worker'}</option>
                    <option value="OTHER">{isHi ? 'अन्य (Other)' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {isHi ? 'वार्षिक पारिवारिक आय (₹)' : 'Annual Household Income (₹)'}
                  </label>
                  <input
                    type="number"
                    value={userIncome}
                    onChange={(e) => setUserIncome(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isEvaluating}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEvaluating ? (isHi ? 'जांच हो रही है...' : 'Evaluating...') : isHi ? 'मेरी पात्रता जांचें' : 'Evaluate Eligibility'}</span>
                </button>
              </form>

              {/* Evaluation Result Feedback */}
              {evaluationResult && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    {evaluationResult.status === 'POTENTIALLY_ELIGIBLE' && (
                      <div className="bg-emerald-100 text-emerald-950 p-3 rounded-xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{isHi ? 'बधाई! आप इस योजना के लिए संभावित पात्र हैं।' : 'You appear POTENTIALLY ELIGIBLE!'}</span>
                      </div>
                    )}
                    {evaluationResult.status === 'NOT_ELIGIBLE' && (
                      <div className="bg-red-50 text-red-950 p-3 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{isHi ? 'आप वर्तमान में इस योजना की शर्तों को पूरा नहीं करते।' : 'You are currently NOT ELIGIBLE.'}</span>
                      </div>
                    )}
                    {evaluationResult.status === 'NEEDS_INFORMATION' && (
                      <div className="bg-amber-50 text-amber-950 p-3 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{isHi ? 'पात्रता निर्धारण के लिए अतिरिक्त जानकारी चाहिए।' : 'NEEDS ADDITIONAL INFORMATION.'}</span>
                      </div>
                    )}
                  </div>

                  {explanationText && (
                    <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-3 leading-relaxed whitespace-pre-line">
                      <span className="font-semibold text-gray-900 block mb-1">
                        {isHi ? 'नियम-आधारित स्पष्टीकरण:' : 'Grounded Explanation:'}
                      </span>
                      {explanationText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SchemeDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
          Loading scheme details...
        </div>
      }
    >
      <SchemeDetailContent />
    </Suspense>
  );
}
