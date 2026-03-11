import { useEffect, useState } from "react";

import profileImg from "./assets/PHOTO.jpg";
import "./Portfolio.css";

const NAV = ["About", "Skills", "Projects", "Education", "Experience", "Certifications", "Resources", "Resume", "Contact"];
const API_BASE = import.meta.env.VITE_API_URL || "https://ankit-portfolio-backend-e3y6.onrender.com/";
const SKILL_COLORS = ["var(--accent)", "var(--accent2)", "var(--accent3)", "var(--accent4)"];

function SectionHeader({ n, label }) {
  return (
    <div className="sh">
      <div className="line" />
      <span className="num">{n}</span>
      <span className="label">{label}</span>
    </div>
  );
}

function SocialIcon({ name }) {
  const size = 18;
  switch (name) {
    case "github":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.38-3.37-1.38-.45-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.15-4.56-5.1 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.06.8-.23 1.66-.34 2.52-.34.86 0 1.72.12 2.52.34 1.9-1.34 2.74-1.06 2.74-1.06.56 1.42.21 2.47.1 2.73.64.72 1.03 1.64 1.03 2.77 0 3.96-2.35 4.84-4.58 5.1.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.08 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.78v2.05h.07c.66-1.25 2.29-2.57 4.71-2.57C23.4 8.46 24 11.37 24 15.17V24h-5v-7.88c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V24h-5V8.98z"/>
        </svg>
      );
    case "twitter":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.4 4.8c-.8.36-1.66.6-2.56.7a4.46 4.46 0 0 0 1.96-2.46 8.9 8.9 0 0 1-2.82 1.1 4.45 4.45 0 0 0-7.67 3.03c0 .35.04.7.12 1.02-3.7-.2-6.99-2-9.19-4.74a4.5 4.5 0 0 0-.6 2.24c0 1.54.76 2.9 1.93 3.69-.7-.02-1.37-.23-1.95-.53v.05c0 2.16 1.5 3.96 3.48 4.36-.36.1-.75.16-1.15.16-.28 0-.55-.03-.82-.08.56 1.78 2.2 3.08 4.13 3.12A8.93 8.93 0 0 1 0 19.54a12.6 12.6 0 0 0 6.83 2.03c8.2 0 12.68-7.1 12.68-13.26 0-.2 0-.4-.01-.6.87-.64 1.62-1.44 2.2-2.36z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zm5-4.25a1.25 1.25 0 1 0 1.25 1.25A1.25 1.25 0 0 0 17 5.25z"/>
        </svg>
      );
    case "youtube":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.8 15.4V8.6l6.2 3.4-6.2 3.4z"/>
        </svg>
      );
    default:
      return null;
  }
}

