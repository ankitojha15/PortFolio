# Ankit Ojha — Portfolio

Live: **https://ankitojha15.github.io/PortFolio/**

A dark, minimal, static portfolio. No build step, no dependencies — just open `index.html` via a local server or deploy the folder as-is.

## Run locally

Browsers block JSON `fetch` on `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

- **GitHub Pages:** repo → Settings → Pages → Branch `main`, folder `/ (root)` → Save.
- **Vercel / Netlify:** import the repo, no build command needed.

## Add a new project (1 minute, no site code changes)

Add one entry to the `projects` array in `data/projects.json`:

```json
{"repo": "Repo-Name", "title": "Title", "tagline": "One line",
 "description": "Two lines", "category": "RAG",
 "tech": ["Python", "FastAPI"], "badges": ["Live Demo"],
 "highlights": ["point 1", "point 2"],
 "demoUrl": "https://... (or empty string)", "featured": false}
```

## How GitHub auto-sync works

- ⭐ Stars, push dates and repo links sync live from `api.github.com` on every page load. Update GitHub and the site reflects it — no redeploy needed. If the API is rate-limited, the site falls back to saved data.
- Titles, descriptions, highlights and tech come from `projects.json` (curated case studies), so site copy stays stable when a repo README changes. Leave `description` empty to fall back to the GitHub repo description.

## DSA section (hidden by default, ready for later)

1. Set `enabled: true` in `data/dsa.json` and fill in your stats and profile links.
2. Set `SHOW_DSA = true` in `app.js`. The nav link and section appear automatically.

## Resume

The Resume section currently points to a request-via-email link. To offer a direct download instead, drop your PDF at `assets/resume.pdf` and link it from the Resume section in `index.html`.

## Contact details

Email, GitHub, LinkedIn and location live in `data/profile.json`. No phone number is listed.
