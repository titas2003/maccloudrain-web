import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, Clock, User, CheckCircle, XCircle, MapPin, Video, Loader2 } from 'lucide-react';

export default function AppointmentRequests() {
    const queryClient = useQueryClient();
    const [schedulingRequest, setSchedulingRequest] = useState(null);
    const [scheduleData, setScheduleData] = useState({ meetingType: 'in-person', meetingAddress: '' });

    // 1. Fetch Pending Requests
    const { data: requests, isLoading } = useQuery({
        queryKey: ['appointmentRequests'],
        queryFn: async () => {
            const token = localStorage.getItem('advocateToken');
            const res = await axios.get('http://localhost:5006/api/advocate/appointments/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data.data || [];
        }
    });

    // 2. Respond Mutation (Accept/Reject)
    const respondMutation = useMutation({
        mutationFn: async ({ id, action }) => {
            const token = localStorage.getItem('advocateToken');
            return axios.patch(`http://localhost:5006/api/advocate/appointments/${id}/respond`,
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['appointmentRequests']);
            queryClient.invalidateQueries(['upcomingAppointments']); // Refresh dashboard schedule
        }
    });

    // 3. Schedule Mutation (Set Location/Type)
    const scheduleMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const token = localStorage.getItem('advocateToken');
            return axios.patch(`http://localhost:6/api/advocate/appointments/${id}/schedule`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: () => {
            setSchedulingRequest(null);
            setScheduleData({ meetingType: 'in-person', meetingAddress: '' });
            queryClient.invalidateQueries(['appointmentRequests']);
            queryClient.invalidateQueries(['upcomingAppointments']);
        }
    });

    // Handlers
    const handleReject = (id) => {
        if (window.confirm('Are you sure you want to decline this appointment?')) {
            respondMutation.mutate({ id, action: 'reject' });
        }
    };

    const handleAcceptInitiate = (request) => {
        // Opens the scheduling modal
        setSchedulingRequest(request);
    };

    const handleConfirmSchedule = async (e) => {
        e.preventDefault();
        if (!schedulingRequest) return;

        try {
            // Step 1: Accept the request
            await respondMutation.mutateAsync({ id: schedulingRequest._id, action: 'accept' });
            // Step 2: Schedule the meeting details
            await scheduleMutation.mutateAsync({ id: schedulingRequest._id, data: scheduleData });
            alert("Appointment Confirmed and Scheduled!");
        } catch (error) {
            alert("Failed to schedule appointment. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Client Requests</h2>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                    {requests?.length || 0} Pending
                </span>
            </div>

            {(!requests || requests.length === 0) ? (
                <div className="text-center py-10 text-slate-400">
                    <Calendar size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-semibold">No pending requests right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req._id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-100 bg-slate-50 hover:bg-blue-50/30 transition-colors">
                            <div className="flex justify-between items-start flex-wrap gap-4">

                                {/* Client Info */}
                                <div>
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        {req.clientId?.name || 'Unknown Client'}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {req.slotId?.date ? new Date(req.slotId.date).toLocaleDateString() : 'No Date'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {req.slotId?.startTime || req.startTime} - {req.slotId?.endTime || req.endTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-400">
                                        {req.clientId?.email && <span className="flex items-center gap-1">{req.clientId.email}</span>}
                                        {req.clientId?.phone && <span className="flex items-center gap-1">{req.clientId.phone}</span>}
                                    </div>

                                    {req.notes && (
                                        <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Notes from Client:</p>
                                            <p className="text-xs text-slate-600 leading-relaxed">"{req.notes}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        disabled={respondMutation.isLoading}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Reject"
                                    >
                                        <XCircle size={22} />
                                    </button>
                                    <button
                                        onClick={() => handleAcceptInitiate(req)}
                                        disabled={respondMutation.isLoading}
                                        className="flex items-center gap-1 px-4 py-2 bg-[#1a2b4b] text-white text-xs font-bold rounded-lg hover:bg-[#25395f] transition-all active:scale-95"
                                    >
                                        <CheckCircle size={16} /> Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- SCHEDULING MODAL --- */}
            {schedulingRequest && (
                <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-2">Schedule Meeting</h3>
                        <p className="text-xs text-slate-500 mb-6">Set the location details for your appointment with <b>{schedulingRequest.clientId?.name}</b>.</p>

                        <form onSubmit={handleConfirmSchedule} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Meeting Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setScheduleData({ ...scheduleData, meetingType: 'in-person' })}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${scheduleData.meetingType === 'in-person' ? 'border-[#1a2b4b] bg-[#1a2b4b] text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <MapPin size={16} /> In Person
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setScheduleData({ ...scheduleData, meetingType: 'virtual' })}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${scheduleData.meetingType === 'virtual' ? 'border-[#1a2b4b] bg-[#1a2b4b] text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <Video size={16} /> Virtual
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 mt-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    {scheduleData.meetingType === 'in-person' ? 'Chamber Address' : 'Meeting Link (Zoom/Meet)'}
                                </label>
                                <textarea
                                    required
                                    placeholder={scheduleData.meetingType === 'in-person' ? "e.g. Chamber No. 12, District Court..." : "https://meet.google.com/..."}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none min-h-[80px]"
                                    value={scheduleData.meetingAddress}
                                    onChange={(e) => setScheduleData({ ...scheduleData, meetingAddress: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setSchedulingRequest(null)}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={scheduleMutation.isLoading || respondMutation.isLoading}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#1a2b4b] text-white hover:bg-[#25395f] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                                >
                                    {(scheduleMutation.isLoading || respondMutation.isLoading) ? <Loader2 size={16} className="animate-spin" /> : "Confirm & Send"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}