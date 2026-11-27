'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { sendChatMessage } from '../../lib/api';
import type { ChatMessage, SchemeEvaluation } from '../../lib/types';
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  RotateCcw,
  ChevronRight,
  UserCheck,
  Radio,
  FileText,
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
        ? 'नमस्ते! मैं योजनामित्र का आधिकारिक एआई एवं वॉइस सहायक हूँ।\n\nआप अपनी आयु, राज्य, व्यवसाय (जैसे किसान, छात्र, व्यवसायी), या पारिवारिक आय बोलकर या लिखकर साझा करें। मैं बिना किसी भ्रामक अनुमान के केवल आधिकारिक सरकारी नियमों के आधार पर आपके लिए उपयुक्त योजनाएं खोजूँगा।'
        : 'Hello! I am the YojanaMitra Official AI & Voice Assistant.\n\nPlease share your age, state, occupation (e.g. farmer, student, vendor), or annual household income in Hindi or English. I will deterministically evaluate your profile against verified welfare rules with zero hallucination.',
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
          ? `सर्वर से संपर्क करने में समस्या आई (${err.message || 'नेटवर्क त्रुटि'})। कृपया सुनिश्चित करें कि बैकएंड सेवा चालू है।`
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

  const profileCount = Object.keys(profile).length;

  return (
    <div className="bg-[#F7F5EF] min-h-[calc(100vh-4.5rem)] py-6 sm:py-8 text-[#202923]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Toolbar */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#173F35] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-[#D99A42]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#202923] tracking-tight">
                  {isHi ? 'योजनामित्र एआई एवं वॉइस सहायक' : 'YojanaMitra AI & Voice Assistant'}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E8F0E8] text-[#173F35] border border-[#E3E7E1]">
                  {isHi ? 'सत्यापित नियम इंजन' : 'Deterministic Rule Engine'}
                </span>
              </div>
              <p className="text-xs text-[#69756D]">
                {isHi
                  ? 'बोलकर या लिखकर संवाद करें • आधिकारिक भारत सरकार नियमों से पुष्ट'
                  : 'Bilingual Hindi/English • Grounded in official myScheme & ministerial criteria'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(isHi ? 'en' : 'hi')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E3E7E1] bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#202923] transition cursor-pointer"
            >
              {isHi ? 'Switch to English' : 'हिंदी में बदलें'}
            </button>
            <button
              onClick={resetConversation}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E3E7E1] bg-[#FFFFFF] text-[#202923] hover:bg-[#FCEEEE] hover:text-[#8E3030] hover:border-[#F4C7C7] transition flex items-center gap-1 cursor-pointer"
              title="Reset profile and chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'रीसेट' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Chat Panel, Right Live Citizen Profile & Matched Schemes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat Window (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] shadow-xs h-[650px] overflow-hidden">
            {/* Live Assistant Status Header */}
            <div className="px-4 py-2.5 border-b border-[#E3E7E1] bg-[#F7F5EF]/60 flex items-center justify-between text-xs text-[#69756D]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2F6B52]" />
                <span className="font-semibold text-[#202923]">
                  {isHi ? 'एआई सहायक सक्रिय' : 'Assistant Online'}
                </span>
                <span>•</span>
                <span className="text-[11px]">Google Gemini 2.5 Flash SDK</span>
              </div>
              <div className="text-[11px] font-mono">
                {isListening ? (
                  <span className="text-[#8E3030] font-bold flex items-center gap-1 animate-pulse">
                    <Radio className="w-3.5 h-3.5" />
                    Recording Voice...
                  </span>
                ) : (
                  <span>Voice & Text Ready</span>
                )}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F7F5EF]/30">
              {messages.map((msg) => {
                const isBot = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end flex-row-reverse'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold shadow-2xs ${
                        isBot
                          ? 'bg-[#173F35] text-white'
                          : 'bg-[#202923] text-white'
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4 text-[#D99A42]" /> : <User className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isBot
                          ? 'bg-[#FFFFFF] text-[#202923] border border-[#E3E7E1] rounded-tl-xs shadow-xs'
                          : 'bg-[#173F35] text-[#FFFFFF] rounded-tr-xs shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line font-normal">{msg.text}</div>

                      <div
                        className={`text-[10px] mt-2 flex items-center justify-between gap-3 ${
                          isBot ? 'text-[#69756D]' : 'text-[#E8F0E8]/70'
                        }`}
                      >
                        <span className="font-mono">{msg.timestamp}</span>

                        {isBot && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="hover:text-[#173F35] text-[#69756D] transition flex items-center gap-1 cursor-pointer font-medium"
                            title="Listen to response"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#2F6B52]" />
                            <span>{isSpeaking ? (isHi ? 'रोकें' : 'Stop') : (isHi ? 'सुनें' : 'Listen')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#173F35] text-white flex items-center justify-center text-xs">
                    <Bot className="w-4 h-4 animate-spin text-[#D99A42]" />
                  </div>
                  <div className="bg-[#FFFFFF] border border-[#E3E7E1] rounded-xl p-3 text-xs text-[#202923] font-medium flex items-center gap-2 shadow-xs">
                    <span>
                      {isHi
                        ? 'योजनामित्र नियमों और विवरण का मिलान कर रहा है...'
                        : 'Matching extracted citizen profile against verified criteria...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Status Alert if Error */}
            {voiceError && (
              <div className="bg-[#FCF5E8] border-t border-[#F5DFB5] px-4 py-2 text-xs text-[#9E6714] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#9E6714] shrink-0" />
                <span>{voiceError}</span>
              </div>
            )}

            {/* Input Form Area */}
            <div className="p-3 sm:p-3.5 bg-[#FFFFFF] border-t border-[#E3E7E1]">
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
                        ? 'अपनी उम्र, व्यवसाय, आय या राज्य बताएं...'
                        : 'Type or speak your age, occupation, state, or annual income...'
                    }
                    className={`w-full pl-3.5 pr-8 py-2.5 rounded-lg border text-xs sm:text-sm bg-[#F7F5EF]/30 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#173F35] transition ${
                      isListening
                        ? 'border-[#8E3030] bg-[#FCEEEE]/30'
                        : 'border-[#E3E7E1]'
                    }`}
                  />

                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#69756D] hover:text-[#202923] text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Voice Input Microphone Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2.5 rounded-lg transition flex items-center justify-center cursor-pointer shadow-xs ${
                    isListening
                      ? 'bg-[#8E3030] text-white animate-pulse'
                      : 'bg-[#E8F0E8] hover:bg-[#dce8dc] text-[#173F35] border border-[#E3E7E1]'
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
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#2F6B52]" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-4 py-2.5 bg-[#173F35] hover:bg-[#2F6B52] text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-xs text-xs sm:text-sm"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isHi ? 'भेजें' : 'Send'}</span>
                </button>
              </form>

              {/* Quick sample prompt chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#69756D]">
                <span className="font-medium text-[#202923]">{isHi ? 'उदाहरण:' : 'Sample:'}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      isHi
                        ? 'मैं उत्तर प्रदेश से एक 35 वर्षीय किसान हूँ, आय 1.5 लाख है'
                        : 'I am a 35 year old farmer from Uttar Pradesh with income 1.5 Lakh'
                    )
                  }
                  className="px-2 py-0.5 rounded-md bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] border border-[#E3E7E1] transition text-[11px]"
                >
                  {isHi ? 'किसान (उम्र 35, यूपी)' : 'Farmer, age 35, UP'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      isHi
                        ? 'मेरी उम्र 21 वर्ष है, मैं कॉलेज छात्र हूँ'
                        : 'I am a 21 year old college student'
                    )
                  }
                  className="px-2 py-0.5 rounded-md bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] border border-[#E3E7E1] transition text-[11px]"
                >
                  {isHi ? 'छात्र (उम्र 21)' : 'Student, age 21'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      isHi
                        ? 'मैं राजस्थान से एक 28 वर्षीय महिला हूँ'
                        : 'I am a 28 year old woman from Rajasthan'
                    )
                  }
                  className="px-2 py-0.5 rounded-md bg-[#F7F5EF] hover:bg-[#E8F0E8] text-[#202923] border border-[#E3E7E1] transition text-[11px]"
                >
                  {isHi ? 'महिला (उम्र 28)' : 'Woman, age 28'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Extracted Profile & Scheme Matches (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Extracted Profile Card */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-4.5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-[#E3E7E1] pb-2.5">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#2F6B52]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#202923]">
                    {isHi ? 'निकाला गया नागरिक विवरण' : 'Extracted Citizen Profile'}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#173F35] bg-[#E8F0E8] px-2 py-0.5 rounded-md border border-[#E3E7E1]">
                  {profileCount} {isHi ? 'मान्य विवरण' : 'Attributes'}
                </span>
              </div>

              {profileCount === 0 ? (
                <div className="text-xs text-[#69756D] p-4 bg-[#F7F5EF]/60 rounded-lg text-center border border-[#E3E7E1]">
                  <p>
                    {isHi
                      ? 'अभी तक कोई विवरण नहीं निकाला गया है। बातचीत शुरू करें!'
                      : 'No details extracted yet. Speak or type in the chat to begin.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(profile).map(([key, val]) => (
                    <div key={key} className="bg-[#F7F5EF] border border-[#E3E7E1] rounded-lg p-2.5">
                      <span className="text-[#69756D] block text-[10px] uppercase font-semibold tracking-wider mb-0.5">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-[#202923] text-xs sm:text-sm">
                        {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Missing Fields Guide */}
              {missingFields.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E3E7E1]">
                  <div className="text-xs font-semibold text-[#9E6714] flex items-center gap-1.5 mb-2">
                    <HelpCircle className="w-3.5 h-3.5 text-[#9E6714]" />
                    <span>{isHi ? 'सटीक मिलान हेतु अपेक्षित जानकारी:' : 'Missing Information For Full Matching:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingFields.map((f) => (
                      <span
                        key={f}
                        className="text-[11px] bg-[#FCF5E8] text-[#9E6714] border border-[#F5DFB5] px-2 py-0.5 rounded-md font-medium"
                      >
                        {f.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scheme Eligibility Results Box */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E3E7E1] p-4.5 shadow-xs flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-[#E3E7E1] pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F6B52]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#202923]">
                    {isHi ? 'पात्रता परिणाम' : 'Live Eligibility Verdicts'}
                  </h3>
                </div>
              </div>

              {eligibleSchemes.length === 0 && needsInfoSchemes.length === 0 ? (
                <div className="text-xs text-[#69756D] p-6 text-center my-auto bg-[#F7F5EF]/60 rounded-lg border border-[#E3E7E1]">
                  <FileText className="w-7 h-7 text-[#69756D] mx-auto mb-2" />
                  <p className="leading-relaxed">
                    {isHi
                      ? 'अपनी जानकारी साझा करें, पात्र योजनाएं यहां प्रदर्शित होंगी।'
                      : 'Provide your details to view matched verified schemes.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
                  {/* Potentially Eligible Schemes */}
                  {eligibleSchemes.map((item) => (
                    <div
                      key={item.schemeId}
                      className="border border-[#C8E6D3] bg-[#EAF4EE] rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-[#173F35] leading-snug">
                          {isHi ? item.schemeTitleHi : item.schemeTitleEn}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#173F35] text-white flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-[#D99A42]" />
                          {t('eligibleBadge')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#2F6B52] mb-2 font-medium">
                        {isHi
                          ? `सभी ${item.passedCriteria.length} अनिवार्य शर्तें पूरी हुईं`
                          : `Satisfies all ${item.passedCriteria.length} mandatory criteria`}
                      </p>
                      <Link
                        href={`/schemes/${encodeURIComponent(item.schemeCode)}`}
                        className="text-xs font-semibold text-[#173F35] hover:underline inline-flex items-center gap-1"
                      >
                        <span>{isHi ? 'दिशा-निर्देश देखें' : 'View Guidelines'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}

                  {/* Needs Information Schemes */}
                  {needsInfoSchemes.slice(0, 3).map((item) => (
                    <div
                      key={item.schemeId}
                      className="border border-[#F5DFB5] bg-[#FCF5E8] rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-[#9E6714] leading-snug">
                          {isHi ? item.schemeTitleHi : item.schemeTitleEn}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#9E6714] text-white shrink-0">
                          {t('needsInfoBadge')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9E6714]/90">
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
