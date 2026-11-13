# St. Monica Catholic Choir Nakuru — Official Website
### Kwaya ya Mtakatifu Monica, Section 58 Nakuru (Catholic Diocese of Nakuru)

Official web portal and liturgical music repository for St. Monica Catholic Choir, Nakuru. Features sacred choral recordings, authentic 40-second liturgical previews with real waveforms, SATB voice part practice mixer, sheet music catalog with M-Pesa integration, and bilingual (Kiswahili / English) hymn lyrics.

---

## 🚀 GitHub Deployment Instructions

This repository is pre-configured for instant deployment to **GitHub Pages** using two methods:

### Method 1: Automated Deployment via GitHub Actions (Recommended)

1. **Push this repository to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of St. Monica Choir website"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

2. **Enable GitHub Actions for Pages:**
   - Go to your repository on GitHub.
   - Click **Settings** (top navigation tab).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Source**, change the dropdown from **Deploy from a branch** to **GitHub Actions**.
   - That's it! The workflow in `.github/workflows/deploy.yml` will automatically build and publish your site on every push to `main`.

3. **Visit your live site:**
   - Once the action finishes (typically 30–60 seconds), your site will be live at:
     `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

### Method 2: Manual CLI Deployment via `gh-pages`

If you prefer to deploy directly from your terminal:

```bash
# 1. Install dependencies
npm install

# 2. Build and publish to the gh-pages branch
npm run deploy
```

Then in **Settings** > **Pages**, ensure the Source is set to **Deploy from a branch** and select the `gh-pages` branch.

---

## 🌐 Custom Domain Setup (Optional)

To connect your own domain (e.g. `www.stmonicachoirnakuru.org`):

1. In your repository on GitHub, go to **Settings** > **Pages**.
2. Under **Custom domain**, enter your domain name and click **Save**.
3. Check the **Enforce HTTPS** box once DNS propagates.
4. In your DNS provider (e.g., Cloudflare, Namecheap, GoDaddy), point an `A` record or `CNAME` record to GitHub Pages:
   - Apex domain (`A` records):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Subdomain (`CNAME` record): `<YOUR-USERNAME>.github.io`

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server (port 3000, mounts Vite + Express API)
npm run dev

# Or run the standalone Daraja backend in server/
node server/index.js

# Run TypeScript check
npm run lint

# Run automated M-Pesa STK Push tests
npm run test:mpesa

# Build production bundle for static hosting
npm run build
```

---

## 💳 M-Pesa STK Push Setup (Safaricom Daraja Sandbox)

### 1. Configure `server/.env`
```bash
cp server/.env.example server/.env
```
Fill in your Safaricom Daraja Sandbox credentials (`SANDBOX_CONSUMER_KEY`, `SANDBOX_CONSUMER_SECRET`, `SANDBOX_PASSKEY`), generate random values for `CALLBACK_TOKEN` and `ADMIN_TOKEN`, and set `MPESA_ENV=sandbox`.

### 2. Expose Local Callbacks with a Tunnel (`PUBLIC_BASE_URL`)
Safaricom Daraja sends async STK callbacks to `${PUBLIC_BASE_URL}/api/hooks/stk/${CALLBACK_TOKEN}` and requires a public HTTPS URL.

**Option A: Cloudflare Tunnel (`cloudflared`)**
```bash
cloudflared tunnel --url http://localhost:3000
# Copy the generated https://xxxx.trycloudflare.com URL into server/.env as PUBLIC_BASE_URL
```
*(If running `node server/index.js` standalone on port `3001`, point the tunnel to `http://localhost:3001`.)*

**Option B: ngrok**
```bash
ngrok http 3000
# Copy the https://xxxx.ngrok-free.app URL into server/.env as PUBLIC_BASE_URL
```

Restart the server after updating `PUBLIC_BASE_URL` so outgoing STK Push requests embed the active callback URL.

### 3. Approved Paybill Account Numbers
- `CHOIROFFER` — Choir Offering
- `UNIFORM` — Choir Uniforms
- `CHOIRTRIP` — Choir Trip
- `INSTRUMENT` — Choir Instruments
- `MEMBERSHIP` — Choir Membership

### 4. Switching to Live Production Paybill
Update `server/.env` without changing any code:
1. Set `MPESA_ENV=production`
2. Fill in `PROD_CONSUMER_KEY`, `PROD_CONSUMER_SECRET`, `PROD_SHORTCODE`, `PROD_PARTY_B`, `PROD_PASSKEY`, and `PROD_TXN_TYPE=CustomerPayBillOnline`
3. Set `PUBLIC_BASE_URL` to your production HTTPS domain and restart the server.

---

## 🎵 Key Features Included

- **Decoupled Audio Engine:** Global HTML5 audio player supporting uninterrupted playback across page navigation and modal open/close states.
- **Auto-minimizing Mini Player:** Automatically collapses into a sleek floating progress circle when scrolling down and restores upon returning to the top.
- **Authentic 40-Second Previews:** 128 kbps recordings from Khakstudio with smooth 5-second fade-outs and animated waveforms.
- **Slide-up YouTube Referral:** Prompts visitors to stream full recordings freely on the choir's YouTube channel.
- **Parish Hymnal View:** 4-tab liturgical interface (Listen, Lyrics, SATB Voices, and Score Preview).
- **Responsive & Lightweight:** Tailored for mobile data networks in Kenya and desktop viewports.
