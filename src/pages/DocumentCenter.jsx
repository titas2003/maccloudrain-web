import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import StatusModal from '../components/StatusModal';
import {
  Folder, FileText, FilePlus, Search, Plus, Trash2, Download,
  ChevronRight, ArrowLeft, Upload, Save, File, X
} from 'lucide-react';

const API = 'http://localhost:5006/api/advocate';
const getToken = () => localStorage.getItem('advocateToken');
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const CATEGORY_MAP = {
  'My Docs': 'my_docs',
  'Client Docs': 'client_docs',
  'Generic Docs': 'generic',
  'My Notes': 'note'
};

const FILE_ICON_MAP = {
  'application/pdf': '📄',
  'text/plain': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📃',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'image/png': '🖼️',
  'image/jpg': '🖼️',
  'image/jpeg': '🖼️'
};

// Modal shape helpers matching StatusModal's props interface
const mkModal = (type, title, message, onConfirm = null) => ({ isOpen: true, type, title, message, onConfirm });
const CLOSED_MODAL = { isOpen: false, type: 'info', title: '', message: '' };

export default function DocumentCenter() {
  const [activeTab, setActiveTab] = useState('My Docs');
  const [docs, setDocs] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(CLOSED_MODAL);

  // Upload form state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadAppointmentId, setUploadAppointmentId] = useState('general');
  const fileInputRef = useRef();

  // Note form state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteClientId, setNoteClientId] = useState('');
  const [noteAppointmentId, setNoteAppointmentId] = useState('general');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const category = CATEGORY_MAP[activeTab];

  // Fetch clients & appointments once on mount
  useEffect(() => {
    fetch(`${API}/documents/clients`, { headers: headers() })
      .then(r => r.json())
      .then(d => { if (d.success) setClients(d.data); })
      .catch(() => {});

    fetch(`${API}/documents/appointments`, { headers: headers() })
      .then(r => r.json())
      .then(d => { if (d.success) setAppointments(d.data); })
      .catch(() => {});
  }, []);

  // Fetch docs whenever tab or selected client changes
  useEffect(() => {
    setDocs([]);
    setSearch('');
    if (activeTab === 'Client Docs' && !selectedClient) return;

    setLoading(true);
    let url = `${API}/documents?category=${category}`;
    if (selectedClient) url += `&clientId=${selectedClient._id}`;

    fetch(url, { headers: headers() })
      .then(r => r.json())
      .then(d => { if (d.success) setDocs(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab, selectedClient, category]);

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.originalName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async () => {
    if (!uploadTitle.trim() || !uploadFile) {
      return setModal(mkModal('error', 'Missing Fields', 'Please provide a title and select a file.'));
    }
    const resolvedApptId = uploadAppointmentId !== 'general' ? uploadAppointmentId : null;

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);
    formData.append('category', category);
    if (selectedClient?._id) formData.append('clientId', selectedClient._id);
    if (resolvedApptId) formData.append('appointmentId', resolvedApptId);

    setModal(mkModal('loading', 'Uploading', 'Uploading document...'));
    try {
      const res = await fetch(`${API}/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setDocs(prev => [data.data, ...prev]);
        setShowUpload(false);
        setUploadTitle(''); setUploadFile(null); setUploadAppointmentId('general');
        setModal(mkModal('success', 'Done!', 'Document uploaded successfully!'));
      } else {
        setModal(mkModal('error', 'Upload Failed', data.message));
      }
    } catch {
      setModal(mkModal('error', 'Upload Failed', 'Upload failed. Please try again.'));
    }
  };

  // ---- Save note handler ----
  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      return setModal(mkModal('error', 'Missing Fields', 'Title and content are required.'));
    }
    setModal(mkModal('loading', 'Saving', 'Saving note...'));
    try {
      const resolvedApptId = noteAppointmentId !== 'general' ? noteAppointmentId : null;
      const body = { title: noteTitle, content: noteContent };
      if (noteClientId) body.clientId = noteClientId;
      if (resolvedApptId) body.appointmentId = resolvedApptId;
      if (editingNoteId) body.noteId = editingNoteId;

      const res = await fetch(`${API}/documents/note`, {
        method: 'POST',
        headers: { ...headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        if (editingNoteId) {
          setDocs(prev => prev.map(d => d._id === editingNoteId ? data.data : d));
        } else {
          setDocs(prev => [data.data, ...prev]);
        }
        setShowNoteForm(false);
        resetNoteForm();
        setModal(mkModal('success', 'Saved!', 'Note saved!'));
      } else {
        setModal(mkModal('error', 'Save Failed', data.message));
      }
    } catch {
      setModal(mkModal('error', 'Error', 'Failed to save note.'));
    }
  };

  const resetNoteForm = () => {
    setNoteTitle(''); setNoteContent(''); setNoteClientId('');
    setNoteAppointmentId('general'); setEditingNoteId(null);
  };

  const openEditNote = (doc) => {
    setNoteTitle(doc.title);
    setNoteContent(doc.content || '');
    setNoteClientId(doc.clientId?._id || '');
    setNoteAppointmentId(doc.appointmentId?._id || 'general');
    setEditingNoteId(doc._id);
    setShowNoteForm(true);
  };

  // ---- Delete handler ----
  const handleDelete = (docId) => {
    setModal(mkModal(
      'confirm',
      'Delete Document',
      'Are you sure you want to delete this? This cannot be undone.',
      async () => {
        setModal(mkModal('loading', 'Deleting', 'Removing document...'));
        try {
          const res = await fetch(`${API}/documents/${docId}`, {
            method: 'DELETE', headers: headers()
          });
          const data = await res.json();
          if (data.success) {
            setDocs(prev => prev.filter(d => d._id !== docId));
            setModal(mkModal('success', 'Deleted', 'Document deleted successfully.'));
          } else {
            setModal(mkModal('error', 'Error', data.message));
          }
        } catch {
          setModal(mkModal('error', 'Error', 'Delete failed. Please try again.'));
        }
      }
    ));
  };

  const handleDownload = async (doc) => {
    try {
      const res = await fetch(`${API}/documents/${doc._id}/download`, { headers: headers() });
      if (!res.ok) return setModal(mkModal('error', 'Error', 'Download failed.'));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalName || doc.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setModal(mkModal('error', 'Error', 'Download failed.'));
    }
  };

  const tabs = [
    { name: 'My Docs', icon: <FileText size={16} /> },
    { name: 'Client Docs', icon: <Folder size={16} /> },
    { name: 'Generic Docs', icon: <File size={16} /> },
    { name: 'My Notes', icon: <FilePlus size={16} /> },
  ];

  return (
    <Layout>
      <StatusModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a2b4b', margin: 0 }}>Document Center</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Manage, organize and upload legal documentation.</p>
        </div>
        {activeTab !== 'My Notes' && (
          <button
            onClick={() => { setShowUpload(true); setShowNoteForm(false); }}
            style={btnPrimary}
          >
            <Upload size={16} /> Upload Document
          </button>
        )}
        {activeTab === 'My Notes' && (
          <button onClick={() => { setShowNoteForm(true); setShowUpload(false); resetNoteForm(); }} style={btnPrimary}>
            <Plus size={16} /> New Note
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Left nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(tab.name); setSelectedClient(null); setShowUpload(false); setShowNoteForm(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10, border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left',
                background: activeTab === tab.name ? '#1a2b4b' : 'transparent',
                color: activeTab === tab.name ? '#fff' : '#64748b',
                transition: 'all 0.15s'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', minHeight: 500, overflow: 'hidden' }}>
          {/* Search bar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: '#94a3b8' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search in ${activeTab}...`}
                style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ padding: 20 }}>
            {/* Upload form */}
            {showUpload && activeTab !== 'My Notes' && (
              <UploadForm
                uploadTitle={uploadTitle} setUploadTitle={setUploadTitle}
                uploadFile={uploadFile} setUploadFile={setUploadFile}
                uploadAppointmentId={uploadAppointmentId} setUploadAppointmentId={setUploadAppointmentId}
                appointments={appointments}
                fileInputRef={fileInputRef}
                onUpload={handleUpload}
                onCancel={() => { setShowUpload(false); setUploadTitle(''); setUploadFile(null); }}
              />
            )}

            {/* Client folder grid */}
            {activeTab === 'Client Docs' && !selectedClient && (
              <ClientFolderGrid
                clients={clients}
                onSelect={setSelectedClient}
              />
            )}

            {/* Client docs sub-view */}
            {activeTab === 'Client Docs' && selectedClient && (
              <>
                <button onClick={() => setSelectedClient(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1a2b4b', fontWeight: 600, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>
                  <ArrowLeft size={16} /> Back to Clients
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0369a1', fontSize: 15 }}>
                    {selectedClient.name?.[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{selectedClient.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{selectedClient.email}</p>
                  </div>
                  <button onClick={() => setShowUpload(true)} style={{ ...btnPrimary, marginLeft: 'auto', fontSize: 12, padding: '7px 14px' }}>
                    <Upload size={14} /> Upload for this client
                  </button>
                </div>
                {showUpload && (
                  <UploadForm
                    category="client_docs"
                    clients={clients}
                    selectedClient={selectedClient}
                    uploadTitle={uploadTitle} setUploadTitle={setUploadTitle}
                    uploadFile={uploadFile} setUploadFile={setUploadFile}
                    uploadAppointmentId={uploadAppointmentId} setUploadAppointmentId={setUploadAppointmentId}
                    appointments={appointments}
                    fileInputRef={fileInputRef}
                    onUpload={handleUpload}
                    onCancel={() => { setShowUpload(false); setUploadTitle(''); setUploadFile(null); }}
                  />
                )}
                <DocList docs={filteredDocs} loading={loading} onDelete={handleDelete} onDownload={handleDownload} onEditNote={openEditNote} activeTab={activeTab} />
              </>
            )}

            {/* Regular doc list — always shown for non-client tabs */}
            {activeTab !== 'Client Docs' && (
              <>
                {/* Notes: show form above list so user can see existing notes */}
                {showNoteForm && activeTab === 'My Notes' && (
                  <NoteForm
                    clients={clients}
                    appointments={appointments}
                    noteTitle={noteTitle} setNoteTitle={setNoteTitle}
                    noteContent={noteContent} setNoteContent={setNoteContent}
                    noteClientId={noteClientId} setNoteClientId={setNoteClientId}
                    noteAppointmentId={noteAppointmentId} setNoteAppointmentId={setNoteAppointmentId}
                    editingNoteId={editingNoteId}
                    onSave={handleSaveNote}
                    onCancel={() => { setShowNoteForm(false); resetNoteForm(); }}
                  />
                )}
                <DocList
                  docs={filteredDocs}
                  loading={loading}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onEditNote={(doc) => { openEditNote(doc); window.scrollTo(0, 0); }}
                  activeTab={activeTab}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ---- Sub-components ----

function ClientFolderGrid({ clients, onSelect }) {
  if (!clients.length) return <EmptyState icon={<Folder size={40} />} text="No clients with appointments yet." />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
      {clients.map(c => (
        <button key={c._id} onClick={() => onSelect(c)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1d4ed8', fontSize: 15 }}>{c.name?.[0]}</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{c.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Tap to open</p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
        </button>
      ))}
    </div>
  );
}

function DocList({ docs, loading, onDelete, onDownload, onEditNote, activeTab }) {
  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading...</div>;
  if (!docs.length) return <EmptyState icon={activeTab === 'My Notes' ? <FilePlus size={40} /> : <FileText size={40} />} text={`No ${activeTab.toLowerCase()} yet. Use the button above to ${activeTab === 'My Notes' ? 'create a note' : 'upload a file'}.`} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {docs.map(doc => (
        <div key={doc._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: '1px solid #f1f5f9', background: '#fafafa', transition: 'all 0.15s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {doc.category === 'note' ? '📝' : (FILE_ICON_MAP[doc.mimeType] || '📄')}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{doc.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                {doc.category === 'note'
                  ? `Note • ${new Date(doc.updatedAt).toLocaleDateString()}`
                  : `${doc.originalName} • ${formatSize(doc.fileSize)} • ${new Date(doc.createdAt).toLocaleDateString()}`
                }
                {doc.clientId && <span style={{ marginLeft: 8, background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>{doc.clientId.name}</span>}
                {doc.appointmentId && <span style={{ marginLeft: 6, background: '#f0fdf4', color: '#15803d', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>Appt linked</span>}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {doc.category === 'note' && (
              <button onClick={() => onEditNote(doc)} style={iconBtn} title="Edit note">✏️</button>
            )}
            {doc.category !== 'note' && (
              <button onClick={() => onDownload(doc)} style={iconBtn} title="Download"><Download size={15} /></button>
            )}
            <button onClick={() => onDelete(doc._id)} style={{ ...iconBtn, color: '#ef4444' }} title="Delete"><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UploadForm({ uploadTitle, setUploadTitle, uploadFile, setUploadFile, uploadAppointmentId, setUploadAppointmentId, appointments, fileInputRef, onUpload, onCancel }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1a2b4b' }}>Upload Document</p>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
      </div>
      <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Document title *" style={inputStyle} />
      <input ref={fileInputRef} type="file" accept=".pdf,.txt,.docx,.xlsx,.png,.jpg,.jpeg" onChange={e => setUploadFile(e.target.files[0])} style={{ display: 'none' }} />
      <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed #cbd5e1', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: 10, color: '#64748b', fontSize: 13 }}>
        {uploadFile ? <span style={{ color: '#1a2b4b', fontWeight: 600 }}>✅ {uploadFile.name}</span> : <><Upload size={20} style={{ marginBottom: 4 }} /><br />Click to select file (PDF, DOCX, XLSX, TXT, PNG, JPG)</>}
      </div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Link to Appointment *</label>
      <select value={uploadAppointmentId} onChange={e => setUploadAppointmentId(e.target.value)} style={inputStyle}>
        <option value="general">📁 General (not linked to any appointment)</option>
        {appointments.map(a => (
          <option key={a._id} value={a._id}>
            {a.clientId?.name || 'Client'} — {new Date(a.scheduledAt).toLocaleDateString()} {a.notes ? `(${a.notes.substring(0, 30)}...)` : ''}
          </option>
        ))}
      </select>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button onClick={onUpload} style={btnPrimary}><Upload size={15} /> Upload</button>
        <button onClick={onCancel} style={btnSecondary}>Cancel</button>
      </div>
    </div>
  );
}

function NoteForm({ clients, appointments, noteTitle, setNoteTitle, noteContent, setNoteContent, noteClientId, setNoteClientId, noteAppointmentId, setNoteAppointmentId, editingNoteId, onSave, onCancel }) {
  return (
    <div style={{ background: '#fffbeb', borderRadius: 12, border: '1px solid #fde68a', padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#92400e' }}>{editingNoteId ? 'Edit Note' : 'New Note'}</p>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
      </div>
      <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Note title *" style={inputStyle} />
      <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Write your case notes here..." rows={6} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} />
      <label style={{ fontSize: 12, fontWeight: 600, color: '#92400e', display: 'block', marginBottom: 4 }}>Link to Appointment *</label>
      <select value={noteAppointmentId} onChange={e => setNoteAppointmentId(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }}>
        <option value="general">📁 General (not linked to any appointment)</option>
        {appointments.map(a => (
          <option key={a._id} value={a._id}>
            {a.clientId?.name || 'Client'} — {new Date(a.scheduledAt).toLocaleDateString()} {a.notes ? `(${a.notes.substring(0, 30)}...)` : ''}
          </option>
        ))}
      </select>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#92400e', display: 'block', marginBottom: 4 }}>Link to Client (optional)</label>
      <select value={noteClientId} onChange={e => setNoteClientId(e.target.value)} style={inputStyle}>
        <option value="">— No client —</option>
        {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onSave} style={btnPrimary}><Save size={15} /> Save Note</button>
        <button onClick={onCancel} style={btnSecondary}>Cancel</button>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
      <div style={{ marginBottom: 14, opacity: 0.4 }}>{icon}</div>
      <p style={{ margin: 0, fontSize: 13 }}>{text}</p>
    </div>
  );
}

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

// Styles
const btnPrimary = { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#1a2b4b', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: 'pointer' };
const btnSecondary = { padding: '9px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff', marginBottom: 10, boxSizing: 'border-box' };
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: 6, color: '#64748b', display: 'flex', alignItems: 'center' };