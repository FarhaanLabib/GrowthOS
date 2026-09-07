import React, { useState, useEffect } from 'react';

export default function Invoicing() {
  const [invoices, setInvoices] = useState([]);
  const [clientName, setClientName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadInvoices = () => {
    fetch('http://localhost:5000/api/invoices')
      .then(res => res.json())
      .then(data => setInvoices(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const createInvoice = (e) => {
    e.preventDefault();
    const items = [{ desc: itemDesc, amount: Number(itemAmount) || 0 }];
    fetch('http://localhost:5000/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName, items, dueDate })
    })
      .then(res => res.json())
      .then(() => {
        setClientName('');
        setItemDesc('');
        setItemAmount('');
        setDueDate('');
        loadInvoices();
      })
      .catch(err => console.error(err));
  };

  const markPaid = (id) => {
    fetch(`http://localhost:5000/api/invoices/${id}/pay`, { method: 'PUT' })
      .then(res => res.json())
      .then(loadInvoices)
      .catch(err => console.error(err));
  };

  const deleteInvoice = (id) => {
    fetch(`http://localhost:5000/api/invoices/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(loadInvoices)
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-16: Invoicing & Payment Collection</h2>
      <form onSubmit={createInvoice} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Client name" value={clientName} onChange={e => setClientName(e.target.value)} required />
        <input placeholder="Item description" value={itemDesc} onChange={e => setItemDesc(e.target.value)} required />
        <input placeholder="Amount" type="number" value={itemAmount} onChange={e => setItemAmount(e.target.value)} required />
        <input placeholder="Due date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <button type="submit">Create Invoice</button>
      </form>
      {invoices.map(inv => (
        <div key={inv._id} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <strong>{inv.clientName}</strong> — ${inv.total?.toFixed ? inv.total.toFixed(2) : inv.total}
          {' '}<span style={{ opacity: 0.7 }}>[{inv.status}]</span>
          {inv.dueDate && <span style={{ marginLeft: '8px', opacity: 0.6 }}>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>}
          <ul>
            {(inv.items || []).map((it, i) => <li key={i}>{it.desc} — ${it.amount}</li>)}
          </ul>
          {inv.status !== 'paid' && (
            <button onClick={() => markPaid(inv._id)} style={{ marginRight: '8px' }}>Mark Paid</button>
          )}
          <button onClick={() => deleteInvoice(inv._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}