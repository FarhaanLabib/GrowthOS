# GrowthOS loading fix

Fixed Pages and Leads loading issues by:
- Removing hard-coded localhost API URLs from the affected frontend pages.
- Adding a shared API helper that supports VITE_API_URL or same-origin /api.
- Adding the Vite /api proxy for local development.
- Adding loading and error states so failed API requests do not appear as blank pages.
- Making PublicPage use React Router params and safer API/form handling.
- Adding MongoDB defaults so a missing DB_NAME/MONGO_URI does not immediately break the backend.
- Adding backend start/dev scripts.

For production, either:
1. Serve frontend and backend from the same origin with /api routed to the backend, or
2. Set VITE_API_URL to the deployed backend URL plus /api.
