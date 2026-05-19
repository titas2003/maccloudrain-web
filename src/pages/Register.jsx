import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Loader2, Landmark, Briefcase } from 'lucide-react';
import StatusModal from '../components/StatusModal';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [statusModal, setStatusModal] = useState({ isOpen: false, type: '', title: '', message: '' });

  // Updated state to match the exact signup API payload
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    password: '',
    courtDivision: '',
    specialization: '',
    yearsOfExperience: ''
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5006/api/common/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure yearsOfExperience is a number
    const payload = {
      ...formData,
      yearsOfExperience: Number(formData.yearsOfExperience)
    };

    try {
      const res = await axios.post('http://localhost:5006/api/advocate/signup', payload);

      if (res.data.success) {
        // Store the JWT token for authentication
        localStorage.setItem('authToken', res.data.token);

        // Show success message with the newly generated Advocate ID
        setStatusModal({
          isOpen: true,
          type: 'success',
          title: 'Registration Successful!',
          message: `Welcome, your Advocate ID is ${res.data.data.advId}`
        });
      }
    } catch (err) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Registration Failed',
        message: err.response?.data?.message || "Something went wrong."
      });
    } finally {
      setLoading(false);
    }
  };

  // Separate parent courts from child specializations
  const parentCategories = categories.filter(cat => cat.parent === null);

  // Dynamically filter specializations based on the selected Court Division
  const availableSpecializations = categories.filter(
    cat => cat.parent === formData.courtDivision
  );

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
          <p className="text-slate-500 text-sm mb-8">Please fill in your details to register.</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input
                  type="text" placeholder="e.g. John Doe" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <input
                  type="email" placeholder="john@example.com" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Row 2: Contact & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <input
                  type="tel" placeholder="e.g. 987456xxxx" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">State</label>
                <input
                  type="text" placeholder="e.g. Karnataka" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            {/* Row 3: Password & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                <input
                  type="password" placeholder="••••••••" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Exp. (Years)</label>
                <input
                  type="number" min="0" placeholder="e.g. 3" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                />
              </div>
            </div>

            {/* Row 4: Professional Legal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                  <Landmark size={12} /> Court Division
                </label>
                <select
                  required
                  disabled={fetchingCategories}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none appearance-none disabled:opacity-50"
                  value={formData.courtDivision}
                  onChange={(e) => {
                    // When court division changes, reset the specialization
                    setFormData({
                      ...formData,
                      courtDivision: e.target.value,
                      specialization: ''
                    });
                  }}
                >
                  <option value="">{fetchingCategories ? "Loading..." : "Select Court"}</option>
                  {parentCategories.map(parent => (
                    <option key={parent._id} value={parent._id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                  <Briefcase size={12} /> Specialization
                </label>
                <select
                  required
                  disabled={fetchingCategories || !formData.courtDivision}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a2b4b] outline-none appearance-none disabled:opacity-50"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option value="">
                    {!formData.courtDivision ? "Select Court First" : "Select Field"}
                  </option>
                  {availableSpecializations.map(child => (
                    <option key={child._id} value={child._id}>
                      {child.name}
                    </option>
                  ))}
                </select>
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
      
      <StatusModal 
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => {
          setStatusModal({ ...statusModal, isOpen: false });
          if (statusModal.type === 'success') {
            navigate('/');
          }
        }}
      />
    </div>
  );
}