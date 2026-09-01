const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GrowthOS backend is running');
});


app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/pipelines', require('./routes/pipelines'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/leads', require('./routes/leadScoring'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/inbox', require('./routes/inbox'));
app.use('/api/sequences', require('./routes/sequences'));
app.use('/api/ads', require('./routes/ads'));


app.use('/api/my-bookings', require('./routes/myBookings'));   // F-06: Appointment Engine
app.use('/api/my-contacts', require('./routes/myContacts'));   // F-07: Core CRM & Pipeline Management
app.use('/api/my-reviews', require('./routes/myReviews'));     // F-08: Review Automation
app.use('/api/my-campaigns', require('./routes/myCampaigns')); // F-09: Email Marketing Engine
app.use('/api/my-messages', require('./routes/myMessages'));   // F-10: Two-Way SMS Marketing

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
