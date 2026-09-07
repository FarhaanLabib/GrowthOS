import React, { useState } from 'react';

export default function CopywritingAssistant() {
  const [businessType, setBusinessType] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [variations, setVariations] = useState([]);

  const generate = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/copywriting/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessType, offer, audience, tone })
    })
      .then(res => res.json())
      .then(data => setVariations(data.variations || []))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-14: AI Copywriting Assistant</h2>
      <form onSubmit={generate} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Business type" value={businessType} onChange={e => setBusinessType(e.target.value)} required />
        <input placeholder="Offer" value={offer} onChange={e => setOffer(e.target.value)} required />
        <input placeholder="Audience" value={audience} onChange={e => setAudience(e.target.value)} required />
        <select value={tone} onChange={e => setTone(e.target.value)}>
          <option>Professional</option>
          <option>Casual</option>
          <option>Urgent</option>
          <option>Friendly</option>
          <option>Bold</option>
        </select>
        <button type="submit">Generate 3 Variations</button>
      </form>
      <ul>
        {variations.map((v, i) => <li key={i}>{v}</li>)}
      </ul>
    </div>
  );
}
