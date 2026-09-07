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
import PixelTracking from './pages/PixelTracking';
import FunnelBuilder from './pages/FunnelBuilder';
import ClientPortal from './pages/ClientPortal';
import CopywritingAssistant from './pages/CopywritingAssistant';
import DocumentSigning from './pages/DocumentSigning';
import Invoicing from './pages/Invoicing';
import Automations from './pages/Automations';
import BlogBuilder from './pages/BlogBuilder';
import TeamManagement from './pages/TeamManagement';
import WebhookHub from './pages/WebhookHub';
import './App.css';

const navItems = [
  ['/pages', 'Pages'], ['/leads', 'Leads'], ['/inbox', 'Inbox'], ['/sequences', 'Sequences'],
  ['/ads', 'Ads'], ['/sms', 'SMS'], ['/email', 'Email'], ['/contacts', 'Contacts'],
  ['/reviews', 'Reviews'], ['/bookings', 'Bookings'], ['/pixel-tracking', 'Tracking'],
  ['/funnels', 'Funnels'], ['/client-portal', 'Reports'], ['/copywriting', 'Copy'],
  ['/documents', 'Documents'], ['/invoicing', 'Invoices'], ['/automations', 'Automation'],
  ['/blog', 'Blog'], ['/team', 'Team'], ['/webhooks', 'Webhooks'],
];

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="app-nav">
          <Link className="app-brand" to="/">Growth<span>OS</span></Link>
          <div className="app-nav-links">
            {navItems.map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}
          </div>
        </nav>

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
          <Route path="/pixel-tracking" element={<PixelTracking />} />
          <Route path="/funnels" element={<FunnelBuilder />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/copywriting" element={<CopywritingAssistant />} />
          <Route path="/documents" element={<DocumentSigning />} />
          <Route path="/invoicing" element={<Invoicing />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/blog" element={<BlogBuilder />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/webhooks" element={<WebhookHub />} />
          <Route path="/p/:slug" element={<PublicPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
