import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Mic, RotateCcw, ChevronRight, Activity, User, Clock, MapPin, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { symptomIcons } from '../../data/symptoms';
import Layout from '../layout/Layout';
import ReadAloudBtn from '../common/ReadAloudBtn';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t, language, patientId, symptoms, bodyParts, followUpData, triageResult, appointment } = useApp();

  const getLabel = (id) => {
    const sym = symptomIcons.find(s => s.id === id);
    return sym?.label?.[language] || sym?.label?.en || id.replace(/_/g, ' ');
  };

  const riskGrad = {
    low: 'from-emerald-500 to-green-600',
    medium: 'from-amber-500 to-orange-500',
    high: 'from-red-500 to-rose-600',
  };

  const readText = `${t('dashboard')}. Patient ID: ${patientId}. Symptoms: ${symptoms.map(getLabel).join(', ')}. Risk: ${triageResult?.riskLevel}. Score: ${triageResult?.riskScore} out of 100.`;

  const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout step={null} readText={readText} showProgress={false}>
      <div className="animate-fade-in space-y-5">
        {/* Hero greeting */}
        <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-primary-200 text-xs font-medium mb-1">{date}</p>
                <h1 className="font-display font-bold text-2xl">{t('dashboard')}</h1>
              </div>
              <ReadAloudBtn text={readText} className="bg-white/20 text-white border-white/30 hover:bg-white/30" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <User size={15} />
              </div>
              <div>
                <p className="text-xs text-primary-200">Patient ID</p>
                <p className="font-bold font-mono text-sm">{patientId || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score Card */}
        {triageResult && (
          <div className={`rounded-3xl p-5 bg-gradient-to-br ${riskGrad[triageResult.riskLevel]} text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Health Risk Score</p>
                <p className="font-display font-bold text-4xl">{triageResult.riskScore}<span className="text-xl font-normal opacity-70">/100</span></p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="bg-white/20 rounded-2xl px-4 py-2">
                  <p className="font-display font-bold text-lg capitalize">{triageResult.riskLevel} Risk</p>
                </div>
                <p className="text-white/70 text-xs">{triageResult.urgency}</p>
              </div>
            </div>
            {/* Score bar */}
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full transition-all duration-1000"
                style={{ width: `${triageResult.riskScore}%` }} />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Activity, label: 'Symptoms', val: symptoms.length, color: 'text-primary-600 bg-primary-50' },
            { icon: MapPin, label: 'Body Areas', val: bodyParts.length, color: 'text-teal-600 bg-teal-50' },
            { icon: TrendingUp, label: 'Severity', val: followUpData.severity || 'N/A', color: 'text-amber-600 bg-amber-50' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={16} />
              </div>
              <p className="font-display font-bold text-xl text-slate-800 capitalize">{val}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Detected symptoms */}
        {symptoms.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">{t('symptomsReported')}</p>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(id => {
                const sym = symptomIcons.find(s => s.id === id);
                return (
                  <span key={id} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${sym?.color || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {sym?.icon} {getLabel(id)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Body areas */}
        {bodyParts.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">{t('bodyAreasAffected')}</p>
            <div className="flex flex-wrap gap-2">
              {bodyParts.map(bp => (
                <span key={bp} className="text-xs px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                  📍 {bp.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Summary snippet */}
        {triageResult?.summary && (
          <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl border border-primary-100 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-500 mb-2">{t('aiSummary')}</p>
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">{triageResult.summary}</p>
          </div>
        )}

        {/* Appointment summary */}
        {appointment && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-500 mb-3">Appointment Booked ✓</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{appointment.doctor?.avatar}</span>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{appointment.doctor?.name}</p>
                <p className="text-xs text-slate-500">{appointment.doctor?.spec}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-emerald-600">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {appointment.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {appointment.slot}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: FileText, label: t('viewReport'), onClick: () => navigate('/report'), grad: 'from-primary-600 to-primary-700', shadow: 'shadow-primary-200' },
            { icon: Calendar, label: t('bookAppointment'), onClick: () => navigate('/appointment'), grad: 'from-teal-600 to-teal-700', shadow: 'shadow-teal-200' },
          ].map(({ icon: Icon, label, onClick, grad, shadow }) => (
            <button key={label} onClick={onClick}
              className={`flex flex-col items-start gap-3 p-5 rounded-2xl bg-gradient-to-br ${grad} text-white shadow-lg ${shadow} hover:opacity-90 transition-all`}>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon size={18} />
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-sm">{label}</span>
                <ChevronRight size={16} className="opacity-70" />
              </div>
            </button>
          ))}
        </div>

        {/* Start New Assessment */}
        <button onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl border-2 border-slate-200 font-semibold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <RotateCcw size={16} />
          <span>Start New Assessment</span>
        </button>
      </div>
    </Layout>
  );
};

export default DashboardPage;
