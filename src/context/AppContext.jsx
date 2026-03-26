import React, { createContext, useContext, useState, useCallback } from 'react';
import { getT } from '../data/translations';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [aadhaarData, setAadhaarData] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [followUpData, setFollowUpData] = useState({
    duration: '',
    severity: '',
    age: '',
    gender: '',
    conditions: [],
    emergencySigns: [],
  });
  const [triageResult, setTriageResult] = useState(null);
  const [report, setReport] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const t = useCallback((key) => getT(language, key), [language]);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langVoiceMap = {
        en: 'en-IN', hi: 'hi-IN', hinglish: 'hi-IN',
        mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN'
      };
      utterance.lang = langVoiceMap[language] || 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const value = {
    language, setLanguage,
    aadhaarData, setAadhaarData,
    patientId, setPatientId,
    symptoms, setSymptoms,
    bodyParts, setBodyParts,
    voiceTranscript, setVoiceTranscript,
    followUpData, setFollowUpData,
    triageResult, setTriageResult,
    report, setReport,
    appointment, setAppointment,
    isOffline,
    t, speak, stopSpeaking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
