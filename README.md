# CarGo | Velocity Auto - Luxury & High-Performance Automotive Hub

A sleek, responsive automotive portal and showcase platform featuring luxury vehicle rentals, precision auto services, performance parts, and custom detailing. Built with modern semantic HTML5, high-performance modular CSS3, and optimized vanilla JavaScript with viewport-aware lazy video loading.

---

## 🚀 Key Features & Architectural Highlights

- **Hero Experience**: Dynamic color-swapping wrap visualizer and full-bleed hero video background.
- **Optimized Video Delivery**: Dual-source media format (`.webm` & `.mp4`) with `.webp` high-compression poster fallbacks.
- **Viewport-Aware IntersectionObserver**: Videos only preload and stream when scrolled within 300px of the viewport, pausing automatically when off-screen to preserve memory and network bandwidth.
- **Interactive Bento Grid**: High-impact service showcase highlighting diagnostics, maintenance, and tuning.
- **Reactive Booking & Rental System**: Client-side interactive forms with live dynamic date validation (disallowing past dates and validating rental periods) and responsive submission states.
- **Cross-Platform Deployment Ready**: Preconfigured for GitHub Pages, Vercel, Netlify, and custom web servers (Nginx/Apache/Cloudflare Pages).

---

## 🌐 Instant Deployment Guides

### 1. Deploy to GitHub Pages (Automated Workflow)
A GitHub Actions workflow is preconfigured in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Configure production deployment"
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every push to `main` will automatically build and publish your site!

---

### 2. Deploy to Vercel (1-Click CLI or Dashboard)
The site includes a optimized [`vercel.json`](vercel.json) with caching headers and clean routing.

#### Option A: Dashboard
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your `CarGo-Portfolio` repository.
3. Leave the **Root Directory** as `./` and click **Deploy**.

#### Option B: Vercel CLI
```bash
npx vercel --prod
```

---

### 3. Deploy to Netlify
Configured via [`netlify.toml`](netlify.toml) with security headers and media asset caching.

#### Option A: Dashboard
1. Go to [app.netlify.com](https://app.netlify.com).
2. Choose **Add new site** > **Import an existing project**.
3. Select this repository and click **Deploy site**.

#### Option B: Netlify CLI
```bash
npx netlify deploy --prod --dir .
```

---

### 4. Local Preview
To preview the website locally using a static server:
```bash
# Using Node.js npx
npx serve .

# Or using Python (if installed)
python -m http.server 8080
```
Then visit `http://localhost:3000` or `http://localhost:8080` in your browser.

---

## 📁 Project Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions automated deployment
├── cargo/
│   └── index.html            # Subdirectory redirect for backward compatibility
├── services/                 # Optimized service videos & webp posters
├── app.js                    # Lazy video loader, form handlers & interactivity
├── style.css                 # Complete responsive layout & themes
├── index.html                # Main entry point (SEO & OG optimized)
├── logo.jpg                  # Site logo & favicon
├── robots.txt                # Search engine crawler directives
├── sitemap.xml               # Search engine sitemap
├── vercel.json               # Vercel routing & edge caching headers
├── netlify.toml              # Netlify build & header configuration
├── .gitignore                # Git exclusions
├── .vercelignore             # Vercel upload exclusions
└── .netlifyignore            # Netlify upload exclusions
```

---

## 🔒 Performance & Security

- **Security Headers**: Includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Edge Caching**: 1-year immutable caching (`max-age=31536000`) for video, audio, webp, and image assets.
- **Resource Hints**: DNS-prefetch and preconnect headers for Google Fonts.
