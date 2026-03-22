export default function ClientVerifier() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm h-full">
      <h3 className="font-bold text-slate-800 mb-4">Validate Client Authenticity</h3>
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input type="text" placeholder="Search client name..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
        </div>
        <button className="bg-[#1a2b4b] text-white px-6 py-2 rounded-lg text-xs font-bold whitespace-nowrap">Validate Clients</button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase border-b pb-2">
          <span>Name</span><span>Status</span>
        </div>
        {[1, 2].map(i => (
          <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0">
            <span className="font-medium text-slate-700">Maya Sharma {i}</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Validated</span>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${i === 1 ? 'bg-green-500' : 'bg-red-400'}`}>
                {i === 1 ? '✓' : '×'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}