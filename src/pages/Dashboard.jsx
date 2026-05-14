import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UpcomingAppointments from '../components/UpcomingAppointments';
import { Bell, ChevronDown, Clock, LogOut, CheckCircle, Loader2, UploadCloud } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // --- Profile & Appointments Queries ---
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

  const { data: upcomingAppointments, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const token = localStorage.getItem('advocateToken');
      const res = await axios.get('http://localhost:5005/api/advocate/appointments/upcoming', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('advocateToken');
    localStorage.removeItem('advocateName');
    localStorage.removeItem('advocateId');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const isVerificationPending = profile?.vStatus?.toLowerCase() === 'pending';

  // --- Verification Form State ---
  const [panData, setPanData] = useState({ number: '', file: null });
  const [aadharData, setAadharData] = useState({ number: '', file: null });
  const [enrollData, setEnrollData] = useState({ number: '', barId: '', file: null });
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Track upload status independently for UX: 'idle' | 'loading' | 'success' | 'error'
  const [statuses, setStatuses] = useState({
    pan: 'idle',
    aadhar: 'idle',
    enrollment: 'idle',
    photo: 'idle',
    video: 'idle'
  });

  // --- Generic Submission Handler ---
  const handleVerificationUpload = async (type, e) => {
    e.preventDefault();
    setStatuses(prev => ({ ...prev, [type]: 'loading' }));

    const token = localStorage.getItem('advocateToken');
    const formData = new FormData();
    const baseUrl = 'http://localhost:5006/api/advocate/verify';

    try {
      if (type === 'pan') {
        if (!panData.file) throw new Error("PAN Image is required");
        formData.append('panImage', panData.file);
        if (panData.number) formData.append('panNumber', panData.number);
      }
      else if (type === 'aadhar') {
        if (!aadharData.file) throw new Error("Aadhar Image is required");
        formData.append('aadharImage', aadharData.file);
        if (aadharData.number) formData.append('aadharNumber', aadharData.number);
      }
      else if (type === 'enrollment') {
        if (!enrollData.file) throw new Error("Enrollment Certificate is required");
        if (!enrollData.number && !enrollData.barId) throw new Error("Provide Enrollment No. or Bar ID");
        formData.append('enrollmentCertificate', enrollData.file);
        if (enrollData.number) formData.append('enrollmentNumber', enrollData.number);
        if (enrollData.barId) formData.append('barId', enrollData.barId);
      }
      else if (type === 'photo') {
        if (!photoFile) throw new Error("Photo is required");
        formData.append('photo', photoFile);
      }
      else if (type === 'video') {
        if (!videoFile) throw new Error("Video is required");
        formData.append('video', videoFile);
      }

      await axios.patch(`${baseUrl}/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setStatuses(prev => ({ ...prev, [type]: 'success' }));
    } catch (err) {
      alert(err.message || err.response?.data?.message || `Failed to upload ${type}`);
      setStatuses(prev => ({ ...prev, [type]: 'error' }));
    }
  };

  return (
    <>
      {/* 
        VERIFICATION MODAL
        Expands into a scrollable overlay to handle the 5 upload forms.
      */}
      {isVerificationPending && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-slate-50 rounded-3xl w-full max-w-3xl max-h-full flex flex-col shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="bg-white p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-4 text-left w-full">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={24} className="text-orange-500 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Verification Pending</h2>
                  <p className="text-slate-500 text-sm">Please upload your documents to activate your profile.</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="shrink-0 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">

              {/* 1. PAN Upload */}
              <form onSubmit={(e) => handleVerificationUpload('pan', e)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <UploadCloud size={18} className="text-blue-500" /> 1. PAN Card
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text" placeholder="PAN Number (Optional)"
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPanData({ ...panData, number: e.target.value })}
                  />
                  <input
                    type="file" accept="image/*" required
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600"
                    onChange={(e) => setPanData({ ...panData, file: e.target.files[0] })}
                  />
                </div>
                <SubmitButton status={statuses.pan} label="Upload PAN" />
              </form>

              {/* 2. Aadhar Upload */}
              <form onSubmit={(e) => handleVerificationUpload('aadhar', e)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <UploadCloud size={18} className="text-blue-500" /> 2. Aadhar Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text" placeholder="12-digit Number (Optional)"
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setAadharData({ ...aadharData, number: e.target.value })}
                  />
                  <input
                    type="file" accept="image/*" required
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600"
                    onChange={(e) => setAadharData({ ...aadharData, file: e.target.files[0] })}
                  />
                </div>
                <SubmitButton status={statuses.aadhar} label="Upload Aadhar" />
              </form>

              {/* 3. Enrollment / Bar ID Upload */}
              <form onSubmit={(e) => handleVerificationUpload('enrollment', e)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <UploadCloud size={18} className="text-blue-500" /> 3. Enrollment / Bar ID
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text" placeholder="Enrollment No (Required if no Bar ID)"
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEnrollData({ ...enrollData, number: e.target.value })}
                  />
                  <input
                    type="text" placeholder="Bar ID (Required if no Enroll No)"
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEnrollData({ ...enrollData, barId: e.target.value })}
                  />
                  <input
                    type="file" accept="image/*,.pdf" required
                    className="md:col-span-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600"
                    onChange={(e) => setEnrollData({ ...enrollData, file: e.target.files[0] })}
                  />
                </div>
                <SubmitButton status={statuses.enrollment} label="Upload Enrollment" />
              </form>

              {/* 4. Photo Upload */}
              <form onSubmit={(e) => handleVerificationUpload('photo', e)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <UploadCloud size={18} className="text-blue-500" /> 4. Professional Photo
                </h3>
                <div className="mb-4">
                  <input
                    type="file" accept="image/*" required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                  />
                </div>
                <SubmitButton status={statuses.photo} label="Upload Photo" />
              </form>

              {/* 5. Video Upload */}
              <form onSubmit={(e) => handleVerificationUpload('video', e)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <UploadCloud size={18} className="text-blue-500" /> 5. Verification Video
                </h3>
                <div className="mb-4">
                  <input
                    type="file" accept="video/*" required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                </div>
                <SubmitButton status={statuses.video} label="Upload Video" />
              </form>

            </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD CONTENT BELOW MODAL --- */}
      <Layout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 text-xs mt-1">
              {isProfileLoading ? 'Loading...' : `Welcome back, Adv. ${profile?.name?.split(' ')[0] || 'Advocate'}`}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors">
              {upcomingAppointments && upcomingAppointments.length > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
              )}
              <Bell size={22} className="text-slate-400" />
            </div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <img
                src={profile?.profileImage || "https://i.imgur.com/8Km9tLL.png"}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {profile?.name || 'Loading...'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 pb-10">
          <div className="col-span-12">
            <UpcomingAppointments
              appointments={upcomingAppointments}
              isLoading={isAppointmentsLoading}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

// Small helper component to keep the buttons clean and handle loading/success states visually
function SubmitButton({ status, label }) {
  if (status === 'success') {
    return (
      <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-green-50 text-green-600 flex items-center justify-center gap-2">
        <CheckCircle size={18} /> Uploaded Successfully
      </button>
    );
  }
  return (
    <button
      disabled={status === 'loading'}
      type="submit"
      className="w-full bg-[#1a2b4b] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#25395f] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
    >
      {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : label}
    </button>
  );
}