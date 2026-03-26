import React from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const steps = [
  { key: 'aadhaar', label: 'Verify' },
  { key: 'language', label: 'Language' },
  { key: 'symptoms', label: 'Symptoms' },
  { key: 'followup', label: 'Details' },
  { key: 'triage', label: 'Result' },
  { key: 'report', label: 'Report' },
];

const ProgressSteps = ({ current }) => {
  const { language } = useApp();
  const currentIdx = steps.findIndex(s => s.key === current);

  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto px-4 py-3">
      {steps.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center min-w-[48px]">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${done ? 'bg-teal-500 text-white' : active ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-100 text-gray-400'}`}>
                {done ? <Check size={13} /> : <span>{i + 1}</span>}
              </div>
              <span className={`text-[9px] mt-1 font-medium whitespace-nowrap ${active ? 'text-primary-600' : done ? 'text-teal-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-8 mx-0.5 mt-[-10px] rounded transition-all duration-300 ${i < currentIdx ? 'bg-teal-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