function CloudPanel({ photoUrl }) {
  return (
    <div className="cloud-card fade">
      <div className="cloud-chip">CLOUD READY</div>
      <img src={photoUrl || profileImg} alt="Profile" />
      <div className="ai-chip">AI OPS</div>

      
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("About");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const defaultContent = {
    photo: { url: "" },
    summary: { description: "" },
    skills: [],
    education: [],
    experience: [],
    contact: { email: "", phone: "", location: "" },
    resume: { url: "" },
    certif: [],
    resources: [],
    social: { github: "", linkedin: "", twitter: "", instagram: "", youtube: "" },
  };
  const [content, setContent] = useState(defaultContent);
  const [repos, setRepos] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sending, setSending] = useState(false);


const [sent, setSent] = useState(false);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, reposRes] = await Promise.all([
          fetch(`${API_BASE}/content`),
          fetch(`https://api.github.com/users/kmarankit/repos?sort=updated&per_page=100`),
        ]);

        if (!contentRes.ok) throw new Error("Failed to load content");
        if (!reposRes.ok) throw new Error("Failed to load repos");

        const contentData = await contentRes.json();
        const reposData = await reposRes.json();

        if (Array.isArray(contentData)) {
          const next = { ...defaultContent };
          contentData.forEach((item) => {
            if (item.section) next[item.section] = item.content;
          });
          setContent(next);
        }

        if (Array.isArray(reposData)) {
          const codeOnly = reposData.filter(repo =>
            repo.language !== null &&
            repo.fork === false &&
            !repo.name.toLowerCase().includes('pdf') &&
            !repo.name.toLowerCase().includes('notes')
          );
          setRepos(codeOnly.slice(0, 6));
        } else {
          setRepos([]);
        }
      } catch (error) {
        console.error("Portfolio data error:", error);
        setError("Unable to load portfolio data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isFilled = (obj) => Object.values(obj || {}).some(v => String(v || "").trim().length > 0);
  const visibleSections = {
    About: true,
    Skills: (content.skills || []).length > 0,
    Projects: loading || repos.length > 0,
    Education: (content.education || []).length > 0,
    Experience: (content.experience || []).length > 0,
    Certifications: (content.certif || []).length > 0,
    Resources: (content.resources || []).length > 0,
    Resume: !!content.resume?.url,
    Contact: isFilled(content.contact) || isFilled(content.social),
  };

  const visibleNav = NAV.filter((id) => visibleSections[id]);

  useEffect(() => {

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.35 }
    );

    visibleNav.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [visibleNav]);

  const go = id =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const skillGroups = (content.skills || []).reduce((acc, s) => {
    const key = s.category || "General";
    if (!acc[key]) acc[key] = [];
    const label = s.level ? `${s.name} (${s.level})` : s.name;
    acc[key].push(label);
    return acc;
  }, {});

  const skillCards = Object.keys(skillGroups).map((cat, idx) => ({
    cat,
    col: SKILL_COLORS[idx % SKILL_COLORS.length],
    items: skillGroups[cat],
  }));

  const handleContactSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.msg.trim()) {
      setSent(false);
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSent(true);
      setForm({ name: "", email: "", msg: "" });
    } catch (err) {
      console.error("Contact submit error:", err);
      setSent(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page">
      <div className="bg" />

      {/* NAVBAR */}

      <nav className="nav">
        <div className="logo">
          <span className="pulse" /> cloud.network.ai
        </div>

        <div className="nav-links">
          {visibleNav.map(l => (
            <button
              key={l}
              className={active === l ? "active" : ""}
              onClick={() => go(l)}
            >
              {l}
            </button>
          ))}
        </div>

        <button className="btn" onClick={() => go("Contact")}>
          Let's Talk
        </button>
      </nav>

      {/* HERO */}

      <section id="About"  className="section">
        <div className="hero">
          <div>
            <div className="kicker">
              Cloud Engineer - Network Architect - AI Ops
            </div>

            <h1 className="hero-title">
              Ankit <span>Kumar</span>
            </h1>

            <p className="hero-copy">
              {content.summary?.description ||
                "Add your professional summary in the admin dashboard to show it here."}
            </p>
            <div className="hero-actions">
              <button className="btn primary" onClick={() => go("Projects")}>
                View Work
              </button>

              <button className="btn" onClick={() => go("Contact")}>
                Get in Touch
              </button>
            </div>

            
          </div>

          <CloudPanel photoUrl={content.photo?.url} />
        </div>
      </section>

      

      {/* SKILLS */}
      {visibleSections.Skills && (
        <section id="Skills" className="section">
          <SectionHeader n="02" label="Skills" />

          <div className="skills-grid">
            {skillCards.map(g => (
              <div key={g.cat} className="skill-card">
                <div className="cat" style={{ color: g.col }}>
                  {g.cat}
                </div>

                {g.items.map(item => (
                  <span
                    key={item}
                    className="pill"
                    style={{ color: g.col, borderColor: g.col }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {visibleSections.Projects && (
        <section id="Projects" className="section">
          <SectionHeader n="02" label="Projects" />
          <div className="projects-grid">
            {loading && <p>Loading Projects...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && repos.length === 0 && <p>No GitHub projects found.</p>}
            {repos.map(repo => (
              <div key={repo.id} className="project-card fade">
                <div className="metric">{repo.language || "Code"}</div>
                <h3>{repo.name}</h3>
                <p>{repo.description || "No description provided."}</p>
                <div className="tags">
                  <a href={repo.html_url} target="_blank" rel="noreferrer" className="tag">Source Code</a>
                </div>
                <div className="lastUpdated">
                  Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      

      {visibleSections.Education && (
        <section id="Education" className="section">
          <SectionHeader n="04" label="Education" />

          <div className="edu">
            {(content.education || []).map((edu, idx) => (
              <div key={`${edu.degree}-${idx}`} className="edu-item">
                <div className="edu-dot" style={{ borderColor: "var(--accent2)", color: "var(--accent2)" }}>
                  {edu.degree?.slice(0, 3) || "EDU"}
                </div>

                <div className="edu-card">
                  <h4>{edu.degree}</h4>

                  <div className="meta">
                    {edu.institution}
                  </div>

                  <div className="row">
                    <span className="chip">{edu.year}</span>
                  </div>

                  {edu.skills && (
                    <div className="meta" style={{ marginTop: 8 }}>
                      Skills: {edu.skills}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {visibleSections.Experience && (
        <section id="Experience" className="section">
          <SectionHeader n="05" label="Experience" />
          <div className="edu">
            {(content.experience || []).map((exp, idx) => (
              <div key={`${exp.title}-${idx}`} className="edu-item">
                <div className="edu-dot" style={{ borderColor: "var(--accent3)", color: "var(--accent3)" }}>
                  {exp.title?.slice(0, 3) || "EXP"}
                </div>
                <div className="edu-card">
                  <h4>{exp.title}</h4>
                  <div className="meta">
                    {exp.company}
                  </div>
                  <div className="row">
                    <span className="chip">{exp.duration}</span>
                  </div>
                  {exp.responsibilities && (
                    <p style={{ marginTop: 10 }}>{exp.responsibilities}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {visibleSections.Certifications && (
        <section id="Certifications" className="section">
          <SectionHeader n="06" label="Certifications" />
          <div className="projects-grid">
            {(content.certif || []).map((c, idx) => (
              <div key={`${c.name}-${idx}`} className="project-card fade">
                <div className="metric">{c.org || "Certification"}</div>
                <h3>{c.name}</h3>
                {c.date && <p>{c.date}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* resources */}
     {visibleSections.Resources && (
       <section id="Resources" className="section">
          <SectionHeader n="07" label="Resources" />

          <div className="projects-grid">
            {(content.resources || []).map((r, idx) => (
              <div key={`${r.title}-${idx}`} className="project-card fade">
                <div className="metric">{r.type || "Resource"}</div>
                <h3>{r.title}</h3>
                {r.publication && <p>{r.publication}</p>}
                {r.identifier && <p>ID: {r.identifier}</p>}
                {r.url && (
                  <div className="tags">
                    <a href={r.url} target="_blank" rel="noreferrer" className="tag">Open</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
     )}

      {/* Resume */}
      {visibleSections.Resume && (
        <section id="Resume" className="section">
          <SectionHeader n="08" label="Resume" />

          <a className="btn primary" href={content.resume.url} target="_blank" rel="noreferrer">
            Download Resume
          </a>
        </section>
      )}
      {/* CONTACT */}

      {visibleSections.Contact && (
        <section id="Contact" className="section">
          <SectionHeader n="09" label="Contact" />

          <div className="contact">
            <div>
              <h2>Let's build something great.</h2>

              <p>
                Have a complex infrastructure challenge? I'd love to architect
                the solution together.
              </p>
              <div className="meta">
                {content.contact?.email && <div>Email: {content.contact.email}</div>}
                {content.contact?.phone && <div>Phone: {content.contact.phone}</div>}
                {content.contact?.location && <div>Location: {content.contact.location}</div>}
              </div>
              <div className="meta" style={{ marginTop: 12, display: "flex", gap: 12 }}>
                {content.social?.github && (
                  <a href={content.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" style={{ display: "inline-flex", width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}>
                    <SocialIcon name="github" />
                  </a>
                )}
                {content.social?.linkedin && (
                  <a href={content.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ display: "inline-flex", width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}>
                    <SocialIcon name="linkedin" />
                  </a>
                )}
                {content.social?.twitter && (
                  <a href={content.social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" style={{ display: "inline-flex", width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}>
                    <SocialIcon name="twitter" />
                  </a>
                )}
                {content.social?.instagram && (
                  <a href={content.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ display: "inline-flex", width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}>
                    <SocialIcon name="instagram" />
                  </a>
                )}
                {content.social?.youtube && (
                  <a href={content.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" style={{ display: "inline-flex", width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}>
                    <SocialIcon name="youtube" />
                  </a>
                )}
              </div>
            </div>

            <div className="project-card">
              <h3>Send a message</h3>

              <input
                className="input"
                placeholder="Your name"
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Email"
                value={form.email}
                onChange={e =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <textarea
                className="input"
                rows={5}
                placeholder="Message"
                value={form.msg}
                onChange={e =>
                  setForm({ ...form, msg: e.target.value })
                }
              />

              <button className="btn primary" onClick={handleContactSubmit} disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
              {sent && <p>Message sent.</p>}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}

      <footer className="footer">
        <span>(c) 2026 alex.morgan</span>
        <span>Cloud - Network - AI Operations</span>
      </footer>
    </div>
  );
}
