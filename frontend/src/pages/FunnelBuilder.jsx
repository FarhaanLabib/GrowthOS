import React, { useState, useEffect } from 'react';

export default function FunnelBuilder() {
  const [funnels, setFunnels] = useState([]);
  const [name, setName] = useState('');
  const [stepNames, setStepNames] = useState('');

  const loadFunnels = () => {
    fetch('http://localhost:5000/api/funnels')
      .then(res => res.json())
      .then(data => setFunnels(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadFunnels();
  }, []);

  const createFunnel = (e) => {
    e.preventDefault();
    const steps = stepNames.split(',').map(s => ({ name: s.trim(), visitors: 0, progressed: 0 }));
    fetch('http://localhost:5000/api/funnels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, steps })
    })
      .then(res => res.json())
      .then(() => {
        setName('');
        setStepNames('');
        loadFunnels();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-12: Funnel Builder</h2>
      <form onSubmit={createFunnel} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Funnel name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Steps, comma separated" value={stepNames} onChange={e => setStepNames(e.target.value)} required />
        <button type="submit">Create Funnel</button>
      </form>
      {funnels.map(f => (
        <div key={f._id} style={{ marginBottom: '15px' }}>
          <h3>{f.name}</h3>
          <ol>
            {f.steps.map((s, i) => (
              <li key={i}>{s.name} — Visitors: {s.visitors || 0}, Progressed: {s.progressed || 0}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
