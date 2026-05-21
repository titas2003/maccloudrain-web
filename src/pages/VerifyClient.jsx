import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusModal from '../components/StatusModal';
import {
  ShieldCheck, ShieldAlert, ShieldX, Search, CheckCircle2,
  XCircle, Clock, X, Download, Bell, Eye, Phone, Mail,
  User, FileText, Video, ChevronDown
} from 'lucide-react';

const API = 'http://localhost:5006/api/advocate';
const getToken = () => localStorage.getItem('advocateToken');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });
const jsonHeaders = () => ({ ...authHeaders(), 'Content-Type': 'application/json' });

const CLOSED = { isOpen: false, type: 'info', title: '', message: '' };
const mk = (type, title, message, onConfirm = null) => ({ isOpen: true, type, title, message, onConfirm });

const STATUS_STYLES = {
  Verified:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  icon: <CheckCircle2 size={12} /> },
  Pending:   { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  icon: <Clock size={12} /> },
  Rejected:  { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    icon: <XCircle size={12} /> },
};

export default function VerifyClient() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modal, setModal] = useState(CLOSED);
  const [drawer, setDrawer] = useState(null); // selected client for drawer
  const [notifyMsg, setNotifyMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClients = async (q = '', s = 'All') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (s !== 'All') params.set('status', s);
      const res = await fetch(`${API}/clients?${params}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
        setStats(data.stats);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchClients(e.target.value, filterStatus);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    fetchClients(search, status);
  };

  // ---- Verify / Reject ----
  const doVerify = (client, vStatus) => {
    const label = vStatus === 'Verified' ? 'Verify' : 'Reject';
    setModal(mk(
      vStatus === 'Verified' ? 'confirm' : 'confirm-reject',
      `${label} ${client.name}?`,
      `This will update their KYC status to "${vStatus}" and send them an email notification.`,
      async () => {
        setActionLoading(true);
        setModal(mk('loading', 'Processing', 'Updating status and sending email...'));
        try {
          const res = await fetch(`${API}/clients/${client._id}/verify`, {
            method: 'PATCH',
            headers: jsonHeaders(),
            body: JSON.stringify({ vStatus })
          });
          const data = await res.json();
          if (data.success) {
            setClients(prev => prev.map(c =>
              c._id === client._id ? { ...c, vStatus } : c
            ));
            if (drawer?._id === client._id) setDrawer(d => ({ ...d, vStatus }));
            await fetchClients(search, filterStatus);
            setModal(mk('success', 'Done!', `${client.name} has been ${vStatus.toLowerCase()} and notified.`));
          } else {
            setModal(mk('error', 'Failed', data.message));
          }
        } catch {
          setModal(mk('error', 'Error', 'Something went wrong. Please try again.'));
        }
        setActionLoading(false);
      }
    ));
  };

  // ---- Per-doc Verify ----
  const doDocVerify = async (docKey, status) => {
    if (!drawer) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/clients/${drawer._id}/verify-doc`, {
        method: 'PATCH',
        headers: jsonHeaders(),
        body: JSON.stringify({ doc: docKey, status })
      });
      const data = await res.json();
      if (data.success) {
        // Update drawer and table row in place
        setDrawer(d => ({
          ...d,
          docVerification: data.data.docVerification,
          vStatus: data.data.vStatus
        }));
        setClients(prev => prev.map(c =>
          c._id === drawer._id
            ? { ...c, docVerification: data.data.docVerification, vStatus: data.data.vStatus }
            : c
        ));
        // Refresh stats silently
        fetchClients(search, filterStatus);
      } else {
        setModal(mk('error', 'Failed', data.message));
      }
    } catch {
      setModal(mk('error', 'Error', 'Failed to update document status.'));
    }
    setActionLoading(false);
  };
  const doNotify = async (client) => {
    if (!notifyMsg.trim()) {
      return setModal(mk('error', 'Required', 'Please enter a message for the client.'));
    }
    setActionLoading(true);
    setModal(mk('loading', 'Sending', 'Sending notification email to client...'));
    try {
      const res = await fetch(`${API}/clients/${client._id}/notify`, {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ message: notifyMsg })
      });
      const data = await res.json();
      if (data.success) {
        setNotifyMsg('');
        setModal(mk('success', 'Sent!', `Notification email sent to ${client.name} at ${client.email}.`));
      } else {
        setModal(mk('error', 'Failed', data.message));
      }
    } catch {
      setModal(mk('error', 'Error', 'Failed to send notification.'));
    }
    setActionLoading(false);
  };

  return (
    <Layout>
      <StatusModal
        isOpen={modal.isOpen} type={modal.type}
        title={modal.title} message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={() => setModal(CLOSED)}
      />

      {/* Drawer overlay */}
      {drawer && (
        <ClientDrawer
          client={drawer}
          notifyMsg={notifyMsg}
          setNotifyMsg={setNotifyMsg}
          onClose={() => { setDrawer(null); setNotifyMsg(''); }}
          onVerify={(v) => doVerify(drawer, v)}
          onDocVerify={doDocVerify}
          onNotify={() => doNotify(drawer)}
          actionLoading={actionLoading}
        />
      )}

      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Verify Clients</h1>
          <p className="text-slate-500 text-sm mt-1">KYC review and identity management for your appointment clients.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Clients" count={stats.total} icon={<User className="text-blue-500" size={20} />} color="bg-blue-50" active={filterStatus === 'All'} onClick={() => handleFilter('All')} />
        <StatCard label="Verified" count={stats.verified} icon={<ShieldCheck className="text-green-500" size={20} />} color="bg-green-50" active={filterStatus === 'Verified'} onClick={() => handleFilter('Verified')} />
        <StatCard label="Pending Review" count={stats.pending} icon={<Clock className="text-amber-500" size={20} />} color="bg-amber-50" active={filterStatus === 'Pending'} onClick={() => handleFilter('Pending')} />
        <StatCard label="Rejected" count={stats.rejected} icon={<ShieldX className="text-red-500" size={20} />} color="bg-red-50" active={filterStatus === 'Rejected'} onClick={() => handleFilter('Rejected')} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or client ID..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Verified', 'Pending', 'Rejected'].map(s => (
              <button
                key={s}
                onClick={() => handleFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterStatus === s ? 'bg-[#1a2b4b] text-white border-[#1a2b4b]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="py-20 text-center">
            <ShieldAlert size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No clients found{search ? ` for "${search}"` : ''}.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4">KYC Status</th>
                <th className="px-6 py-4">Appointments</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {clients.map(client => (
                <tr key={client._id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Client */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {client.photo
                        ? <img src={client.photo} alt={client.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" onError={e => { e.target.style.display='none'; }} />
                        : <div className="w-8 h-8 rounded-full bg-[#1a2b4b] flex items-center justify-center text-white text-xs font-black">{client.name?.[0]}</div>
                      }
                      <div>
                        <p className="font-bold text-slate-700">{client.name}</p>
                        <p className="text-[10px] text-slate-400">{client.clientId}</p>
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-xs">{client.email}</p>
                    <p className="text-slate-400 text-xs">{client.phone}</p>
                  </td>
                  {/* Docs summary */}
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      <DocPill label="Aadhar" present={!!client.verificationDocs?.aadharImage} />
                      <DocPill label="PAN" present={!!client.verificationDocs?.panImage} />
                      <DocPill label="Video" present={!!client.verificationDocs?.videoUrl} />
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={client.vStatus} />
                  </td>
                  {/* Appt count */}
                  <td className="px-6 py-4">
                    <span className="text-slate-600 font-semibold">{client.appointmentCount}</span>
                    <span className="text-slate-400 text-xs ml-1">appts</span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDrawer(client)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                      >
                        <Eye size={13} /> View
                      </button>
                      {client.vStatus !== 'Verified' && (
                        <button
                          onClick={() => doVerify(client, 'Verified')}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                        >
                          <ShieldCheck size={13} /> Verify
                        </button>
                      )}
                      {client.vStatus !== 'Rejected' && (
                        <button
                          onClick={() => doVerify(client, 'Rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
                        >
                          <ShieldX size={13} /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

// ---- Slide-in Drawer ----
function ClientDrawer({ client, notifyMsg, setNotifyMsg, onClose, onVerify, onNotify, onDocVerify, actionLoading }) {
  const docs = client.verificationDocs || {};
  const docVer = client.docVerification || {};
  const [activeTab, setActiveTab] = useState('docs');

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a2b4b] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {client.photo
              ? <img src={client.photo} alt={client.name} className="w-11 h-11 rounded-full object-cover border-2 border-white/20" />
              : <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-lg">{client.name?.[0]}</div>
            }
            <div>
              <p className="text-white font-bold text-base">{client.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-blue-300 text-xs">{client.clientId}</p>
                <StatusBadge status={client.vStatus} small />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {['docs', 'notify'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3 text-sm font-bold capitalize transition-all ${activeTab === t ? 'text-[#1a2b4b] border-b-2 border-[#1a2b4b]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t === 'docs' ? '📋 KYC Documents' : '⚠️ Notify Client'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'docs' ? (
            <>
              {/* Basic info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
                <InfoRow icon={<Mail size={14} />} label="Email" value={client.email} />
                <InfoRow icon={<Phone size={14} />} label="Phone" value={client.phone} />
              </div>

              {/* Per-doc sections */}
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Submitted Documents</h3>
              <div className="space-y-5 mb-6">
                <DocVerifyBlock
                  label="Aadhar Card"
                  url={docs.aadharImage}
                  type="image"
                  docKey="aadhar"
                  status={docVer.aadhar || 'pending'}
                  onMark={(s) => onDocVerify('aadhar', s)}
                  disabled={actionLoading}
                />
                <DocVerifyBlock
                  label="PAN Card"
                  url={docs.panImage}
                  type="image"
                  docKey="pan"
                  status={docVer.pan || 'pending'}
                  onMark={(s) => onDocVerify('pan', s)}
                  disabled={actionLoading}
                />
                <DocVerifyBlock
                  label="Video KYC"
                  url={docs.videoUrl}
                  type="video"
                  docKey="video"
                  status={docVer.video || 'pending'}
                  onMark={(s) => onDocVerify('video', s)}
                  disabled={actionLoading}
                />
              </div>

              {/* Overall action */}
              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-400 mb-3 text-center">Overall KYC is auto-calculated from doc statuses above. You can also force override:</p>
                <div className="flex gap-3">
                  {client.vStatus !== 'Verified' && (
                    <button
                      onClick={() => onVerify('Verified')}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                      <ShieldCheck size={14} /> Force Verify All
                    </button>
                  )}
                  {client.vStatus !== 'Rejected' && (
                    <button
                      onClick={() => onVerify('Rejected')}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-all"
                    >
                      <ShieldX size={14} /> Force Reject All
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <p className="text-amber-800 text-sm font-semibold mb-1">⚠️ Suspicious Document Alert</p>
                <p className="text-amber-700 text-xs leading-relaxed">Use this to send a custom notification asking the client to re-submit their documents. This will not change their KYC status.</p>
              </div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Message to Client</label>
              <textarea
                rows={6}
                value={notifyMsg}
                onChange={e => setNotifyMsg(e.target.value)}
                placeholder="e.g. We noticed a discrepancy in your Aadhar card submission. Please re-upload a clearer copy..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/30 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1 mb-5">This message will be included in the email sent to {client.email}</p>
              <button
                onClick={onNotify}
                disabled={actionLoading || !notifyMsg.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 transition-all"
              >
                <Bell size={16} /> Send Review Request
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ---- Per-doc verify block ----
function DocVerifyBlock({ label, url, type, docKey, status, onMark, disabled }) {
  const [lightbox, setLightbox] = useState(false);

  const statusStyle = {
    verified: { bar: 'bg-green-500', text: 'text-green-700', badge: 'bg-green-100 text-green-700 border-green-200', label: '✅ Verified' },
    rejected:  { bar: 'bg-red-500',   text: 'text-red-700',   badge: 'bg-red-100 text-red-700 border-red-200',     label: '❌ Rejected' },
    pending:   { bar: 'bg-amber-400', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200', label: '🕐 Pending' },
  }[status] || {};

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all ${status === 'verified' ? 'border-green-200' : status === 'rejected' ? 'border-red-200' : 'border-slate-200'}`}>
      {/* Doc header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
        <div className="flex items-center gap-2">
          {type === 'video' ? <Video size={14} className="text-slate-500" /> : <FileText size={14} className="text-slate-500" />}
          <span className="text-xs font-bold text-slate-700">{label}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.badge}`}>
          {statusStyle.label}
        </span>
      </div>

      {/* Doc preview */}
      {!url ? (
        <div className="px-4 py-6 text-center bg-slate-50/50">
          <FileText size={28} className="text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Document not uploaded yet</p>
        </div>
      ) : type === 'image' ? (
        <div className="relative group cursor-zoom-in" onClick={() => setLightbox(true)}>
          <img
            src={url}
            alt={label}
            className="w-full max-h-52 object-contain bg-slate-100 hover:opacity-90 transition-opacity"
            onError={e => { e.target.parentElement.innerHTML = '<p class="text-center text-xs text-slate-400 py-6">Unable to load image — check server path</p>'; }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"><Eye size={12} /> Click to enlarge</span>
          </div>
        </div>
      ) : (
        <video src={url} controls className="w-full max-h-52 bg-black" />
      )}

      {/* Action row */}
      {url && (
        <div className="flex gap-2 p-3 bg-white border-t border-slate-100">
          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            <Download size={12} /> Open
          </a>
          <button
            onClick={() => onMark('verified')}
            disabled={disabled || status === 'verified'}
            className="flex-1 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-40 transition-all"
          >
            ✅ Mark Verified
          </button>
          <button
            onClick={() => onMark('rejected')}
            disabled={disabled || status === 'rejected'}
            className="flex-1 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-40 transition-all"
          >
            ❌ Reject Doc
          </button>
          {status !== 'pending' && (
            <button
              onClick={() => onMark('pending')}
              disabled={disabled}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
              title="Reset to pending"
            >
              ↩
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && url && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={28} /></button>
          <img src={url} alt={label} className="max-w-full max-h-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function DocPill({ label, present }) {
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${present ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${s.bg} ${s.text} ${s.border}`}>
      {s.icon} {status}
    </span>
  );
}

function StatCard({ label, count, icon, color, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all shadow-sm flex items-center gap-3 ${active ? 'border-[#1a2b4b] bg-[#1a2b4b]/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
    >
      <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-slate-800">{count}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-500 text-xs">{icon} {label}</div>
      <span className="text-xs font-semibold text-slate-700">{value || '—'}</span>
    </div>
  );
}