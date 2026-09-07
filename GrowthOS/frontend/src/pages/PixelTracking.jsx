import React, { useState, useEffect } from 'react';

export default function PixelTracking() {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [source, setSource] = useState('browser');
  const [contactId, setContactId] = useState('');

  const loadEvents = () => {
    fetch('http://localhost:5000/api/pixel-events')
      .then(res => res.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const logEvent = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/pixel-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, source, contactId: contactId || null })
    })
      .then(res => res.json())
      .then(() => {
        setEventName('');
        setContactId('');
        loadEvents();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-11: Pixel Tracking & Health</h2>
      <form onSubmit={logEvent} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Event name (e.g. Purchase)" value={eventName} onChange={e => setEventName(e.target.value)} required />
        <select value={source} onChange={e => setSource(e.target.value)}>
          <option value="browser">Browser Pixel</option>
          <option value="capi">CAPI</option>
        </select>
        <input placeholder="Contact ID (optional)" value={contactId} onChange={e => setContactId(e.target.value)} />
        <button type="submit">Simulate Event</button>
      </form>
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Event</th><th>Source</th><th>Match Quality</th><th>Duplicate?</th><th>Received</th></tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i}>
              <td>{e.eventName}</td>
              <td>{e.source}</td>
              <td>{e.matchQuality}</td>
              <td>{String(e.duplicate)}</td>
              <td>{new Date(e.receivedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}