import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Layout from '../components/Layout';
import UpcomingAppointments from '../components/UpcomingAppointments';
import CaseNotesRecent from '../components/CaseNotesRecent';
import ClientVerifier from '../components/ClientVerifier'; 
import CaseTimeline from '../components/CaseTimeline';
import AdvertisingProfile from '../components/AdvertisingProfile';
import DocCenterShortcut from '../components/DocCenterShortcut';
import { Bell, ChevronDown, Users, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

export default function Dashboard() {
  // 1. Fetch Dashboard Stats & Profile Data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5005/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  // 2. Fetch Profile for Header
  const { data: profile } = useQuery({
    queryKey: ['advocateProfile'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5005/api/advocates/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  const stats = dashboardData?.stats || { totalAppointments: 0, upcomingCount: 0, activeSlots: 0, newClients: 0 };

  return (
    <Layout>
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-xs mt-1">Welcome back, Adv. {profile?.fullName?.split(' ')[0] || 'Advocate'}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors">
            {stats.upcomingCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
            )}
            <Bell size={22} className="text-slate-400" />
          </div>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <img 
              src={profile?.profileImage || "https://i.imgur.com/8Km9tLL.png"} 
              alt="Profile" 
              className="w-9 h-9 rounded-full object-cover border border-slate-200" 
            />
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                {profile?.fullName || 'Loading...'}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Cases', value: stats.totalAppointments, icon: <ShieldCheck className="text-blue-600" size={20}/> },
          { label: 'Upcoming', value: stats.upcomingCount, icon: <Calendar className="text-orange-500" size={20}/> },
          { label: 'New Clients', value: stats.newClients, icon: <Users className="text-green-600" size={20}/> },
          { label: 'Active Slots', value: stats.activeSlots, icon: <ShieldCheck className="text-purple-600" size={20}/> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-slate-800">{isLoading ? '...' : stat.value}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Main Grid System */}
      <div className="grid grid-cols-12 gap-6 pb-10">
        
        {/* ROW 1: Appointments & Case Notes */}
        <div className="col-span-12 lg:col-span-7">
          <UpcomingAppointments appointments={dashboardData?.recentAppointments} isLoading={isLoading} />
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