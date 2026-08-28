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

  // Badge Color Logic for Priority / Tags
  const getTagStyle = (tag) => {
    const value = (tag || '').toLowerCase();

    if (value.includes('high') || value.includes('urgent') || value.includes('hot')) {
      return {
        backgroundColor: 'rgba(254, 230, 230, 0.85)',
        color: '#9b1c1c',
        border: '1px solid #671b1b'
      };
    }

    if (value.includes('medium') || value.includes('warm')) {
      return {
        backgroundColor: 'rgba(254, 236, 220, 0.85)',
        color: '#9a3412',
        border: '1px solid #95985b'
      };
    }

    if (value.includes('low') || value.includes('cold') || value.includes('not urgent')) {
      return {
        backgroundColor: 'rgba(234, 238, 232, 0.85)',
        color: '#326441',
        border: '1px solid #1f522c'
      };
    }

    return {
      backgroundColor: 'rgba(244, 223, 200, 0.85)',
      color: '#000000',
      border: '1px solid #e0c8b0'
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      // Decorative gradient background to demonstrate the translucent glass blur effect
      background: 'radial-gradient(circle at 20% 20%, #f7d6c8 0%, #faf6f0 50%, #e3d1be 100%)',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        color: '#000000'
      }}>
        {/* Glassmorphism Form Container */}
        <div style={{
          backgroundColor: 'rgba(244, 234, 224, 0.45)', // Translucent fill
          backdropFilter: 'blur(12px)',                  // Glass blur / refraction
          WebkitBackdropFilter: 'blur(12px)',            // Safari support
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.6)',  // Light edge highlight
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#000000' }}>Add a Lead</h2>
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
                border: '1px solid rgba(244, 223, 200, 0.6)',
                backgroundColor: 'rgba(250, 246, 240, 0.6)',
                color: '#000000',
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
                border: '1px solid rgba(244, 223, 200, 0.6)',
                backgroundColor: 'rgba(250, 246, 240, 0.6)',
                color: '#000000',
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
                border: '1px solid rgba(244, 223, 200, 0.6)',
                backgroundColor: 'rgba(250, 246, 240, 0.6)',
                color: '#000000',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            >
              <option value="browsing">Just Browsing</option>
              <option value="this_month">This Month</option>
              <option value="immediate">Immediate</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ color: '#000000', fontSize: '14px' }}>
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
                  border: '1px solid rgba(244, 223, 200, 0.6)',
                  backgroundColor: 'rgba(250, 246, 240, 0.6)',
                  color: '#000000',
                  outline: 'none'
                }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', color: '#000000', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={form.emailOpened}
                onChange={(e) => setForm({ ...form, emailOpened: e.target.checked })}
                style={{ marginRight: '8px', accentColor: '#F4DFC8' }}
              />
              Email Opened
            </label>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer', color: '#000000', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={form.linkClicked}
                onChange={(e) => setForm({ ...form, linkClicked: e.target.checked })}
                style={{ marginRight: '8px', accentColor: '#F4DFC8' }}
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
                backgroundColor: isHovered ? 'rgba(232, 205, 179, 0.9)' : 'rgba(244, 223, 200, 0.8)',
                color: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isHovered ? '0 0 15px rgba(244, 223, 200, 0.9)' : 'none',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Add Lead
            </button>
          </form>
        </div>

        {/* Leads List Section */}
        <h2 style={{ marginTop: '40px', marginBottom: '16px', color: '#000000' }}>
          Leads (sorted by score)
        </h2>
        
        {leads.length === 0 ? (
          <p style={{ color: '#000000', opacity: 0.6 }}>No leads available.</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead._id}
              style={{
                backgroundColor: 'rgba(244, 234, 224, 0.35)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(21, 19, 19, 0.5)',
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: '16px' }}>{lead.name}</strong>
              </div>
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Score: <strong>{lead.score}</strong></span>
                
                {/* Dynamic Priority Tag Badge */}
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