import React, { useState } from 'react';
import { StickyNote, Plus, MoreVertical } from 'lucide-react';

export default function CaseNotesRecent() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Sharma vs. State', text: 'Check the bail application status for Monday.', date: '2 hours ago' },
    { id: 2, title: 'Property Dispute', text: 'Verify the land deed records from 1994.', date: '5 hours ago' }
  ]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <StickyNote size={20} className="text-amber-500" />
          <h3 className="font-bold text-slate-800">Recent Case Notes</h3>
        </div>
        <button className="p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Plus size={16} className="text-slate-600" />
        </button>
      </div>

      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 group relative">
            <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">{note.title}</h4>
            <p className="text-sm text-slate-600 line-clamp-2">{note.text}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-amber-600/60 uppercase">{note.date}</span>
              <MoreVertical size={14} className="text-amber-400 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}