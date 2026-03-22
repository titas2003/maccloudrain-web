import React, { useState } from 'react';
// Merged all icons into a single import line
import { MoreVertical, Calendar as CalendarIcon } from 'lucide-react';
import { Clock } from 'lucide-react';

export default function AppointmentList() {
  const [filter, setFilter] = useState('upcoming');

  const appointments = [
    { id: 1, name: "Maya Sharma", date: "May 21, 2026", time: "10:00 AM", status: "Confirmed", type: "Consultation" },
    { id: 2, name: "Rahul Verma", date: "May 21, 2026", time: "02:30 PM", status: "Pending", type: "Case Review" },
    { id: 3, name: "Aditi Rao", date: "May 22, 2026", time: "11:00 AM", status: "Confirmed", type: "Legal Advice" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header / Filters */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex gap-4">
          {['upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-sm font-bold capitalize px-1 pb-2 border-b-2 transition-all ${
                filter === tab ? 'border-[#1a2b4b] text-[#1a2b4b]' : 'border-transparent text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="bg-[#1a2b4b] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <CalendarIcon size={16} /> Schedule New
        </button>
      </div>

      {/* The List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Date & Time</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-[#1a2b4b] font-bold text-xs">
                    {app.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{app.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{app.type}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">{app.date}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {app.time}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    app.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}