import React from 'react';

export default function AdvertisingProfile() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-4">Advertising & Profile</h3>
      
      {/* The Navy Blue Preview Card */}
      <div className="bg-[#1a2b4b] text-white p-4 rounded-xl flex items-center justify-between mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-400 rounded-full border-2 border-white/20" />
          <div>
            <p className="font-bold text-sm">Maya Sharma</p>
            <p className="text-[10px] opacity-70">Advocate Card</p>
          </div>
        </div>
        <button className="text-[10px] border border-white/30 px-3 py-1 rounded-md hover:bg-white/10 transition-colors">
          Preview
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex gap-12 px-2">
        <div>
          <p className="text-xl font-bold text-slate-800">3,27K</p>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Views</p>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-800">1,778</p>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Profile Clicks</p>
        </div>
      </div>
    </div>
  );
}