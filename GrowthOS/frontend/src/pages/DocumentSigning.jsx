import React, { useState } from 'react';

export default function DocumentSigning() {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [content, setContent] = useState('');
  const [createdId, setCreatedId] = useState('');

  const [docId, setDocId] = useState('');
  const [doc, setDoc] = useState(null);
  const [signerName, setSignerName] = useState('');

  const createDoc = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, clientName, content })
    })
      .then(res => res.json())
      .then(result => setCreatedId(result.insertedId))
      .catch(err => console.error(err));
  };

  const viewDoc = (e) => {
    if (e) e.preventDefault();
    fetch(`http://localhost:5000/api/documents/${docId}`)
      .then(res => res.json())
      .then(data => setDoc(data))
      .catch(err => console.error(err));
  };

  const signDoc = () => {
    fetch(`http://localhost:5000/api/documents/${docId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signedBy: signerName })
    })
      .then(() => viewDoc())
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-15: Document & Proposal Signing</h2>

      <h3>Create a Document</h3>
      <form onSubmit={createDoc} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginBottom: '20px' }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Client name" value={clientName} onChange={e => setClientName(e.target.value)} required />
        <textarea placeholder="Document content" value={content} onChange={e => setContent(e.target.value)} required />
        <button type="submit">Send for Signature</button>
      </form>
      {createdId && <p>Created! Document ID: {createdId}</p>}

      <hr />

      <h3>View / Sign a Document</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input placeholder="Document ID" value={docId} onChange={e => setDocId(e.target.value)} />
        <button onClick={viewDoc}>View</button>
      </div>
      {doc && (
        <div>
          <h4>{doc.title}</h4>
          <p>{doc.content}</p>
          <p>Status: {doc.status}</p>
        </div>
      )}
      <input placeholder="Type your name to sign" value={signerName} onChange={e => setSignerName(e.target.value)} />
      <button onClick={signDoc}>Sign</button>
    </div>
  );
}
