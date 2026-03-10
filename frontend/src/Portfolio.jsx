import { useEffect, useState } from "react";

import profileImg from "./assets/PHOTO.jpg";
import "./Portfolio.css";

const NAV = ["About", "Skills", "Projects", "Education", "Contact", "Resume", "Resources"];
//agr future me home add karna ho to nav me add karna aur section naya create krna with id home and usme hero wali cheez rakh dena.
const EDUCATION = [
  {
    degree: "Masters in Computer Application",
    short: "MCA",
    period: "Jul '22 - Jun '24",
    uni: "Lovely Professional University",
    loc: "Punjab, IN",
    pct: "78.80%",
    color: "var(--accent2)",
    courses: [
      "Cloud Computing",
      "Network Security",
      "DevOps Practices",
      "Distributed Systems",
    ],
  },
  {
    degree: "Bachelors in Computer Application",
    short: "BCA",
    period: "Jun '19 - Jul '22",
    uni: "Dr. Shyama Prasad Mukherjee University",
    loc: "Ranchi, IN",
    pct: "79%",
    color: "var(--accent)",
    courses: [
      "Data Structures",
      "Computer Networks",
      "Operating Systems",
      "Database Management",
    ],
  },
];

const SKILLS = [
  {
    cat: "Cloud",
    col: "var(--accent)",
    items: ["AWS", "Azure", "GCP", "CloudFormation", "Pulumi"],
  },
  {
    cat: "DevOps",
    col: "var(--accent2)",
    items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform"],
  },
  {
    cat: "Networking",
    col: "var(--accent3)",
    items: ["BGP/OSPF", "SD-WAN", "Firewall", "VPN", "Load Balancing"],
  },
  {
    cat: "Observability",
    col: "var(--accent4)",
    items: ["Prometheus", "Grafana", "ELK", "Datadog", "SLOs"],
  },
];

const PROJECTS = [
  {
    title: "Zero-Downtime CI/CD",
    desc:
      "Blue-green deployments across 40+ services with automated rollbacks.",
    tags: ["Kubernetes", "Jenkins", "Terraform"],
    metric: "99.99%",
    sub: "uptime",
  },
  {
    title: "Multi-Region Network Fabric",
    desc:
      "Resilient SD-WAN mesh across 12 data centers with sub-200ms failover.",
    tags: ["SD-WAN", "BGP", "Ansible"],
    metric: "<200ms",
    sub: "failover",
  },
  {
    title: "Observability Platform",
    desc: "Unified monitoring stack ingesting 2M+ metrics per minute.",
    tags: ["Prometheus", "Grafana", "ELK"],
    metric: "2M+",
    sub: "metrics/min",
  },
  {
    title: "IaC Migration",
    desc: "Migrated 300+ servers to IaC, provisioning from days to minutes.",
    tags: ["Terraform", "AWS", "Docker"],
    metric: "15x",
    sub: "faster",
  },
];

const STATS = [
  // { v: "5+", l: "Years Experience" },
  // { v: "120+", l: "Systems Deployed" },
  // { v: "99.9%", l: "Avg Uptime SLA" },
  // { v: "40+", l: "Microservices" },
];
const RESOURCES = [
  {
    title: "Research Paper",
  },
  {
    title: "Conceptual Contents",
  }];

const PRINCIPLES = [
  {
    t: "Cloud Native",
    d: "Design for elasticity, resilience, and global scale from day one.",
  },
  {
    t: "Network First",
    d: "Latency budgets, zero trust, and predictable traffic patterns.",
  },
  {
    t: "AI Operations",
    d: "Signal-driven automation to detect and remediate faster.",
  },
];

function SectionHeader({ n, label }) {
  return (
    <div className="sh">
      <div className="line" />
      <span className="num">{n}</span>
      <span className="label">{label}</span>
    </div>
  );
}

