import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar as CalIcon, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function CalendarSync() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: syncData, isLoading } = useQuery({
    queryKey: ['calendarSync', selectedDate],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get(`http://localhost:5005/api/appointments/sync/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <CalIcon size={20} className="text-blue-600" /> Daily Sync View
        </h3>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-xs font-bold border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Checking Availability...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Added Optional Chaining ?. to prevent map errors */}
            {syncData?.allAvailableSlots?.map((slot) => {
              const isBooked = syncData?.bookedTimes?.includes(slot);
              return (
                <div 
                  key={slot}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    isBooked 
                    ? 'border-blue-200 bg-blue-50 text-blue-700' 
                    : 'border-slate-50 bg-slate-50 text-slate-400 opacity-60'
                  }`}
                >
                  <Clock size={16} />
                  <span className="text-xs font-black">{slot}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isBooked ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isBooked ? 'Booked' : 'Free'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Fallback for when there are no slots set */}
          {(!syncData?.allAvailableSlots || syncData.allAvailableSlots.length === 0) && (
            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              <AlertCircle className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">No Availability Set</p>
              <p className="text-[10px] text-slate-500 mt-1">Visit 'Schedule' to set your working hours for this day.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}