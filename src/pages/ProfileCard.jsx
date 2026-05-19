import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  Mail, Phone, MapPin, 
  Download, Share2, Edit3, Loader2, CheckCircle, Camera
} from 'lucide-react';
import StatusModal from '../components/StatusModal';

export default function ProfileCard() {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    yearsOfExperience: 0,
    courtDivision: '',
    specialization: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: '', title: '', message: '' });

  // 1. Fetch Profile
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

  // 2. Fetch Categories
  const { data: categories, isLoading: isCatsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5006/api/common/categories');
      return res.data.data;
    }
  });

  // 3. Initialize Form Data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        yearsOfExperience: profile.yearsOfExperience || 0,
        courtDivision: profile.courtDivision?._id || '',
        specialization: profile.specialization?._id || ''
      });
    }
  }, [profile]);

  // 4. Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('advocateToken');
      return axios.patch('http://localhost:5006/api/advocate/profile', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advocateProfile']);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (err) => {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.message || 'Failed to update profile'
      });
    }
  });

  // 5. Upload Photo Mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file) => {
      const token = localStorage.getItem('advocateToken');
      const formData = new FormData();
      formData.append('photo', file);
      
      return axios.post('http://localhost:5006/api/advocate/profile/photo', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advocateProfile']);
    },
    onError: (err) => {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Upload Failed',
        message: err.response?.data?.message || 'Failed to upload photo'
      });
    }
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhotoMutation.mutate(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const courtDivisions = categories?.filter(c => !c.parent) || [];
  const specializations = categories?.filter(c => c.parent === formData.courtDivision) || [];

  const getDivisionName = () => {
    const div = courtDivisions.find(c => c._id === formData.courtDivision);
    return div ? div.name : 'Court Division';
  };

  const getSpecName = () => {
    const spec = specializations.find(c => c._id === formData.specialization);
    return spec ? spec.name : 'Specialization';
  };

  // QR Code Generation
  const profileUrl = profile?.advId ? `https://maccloudrain.com/advocate/${profile.advId}` : 'https://maccloudrain.com';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&margin=10`;

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${profile?.advId || 'Profile'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR code", error);
    }
  };

  if (isProfileLoading || isCatsLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
          <p className="text-sm font-semibold tracking-wide">Loading Profile...</p>
        </div>
      </Layout>
    );
  }

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
          <button onClick={handleDownloadQR} className="flex items-center gap-2 px-4 py-2 bg-[#1a2b4b] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#25395f] transition-all">
            <Download size={16} /> Download QR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Edit Profile Form */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Edit3 size={18} className="text-blue-600" /> Professional Details
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Advocate" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Court Division</label>
                <select name="courtDivision" value={formData.courtDivision} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400">
                  <option value="">Select Division</option>
                  {courtDivisions.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Specialization</label>
                <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" disabled={!formData.courtDivision}>
                  <option value="">Select Specialization</option>
                  {specializations.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Years of Experience</label>
                <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} min="0" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Address / Office Location</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Chamber No., Court Name, City" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            
            <button type="submit" disabled={updateMutation.isPending} className="mt-8 w-full bg-[#1a2b4b] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#25395f] hover:shadow-lg transition-all flex justify-center items-center gap-2">
              {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : showSuccess ? <><CheckCircle size={18} /> Saved Successfully</> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Live Card Preview</h3>
            
            <div className="bg-[#1a2b4b] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="relative w-20 h-20 bg-slate-300 rounded-2xl border-4 border-white/10 overflow-hidden group cursor-pointer">
                    <img src={profile?.photo ? `http://localhost:5006/${profile.photo}` : "https://i.imgur.com/8Km9tLL.png"} alt="Profile" className="w-full h-full object-cover transition-all group-hover:scale-105" />
                    
                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploadPhotoMutation.isPending ? (
                        <Loader2 size={18} className="text-white animate-spin" />
                      ) : (
                        <Camera size={18} className="text-white" />
                      )}
                    </div>
                    
                    {/* Hidden File Input */}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={uploadPhotoMutation.isPending}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center overflow-hidden">
                       <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-black tracking-tight break-words">{formData.name || 'Your Name'}</h2>
                  <p className="text-blue-300 font-bold text-sm uppercase tracking-widest mt-1">
                    {formData.title || 'Advocate'}
                  </p>
                  {(formData.courtDivision || formData.specialization) && (
                    <p className="text-xs text-slate-300 mt-2 font-medium opacity-80 uppercase tracking-wider">
                      {getDivisionName()} • {getSpecName()}
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-sm opacity-80 break-all">
                    <Mail size={16} className="shrink-0" /> {formData.email || 'Email'}
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-80">
                    <Phone size={16} className="shrink-0" /> {formData.phone || 'Phone'}
                  </div>
                  <div className="flex items-start gap-3 text-sm opacity-80">
                    <MapPin size={16} className="shrink-0 mt-0.5" /> 
                    <span className="leading-snug">{formData.address || 'Your Office Address'}</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                    {profile?.vStatus === 'Verified' ? 'Verified Advocate' : 'Verification Pending'}
                  </span>
                  <div className={`h-6 w-12 rounded-full flex items-center px-1 transition-colors ${profile?.vStatus === 'Verified' ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                    <div className={`h-4 w-4 rounded-full shadow-sm ${profile?.vStatus === 'Verified' ? 'bg-green-400 ml-auto' : 'bg-orange-400 mr-auto'}`} />
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
      
      <StatusModal 
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />
    </Layout>
  );
}