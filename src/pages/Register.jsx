import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, User, Mail, Lock, Briefcase } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    barId: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5005/api/auth/register', formData);
      if (res.data.success) {
        alert("Registration Successful!");
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="bg-[#1a2b4b] p-10 flex flex-col justify-between text-white">
          <Shield size={40} className="mb-6" />
          <h2 className="text-3xl font-black leading-tight">Join the Elite Legal Network.</h2>
          <p className="mt-4 text-blue-200 text-sm">Professional end-to-end encrypted platform.</p>
          <div className="text-xs opacity-40 font-bold tracking-widest uppercase">© 2026 Advocated</div>
        </div>

        <div className="p-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Create Account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" placeholder="Full Name" required
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
            <input 
              type="text" placeholder="Bar Association ID" required
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              onChange={(e) => setFormData({...formData, barId: e.target.value})}
            />
            <input 
              type="email" placeholder="Work Email" required
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="password" placeholder="Password" required
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button className="w-full bg-[#1a2b4b] text-white py-3 rounded-lg font-bold text-sm mt-4 hover:bg-[#25395f]">
              Register Firm
            </button>
            <p className="text-center text-xs mt-4">
              Already have an account? <Link to="/login" className="text-blue-600 font-bold">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}