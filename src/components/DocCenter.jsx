import React, { useState } from 'react';
import { Folder, FileText, BookOpen, Upload, Plus } from 'lucide-react';

export default function DocCenter() {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'docs', 'ref'

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full">
      {/* Internal Tab Navigation */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        <TabButton 
          active={activeTab === 'notes'} 
          onClick={() => setActiveTab('notes')} 
          icon={<Plus size={18} />} 
          label="Case Notes" 
        />
        <TabButton 
          active={activeTab === 'docs'} 
          onClick={() => setActiveTab('docs')} 
          icon={<Folder size={18} />} 
          label="Case Docs" 
        />
        <TabButton 
          active={activeTab === 'ref'} 
          onClick={() => setActiveTab('ref')} 
          icon={<BookOpen size={18} />} 
          label="Reference" 
        />
      </div>

      {/* Dynamic Content Area */}
      <div className="p-6 min-h-[400px]">
        {activeTab === 'notes' && <NotesModule />}
        {activeTab === 'docs' && <FilesModule title="Client Documents" color="blue" />}
        {activeTab === 'ref' && <FilesModule title="Legal Library" color="purple" />}
      </div>
    </div>
  );
}

// Sub-Components for cleanliness
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all
      ${active ? 'bg-white text-blue-700 border-t-2 border-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
  >
    {icon} {label}
  </button>
);

const NotesModule = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h4 className="font-bold text-gray-700 text-lg">Digital Case Ledger</h4>
      <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">Auto-Saving...</button>
    </div>
    <textarea 
      placeholder="Start typing private case notes here... (e.g., Witness testimony details)"
      className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
    />
  </div>
);

const FilesModule = ({ title, color }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h4 className="font-bold text-gray-700 text-lg">{title}</h4>
      <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
        <Upload size={16} /> Upload New
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Mock Files */}
      {[1, 2].map(i => (
        <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-blue-200 cursor-pointer">
          <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
            <FileText />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Case_File_00{i}.pdf</p>
            <p className="text-xs text-gray-400">Added: 21 Mar 2026</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);