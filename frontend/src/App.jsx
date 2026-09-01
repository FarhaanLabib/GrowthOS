import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PageBuilder from './pages/PageBuilder';
import PublicPage from './pages/PublicPage';
import LeadsPage from './pages/LeadsPage';
import InboxPage from './pages/InboxPage';
import SequencesPage from './pages/SequencesPage';
import AdDashboardPage from './pages/AdDashboardPage';

const colors = {
  skyBlue: '#A1EAFB',
  white: '#FDFDFD',
  pink: '#FFCEF3',
  lavender: '#CABBE9'
};

const navLinkStyle = {
  color: '#2A2A2A',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: colors.lavender,
  border: `1px solid ${colors.pink}`,
  fontWeight: 'bold',
  fontSize: '14px'
};

function App() {
  return (
    <BrowserRouter>
      <div style={{
        background: `radial-gradient(circle at 20% 20%, ${colors.skyBlue} 0%, ${colors.white} 50%, ${colors.lavender} 100%)`,
        minHeight: '100vh',
        fontFamily: 'sans-serif'
      }}>
        
        {/* Navigation Bar */}
        <nav style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          padding: '16px 24px',
          borderBottom: `1px solid ${colors.pink}`,
          display: 'flex',
          gap: '12px',
          alignItem: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontWeight: 'bold', color: '#2A2A2A', marginRight: '16px', fontSize: '18px' }}>
            CRM Dashboard
          </span>
          <Link to="/" style={navLinkStyle}>Page Builder</Link>
          <Link to="/leads" style={navLinkStyle}>Leads</Link>
          <Link to="/inbox" style={navLinkStyle}>Inbox</Link>
          <Link to="/sequences" style={navLinkStyle}>Sequences</Link>
          <Link to="/ads" style={navLinkStyle}>Ad Analytics</Link>
        </nav>

        {/* Page Routing */}
        <Routes>
          <Route path="/" element={<PageBuilder />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/sequences" element={<SequencesPage />} />
          <Route path="/ads" element={<AdDashboardPage />} />
          <Route path="/p/:slug" element={<PublicPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;