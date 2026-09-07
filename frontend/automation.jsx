import React, { useState, useEffect } from 'react';

export default function Automations() {
  const [automations, setAutomations] = useState([]);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [actionTypes, setActionTypes] = useState('');

  const loadAutomations = () => {
    fetch('http://localhost:5000/api/automations')
      .then(res => res.json())
      .then(data => setAutomations(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadAutomations();
  }, []);

  const createAutomation = (e) => {
    e.preventDefault();
    const actions = actionTypes.split(',').map(t => ({ type: t.trim(), config: {} }));
    fetch('http://localhost:5000/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, trigger, actions })
    })
      .then(res => res.json())
      .then(() => {
        setName('');
        setTrigger('');
        setActionTypes('');
        loadAutomations();
      })
      .catch(err => console.error(err));
  };

  const toggleAutomation = (id) => {
    fetch(`http://localhost:5000/api/automations/${id}/toggle`, { method: 'PUT' })
      .then(res => res.json())
      .then(loadAutomations)
      .catch(err => console.error(err));
  };

  const runAutomation = (id) => {
    fetch(`http://localhost:5000/api/automations/${id}/run`, { method: 'POST' })
      .then(res => res.json())
      .then(loadAutomations)
      .catch(err => console.error(err));
  };

  const deleteAutomation = (id) => {
    fetch(`http://localhost:5000/api/automations/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(loadAutomations)
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-17: Workflow & Zapier-Style Automation</h2>
      <form onSubmit={createAutomation} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Workflow name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Trigger (e.g. contact.created)" value={trigger} onChange={e => setTrigger(e.target.value)} required />
        <input placeholder="Actions, comma separated" value={actionTypes} onChange={e => setActionTypes(e.target.value)} required />
        <button type="submit">Create Workflow</button>
      </form>
      {automations.map(a => (
        <div key={a._id} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <strong>{a.name}</strong> — trigger: <code>{a.trigger}</code>
          {' '}<span style={{ opacity: 0.7 }}>[{a.enabled ? 'enabled' : 'disabled'}]</span>
          {' '}<span style={{ opacity: 0.6 }}>runs: {a.runCount || 0}</span>
          <ol>
            {(a.actions || []).map((act, i) => <li key={i}>{act.type}</li>)}
          </ol>
          <button onClick={() => toggleAutomation(a._id)} style={{ marginRight: '8px' }}>
            {a.enabled ? 'Disable' : 'Enable'}
          </button>
          <button onClick={() => runAutomation(a._id)} style={{ marginRight: '8px' }} disabled={!a.enabled}>
            Run Now
          </button>
          <button onClick={() => deleteAutomation(a._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}