// ===== CONFIG: future scope toggles =====
const SHOW_DSA = false; // Set to true to enable the DSA section (also fill in data/dsa.json)
const GITHUB_USER = "ankitojha15";

let ALL_PROJECTS = [];

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error("Failed: " + path);
  return r.json();
}

// GitHub live sync: stars + push date + description fallback.
// Updates on every page load without redeploying. Falls back to saved data on rate-limit/failure.
async function syncGithub(repo) {
  try {
    const r = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}`);
    if (!r.ok) throw new Error("gh " + r.status);
    const d = await r.json();
    return {
      stars: d.stargazers_count ?? null,
      pushed: d.pushed_at ? d.pushed_at.slice(0, 10) : null,
      ghDesc: d.description || null,
      url: d.html_url,
    };
  } catch { return { stars: null, pushed: null, ghDesc: null, url: `https://github.com/${GITHUB_USER}/${repo}` }; }
}

function projCard(p, gh) {
  const stars = gh.stars !== null ? `⭐ ${gh.stars}` : "⭐ —";
  const pushed = gh.pushed ? `<span class="push">pushed ${gh.pushed}</span>` : "";
  const desc = p.description || gh.ghDesc || "";
  const demo = p.demoUrl
    ? `<a href="${p.demoUrl}" target="_blank" rel="noopener">Live Demo ↗</a>` : "";
  return `<article class="proj ${p.featured ? "feat" : ""} reveal show">
    <div class="proj-top"><div class="badges">${(p.badges || []).map(b => `<span>${b}</span>`).join("")}</div><span class="stars">${stars}</span></div>
    <h3>${p.title}</h3><p class="tag">${p.tagline || ""}</p>
    <p class="desc">${desc}</p>
    <ul>${(p.highlights || []).map(h => `<li>${h}</li>`).join("")}</ul>
    <div class="tech">${(p.tech || []).map(t => `<span>${t}</span>`).join("")}</div>
    <div class="proj-links"><a href="${gh.url}" target="_blank" rel="noopener">GitHub ↗</a>${demo}</div>
    ${pushed}
  </article>`;
}

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = ALL_PROJECTS.map(p => projCard(p.p, p.gh)).join("");
}

async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  const status = document.getElementById("syncStatus");

  try {
    const [profile, pdata, dsadata] = await Promise.all([
      loadJSON("data/profile.json"), loadJSON("data/projects.json"), loadJSON("data/dsa.json").catch(() => null),
    ]);

    // Hero + about + contact
    document.getElementById("navName").textContent = profile.name.split(" ").slice(0, 2).join(" ");
    document.getElementById("heroName").textContent = profile.name;
    document.getElementById("heroRole").textContent = profile.role;
    document.getElementById("heroTagline").textContent = profile.tagline;
    document.getElementById("availability").textContent = profile.availability;
    document.getElementById("aboutBio").textContent = profile.bio;
    document.getElementById("footName").textContent = profile.name;
    document.getElementById("navGithub").href = profile.github;
    document.getElementById("moreGithub").href = `${profile.github}?tab=repositories`;
    // Resume download: enabled only when assets/resume.pdf exists in the repo.
    try {
      const rr = await fetch("assets/resume.pdf", { method: "HEAD" });
      if (!rr.ok) throw new Error("no resume yet");
    } catch {
      const rb = document.getElementById("resumeBtn");
      rb.removeAttribute("href");
      rb.removeAttribute("download");
      rb.textContent = "Resume coming soon";
      rb.classList.add("is-disabled");
      document.getElementById("resumeNote").textContent =
        "Resume is being updated — use the contact form below and I'll send it over.";
    }
    document.getElementById("heroMeta").innerHTML =
      `<a class="chip" href="${profile.github}" target="_blank" rel="noopener">GitHub ↗</a>
       <a class="chip" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
       <a class="chip" href="mailto:${profile.email}">✉️ ${profile.email}</a>
       <span class="chip">📍 ${profile.location}</span>`;
    document.getElementById("contactCards").innerHTML =
      `<div class="card"><h3>✉️ Email</h3><p><a href="mailto:${profile.email}">${profile.email}</a></p></div>
       <div class="card"><h3>💼 LinkedIn</h3><p><a href="${profile.linkedin}" target="_blank" rel="noopener">linkedin.com/in/ankitojha15</a></p></div>
       <div class="card"><h3>🐙 GitHub</h3><p><a href="${profile.github}" target="_blank" rel="noopener">github.com/${profile.githubUsername}</a></p></div>`;
    document.getElementById("contactForm").addEventListener("submit", e => {
      e.preventDefault();
      const n = document.getElementById("cfName").value.trim();
      const from = document.getElementById("cfEmail").value.trim();
      const m = document.getElementById("cfMsg").value.trim();
      const body = `Name: ${n}\nEmail: ${from}\n\n${m}`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Opportunity for " + profile.name + " — from " + n)}&body=${encodeURIComponent(body)}`;
    });

    // Skills (groups come from data/dsa.json, synced with the resume)
    const skills = dsadata || {};
    const groups = skills.skillGroups || [
      { title: "🤖 AI / LLM", items: skills.ai || [] },
      { title: "🔧 Backend & Data", items: skills.backend || [] },
      { title: "💻 Languages", items: skills.languages || [] },
    ];
    document.getElementById("skillsGrid").innerHTML = groups
      .map(g => `<div class="card"><h3>${g.title}</h3><p>${(g.items || []).join(" · ")}</p></div>`)
      .join("");

    // DSA future scope
    if (SHOW_DSA && dsadata && dsadata.enabled !== false) {
      document.getElementById("dsa").hidden = false;
      document.getElementById("navDsa").hidden = false;
      const s = dsadata.stats || {};
      document.getElementById("dsaStats").innerHTML =
        `<div><b>${s.totalSolved ?? 0}</b>Total</div><div><b>${s.easy ?? 0}</b>Easy</div><div><b>${s.medium ?? 0}</b>Medium</div><div><b>${s.hard ?? 0}</b>Hard</div>`;
      document.getElementById("dsaLinks").innerHTML = (dsadata.profiles || [])
        .filter(p => p.url).map(p => `<a class="chip" href="${p.url}" target="_blank" rel="noopener"><b>${p.label}</b> ↗</a>`).join("")
        || `<span class="chip">Add your profile links in data/dsa.json</span>`;
    }

    // Projects + GitHub auto-sync
    status.textContent = "Syncing live data from GitHub…";
    const enriched = await Promise.all((pdata.projects || []).map(async p => ({ p, gh: await syncGithub(p.repo) })));
    const liveCount = enriched.filter(e => e.gh.stars !== null).length;
    ALL_PROJECTS = enriched;
    renderProjects();
    status.textContent = liveCount > 0
      ? `Live from GitHub (${liveCount}/${enriched.length} synced)`
      : "Showing saved data — GitHub API is busy right now";
    status.className = "sync " + (liveCount > 0 ? "ok" : "warn");

    // Reveal animation
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("show")), { threshold: .1 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } catch (err) {
    status.textContent = "Could not load site data — please serve over HTTP (e.g. python3 -m http.server) instead of file://";
    status.className = "sync warn";
    console.error(err);
  }
}
init();
