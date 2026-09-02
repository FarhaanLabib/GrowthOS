import React, { useState } from 'react';

export default function ClientPortal() {
  const [clientId, setClientId] = useState('');
  const [report, setReport] = useState(null);

  const loadReport = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/client-reports/${clientId}`)
      .then(res => res.json())
      .then(data => setReport(data))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-13: Client Reporting Portal</h2>
      <form onSubmit={loadReport} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Enter your Client ID" value={clientId} onChange={e => setClientId(e.target.value)} required />
        <button type="submit">View My Report</button>
      </form>
      {report && (
        report.message ? (
          <p>{report.message}</p>
        ) : (
          <ul>
            <li>Ad Spend: ${report.adSpend}</li>
            <li>Leads Generated: {report.leadsGenerated}</li>
            <li>CPL: ${report.cpl}</li>
            <li>Appointments Booked: {report.appointmentsBooked}</li>
            <li>Deals Won: {report.dealsWon}</li>
          </ul>
        )
      )}
    </div>
  );
}
