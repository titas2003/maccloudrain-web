import React from 'react';
import Layout from '../components/Layout';
import AppointmentRequests from '../components/AppointmentRequests';
import UpcomingAppointments from '../components/UpcomingAppointments';
import ScheduleGrid from '../components/ScheduleGrid';
import { Clock } from 'lucide-react'; 
import CalendarSync from '../components/CalendarSync';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function AppointmentsPage() {
  const { data: upcomingAppointments, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5006/api/advocate/appointments/upcoming', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Appointments</h1>
        <p className="text-slate-500">Manage your consultation schedule and client meetings.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main List Area (Left) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AppointmentRequests />
          <UpcomingAppointments appointments={upcomingAppointments} isLoading={isAppointmentsLoading} />
        </div>

        {/* Quick Availability / Calendar Area (Right) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" size={18} /> Quick Availability
            </h3>
            <ScheduleGrid />
          </div>
        </div>
      </div>

      {/* Sync View Section at the bottom */}
      <div className="mt-8 pb-10">
        <CalendarSync />
      </div>
    </Layout>
  );
}