import React, { useState, useEffect } from 'react';

export default function TeamManagement() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');

  const loadMembers = () => {
    fetch('http://localhost:5000/api/team')
      .then(res => res.json())
      .then(data => setMembers(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const addMember = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/team/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
      .then(res => res.json())
      .then(() => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('member');
        loadMembers();
      })
      .catch(err => console.error(err));
  };

  const changeRole = (id, newRole) => {
    fetch(`http://localhost:5000/api/team/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
      .then(res => res.json())
      .then(loadMembers)
      .catch(err => console.error(err));
  };

  const removeMember = (id) => {
    fetch(`http://localhost:5000/api/team/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(loadMembers)
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>F-19: Team & Role Management</h2>
      <form onSubmit={addMember} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit">Add Team Member</button>
      </form>
      {members.map(m => (
        <div key={m._id} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <strong>{m.name}</strong> — {m.email}
          <select value={m.role} onChange={e => changeRole(m._id, e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
          <button onClick={() => removeMember(m._id)} style={{ marginLeft: '10px' }}>Remove</button>
        </div>
      ))}
    </div>
  );
}