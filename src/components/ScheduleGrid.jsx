import React, { useState } from 'react';

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];

export default function ScheduleGrid() {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const toggleSlot = (time) => {
    setSelectedSlots(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-bold text-legal-navy mb-4">Set Your Availability</h3>
      <p className="text-sm text-gray-500 mb-4">Select the slots you are available for consultations.</p>
      
      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map(time => (
          <button
            key={time}
            onClick={() => toggleSlot(time)}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              selectedSlots.includes(time) 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
      <button className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">
        Update Schedule
      </button>
    </div>
  );
}