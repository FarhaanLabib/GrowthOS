import React, { useState, useEffect } from 'react';

export default function ReviewAutomation() {
  const [reviews, setReviews] = useState([]);
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/review-routes')
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const sendReviewInvite = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/review-routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName, status: 'Requested', sentAt: new Date() })
    })
      .then(res => res.json())
      .then(resData => setReviews([...reviews, resData]));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-08: Review Automation Engine</h2>
      <form onSubmit={sendReviewInvite} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} />
        <button type="submit">Send Review Invite</button>
      </form>

      <ul>
        {reviews.map((r, i) => (
          <li key={r._id || i}>Review request sent to: {r.clientName || 'Client'} ({r.status})</li>
        ))}
      </ul>
    </div>
  );
}