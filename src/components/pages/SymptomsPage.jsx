import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Type, Hand, Map, X, Plus, ChevronRight, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { symptomIcons, detectKeywords } from '../../data/symptoms';
import Layout from '../layout/Layout';

const tabs = [
  { id: 'voice', icon: Mic, labelKey: 'speakSymptoms' },
  { id: 'text', icon: Type, labelKey: 'typeSymptoms' },
  { id: 'icons', icon: Hand, labelKey: 'tapSymptoms' },
  { id: 'body', icon: Map, labelKey: 'bodyMap' },
];

const bodyPartsMap = [
  { id: 'head', label: 'Head', cx: 100, cy: 40, r: 32 },
  { id: 'neck', label: 'Neck', cx: 100, cy: 85, rx: 14, ry: 10 },
  { id: 'chest', label: 'Chest', cx: 100, cy: 135, rx: 42, ry: 32 },
  { id: 'abdomen', label: 'Abdomen', cx: 100, cy: 193, rx: 36, ry: 26 },
  { id: 'left_arm', label: 'L.Arm', cx: 50, cy: 148, rx: 14, ry: 38 },
  { id: 'right_arm', label: 'R.Arm', cx: 150, cy: 148, rx: 14, ry: 38 },
  { id: 'left_leg', label: 'L.Leg', cx: 78, cy: 268, rx: 16, ry: 44 },
  { id: 'right_leg', label: 'R.Leg', cx: 122, cy: 268, rx: 16, ry: 44 },
  { id: 'lower_back', label: 'Lower Back', cx: 100, cy: 222, rx: 26, ry: 14 },
];

