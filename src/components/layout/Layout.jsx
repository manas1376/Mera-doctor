import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, WifiOff } from 'lucide-react';
import ProgressSteps from '../common/ProgressSteps';
import ReadAloudBtn from '../common/ReadAloudBtn';

const Layout = ({ children, step, readText, showProgress = true }) => {
  const { isOffline, t } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/30 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-display font-bold text-slate-800 text-sm tracking-tight">SwasthyaAI</span>
          </div>
          <div className="flex items-center gap-2">
            {readText && <ReadAloudBtn text={readText} />}
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isOffline ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
              {isOffline ? <WifiOff size={11} /> : <Wifi size={11} />}
              <span>{isOffline ? 'Offline' : 'Secure'}</span>
            </div>
          </div>
        </div>
        {showProgress && step && <ProgressSteps current={step} />}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 pb-8 pt-4">
        {isOffline && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
            <WifiOff size={14} />
            <span>{t('offlineMode')}</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
