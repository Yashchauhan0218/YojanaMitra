'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../lib/types';

interface UseVoiceRecognitionOptions {
  language?: Language;
  onResult?: (transcript: string) => void;
  onError?: (errorMsg: string) => void;
}

export function useVoiceRecognition({
  language = 'hi',
  onResult,
  onError,
}: UseVoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
      );
    }
  }, []);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const msg = 'Voice recognition is not supported by your browser.';
      setErrorMessage(msg);
      onError?.(msg);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        if (event.results[0].isFinal) {
          onResult?.(currentText);
        }
      };

      recognition.onerror = (event: any) => {
        let msg = 'Voice input error occurred.';
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission denied. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please try speaking again.';
        } else {
          msg = `Voice recognition error: ${event.error}`;
        }
        setErrorMessage(msg);
        setIsListening(false);
        onError?.(msg);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      const msg = err.message || 'Failed to start microphone.';
      setErrorMessage(msg);
      setIsListening(false);
      onError?.(msg);
    }
  }, [language, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setErrorMessage(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript,
  };
}
