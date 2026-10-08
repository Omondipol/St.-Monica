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

# Start local development server (port 3000)
npm run dev

# Run TypeScript check
npm run lint

# Build production bundle for static hosting
npm run build
```

---

## 🎵 Key Features Included

- **Decoupled Audio Engine:** Global HTML5 audio player supporting uninterrupted playback across page navigation and modal open/close states.
- **Auto-minimizing Mini Player:** Automatically collapses into a sleek floating progress circle when scrolling down and restores upon returning to the top.
- **Authentic 40-Second Previews:** 128 kbps recordings from Khakstudio with smooth 5-second fade-outs and animated waveforms.
- **Slide-up YouTube Referral:** Prompts visitors to stream full recordings freely on the choir's YouTube channel.
- **Parish Hymnal View:** 4-tab liturgical interface (Listen, Lyrics, SATB Voices, and Score Preview).
- **Responsive & Lightweight:** Tailored for mobile data networks in Kenya and desktop viewports.
