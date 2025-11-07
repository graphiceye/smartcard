# NFC Business Card — PWA Scaffold (Enhanced)

## What's new (added in this package)
- profile.json and admin UI to edit profile (saves to localStorage)
- Optional Firebase Realtime Database sync (see Admin and firebase-init.js)
- Improved service worker with runtime image caching
- Tailwind build pipeline files + npm scripts (build:css, dev:css)
- Capacitor config (capacitor.config.json) for mobile builds
- SVG placeholder assets included

## Quick start (development)
1. Install dependencies (requires Node.js >=16):
   - `npm install`
2. Build CSS:
   - `npm run build:css`
   - or during development: `npm run dev:css`
3. Serve locally:
   - `npm start`
   This serves the folder on `http://localhost:5000` (or use your preferred static server).
4. Open `/index.html` — the app will read `/profile.json` by default. Use `/admin.html` to edit profile and save to localStorage.

## PWA & NFC Tag setup
- Deploy this site to HTTPS (Firebase Hosting / Netlify / Vercel / Cloudflare Pages).
- Write the deployed URL (for example `https://yourdomain.com/?source=nfc`) to an NFC tag as an NDEF record of type `url`.
- When a device reads the tag it will open the URL — this will load the PWA and show the profile.

## Firebase (optional)
- To enable Firebase sync:
  1. Create a Firebase project and enable Realtime Database.
  2. Add a &lt;script&gt; snippet to `admin.html` (see example in the admin UI) that sets `window.firebaseConfig`.
  3. Keep `firebase-init.js` included (already referenced in admin.html). When you save with "Sync to Firebase" checked, admin will attempt to write to `nfc_profiles/default`.

## Capacitor (Android / iOS)
- Install Capacitor CLI: `npm install @capacitor/cli @capacitor/core --save-dev`
- Initialize (run once): `npx cap init --web-dir ./`
- Build web assets (see `npm run build:css`), then:
  - `npx cap add android`
  - `npx cap add ios`
  - `npx cap copy`
  - Open native project in Android Studio / Xcode to configure app signing, icons, and store metadata.
- Note: iOS requires additional plist configuration for NFC and universal links. Android supports adding an intent-filter for the URL you program to the NFC tag.

## Tailwind build (production)
- This scaffold includes a simple `tailwind.config.cjs` and `postcss.config.js`.
- `npm run build:css` will produce `./dist/styles.css` used by the app.
- Replace CDN approach with compiled CSS for performance.

## Notes & Next steps you can ask me to do now
- Replace placeholder SVGs with supplied brand assets (send logos/images) — I can automatically inject them.
- Implement Firebase Authentication for admin and secure profile editing.
- Add analytics (simple Google Analytics or Firebase Analytics).
- Create a Play Store / App Store-ready Capacitor build, with splash screens, icons, and store listing copy.
- Integrate a short dynamic link generator (Firebase Dynamic Links) for shareable short URLs.

