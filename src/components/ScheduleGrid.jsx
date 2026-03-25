import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];

export default function ScheduleGrid() {
  const queryClient = useQueryClient();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // 1. FETCH existing availability from the backend
  // We use the 'advocateProfile' key to keep everything in sync
  const { data: profileData, isLoading: isFetching, isError: fetchError } = useQuery({
    queryKey: ['advocateProfile'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5005/api/advocates/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data; 
    },
    // Only fetch if we have a token
    enabled: !!localStorage.getItem('advocateToken'),
  });

  // 2. SYNC local state when data arrives from the server
  // This ensures that "8:00 AM" (or any slot) stays selected after a refresh
  useEffect(() => {
    if (profileData?.schedules) {
      const savedTimes = profileData.schedules.map(s => s.startTime);
      setSelectedSlots(savedTimes);
    }
  }, [profileData]);

  // 3. UPDATE mutation to save changes
  const mutation = useMutation({
    mutationFn: (schedules) => {
      const token = localStorage.getItem('advocateToken');
      return axios.post('http://localhost:5005/api/availability', 
        { schedules },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      // Refresh the profile data so the UI is 100% accurate
      queryClient.invalidateQueries(['advocateProfile']);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  const toggleSlot = (time) => {
    setSelectedSlots(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleUpdate = () => {
    // Map the simple string array to the object format the Backend expects
    const formattedSchedules = selectedSlots.map(slot => ({
      dayOfWeek: "Monday", // Logic can be expanded to dynamic days later
      startTime: slot,
      endTime: slot, 
      isActive: true
    }));
    mutation.mutate(formattedSchedules);
  };

  // Loading State
  if (isFetching) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[250px]">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={28} />
        <p className="text-sm text-slate-500 font-semibold tracking-tight">Syncing your schedule...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-[#1a2b4b]">
          <Clock size={18} className="text-blue-600" />
          <h3 className="font-bold tracking-tight">Set Your Availability</h3>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-black uppercase tracking-wider">
          Live
        </span>
      </div>
      
      <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
        Select the specific hours you are available for consultations. Changes reflect instantly on your public profile.
      </p>
      
      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map(time => {
          const isSelected = selectedSlots.includes(time);
          return (
            <button
              key={time}
              type="button"
              onClick={() => toggleSlot(time)}
              disabled={mutation.isPending}
              className={`p-3 rounded-xl border text-xs font-bold transition-all duration-200 ${
                isSelected 
                ? 'bg-[#1a2b4b] text-white border-[#1a2b4b] shadow-lg scale-[1.02]' 
                : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-300 hover:bg-white'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <button 
        onClick={handleUpdate}
        disabled={mutation.isPending}
        className="w-full mt-6 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:grayscale"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : showSuccess ? (
          <><CheckCircle size={18} /> Schedule Updated</>
        ) : (
          'Update Schedule'
        )}
      </button>

      {/* Error Feedback */}
      {(fetchError || mutation.isError) && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-500">
          <AlertCircle size={14} />
          <p className="text-[10px] font-bold">Server connection error</p>
        </div>
      )}
    </div>
  );
}