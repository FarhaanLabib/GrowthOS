import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PageBuilder from './pages/PageBuilder';
import PublicPage from './pages/PublicPage';
import LeadsPage from './pages/LeadsPage';
import InboxPage from './pages/InboxPage';
import SequencesPage from './pages/SequencesPage';
import AdDashboardPage from './pages/AdDashboardPage';
import SmsCampaigns from './pages/SmsCampaigns';
import EmailCampaigns from './pages/EmailCampaigns';
import ContactsManager from './pages/ContactsManager';
import ReviewAutomation from './pages/ReviewAutomation';
import BookingEngine from './pages/BookingEngine';

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
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Link to="/" style={{ fontWeight: 'bold', color: '#2A2A2A', marginRight: '16px', fontSize: '18px', textDecoration: 'none' }}>
            GrowthOS
          </Link>
          <Link to="/pages" style={navLinkStyle}>Page Builder</Link>
          <Link to="/leads" style={navLinkStyle}>Leads</Link>
          <Link to="/inbox" style={navLinkStyle}>Inbox</Link>
          <Link to="/sequences" style={navLinkStyle}>Sequences</Link>
          <Link to="/ads" style={navLinkStyle}>Ad Analytics</Link>
          <Link to="/sms" style={navLinkStyle}>SMS</Link>
          <Link to="/email" style={navLinkStyle}>Email</Link>
          <Link to="/contacts" style={navLinkStyle}>Contacts</Link>
          <Link to="/reviews" style={navLinkStyle}>Reviews</Link>
          <Link to="/bookings" style={navLinkStyle}>Bookings</Link>
        </nav>

        {/* Page Routing */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pages" element={<PageBuilder />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/sequences" element={<SequencesPage />} />
          <Route path="/ads" element={<AdDashboardPage />} />
          <Route path="/sms" element={<SmsCampaigns />} />
          <Route path="/email" element={<EmailCampaigns />} />
          <Route path="/contacts" element={<ContactsManager />} />
          <Route path="/reviews" element={<ReviewAutomation />} />
          <Route path="/bookings" element={<BookingEngine />} />
          <Route path="/p/:slug" element={<PublicPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;