import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Fingerprint, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AadhaarPage = () => {
  const navigate = useNavigate();
  const { setAadhaarData, setPatientId, t } = useApp();
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1=aadhaar, 2=otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const formatAadhaar = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 12);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const handleAadhaarChange = (e) => {
    setAadhaar(formatAadhaar(e.target.value));
    setError('');
  };

  const handleContinue = async () => {
    const digits = aadhaar.replace(/\s/g, '');
    if (digits.length !== 12) { setError('Please enter a valid 12-digit Aadhaar number'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep(2);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setError('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const pid = 'PAT-' + Date.now().toString(36).toUpperCase();
    setAadhaarData({ aadhaar: aadhaar.replace(/\s/g, ''), verified: true });
    setPatientId(pid);
    setLoading(false);
    navigate('/language');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-teal-800 flex flex-col">
      {/* Hero header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-5 shadow-2xl">
          <Shield size={36} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-2 tracking-tight">SwasthyaAI</h1>
        <p className="text-primary-200 text-sm">Multilingual AI Health Triage for Bharat</p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl">
        <div className="max-w-sm mx-auto">
          {step === 1 ? (
            <>
              <div className="mb-6">
                <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">{t('aadhaarTitle')}</h2>
                <p className="text-slate-500 text-sm">{t('aadhaarSubtitle')}</p>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { icon: Lock, label: 'Encrypted', color: 'text-emerald-600 bg-emerald-50' },
                  { icon: Shield, label: 'UIDAI Safe', color: 'text-blue-600 bg-blue-50' },
                  { icon: Fingerprint, label: 'Biometric', color: 'text-purple-600 bg-purple-50' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('aadhaarLabel')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={handleAadhaarChange}
                    placeholder={t('aadhaarPlaceholder')}
                    className="w-full px-4 py-4 text-lg font-mono tracking-widest border-2 rounded-2xl outline-none transition-all
                      border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-slate-50 text-slate-800"
                    inputMode="numeric"
                  />
                  {aadhaar.replace(/\s/g,'').length === 12 && (
                    <CheckCircle2 className="absolute right-4 top-4 text-emerald-500" size={22} />
                  )}
                </div>
                {error && (
                  <p className="flex items-center gap-1.5 text-red-500 text-xs mt-2">
                    <AlertCircle size={13} />{error}
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-slate-400 text-xs mt-3">
                  <Lock size={11} />{t('aadhaarHint')}
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={loading || aadhaar.replace(/\s/g,'').length !== 12}
                className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200
                  bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-700 hover:to-teal-700 shadow-lg shadow-primary-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Securing...</span></>
                ) : (
                  <><span>{t('continueBtn')}</span><ChevronRight size={18} /></>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle2 size={28} className="text-emerald-500" />
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">{t('otpTitle')}</h2>
                <p className="text-slate-500 text-sm">{t('otpSent')}</p>
                {otpSent && <p className="text-primary-600 text-xs mt-1 font-medium">Demo OTP: 123456</p>}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('otpLabel')}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setError(''); }}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-4 text-2xl font-mono text-center tracking-[0.5em] border-2 rounded-2xl outline-none transition-all
                    border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-slate-50 text-slate-800"
                  inputMode="numeric"
                  maxLength={6}
                />
                {error && <p className="flex items-center gap-1.5 text-red-500 text-xs mt-2"><AlertCircle size={13} />{error}</p>}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all
                  bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></>
                ) : (
                  <><span>{t('verifyBtn')}</span><ChevronRight size={18} /></>
                )}
              </button>

              <button onClick={() => setStep(1)} className="w-full mt-3 py-3 text-sm text-slate-500 hover:text-primary-600 transition-colors">
                ← Change Aadhaar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarPage;
