import React, { useState } from 'react';

const DocCenter = () => {
  const [activeTab, setActiveTab] = useState('case-docs');

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('case-docs')}>Case Docs</button>
        <button onClick={() => setActiveTab('notes')}>Case Notes</button>
        <button onClick={() => setActiveTab('reference')}>References</button>
      </div>

      <div className="content-area">
        {activeTab === 'case-docs' && <CaseDocsList />}
        {activeTab === 'notes' && <NotesEditor />}
        {activeTab === 'reference' && <ReferenceLibrary />}
      </div>
    </div>
  );
};

// Define these small components or move them to separate files
const CaseDocsList = () => <div>List of PDF files for cases...</div>;
const NotesEditor = () => <textarea placeholder="Write your case notes here..." style={{width: '100%', height: '300px'}} />;
const ReferenceLibrary = () => <div>Legal precedents and law library...</div>;

export default DocCenter;