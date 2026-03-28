import React from 'react';
import { Clock, User, Calendar, ExternalLink, Loader2 } from 'lucide-react';

export default function UpcomingAppointments({ appointments, isLoading }) {
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
        <p className="text-xs text-slate-500 font-medium">Fetching schedule...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">Upcoming Consultations</h3>
        </div>
        <button className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1">
          View All <ExternalLink size={12} />
        </button>
      </div>

      <div className="space-y-4">
        {appointments && appointments.length > 0 ? (
          appointments.map((apt) => (
            <div key={apt._id} className="group flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                {/* Avatar/Initial */}
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold text-sm border border-slate-200">
                  {apt.clientId?.fullName?.charAt(0) || <User size={16}/>}
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {apt.clientId?.fullName || 'Guest Client'}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Clock size={12} /> {apt.startTime}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Calendar size={12} /> {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  apt.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {apt.status}
                </span>
                <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Join Call →
                </span>
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
    </div>
  );
}