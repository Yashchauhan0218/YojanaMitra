'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { sendChatMessage } from '../../lib/api';
import { ChatMessage, SchemeEvaluation } from '../../lib/types';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function AssistantPage() {
  const { language, setLanguage, t } = useLanguage();
  const isHi = language === 'hi';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [eligibleSchemes, setEligibleSchemes] = useState<SchemeEvaluation[]>([]);
  const [needsInfoSchemes, setNeedsInfoSchemes] = useState<SchemeEvaluation[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    const initialWelcome: ChatMessage = {
      id: 'welcome-1',
      sender: 'assistant',
      text: isHi
        ? 'नमस्ते! मैं योजनामित्र का एआई सहायक हूँ। आप अपनी उम्र, राज्य, व्यवसाय (जैसे किसान, छात्र, व्यवसायी), या पारिवारिक आय बोलकर या लिखकर बताएं। मैं आपकी सही सरकारी योजनाएं खोजने में सहायता करूँगा।'
        : 'Hello! I am your YojanaMitra AI Assistant. Please share your age, state, occupation (e.g. farmer, student, vendor), or annual income in Hindi or English. I will help you identify verified welfare schemes you may qualify for.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiGenerated: true,
    };
    setMessages([initialWelcome]);
  }, [isHi]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recognition hook
  const {
    isListening,
    transcript,
    isSupported,
    errorMessage: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    language,
    onResult: (finalText) => {
      if (finalText.trim()) {
        setInputText(finalText);
      }
    },
  });

  // When speech transcript updates, sync with input
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Text to Speech
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    if (isListening) {
      stopListening();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    resetTranscript();
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        message: text.trim(),
        currentProfile: profile,
        language,
      });

      setProfile(response.updatedProfile || {});
      setEligibleSchemes(response.evaluation?.potentiallyEligible || []);
      setNeedsInfoSchemes(response.evaluation?.needsInformation || []);
      setMissingFields(response.missingFields || []);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: response.isAiGenerated,
        evaluation: response.evaluation,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: isHi
          ? `सर्वर से संपर्क करने में समस्या आई (${err.message || 'नेटवर्क त्रुटि'})। कृपया सुनिश्चित करें कि बैकएंड चालू है।`
          : `Failed to reach YojanaMitra API server (${err.message || 'Network error'}). Please verify Express backend is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const resetConversation = () => {
    setProfile({});
    setEligibleSchemes([]);
    setNeedsInfoSchemes([]);
    setMissingFields([]);
    setInputText('');
    resetTranscript();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: isHi
          ? 'सत्र रीसेट कर दिया गया है। कृपया अपने बारे में बताएं।'
          : 'Conversation reset. Please share your details to explore schemes.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4.5rem)] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header bar */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>{isHi ? 'योजनामित्र एआई एवं वॉइस सहायक' : 'YojanaMitra AI & Voice Assistant'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {isHi ? 'सत्यापित नियम इंजन' : 'Deterministic Rule Engine'}
                </span>
              </h1>
              <p className="text-xs text-gray-500">
                {isHi
                  ? 'बोलकर या लिखकर संवाद करें • आधिकारिक भारत सरकार योजनाओं से पुष्ट'
                  : 'Bilingual Hindi/English • Grounded in official portal criteria'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(isHi ? 'en' : 'hi')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              {isHi ? 'Switch to English' : 'हिंदी में बदलें'}
            </button>
            <button
              onClick={resetConversation}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-700 transition flex items-center gap-1 cursor-pointer"
              title="Reset profile and chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'रीसेट करें' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Chat Panel, Right Live Profile & Matched Schemes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat Window (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-gray-200/80 shadow-xs h-[650px] overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isBot = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isBot ? 'items-start' : 'items-end flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                        isBot
                          ? 'bg-emerald-800 text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-2xs ${
                        isBot
                          ? 'bg-emerald-50/70 text-gray-800 border border-emerald-100 rounded-tl-xs'
                          : 'bg-emerald-900 text-white rounded-tr-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      <div
                        className={`text-[10px] mt-2 flex items-center justify-between gap-3 ${
                          isBot ? 'text-gray-500' : 'text-emerald-200'
                        }`}
                      >
                        <span>{msg.timestamp}</span>

                        {isBot && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="hover:text-emerald-800 transition flex items-center gap-1 cursor-pointer"
                            title="Listen to response"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isHi ? 'सुनें' : 'Listen'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-900 font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                    <span>
                      {isHi
                        ? 'योजनामित्र नियमों और विवरणों का मिलान कर रहा है...'
                        : 'Checking deterministic rules and verified scheme criteria...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Status Alert if Error */}
            {voiceError && (
              <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{voiceError}</span>
              </div>
            )}

            {/* Input Form Area */}
            <div className="p-3 sm:p-4 bg-gray-50/90 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isListening
                        ? isHi
                          ? 'सुन रहा हूँ... बोलिए...'
                          : 'Listening... please speak...'
                        : isHi
                        ? 'अपनी उम्र, व्यवसाय या राज्य बताएं...'
                        : 'Type or speak your age, occupation, state, or income...'
                    }
                    className={`w-full pl-4 pr-10 py-3 rounded-xl border text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                      isListening
                        ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/30'
                        : 'border-gray-300'
                    }`}
                  />

                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Voice Input Microphone Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3 rounded-xl transition flex items-center justify-center cursor-pointer relative ${
                    isListening
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-md ring-4 ring-red-200 animate-pulse'
                      : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
                  }`}
                  title={
                    isListening
                      ? isHi
                        ? 'माइक रोकें'
                        : 'Stop Recording'
                      : isHi
                      ? 'बोलने के लिए माइक दबाएं'
                      : 'Click to Speak'
                  }
                  aria-label="Toggle voice input"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-800" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{isHi ? 'भेजें' : 'Send'}</span>
                </button>
              </form>

              {/* Quick sample prompt prompts */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{isHi ? 'उदाहरण:' : 'Try:'}</span>
                <button
                  type="button"
                  onClick={() => handleSendMessage(isHi ? 'मैं यूपी से एक 35 साल का किसान हूँ' : 'I am a 35 year old farmer from Uttar Pradesh')}
                  className="px-2 py-0.5 rounded-md bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-900 transition text-[11px]"
                >
                  {isHi ? 'किसान (उम्र 35, यूपी)' : 'Farmer, age 35, UP'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(isHi ? 'मेरी उम्र 22 वर्ष है और मैं कॉलेज का छात्र हूँ' : 'I am 22 years old and a college student')}
                  className="px-2 py-0.5 rounded-md bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-900 transition text-[11px]"
                >
                  {isHi ? 'छात्र (उम्र 22)' : 'Student, age 22'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(isHi ? 'मैं एक महिला हूँ, उम्र 28 वर्ष' : 'I am a woman, age 28')}
                  className="px-2 py-0.5 rounded-md bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-900 transition text-[11px]"
                >
                  {isHi ? 'महिला (उम्र 28)' : 'Woman, age 28'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Extracted Profile & Scheme Matches (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Extracted Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>{isHi ? 'निकाला गया नागरिक विवरण' : 'Extracted Citizen Profile'}</span>
                </h3>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {Object.keys(profile).length} {isHi ? 'विवरण' : 'attributes'}
                </span>
              </div>

              {Object.keys(profile).length === 0 ? (
                <div className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-lg text-center">
                  {isHi
                    ? 'अभी तक कोई विवरण नहीं निकाला गया है। बातचीत शुरू करें!'
                    : 'No details extracted yet. Speak or type in the chat to begin.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(profile).map(([key, val]) => (
                    <div key={key} className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2">
                      <span className="text-gray-500 block capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-semibold text-emerald-950 text-sm">
                        {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Missing Fields Guide */}
              {missingFields.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isHi ? 'अपेक्षित अतिरिक्त जानकारी:' : 'Missing Information For Matching:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingFields.map((f) => (
                      <span
                        key={f}
                        className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium"
                      >
                        {f.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scheme Eligibility Results Box */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{isHi ? 'पात्रता परिणाम' : 'Live Eligibility Verdicts'}</span>
                </h3>
              </div>

              {eligibleSchemes.length === 0 && needsInfoSchemes.length === 0 ? (
                <div className="text-xs text-gray-500 italic p-4 text-center my-auto bg-gray-50 rounded-xl">
                  <Bot className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p>
                    {isHi
                      ? 'अपनी जानकारी साझा करें, पात्र योजनाएं यहां प्रदर्शित होंगी।'
                      : 'Provide your demographics to view matched verified schemes.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                  {/* Potentially Eligible Schemes */}
                  {eligibleSchemes.map((item) => (
                    <div
                      key={item.schemeId}
                      className="border border-emerald-300 bg-emerald-50/50 rounded-xl p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-900">
                          {isHi ? item.schemeTitleHi : item.schemeTitleEn}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('eligibleBadge')}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mb-2">
                        {isHi
                          ? `सभी ${item.passedCriteria.length} अनिवार्य शर्तें पूरी हुईं`
                          : `Satisfies all ${item.passedCriteria.length} mandatory criteria`}
                      </p>
                      <Link
                        href={`/schemes/${encodeURIComponent(item.schemeCode)}`}
                        className="text-xs font-semibold text-emerald-950 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{isHi ? 'आवेदन विवरण देखें' : 'View Scheme Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}

                  {/* Needs Information Schemes */}
                  {needsInfoSchemes.slice(0, 3).map((item) => (
                    <div
                      key={item.schemeId}
                      className="border border-amber-200 bg-amber-50/50 rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-950">
                          {isHi ? item.schemeTitleHi : item.schemeTitleEn}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          {t('needsInfoBadge')}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        {isHi
                          ? `अपेक्षित: ${item.unknownCriteria.map((c) => c.labelHi || c.field).join(', ')}`
                          : `Needs: ${item.unknownCriteria.map((c) => c.labelEn || c.field).join(', ')}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
