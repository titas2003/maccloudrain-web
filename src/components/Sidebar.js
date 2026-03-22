import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  UserCircle, // Added this import
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleMenu }) {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, active: true },
    { name: 'Appointments', icon: <Calendar size={20}/> },
    { name: 'Document Center', icon: <FileText size={20}/> },
    { name: 'Verify Client', icon: <ShieldCheck size={20}/> },
    { name: 'My Profile Card', icon: <CreditCard size={20}/> },
    { name: 'Account Settings', icon: <UserCircle size={20}/> }, // Now works!
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-[60] w-64 bg-slate-900 text-white p-6 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 lg:relative lg:inset-auto
    `}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black text-blue-400">ADVOCATED</h1>
        {/* Close button - Only visible on mobile */}
        <button onClick={toggleMenu} className="lg:hidden text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.name} 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}