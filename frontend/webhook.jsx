import React, { useState, useEffect } from 'react';

export default function WebhookHub() {
  const [webhooks, setWebhooks] = useState([]);
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  const loadWebhooks = () => {
    fetch('http://localhost:5000/api/webhooks')
      .then(res => res.json())
      .then(data => setWebhooks(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  const createWebhook = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, event, targetUrl })
    })
      .then(res => res.json())
      .then(() => {
        setName('');
        setEvent('');
        setTargetUrl('');
        loadWebhooks();
      })
      .catch(err => console.error(err));
  };

  const toggleWebhook = (id) => {
    fetch(`http://localhost:5000/api/webhooks/${id}/toggle`, { method: 'PUT' })
      .then(res => res.json())
      .then(loadWebhooks)
      .catch(err => console.error(err));
  };

  const deleteWebhook = (id) => {
    fetch(`http://localhost:5000/api/webhooks/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(loadWebhooks)
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-20: API & Webhook Hub</h2>
      <form onSubmit={createWebhook} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Webhook name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Event (e.g. invoice.paid)" value={event} onChange={e => setEvent(e.target.value)} required />
        <input placeholder="Target URL (optional, for outbound)" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} />
        <button type="submit">Create Webhook</button>
      </form>
      {webhooks.map(w => (
        <div key={w._id} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <strong>{w.name}</strong> — event: <code>{w.event}</code>
          {' '}<span style={{ opacity: 0.7 }}>[{w.active ? 'active' : 'inactive'}]</span>
          <p style={{ margin: '6px 0', fontSize: '13px', opacity: 0.75 }}>
            Inbound URL: http://localhost:5000/api/webhooks/incoming/{w._id}
          </p>
          <p style={{ margin: '6px 0', fontSize: '13px', opacity: 0.75 }}>Secret: {w.secret}</p>
          <button onClick={() => toggleWebhook(w._id)} style={{ marginRight: '8px' }}>
            {w.active ? 'Disable' : 'Enable'}
          </button>
          <button onClick={() => deleteWebhook(w._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}