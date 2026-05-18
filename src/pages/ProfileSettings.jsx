import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  Settings, Palette, DollarSign, Star, 
  Loader2, CheckCircle, Moon, Sun, Monitor, Type
} from 'lucide-react';

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  const [feeInput, setFeeInput] = useState('');
  const [showFeeSuccess, setShowFeeSuccess] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  // Fetch Profile (for read-only summary & ratings)
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['advocateProfile'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5006/api/advocate/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  // Fetch Fees
  const { data: feesData, isLoading: isFeesLoading } = useQuery({
    queryKey: ['advocateFees'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5006/api/advocate/fees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  // Initialize fee input and theme when data arrives
  useEffect(() => {
    if (feesData?.feesPerSitting) {
      setFeeInput(feesData.feesPerSitting);
    }
  }, [feesData]);

  useEffect(() => {
    if (profile?.themePreference) {
      setCurrentTheme(profile.themePreference);
    } else {
      setCurrentTheme(localStorage.getItem('app-theme') || 'default');
    }
  }, [profile]);

  // Update Profile Mutation for Theme
  const updateThemeMutation = useMutation({
    mutationFn: async (theme) => {
      const token = localStorage.getItem('advocateToken');
      return axios.patch('http://localhost:5006/api/advocate/profile', { themePreference: theme }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advocateProfile']);
    }
  });

  // Update Fees Mutation
  const updateFeeMutation = useMutation({
    mutationFn: async (fees) => {
      const token = localStorage.getItem('advocateToken');
      return axios.patch('http://localhost:5006/api/advocate/fees', { feesPerSitting: fees }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advocateFees']);
      setShowFeeSuccess(true);
      setTimeout(() => setShowFeeSuccess(false), 3000);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update fees');
    }
  });

  const handleFeeSubmit = (e) => {
    e.preventDefault();
    if (feeInput) updateFeeMutation.mutate(Number(feeInput));
  };

  // Theme Handling
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('app-theme', theme);
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    updateThemeMutation.mutate(theme);
  };

  if (isProfileLoading || isFeesLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
          <p className="text-sm font-semibold tracking-wide">Loading Settings...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <Settings className="text-blue-600" /> Account Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your application preferences, fees, and view your summary.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Settings */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          
          {/* Theme Section */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Palette size={18} className="text-purple-500" /> App Theme
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => handleThemeChange('default')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${currentTheme === 'default' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <Sun size={24} className={currentTheme === 'default' ? 'text-blue-500' : 'text-slate-400'} />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Default</span>
              </button>

              <button 
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${currentTheme === 'dark' ? 'border-slate-800 bg-slate-800 shadow-md text-white' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <Moon size={24} className={currentTheme === 'dark' ? 'text-white' : 'text-slate-400'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${currentTheme === 'dark' ? 'text-white' : 'text-slate-600'}`}>Dark</span>
              </button>

              <button 
                onClick={() => handleThemeChange('solarized-dark')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${currentTheme === 'solarized-dark' ? 'border-teal-600 bg-[#002b36] shadow-md text-[#93a1a1]' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <Monitor size={24} className={currentTheme === 'solarized-dark' ? 'text-[#2aa198]' : 'text-slate-400'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${currentTheme === 'solarized-dark' ? 'text-[#93a1a1]' : 'text-slate-600'}`}>Solarized</span>
              </button>

              <button 
                onClick={() => handleThemeChange('bw')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${currentTheme === 'bw' ? 'border-gray-900 bg-gray-100 shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <Type size={24} className={currentTheme === 'bw' ? 'text-gray-900' : 'text-slate-400'} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-700">B & W</span>
              </button>
            </div>
          </section>

          {/* Fee Management Section */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" /> Consultation Fees
            </h3>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Active Fee</p>
                <p className="text-2xl font-black text-slate-800 mt-1">₹{feesData?.feesPerSitting || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience Bracket</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{feesData?.bracket?.bracketKey || 'Unknown'} Years</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Max Cap: ₹{feesData?.bracket?.maxFee || 0}</p>
              </div>
            </div>

            <form onSubmit={handleFeeSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Update Fee per Sitting (₹)</label>
                <input 
                  type="number" 
                  value={feeInput} 
                  onChange={(e) => setFeeInput(e.target.value)} 
                  min="1" 
                  max={feesData?.bracket?.maxFee || 99999}
                  required 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-green-400" 
                />
              </div>
              <button 
                type="submit" 
                disabled={updateFeeMutation.isPending} 
                className="w-32 bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex justify-center items-center gap-2"
              >
                {updateFeeMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : showFeeSuccess ? <CheckCircle size={18} /> : 'Update Fee'}
              </button>
            </form>
          </section>

        </div>

        {/* RIGHT COLUMN: Profile Read-Only Summary */}
        <div className="col-span-12 lg:col-span-5">
          <section className="bg-[#1a2b4b] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full" />
            
            <div className="relative z-10 flex-1 flex flex-col">
              <h3 className="text-xs font-black text-blue-300 uppercase tracking-widest mb-8">Profile Summary</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-slate-300 rounded-2xl border-4 border-white/10 overflow-hidden">
                  <img src={profile?.photo ? `http://localhost:5006/${profile.photo}` : "https://i.imgur.com/8Km9tLL.png"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{profile?.name || 'Advocate Name'}</h2>
                  <p className="text-sm font-medium text-slate-300 mt-1">{profile?.advId || 'ADV-0000'}</p>
                </div>
              </div>

              {/* Ratings Block */}
              <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md mb-8 flex items-center justify-between border border-white/5">
                <div>
                  <p className="text-3xl font-black text-white leading-none">{profile?.rating?.toFixed(1) || '0.0'}</p>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Average Rating</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mb-1 justify-end">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={`${star <= Math.round(profile?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300">{profile?.reviewsCount || 0} Total Reviews</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Experience</p>
                  <p className="text-lg font-bold mt-1">{profile?.yearsOfExperience || 0} Years</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${profile?.vStatus === 'Verified' ? 'bg-green-400' : 'bg-orange-400'}`} />
                    <p className="text-lg font-bold">{profile?.vStatus || 'Pending'}</p>
                  </div>
                </div>
              </div>
              
            </div>
          </section>
        </div>

      </div>
    </Layout>
  );
}
