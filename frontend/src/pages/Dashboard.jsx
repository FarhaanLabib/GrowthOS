import { Link } from 'react-router-dom';

const features = [
  { name: 'Smart Lead Capture Pages', code: 'F-01', path: '/pages', desc: 'Build high-converting landing pages, no code needed.', emoji: '🎯', tag: 'Acquisition' },
  { name: 'AI Lead Qualification', code: 'F-02', path: '/leads', desc: 'Automatically score and prioritize the leads most likely to convert.', emoji: '🤖', tag: 'AI' },
  { name: 'Omnichannel Inbox', code: 'F-03', path: '/inbox', desc: 'Keep conversations from every channel in one timeline.', emoji: '📬', tag: 'CRM' },
  { name: 'Automated Follow-Up Sequences', code: 'F-04', path: '/sequences', desc: 'Create multi-step follow-up sequences that keep leads moving.', emoji: '⚡', tag: 'Automation' },
  { name: 'Live Ad Performance Dashboard', code: 'F-05', path: '/ads', desc: 'Monitor campaign performance, CPL, ROAS and pipeline signals.', emoji: '📊', tag: 'Analytics' },
  { name: 'Appointment Booking Engine', code: 'F-06', path: '/bookings', desc: 'Let prospects book appointments directly into your workflow.', emoji: '🗓️', tag: 'Conversion' },
  { name: 'CRM Pipeline & Contacts', code: 'F-07', path: '/contacts', desc: 'Manage contacts and keep every opportunity organized.', emoji: '🔁', tag: 'CRM' },
  { name: 'Review Request Automation', code: 'F-08', path: '/reviews', desc: 'Automate review requests and turn happy customers into social proof.', emoji: '💬', tag: 'Reputation' },
  { name: 'Email Marketing Suite', code: 'F-09', path: '/email', desc: 'Create, schedule and track email marketing campaigns.', emoji: '📧', tag: 'Email' },
  { name: 'SMS Broadcast & Campaigns', code: 'F-10', path: '/sms', desc: 'Send and manage SMS outreach from one place.', emoji: '📱', tag: 'SMS' },
  { name: 'Conversion Tracking & Pixel Health', code: 'F-11', path: '/pixel-tracking', desc: 'Monitor conversion events and identify tracking issues.', emoji: '🔔', tag: 'Tracking' },
  { name: 'Funnel Builder', code: 'F-12', path: '/funnels', desc: 'Map and build multi-step customer journeys visually.', emoji: '🧩', tag: 'Conversion' },
  { name: 'Client Reporting Portal', code: 'F-13', path: '/client-portal', desc: 'Give clients a live, branded view of their results.', emoji: '🖥️', tag: 'Agency' },
  { name: 'AI Copywriting Assistant', code: 'F-14', path: '/copywriting', desc: 'Generate campaign and marketing copy in seconds.', emoji: '✍️', tag: 'AI' },
  { name: 'Document & Proposal Signing', code: 'F-15', path: '/documents', desc: 'Send, sign and track proposals without leaving GrowthOS.', emoji: '📝', tag: 'Operations' },
  { name: 'Invoicing & Payment Collection', code: 'F-16', path: '/invoicing', desc: 'Create invoices and track payment status.', emoji: '💳', tag: 'Finance' },
  { name: 'Workflow Automation', code: 'F-17', path: '/automations', desc: 'Connect triggers and actions to automate repetitive work.', emoji: '⚙️', tag: 'Automation' },
  { name: 'Website & Blog Builder', code: 'F-18', path: '/blog', desc: 'Create and publish website and blog content.', emoji: '🌐', tag: 'Content' },
  { name: 'Team & Role Management', code: 'F-19', path: '/team', desc: 'Manage teammates and their roles from one workspace.', emoji: '👥', tag: 'Team' },
  { name: 'API & Webhook Hub', code: 'F-20', path: '/webhooks', desc: 'Connect GrowthOS to external systems with webhooks.', emoji: '🔗', tag: 'Integrations' },
];

const featureByPath = Object.fromEntries(features.map((feature) => [feature.path, feature]));

function FeatureCard({ feature }) {
  return (
    <Link className="feature-card" to={feature.path}>
      <div className="feature-card-top">
        <span className="feature-num">{feature.code}</span>
        <span className="feature-icon" aria-hidden="true">{feature.emoji}</span>
      </div>
      <h3>{feature.name}</h3>
      <p>{feature.desc}</p>
      <span className="feature-tag">{feature.tag}</span>
      <span className="feature-open">Open feature →</span>
    </Link>
  );
}

function Dashboard() {
  return (
    <main className="landing">
      <section className="hero" id="top">
        <div className="hero-bg" />
        <div className="hero-content">
          <span className="hero-eyebrow">The All-in-One Business Growth Platform</span>
          <h1>Stop <s>guessing</s>.<br />Start <em>growing.</em></h1>
          <p className="hero-sub">
            GrowthOS brings lead capture, CRM, messaging, marketing, automation,
            reporting and operations into one connected workspace.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" to="/pages">Get Started Free →</Link>
            <a className="btn-secondary" href="#features">Explore All Features</a>
          </div>
          <div className="hero-stats">
            <div><strong>20</strong><span>Connected growth tools</span></div>
            <div><strong>1</strong><span>Unified workspace</span></div>
            <div><strong>24/7</strong><span>Automated follow-up</span></div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading center">
          <div className="section-label">20 Core Features</div>
          <h2>Everything your business needs, connected.</h2>
          <p>Every card below is a real frontend route into the corresponding GrowthOS feature.</p>
        </div>
        <div className="features-grid">
          {features.map((feature) => <FeatureCard key={feature.path} feature={feature} />)}
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="section-heading center">
          <div className="section-label">How It Works</div>
          <h2>One platform. One workflow.</h2>
          <p>Move from acquisition to conversion, retention and reporting without switching tools.</p>
        </div>
        <div className="steps">
          <div className="step"><b>01</b><h3>Capture</h3><p>Build pages, collect leads and track every conversion.</p></div>
          <div className="step"><b>02</b><h3>Convert</h3><p>Qualify leads, manage the pipeline and book appointments.</p></div>
          <div className="step"><b>03</b><h3>Engage</h3><p>Use inbox, email, SMS, sequences and reviews to keep customers moving.</p></div>
          <div className="step"><b>04</b><h3>Scale</h3><p>Automate operations, report results and connect external systems.</p></div>
        </div>
      </section>

      <section className="cta-strip">
        <h2>Ready to run your growth stack from one place?</h2>
        <p>Start with any feature above. Every feature is now directly reachable from the homepage.</p>
        <Link className="btn-white" to="/pages">Open GrowthOS →</Link>
      </section>

      <footer className="landing-footer">
        <div>
          <strong>Growth<span>OS</span></strong>
          <p>The connected business growth platform.</p>
        </div>
        <div className="footer-links">
          <a href="#top">Home</a>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <Link to="/pages">Get started</Link>
        </div>
      </footer>
    </main>
  );
}

export { featureByPath };
export default Dashboard;
