import React, { useState, useEffect } from 'react';

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/contacts-routes')
      .then(res => res.json())
      .then(data => setContacts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const addContact = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/contacts-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, pipelineStage: 'Lead' })
    })
      .then(res => res.json())
      .then(saved => setContacts([...contacts, saved]));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-07: Core CRM & Pipeline Management</h2>
      <form onSubmit={addContact} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Add Contact</button>
      </form>

      <ul>
        {contacts.map((c, i) => (
          <li key={c._id || i}>{c.name} ({c.email}) - Stage: {c.pipelineStage || 'New'}</li>
        ))}
      </ul>
    </div>
  );
}