import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/leads';

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [form, setForm] = useState({
    name: '',
    budget: 'low',
    timeline: 'browsing',
    pageRevisits: 0,
    emailOpened: false,
    linkClicked: false
  });

  const fetchLeads = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      fetchLeads();
      setForm({ name: '', budget: 'low', timeline: 'browsing', pageRevisits: 0, emailOpened: false, linkClicked: false });
    } catch (err) {
      console.error("Failed to submit lead:", err);
    }
  };

  const getTagStyle = (tag) => {
    const value = (tag || '').toLowerCase();

    if (value.includes('high') || value.includes('urgent') || value.includes('hot')) {
      return {
        backgroundColor: '#CABBE9',
        color: '#2A2A2A',
        border: '1px solid #FFCEF3'
      };
    }

    if (value.includes('medium') || value.includes('warm')) {
      return {
        backgroundColor: '#FFCEF3',
        color: '#2A2A2A',
        border: '1px solid #CABBE9'
      };
    }

    return {
      backgroundColor: '#FDFDFD',
      color: '#2A2A2A',
      border: '1px solid #FFCEF3'
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#FDFDFD',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        color: '#2A2A2A'
      }}>
        {/* Form Container */}
        <div style={{
          backgroundColor: '#A1EAFB',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #FFCEF3'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#2A2A2A' }}>Add a Lead</h2>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                display: 'block',
                marginBottom: '12px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #FFCEF3',
                backgroundColor: '#FDFDFD',
                color: '#2A2A2A',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            <select
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              style={{
                display: 'block',
                marginBottom: '12px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #FFCEF3',
                backgroundColor: '#FDFDFD',
                color: '#2A2A2A',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            >
              <option value="low">Low Budget</option>
              <option value="medium">Medium Budget</option>
              <option value="high">High Budget</option>
            </select>

            <select
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              style={{
                display: 'block',
                marginBottom: '12px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #FFCEF3',
                backgroundColor: '#FDFDFD',
                color: '#2A2A2A',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            >
              <option value="browsing">Just Browsing</option>
              <option value="this_month">This Month</option>
              <option value="immediate">Immediate</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ color: '#2A2A2A', fontSize: '14px' }}>
                Page Revisits:
              </label>
              <input
                type="number"
                value={form.pageRevisits}
                onChange={(e) => setForm({ ...form, pageRevisits: Number(e.target.value) })}
                style={{
                  marginLeft: '10px',
                  width: '70px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid #FFCEF3',
                  backgroundColor: '#FDFDFD',
                  color: '#2A2A2A',
                  outline: 'none'
                }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', color: '#2A2A2A', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={form.emailOpened}
                onChange={(e) => setForm({ ...form, emailOpened: e.target.checked })}
                style={{ marginRight: '8px', accentColor: '#CABBE9' }}
              />
              Email Opened
            </label>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer', color: '#2A2A2A', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={form.linkClicked}
                onChange={(e) => setForm({ ...form, linkClicked: e.target.checked })}
                style={{ marginRight: '8px', accentColor: '#CABBE9' }}
              />
              Link Clicked
            </label>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: isHovered ? '#FFCEF3' : '#CABBE9',
                color: '#2A2A2A',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Add Lead
            </button>
          </form>
        </div>

        {/* Leads List Section */}
        <h2 style={{ marginTop: '40px', marginBottom: '16px', color: '#2A2A2A' }}>
          Leads (sorted by score)
        </h2>
        
        {leads.length === 0 ? (
          <p style={{ color: '#2A2A2A', opacity: 0.6 }}>No leads available.</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead._id}
              style={{
                backgroundColor: '#A1EAFB',
                border: '1px solid #FFCEF3',
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#2A2A2A'
              }}
            >
              <div>
                <strong style={{ fontSize: '16px' }}>{lead.name}</strong>
              </div>
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Score: <strong style={{ color: '#2A2A2A' }}>{lead.score}</strong></span>
                
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  ...getTagStyle(lead.tag)
                }}>
                  {lead.tag}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeadsPage;