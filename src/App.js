// import React from 'react';
// import Layout from './components/Layout';
// import UpcomingAppointments from './components/UpcomingAppointments';
// import CaseNotesRecent from './components/CaseNotesRecent';
// import ClientVerifier from './components/ClientVerifier'; 
// import CaseTimeline from './components/CaseTimeline';
// import AdvertisingProfile from './components/AdvertisingProfile';
// import DocCenterShortcut from './components/DocCenterShortcut';

// export default function App() {
//   return (
//     <Layout>
//       {/* Top Header with Notification and Profile */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
//         <div className="flex items-center gap-6">
//           <div className="relative">
//             <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
//             <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
//           </div>
//           <div className="flex items-center gap-3">
//             <img src="https://i.imgur.com/8Km9tLL.png" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
//             <span className="text-sm font-semibold text-slate-700">Maya Sharma</span>
//             <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
//           </div>
//         </div>
//       </div>

//       {/* The Exact Grid from Image */}
//       <div className="grid grid-cols-12 gap-6">
        
//         {/* ROW 1 */}
//         <div className="col-span-12 lg:col-span-7">
//           <UpcomingAppointments />
//         </div>
//         <div className="col-span-12 lg:col-span-5">
//           <CaseNotesRecent />
//         </div>

//         {/* SECTION LABEL */}
//         <div className="col-span-12">
//           <h2 className="text-lg font-bold text-slate-800 mt-4">Client Management</h2>
//         </div>

//         {/* ROW 2 */}
//         <div className="col-span-12 lg:col-span-6">
//           <ClientVerifier />
//         </div>
//         <div className="col-span-12 lg:col-span-6">
//           <CaseTimeline />
//         </div>

//         {/* ROW 3 */}
//         <div className="col-span-12 lg:col-span-5">
//           <AdvertisingProfile />
//         </div>
//         <div className="col-span-12 lg:col-span-7">
//           <DocCenterShortcut />
//         </div>
//       </div>
//     </Layout>
//   );
// }

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/Appointments'; // The page we created in the last step
import DocumentCenter from './pages/DocumentCenter';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/documents" element={<DocumentCenter />} />
        {/* You can add more routes here later, like /documents */}
      </Routes>
    </Router>
  );
}