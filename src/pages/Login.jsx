import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5005/api/auth/login', { email, password });
      if (res.data.success) {
        // Store token for protected routes
        localStorage.setItem('advocateToken', res.data.token);
        localStorage.setItem('advocateName', res.data.user.fullName);
        navigate('/Dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#1a2b4b] p-8 text-center text-white">
          <Shield className="mx-auto mb-4" size={32} />
          <h2 className="text-2xl font-black uppercase">Advocated</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-[#1a2b4b] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            Sign In <ArrowRight size={18} />
          </button>
          <p className="text-center text-sm">
            Need access? <Link to="/register" className="text-blue-600 font-bold">Request Access?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}