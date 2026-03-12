import { useEffect, useState, useRef, useCallback } from "react";
import profileImg from "./assets/PHOTO.jpg";

const NAV = ["About","Skills","Projects","Education","Experience","Research","Certifications","Resources","Resume","Contact"];
const API_BASE = (import.meta.env?.VITE_API_URL || "https://ankit-portfolio-backend-e3y6.onrender.com").replace(/\/+$/, "");
const SKILL_COLORS = ["#00e5cc","#f59e0b","#a78bfa","#f472b6","#34d399","#60a5fa"];
const TAG_COLORS   = ["#00e5cc","#f59e0b","#a78bfa","#f472b6","#34d399","#60a5fa"];

const parseCommaList = v => String(v||'').split(',').map(s=>s.trim()).filter(Boolean);
const formatEduRange = edu => {
  const s = edu?.startDate||edu?.start||edu?.from||"";
  const e = edu?.endDate||edu?.end||edu?.to||"";
  if(s||e) return `${s}${e?` — ${e}`:" — Present"}`;
  return edu?.year||"";
};

/* ── Fonts ─────────────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');`}</style>
);

/* ── Global CSS ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#060810;
      --surface:#0d1117;
      --surface2:#111827;
      --border:rgba(255,255,255,0.07);
      --teal:#00e5cc;
      --amber:#f59e0b;
      --violet:#a78bfa;
      --pink:#f472b6;
      --text:#f0f4ff;
      --muted:#8892a4;
      --card:rgba(17,24,39,0.8);
    }
    html{scroll-behavior:smooth;font-size:16px}
    body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;overflow-x:hidden;line-height:1.6}
    ::selection{background:rgba(0,229,204,0.25);color:#fff}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:var(--bg)}
    ::-webkit-scrollbar-thumb{background:var(--teal);border-radius:2px}
    a{color:inherit;text-decoration:none}
    img{max-width:100%;display:block}
    button{cursor:pointer;font-family:inherit;border:none;background:none}

    /* noise overlay */
    body::before{
      content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      opacity:0.4;
    }

    /* Gradient orbs */
    .orb{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(120px);opacity:0.15}
    .orb-1{width:600px;height:600px;background:radial-gradient(circle,#00e5cc,transparent);top:-100px;right:-150px;animation:drift1 20s ease-in-out infinite}
    .orb-2{width:500px;height:500px;background:radial-gradient(circle,#a78bfa,transparent);bottom:200px;left:-200px;animation:drift2 25s ease-in-out infinite}
    .orb-3{width:400px;height:400px;background:radial-gradient(circle,#f59e0b,transparent);top:60%;right:10%;animation:drift3 18s ease-in-out infinite}

    @keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(-60px,80px)}}
    @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(80px,-60px)}}
    @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,50px)}}

    /* NAVBAR */
    .nav{
      position:fixed;top:0;left:0;right:0;z-index:100;
      padding:0 max(24px,5vw);height:64px;
      display:flex;align-items:center;justify-content:space-between;
      background:rgba(6,8,16,0.7);
      backdrop-filter:blur(20px) saturate(180%);
      border-bottom:1px solid var(--border);
    }
    .nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.12em;color:var(--text);display:flex;align-items:center;gap:8px}
    .nav-logo-dot{width:8px;height:8px;border-radius:50%;background:var(--teal);box-shadow:0 0 12px var(--teal);animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    .nav-links{display:flex;gap:2px;align-items:center}
    .nav-links button{
      font-family:'Outfit',sans-serif;font-size:0.8rem;font-weight:500;
      color:var(--muted);padding:6px 12px;border-radius:6px;
      transition:all 0.2s;letter-spacing:0.04em;text-transform:uppercase;
    }
    .nav-links button:hover{color:var(--text);background:rgba(255,255,255,0.05)}
    .nav-links button.active{color:var(--teal);background:rgba(0,229,204,0.08)}
    .nav-cta{
      font-family:'Outfit',sans-serif;font-size:0.8rem;font-weight:600;
      background:var(--teal);color:#060810;padding:8px 20px;border-radius:8px;
      letter-spacing:0.06em;text-transform:uppercase;
      transition:all 0.2s;box-shadow:0 0 20px rgba(0,229,204,0.3);
    }
    .nav-cta:hover{transform:translateY(-1px);box-shadow:0 4px 28px rgba(0,229,204,0.5)}

    /* HAMBURGER */
    .hamburger{display:none;flex-direction:column;gap:5px;padding:8px;width:40px;height:40px;justify-content:center;align-items:center;border-radius:8px;background:rgba(255,255,255,0.05)}
    .hamburger span{display:block;height:2px;background:var(--text);border-radius:1px;transition:all 0.3s}
    .hamburger span:nth-child(1){width:20px}
    .hamburger span:nth-child(2){width:14px}
    .hamburger span:nth-child(3){width:17px}

    /* MOBILE DRAWER */
    .mob-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px)}
    .mob-drawer{
      position:fixed;top:0;right:0;bottom:0;z-index:201;width:260px;
      background:var(--surface);border-left:1px solid var(--border);
      padding:80px 24px 40px;display:flex;flex-direction:column;gap:4px;
      transform:translateX(100%);transition:transform 0.35s cubic-bezier(.4,0,.2,1);
    }
    .mob-drawer.open{transform:translateX(0)}
    .mob-drawer button{
      font-size:1rem;font-weight:500;color:var(--muted);padding:12px 16px;
      border-radius:8px;text-align:left;transition:all 0.2s;
    }
    .mob-drawer button:hover,.mob-drawer button.active{color:var(--teal);background:rgba(0,229,204,0.06)}
    .mob-close{position:absolute;top:18px;right:18px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(255,255,255,0.06);color:var(--muted);font-size:18px}

    /* SECTION */
    .section{
      position:relative;z-index:1;
      padding:56px max(24px,6vw) 40px;
      max-width:1200px;margin:0 auto;
    }
    .section-first{padding-top:56px}

    /* SECTION HEADER */
    .sh{display:flex;align-items:center;gap:16px;margin-bottom:28px}
    .sh-num{font-family:'DM Mono',monospace;font-size:0.75rem;color:var(--teal);letter-spacing:0.1em;opacity:0.7}
    .sh-bar{flex:1;height:1px;background:linear-gradient(90deg,var(--teal),transparent);opacity:0.3}
    .sh-label{
      font-family:'Syne',sans-serif;font-size:clamp(1.4rem,3vw,2rem);
      font-weight:800;color:var(--text);letter-spacing:-0.02em;
    }

    /* HERO */
    .hero{
      min-height:auto;
      display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;
      padding:80px max(24px,6vw) 40px;max-width:1200px;margin:0 auto;
    }
    .hero-kicker{
      display:inline-flex;align-items:center;gap:8px;
      font-family:'DM Mono',monospace;font-size:0.75rem;letter-spacing:0.12em;
      color:var(--teal);text-transform:uppercase;margin-bottom:14px;
      padding:5px 12px;border:1px solid rgba(0,229,204,0.25);border-radius:4px;
      background:rgba(0,229,204,0.05);
    }
    .hero-title{
      font-family:'Syne',sans-serif;
      font-size:clamp(2.4rem,5.5vw,4.2rem);
      font-weight:800;line-height:1;letter-spacing:-0.03em;
      color:var(--text);margin-bottom:14px;
    }
    .hero-title span{
      display:block;
      background:linear-gradient(120deg,var(--teal) 0%,#7de8ff 50%,var(--violet) 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    }
    .hero-copy{font-size:0.95rem;color:var(--muted);line-height:1.65;margin-bottom:16px;max-width:480px}
    .hero-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
    .hero-badge{
      font-family:'DM Mono',monospace;font-size:0.68rem;letter-spacing:0.07em;
      color:var(--muted);padding:4px 10px;border-radius:3px;
      border:1px solid var(--border);background:rgba(255,255,255,0.02);
    }
    .hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
    .btn-primary{
      font-weight:600;font-size:0.88rem;letter-spacing:0.06em;text-transform:uppercase;
      background:var(--teal);color:#060810;padding:12px 28px;border-radius:8px;
      transition:all 0.2s;box-shadow:0 0 24px rgba(0,229,204,0.35);
    }
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 32px rgba(0,229,204,0.55)}
    .btn-outline{
      font-weight:600;font-size:0.88rem;letter-spacing:0.06em;text-transform:uppercase;
      background:transparent;color:var(--text);padding:12px 28px;border-radius:8px;
      border:1px solid var(--border);transition:all 0.2s;
    }
    .btn-outline:hover{border-color:var(--teal);color:var(--teal);background:rgba(0,229,204,0.05)}
    .hero-stats{
      display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
      border:1px solid var(--border);border-radius:12px;overflow:hidden;
      background:var(--border);
    }
    .hero-stat{
      background:var(--surface);padding:14px 12px;text-align:center;
    }
    .hero-stat-val{
      font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;
      color:var(--teal);line-height:1;margin-bottom:4px;
    }
    .hero-stat-lbl{font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;color:var(--muted);text-transform:uppercase}

    /* PROFILE CARD */
    .profile-wrap{position:relative;display:flex;flex-direction:column;gap:20px;align-items:flex-end}
    .profile-card{
      position:relative;border-radius:20px;overflow:hidden;
      border:1px solid var(--border);
      background:linear-gradient(135deg,var(--surface),var(--surface2));
      box-shadow:0 32px 64px rgba(0,0,0,0.5),0 0 0 1px var(--border);
    }
    .profile-card img{width:100%;max-width:380px;aspect-ratio:4/5;object-fit:cover;display:block;filter:contrast(1.05)}
    .profile-card::after{
      content:'';position:absolute;inset:0;
      background:linear-gradient(180deg,transparent 50%,rgba(6,8,16,0.9) 100%);
    }
    .profile-chip{
      position:absolute;z-index:2;
      font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.12em;
      text-transform:uppercase;padding:5px 12px;border-radius:4px;
    }
    .chip-cloud{
      top:16px;left:16px;
      background:rgba(0,229,204,0.15);color:var(--teal);
      border:1px solid rgba(0,229,204,0.3);
    }
    .chip-ai{
      top:16px;right:16px;
      background:rgba(167,139,250,0.15);color:var(--violet);
      border:1px solid rgba(167,139,250,0.3);
    }
    .profile-status{
      position:absolute;bottom:20px;left:20px;right:20px;z-index:2;
      background:rgba(6,8,16,0.8);backdrop-filter:blur(12px);
      border:1px solid var(--border);border-radius:10px;padding:14px 16px;
    }
    .status-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0}
    .status-row span{font-size:0.75rem;color:var(--muted);font-family:'DM Mono',monospace}
    .status-row strong{font-size:0.78rem;color:var(--text);font-weight:500}
    .profile-floating{
      position:absolute;top:50%;right:-28px;transform:translateY(-50%);
      background:var(--surface2);border:1px solid var(--border);
      border-radius:12px;padding:14px 16px;width:160px;
      box-shadow:0 16px 40px rgba(0,0,0,0.4);
    }
    .floating-label{font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--teal);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px}
    .floating-val{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--text)}
    .floating-sub{font-size:0.7rem;color:var(--muted);margin-top:2px}

    /* SKILLS */
    .skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
    .skill-card{
      background:var(--card);border:1px solid var(--border);border-radius:16px;
      padding:24px;transition:all 0.3s;position:relative;overflow:hidden;
    }
    .skill-card::before{
      content:'';position:absolute;inset:0;
      background:linear-gradient(135deg,rgba(255,255,255,0.02),transparent);
      pointer-events:none;
    }
    .skill-card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.14);box-shadow:0 20px 40px rgba(0,0,0,0.3)}
    .skill-cat{font-family:'Syne',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:16px}
    .skill-pills{display:flex;flex-wrap:wrap;gap:8px}
    .skill-pill{font-size:0.75rem;padding:5px 12px;border-radius:20px;border:1px solid;font-weight:500;letter-spacing:0.03em;transition:all 0.2s}
    .skill-pill:hover{transform:scale(1.05)}

    /* PROJECTS */
    .projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
    .project-card{
      background:var(--card);border:1px solid var(--border);border-radius:16px;
      padding:24px 24px 20px;transition:all 0.3s;position:relative;overflow:hidden;
      display:flex;flex-direction:column;gap:12px;
    }
    .project-card::after{
      content:'';position:absolute;top:0;left:0;right:0;height:2px;
      background:linear-gradient(90deg,var(--teal),transparent);
      opacity:0;transition:opacity 0.3s;
    }
    .project-card:hover{transform:translateY(-4px);border-color:rgba(0,229,204,0.2);box-shadow:0 20px 40px rgba(0,0,0,0.35)}
    .project-card:hover::after{opacity:1}
    .project-lang{
      display:inline-flex;align-items:center;gap:6px;
      font-family:'DM Mono',monospace;font-size:0.68rem;letter-spacing:0.08em;
      color:var(--teal);text-transform:uppercase;padding:4px 10px;
      background:rgba(0,229,204,0.08);border-radius:4px;width:fit-content;
    }
    .project-lang::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--teal);box-shadow:0 0 8px var(--teal)}
    .project-title{font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:700;color:var(--text)}
    .project-desc{font-size:0.85rem;color:var(--muted);line-height:1.6;flex:1}
    .project-footer{display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid var(--border)}
    .project-date{font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--muted)}
    .project-link{
      font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:0.06em;
      color:var(--teal);padding:5px 12px;border:1px solid rgba(0,229,204,0.3);
      border-radius:5px;transition:all 0.2s;
    }
    .project-link:hover{background:rgba(0,229,204,0.1);color:#fff}

    /* TIMELINE (edu/exp) */
    .timeline{display:flex;flex-direction:column;gap:0}
    .tl-item{display:grid;grid-template-columns:100px 1fr;gap:0 32px;position:relative;padding-bottom:24px}
    .tl-item:last-child{padding-bottom:0}
    .tl-left{text-align:right;padding-top:4px}
    .tl-date{font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--muted);line-height:1.5}
    .tl-line{
      position:absolute;left:100px;top:0;bottom:0;width:1px;
      background:linear-gradient(180deg,var(--border),transparent);
    }
    .tl-dot{
      position:absolute;left:91px;top:6px;width:18px;height:18px;border-radius:50%;
      background:var(--surface);border:2px solid;
      display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:900;
    }
    .tl-right{padding-left:32px}
    .tl-card{
      background:var(--card);border:1px solid var(--border);border-radius:12px;
      padding:14px 18px;transition:all 0.3s;
    }
    .tl-card:hover{border-color:rgba(255,255,255,0.12);transform:translateX(4px)}
    .tl-title{font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:4px}
    .tl-sub{font-size:0.85rem;color:var(--muted);margin-bottom:10px}
    .tl-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
    .tl-chip{font-size:0.7rem;padding:3px 10px;border-radius:20px;border:1px solid;font-weight:500}

    /* RESEARCH */
    .research-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
    .research-card{
      background:var(--card);border:1px solid var(--border);border-radius:16px;
      padding:26px;transition:all 0.3s;position:relative;overflow:hidden;
    }
    .research-card::before{
      content:'';position:absolute;top:-60px;right:-60px;width:160px;height:160px;
      border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,0.1),transparent);
    }
    .research-card:hover{transform:translateY(-4px);border-color:rgba(167,139,250,0.25)}
    .research-tag{
      font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;
      text-transform:uppercase;color:var(--violet);
      padding:4px 10px;background:rgba(167,139,250,0.1);border-radius:4px;
      width:fit-content;margin-bottom:14px;
    }
    .research-title{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:var(--text);margin-bottom:10px;line-height:1.4}
    .research-id{font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--amber);margin-bottom:10px}
    .research-desc{font-size:0.83rem;color:var(--muted);line-height:1.6;margin-bottom:14px}
    .research-meta{display:flex;flex-wrap:wrap;gap:8px}
    .research-chip{font-size:0.72rem;padding:4px 10px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:20px;color:var(--muted)}

    /* CERTS */
    .certs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
    .cert-card{
      background:var(--card);border:1px solid var(--border);border-radius:14px;
      padding:20px;transition:all 0.3s;display:flex;gap:16px;align-items:flex-start;
    }
    .cert-card:hover{border-color:rgba(245,158,11,0.3);transform:translateY(-2px)}
    .cert-icon{
      width:42px;height:42px;border-radius:10px;flex-shrink:0;
      background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25);
      display:flex;align-items:center;justify-content:center;font-size:18px;
    }
    .cert-org{font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--amber);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px}
    .cert-name{font-size:0.9rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:4px}
    .cert-date{font-size:0.75rem;color:var(--muted)}

    /* RESOURCES */
    .resources-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
    .resource-card{
      background:var(--card);border:1px solid var(--border);border-radius:14px;
      padding:18px 20px;display:flex;gap:14px;align-items:flex-start;transition:all 0.3s;
    }
    .resource-card:hover{border-color:rgba(0,229,204,0.2);transform:translateY(-2px)}
    .resource-kind{
      width:38px;height:38px;border-radius:8px;flex-shrink:0;display:flex;
      align-items:center;justify-content:center;font-size:15px;font-weight:700;
      font-family:'DM Mono',monospace;font-size:0.6rem;letter-spacing:0.06em;
    }
    .kind-pdf{background:rgba(244,114,182,0.12);color:var(--pink);border:1px solid rgba(244,114,182,0.25)}
    .kind-notes{background:rgba(0,229,204,0.1);color:var(--teal);border:1px solid rgba(0,229,204,0.25)}
    .resource-name{font-size:0.88rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:4px}
    .resource-repo{font-size:0.72rem;color:var(--muted);margin-bottom:8px}
    .resource-link{font-size:0.72rem;color:var(--teal);font-family:'DM Mono',monospace}
    .resource-link:hover{text-decoration:underline}

    /* RESUME */
    .resume-section{text-align:center;padding:80px max(24px,6vw);max-width:600px;margin:0 auto}
    .resume-card{
      background:var(--card);border:1px solid var(--border);border-radius:20px;
      padding:36px 32px;position:relative;overflow:hidden;
    }
    .resume-card::before{
      content:'';position:absolute;inset:0;
      background:linear-gradient(135deg,rgba(0,229,204,0.03),transparent);
    }
    .resume-icon{font-size:36px;margin-bottom:12px}
    .resume-title{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--text);margin-bottom:8px}
    .resume-sub{font-size:0.88rem;color:var(--muted);margin-bottom:24px}

    /* CONTACT */
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
    .contact-info-title{font-family:'Syne',sans-serif;font-size:clamp(1.3rem,2.8vw,2rem);font-weight:800;color:var(--text);margin-bottom:10px;line-height:1.2}
    .contact-info-sub{font-size:0.88rem;color:var(--muted);line-height:1.65;margin-bottom:18px}
    .contact-detail-row{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)}
    .contact-detail-label{font-family:'DM Mono',monospace;font-size:0.68rem;color:var(--teal);text-transform:uppercase;letter-spacing:0.08em;width:72px;flex-shrink:0}
    .contact-detail-val{font-size:0.88rem;color:var(--text)}
    .socials{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap}
    .social-btn{
      width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;
      background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--muted);
      transition:all 0.2s;
    }
    .social-btn:hover{background:rgba(0,229,204,0.1);border-color:rgba(0,229,204,0.4);color:var(--teal);transform:translateY(-2px)}
    .contact-form{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px}
    .contact-form h3{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:16px}
    .form-input{
      width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;
      color:var(--text);font-family:'Outfit',sans-serif;font-size:0.9rem;
      padding:12px 16px;outline:none;transition:all 0.2s;margin-bottom:14px;
    }
    .form-input::placeholder{color:var(--muted)}
    .form-input:focus{border-color:rgba(0,229,204,0.4);background:rgba(0,229,204,0.03);box-shadow:0 0 0 3px rgba(0,229,204,0.06)}
    textarea.form-input{resize:vertical;min-height:120px;line-height:1.6}
    .form-submit{
      width:100%;font-weight:600;font-size:0.9rem;letter-spacing:0.06em;text-transform:uppercase;
      background:var(--teal);color:#060810;padding:14px;border-radius:10px;
      transition:all 0.2s;box-shadow:0 0 24px rgba(0,229,204,0.3);
    }
    .form-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 28px rgba(0,229,204,0.5)}
    .form-submit:disabled{opacity:0.6;cursor:not-allowed}
    .sent-msg{text-align:center;padding:10px;color:var(--teal);font-family:'DM Mono',monospace;font-size:0.8rem;margin-top:10px}

    /* FOOTER */
    .footer{
      position:relative;z-index:1;max-width:1200px;margin:0 auto;
      padding:20px max(24px,6vw);
      border-top:1px solid var(--border);
      display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;
    }
    .footer-copy{font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--muted);letter-spacing:0.06em}
    .footer-tag{font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--muted);padding:4px 10px;background:rgba(255,255,255,0.04);border-radius:4px;border:1px solid var(--border)}

    /* FADE IN */
    .fade-up{opacity:0;transform:translateY(24px);animation:fadeUp 0.7s cubic-bezier(.4,0,.2,1) forwards}
    @keyframes fadeUp{to{opacity:1;transform:translateY(0)}}

    /* RESPONSIVE */
    @media(max-width:1024px){
      .hero{grid-template-columns:1fr;gap:32px;min-height:auto;padding-top:80px}
      .hero-visual{display:none}
      .contact-grid{grid-template-columns:1fr}
      .profile-floating{display:none}
    }
    @media(max-width:768px){
      .nav-links,.nav-cta{display:none}
      .hamburger{display:flex}
      .tl-item{grid-template-columns:70px 1fr;gap:0 16px}
      .tl-dot,.tl-line{left:70px}
      .tl-right{padding-left:20px}
      .section{padding:40px max(16px,4vw) 28px}
    }
    @media(max-width:480px){
      .hero-stats{grid-template-columns:repeat(2,1fr)}
      .tl-left{display:none}
      .tl-item{grid-template-columns:1fr}
      .tl-dot,.tl-line{display:none}
      .tl-right{padding-left:0}
      .section{padding:32px 16px 24px}
    }
  `}</style>
);

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

  return (
    <>
      <FontLink />
      <GlobalStyles />

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
                  <div className="status-row"><span>Status</span><strong style={{color:"#22c55e"}}>● Open to impact</strong></div>
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
                const col = SKILL_COLORS[ci%SKILL_COLORS.length];
                return (
                  <div key={cat} className="skill-card">
                    <div className="skill-cat" style={{color:col}}>{cat}</div>
                    <div className="skill-pills">
                      {skillGroups[cat].map((sk,si)=>(
                        <span key={si} className="skill-pill" style={{color:col,borderColor:`${col}40`,background:`${col}10`}}>
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
            {loading && <p style={{color:"var(--muted)"}}>Loading projects…</p>}
            {!loading && repos.length===0 && <p style={{color:"var(--muted)"}}>No projects found.</p>}
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
                  <div className="tl-dot" style={{borderColor:"var(--teal)",color:"var(--teal)"}}>{edu.degree?.slice(0,2)||"ED"}</div>
                  <div className="tl-right">
                    <div className="tl-card">
                      <div className="tl-title">{edu.degree}</div>
                      <div className="tl-sub">{edu.institution}</div>
                      {edu.skills && (
                        <div className="tl-chips">
                          {parseCommaList(edu.skills).map((sk,si)=>(
                            <span key={si} className="tl-chip" style={{color:TAG_COLORS[si%TAG_COLORS.length],borderColor:`${TAG_COLORS[si%TAG_COLORS.length]}40`,background:`${TAG_COLORS[si%TAG_COLORS.length]}10`}}>{sk}</span>
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
                  <div className="tl-dot" style={{borderColor:"var(--amber)",color:"var(--amber)"}}>{exp.title?.slice(0,2)||"EX"}</div>
                  <div className="tl-right">
                    <div className="tl-card">
                      <div className="tl-title">{exp.title}</div>
                      <div className="tl-sub">{exp.company}</div>
                      {exp.responsibilities && <p style={{marginTop:10,fontSize:"0.85rem",color:"var(--muted)",lineHeight:1.6}}>{exp.responsibilities}</p>}
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
            {(content.research||[]).length===0 && <p style={{color:"var(--muted)"}}>No research papers added yet.</p>}
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
            {loading && <p style={{color:"var(--muted)"}}>Loading resources…</p>}
            {!loading && resourceRepos.length===0 && <p style={{color:"var(--muted)"}}>No PDFs or Notes found on GitHub.</p>}
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
        <div style={{padding:"0 max(24px,6vw)",maxWidth:600,margin:"0 auto"}}>
          <section id="Resume">
            <SH n="09" label="Resume"/>
            <div className="resume-card">
              <div className="resume-icon">📄</div>
              <div className="resume-title">My Resume</div>
              <div className="resume-sub">Download my complete resume to learn more about my background, skills, and experience.</div>
              <a className="btn-primary" href={content.resume.url} target="_blank" rel="noreferrer" style={{display:"inline-block",textDecoration:"none"}}>
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