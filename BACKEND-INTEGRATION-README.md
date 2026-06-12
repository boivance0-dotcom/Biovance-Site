# Biovance Site + Backend — Integration Notes

The backend platform is now a **separate page** inside your real React site. Same stack (Vite + React + TS + Tailwind + shadcn + recharts + lucide-react), so it builds and deploys to Cloudflare exactly like before.

## What changed (4 things)

1. **New page:** `src/pages/Backend.tsx` — the full platform dashboard (11 sections: Live Dashboard, Data Pipeline, Satellite Feeds, Live Safari, Field Sync, Discovery, Collaboration, Intelligence, Permissions & Audit, Tech Stack, Infrastructure Cost). Built entirely with your design tokens (`bg-card`, `text-foreground`, `border-border`, `text-primary`, etc.) and recharts.

2. **Router** (`src/App.tsx`): added `import Backend` + `<Route path="/backend" element={<Backend />} />`. The global `<Navbar/>` is hidden on `/backend` (it renders its own full-screen shell), the same way it's already hidden on `/search`.

3. **Entry point** (`src/pages/Index.tsx`): a "Enter Platform Backend →" button after the feature carousel on the home page, linking to `/backend`.

4. **Logo asset:** `public/logo.jpeg` — shown in the backend sidebar. It fails gracefully (hides) if missing.

## Run / build (unchanged)

```bash
npm install
npm run dev        # local: http://localhost:8080/backend
npm run build      # production — same vite build that already deploys
```

## Deploy

Push to your `Biovance-site` repo and Cloudflare auto-builds with `npm run build` → `dist/`, exactly as in your last deploy log. No config changes needed.

```bash
git add .
git commit -m "Add backend platform as separate /backend page"
git push
```

Then visit `your-site.pages.dev/backend` — or click the new button on the home page.

## Note on routing (SPA)

`/backend` is a client-side route. Direct hits already work on Cloudflare Pages because your project serves `index.html` for unknown paths (your `/search` deep routes prove this). If you ever see a 404 on a hard refresh of `/backend`, add a `public/_redirects` file with: `/*  /index.html  200`.

## Build safety verified

- No dynamic Tailwind class names (all class strings are static literals, so JIT keeps them)
- Braces / parens / brackets / template literals all balanced
- `tsconfig` is non-strict and `build` is `vite build` (esbuild transpile, no type-check) — same as your working deploy
- Only standard lucide-react icons + recharts components you already depend on
