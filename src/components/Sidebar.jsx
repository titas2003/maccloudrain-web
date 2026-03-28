import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  UserCircle, 
  X, 
  LogOut 
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleMenu }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear the advocate's session data
    localStorage.removeItem('advocateToken');
    localStorage.removeItem('user');
    
    // 2. Close the menu (for mobile users)
    if (toggleMenu) toggleMenu();

    // 3. Redirect to the login page
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/Dashboard' },
    { name: 'Appointments', icon: <Calendar size={20} />, path: '/appointments' },
    { name: 'Document Center', icon: <FileText size={20} />, path: '/documents' },
    { name: 'Verify Client', icon: <ShieldCheck size={20} />, path: '/verify' },
    { name: 'My Profile Card', icon: <CreditCard size={20} />, path: '/profile' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:inset-auto shadow-2xl lg:shadow-none`}>
      
      {/* Branding */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black text-blue-400 italic tracking-tighter">ADVOCATED</h1>
        <button onClick={toggleMenu} className="lg:hidden text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            onClick={() => { if(window.innerWidth < 1024) toggleMenu(); }} 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
              ${location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      {/* Account Section Footer */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <Link 
          to="/profile-settings" 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <UserCircle size={20} /> My Account
        </Link>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}