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
  const { data: existingData, isLoading: isFetching } = useQuery({
    queryKey: ['availability'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5005/api/advocates/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data; // Assuming schedules are attached to the advocate profile
    }
  });

  // 2. Sync local state when data arrives from the server
  useEffect(() => {
    if (existingData?.schedules) {
      // Extract just the startTimes to highlight the buttons
      const savedSlots = existingData.schedules.map(s => s.startTime);
      setSelectedSlots(savedSlots);
    }
  }, [existingData]);

  // 3. UPDATE mutation (Your existing logic)
  const mutation = useMutation({
    mutationFn: (schedules) => {
      const token = localStorage.getItem('advocateToken');
      return axios.post('http://localhost:5005/api/availability', 
        { schedules },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['availability']);
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
    const formattedSchedules = selectedSlots.map(slot => ({
      dayOfWeek: "Monday", 
      startTime: slot,
      endTime: slot, 
      isActive: true
    }));
    mutation.mutate(formattedSchedules);
  };

  if (isFetching) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
        <p className="text-xs text-slate-500 font-medium">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#1a2b4b]">
          <Clock size={18} />
          <h3 className="font-bold">Set Your Availability</h3>
        </div>
        {/* Real-time status indicator */}
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Live Sync</span>
      </div>
      
      <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
        Select the hours you are available. These will be visible to clients in your area.
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map(time => {
          const isSelected = selectedSlots.includes(time);
          return (
            <button
              key={time}
              type="button"
              onClick={() => toggleSlot(time)}
              disabled={mutation.isPending}
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                isSelected 
                ? 'bg-[#1a2b4b] text-white border-[#1a2b4b] shadow-md' 
                : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-400'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>

      <button 
        onClick={handleUpdate}
        disabled={mutation.isPending}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : showSuccess ? (
          <><CheckCircle size={18} /> Schedule Saved</>
        ) : (
          'Update Schedule'
        )}
      </button>
    </div>
  );
}