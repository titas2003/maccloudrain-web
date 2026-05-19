import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import StatusModal from './StatusModal';

export default function ScheduleGrid() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    recurrence: 'none',
    recurrenceEnd: ''
  });
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: '', title: '', message: '' });

  const { data: slots, isLoading: isFetching, isError } = useQuery({
    queryKey: ['advocateSlots'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5006/api/advocate/availability?status=available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('advocateToken');
      return axios.post('http://localhost:5006/api/advocate/availability', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advocateSlots']);
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        recurrence: 'none',
        recurrenceEnd: ''
      });
    },
    onError: (err) => {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.response?.data?.message || 'Failed to add availability'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('advocateToken');
      return axios.delete(`http://localhost:5006/api/advocate/availability/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advocateSlots']);
    },
    onError: (err) => {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.response?.data?.message || 'Failed to delete slot'
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
        Set the specific hours you are available for consultations. 
      </p>

      {/* ADD FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Date</label>
          <input type="date" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Start Time</label>
            <input type="time" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">End Time</label>
            <input type="time" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Recurrence</label>
          <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.recurrence} onChange={e => setFormData({...formData, recurrence: e.target.value})}>
            <option value="none">None (One time)</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        {formData.recurrence !== 'none' && (
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Recur Until</label>
            <input type="date" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.recurrenceEnd} onChange={e => setFormData({...formData, recurrenceEnd: e.target.value})} />
          </div>
        )}
        <button 
          type="submit" 
          disabled={addMutation.isPending} 
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
        >
          {addMutation.isPending ? <Loader2 className="animate-spin" size={16}/> : <><Plus size={16}/> Add Availability</>}
        </button>
      </form>

      {/* EXISTING SLOTS LIST */}
      <div className="pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" /> Your Active Slots
        </h4>
        
        {isFetching ? (
          <div className="flex justify-center py-6"><Loader2 className="animate-spin text-blue-500" size={24}/></div>
        ) : isError ? (
          <div className="flex items-center justify-center gap-2 text-red-500 py-4">
            <AlertCircle size={16} />
            <span className="text-xs font-bold">Failed to load slots</span>
          </div>
        ) : slots && slots.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 stylish-scrollbar">
            {slots.map(slot => (
              <div key={slot._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-red-100 hover:bg-red-50/20 transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    {new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {slot.startTime} - {slot.endTime}
                  </p>
                </div>
                <button 
                  onClick={() => deleteMutation.mutate(slot._id)}
                  disabled={deleteMutation.isPending}
                  className="text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 p-2 rounded-lg transition-all active:scale-95"
                  title="Remove Slot"
                >
                  {deleteMutation.isPending && deleteMutation.variables === slot._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Slots</p>
            <p className="text-[10px] text-slate-500 mt-1">Use the form above to add slots.</p>
          </div>
        )}
      </div>

      <StatusModal 
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />
    </div>
  );
}