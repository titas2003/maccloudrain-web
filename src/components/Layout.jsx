import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Sidebar with state props */}
      <Sidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* 2. Main Content */}
      <main className="flex-1 lg:ml-0 p-4 md:p-12 w-full">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h1 className="font-bold text-slate-800">ADVOCATED</h1>
          <button onClick={toggleMenu} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleMenu}
        />
      )}
    </div>
  );
}