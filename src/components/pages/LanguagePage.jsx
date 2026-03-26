import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Globe, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { languageOptions } from '../../data/translations';
import Layout from '../layout/Layout';
import ReadAloudBtn from '../common/ReadAloudBtn';

const LanguagePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useApp();
  const [selected, setSelected] = useState(language);

  const handleSelect = (code) => {
    setSelected(code);
    setLanguage(code);
  };

  const handleContinue = () => {
    setLanguage(selected);
    navigate('/symptoms');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
      <div className="max-w-lg mx-auto px-4 pt-10 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-200">
            <Globe size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-800 mb-1">{t('selectLanguage')}</h1>
          <p className="text-slate-500 text-sm">{t('languageSubtitle')}</p>
          <div className="flex justify-center mt-3">
            <ReadAloudBtn text={`${t('selectLanguage')}. ${t('languageSubtitle')}`} />
          </div>
        </div>

        {/* Language grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {languageOptions.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 shadow-lg shadow-primary-100'
                    : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-md hover:bg-slate-50'
                  }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isSelected ? 'text-primary-700' : 'text-slate-800'}`}>{lang.native}</p>
                  <p className={`text-xs mt-0.5 ${isSelected ? 'text-primary-500' : 'text-slate-400'}`}>{lang.name}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <Check size={13} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all
            bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-700 hover:to-teal-700 shadow-lg shadow-primary-200"
        >
          <span>{t('next')}</span>
          <ChevronRight size={18} />
        </button>

        {/* Info note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          The entire app will appear in your selected language
        </p>
      </div>
    </div>
  );
};

export default LanguagePage;
