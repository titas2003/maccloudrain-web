import React from 'react';

export default function CaseTimeline() {
  const steps = [
    { label: "Pre-trial", sub: "Case 1", active: true },
    { label: "Filing", sub: "Case 1", active: true },
    { label: "Discovery", sub: "Case 2", active: true },
    { label: "Discovery", sub: "Case 3", active: false },
    { label: "Pre-trial", sub: "Case 3", active: false },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-1">Case Timeline</h3>
      <p className="text-xs text-slate-400 mb-6 font-medium">
        Quick-access to new of key ongoing cases.
      </p>

      {/* The Arrow/Chevron Container */}
      <div className="flex items-center w-full h-10 gap-1">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`relative flex-1 h-full flex items-center justify-center text-[10px] font-bold transition-colors
              ${step.active ? 'bg-[#1a2b4b] text-white' : 'bg-slate-200 text-slate-500'}
            `}
            style={{
              // This creates the arrow shape: 
              // It points right by pushing the right side out and pulling the left side in.
              clipPath: i === 0 
                ? 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)' 
                : i === steps.length - 1
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)'
                : 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%)'
            }}
          >
            {step.label}
          </div>
        ))}
      </div>

      {/* The Sub-labels (Case 1, Case 2, etc.) */}
      <div className="flex justify-between mt-3 px-1">
        {steps.map((step, i) => (
          <span key={i} className="text-[11px] text-slate-400 flex-1 text-center font-medium">
            {step.sub}
          </span>
        ))}
      </div>
    </div>
  );
}