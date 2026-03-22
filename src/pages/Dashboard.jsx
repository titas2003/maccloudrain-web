import React from 'react';
import Layout from '../components/Layout';
import UpcomingAppointments from '../components/UpcomingAppointments';
import CaseNotesRecent from '../components/CaseNotesRecent';
import ClientVerifier from '../components/ClientVerifier'; 
import CaseTimeline from '../components/CaseTimeline';
import AdvertisingProfile from '../components/AdvertisingProfile';
import DocCenterShortcut from '../components/DocCenterShortcut';
import { Bell, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  return (
    <Layout>
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors">
            <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
            <Bell size={22} className="text-slate-400" />
          </div>
          
          {/* User Profile Dropdown */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <img 
              src="https://i.imgur.com/8Km9tLL.png" 
              alt="Profile" 
              className="w-9 h-9 rounded-full object-cover border border-slate-200" 
            />
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                Maya Sharma
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid System */}
      <div className="grid grid-cols-12 gap-6 pb-10">
        
        {/* ROW 1: Appointments & Case Notes */}
        <div className="col-span-12 lg:col-span-7">
          <UpcomingAppointments />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <CaseNotesRecent />
        </div>

        {/* SECTION LABEL */}
        <div className="col-span-12">
          <h2 className="text-lg font-bold text-slate-800 mt-4 mb-[-8px]">Client Management</h2>
        </div>

        {/* ROW 2: Client Validation & Timeline */}
        <div className="col-span-12 lg:col-span-6">
          <ClientVerifier />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <CaseTimeline />
        </div>

        {/* ROW 3: Advertising & Document Center */}
        <div className="col-span-12 lg:col-span-5">
          <AdvertisingProfile />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <DocCenterShortcut />
        </div>

      </div>
    </Layout>
  );
}