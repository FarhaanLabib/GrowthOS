import React, { useState, useEffect } from 'react';

export default function BookingEngine() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ contactName: '', serviceName: '', startTime: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/booking-routes')
      .then(res => res.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/booking-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(newBooking => {
        setBookings([...bookings, newBooking]);
        setFormData({ contactName: '', serviceName: '', startTime: '' });
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-06: Appointment & Booking Engine</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="Client Name" 
          value={formData.contactName} 
          onChange={e => setFormData({ ...formData, contactName: e.target.value })} 
        />
        <input 
          placeholder="Service Name" 
          value={formData.serviceName} 
          onChange={e => setFormData({ ...formData, serviceName: e.target.value })} 
        />
        <input 
          type="datetime-local" 
          value={formData.startTime} 
          onChange={e => setFormData({ ...formData, startTime: e.target.value })} 
        />
        <button type="submit">Book Appointment</button>
      </form>

      <ul>
        {bookings.map((b, i) => (
          <li key={b._id || i}>{b.contactName} - {b.serviceName} ({new Date(b.startTime).toLocaleString()})</li>
        ))}
      </ul>
    </div>
  );
}