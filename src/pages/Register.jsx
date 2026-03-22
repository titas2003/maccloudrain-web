import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    barId: '',
    email: '',
    password: ''
  });

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
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="bg-[#1a2b4b] p-10 flex flex-col justify-between text-white">
          <Shield size={40} className="mb-6" />
          <div>
            <h2 className="text-3xl font-black leading-tight">Join the Elite Legal Network.</h2>
            <p className="mt-4 text-blue-200 text-sm">Professional end-to-end encrypted platform for advocates.</p>
          </div>
          <div className="text-xs opacity-40 font-bold tracking-widest uppercase">© 2026 Advocated</div>
        </div>

        <div className="p-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Create Account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" placeholder="Full Name" required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
            <input 
              type="text" placeholder="Bar Association ID" required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
              onChange={(e) => setFormData({...formData, barId: e.target.value})}
            />
            <input 
              type="email" placeholder="Work Email" required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="password" placeholder="Create Password" required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <button 
              disabled={loading}
              className="w-full bg-[#1a2b4b] text-white py-3 rounded-xl font-bold text-sm mt-4 hover:bg-[#25395f] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Register Firm"}
            </button>
            
            <p className="text-center text-xs mt-4 text-slate-500">
              Already have an account? <Link to="/" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}