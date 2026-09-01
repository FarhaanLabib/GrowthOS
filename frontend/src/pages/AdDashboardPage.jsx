import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/ads';

const colors = {
  skyBlue: '#A1EAFB',
  white: '#FDFDFD',
  pink: '#FFCEF3',
  lavender: '#CABBE9'
};

function AdDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/performance`);
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch ad performance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const togglePlatform = async (platform, currentStatus) => {
    try {
      await fetch(`${API_URL}/toggle-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, status: !currentStatus })
      });
      fetchPerformance();
    } catch (err) {
      console.error('Error toggling platform connection:', err);
    }
  };

  const exportCSV = () => {
    if (!data?.campaigns) return;
    const headers = "Platform,Campaign Name,Spend ($),Impressions,Clicks,Leads,Pipeline Value ($)\n";
    const rows = data.campaigns.map(c => 
      `"${c.platform}","${c.name}",${c.spend},${c.impressions},${c.clicks},${c.leads},${c.pipelineValue}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ad_performance_report.csv`;
    a.click();
  };

  if (loading) {
    return <div style={{ padding: '40px' }}>Loading ad dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'red' }}>
        <h3>Failed to load Ad Performance Dashboard</h3>
        <p>Error: {error}</p>
        <p>Make sure your Express server is running and route <code>app.use('/api/ads', require('./routes/ads'))</code> is included in <code>server.js</code>.</p>
        <button onClick={fetchPerformance} style={{ padding: '8px 16px', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  const summary = data?.summary || { totalSpend: 0, totalLeads: 0, cpl: 0, totalPipelineValue: 0, roas: 0, ctr: 0 };
  const connections = data?.connections || {};
  const campaigns = data?.campaigns || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(circle at 20% 20%, ${colors.skyBlue} 0%, ${colors.white} 50%, ${colors.lavender} 100%)`,
      padding: '40px 20px',
      fontFamily: 'sans-serif',
      color: '#333'
    }}>
      
      {/* HEADER & CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Live Ad Performance Dashboard (F-05)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Custom">Custom</option>
          </select>
          <button
            onClick={exportCSV}
            style={{ padding: '8px 16px', backgroundColor: colors.pink, border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* OAUTH INTEGRATIONS STATUS */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', padding: '14px', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <strong>Platform Connections (OAuth):</strong>
        {['Meta', 'Google', 'TikTok'].map((platform) => {
          const isConnected = connections?.[platform];
          return (
            <button
              key={platform}
              onClick={() => togglePlatform(platform, isConnected)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: isConnected ? colors.skyBlue : '#e0e0e0',
                color: isConnected ? '#000' : '#777'
              }}
            >
              {platform} {isConnected ? ' Connected' : ' Disconnected'}
            </button>
          );
        })}
      </div>

      {/* METRIC CARDS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Spend', value: `$${(summary.totalSpend || 0).toLocaleString()}` },
          { label: 'Leads Generated', value: summary.totalLeads || 0 },
          { label: 'Cost Per Lead (CPL)', value: `$${summary.cpl || 0}` },
          { label: 'Pipeline Value', value: `$${(summary.totalPipelineValue || 0).toLocaleString()}` },
          { label: 'ROAS', value: `${summary.roas || 0}x` },
          { label: 'CTR', value: `${summary.ctr || 0}%` }
        ].map((card, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* CHANNEL BREAKDOWN COMPARISON */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
        <h3>Channel Performance Comparison</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {['Meta', 'Google', 'TikTok'].map((plat) => {
            const platCampaigns = campaigns.filter(c => c.platform === plat);
            const spend = platCampaigns.reduce((sum, c) => sum + c.spend, 0);
            const leads = platCampaigns.reduce((sum, c) => sum + c.leads, 0);
            const pipeline = platCampaigns.reduce((sum, c) => sum + c.pipelineValue, 0);

            return (
              <div key={plat} style={{ backgroundColor: 'white', padding: '14px', borderRadius: '10px', borderTop: `4px solid ${colors.lavender}` }}>
                <strong>{plat} Ads</strong>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>Spend: <strong>${spend}</strong></div>
                <div style={{ fontSize: '13px' }}>Leads: <strong>{leads}</strong></div>
                <div style={{ fontSize: '13px' }}>Pipeline Revenue: <strong>${pipeline}</strong></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAMPAIGN LEVEL BREAKDOWN TABLE */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', padding: '16px', borderRadius: '16px' }}>
        <h3>Campaign Breakdown</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '8px' }}>Platform</th>
              <th style={{ padding: '8px' }}>Campaign</th>
              <th style={{ padding: '8px' }}>Spend</th>
              <th style={{ padding: '8px' }}>Clicks</th>
              <th style={{ padding: '8px' }}>Leads</th>
              <th style={{ padding: '8px' }}>CPL</th>
              <th style={{ padding: '8px' }}>Pipeline Value</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '12px', textAlign: 'center' }}>No connected platforms active.</td></tr>
            ) : campaigns.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee', backgroundColor: 'white' }}>
                <td style={{ padding: '10px' }}><strong>{c.platform}</strong></td>
                <td style={{ padding: '10px' }}>{c.name}</td>
                <td style={{ padding: '10px' }}>${c.spend}</td>
                <td style={{ padding: '10px' }}>{c.clicks}</td>
                <td style={{ padding: '10px' }}>{c.leads}</td>
                <td style={{ padding: '10px' }}>${(c.spend / (c.leads || 1)).toFixed(2)}</td>
                <td style={{ padding: '10px', color: '#2e7d32', fontWeight: 'bold' }}>${c.pipelineValue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdDashboardPage;