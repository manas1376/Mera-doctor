import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, AlertCircle, ChevronRight, Home, Calendar, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeSymptoms } from '../../services/aiService';
import { symptomIcons } from '../../data/symptoms';
import Layout from '../layout/Layout';

const TriagePage = () => {
  const navigate = useNavigate();
  const { t, language, symptoms, bodyParts, followUpData, triageResult, setTriageResult } = useApp();
  const [loading, setLoading] = useState(!triageResult);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (triageResult) return;
    let p = 0;
    const iv = setInterval(() => { p += Math.random() * 15; setProgress(Math.min(p, 95)); if (p >= 95) clearInterval(iv); }, 200);
    analyzeSymptoms({ symptoms, bodyParts, followUpData, language }).then(result => {
      setTriageResult(result);
      setProgress(100);
      setLoading(false);
      clearInterval(iv);
    });
    return () => clearInterval(iv);
  }, []);

  const getLabel = (id) => {
    const sym = symptomIcons.find(s => s.id === id);
    return sym?.label?.[language] || sym?.label?.en || id.replace(/_/g,' ');
  };

  if (loading) {
    return (
      <Layout step="triage" showProgress>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
              <Loader size={36} className="text-primary-600 animate-spin" />
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{t('analyzing')}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">Processing {symptoms.length} symptoms + {bodyParts.length} body areas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!triageResult) return null;

  const riskConfig = {
    low: { color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle, label: t('riskLow'), barColor: 'bg-emerald-500' },
    medium: { color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertCircle, label: t('riskMedium'), barColor: 'bg-amber-500' },
    high: { color: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertTriangle, label: t('riskHigh'), barColor: 'bg-red-500' },
  };
  const cfg = riskConfig[triageResult.riskLevel] || riskConfig.low;
  const RiskIcon = cfg.icon;

  const readText = `${t('triageResult')}. ${cfg.label}. ${triageResult.summary}. ${triageResult.recommendations?.join('. ')}`;

  return (
    <Layout step="triage" readText={readText}>
      <div className="animate-slide-up space-y-5">
        <div className="mb-2">
          <h1 className="font-display font-bold text-2xl text-slate-800">{t('triageResult')}</h1>
        </div>

        {/* Risk Card */}
        <div className={`rounded-3xl p-6 border-2 ${cfg.bg} ${cfg.border} shadow-lg`}>
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cfg.color} flex items-center justify-center shadow-lg`}>
              <RiskIcon size={28} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Risk Level</p>
              <p className={`font-display font-bold text-2xl ${cfg.text}`}>{cfg.label}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`font-display font-bold text-4xl ${cfg.text}`}>{triageResult.riskScore}</p>
              <p className="text-xs text-slate-400">/100</p>
            </div>
          </div>
          {/* Score meter */}
          <div className="h-3 bg-white/60 rounded-full overflow-hidden mb-4">
            <div className={`h-full ${cfg.barColor} rounded-full transition-all duration-1000`}
              style={{ width: `${triageResult.riskScore}%` }} />
          </div>
          <div className={`text-sm ${cfg.text} font-semibold px-3 py-2 rounded-xl bg-white/50 text-center`}>
            {triageResult.urgency}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">AI Clinical Summary</p>
          <p className="text-sm text-slate-700 leading-relaxed">{triageResult.summary}</p>
        </div>

        {/* Detected symptoms summary */}
        {symptoms.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Symptoms Analyzed</p>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(id => {
                const sym = symptomIcons.find(s => s.id === id);
                return (
                  <span key={id} className={`text-xs px-3 py-1.5 rounded-full font-medium border ${sym?.color || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {sym?.icon} {getLabel(id)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {triageResult.recommendations?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Recommendations</p>
            <div className="space-y-2.5">
              {triageResult.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${cfg.color} text-white text-xs flex items-center justify-center flex-shrink-0 font-bold`}>{i+1}</div>
                  <p className="text-sm text-slate-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button onClick={() => navigate('/report')}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2
              bg-gradient-to-r from-primary-600 to-teal-600 shadow-lg shadow-primary-200 hover:from-primary-700 hover:to-teal-700 transition-all">
            <span>{t('viewReport')}</span>
            <ChevronRight size={18} />
          </button>
          {triageResult.riskLevel !== 'low' && (
            <button onClick={() => navigate('/appointment')}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-primary-200 text-primary-700 hover:bg-primary-50 transition-all">
              <Calendar size={18} />
              <span>{t('bookAppointment')}</span>
            </button>
          )}
          <button onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-2xl font-medium text-slate-500 flex items-center justify-center gap-2 hover:text-slate-700 transition-colors">
            <Home size={16} />
            <span>Go to Summary Dashboard</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TriagePage;
