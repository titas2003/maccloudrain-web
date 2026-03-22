import React from 'react';
import Layout from '../components/Layout';
import { 
  User, Mail, Phone, MapPin, 
  ExternalLink, Download, Share2, Edit3 
} from 'lucide-react';

export default function ProfileCard() {
  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Profile Card</h1>
          <p className="text-slate-500 text-sm">Manage your digital advocate identity and public visibility.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Share2 size={16} /> Share Card
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2b4b] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#25395f] transition-all">
            <Download size={16} /> Download QR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Edit Profile Form */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Edit3 size={18} className="text-blue-600" /> Professional Details
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                <input type="text" defaultValue="Maya Sharma" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
                <input type="text" defaultValue="Senior Advocate" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Practice Areas</label>
                <input type="text" defaultValue="Corporate Law, Civil Litigation, Family Law" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                <input type="email" defaultValue="maya.sharma@advocate.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone</label>
                <input type="text" defaultValue="+91 98765 43210" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            
            <button className="mt-8 w-full bg-[#1a2b4b] text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
              Save Changes
            </button>
          </div>
        </div>

        {/* Right: Live Preview (Matching Dashboard Style) */}
        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Live Card Preview</h3>
            
            {/* The Digital Card */}
            <div className="bg-[#1a2b4b] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative Circle Background */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-20 h-20 bg-slate-300 rounded-2xl border-4 border-white/10 overflow-hidden">
                    <img src="https://i.imgur.com/8Km9tLL.png" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
                       {/* Placeholder for QR Code */}
                       <div className="w-10 h-10 border-2 border-slate-800 border-dashed" />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-black tracking-tight">Maya Sharma</h2>
                  <p className="text-blue-300 font-bold text-sm uppercase tracking-widest">Senior Advocate</p>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-sm opacity-80">
                    <Mail size={16} /> maya.sharma@advocate.com
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-80">
                    <Phone size={16} /> +91 98765 43210
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-80">
                    <MapPin size={16} /> High Court, New Delhi
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Verified Advocate</span>
                  <div className="h-6 w-12 bg-white/20 rounded-full flex items-center px-1">
                    <div className="h-4 w-4 bg-white rounded-full shadow-sm ml-auto" />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400 font-medium px-8">
              This card is visible to clients when they scan your QR code or visit your public link.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}