import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import these
import { LayoutDashboard, Calendar, FileText, ShieldCheck, CreditCard, UserCircle, X } from 'lucide-react';

export default function Sidebar({ isOpen, toggleMenu }) {
  const location = useLocation(); // This tells us which page is currently active

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Appointments', icon: <Calendar size={20} />, path: '/appointments' },
    { name: 'Document Center', icon: <FileText size={20} />, path: '/documents' },
    { name: 'Verify Client', icon: <ShieldCheck size={20} />, path: '/verify' },
    { name: 'My Profile Card', icon: <CreditCard size={20} />, path: '/profile' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:inset-auto`}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black text-blue-400">ADVOCATED</h1>
        <button onClick={toggleMenu} className="lg:hidden text-slate-400"><X size={24} /></button>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            onClick={toggleMenu} // Close sidebar on mobile after click
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}