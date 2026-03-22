import React from 'react';
import Layout from '../components/Layout';
import AppointmentList from '../components/AppointmentList';
import ScheduleGrid from '../components/ScheduleGrid';
import { Clock } from 'lucide-react'; // Added this line

export default function AppointmentsPage() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Appointments</h1>
        <p className="text-slate-500">Manage your consultation schedule and client meetings.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main List Area (Left) */}
        <div className="col-span-12 lg:col-span-8">
          <AppointmentList />
        </div>

        {/* Quick Availability / Calendar Area (Right) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" size={18} /> Quick Availability
            </h3>
            <ScheduleGrid />
          </div>
          
          <div className="bg-[#1a2b4b] p-6 rounded-xl text-white shadow-lg">
            <h4 className="font-bold mb-2">Sync Calendar</h4>
            <p className="text-xs opacity-70 mb-4">Connect with Google or Outlook to avoid double bookings.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/30 py-2 rounded-lg text-sm font-bold transition-all">
              Connect Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}