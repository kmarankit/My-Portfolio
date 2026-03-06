import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Contact"];

const SKILLS = [
  { category: "DevOps", color: "#00ff80", items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Ansible"] },
  { category: "Cloud", color: "#00cfff", items: ["AWS", "Azure", "GCP", "CloudFormation", "Pulumi"] },
  { category: "Networking", color: "#a78bfa", items: ["BGP/OSPF", "VLANs", "SD-WAN", "Firewall", "VPN", "Load Balancing"] },
  { category: "Monitoring", color: "#fbbf24", items: ["Prometheus", "Grafana", "ELK Stack", "Datadog", "Zabbix"] },
];

const PROJECTS = [
  { title: "Zero-Downtime CI/CD Pipeline", desc: "Architected a fully automated deployment pipeline with blue-green deployments across 40+ microservices.", tags: ["Kubernetes", "Jenkins", "Terraform"], metric: "99.99%", metricLabel: "uptime", icon: "🚀" },
  { title: "Multi-Region Network Fabric", desc: "Designed a resilient SD-WAN mesh across 12 data centers with automated failover under 200ms.", tags: ["SD-WAN", "BGP", "Ansible"], metric: "<200ms", metricLabel: "failover", icon: "🌐" },
  { title: "Observability Platform", desc: "Unified monitoring stack ingesting 2M+ metrics/min with intelligent alerting and anomaly detection.", tags: ["Prometheus", "Grafana", "ELK"], metric: "2M+", metricLabel: "metrics/min", icon: "📊" },
  { title: "IaC Migration", desc: "Migrated 300+ legacy servers to Infrastructure as Code, slashing provisioning from 3 days to 12 minutes.", tags: ["Terraform", "AWS", "Docker"], metric: "15×", metricLabel: "faster deploys", icon: "⚡" },
];

const STATS = [
  { value: "5+", label: "Years Experience" },
  { value: "120+", label: "Systems Deployed" },
  { value: "99.9%", label: "Avg Uptime SLA" },
  { value: "40+", label: "Microservices" },
];

const TERMINAL_LINES = [
  { type: "cmd", text: "whoami" },
  { type: "out", text: "Alex Morgan — DevOps & Network Engineer" },
  { type: "cmd", text: "uptime --human" },
  { type: "out", text: "5 years, 3 months, 12 days" },
  { type: "cmd", text: "ping -c1 reliability.prod" },
  { type: "out", text: "64 bytes: icmp_seq=1 ttl=64 time=0.4ms" },
  { type: "cmd", text: "cat /etc/status" },
  { type: "out", text: "✓ ONLINE — Open to new opportunities" },
];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #030806; }
  ::selection { background: rgba(0,255,128,0.25); color: #e8f5ed; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #030806; }
  ::-webkit-scrollbar-thumb { background: #1a3d28; border-radius: 2px; }

  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(0,255,128,0.15)} 50%{box-shadow:0 0 40px rgba(0,255,128,0.35)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(80px,-60px) scale(1.1)} 66%{transform:translate(-40px,40px) scale(0.95)} }
  @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-60px,80px) scale(1.05)} 66%{transform:translate(60px,-30px) scale(0.9)} }
  @keyframes counterUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .nav-link { position:relative; background:none; border:none; cursor:pointer; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.5px; transition:color 0.2s; padding:6px 0; }
  .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#00ff80; transition:width 0.3s; }
  .nav-link:hover::after, .nav-link.active::after { width:100%; }

  .project-card { border-radius:16px; padding:32px; border:1px solid #0d2018; background:#060d09; transition:all 0.3s; cursor:default; position:relative; overflow:hidden; }
  .project-card::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%, rgba(0,255,128,0.04) 0%, transparent 60%); opacity:0; transition:opacity 0.3s; pointer-events:none; }
  .project-card:hover { border-color:#1a4a2a; transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,128,0.08); }
  .project-card:hover::before { opacity:1; }

  .input-field { background:#060d09; border:1px solid #0d2018; border-radius:10px; padding:14px 18px; color:#c8e8d4; font-family:'Inter',sans-serif; font-size:14px; outline:none; width:100%; transition:border-color 0.2s; }
  .input-field:focus { border-color:#1a5c35; }
  .input-field::placeholder { color:#1e4030; }

  .skill-pill { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:100px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:500; border:1px solid; transition:all 0.2s; cursor:default; margin:4px; }
  .skill-pill:hover { transform:translateY(-2px); }

  .about-card { display:flex; gap:20px; padding:22px 24px; background:#060d09; border:1px solid #0d2018; border-radius:14px; transition:all 0.2s; }
  .about-card:hover { border-color:#1a4a2a; background:#080f0b; }
`;

function FloatingOrbs() {
  return (
    <>
      <div style={{ position:"fixed", top:"10%", right:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,255,128,0.06) 0%, transparent 70%)", animation:"orb1 18s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"20%", left:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,180,255,0.04) 0%, transparent 70%)", animation:"orb2 24s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
    </>
  );
}

function GridBg() {
  return (
    <div style={{
      position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
      backgroundImage:"linear-gradient(rgba(0,255,128,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,128,0.025) 1px, transparent 1px)",
      backgroundSize:"48px 48px",
      maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
    }} />
  );
}

function Terminal() {
  const [displayed, setDisplayed] = useState([]);
  const [typing, setTyping] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (lineIdx >= TERMINAL_LINES.length) return;
    const line = TERMINAL_LINES[lineIdx];
    if (line.type === "out") {
      const t = setTimeout(() => {
        setDisplayed(prev => [...prev, line]);
        setLineIdx(i => i + 1);
      }, 200);
      return () => clearTimeout(t);
    }
    if (charIdx < line.text.length) {
      const t = setTimeout(() => {
        setTyping(line.text.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, 60);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed(prev => [...prev, line]);
        setTyping("");
        setCharIdx(0);
        setLineIdx(i => i + 1);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [displayed, typing]);

  return (
    <div style={{
      background:"linear-gradient(145deg, #070f0a, #050a07)",
      border:"1px solid #132b1c",
      borderRadius:"16px",
      overflow:"hidden",
      width:"100%",
      maxWidth:"500px",
      boxShadow:"0 0 0 1px rgba(0,255,128,0.05), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(0,255,128,0.06)",
      animation:"pulse-glow 4s ease-in-out infinite",
    }}>
      <div style={{ padding:"14px 18px", background:"#040908", borderBottom:"1px solid #0d2018", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex", gap:7 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => <div key={i} style={{ width:11, height:11, borderRadius:"50%", background:c, boxShadow:`0 0 6px ${c}66` }} />)}
        </div>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#1e4a30", margin:"0 auto" }}>bash — terminal</span>
      </div>
      <div ref={containerRef} style={{ padding:"20px 22px", fontFamily:"'JetBrains Mono',monospace", fontSize:"13px", lineHeight:"1.9", minHeight:"240px", maxHeight:"280px", overflowY:"auto" }}>
        {displayed.map((line, i) => (
          <div key={i} style={{ color: line.type==="cmd" ? "#00ff80" : "#6a9878", display:"flex", gap:8, alignItems:"flex-start" }}>
            <span style={{ color: line.type==="cmd" ? "#1e6040" : "#0d2a1a", flexShrink:0, marginTop:1 }}>{line.type==="cmd" ? "$" : "›"}</span>
            <span>{line.text}</span>
          </div>
        ))}
        {lineIdx < TERMINAL_LINES.length && TERMINAL_LINES[lineIdx].type==="cmd" && (
          <div style={{ color:"#00ff80", display:"flex", gap:8 }}>
            <span style={{ color:"#1e6040" }}>$</span>
            <span>{typing}<span style={{ display:"inline-block", width:8, height:14, background:"#00ff80", verticalAlign:"middle", marginLeft:2, animation:"blink 1s step-end infinite" }} /></span>
          </div>
        )}
        {lineIdx >= TERMINAL_LINES.length && (
          <div style={{ color:"#00ff80", display:"flex", gap:8 }}>
            <span style={{ color:"#1e6040" }}>$</span>
            <span style={{ display:"inline-block", width:8, height:14, background:"#00ff80", verticalAlign:"middle", animation:"blink 1s step-end infinite" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ num, label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:56 }}>
      <div style={{ width:32, height:2, background:"linear-gradient(90deg, #00ff80, transparent)" }} />
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#1e6040", letterSpacing:"2px", textTransform:"uppercase" }}>{num} / {label}</span>
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("Home");
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.3 }
    );
    NAV_LINKS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const W = "clamp(24px,5vw,80px)";

  return (
    <div style={{ background:"#030806", color:"#d4e8da", minHeight:"100vh", fontFamily:"'Inter',sans-serif", overflowX:"hidden" }}>
      <style>{GLOBAL_CSS}</style>
      <FloatingOrbs />
      <GridBg />

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:`0 ${W}`, height:64, display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(3,8,6,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,255,128,0.06)" }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", color:"#00ff80", fontWeight:600, fontSize:15, letterSpacing:"-0.3px" }}>
          <span style={{ opacity:0.35 }}>~/</span>alex.morgan
        </div>
        <div style={{ display:"flex", gap:"clamp(20px,3vw,40px)" }}>
          {NAV_LINKS.map(link => (
            <button key={link} className={`nav-link ${active===link?"active":""}`} onClick={() => scrollTo(link)} style={{ color: active===link ? "#00ff80" : "#3a6a4a" }}>
              {link.toLowerCase()}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#00ff80", boxShadow:"0 0 10px #00ff80", animation:"dotPulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#1e5c38" }}>available</span>
        </div>
      </nav>

      {/* HERO */}
      <section id="Home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:`100px ${W} 60px`, position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", gap:"clamp(40px,6vw,100px)", flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 380px", animation:"fadeSlideUp 0.7s ease 0.1s both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:100, background:"rgba(0,255,128,0.06)", border:"1px solid rgba(0,255,128,0.15)", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#00c870", marginBottom:32 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#00ff80", boxShadow:"0 0 8px #00ff80", animation:"dotPulse 2s ease-in-out infinite" }} />
              Available for opportunities
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(52px,8vw,96px)", fontWeight:800, lineHeight:0.95, letterSpacing:"-3px", marginBottom:24, color:"#e8f5ed" }}>
              Alex<br />
              <span style={{ background:"linear-gradient(135deg, #00ff80 0%, #00cfaa 50%, #00a8e8 100%)", backgroundSize:"200% 200%", animation:"gradientShift 4s ease infinite", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Morgan</span>
            </h1>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#2a6040", marginBottom:20, letterSpacing:"1.5px" }}>DEVOPS ENGINEER · NETWORK ARCHITECT</p>
            <p style={{ fontSize:16, color:"#5a8068", lineHeight:1.8, maxWidth:440, marginBottom:44 }}>
              I build infrastructure that scales, pipelines that never sleep, and networks that self‑heal — so your team ships faster with zero surprises.
            </p>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <button onClick={() => scrollTo("Projects")} style={{ padding:"14px 32px", background:"linear-gradient(135deg, #00ff80, #00cfaa)", color:"#020a04", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:13, boxShadow:"0 8px 32px rgba(0,255,128,0.2)", transition:"transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,255,128,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,255,128,0.2)"; }}>
                view_projects →
              </button>
              <button onClick={() => scrollTo("Contact")} style={{ padding:"14px 32px", background:"transparent", color:"#00ff80", border:"1px solid rgba(0,255,128,0.2)", borderRadius:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:13, transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(0,255,128,0.06)"; e.currentTarget.style.borderColor="rgba(0,255,128,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(0,255,128,0.2)"; }}>
                get_in_touch
              </button>
            </div>
          </div>
          <div style={{ flex:"1 1 360px", display:"flex", justifyContent:"center", animation:"fadeSlideUp 0.7s ease 0.3s both" }}>
            <Terminal />
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <div style={{ background:"linear-gradient(90deg, transparent, rgba(0,255,128,0.025), transparent)", borderTop:"1px solid rgba(0,255,128,0.06)", borderBottom:"1px solid rgba(0,255,128,0.06)", padding:`48px ${W}`, position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32 }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ textAlign:"center", animation:`counterUp 0.5s ease ${i*100}ms both` }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:800, background:"linear-gradient(135deg, #00ff80, #00cfaa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-1px", lineHeight:1, marginBottom:8 }}>{s.value}</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"#3a6a4a", letterSpacing:"0.5px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="About" style={{ padding:`100px ${W}`, maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
        <SectionLabel num="01" label="about" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", flexWrap:"wrap" }}>
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(32px,4vw,52px)", fontWeight:800, color:"#e8f5ed", letterSpacing:"-1.5px", marginBottom:24, lineHeight:1.1 }}>
              Building systems<br /><span style={{ color:"#2a7050" }}>that outlast trends</span>
            </h2>
            <p style={{ color:"#4a7060", lineHeight:1.8, fontSize:15, marginBottom:20 }}>
              I'm a DevOps and Network Engineer with 5+ years designing, automating, and operating large-scale infrastructure. I thrive at the intersection of development velocity and operational stability.
            </p>
            <p style={{ color:"#3a5a48", lineHeight:1.8, fontSize:15 }}>
              Whether crafting bulletproof CI/CD pipelines, architecting zero-trust network policies, or building observability platforms from scratch — I bring precision to every layer of the stack.
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { icon:"⚙️", title:"Infrastructure as Code", text:"Every resource version-controlled. Every environment reproducible. Every rollback instant." },
              { icon:"🌐", title:"Network Architecture", text:"Resilient, secure networks that operate at the speed of business, not the speed of tickets." },
              { icon:"📈", title:"SRE & Reliability", text:"Error budgets, SLOs, and blameless postmortems. Systems that fail gracefully and self-heal." },
            ].map(card => (
              <div key={card.title} className="about-card">
                <div style={{ fontSize:24, flexShrink:0, marginTop:2 }}>{card.icon}</div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#c8e8d4", marginBottom:6, fontSize:15 }}>{card.title}</div>
                  <div style={{ color:"#3a6050", fontSize:13, lineHeight:1.6 }}>{card.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="Skills" style={{ padding:`100px ${W}`, position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionLabel num="02" label="tech stack" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:28 }}>
            {SKILLS.map(group => (
              <div key={group.category} style={{ background:"#060d09", border:"1px solid #0d2018", borderRadius:16, padding:28, overflow:"hidden", position:"relative" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${group.color}88, transparent)` }} />
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:group.color, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", marginBottom:20, opacity:0.85 }}>
                  // {group.category}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap" }}>
                  {group.items.map(item => (
                    <span key={item} className="skill-pill" style={{ color:group.color, background:`${group.color}10`, borderColor:`${group.color}28` }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:group.color, opacity:0.7 }} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="Projects" style={{ padding:`100px ${W}`, position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionLabel num="03" label="projects" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))", gap:24 }}>
            {PROJECTS.map(proj => (
              <div key={proj.title} className="project-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                  <div style={{ fontSize:32 }}>{proj.icon}</div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, lineHeight:1, background:"linear-gradient(135deg, #00ff80, #00cfaa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{proj.metric}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#1e5c38", letterSpacing:"1px" }}>{proj.metricLabel}</div>
                  </div>
                </div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"#d4e8da", marginBottom:12, lineHeight:1.3 }}>{proj.title}</h3>
                <p style={{ color:"#3a6050", fontSize:14, lineHeight:1.7, marginBottom:24 }}>{proj.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {proj.tags.map(t => (
                    <span key={t} style={{ padding:"4px 12px", borderRadius:100, fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:500, background:"rgba(0,255,128,0.06)", color:"#00a860", border:"1px solid rgba(0,255,128,0.12)" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="Contact" style={{ padding:`100px ${W} 120px`, position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <SectionLabel num="04" label="contact" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:64, alignItems:"start" }}>
            <div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#e8f5ed", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:20 }}>
                Let's build<br /><span style={{ color:"#1e6040" }}>something great</span>
              </h2>
              <p style={{ color:"#3a6050", fontSize:15, lineHeight:1.8, marginBottom:40 }}>Have a complex infrastructure challenge? I'd love to architect the solution together.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
                {[
                  { icon:"📧", label:"Email", val:"alex@devops.io" },
                  { icon:"💻", label:"GitHub", val:"github.com/alexmorgan" },
                  { icon:"💼", label:"LinkedIn", val:"in/alexmorgan" },
                  { icon:"📍", label:"Location", val:"Remote / Worldwide" },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display:"flex", gap:14, alignItems:"center" }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:"rgba(0,255,128,0.06)", border:"1px solid rgba(0,255,128,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#1a4a2a", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:2 }}>{label}</div>
                      <div style={{ color:"#6a9878", fontSize:14 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!sent ? (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <input className="input-field" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name:e.target.value }))} />
                  <input className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email:e.target.value }))} />
                </div>
                <input className="input-field" placeholder="Subject" />
                <textarea className="input-field" placeholder="Tell me about your infrastructure challenge..." rows={6} value={form.message} onChange={e => setForm(p => ({ ...p, message:e.target.value }))} style={{ resize:"none" }} />
                <button onClick={() => setSent(true)} style={{ padding:16, background:"linear-gradient(135deg, #00ff80, #00cfaa)", color:"#020a04", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:14, boxShadow:"0 8px 32px rgba(0,255,128,0.2)", transition:"transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,255,128,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,255,128,0.2)"; }}>
                  send_message() →
                </button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"60px 40px", background:"#060d09", border:"1px solid rgba(0,255,128,0.15)", borderRadius:16, textAlign:"center", animation:"fadeSlideUp 0.5s ease both" }}>
                <div style={{ fontSize:48 }}>✅</div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#e8f5ed", fontSize:22 }}>Message sent!</h3>
                <p style={{ color:"#3a6050", fontSize:14, lineHeight:1.7 }}>Thanks for reaching out. I'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ background:"none", border:"none", color:"#00ff80", fontFamily:"'JetBrains Mono',monospace", fontSize:12, cursor:"pointer", opacity:0.6 }}>send another →</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(0,255,128,0.06)", padding:`32px ${W}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16, position:"relative", zIndex:1 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#0d2a1a" }}>© 2026 alex.morgan — crafted with precision</span>
        <div style={{ display:"flex", gap:24 }}>
          {["GitHub","LinkedIn","Twitter"].map(link => (
            <span key={link} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#1a4030", cursor:"pointer", transition:"color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#00ff80"}
              onMouseLeave={e => e.target.style.color="#1a4030"}>
              {link}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}