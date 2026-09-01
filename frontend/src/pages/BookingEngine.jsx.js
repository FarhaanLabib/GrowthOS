import React, { useState, useEffect } from 'react';

export default function SmsCampaigns() {
  const [messages, setMessages] = useState([]);
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/sms-campaign-routes')
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const sendSms = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/sms-campaign-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, text, direction: 'outbound' })
    })
      .then(res => res.json())
      .then(msg => setMessages([...messages, msg]));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-10: Two-Way SMS Marketing</h2>
      <form onSubmit={sendSms} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
        <input placeholder="SMS Message" value={text} onChange={e => setText(e.target.value)} />
        <button type="submit">Send SMS</button>
      </form>

      <ul>
        {messages.map((m, i) => (
          <li key={m._id || i}>To: {m.phone} | Message: "{m.text}"</li>
        ))}
      </ul>
    </div>
  );
}