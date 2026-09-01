import React, { useState, useEffect } from 'react';

export default function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/email-campaign-routes')
      .then(res => res.json())
      .then(data => setCampaigns(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const createCampaign = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/email-campaign-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, status: 'Scheduled' })
    })
      .then(res => res.json())
      .then(newCamp => setCampaigns([...campaigns, newCamp]));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-09: Email Marketing Engine</h2>
      <form onSubmit={createCampaign} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Campaign Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Email Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <button type="submit">Create Email Campaign</button>
      </form>

      <ul>
        {campaigns.map((cmp, i) => (
          <li key={cmp._id || i}>{cmp.title} - Subject: {cmp.subject} [{cmp.status}]</li>
        ))}
      </ul>
    </div>
  );
}