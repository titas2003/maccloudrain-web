import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  MoreVertical, 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  X, 
  Video, 
  Loader2,
  ExternalLink 
} from 'lucide-react';

export default function AppointmentList() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('Pending'); // Matches our new Backend Enums

  // 1. Fetch Appointments based on current tab
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', filter],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get(`http://localhost:5005/api/appointments?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  // 2. Mutation for Accept/Reject
  const statusMutation = useMutation({
    mutationFn: async ({ id, status, meetingLink }) => {
      const token = localStorage.getItem('advocateToken');
      return axios.patch(`http://localhost:5005/api/appointments/${id}/status`, 
        { status, meetingLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      // Real-time update: Refresh both Pending and Accepted lists
      queryClient.invalidateQueries(['appointments']);
    }
  });

  const handleAction = (id, action) => {
    if (action === 'Accepted') {
      const link = prompt("Enter the Meeting Link (e.g., Google Meet/Zoom):", "https://meet.google.com/");
      if (link) {
        statusMutation.mutate({ id, status: 'Accepted', meetingLink: link });
      }
    } else {
      if (window.confirm("Are you sure you want to reject this request?")) {
        statusMutation.mutate({ id, status: 'Rejected' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header / Tabs */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-6">
            {['Pending', 'Accepted', 'Completed', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-sm font-bold capitalize px-1 pb-2 border-b-2 transition-all ${
                  filter === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
                }`}
              >
                {tab === 'Pending' ? 'New Requests' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* The List */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-2" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Syncing with Court...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Client Name</th>
                  <th className="px-6 py-4 text-left">Case Type</th>
                  <th className="px-6 py-4 text-left">Date & Time</th>
                  {filter === 'Accepted' && <th className="px-6 py-4 text-left">Meeting Link</th>}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments?.length > 0 ? (
                  appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#1a2b4b] text-white rounded-full flex items-center justify-center font-bold text-xs">
                          {app.clientName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{app.clientName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase">
                          {app.caseType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-700">
                          {new Date(app.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Clock size={12} /> {app.time}
                        </div>
                      </td>

                      {/* Show Meeting Link only for Accepted Tab */}
                      {filter === 'Accepted' && (
                        <td className="px-6 py-4">
                          <a 
                            href={app.meetingLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg w-fit transition-all"
                          >
                            <Video size={14} /> Join Session <ExternalLink size={12} />
                          </a>
                        </td>
                      )}

                      <td className="px-6 py-4 text-right">
                        {filter === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleAction(app._id, 'Accepted')}
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all shadow-sm"
                              title="Accept"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleAction(app._id, 'Rejected')}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button className="text-slate-300 hover:text-slate-600">
                            <MoreVertical size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No {filter} appointments found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}