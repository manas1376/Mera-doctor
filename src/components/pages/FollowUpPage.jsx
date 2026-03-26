import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Layout from '../layout/Layout';

const FollowUpPage = () => {
  const navigate = useNavigate();
  const { t, language, followUpData, setFollowUpData, symptoms } = useApp();

  const handleChange = (key, val) => setFollowUpData(prev => ({ ...prev, [key]: val }));
  const toggleArr = (key, val) => setFollowUpData(prev => ({
    ...prev,
    [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val]
  }));

  const SectionTitle = ({ children }) => (
    <h3 className="text-sm font-bold text-slate-700 mb-3">{children}</h3>
  );

  const ChipBtn = ({ active, onClick, children, color = '' }) => (
    <button onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200
        ${active ? `border-primary-500 bg-primary-50 text-primary-700 ${color}` : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
      {children}
    </button>
  );

  const durations = [
    { val: 'hours', label: t('hours') },
    { val: 'days', label: t('days') },
    { val: 'week', label: t('week') },
    { val: 'weeks', label: t('weeks') },
  ];

  const severities = [
    { val: 'mild', label: t('mild'), color: 'bg-green-50 border-green-400 text-green-700' },
    { val: 'moderate', label: t('moderate'), color: 'bg-yellow-50 border-yellow-400 text-yellow-700' },
    { val: 'severe', label: t('severe'), color: 'bg-red-50 border-red-400 text-red-700' },
  ];

  const conditions = ['diabetes', 'hypertension', 'asthma', 'heartDisease', 'none'];
  const emergencySigns = ['chestPain', 'breathingDifficulty', 'highFever', 'unconscious', 'bleedingHeavy', 'none_emergency'];

  const readText = `${t('followUp')}. ${t('followUpSubtitle')}. ${t('duration')}`;

  return (
    <Layout step="followup" readText={readText}>
      <div className="animate-fade-in space-y-5">
        <div className="mb-2">
          <h1 className="font-display font-bold text-2xl text-slate-800">{t('followUp')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('followUpSubtitle')}</p>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <SectionTitle>{t('duration')}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {durations.map(d => (
              <ChipBtn key={d.val} active={followUpData.duration === d.val} onClick={() => handleChange('duration', d.val)}>{d.label}</ChipBtn>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <SectionTitle>{t('severity')}</SectionTitle>
          <div className="flex gap-3">
            {severities.map(s => (
              <button key={s.val} onClick={() => handleChange('severity', s.val)}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                  ${followUpData.severity === s.val ? s.color : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                {s.label}
              </button>
            ))}
          </div>
          {/* Severity slider visual */}
          {followUpData.severity && (
            <div className="mt-4 flex gap-1">
              {[1,2,3,4,5,6,7,8,9,10].map(n => {
                const fill = followUpData.severity === 'severe' ? n <= 8 : followUpData.severity === 'moderate' ? n <= 5 : n <= 2;
                return <div key={n} className={`flex-1 h-2 rounded-full transition-all ${fill ? (followUpData.severity === 'severe' ? 'bg-red-400' : followUpData.severity === 'moderate' ? 'bg-yellow-400' : 'bg-green-400') : 'bg-slate-100'}`} />;
              })}
            </div>
          )}
        </div>

        {/* Age & Gender */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('age')}</label>
              <input type="number" min="1" max="120" value={followUpData.age}
                onChange={e => handleChange('age', e.target.value)}
                placeholder="e.g. 35"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-3 text-sm font-medium outline-none focus:border-primary-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('gender')}</label>
              <div className="flex gap-2">
                {['male','female','other'].map(g => (
                  <button key={g} onClick={() => handleChange('gender', g)}
                    className={`flex-1 py-3 rounded-xl border-2 text-xs font-semibold transition-all
                      ${followUpData.gender === g ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500'}`}>
                    {t(g)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Existing conditions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <SectionTitle>{t('existingConditions')}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {conditions.map(c => (
              <ChipBtn key={c} active={followUpData.conditions.includes(c)} onClick={() => toggleArr('conditions', c)}>{t(c)}</ChipBtn>
            ))}
          </div>
        </div>

        {/* Emergency signs */}
        <div className="bg-white rounded-2xl border border-red-50 shadow-sm p-5 border">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-500" />
            <SectionTitle>{t('emergency')}</SectionTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {emergencySigns.map(e => (
              <ChipBtn key={e} active={followUpData.emergencySigns.includes(e)}
                onClick={() => toggleArr('emergencySigns', e)}
                color={e !== 'none_emergency' && followUpData.emergencySigns.includes(e) ? 'border-red-500 bg-red-50 text-red-700' : ''}>
                {t(e)}
              </ChipBtn>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button onClick={() => navigate('/symptoms')}
            className="w-12 h-14 rounded-2xl border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => navigate('/triage')}
            className="flex-1 py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all
              bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-700 hover:to-teal-700 shadow-lg shadow-primary-200">
            <span>{t('analyzeBtn')}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default FollowUpPage;