const SymptomsPage = () => {
  const navigate = useNavigate();
  const { t, language, symptoms, setSymptoms, bodyParts, setBodyParts, voiceTranscript, setVoiceTranscript } = useApp();
  const [activeTab, setActiveTab] = useState('voice');
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const recognitionRef = useRef(null);

  const getLabel = (sym) => sym.label?.[language] || sym.label?.en || sym.id;

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Mock voice for demo
      setRecording(true);
      setTimeout(() => {
        const demoText = 'I have fever and headache since two days, also feeling weak and dizzy';
        setVoiceTranscript(demoText);
        setProcessing(true);
        setTimeout(() => {
          const found = detectKeywords(demoText);
          setSymptoms(prev => [...new Set([...prev, ...found])]);
          setProcessing(false);
          setRecording(false);
        }, 1500);
      }, 2000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    const langMap = { en: 'en-IN', hi: 'hi-IN', hinglish: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN' };
    recognition.lang = langMap[language] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setProcessing(true);
      setTimeout(() => {
        const found = detectKeywords(transcript);
        setSymptoms(prev => [...new Set([...prev, ...found])]);
        setProcessing(false);
        setRecording(false);
      }, 1200);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognition.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const handleTextAnalyze = () => {
    if (!textInput.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      const found = detectKeywords(textInput);
      setSymptoms(prev => [...new Set([...prev, ...found])]);
      setProcessing(false);
    }, 800);
  };

  const toggleSymptomIcon = (id) => {
    setSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleBodyPart = (id) => {
    setBodyParts(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const removeSymptom = (id) => setSymptoms(prev => prev.filter(s => s !== id));

  const addCustomSymptom = () => {
    if (newSymptom.trim()) {
      setSymptoms(prev => [...prev, newSymptom.trim().toLowerCase().replace(/\s+/g, '_')]);
      setNewSymptom('');
    }
  };

  const readText = `${t('symptoms')}. ${t('symptomsSubtitle')}`;

  return (
    <Layout step="symptoms" readText={readText}>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="font-display font-bold text-2xl text-slate-800">{t('symptoms')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('symptomsSubtitle')}</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                  ${active ? 'bg-white text-primary-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icon size={16} />
                <span className="text-[10px]">{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          {activeTab === 'voice' && (
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
                    ${recording
                      ? 'bg-red-500 text-white scale-110 shadow-red-200 animate-pulse-slow'
                      : 'bg-gradient-to-br from-primary-600 to-teal-600 text-white hover:scale-105 shadow-primary-200'}`}
                >
                  {recording ? <MicOff size={36} /> : <Mic size={36} />}
                </button>
                {recording && (
                  <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
                )}
              </div>
              <p className="text-slate-600 font-medium text-sm text-center">
                {recording ? t('stopRecording') : t('startRecording')}
              </p>
              {processing && (
                <div className="flex items-center gap-2 text-primary-600 text-sm">
                  <Loader size={16} className="animate-spin" />
                  <span>{t('processing')}</span>
                </div>
              )}
              {voiceTranscript && !processing && (
                <div className="w-full bg-primary-50 rounded-xl p-4 border border-primary-100">
                  <p className="text-xs text-primary-500 font-semibold mb-1 uppercase tracking-wide">Transcript</p>
                  <p className="text-sm text-slate-700 italic">"{voiceTranscript}"</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'text' && (
            <div>
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder={language === 'hi' ? 'जैसे: मुझे दो दिन से बुखार है और सिर में दर्द है...' : 'e.g., I have fever for 2 days, also headache and feeling weak...'}
                className="w-full h-32 resize-none border-2 border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:border-primary-400 transition-colors"
              />
              <button onClick={handleTextAnalyze}
                className="mt-3 w-full py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                {processing ? <Loader size={16} className="animate-spin" /> : null}
                Detect Symptoms from Text
              </button>
            </div>
          )}

          {activeTab === 'icons' && (
            <div className="grid grid-cols-3 gap-2.5">
              {symptomIcons.map(sym => {
                const selected = symptoms.includes(sym.id);
                return (
                  <button key={sym.id} onClick={() => toggleSymptomIcon(sym.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                      ${selected ? `${sym.color} border-current shadow-sm scale-95` : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <span className="text-2xl">{sym.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">{getLabel(sym)}</span>
                    {selected && <div className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center"><span className="text-[8px]">✓</span></div>}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'body' && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-slate-500 text-center">{t('bodyMap')} – tap to select affected areas</p>
              <div className="relative">
                <svg viewBox="0 0 200 340" width="200" height="340">
                  {/* Body silhouette background */}
                  <ellipse cx="100" cy="40" rx="30" ry="30" fill="#e2e8f0" />
                  <rect x="58" y="80" width="84" height="150" rx="20" fill="#e2e8f0" />
                  <rect x="32" y="90" width="28" height="90" rx="14" fill="#e2e8f0" />
                  <rect x="140" y="90" width="28" height="90" rx="14" fill="#e2e8f0" />
                  <rect x="62" y="228" width="34" height="100" rx="14" fill="#e2e8f0" />
                  <rect x="104" y="228" width="34" height="100" rx="14" fill="#e2e8f0" />

                  {bodyPartsMap.map(part => {
                    const selected = bodyParts.includes(part.id);
                    return (
                      <ellipse key={part.id} cx={part.cx} cy={part.cy}
                        rx={part.rx || part.r} ry={part.ry || part.r}
                        fill={selected ? '#0ea5e9' : 'transparent'}
                        fillOpacity={selected ? 0.4 : 0}
                        stroke={selected ? '#0284c7' : '#94a3b8'}
                        strokeWidth={selected ? 2 : 1}
                        strokeDasharray={selected ? 'none' : '3,3'}
                        onClick={() => toggleBodyPart(part.id)}
                        className="cursor-pointer transition-all duration-200 hover:fill-primary-200 hover:fill-opacity-30"
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}

                  {bodyPartsMap.map(part => (
                    <text key={part.id + '_label'} x={part.cx} y={part.cy + (part.ry || part.r || 0) + 12}
                      textAnchor="middle" fontSize="8" fill={bodyParts.includes(part.id) ? '#0284c7' : '#64748b'} fontWeight="600">
                      {part.label}
                    </text>
                  ))}
                </svg>
              </div>
              {bodyParts.length > 0 && (
                <div className="w-full">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Selected Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {bodyParts.map(bp => (
                      <span key={bp} className="bg-primary-100 text-primary-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        {bodyPartsMap.find(b => b.id === bp)?.label || bp}
                        <button onClick={() => toggleBodyPart(bp)}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detected symptoms chips */}
        {symptoms.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
            <p className="text-sm font-bold text-slate-700 mb-3">{t('detectedSymptoms')}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {symptoms.map(id => {
                const sym = symptomIcons.find(s => s.id === id);
                return (
                  <span key={id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${sym?.color || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {sym?.icon && <span>{sym.icon}</span>}
                    <span>{sym ? getLabel(sym) : id.replace(/_/g,' ')}</span>
                    <button onClick={() => removeSymptom(id)} className="ml-0.5 opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
            {/* Add custom symptom */}
            <div className="flex gap-2 mt-3">
              <input value={newSymptom} onChange={e => setNewSymptom(e.target.value)}
                placeholder={t('addSymptom')}
                onKeyDown={e => e.key === 'Enter' && addCustomSymptom()}
                className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-primary-400" />
              <button onClick={addCustomSymptom}
                className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Continue */}
        <button
          onClick={() => navigate('/followup')}
          disabled={symptoms.length === 0 && bodyParts.length === 0}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all
            bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-700 hover:to-teal-700 shadow-lg shadow-primary-200
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
          <span>{t('next')}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </Layout>
  );
};

export default SymptomsPage;
