import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  ShieldCheck, ShieldAlert, Search, 
  Filter, CheckCircle2, XCircle, Clock 
} from 'lucide-react';

export default function VerifyClient() {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { id: 1, name: "Maya Sharma", status: "Verified", date: "Mar 10, 2026", method: "Aadhar/ID" },
    { id: 2, name: "Rahul Verma", status: "Pending", date: "Mar 21, 2026", method: "Video KYC" },
    { id: 3, name: "Aditi Rao", status: "Verified", date: "Feb 15, 2026", method: "Aadhar/ID" },
    { id: 4, name: "Suresh Gupta", status: "Rejected", date: "Mar 18, 2026", method: "PAN Card" },
  ];

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Verify Client</h1>
          <p className="text-slate-500 text-sm">Authenticity checks and KYC management for legal safety.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Export Logs
          </button>
          <button className="bg-[#1a2b4b] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
            <ShieldCheck size={18} /> New Verification
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Verified" count="1,284" icon={<CheckCircle2 className="text-green-500" />} />
        <StatCard label="Pending Review" count="12" icon={<Clock className="text-amber-500" />} />
        <StatCard label="Flagged/Rejected" count="3" icon={<ShieldAlert className="text-red-500" />} />
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by client name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg bg-white">
            <Filter size={16} /> Filters
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Verification Method</th>
              <th className="px-6 py-4">Date Checked</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">{client.name}</td>
                <td className="px-6 py-4 text-slate-500">{client.method}</td>
                <td className="px-6 py-4 text-slate-500">{client.date}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-bold hover:underline text-xs">View Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function StatCard({ label, count, icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-slate-800">{count}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Verified: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}