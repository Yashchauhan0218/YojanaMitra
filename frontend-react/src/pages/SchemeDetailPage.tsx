import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchSchemeById, checkEligibility } from '../lib/api';
import type { Scheme, SchemeEvaluation } from '../lib/types';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileText,
  HelpCircle,
  XCircle,
  Landmark,
  Scale,
  Sparkles,
} from 'lucide-react';

export default function SchemeDetailPage() {
  const { id: schemeId } = useParams<{ id: string }>();

  const { language } = useLanguage();
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
  const [evalError, setEvalError] = useState<string | null>(null);

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
    setEvalError(null);

    const profile: Record<string, any> = {};
    if (userAge) profile.age = parseInt(userAge, 10);
    if (userGender) profile.gender = userGender;
    if (userIncome) profile.annual_income = parseFloat(userIncome);
    if (userOccupation) profile.occupation = userOccupation;

    try {
      // When schemeId is passed the backend returns { evaluation, explanation }
      // (single-scheme mode) rather than { results: { potentiallyEligible, ... } }
      const res = await checkEligibility({
        profile,
        schemeId: scheme.id,
        language,
        includeExplanations: true,
      }) as any;

      // --- Single-scheme response ---
      if (res.evaluation) {
        const evalItem: SchemeEvaluation = {
          ...res.evaluation,
          explanation: res.explanation
            ? { explanation: res.explanation.explanation ?? res.explanation, isAiGenerated: res.explanation.isAiGenerated ?? false, source: res.explanation.source ?? '' }
            : undefined,
        };
        setEvaluationResult(evalItem);
        setExplanationText(res.explanation?.explanation ?? null);
        return;
      }

      // --- Multi-scheme response (fallback) ---
      if (res.results) {
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
      console.error('Evaluation check error:', err);
      setEvalError(err.message || 'Unable to evaluate eligibility. Please ensure the backend is running.');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-[#173F35] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#69756D] font-medium">
            {isHi ? 'प्रमाणित योजना का विवरण लोड हो रहा है...' : 'Loading verified scheme details...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-6 text-center">
        <div className="bg-[#FFFFFF] border border-[#E3E7E1] rounded-xl p-8 max-w-md w-full shadow-xs">
          <XCircle className="w-10 h-10 text-[#8E3030] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#202923] mb-1">
            {isHi ? 'योजना नहीं मिली' : 'Scheme Not Found'}
          </h2>
          <p className="text-xs text-[#69756D] mb-5">{error || 'Requested scheme does not exist.'}</p>
          <Link
            to="/schemes"
            className="inline-flex px-4 py-2 bg-[#173F35] hover:bg-[#2F6B52] text-[#FFFFFF] font-semibold rounded-lg text-xs transition"
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
    <div className="bg-[#F7F5EF] min-h-screen py-8 sm:py-12 text-[#202923]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173F35] hover:text-[#2F6B52] mb-5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHi ? 'योजना निर्देशिका पर वापस' : 'Back to Directory'}</span>
        </Link>

        {/* Scheme Header Card (Civic Editorial Authority Card) */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1]">
                {scheme.category}
              </span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#69756D] border border-[#E3E7E1]">
                {scheme.code}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-[#173F35]">
              <Landmark className="w-3.5 h-3.5 text-[#2F6B52]" />
              <span>
                {scheme.level === 'CENTRAL'
                  ? isHi
                    ? 'केंद्रीय सरकार'
                    : 'Central Government'
                  : scheme.state}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202923] leading-tight mb-2 tracking-tight">
            {primaryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#69756D] mb-4 font-normal">{secondaryTitle}</p>

          <p className="text-sm text-[#202923]/90 leading-relaxed mb-6 font-normal">{summary}</p>

          {/* Action and Source Links */}
          <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[#E3E7E1]">
            {scheme.applicationUrl && (
              <a
                href={scheme.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#173F35] hover:bg-[#2F6B52] text-[#FFFFFF] font-semibold text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <span>{isHi ? 'आधिकारिक आवेदन पोर्टल' : 'Official Application Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={scheme.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-[#E3E7E1] bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#202923] font-semibold text-xs transition flex items-center gap-1.5"
            >
              <span>{isHi ? 'मंत्रालय दिशानिर्देश' : 'Ministry Guidelines'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#69756D]" />
            </a>

            <div className="ml-auto text-xs text-[#69756D] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {isHi ? 'सत्यापन तिथि:' : 'Verified on:'}{' '}
                {new Date(scheme.verifiedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Details & Criteria vs Quick Eligibility Check */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Key Benefits Card */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
              <h2 className="text-base font-bold text-[#202923] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F6B52]" />
                <span>{isHi ? 'योजना के प्रमुख लाभ एवं सहायता' : 'Key Scheme Benefits & Assistance'}</span>
              </h2>
              <div className="bg-[#F7F5EF] border border-[#E3E7E1] rounded-lg p-4 text-xs sm:text-sm text-[#202923] leading-relaxed font-medium">
                {benefits}
              </div>
            </div>

            {/* In-Depth Details */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
              <h2 className="text-base font-bold text-[#202923] mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2F6B52]" />
                <span>{isHi ? 'विस्तृत विवरण एवं उद्देश्य' : 'Detailed Overview & Objectives'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#202923]/90 leading-relaxed whitespace-pre-line font-normal">
                {details}
              </p>
            </div>

            {/* Mandatory Criteria List */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
              <h2 className="text-base font-bold text-[#202923] mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#2F6B52]" />
                <span>{isHi ? 'अनिवार्य पात्रता शर्तें (नियम इंजन)' : 'Mandatory Eligibility Criteria'}</span>
              </h2>

              {scheme.criteria && scheme.criteria.length > 0 ? (
                <div className="space-y-2.5">
                  {scheme.criteria.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg border border-[#E3E7E1] bg-[#F7F5EF]/40 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#202923] block mb-0.5">
                          {isHi ? c.labelHi : c.labelEn}
                        </span>
                        <span className="text-[11px] text-[#69756D] font-mono">
                          {c.field} {c.operator} {JSON.stringify(c.value)}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1] shrink-0">
                        {isHi ? 'अनिवार्य' : 'Mandatory'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#69756D] italic">
                  {isHi ? 'सार्वभौमिक पात्रता लागू है।' : 'Universal public eligibility applies.'}
                </p>
              )}
            </div>

            {/* Official Sources Citation */}
            {scheme.sources && scheme.sources.length > 0 && (
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs">
                <h2 className="text-base font-bold text-[#202923] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F6B52]" />
                  <span>{isHi ? 'प्रमाणित सरकारी स्रोत' : 'Official Data Sources'}</span>
                </h2>
                <div className="space-y-2">
                  {scheme.sources.map((src, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-[#E3E7E1] bg-[#F7F5EF]/30"
                    >
                      <span className="font-medium text-[#202923]">{src.title}</span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#173F35] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>{src.sourceType}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Eligibility Evaluator Sidebar (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 sm:p-6 shadow-xs sticky top-24">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#D99A42]" />
                <h3 className="text-base font-bold text-[#202923]">
                  {isHi ? 'त्वरित पात्रता जांच' : 'Check Your Eligibility'}
                </h3>
              </div>
              <p className="text-xs text-[#69756D] mb-4 leading-relaxed font-normal">
                {isHi
                  ? 'अपना विवरण दर्ज करें और नियम इंजन से तुरंत अपनी पात्रता जांचें।'
                  : 'Enter your basic details to test deterministic rule compliance instantly.'}
              </p>

              <form onSubmit={handleQuickCheck} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    {isHi ? 'आपकी आयु (Age in Years)' : 'Age (Years)'}
                  </label>
                  <input
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E7E1] text-xs focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    {isHi ? 'लिंग (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E7E1] text-xs focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] text-[#202923]"
                  >
                    <option value="">{isHi ? 'चयन करें' : 'Select'}</option>
                    <option value="MALE">{isHi ? 'पुरुष (Male)' : 'Male'}</option>
                    <option value="FEMALE">{isHi ? 'महिला (Female)' : 'Female'}</option>
                    <option value="OTHER">{isHi ? 'अन्य (Other)' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    {isHi ? 'व्यवसाय (Occupation)' : 'Occupation'}
                  </label>
                  <select
                    value={userOccupation}
                    onChange={(e) => setUserOccupation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E7E1] text-xs focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] text-[#202923]"
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
                  <label className="block text-xs font-semibold text-[#202923] mb-1">
                    {isHi ? 'वार्षिक पारिवारिक आय (₹)' : 'Annual Household Income (₹)'}
                  </label>
                  <input
                    type="number"
                    value={userIncome}
                    onChange={(e) => setUserIncome(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full px-3 py-2 rounded-lg border border-[#E3E7E1] text-xs focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isEvaluating}
                  className="w-full py-2.5 bg-[#173F35] hover:bg-[#2F6B52] text-[#FFFFFF] font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {isEvaluating
                      ? isHi
                        ? 'जांच हो रही है...'
                        : 'Evaluating...'
                      : isHi
                      ? 'मेरी पात्रता जांचें'
                      : 'Evaluate Eligibility'}
                  </span>
                </button>
              </form>

              {/* Evaluation Error */}
              {evalError && (
                <div className="mt-4 bg-[#FCEEEE] text-[#8E3030] p-3 rounded-lg border border-[#F4C7C7] text-xs font-medium flex items-start gap-2">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#8E3030]" />
                  <span>{evalError}</span>
                </div>
              )}

              {/* Evaluation Result Feedback */}
              {evaluationResult && (
                <div className="mt-4 pt-4 border-t border-[#E3E7E1]">
                  <div className="mb-3">
                    {evaluationResult.status === 'POTENTIALLY_ELIGIBLE' && (
                      <div className="bg-[#EAF4EE] text-[#1B6A47] p-3 rounded-lg border border-[#C8E6D3] text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1B6A47]" />
                        <span>{isHi ? 'बधाई! आप इस योजना के लिए संभावित पात्र हैं।' : 'You appear POTENTIALLY ELIGIBLE!'}</span>
                      </div>
                    )}
                    {evaluationResult.status === 'NOT_ELIGIBLE' && (
                      <div className="bg-[#FCEEEE] text-[#8E3030] p-3 rounded-lg border border-[#F4C7C7] text-xs font-bold flex items-center gap-2">
                        <XCircle className="w-4 h-4 shrink-0 text-[#8E3030]" />
                        <span>{isHi ? 'आप वर्तमान में इस योजना की शर्तों को पूरा नहीं करते।' : 'You are currently NOT ELIGIBLE.'}</span>
                      </div>
                    )}
                    {evaluationResult.status === 'NEEDS_INFORMATION' && (
                      <div className="bg-[#FCF5E8] text-[#9E6714] p-3 rounded-lg border border-[#F5DFB5] text-xs font-bold flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 shrink-0 text-[#9E6714]" />
                        <span>{isHi ? 'पात्रता निर्धारण के लिए अतिरिक्त जानकारी चाहिए।' : 'NEEDS ADDITIONAL INFORMATION.'}</span>
                      </div>
                    )}
                  </div>

                  {explanationText && (
                    <div className="text-xs text-[#202923] bg-[#F7F5EF] border border-[#E3E7E1] rounded-lg p-3 leading-relaxed whitespace-pre-line font-normal">
                      <span className="font-bold text-[#173F35] block mb-1">
                        {isHi ? 'नियम-आधारित स्पष्टीकरण:' : 'Grounded Explanation:'}
                      </span>
                      {explanationText}
                    </div>
                  )}
                </div>
              )}

              {/* Authority Disclaimer Note */}
              <div className="mt-4 pt-3 border-t border-[#E3E7E1] text-[11px] text-[#69756D] leading-tight">
                {isHi
                  ? 'अंतिम पात्रता निर्णय संबंधित अधिकृत मंत्रालय या नोडल एजेंसी द्वारा निर्धारित किया जाता है।'
                  : 'Final eligibility determination is subject to document verification by the administering ministry/authority.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
