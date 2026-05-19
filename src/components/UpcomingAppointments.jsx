import React from 'react';
import { Clock, User, Calendar, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import StatusModal from './StatusModal';
import { useState } from 'react';

export default function UpcomingAppointments({ appointments, isLoading, isGlanceView = false }) {
  const queryClient = useQueryClient();
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });

  const completeMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('advocateToken');
      return axios.patch(`http://localhost:5006/api/advocate/appointments/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['upcomingAppointments']);
      queryClient.invalidateQueries(['advocateProfile']); // Refresh earnings
    },
    onError: (err) => {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.response?.data?.message || 'Failed to mark as completed'
      });
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
        <p className="text-xs text-slate-500 font-medium">Fetching schedule...</p>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ${isGlanceView ? 'h-full' : ''}`}>
      {!isGlanceView && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Upcoming Consultations</h3>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {appointments && appointments.length > 0 ? (
          appointments.map((apt) => (
            <div 
              key={apt._id} 
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer"
              onClick={() => {
                if (apt.meetingType === 'online' && apt.meetingLink) {
                  window.open(apt.meetingLink, '_blank', 'noopener,noreferrer');
                } else if (apt.meetingType === 'in-person' && apt.meetingAddress) {
                  setStatusModal({
                    isOpen: true,
                    type: 'info',
                    title: 'Meeting Address',
                    message: apt.meetingAddress
                  });
                }
              }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar/Initial */}
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold text-sm border border-slate-200">
                  {apt.clientId?.name?.charAt(0) || <User size={16}/>}
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {apt.clientId?.name || 'Guest Client'}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Clock size={12} /> {apt.slotId?.startTime || apt.startTime}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Calendar size={12} /> {(apt.slotId?.date || apt.date) ? new Date(apt.slotId?.date || apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No Date'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  apt.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {apt.status}
                </span>
                
                {apt.meetingType === 'online' && apt.meetingLink ? (
                  <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Join Call <ExternalLink size={10} />
                  </span>
                ) : apt.meetingType === 'in-person' && apt.meetingAddress ? (
                  <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    View Address →
                  </span>
                ) : null}

                {!isGlanceView && apt.status === 'accepted' && (
                  <button
                    disabled={completeMutation.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatusModal({
                        isOpen: true,
                        type: 'confirm',
                        title: 'Complete Appointment',
                        message: 'Mark this appointment as completed and collect earnings?',
                        onConfirm: () => {
                          setStatusModal({ ...statusModal, isOpen: false });
                          completeMutation.mutate(apt._id);
                        }
                      });
                    }}
                    className="mt-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md hover:bg-green-100 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                  >
                    <CheckCircle2 size={12} /> Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="text-slate-300" size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Appointments Found</p>
            <p className="text-[11px] text-slate-500 mt-1">Set your availability to receive bookings.</p>
          </div>
        )}
      </div>

      <StatusModal 
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onConfirm={statusModal.onConfirm}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />
    </div>
  );
}