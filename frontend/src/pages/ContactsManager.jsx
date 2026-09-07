import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/contacts';

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const loadContacts = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Unable to load contacts');
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadContacts(); }, []);

  const addContact = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, pipelineStage: 'Lead', createdAt: new Date() })
      });
      if (!res.ok) throw new Error('Unable to create contact');
      await loadContacts();
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
      <h2>F-07: Core CRM & Pipeline Management</h2>
      <p>Contacts created here are stored through the GrowthOS contacts API.</p>
      <form onSubmit={addContact} style={{ display: 'flex', gap: 10, margin: '20px 0', flexWrap: 'wrap' }}>
        <input required placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Add Contact</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {contacts.map((c, i) => (
          <li key={c._id || i}>{c.name} ({c.email}) — Stage: {c.pipelineStage || 'New'}</li>
        ))}
      </ul>
    </div>
  );
}
