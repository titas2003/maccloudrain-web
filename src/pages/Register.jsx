import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Loader2, MapPin, Briefcase, User } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Updated state to include new required fields
  const [formData, setFormData] = useState({
    fullName: '',
    barId: '',
    email: '',
    password: '',
    city: '',
    area: '',
    specialization: '',
    experienceYears: ''
  });

  const specializations = [
    'Criminal', 'Civil', 'Corporate', 'Family', 'Tax', 'Intellectual Property', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5005/api/auth/register', formData);
      if (res.data.success) {
        alert("Registration Successful! Please log in.");
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        
        {/* Left Sidebar Info */}
        <div className="bg-[#1a2b4b] p-10 flex flex-col justify-between text-white md:col-span-1">
          <Shield size={40} className="mb-6 text-blue-400" />
          <div>
            <h2 className="text-3xl font-black leading-tight">Join the Elite Legal Network.</h2>
            <p className="mt-4 text-blue-200 text-sm leading-relaxed">
              Complete your profile to help clients find you based on your location and expertise.
            </p>
          </div>
          <div className="text-[10px] opacity-40 font-bold tracking-widest uppercase mt-8">
            © 2026 Advocated Platform
          </div>
        </div>

        {/* Form Area */}
        <div className="p-8 md:p-12 md:col-span-2">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Create Professional Account</h3>
          <p className="text-slate-500 text-sm mb-8">Please fill in your bar details and location.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input 
                  type="text" placeholder="Adv. John Doe" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Bar ID</label>
                <input 
                  type="text" placeholder="BAR-12345-2024" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  onChange={(e) => setFormData({...formData, barId: e.target.value})}
                />
              </div>
            </div>

            {/* Row 2: Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <input 
                  type="email" placeholder="work@firm.com" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                <input 
                  type="password" placeholder="••••••••" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Row 3: Location (NEW) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                  <MapPin size={12} /> City
                </label>
                <input 
                  type="text" placeholder="e.g. Kolkata" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                  <MapPin size={12} /> Area / Locality
                </label>
                <input 
                  type="text" placeholder="e.g. Salt Lake" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
            </div>

            {/* Row 4: Professional (NEW) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                  <Briefcase size={12} /> Specialization
                </label>
                <select 
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none appearance-none"
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                >
                  <option value="">Select Field</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Exp. (Years)</label>
                <input 
                  type="number" placeholder="e.g. 5" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                />
              </div>
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-[#1a2b4b] text-white py-4 rounded-xl font-bold text-sm mt-6 hover:bg-[#25395f] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Complete Registration"}
            </button>
            
            <p className="text-center text-xs mt-6 text-slate-500">
              Already have an account? <Link to="/" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}