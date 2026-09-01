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

app.use('/api/pixel-events', require('./routes/pixelTracking'));
app.use('/api/funnels', require('./routes/funnels'));
app.use('/api/client-reports', require('./routes/clientReports'));
app.use('/api/copywriting', require('./routes/copywriting'));
app.use('/api/documents', require('./routes/documents'));


app.use('/api/booking-routes', require('./routes/bookingRoutes'));
app.use('/api/contacts-routes', require('./routes/contactsRoutes'));
app.use('/api/review-routes', require('./routes/reviewRoutes'));
app.use('/api/email-campaign-routes', require('./routes/emailCampaignRoutes'));
app.use('/api/sms-campaign-routes', require('./routes/smsCampaignRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
