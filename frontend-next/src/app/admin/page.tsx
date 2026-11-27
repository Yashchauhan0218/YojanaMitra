'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  adminFetchSchemes,
  adminCreateScheme,
  adminUpdateStatus,
  adminFetchAuditLogs,
} from '../../lib/api';
import type { Scheme } from '../../lib/types';
import {
  Lock,
  PlusCircle,
  RefreshCw,
  Clock,
  KeyRound,
  Landmark,
} from 'lucide-react';

export default function AdminPage() {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Scheme Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newSummaryEn, setNewSummaryEn] = useState('');
  const [newSummaryHi, setNewSummaryHi] = useState('');
  const [newBenefitsEn, setNewBenefitsEn] = useState('');
  const [newBenefitsHi, setNewBenefitsHi] = useState('');
  const [newCategory, setNewCategory] = useState('Agriculture');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newApplicationUrl, setNewApplicationUrl] = useState('');

  // Initial criterion
  const [critField, setCritField] = useState('age');
  const [critOperator, setCritOperator] = useState('gte');
  const [critValue, setCritValue] = useState('18');
  const [critLabelEn, setCritLabelEn] = useState('Minimum age 18');
  const [critLabelHi, setCritLabelHi] = useState('न्यूनतम आयु 18 वर्ष');

  const loadAdminData = async () => {
    setStatusMessage(null);
    try {
      const [schemesRes, logsRes] = await Promise.all([
        adminFetchSchemes(),
        adminFetchAuditLogs(),
      ]);
      setSchemes(schemesRes.schemes || []);
      setAuditLogs(logsRes.logs || []);
    } catch (err: any) {
      console.warn('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('ym_admin_key');
    if (saved) {
      setAdminKey(saved);
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setAuthError('Please enter admin API authorization key.');
      return;
    }
    sessionStorage.setItem('ym_admin_key', adminKey.trim());
    setIsAuthenticated(true);
    setAuthError(null);
    loadAdminData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ym_admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
  };

  const handleStatusChange = async (schemeId: string, nextStatus: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED') => {
    try {
      setStatusMessage(null);
      await adminUpdateStatus(schemeId, nextStatus, adminKey);
      setStatusMessage(`Scheme status updated to ${nextStatus}.`);
      loadAdminData();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    let parsedVal: any = critValue;
    if (!isNaN(Number(critValue))) {
      parsedVal = Number(critValue);
    }

    const payload = {
      code: newCode.trim(),
      titleEn: newTitleEn.trim(),
      titleHi: newTitleHi.trim(),
      summaryEn: newSummaryEn.trim(),
      summaryHi: newSummaryHi.trim(),
      benefitsEn: newBenefitsEn.trim(),
      benefitsHi: newBenefitsHi.trim(),
      category: newCategory,
      sourceUrl: newSourceUrl.trim(),
      applicationUrl: newApplicationUrl.trim() || undefined,
      criteria: [
        {
          field: critField.trim(),
          operator: critOperator,
          value: parsedVal,
          labelEn: critLabelEn.trim(),
          labelHi: critLabelHi.trim(),
          isMandatory: true,
        },
      ],
    };

    try {
      await adminCreateScheme(payload, adminKey);
      setStatusMessage(`Scheme "${payload.code}" created successfully.`);
      setShowAddModal(false);
      loadAdminData();
    } catch (err: any) {
      alert(`Failed to create scheme: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-8 sm:py-12 text-[#202923]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Toolbar */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 mb-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#173F35] text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5 text-[#D99A42]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#202923] tracking-tight">
                {isHi ? 'प्रशासन एवं योजना प्रबंधन' : 'Civic Admin & Scheme Management'}
              </h1>
              <p className="text-xs text-[#69756D]">
                {isHi
                  ? 'सरकारी योजनाओं का प्रकाशन, संपादन एवं ऑडिट ट्रेल'
                  : 'Authenticated public record governance & deterministic criteria'}
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 bg-[#173F35] hover:bg-[#2F6B52] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isHi ? 'नई योजना जोड़ें' : 'Add Scheme'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 border border-[#E3E7E1] bg-[#FFFFFF] hover:bg-[#FCEEEE] hover:text-[#8E3030] text-[#202923] rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                {isHi ? 'लॉगआउट' : 'Log Out'}
              </button>
            </div>
          )}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mb-6 p-3 bg-[#EAF4EE] text-[#1B6A47] border border-[#C8E6D3] rounded-lg text-xs font-semibold">
            {statusMessage}
          </div>
        )}

        {/* Authentication Wall if not logged in */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-8 shadow-xs text-center">
            <div className="w-10 h-10 rounded-lg bg-[#E8F0E8] text-[#173F35] flex items-center justify-center mx-auto mb-4 border border-[#E3E7E1]">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#202923] mb-1">
              {isHi ? 'प्रशासन प्रमाणीकरण आवश्यक' : 'Admin Authorization Required'}
            </h2>
            <p className="text-xs text-[#69756D] mb-5 leading-relaxed">
              {isHi
                ? 'योजनाओं के प्रकाशन और संशोधन के लिए बैकएंड ADMIN_API_KEY दर्ज करें।'
                : 'Enter your server ADMIN_API_KEY to unlock scheme management operations.'}
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter ADMIN_API_KEY..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3E7E1] text-xs focus:outline-none focus:border-[#173F35] bg-[#F7F5EF]/30 focus:bg-[#FFFFFF]"
                />
              </div>

              {authError && <p className="text-xs text-[#8E3030] font-semibold">{authError}</p>}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#173F35] hover:bg-[#2F6B52] text-white font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isHi ? 'सत्यापित करें एवं प्रवेश करें' : 'Authorize & Enter'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Schemes Management Table (Minimal Fintech table) */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-[#E3E7E1] flex items-center justify-between">
                <h2 className="font-bold text-[#202923] text-sm">
                  {isHi ? 'पंजीकृत योजनाएं (प्रकाशन स्थिति)' : 'Registered Schemes (Publishing Status)'}
                </h2>
                <button
                  onClick={loadAdminData}
                  className="text-xs text-[#173F35] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isHi ? 'ताज़ा करें' : 'Refresh'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F5EF] text-[#69756D] uppercase font-semibold border-b border-[#E3E7E1]">
                    <tr>
                      <th className="px-4 py-2.5">Code / Name</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Criteria Count</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E7E1]">
                    {schemes.map((s) => (
                      <tr key={s.id} className="hover:bg-[#F7F5EF]/50 transition">
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#202923] block font-mono">{s.code}</span>
                          <span className="text-[#69756D] line-clamp-1">{s.titleEn}</span>
                        </td>
                        <td className="px-4 py-3 text-[#202923]">{s.category}</td>
                        <td className="px-4 py-3 text-[#69756D] font-medium">
                          {s.criteria?.length || 0} rules
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${
                              s.status === 'PUBLISHED'
                                ? 'bg-[#EAF4EE] text-[#1B6A47] border-[#C8E6D3]'
                                : s.status === 'DRAFT'
                                ? 'bg-[#FCF5E8] text-[#9E6714] border-[#F5DFB5]'
                                : 'bg-[#F7F5EF] text-[#69756D] border-[#E3E7E1]'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          {s.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => handleStatusChange(s.id, 'PUBLISHED')}
                              className="px-2.5 py-1 bg-[#EAF4EE] text-[#1B6A47] hover:bg-[#d8ecdf] rounded-md font-semibold transition cursor-pointer"
                            >
                              Publish
                            </button>
                          )}
                          {s.status !== 'DRAFT' && (
                            <button
                              onClick={() => handleStatusChange(s.id, 'DRAFT')}
                              className="px-2.5 py-1 bg-[#FCF5E8] text-[#9E6714] hover:bg-[#faeed6] rounded-md font-semibold transition cursor-pointer"
                            >
                              Draft
                            </button>
                          )}
                          {s.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleStatusChange(s.id, 'ARCHIVED')}
                              className="px-2.5 py-1 bg-[#F7F5EF] text-[#69756D] hover:bg-[#E8F0E8] rounded-md font-semibold transition cursor-pointer"
                            >
                              Archive
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Logs Box */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-5 shadow-xs">
              <h2 className="font-bold text-[#202923] text-sm mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2F6B52]" />
                <span>{isHi ? 'प्रशासन ऑडिट लॉग्स' : 'Administrative Audit Logs'}</span>
              </h2>

              {auditLogs.length === 0 ? (
                <div className="text-xs text-[#69756D] italic p-4 text-center bg-[#F7F5EF]/60 rounded-lg border border-[#E3E7E1]">
                  {isHi ? 'अभी तक कोई ऑडिट लॉग रिकॉर्ड नहीं हुआ है।' : 'No audit records logged yet.'}
                </div>
              ) : (
                <div className="divide-y divide-[#E3E7E1] text-xs">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-[#202923] mr-2">{log.adminAction}</span>
                        <span className="text-[#69756D] font-mono text-[11px]">
                          {log.entityType} ({JSON.stringify(log.metadata)})
                        </span>
                      </div>
                      <span className="text-[#69756D] text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Create Scheme */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-lg border border-[#E3E7E1]">
              <div className="flex items-center justify-between mb-4 border-b border-[#E3E7E1] pb-3">
                <h3 className="text-base font-bold text-[#202923]">
                  {isHi ? 'नई योजना जोड़ें (सत्यापित विवरण)' : 'Add Verified Government Scheme'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#69756D] hover:text-[#202923] text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateScheme} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Scheme Code</label>
                    <input
                      type="text"
                      required
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="e.g. PM-AWAS-GRAMIN"
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    >
                      <option value="Agriculture">Agriculture</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Social Security">Social Security</option>
                      <option value="Women & Child">Women & Child</option>
                      <option value="Housing">Housing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Title (English)</label>
                    <input
                      type="text"
                      required
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="e.g. Pradhan Mantri Awas Yojana"
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Title (Hindi)</label>
                    <input
                      type="text"
                      required
                      value={newTitleHi}
                      onChange={(e) => setNewTitleHi(e.target.value)}
                      placeholder="e.g. प्रधानमंत्री आवास योजना"
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#202923] mb-1">Summary (English)</label>
                  <textarea
                    required
                    rows={2}
                    value={newSummaryEn}
                    onChange={(e) => setNewSummaryEn(e.target.value)}
                    placeholder="Clear English summary..."
                    className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#202923] mb-1">Summary (Hindi)</label>
                  <textarea
                    required
                    rows={2}
                    value={newSummaryHi}
                    onChange={(e) => setNewSummaryHi(e.target.value)}
                    placeholder="सरल हिंदी सारांश..."
                    className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Benefits (English)</label>
                    <input
                      type="text"
                      required
                      value={newBenefitsEn}
                      onChange={(e) => setNewBenefitsEn(e.target.value)}
                      placeholder="e.g. ₹1,20,000 for housing construction"
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Benefits (Hindi)</label>
                    <input
                      type="text"
                      required
                      value={newBenefitsHi}
                      onChange={(e) => setNewBenefitsHi(e.target.value)}
                      placeholder="e.g. आवास निर्माण हेतु ₹1,20,000"
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Official Source URL</label>
                    <input
                      type="url"
                      required
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      placeholder="https://pmayg.nic.in"
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202923] mb-1">Application URL (optional)</label>
                    <input
                      type="url"
                      value={newApplicationUrl}
                      onChange={(e) => setNewApplicationUrl(e.target.value)}
                      placeholder="https://pmayg.nic.in/apply"
                      className="w-full p-2 border border-[#E3E7E1] rounded-lg bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35]"
                    />
                  </div>
                </div>

                {/* Primary Criterion Builder */}
                <div className="p-3 bg-[#F7F5EF] rounded-lg border border-[#E3E7E1]">
                  <span className="font-bold text-[#202923] block mb-2">Initial Rule Criterion</span>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={critField}
                      onChange={(e) => setCritField(e.target.value)}
                      placeholder="field (age, income)"
                      className="p-1.5 border border-[#E3E7E1] rounded bg-white text-xs"
                    />
                    <select
                      value={critOperator}
                      onChange={(e) => setCritOperator(e.target.value)}
                      className="p-1.5 border border-[#E3E7E1] rounded bg-white text-xs"
                    >
                      <option value="gte">gte (&gt;=)</option>
                      <option value="lte">lte (&lt;=)</option>
                      <option value="eq">eq (==)</option>
                      <option value="in">in</option>
                    </select>
                    <input
                      type="text"
                      value={critValue}
                      onChange={(e) => setCritValue(e.target.value)}
                      placeholder="value"
                      className="p-1.5 border border-[#E3E7E1] rounded bg-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={critLabelEn}
                      onChange={(e) => setCritLabelEn(e.target.value)}
                      placeholder="Criterion Label (English)"
                      className="p-1.5 border border-[#E3E7E1] rounded bg-white text-xs"
                    />
                    <input
                      type="text"
                      value={critLabelHi}
                      onChange={(e) => setCritLabelHi(e.target.value)}
                      placeholder="Criterion Label (Hindi)"
                      className="p-1.5 border border-[#E3E7E1] rounded bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 border border-[#E3E7E1] rounded-lg text-[#69756D] hover:bg-[#F7F5EF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#173F35] hover:bg-[#2F6B52] text-white font-semibold rounded-lg shadow-xs"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
