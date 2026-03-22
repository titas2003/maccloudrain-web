import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query'; // Import QueryClient
import { Shield, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Initialize Query Client
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5005/api/auth/login', { 
        email, 
        password 
      });

      if (res.data.success) {
        // 1. Clear any old cached data from previous sessions
        queryClient.clear();

        // 2. Persistent Storage
        localStorage.setItem('advocateToken', res.data.token);
        localStorage.setItem('advocateName', res.data.user.fullName);
        
        // 3. Set global axios header for this session
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        // 4. Redirect to Dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || "Connection to legal server failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        <div className="bg-[#1a2b4b] p-8 text-center text-white">
          <Shield className="mx-auto mb-4" size={32} />
          <h2 className="text-2xl font-black uppercase tracking-tight">Advocated</h2>
          <p className="text-blue-200 text-xs mt-1 opacity-80">Secure Legal Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-[11px] font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Work Email</label>
              <input 
                type="email" 
                placeholder="advocate@firm.com" 
                required
                value={email}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Security Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                value={password}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a2b4b] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#25395f] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500">
              New to the platform? <Link to="/register" className="text-blue-600 font-bold hover:underline">Request Access</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}