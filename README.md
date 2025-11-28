# JS_App_Rental

A simple fleet management web application built with Node.js, Express, MongoDB (Mongoose), and a vanilla HTML/CSS/JS frontend.

## Project Structure
- `backend/` – Express server, Mongoose models, and API routes.
- `frontend/` – Static HTML, CSS, and JavaScript that consume the REST API.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   # or, if you are behind a corporate proxy or see 403 errors:
   ./scripts/install-no-proxy.sh
   ```
2. Set your MongoDB connection string:
   - Create a `.env` file in the project root with `MONGODB_URI=<your-connection-string>`.
   - Optional: set `PORT` to override the default `5000`.
3. Run the server:
   ```bash
   npm run dev   # uses nodemon for auto-restart
   # or
   npm start     # runs with node
   ```
4. Open the frontend:
   - Serve the `frontend` folder with your preferred static server, or open `frontend/index.html` directly in the browser if CORS allows.
   - Ensure the backend API is reachable at `http://localhost:5000/api` (or update `API_BASE` in `frontend/script.js`).

### Dealing with npm proxy issues
The container sets `HTTP_PROXY`/`HTTPS_PROXY`/`http_proxy`/`https_proxy` by default, which can cause `npm install` to return 403 errors when the proxy blocks registry access. The repository includes:
- A root `.npmrc` that pins the npm registry and disables strict SSL to avoid MITM-ca certificate issues.
- `./scripts/install-no-proxy.sh` which clears proxy-related environment variables and runs `npm install --no-progress` with the public npm registry.

If you continue to see 403s, try running with explicit env overrides:
```bash
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= npm_config_http_proxy= npm_config_https_proxy= \
  npm install --registry=https://registry.npmjs.org/ --no-progress
```

## API Overview
- Fleet: `GET/POST /api/fleet`, `GET/PUT/DELETE /api/fleet/:id`
- Drivers: `GET/POST /api/drivers`, `GET/PUT/DELETE /api/drivers/:id`
- Customers: `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/:id`
- Trips: `GET/POST /api/trips`, `GET/PUT/DELETE /api/trips/:id` (populated references)
- Dashboard summary: `GET /api/dashboard/summary` with optional `fromDate`, `toDate`, `driverId`, `customerId` filters
