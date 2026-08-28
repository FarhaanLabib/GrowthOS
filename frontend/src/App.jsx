import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PageBuilder from './pages/PageBuilder';
import PublicPage from './pages/PublicPage';
import LeadsPage from './pages/LeadsPage';
import InboxPage from './pages/InboxPage';

// Navigation link button styling
const navLinkStyle = {
  color: '#2A2A2A',
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: '#CABBE9',
  border: '1px solid #FFCEF3',
  fontWeight: 'bold',
  fontSize: '14px'
};

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#FDFDFD', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Navigation Bar */}
        <nav style={{
          backgroundColor: '#A1EAFB',
          padding: '16px 24px',
          borderBottom: '1px solid #FFCEF3',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 'bold', color: '#2A2A2A', marginRight: '16px', fontSize: '18px' }}>
            CRM Dashboard
          </span>
          <Link to="/" style={navLinkStyle}>Page Builder</Link>
          <Link to="/leads" style={navLinkStyle}>Leads</Link>
          <Link to="/inbox" style={navLinkStyle}>Inbox</Link>
        </nav>

        {/* Page Routing */}
        <Routes>
          <Route path="/" element={<PageBuilder />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/p/:slug" element={<PublicPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;