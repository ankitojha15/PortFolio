# Ankit Ojha — Portfolio (dark minimal, static)

Static site hai — koi build step nahi. `index.html` kholo ya deploy karo. GitHub repos ko **touch nahi karta**.

## Run locally
`file://` pe JSON fetch block hota hai, isliye server se kholo:
```bash
python3 -m http.server 8000
# fir http://localhost:8000 kholo (ankit-portfolio folder se)
```

## Deploy (free, 2 min)
- **Vercel:** vercel.com → Add New Project → is folder ko drag-drop / GitHub pe naya repo `portfolio` bana ke import → auto live.
- **Netlify / GitHub Pages:** same folder upload karo, kuch build command nahi.

## ➕ Naya project add karna (1 min, site code mat chhedo)
`data/projects.json` me entry daalo:
```json
{"repo": "Naya-Repo-Name", "title": "Title", "tagline": "1 line",
 "description": "2 lines", "category": "RAG",
 "tech": ["Python", "FastAPI"], "badges": ["Live Demo"],
 "highlights": ["point 1", "point 2"],
 "demoUrl": "https://... (ho to, nahi to \"\")", "featured": false}
```
Category `categories` list me bhi add karna (filter pill ke liye).

## 🔄 GitHub auto-update kaise kaam karta hai?
- ⭐ Stars, push-date, repo link: **auto-sync** via `api.github.com` har page-load pe. GitHub pe update karo → site pe auto dikhega.
- Title/description/highlights/tech: `projects.json` se aate hai (curated case-study). GitHub README badalne se ye auto nahi badlenge — taaki site ka content stable rahe. Chaho to `description` khali chhodo → GitHub description auto use hoga.

## DSA section (abhi hidden — future scope ready)
1. `data/dsa.json` me `enabled: true` + stats + profile links bharo.
2. `app.js` me `SHOW_DSA = true` karo. Bas — nav + section auto aa jayega.

## Resume
Apna PDF `assets/resume.pdf` naam se rakho (abhi placeholder `.txt` hai). Button auto kaam karega.

## Contact details
`data/profile.json` me email/GitHub/LinkedIn/location hai. Phone add nahi kiya (tumne diya nahi) — chahiye to bata dena.
