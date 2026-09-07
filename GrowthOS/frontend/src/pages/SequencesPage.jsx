import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const colors = {
  skyBlue: '#A1EAFB',
  white: '#FDFDFD',
  pink: '#FFCEF3',
  lavender: '#CABBE9'
};

function SequencesPage() {
  const [sequences, setSequences] = useState([]);
  const [leads, setLeads] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [selectedSequenceId, setSelectedSequenceId] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State for Sequence Creation
  const [showModal, setShowModal] = useState(false);
  const [newSeqName, setNewSeqName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const [seqRes, leadsRes, execRes] = await Promise.all([
        fetch(`${API_BASE}/sequences`).then(r => r.json()),
        fetch(`${API_BASE}/leads`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/sequences/executions`).then(r => r.json()).catch(() => [])
      ]);

      setSequences(Array.isArray(seqRes) ? seqRes : []);
      setLeads(Array.isArray(leadsRes) ? leadsRes : []);
      setExecutions(Array.isArray(execRes) ? execRes : []);
    } catch (err) {
      console.error('Failed to load sequences data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSequence = async () => {
    if (!newSeqName.trim()) {
      alert('Please enter a sequence name.');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/sequences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `seq-${Date.now()}`,
          name: newSeqName,
          steps: [
            { delayDays: 0, channel: 'Email', message: 'Welcome email' },
            { delayDays: 2, channel: 'WhatsApp', message: 'Follow-up message' }
          ]
        })
      });

      if (res.ok) {
        setNewSeqName('');
        setShowModal(false);
        fetchData();
      } else {
        alert('Failed to create sequence on backend.');
      }
    } catch (err) {
      console.error('Create sequence error:', err);
      alert('Error connecting to backend.');
    } finally {
      setCreating(false);
    }
  };

  const handleTrigger = async () => {
    if (!selectedSequenceId) {
      alert('Please select a sequence template from the dropdown.');
      return;
    }

    setLoading(true);
    try {
      const fallbackLeadId = leads[0]?._id ? String(leads[0]._id) : (leads[0]?.id || 'lead-1');
      const res = await fetch(`${API_BASE}/sequences/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequenceId: selectedSequenceId,
          leadId: selectedLeadId || fallbackLeadId
        })
      });

      const result = await res.json();
      if (res.ok) {
        alert('Sequence triggered successfully!');
        setSelectedSequenceId('');
        setSelectedLeadId('');
        fetchData();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Trigger failed:', err);
      alert('Failed to trigger sequence.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(circle at 20% 20%, ${colors.skyBlue} 0%, ${colors.white} 50%, ${colors.lavender} 100%)`,
      padding: '40px 20px',
      fontFamily: 'sans-serif',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Automated Follow-Up Sequences (F-04)</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 18px',
            backgroundColor: '#e04bbf',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          + Create New Sequence
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* SEQUENCES TEMPLATE LIST */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', padding: '20px', borderRadius: '16px' }}>
          <h3>Sequences & Step Analytics</h3>
          {sequences.length === 0 ? (
            <p style={{ color: '#666' }}>No sequences created yet. Click "+ Create New Sequence" to add one.</p>
          ) : (
            sequences.map(seq => {
              const keyVal = seq._id ? String(seq._id) : seq.id;
              return (
                <div key={keyVal} style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <strong>{seq.name}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Steps count: {seq.steps?.length || 0}</p>
                </div>
              );
            })
          )}
        </div>

        {/* TRIGGER SIMULATION FORM */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', padding: '20px', borderRadius: '16px' }}>
          <h3>Simulate Triggering Sequence</h3>
          
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Select Sequence Template:</label>
          <select
            value={selectedSequenceId}
            onChange={(e) => setSelectedSequenceId(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '16px' }}
          >
            <option value="">-- Choose Template --</option>
            {sequences.map((seq) => {
              const val = seq.id || String(seq._id);
              return (
                <option key={val} value={val}>
                  {seq.name}
                </option>
              );
            })}
          </select>

          {leads.length > 0 && (
            <>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Select Target Lead (Optional):</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '16px' }}
              >
                <option value="">-- Default Lead --</option>
                {leads.map((l) => {
                  const leadVal = l._id ? String(l._id) : String(l.id);
                  return (
                    <option key={leadVal} value={leadVal}>
                      {l.name || l.email || leadVal}
                    </option>
                  );
                })}
              </select>
            </>
          )}

          <button
            onClick={handleTrigger}
            disabled={!selectedSequenceId || loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: selectedSequenceId ? colors.lavender : '#e0e0e0',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: selectedSequenceId ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Triggering...' : '⚡ Trigger Sequence for Lead'}
          </button>
        </div>

      </div>

      {/* LIVE RUNNING EXECUTIONS */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', padding: '20px', borderRadius: '16px' }}>
        <h3>Live Running Executions</h3>
        {executions.length === 0 ? (
          <p style={{ color: '#666' }}>No active executions found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '8px' }}>Sequence</th>
                <th style={{ padding: '8px' }}>Lead ID</th>
                <th style={{ padding: '8px' }}>Progress</th>
                <th style={{ padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((ex, idx) => (
                <tr key={ex._id ? String(ex._id) : idx} style={{ borderBottom: '1px solid #eee', backgroundColor: 'white' }}>
                  <td style={{ padding: '10px' }}><strong>{ex.sequenceName}</strong></td>
                  <td style={{ padding: '10px' }}>{ex.leadId}</td>
                  <td style={{ padding: '10px' }}>Step {ex.currentStep} of {ex.totalSteps}</td>
                  <td style={{ padding: '10px', color: '#2e7d32', fontWeight: 'bold' }}>{ex.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE SEQUENCE MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            width: '360px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ marginTop: 0 }}>Create Sequence Template</h3>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Sequence Name:</label>
            <input
              type="text"
              placeholder="e.g. Welcome Nurture Flow"
              value={newSeqName}
              onChange={(e) => setNewSeqName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSequence}
                disabled={creating}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: colors.lavender,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {creating ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SequencesPage;