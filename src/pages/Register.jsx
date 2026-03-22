import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Mail, Lock, Briefcase } from 'lucide-react';

export default function Register() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Branding Side */}
        <div className="bg-[#1a2b4b] p-10 flex flex-col justify-between text-white">
          <div>
            <Shield size={40} className="mb-6" />
            <h2 className="text-3xl font-black leading-tight">Join the Elite Legal Network.</h2>
            <p className="mt-4 text-blue-200 text-sm leading-relaxed">
              Streamline your practice, manage cases, and verify clients with our end-to-end encrypted platform.
            </p>
          </div>
          <div className="text-xs opacity-40 font-bold uppercase tracking-widest">
            © 2026 Advocated Systems
          </div>
        </div>

        {/* Form Side */}
        <div className="p-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Create Account</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-300" size={16} />
                <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Bar Association ID</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-slate-300" size={16} />
                <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-300" size={16} />
                <input type="email" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-300" size={16} />
                <input type="password" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400" />
              </div>
            </div>

            <button className="w-full bg-[#1a2b4b] text-white py-3 rounded-lg font-bold text-sm mt-4 hover:bg-[#25395f] transition-all">
              Register Firm
            </button>

            <p className="text-center text-xs text-slate-500 mt-4">
              Already have an account? <Link to="/" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}