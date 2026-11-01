'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  adminFetchSchemes,
  adminCreateScheme,
  adminUpdateStatus,
  adminFetchAuditLogs,
} from '../../lib/api';
import { Scheme } from '../../lib/types';
import {
  ShieldCheck,
  Lock,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Clock,
  KeyRound,
} from 'lucide-react';

export default function AdminPage() {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check saved key in session storage
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
      status: 'PUBLISHED',
      criteria: [
        {
          field: critField,
          operator: critOperator,
          value: parsedVal,
          labelEn: critLabelEn,
          labelHi: critLabelHi,
          isMandatory: true,
        },
      ],
    };

    try {
      await adminCreateScheme(payload, adminKey);
      setStatusMessage(`Verified Scheme ${newCode} created successfully!`);
      setShowAddModal(false);
      // Reset form
      setNewCode('');
      setNewTitleEn('');
      setNewTitleHi('');
      setNewSummaryEn('');
      setNewSummaryHi('');
      setNewBenefitsEn('');
      setNewBenefitsHi('');
      setNewSourceUrl('');
      setNewApplicationUrl('');
      loadAdminData();
    } catch (err: any) {
      alert(`Error creating scheme: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isHi ? 'सुरक्षित प्रशासन पोर्टल' : 'Secure Admin Operations'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {isHi ? 'योजनामित्र प्रशासन एवं सत्यापन' : 'YojanaMitra Admin Portal'}
            </h1>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isHi ? 'नई योजना जोड़ें' : 'Add New Scheme'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition"
              >
                {isHi ? 'लॉगआउट' : 'Lock Session'}
              </button>
            </div>
          )}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Authentication Wall if not logged in */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200/80 p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {isHi ? 'प्रशासन प्रमाणीकरण आवश्यक' : 'Admin Authorization Required'}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              {isHi
                ? 'योजनाओं के प्रकाशन और संशोधन के लिए बैकएंड ADMIN_API_KEY दर्ज करें।'
                : 'Enter your server ADMIN_API_KEY (default: "admin-secret-token-change-in-production") to unlock management operations.'}
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter ADMIN_API_KEY..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {authError && <p className="text-xs text-red-600">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isHi ? 'सत्यापित करें एवं प्रवेश करें' : 'Authorize & Enter'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Schemes Management Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-base">
                  {isHi ? 'पंजीकृत योजनाएं (प्रकाशन स्थिति)' : 'Registered Schemes (Publishing Status)'}
                </h2>
                <button
                  onClick={loadAdminData}
                  className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isHi ? 'ताज़ा करें' : 'Refresh'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Code / Name</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Criteria Count</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {schemes.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/60 transition">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-gray-900 block font-mono">{s.code}</span>
                          <span className="text-gray-500 line-clamp-1">{s.titleEn}</span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-700">{s.category}</td>
                        <td className="px-5 py-3.5 text-gray-700 font-medium">
                          {s.criteria?.length || 0} rules
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              s.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : s.status === 'DRAFT'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-1.5">
                          {s.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => handleStatusChange(s.id, 'PUBLISHED')}
                              className="px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-md font-semibold transition"
                            >
                              Publish
                            </button>
                          )}
                          {s.status !== 'DRAFT' && (
                            <button
                              onClick={() => handleStatusChange(s.id, 'DRAFT')}
                              className="px-2.5 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-md font-semibold transition"
                            >
                              Draft
                            </button>
                          )}
                          {s.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleStatusChange(s.id, 'ARCHIVED')}
                              className="px-2.5 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-semibold transition"
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
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>{isHi ? 'प्रशासन ऑडिट लॉग्स' : 'Administrative Audit Logs'}</span>
              </h2>

              {auditLogs.length === 0 ? (
                <div className="text-xs text-gray-500 italic p-4 text-center bg-gray-50 rounded-xl">
                  {isHi ? 'अभी तक कोई ऑडिट लॉग रिकॉर्ड नहीं हुआ है।' : 'No audit records logged yet.'}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 text-xs">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800 mr-2">{log.adminAction}</span>
                        <span className="text-gray-500 font-mono">
                          {log.entityType} ({JSON.stringify(log.metadata)})
                        </span>
                      </div>
                      <span className="text-gray-400">
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
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {isHi ? 'नई योजना जोड़ें (सत्यापित विवरण)' : 'Add Verified Government Scheme'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateScheme} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Scheme Code</label>
                    <input
                      type="text"
                      required
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="e.g. PM-AWAS-GRAMIN"
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 border rounded-lg bg-white"
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
                    <label className="block font-medium text-gray-700 mb-1">Title (English)</label>
                    <input
                      type="text"
                      required
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="e.g. Pradhan Mantri Awas Yojana"
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Title (Hindi)</label>
                    <input
                      type="text"
                      required
                      value={newTitleHi}
                      onChange={(e) => setNewTitleHi(e.target.value)}
                      placeholder="e.g. प्रधानमंत्री आवास योजना"
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Summary (English)</label>
                  <textarea
                    required
                    rows={2}
                    value={newSummaryEn}
                    onChange={(e) => setNewSummaryEn(e.target.value)}
                    placeholder="Clear English summary..."
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Summary (Hindi)</label>
                  <textarea
                    required
                    rows={2}
                    value={newSummaryHi}
                    onChange={(e) => setNewSummaryHi(e.target.value)}
                    placeholder="सरल हिंदी सारांश..."
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Benefits (English)</label>
                    <input
                      type="text"
                      required
                      value={newBenefitsEn}
                      onChange={(e) => setNewBenefitsEn(e.target.value)}
                      placeholder="e.g. ₹1,20,000 for housing construction"
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Benefits (Hindi)</label>
                    <input
                      type="text"
                      required
                      value={newBenefitsHi}
                      onChange={(e) => setNewBenefitsHi(e.target.value)}
                      placeholder="e.g. आवास निर्माण हेतु ₹1,20,000"
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Official Source URL</label>
                    <input
                      type="url"
                      required
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      placeholder="https://pmayg.nic.in"
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Application URL (optional)</label>
                    <input
                      type="url"
                      value={newApplicationUrl}
                      onChange={(e) => setNewApplicationUrl(e.target.value)}
                      placeholder="https://pmayg.nic.in/apply"
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Primary Criterion Builder */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-800 block mb-2">Initial Rule Criterion</span>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={critField}
                      onChange={(e) => setCritField(e.target.value)}
                      placeholder="field (age, income)"
                      className="p-2 border rounded"
                    />
                    <select
                      value={critOperator}
                      onChange={(e) => setCritOperator(e.target.value)}
                      className="p-2 border rounded bg-white"
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
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={critLabelEn}
                      onChange={(e) => setCritLabelEn(e.target.value)}
                      placeholder="Criterion Label (English)"
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      value={critLabelHi}
                      onChange={(e) => setCritLabelHi(e.target.value)}
                      placeholder="Criterion Label (Hindi)"
                      className="p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
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
