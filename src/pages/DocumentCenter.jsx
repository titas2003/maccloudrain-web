import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Folder, FileText, User, Search, 
  Plus, MoreVertical, FilePlus, ChevronRight 
} from 'lucide-react';

export default function DocumentCenter() {
  const [activeTab, setActiveTab] = useState('My Docs');

  const tabs = [
    { name: 'My Docs', icon: <FileText size={18} /> },
    { name: 'Client Docs', icon: <User size={18} /> },
    { name: 'Generic Docs', icon: <Folder size={18} /> },
    { name: 'My Notes', icon: <FilePlus size={18} /> },
  ];

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Document Center</h1>
          <p className="text-slate-500 text-sm">Manage, organize, and upload legal documentation.</p>
        </div>
        <button className="bg-[#1a2b4b] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-[#25395f] transition-all">
          <Plus size={18} /> Upload New
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar Sub-Nav */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.name 
                ? 'bg-white text-[#1a2b4b] shadow-sm border border-slate-200' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
          {/* Search bar inside content */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search in ${activeTab}...`} 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'Client Docs' ? (
              <ClientFolderGrid />
            ) : (
              <DocumentList category={activeTab} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Sub-component for Folder structure
function ClientFolderGrid() {
  const clients = ["Maya Sharma", "Rahul Verma", "Aditi Rao", "Suresh Gupta"];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {clients.map((client) => (
        <div key={client} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Folder size={20} fill="currentColor" className="opacity-20" />
            </div>
            <span className="text-sm font-bold text-slate-700">{client}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
        </div>
      ))}
    </div>
  );
}

// Sub-component for simple list
function DocumentList({ category }) {
  const files = [
    { name: "Affidavit_Draft_V1.pdf", size: "1.2 MB", date: "2 mins ago" },
    { name: "Client_Agreement_Template.docx", size: "450 KB", date: "1 hour ago" },
  ];
  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div key={file.name} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 rounded text-slate-500">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">{file.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold">{file.size} • {file.date}</p>
            </div>
          </div>
          <button className="text-slate-300 hover:text-slate-600 p-1">
            <MoreVertical size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}