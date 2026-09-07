import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/email-campaign-routes';

export default function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const loadCampaigns = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Unable to load email campaigns');
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadCampaigns(); }, []);

  const createCampaign = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, body, targetSegment: 'all' })
      });
      if (!res.ok) throw new Error('Unable to create email campaign');
      await loadCampaigns();
      setTitle('');
      setSubject('');
      setBody('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
      <h2>F-09: Email Marketing Engine</h2>
      <form onSubmit={createCampaign} style={{ display: 'grid', gap: 10, maxWidth: 700, margin: '20px 0' }}>
        <input required placeholder="Campaign Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input required placeholder="Email Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <textarea placeholder="Email Body" value={body} onChange={e => setBody(e.target.value)} rows={5} />
        <button type="submit">Create Email Campaign</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {campaigns.map((cmp, i) => (
          <li key={cmp._id || i}>{cmp.title} — {cmp.subject} [{cmp.status}]</li>
        ))}
      </ul>
    </div>
  );
}
