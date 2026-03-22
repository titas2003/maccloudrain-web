import React from 'react';

export default function DocCenterShortcut() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold text-slate-800">Doc Center - New Files</h3>
        <button className="text-[10px] border border-slate-200 px-3 py-1 rounded-md text-slate-600 hover:bg-slate-50 transition-all font-medium flex items-center gap-1">
          Show Files <span className="opacity-50">▼</span>
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-6">Shortcut to recently uploaded documents.</p>
      
      <button className="w-full bg-[#1a2b4b] hover:bg-[#25395f] text-white py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-transform active:scale-[0.98] shadow-sm">
        <span className="text-xl font-light">+</span> Upload Document
      </button>

      {/* Optional: Small placeholder for a divider or sub-text as seen in UI */}
      <div className="mt-8 pt-4 border-t border-slate-50">
         <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Document - New Files</p>
      </div>
    </div>
  );
}