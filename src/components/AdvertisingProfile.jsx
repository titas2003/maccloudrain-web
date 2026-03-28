import React, { useState } from 'react';
import { Megaphone, ToggleLeft, ToggleRight, Eye } from 'lucide-react';

export default function AdvertisingProfile() {
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Megaphone size={18} className="text-purple-600" />
          <h3 className="font-bold text-slate-800 text-sm">Profile Visibility</h3>
        </div>
        <button onClick={() => setIsLive(!isLive)} className="transition-colors">
          {isLive ? <ToggleRight size={32} className="text-green-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase">Search Status</span>
          <span className={`text-[10px] font-bold ${isLive ? 'text-green-600' : 'text-slate-400'}`}>
            {isLive ? 'VISIBLE IN CITY' : 'HIDDEN'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 ${isLive ? 'w-full bg-green-500' : 'w-0'}`}></div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50 rounded-xl text-xs font-bold text-slate-600 transition-all">
        <Eye size={16} /> Preview Public Card
      </button>
    </div>
  );
}