export default function CaseNotesRecent() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-800">Case Notes - Recent Entries</h3>
        <select className="text-xs border border-slate-200 rounded p-1 bg-slate-50 outline-none">
          <option>Sort by date</option>
        </select>
      </div>
      <p className="text-xs text-slate-400 mb-6">Quick access to recently edited case notes.</p>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between border-b border-slate-100 pb-3 last:border-0">
            <div>
              <p className="text-sm font-bold text-slate-700">Case NotesNose {i}</p>
              <p className="text-xs text-slate-400">Recently edited case notes #1</p>
            </div>
            <span className="text-[10px] font-medium text-slate-400">May 21, 2023</span>
          </div>
        ))}
      </div>
    </div>
  );
}