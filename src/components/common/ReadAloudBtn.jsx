import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ReadAloudBtn = ({ text, className = '' }) => {
  const { speak, stopSpeaking, t } = useApp();
  const [speaking, setSpeaking] = useState(false);

  const handleToggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speak(text);
      setSpeaking(true);
      const est = Math.max(2000, text.length * 60);
      setTimeout(() => setSpeaking(false), est);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${speaking
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-95'
          : 'bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-400'
        } ${className}`}
      aria-label={t('readScreen')}
    >
      {speaking ? (
        <><VolumeX size={15} /><span>{t('readScreen')}</span><span className="flex gap-0.5"><span className="w-0.5 h-3 bg-white rounded animate-bounce" style={{animationDelay:'0ms'}}/><span className="w-0.5 h-3 bg-white rounded animate-bounce" style={{animationDelay:'150ms'}}/><span className="w-0.5 h-3 bg-white rounded animate-bounce" style={{animationDelay:'300ms'}}/></span></>
      ) : (
        <><Volume2 size={15} /><span>{t('readScreen')}</span></>
      )}
    </button>
  );
};

export default ReadAloudBtn;
