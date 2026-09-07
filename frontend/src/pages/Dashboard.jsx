import { Link } from 'react-router-dom';

const colors = {
  skyBlue: '#A1EAFB',
  white: '#FDFDFD',
  pink: '#FFCEF3',
  lavender: '#CABBE9'
};

const features = [
  { name: 'Lead Capture Pages', code: 'F-01', path: '/pages', desc: 'Build high-converting landing pages, no code needed.', emoji: '🧲' },
  { name: 'Lead Qualification', code: 'F-02', path: '/leads', desc: 'Automatic scoring so your team calls the hottest leads first.', emoji: '🎯' },
  { name: 'Omnichannel Inbox', code: 'F-03', path: '/inbox', desc: 'Every conversation, every channel, one inbox.', emoji: '💬' },
  { name: 'Follow-Up Sequences', code: 'F-04', path: '/sequences', desc: 'Automated multi-step outreach that never lets a lead go cold.', emoji: '⏱️' },
  { name: 'Ad Performance Dashboard', code: 'F-05', path: '/ads', desc: 'Meta, Google, and TikTok ad results in one live view.', emoji: '📊' },
  { name: 'Appointment Booking', code: 'F-06', path: '/bookings', desc: 'Let leads self-schedule straight into your calendar.', emoji: '📅' },
  { name: 'Core CRM', code: 'F-07', path: '/contacts', desc: 'Track every contact and deal in one pipeline.', emoji: '🗂️' },
  { name: 'Review Automation', code: 'F-08', path: '/reviews', desc: 'Turn happy customers into 5-star public reviews.', emoji: '⭐' },
  { name: 'Email Marketing', code: 'F-09', path: '/email', desc: 'Build and send campaigns that convert your list.', emoji: '✉️' },
  { name: 'SMS Marketing', code: 'F-10', path: '/sms', desc: 'Two-way text campaigns with near-instant open rates.', emoji: '📱' },
  { name: 'Pixel Tracking & Health', code: 'F-11', path: '/pixel-tracking', desc: 'Catch broken tracking before it costs you attribution.', emoji: '📡' },
  { name: 'Funnel Builder', code: 'F-12', path: '/funnels', desc: 'Map every step and see exactly where visitors drop off.', emoji: '🔻' },
  { name: 'Client Reporting Portal', code: 'F-13', path: '/client-portal', desc: 'Give clients a live view into their own results.', emoji: '📈' },
  { name: 'AI Copywriting Assistant', code: 'F-14', path: '/copywriting', desc: 'Draft on-brand copy in seconds, not hours.', emoji: '✍️' },
  { name: 'Document & Proposal Signing', code: 'F-15', path: '/documents', desc: 'Send, sign, and track proposals without leaving the app.', emoji: '📝' },
  { name: 'Invoicing & Payment Collection', code: 'F-16', path: '/invoicing', desc: 'Bill clients and track who has actually paid.', emoji: '💳' },
  { name: 'Workflow Automation', code: 'F-17', path: '/automations', desc: 'Zapier-style triggers and actions, built right in.', emoji: '⚡' },
  { name: 'Website & Blog Builder', code: 'F-18', path: '/blog', desc: 'Publish blog content without a separate CMS.', emoji: '🌐' },
  { name: 'Team & Role Management', code: 'F-19', path: '/team', desc: 'Add teammates and control what each role can do.', emoji: '👥' },
  { name: 'API & Webhook Hub', code: 'F-20', path: '/webhooks', desc: 'Send and receive events to connect your other tools.', emoji: '🔗' },
];

function Dashboard() {
  return (
    <div style={{ padding: '60px 20px 100px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
        <h1 style={{ fontSize: '42px', margin: '0 0 12px 0', color: '#2A2A2A' }}>
          Every growth tool. One platform.
        </h1>
        <p style={{ fontSize: '17px', color: '#555', margin: 0 }}>
          Lead gen, CRM, messaging, and marketing - built for agencies and growth-focused businesses.
        </p>
      </div>

      {/* Horizontal scroll row of feature cards */}
      <div style={{
        display: 'flex',
        gap: '20px',
        overflowX: 'auto',
        padding: '10px 20px 30px',
        scrollSnapType: 'x mandatory'
      }}>
        {features.map((f) => (
          <Link
            key={f.path}
            to={f.path}
            style={{
              scrollSnapAlign: 'start',
              flex: '0 0 260px',
              textDecoration: 'none',
              color: '#2A2A2A',
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '20px',
              padding: '28px 22px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '14px' }}>{f.emoji}</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', opacity: 0.5, marginBottom: '4px' }}>
              {f.code}
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{f.name}</h3>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.75, lineHeight: '1.5' }}>{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Small hint below the scroll row */}
      <p style={{ textAlign: 'center', fontSize: '13px', opacity: 0.5, marginTop: '10px' }}>
        ← scroll to see all 20 features →
      </p>
    </div>
  );
}

export default Dashboard;