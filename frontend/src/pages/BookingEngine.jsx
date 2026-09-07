import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/bookings';

export default function BookingEngine() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ contactId: '', serviceName: '', startTime: '', endTime: '' });
  const [error, setError] = useState('');

  const loadBookings = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Unable to load bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Unable to create booking');
      await loadBookings();
      setFormData({ contactId: '', serviceName: '', startTime: '', endTime: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
      <h2>F-06: Appointment & Booking Engine</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, maxWidth: 600, margin: '20px 0' }}>
        <input placeholder="Contact ID" value={formData.contactId} onChange={e => setFormData({ ...formData, contactId: e.target.value })} />
        <input required placeholder="Service Name" value={formData.serviceName} onChange={e => setFormData({ ...formData, serviceName: e.target.value })} />
        <label>Start <input required type="datetime-local" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} /></label>
        <label>End <input required type="datetime-local" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} /></label>
        <button type="submit">Book Appointment</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {bookings.map((b, i) => (
          <li key={b._id || i}>{b.serviceName} — {b.startTime ? new Date(b.startTime).toLocaleString() : 'No start time'} — {b.status || 'scheduled'}</li>
        ))}
      </ul>
    </div>
  );
}