function CloudPanel() {
  return (
    <div className="cloud-card fade">
      <div className="cloud-chip">CLOUD READY</div>
      <img src={profileImg} alt="Profile" />
      <div className="ai-chip">AI OPS</div>

      
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("About");
  const [repos, setRepos] = useState([]); // Empty array default
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });


const [sent, setSent] = useState(false);

 useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/kmarankit/repos?sort=updated&per`);
        if (response.ok) {
          const data = await response.json();
          // Safe Check: Data array hona chahiye
          if(Array.isArray(data)) {
            setRepos(data);
          }
          const codeOnly = data.filter(repo => 
          repo.language !== null && 
          repo.fork === false &&
          !repo.name.toLowerCase().includes('pdf') &&
          !repo.name.toLowerCase().includes('notes') // Agar naam mein PDF ya Notes hai toh hata do
        );
        setRepos(codeOnly.slice(0, 6));
          console.log("GitHub Repos:", data);
        }
      } catch (error) {
        console.error("GitHub Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.35 }
    );

    NAV.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const go = id =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="page">
      <div className="bg" />

      {/* NAVBAR */}

      <nav className="nav">
        <div className="logo">
          <span className="pulse" /> cloud.network.ai
        </div>

        <div className="nav-links">
          {NAV.map(l => (
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
Hi, I’m Ankit. I hold an MCA in Data Science & IoT, where I spent my academic years building smart devices and deep-diving into Networking. 
After graduation, I jumped into Full-Stack Development to bring ideas to life on the web. Currently, I’m evolving my skills into DevOps and AI Operations.
 I love bridging the gap between hardware, code, and the cloud to build things that actually work </p>
            <div className="hero-actions">
              <button className="btn primary" onClick={() => go("Projects")}>
                View Work
              </button>

              <button className="btn" onClick={() => go("Contact")}>
                Get in Touch
              </button>
            </div>

            
          </div>

          <CloudPanel />
          <div className="stats">
              {STATS.map(s => (
                <div key={s.l} className="stat fade">
                  <div className="v">{s.v}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
        </div>
      </section>

      

      {/* SKILLS */}

      <section id="Skills" className="section">
        <SectionHeader n="02" label="Skills" />

        <div className="skills-grid">
          {SKILLS.map(g => (
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

      {/* PROJECTS */}
<section id="Projects" className="section">
        <SectionHeader n="02" label="GitHub Repos" />
        <div className="projects-grid">
          {loading ? (
            <p>Loading Projects...</p>
          ) : (
            repos.map(repo => (
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
            ))
          )}
        </div>
      </section>

      {/* EDUCATION */}
      

      <section id="Education" className="section">
        <SectionHeader n="04" label="Education" />

        <div className="edu">
          {EDUCATION.map(edu => (
            <div key={edu.degree} className="edu-item">
              <div
                className="edu-dot"
                style={{ borderColor: edu.color, color: edu.color }}
              >
                {edu.short}
              </div>

              <div className="edu-card">
                <h4>{edu.degree}</h4>

                <div className="meta">
                  {edu.uni} - {edu.loc}
                </div>

                <div className="row">
                  <span className="chip">{edu.period}</span>
                  <span className="chip">{edu.pct}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* resources */}
     <section id="Resources" className="section">
        <SectionHeader n="05" label="Resources" />

        <button className="btn primary">
          research paper, conceptual contents, projects details, resume, certificates, blogs, etc.
        </button>
      </section>

      {/* Resume */}
      <section id="Resume" className="section">
        <SectionHeader n="06" label="Resume" />

        <button className="btn primary">
          Download Resume
        </button>
      </section>
      {/* CONTACT */}

      <section id="Contact" className="section">
        <SectionHeader n="05" label="Contact" />

        <div className="contact">
          <div>
            <h2>Let's build something great.</h2>

            <p>
              Have a complex infrastructure challenge? I'd love to architect
              the solution together.
            </p>
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

            <button className="btn primary" onClick={() => setSent(true)}>
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer">
        <span>(c) 2026 alex.morgan</span>
        <span>Cloud - Network - AI Operations</span>
      </footer>
    </div>
  );
}