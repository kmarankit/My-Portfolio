import { useEffect, useState, useRef, useCallback } from "react";
import profileImg from "./assets/PHOTO.jpg";
import "./Portfolio.css";

const NAV = ["About","Skills","Projects","Education","Experience","Research","Certifications","Resources","Resume","Contact"];
const API_BASE = (import.meta.env?.VITE_API_URL || "https://ankit-portfolio-backend-e3y6.onrender.com").replace(/\/+$/, "");
const SKILL_COLOR_COUNT = 6;
const TAG_COLOR_COUNT = 6;

const parseCommaList = v => String(v||'').split(',').map(s=>s.trim()).filter(Boolean);
const formatEduRange = edu => {
  const s = edu?.startDate||edu?.start||edu?.from||"";
  const e = edu?.endDate||edu?.end||edu?.to||"";
  if(s||e) return `${s}${e?` — ${e}`:" — Present"}`;
  return edu?.year||"";
};

/* ── Social Icon ──────────────────────────────────────────────────── */
function SocialIcon({ name }) {
  const s = 16;
  const icons = {
    github: <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.38-3.37-1.38-.45-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.15-4.56-5.1 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.06.8-.23 1.66-.34 2.52-.34.86 0 1.72.12 2.52.34 1.9-1.34 2.74-1.06 2.74-1.06.56 1.42.21 2.47.1 2.73.64.72 1.03 1.64 1.03 2.77 0 3.96-2.35 4.84-4.58 5.1.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>,
    linkedin: <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.08 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.78v2.05h.07c.66-1.25 2.29-2.57 4.71-2.57C23.4 8.46 24 11.37 24 15.17V24h-5v-7.88c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V24h-5V8.98z"/>,
    twitter: <path d="M23.4 4.8c-.8.36-1.66.6-2.56.7a4.46 4.46 0 0 0 1.96-2.46 8.9 8.9 0 0 1-2.82 1.1 4.45 4.45 0 0 0-7.67 3.03c0 .35.04.7.12 1.02-3.7-.2-6.99-2-9.19-4.74a4.5 4.5 0 0 0-.6 2.24c0 1.54.76 2.9 1.93 3.69-.7-.02-1.37-.23-1.95-.53v.05c0 2.16 1.5 3.96 3.48 4.36-.36.1-.75.16-1.15.16-.28 0-.55-.03-.82-.08.56 1.78 2.2 3.08 4.13 3.12A8.93 8.93 0 0 1 0 19.54a12.6 12.6 0 0 0 6.83 2.03c8.2 0 12.68-7.1 12.68-13.26 0-.2 0-.4-.01-.6.87-.64 1.62-1.44 2.2-2.36z"/>,
    instagram: <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zm5-4.25a1.25 1.25 0 1 0 1.25 1.25A1.25 1.25 0 0 0 17 5.25z"/>,
    youtube: <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.8 15.4V8.6l6.2 3.4-6.2 3.4z"/>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">{icons[name]}</svg>;
}

/* ── Section Header ───────────────────────────────────────────────── */
function SH({ n, label }) {
  return (
    <div className="sh">
      <span className="sh-num">{n}</span>
      <div className="sh-bar" />
      <span className="sh-label">{label}</span>
    </div>
  );
}

/* ── Main Portfolio ───────────────────────────────────────────────── */
export default function Portfolio() {
  const [active, setActive] = useState("About");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [resourceRepos, setResourceRepos] = useState([]);
  const [form, setForm] = useState({ name:"", email:"", msg:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [heroStats, setHeroStats] = useState([
    {label:"Projects",value:"—"},{label:"Skills",value:"—"},
    {label:"Certs",value:"—"},{label:"Papers",value:"—"},
  ]);
  const defaultContent = {
    photo:{url:""},summary:{description:""},skills:[],education:[],
    experience:[],research:[],contact:{email:"",phone:"",location:""},
    resume:{url:""},certif:[],resources:[],
    social:{github:"",linkedin:"",twitter:"",instagram:"",youtube:""},
  };
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const load = async () => {
      try {
        const ghHeaders = { Accept:"application/vnd.github+json" };
        const ghToken = import.meta.env?.VITE_GITHUB_TOKEN;
        if(ghToken) ghHeaders.Authorization = `Bearer ${ghToken}`;

        const [contentRes, reposRes] = await Promise.allSettled([
          fetch(`${API_BASE}/content`),
          fetch(`https://api.github.com/users/kmarankit/repos?sort=updated&per_page=100`),
        ]);

        if(contentRes.status==="fulfilled" && contentRes.value.ok) {
          const data = await contentRes.value.json();
          if(Array.isArray(data)) {
            const next = {...defaultContent};
            data.forEach(item => {
              if(!item.section) return;
              if(item.section==="resources" && Array.isArray(item.content)) {
                const ri = item.content.filter(x=>String(x?.type||"").toLowerCase()==="research");
                if(ri.length>0 && (next.research||[]).length===0)
                  next.research = ri.map(r=>({title:r.title||r.name||"",conference:r.publication||r.conference||"",paperId:r.identifier||r.paperId||"",description:r.description||"",teachers:r.teachers||""}));
                return;
              }
              next[item.section] = item.content;
            });
            setContent(next);
          }
        }

        let reposData = [];
        if(reposRes.status==="fulfilled" && reposRes.value.ok) {
          const parsed = await reposRes.value.json();
          if(Array.isArray(parsed)) {
            reposData = parsed;
            setRepos(reposData.filter(r=>r.language!==null&&!r.fork&&!r.name.toLowerCase().includes('pdf')&&!r.name.toLowerCase().includes('notes')).slice(0,6));
          }
        }

        // Resource files
        const resourceFiles = [];
        const seen = new Set();
        const collectFromRepo = async repo => {
          const branch = repo.default_branch||"main";
          const tr = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/git/trees/${branch}?recursive=1`,{headers:ghHeaders});
          if(!tr.ok) return;
          const td = await tr.json();
          (td.tree||[]).forEach(item => {
            if(item.type!=="blob"||!item.path) return;
            const low = item.path.toLowerCase();
            const isPdf = low.endsWith(".pdf");
            const isNotes = low.includes("notes")&&(low.endsWith(".md")||low.endsWith(".txt"));
            if(!isPdf&&!isNotes) return;
            const url = `https://github.com/${repo.owner.login}/${repo.name}/blob/${branch}/${item.path}`;
            if(!seen.has(url)){seen.add(url);resourceFiles.push({id:item.sha||url,name:item.path.split("/").pop()||"Document",html_url:url,repo:repo.name,kind:isPdf?"PDF":"Notes"});}
          });
        };
        const candidates = reposData.filter(r=>!r.fork&&r.name.toLowerCase()==="networking-theroy");
        await Promise.allSettled(candidates.map(collectFromRepo));
        setResourceRepos(resourceFiles);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    setHeroStats([
      {label:"Projects",value:loading?"—":repos.length},
      {label:"Skills",value:loading?"—":(content.skills||[]).length},
      {label:"Certs",value:loading?"—":(content.certif||[]).length},
      {label:"Papers",value:loading?"—":(content.research||[]).length},
    ]);
  }, [loading, repos, content]);

  const isFilled = obj => Object.values(obj||{}).some(v=>String(v||"").trim().length>0);
  const resumeUrl = content.resume?.url || "";
  const normalizedResumeUrl = resumeUrl.includes("/image/upload/")
    ? resumeUrl.replace("/image/upload/", "/image/upload/fl_attachment/")
    : resumeUrl;
  const vis = {
    About:true,
    Skills:(content.skills||[]).length>0,
    Projects:loading||repos.length>0,
    Education:(content.education||[]).length>0,
    Experience:(content.experience||[]).length>0,
    Research:true,
    Certifications:(content.certif||[]).length>0,
    Resources:true,
    Resume:!!content.resume?.url,
    Contact:isFilled(content.contact)||isFilled(content.social),
  };
  const visibleNav = NAV.filter(id=>vis[id]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      {threshold:0.3, rootMargin:"-64px 0px 0px 0px"}
    );
    visibleNav.forEach(id => { const el=document.getElementById(id); if(el) obs.observe(el); });
    return () => obs.disconnect();
  }, [visibleNav.join(",")]);

  const go = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setDrawerOpen(false); };

  const skillGroups = (content.skills||[]).reduce((acc,s)=>{
    const k=s.category||"General"; if(!acc[k]) acc[k]=[];
    acc[k].push({name:s.name,level:s.level}); return acc;
  },{});

  const handleContact = async () => {
    if(!form.name.trim()||!form.email.trim()||!form.msg.trim()) return;
    setSending(true);
    try {
      const r = await fetch(`${API_BASE}/contact`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(!r.ok) throw new Error();
      setSent(true); setForm({name:"",email:"",msg:""});
    } catch { setSent(false); } finally { setSending(false); }
  };

  const handleResumeClick = () => {
    if (window.gtag) {
      window.gtag("event", "resume_download", {
        event_category: "engagement",
        event_label: "resume",
        value: 1,
      });
    }
  };

  return (
    <>
      {/* Orbs */}
      <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>

      {/* Navbar */}
      <nav className="nav">
        <div className="nav-logo">
          <span className="nav-logo-dot"/>
          cloud.network.ai
        </div>
        <div className="nav-links">
          {visibleNav.map(l=>(
            <button key={l} className={active===l?"active":""} onClick={()=>go(l)}>{l}</button>
          ))}
        </div>
        <button className="nav-cta" onClick={()=>go("Contact")}>Let's Talk</button>
        <button className="hamburger" onClick={()=>setDrawerOpen(true)} aria-label="Open menu">
          <span/><span/><span/>
        </button>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && <div className="mob-overlay" onClick={()=>setDrawerOpen(false)}/>}
      <div className={`mob-drawer${drawerOpen?" open":""}`}>
        <button className="mob-close" onClick={()=>setDrawerOpen(false)}>✕</button>
        {visibleNav.map(l=>(
          <button key={l} className={active===l?"active":""} onClick={()=>go(l)}>{l}</button>
        ))}
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section id="About">
        <div className="hero">
          <div className="hero-left fade-up">
            <div className="hero-kicker">
              <span>⚡</span> Cloud Engineer · Network Architect · AI Ops
            </div>
            <h1 className="hero-title">
              Ankit<br/><span>Kumar</span>
            </h1>
            <p className="hero-copy">
              {content.summary?.description || (loading ? "Loading…" : "Building systems that scale — from bare-metal networks to cloud-native AI pipelines.")}
            </p>
            <div className="hero-badges">
              {["Systems at scale","Automation first","Reliable by design","Zero-downtime ops"].map(b=>(
                <span key={b} className="hero-badge">{b}</span>
              ))}
            </div>
            <div className="hero-btns">
              <button className="btn-primary" onClick={()=>go("Projects")}>View Work →</button>
              <button className="btn-outline" onClick={()=>go("Resume")}>Resume</button>
            </div>
            <div className="hero-stats">
              {heroStats.map(s=>(
                <div key={s.label} className="hero-stat">
                  <div className="hero-stat-val">{s.value}</div>
                  <div className="hero-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="profile-wrap">
              <div className="profile-card">
                <img src={content.photo?.url || profileImg} alt="Ankit Kumar" onError={e=>{e.target.src=profileImg}}/>
                <span className="profile-chip chip-cloud">Cloud Ready</span>
                <span className="profile-chip chip-ai">AI Ops</span>
                <div className="profile-status">
                  <div className="status-row"><span>Location</span><strong>{content.contact?.location||"Remote / Hybrid"}</strong></div>
                  <div className="status-row"><span>Focus</span><strong>Cloud · Network · AI</strong></div>
                  <div className="status-row"><span>Status</span><strong className="status-open">● Open to impact</strong></div>
                </div>
              </div>
              <div className="profile-floating">
                <div className="floating-label">GitHub Repos</div>
                <div className="floating-val">{repos.length||"—"}</div>
                <div className="floating-sub">Active Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────────── */}
      {vis.Skills && (
        <div className="section">
          <section id="Skills">
            <SH n="02" label="Skills"/>
            <div className="skills-grid">
              {Object.keys(skillGroups).map((cat,ci)=>{
                const colClass = `col-${ci % SKILL_COLOR_COUNT}`;
                return (
                  <div key={cat} className={`skill-card ${colClass}`}>
                    <div className={`skill-cat ${colClass}`}>{cat}</div>
                    <div className="skill-pills">
                      {skillGroups[cat].map((sk,si)=>(
                        <span key={si} className={`skill-pill ${colClass}`}>
                          {sk.name}{sk.level?` · ${sk.level}`:""}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ── PROJECTS ─────────────────────────────────────────────── */}
      {vis.Projects && (
        <div className="section">
          <section id="Projects">
            <SH n="03" label="Projects from GitHub"/>
            {loading && <p className="muted-text">Loading projects…</p>}
            {!loading && repos.length===0 && <p className="muted-text">No projects found.</p>}
            <div className="projects-grid">
              {repos.map(r=>(
                <div key={r.id} className="project-card fade-up">
                  {r.language && <div className="project-lang">{r.language}</div>}
                  <div className="project-title">{r.name.replace(/-/g," ")}</div>
                  <div className="project-desc">{r.description||"No description provided."}</div>
                  <div className="project-footer">
                    <span className="project-date">{new Date(r.updated_at).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span>
                    <a href={r.html_url} target="_blank" rel="noreferrer" className="project-link">Source →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── EDUCATION ────────────────────────────────────────────── */}
      {vis.Education && (
        <div className="section">
          <section id="Education">
            <SH n="04" label="Education"/>
            <div className="timeline">
              {(content.education||[]).map((edu,i)=>(
                <div key={i} className="tl-item">
                  <div className="tl-left">
                    <div className="tl-date">{formatEduRange(edu)}</div>
                  </div>
                  <div className="tl-line"/>
                  <div className="tl-dot tl-dot-edu">{edu.degree?.slice(0,2)||"ED"}</div>
                  <div className="tl-right">
                    <div className="tl-card">
                      <div className="tl-title">{edu.degree}</div>
                      <div className="tl-sub">{edu.institution}</div>
                      {edu.skills && (
                        <div className="tl-chips">
                          {parseCommaList(edu.skills).map((sk,si)=>(
                            <span key={si} className={`tl-chip tag-${si % TAG_COLOR_COUNT}`}>{sk}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── EXPERIENCE ───────────────────────────────────────────── */}
      {vis.Experience && (
        <div className="section">
          <section id="Experience">
            <SH n="05" label="Experience"/>
            <div className="timeline">
              {(content.experience||[]).map((exp,i)=>(
                <div key={i} className="tl-item">
                  <div className="tl-left">
                    <div className="tl-date">{exp.duration}</div>
                  </div>
                  <div className="tl-line"/>
                  <div className="tl-dot tl-dot-exp">{exp.title?.slice(0,2)||"EX"}</div>
                  <div className="tl-right">
                    <div className="tl-card">
                      <div className="tl-title">{exp.title}</div>
                      <div className="tl-sub">{exp.company}</div>
                      {exp.responsibilities && <p className="exp-notes">{exp.responsibilities}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── RESEARCH ─────────────────────────────────────────────── */}
      {vis.Research && (
        <div className="section">
          <section id="Research">
            <SH n="06" label="Research"/>
            {(content.research||[]).length===0 && <p className="muted-text">No research papers added yet.</p>}
            <div className="research-grid">
              {(content.research||[]).map((r,i)=>(
                <div key={i} className="research-card fade-up">
                  <div className="research-tag">Research Paper</div>
                  <div className="research-title">{r.title}</div>
                  {r.paperId && <div className="research-id">ID: {r.paperId}</div>}
                  {r.description && <div className="research-desc">{r.description}</div>}
                  <div className="research-meta">
                    {r.conference && <span className="research-chip">{r.conference}</span>}
                    {r.teachers && <span className="research-chip">Mentors: {r.teachers}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── CERTIFICATIONS ───────────────────────────────────────── */}
      {vis.Certifications && (
        <div className="section">
          <section id="Certifications">
            <SH n="07" label="Certifications"/>
            <div className="certs-grid">
              {(content.certif||[]).map((c,i)=>(
                <div key={i} className="cert-card">
                  <div className="cert-icon">🏆</div>
                  <div>
                    <div className="cert-org">{c.org||"Certification"}</div>
                    <div className="cert-name">{c.name}</div>
                    {c.date && <div className="cert-date">{c.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── RESOURCES ────────────────────────────────────────────── */}
      {vis.Resources && (
        <div className="section">
          <section id="Resources">
            <SH n="08" label="Resources"/>
            {loading && <p className="muted-text">Loading resources…</p>}
            {!loading && resourceRepos.length===0 && <p className="muted-text">No PDFs or Notes found on GitHub.</p>}
            <div className="resources-grid">
              {resourceRepos.map(res=>(
                <div key={res.id} className="resource-card">
                  <div className={`resource-kind ${res.kind==="PDF"?"kind-pdf":"kind-notes"}`}>{res.kind}</div>
                  <div>
                    <div className="resource-name">{res.name.replace(/-/g," ")}</div>
                    {res.repo && <div className="resource-repo">Repo: {res.repo}</div>}
                    <a href={res.html_url} target="_blank" rel="noreferrer" className="resource-link">View on GitHub →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── RESUME ───────────────────────────────────────────────── */}
      {vis.Resume && (
        <div className="resume-wrap">
          <section id="Resume">
            <SH n="09" label="Resume"/>
            <div className="resume-card">
              <div className="resume-icon">📄</div>
              <div className="resume-title">My Resume</div>
              <div className="resume-sub">Download my complete resume to learn more about my background, skills, and experience.</div>
              <a className="btn-primary resume-link" href={normalizedResumeUrl} target="_blank" rel="noreferrer" onClick={handleResumeClick} download>
                Download Resume ↓
              </a>
            </div>
          </section>
        </div>
      )}

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      {vis.Contact && (
        <div className="section">
          <section id="Contact">
            <SH n="10" label="Contact"/>
            <div className="contact-grid">
              <div>
                <h2 className="contact-info-title">Let's build something remarkable.</h2>
                <p className="contact-info-sub">Have a complex infrastructure challenge? I'd love to architect the solution together. Reach out and let's make it happen.</p>
                {content.contact?.email && <div className="contact-detail-row"><span className="contact-detail-label">Email</span><span className="contact-detail-val">{content.contact.email}</span></div>}
                {content.contact?.phone && <div className="contact-detail-row"><span className="contact-detail-label">Phone</span><span className="contact-detail-val">{content.contact.phone}</span></div>}
                {content.contact?.location && <div className="contact-detail-row"><span className="contact-detail-label">Location</span><span className="contact-detail-val">{content.contact.location}</span></div>}
                <div className="socials">
                  {["github","linkedin","twitter","instagram","youtube"].map(s=>(
                    content.social?.[s] && (
                      <a key={s} href={content.social[s]} target="_blank" rel="noreferrer" aria-label={s} className="social-btn">
                        <SocialIcon name={s}/>
                      </a>
                    )
                  ))}
                </div>
              </div>
              <div className="contact-form">
                <h3>Send a message</h3>
                <input className="form-input" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                <input className="form-input" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                <textarea className="form-input" placeholder="Your message…" rows={5} value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}/>
                <button className="form-submit" onClick={handleContact} disabled={sending}>
                  {sending?"Sending…":"Send Message →"}
                </button>
                {sent && <div className="sent-msg">✓ Message sent successfully!</div>}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="footer">
        <span className="footer-copy">© 2026 Ankit Kumar — All rights reserved</span>
        <span className="footer-tag">Cloud · Network · AI Operations</span>
      </footer>
    </>
  );
}
