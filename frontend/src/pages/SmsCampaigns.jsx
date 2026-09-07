import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/sms-campaign-routes';

export default function SmsCampaigns() {
  const [messages, setMessages] = useState([]);
  const [contactId, setContactId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const sendSms = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, phoneNumber, text })
      });
      if (!res.ok) throw new Error('Unable to send SMS');
      const result = await res.json();
      setMessages((current) => [...current, {
        _id: result.smsId,
        contactId,
        phoneNumber,
        text,
        direction: 'outbound',
        status: 'delivered',
        timestamp: new Date()
      }]);
      setPhoneNumber('');
      setText('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!contactId) return;
    fetch(`${API_URL}/sms/${encodeURIComponent(contactId)}`)
      .then(res => {
        if (!res.ok) throw new Error('Unable to load SMS history');
        return res.json();
      })
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message));
  }, [contactId]);

  return (
    <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
      <h2>F-10: Two-Way SMS Marketing</h2>
      <form onSubmit={sendSms} style={{ display: 'grid', gap: 10, maxWidth: 700, margin: '20px 0' }}>
        <input placeholder="Contact ID (optional)" value={contactId} onChange={e => setContactId(e.target.value)} />
        <input required placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
        <input required placeholder="SMS Message" value={text} onChange={e => setText(e.target.value)} />
        <button type="submit">Send SMS</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {messages.map((m, i) => (
          <li key={m._id || i}>To: {m.phoneNumber} — "{m.text}" — {m.status || 'sent'}</li>
        ))}
      </ul>
    </div>
  );
}
