import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, addProject, deleteProject, fetchContent, upsertContent } from '../services/api';
const NAV_SECTIONS = [
  { id: 'photo',       label: 'Photo',        icon: '🖼️'  },
  { id: 'summary',     label: 'Summary',      icon: '📝'  },
  { id: 'skills',      label: 'Skills',       icon: '⚡'  },
  { id: 'projects',    label: 'Projects',     icon: '🚀'  },
  { id: 'education',   label: 'Education',    icon: '🎓'  },
  { id: 'experience',  label: 'Experience',   icon: '💼'  },
  { id: 'research',    label: 'Research',     icon: '🔬'  },
  { id: 'resources',   label: 'Resources',    icon: '📦'  },
  { id: 'contact',     label: 'Contact',      icon: '✉️'  },
  { id: 'resume',      label: 'Resume',       icon: '📄'  },
  { id: 'certif',      label: 'Certification',icon: '🏆'  },
  { id: 'social',      label: 'Social Media', icon: '🌐'  },
];

const TAG_COLORS = ['#22c55e', '#38bdf8', '#a78bfa', '#f59e0b', '#f472b6', '#60a5fa'];

const parseCommaList = (value) => String(value || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const formatEducationRange = (edu) => {
  const start = edu?.startDate || edu?.start || edu?.from || '';
  const end = edu?.endDate || edu?.end || edu?.to || '';
  if (start || end) return `${start}${end ? ` - ${end}` : ' - Present'}`;
  return edu?.year || '';
};

// ── tiny reusable card ───────────────────────────────────────────────────────
const Card = ({ title, children }) => (
  <div style={{
    background: 'rgba(255,255,255,0.035)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '28px 24px',
    marginBottom: 24,
  }}>
    <h3 style={{ margin: '0 0 18px', color: '#e2e8f0', fontSize: 15, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</h3>
    {children}
  </div>
);

// ── section content map ──────────────────────────────────────────────────────
const SectionContent = ({
  id,
  content,
  setContent,
  drafts,
  setDrafts,
  projectForm,
  setProjectForm,
  onSaveSection,
  onAddItem,
  onRemoveItem,
  onRemoveSkillCategory,
  onAddProject,
  handleFileUpload,
  isLive,
}) => {
  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10, color: '#e2e8f0', padding: '12px 14px', fontSize: 14,
    outline: 'none', marginBottom: 12, fontFamily: 'inherit',
  };

  switch (id) {
   case 'photo': return (
  <Card title="Profile Photo">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => handleFileUpload(e.target.files[0], 'photo')}
        style={{ ...inputStyle, padding: '10px' }} 
      />
      {content.photo?.url && <p style={{fontSize: 12, color: '#22c55e'}}>✓ File uploaded to Cloudinary</p>}
      <button style={btnStyle} onClick={() => onSaveSection('photo')}>Save Changes</button>
    </div>
  </Card>
);
    case 'summary': return (
      <Card title="Add / Edit Summary">
        <form onSubmit={(e) => { e.preventDefault(); onSaveSection('summary'); }}>
          <textarea rows={5} placeholder="Write your professional summary..." value={content.summary?.description || ''}
            onChange={e => setContent((prev) => ({ ...prev, summary: { description: e.target.value } }))}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} required />
          <button type="submit" style={btnStyle}>{isLive ? '✅ Update Summary' : '🚀 Publish to Portfolio'}</button>
        </form>
      </Card>
    );

    case 'skills': return (
      <Card title="Manage Skills">
        <input
          placeholder="Category"
          value={drafts.skill.category}
          onChange={(e) => setDrafts((prev) => ({ ...prev, skill: { ...prev.skill, category: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Skill names (comma separated, e.g. React, Node)"
          value={drafts.skill.name}
          onChange={(e) => setDrafts((prev) => ({ ...prev, skill: { ...prev.skill, name: e.target.value } }))}
          style={inputStyle}
        />
        <button
          style={btnStyle}
          onClick={() => onAddItem('skills', drafts.skill, () => setDrafts((prev) => ({ ...prev, skill: { category: '', name: '' } })))}
        >
          Add Skill
        </button>
        {Object.entries((content.skills || []).reduce((acc, s) => {
          const category = (s.category || 'Uncategorized').trim() || 'Uncategorized';
          if (!acc[category]) acc[category] = [];
          if (s.name) acc[category].push(s.name);
          return acc;
        }, {})).map(([category, names]) => (
          <div key={category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ color: '#cbd5e1', fontSize: 13 }}>{category} • {names.join(', ')}</span>
            <button
              style={{ ...btnStyle, width: 90, padding: '6px 10px' }}
              onClick={() => onRemoveSkillCategory(category)}
            >
              Remove All
            </button>
          </div>
        ))}
      </Card>
    );

    case 'projects': return (
      <Card title="Add Project">
        <input placeholder="Project title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} style={inputStyle} />
        <textarea placeholder="Description" rows={3} value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
        <input placeholder="Tech stack" value={projectForm.tech} onChange={e => setProjectForm({ ...projectForm, tech: e.target.value })} style={inputStyle} />
        <input placeholder="Live link" value={projectForm.link} onChange={e => setProjectForm({ ...projectForm, link: e.target.value })} style={inputStyle} />
        <button onClick={onAddProject} style={btnStyle}>Add Project</button>
      </Card>
    );

    case 'education': return (
      <Card title="Add Education">
        <input
          placeholder="Degree / Course"
          value={drafts.education.degree}
          onChange={(e) => setDrafts((prev) => ({ ...prev, education: { ...prev.education, degree: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Institution"
          value={drafts.education.institution}
          onChange={(e) => setDrafts((prev) => ({ ...prev, education: { ...prev.education, institution: e.target.value } }))}
          style={inputStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input
            type="month"
            placeholder="Start (YYYY-MM)"
            value={drafts.education.startDate}
            onChange={(e) => setDrafts((prev) => ({ ...prev, education: { ...prev.education, startDate: e.target.value } }))}
            style={inputStyle}
          />
          <input
            type="month"
            placeholder="End (YYYY-MM)"
            value={drafts.education.endDate}
            onChange={(e) => setDrafts((prev) => ({ ...prev, education: { ...prev.education, endDate: e.target.value } }))}
            style={inputStyle}
          />
        </div>
        <input
          placeholder="Skills learned (comma separated)"
          value={drafts.education.skills}
          onChange={(e) => setDrafts((prev) => ({ ...prev, education: { ...prev.education, skills: e.target.value } }))}
          style={inputStyle}
        />
        <button
          style={btnStyle}
          onClick={() => onAddItem('education', drafts.education, () => setDrafts((prev) => ({ ...prev, education: { degree: '', institution: '', startDate: '', endDate: '', skills: '' } })))}
        >
          Save Education
        </button>
        {(content.education || []).map((e, i) => (
          <div key={`${e.degree}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#cbd5e1', fontSize: 13 }}>
                {e.degree} • {e.institution}{formatEducationRange(e) ? ` • ${formatEducationRange(e)}` : ''}
              </div>
              {parseCommaList(e.skills).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {parseCommaList(e.skills).map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      style={{
                        border: `1px solid ${TAG_COLORS[idx % TAG_COLORS.length]}`,
                        color: '#e2e8f0',
                        padding: '4px 8px',
                        borderRadius: 999,
                        fontSize: 12,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button style={{ ...btnStyle, width: 80, padding: '6px 10px', alignSelf: 'flex-start' }} onClick={() => onRemoveItem('education', i)}>Remove</button>
          </div>
        ))}
      </Card>
    );

    case 'experience': return (
      <Card title="Add Experience">
        <input
          placeholder="Job title"
          value={drafts.experience.title}
          onChange={(e) => setDrafts((prev) => ({ ...prev, experience: { ...prev.experience, title: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Company"
          value={drafts.experience.company}
          onChange={(e) => setDrafts((prev) => ({ ...prev, experience: { ...prev.experience, company: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Duration"
          value={drafts.experience.duration}
          onChange={(e) => setDrafts((prev) => ({ ...prev, experience: { ...prev.experience, duration: e.target.value } }))}
          style={inputStyle}
        />
        <textarea
          placeholder="Responsibilities..."
          rows={3}
          value={drafts.experience.responsibilities}
          onChange={(e) => setDrafts((prev) => ({ ...prev, experience: { ...prev.experience, responsibilities: e.target.value } }))}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <button
          style={btnStyle}
          onClick={() => onAddItem('experience', drafts.experience, () => setDrafts((prev) => ({ ...prev, experience: { title: '', company: '', duration: '', responsibilities: '' } })))}
        >
          Save Experience
        </button>
        {(content.experience || []).map((x, i) => (
          <div key={`${x.title}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ color: '#cbd5e1', fontSize: 13 }}>{x.title} • {x.company} • {x.duration}</span>
            <button style={{ ...btnStyle, width: 80, padding: '6px 10px' }} onClick={() => onRemoveItem('experience', i)}>Remove</button>
          </div>
        ))}
      </Card>
    );

    case 'research': return (
      <Card title="Add Research Paper">
        <input
          placeholder="Paper title"
          value={drafts.research.title}
          onChange={(e) => setDrafts((prev) => ({ ...prev, research: { ...prev.research, title: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Conference / Journal"
          value={drafts.research.conference}
          onChange={(e) => setDrafts((prev) => ({ ...prev, research: { ...prev.research, conference: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Paper ID"
          value={drafts.research.paperId}
          onChange={(e) => setDrafts((prev) => ({ ...prev, research: { ...prev.research, paperId: e.target.value } }))}
          style={inputStyle}
        />
        <textarea
          placeholder="Short description"
          rows={3}
          value={drafts.research.description}
          onChange={(e) => setDrafts((prev) => ({ ...prev, research: { ...prev.research, description: e.target.value } }))}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <input
          placeholder="Teachers / Mentors"
          value={drafts.research.teachers}
          onChange={(e) => setDrafts((prev) => ({ ...prev, research: { ...prev.research, teachers: e.target.value } }))}
          style={inputStyle}
        />
        <button
          style={btnStyle}
          onClick={() => onAddItem('research', drafts.research, () => setDrafts((prev) => ({ ...prev, research: { title: '', conference: '', paperId: '', description: '', teachers: '' } })))}
        >
          Save Research
        </button>
        {(content.research || []).map((r, i) => (
          <div key={`${r.title}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ color: '#cbd5e1', fontSize: 13 }}>
              {r.title} • {r.conference}{r.paperId ? ` • ${r.paperId}` : ''}{r.teachers ? ` • ${r.teachers}` : ''}
            </span>
            <button style={{ ...btnStyle, width: 80, padding: '6px 10px' }} onClick={() => onRemoveItem('research', i)}>Remove</button>
          </div>
        ))}
      </Card>
    );

    case 'contact': return (
      <Card title="Contact Info">
        <input
          placeholder="Email"
          value={content.contact?.email || ''}
          onChange={(e) => setContent((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Phone"
          value={content.contact?.phone || ''}
          onChange={(e) => setContent((prev) => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Location"
          value={content.contact?.location || ''}
          onChange={(e) => setContent((prev) => ({ ...prev, contact: { ...prev.contact, location: e.target.value } }))}
          style={inputStyle}
        />
        <button style={btnStyle} onClick={() => onSaveSection('contact')}>Update Contact</button>
      </Card>
    );

    case 'resume': return (
  <Card title="Resume Upload">
    <input 
        type="file" 
        accept=".pdf,.doc,.docx" 
        onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
        style={{ ...inputStyle, padding: 10 }} 
    />
    {content.resume?.url && <p style={{fontSize: 12, color: '#22c55e'}}>✓ Resume saved</p>}
    <button style={btnStyle} onClick={() => onSaveSection('resume')}>Save Changes</button>
  </Card>
);

    case 'certif': return (
      <Card title="Add Certification">
        <input
          placeholder="Certification name"
          value={drafts.certif.name}
          onChange={(e) => setDrafts((prev) => ({ ...prev, certif: { ...prev.certif, name: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Issuing org"
          value={drafts.certif.org}
          onChange={(e) => setDrafts((prev) => ({ ...prev, certif: { ...prev.certif, org: e.target.value } }))}
          style={inputStyle}
        />
        <input
          type="date"
          placeholder="Date"
          value={drafts.certif.date}
          onChange={(e) => setDrafts((prev) => ({ ...prev, certif: { ...prev.certif, date: e.target.value } }))}
          style={inputStyle}
        />
        <button
          style={btnStyle}
          onClick={() => onAddItem('certif', drafts.certif, () => setDrafts((prev) => ({ ...prev, certif: { name: '', org: '', date: '' } })))}
        >
          Add Certification
        </button>
        {(content.certif || []).map((c, i) => (
          <div key={`${c.name}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ color: '#cbd5e1', fontSize: 13 }}>{c.name} • {c.org} • {c.date}</span>
            <button style={{ ...btnStyle, width: 80, padding: '6px 10px' }} onClick={() => onRemoveItem('certif', i)}>Remove</button>
          </div>
        ))}
      </Card>
    );

    case 'resources': return (
      <Card title="Resources">
        <select
          value={drafts.resource.type}
          onChange={(e) => setDrafts((prev) => ({ ...prev, resource: { ...prev.resource, type: e.target.value } }))}
          style={inputStyle}
        >
          <option value="">Select type</option>
          <option value="research">Research Paper</option>
          <option value="reading-material">Reading Material</option>
          <option value="publication">Publication</option>
        </select>
        <input
          placeholder="Resource title"
          value={drafts.resource.title}
          onChange={(e) => setDrafts((prev) => ({ ...prev, resource: { ...prev.resource, title: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Publication / Journal"
          value={drafts.resource.publication}
          onChange={(e) => setDrafts((prev) => ({ ...prev, resource: { ...prev.resource, publication: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="Publication ID / DOI"
          value={drafts.resource.identifier}
          onChange={(e) => setDrafts((prev) => ({ ...prev, resource: { ...prev.resource, identifier: e.target.value } }))}
          style={inputStyle}
        />
        <input
          placeholder="URL"
          value={drafts.resource.url}
          onChange={(e) => setDrafts((prev) => ({ ...prev, resource: { ...prev.resource, url: e.target.value } }))}
          style={inputStyle}
        />
        <button
          style={btnStyle}
          onClick={() => onAddItem('resources', drafts.resource, () => setDrafts((prev) => ({ ...prev, resource: { type: '', title: '', publication: '', identifier: '', url: '' } })))}
        >
          Add Resource
        </button>
        {(content.resources || []).map((r, i) => (
          <div key={`${r.title}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ color: '#cbd5e1', fontSize: 13 }}>
              {r.type} • {r.title}{r.publication ? ` • ${r.publication}` : ''}{r.identifier ? ` • ${r.identifier}` : ''}
            </span>
            <button style={{ ...btnStyle, width: 80, padding: '6px 10px' }} onClick={() => onRemoveItem('resources', i)}>Remove</button>
          </div>
        ))}
      </Card>
    );

    case 'social': return (
      <Card title="Social Media Links">
        {['github', 'linkedin', 'twitter', 'instagram', 'youtube'].map((s) => (
          <input
            key={s}
            placeholder={`${s.charAt(0).toUpperCase() + s.slice(1)} URL`}
            value={content.social?.[s] || ''}
            onChange={(e) => setContent((prev) => ({ ...prev, social: { ...prev.social, [s]: e.target.value } }))}
            style={inputStyle}
          />
        ))}
        <button style={btnStyle} onClick={() => onSaveSection('social')}>Save Links</button>
      </Card>
    );

    default: return null;
  }
};

const btnStyle = {
  background: 'linear-gradient(135deg,#4f46e5,#06b6d4)',
  border: 'none', borderRadius: 10, color: '#fff',
  padding: '12px 22px', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', letterSpacing: '0.04em', width: '100%',
};

// ── Live Content Popup ───────────────────────────────────────────────────────
const LivePopup = ({ projects, content, onClearSection, onRemoveItem, onRemoveProject, sections, onClose }) => {
  const published = projects.filter(p => p.published);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 600,
        maxHeight: '80vh', overflowY: 'auto', padding: '24px 20px 40px',
      }} onClick={e => e.stopPropagation()}>
        {/* handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#e2e8f0', margin: 0, fontSize: 18 }}>🌐 Live Portfolio Preview</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#e2e8f0', padding: '6px 12px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Published Projects ({published.length})</h4>
          {published.length === 0 && <p style={{ color: '#64748b', fontSize: 14 }}>No published content yet.</p>}
          {published.map((p, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 12,
              padding: '14px 16px', marginBottom: 10,
              borderLeft: '3px solid #06b6d4',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#e2e8f0', fontSize: 14 }}>{p.title}</strong>
                <span style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>LIVE</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '6px 0 0' }}>{p.description}</p>
              <span style={{ color: '#4f46e5', fontSize: 12 }}>{p.tech}</span>
              {p._id && (
                <button
                  onClick={() => onRemoveProject(p._id)}
                  style={{ marginTop: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', padding: '6px 10px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Summary</h4>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>{content.summary?.description || 'Empty'}</p>
          <button onClick={() => onClearSection('summary')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', padding: '6px 10px', cursor: 'pointer' }}>Clear</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Photo</h4>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>{content.photo?.url || 'Empty'}</p>
          <button onClick={() => onClearSection('photo')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', padding: '6px 10px', cursor: 'pointer' }}>Clear</button>
        </div>

        {[
          { id: 'skills', label: 'Skills' },
          { id: 'education', label: 'Education' },
          { id: 'experience', label: 'Experience' },
          { id: 'certif', label: 'Certifications' },
          { id: 'research', label: 'research' },
        ].map(group => (
          <div key={group.id} style={{ marginBottom: 24 }}>
            <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>{group.label}</h4>
            {(content[group.id] || []).length === 0 && <p style={{ color: '#64748b', fontSize: 14 }}>Empty</p>}
            {(content[group.id] || []).map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: 13 }}>{JSON.stringify(item)}</span>
                <button onClick={() => onRemoveItem(group.id, idx)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
              </div>
            ))}
          </div>
        ))}

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Contact</h4>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>
            {content.contact?.email || 'No email'} • {content.contact?.phone || 'No phone'} • {content.contact?.location || 'No location'}
          </p>
          <button onClick={() => onClearSection('contact')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', padding: '6px 10px', cursor: 'pointer' }}>Clear</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Resume</h4>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>{content.resume?.url || 'Empty'}</p>
          <button onClick={() => onClearSection('resume')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', padding: '6px 10px', cursor: 'pointer' }}>Clear</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>Social</h4>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>{JSON.stringify(content.social || {})}</p>
          <button onClick={() => onClearSection('social')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', padding: '6px 10px', cursor: 'pointer' }}>Clear</button>
        </div>

        <div>
          <h4 style={{ color: '#94a3b8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>All Sections Status</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {sections.map(s => (
              <div key={s.id} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>{s.icon}</span>
                <span style={{ color: '#cbd5e1', fontSize: 13 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const DEFAULT_CONTENT = {
    photo: { url: '' },
    summary: { description: '' },
    skills: [],
    projects: [],
    education: [],
    experience: [],
    research: [],
    resources: [],
    contact: { email: '', phone: '', location: '' },
    resume: { url: '' },
    certif: [],
    social: { github: '', linkedin: '', twitter: '', instagram: '', youtube: '' },
};
const DEFAULT_DRAFTS = {
    skill: { category: '', name: '' },
    education: { degree: '', institution: '', startDate: '', endDate: '', skills: '' },
    experience: { title: '', company: '', duration: '', responsibilities: '' },
    research: { title: '', conference: '', paperId: '', description: '', teachers: '' },
    certif: { name: '', org: '', date: '' },
    resource: { type: '', title: '', publication: '', identifier: '', url: '' },
};

const Dashboard = () => {
  const [projects, setProjects]     = useState([]);
  const [activeSection, setActiveSection] = useState('summary');
  const [content, setContent]       = useState(DEFAULT_CONTENT);
  const [drafts, setDrafts]         = useState(DEFAULT_DRAFTS);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tech: '', link: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);  // desktop: collapsed
  const [showLive, setShowLive]     = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const navigate = useNavigate();
  const mainRef  = useRef(null);
  const sectionRefs = useRef({});


  const handleFileUpload = async (file, section) => {
    if (!file) return;

    const cloudName = "dokway92z"; // Aapka latest cloud name
    const uploadPreset = "portfolio_preset"; // Jo aapne abhi banaya

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        console.log("Uploading to Cloudinary...");
    const resourceType =
      section === "photo" ? "image" : section === "resume" ? "raw" : "auto";

    const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
            { method: "POST", body: formData }
        );

        const data = await response.json();
        
        if (data.secure_url) {
            const fileUrl = data.secure_url;
            
            // 1. UI Update
            setContent((prev) => ({ 
                ...prev, 
                [section]: { ...prev[section], url: fileUrl } 
            }));

            // 2. MongoDB Update
            await upsertContent({ section, content: { url: fileUrl } });

            alert("Bhai, upload ho gaya! URL: " + fileUrl);
        }
    } catch (err) {
        console.error("Galti ho gayi:", err);
    }
};

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, contentRes] = await Promise.all([
          fetchProjects(),
          fetchContent(),
        ]);
        setProjects(projectsRes.data);
        if (contentRes.data?.length) {
          const next = { ...DEFAULT_CONTENT };
          contentRes.data.forEach((item) => {
            if (item.section) next[item.section] = item.content;
          });
          setContent(next);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        setProjects([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // scroll to section
  const scrollTo = (id) => {
    setActiveSection(id);
    if (isMobile) setSidebarOpen(false);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onAddProject = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      const payload = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        tech: projectForm.tech.trim(),
        link: projectForm.link.trim(),
        published: true,
      };
      if (!payload.title) {
        alert('Project title is required.');
        return;
      }

      await addProject(payload);
      const res = await fetchProjects();
      setProjects(res.data);
      setProjectForm({ title: '', description: '', tech: '', link: '' });
      alert('Project saved successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving data. Check backend connection.');
    }
  };

  const onSaveSection = async (section) => {
    try {
      await upsertContent({ section, content: content[section] });
      alert(`${section} saved successfully!`);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving data. Check backend connection.');
    }
  };

  const onAddItem = async (section, item, resetDraft) => {
    let itemsToAdd = [item];
    if (section === 'skills') {
      const category = String(item?.category || '').trim();
      const names = parseCommaList(item?.name);
      itemsToAdd = names.map((name) => ({ category, name }));
    }

    const hasValue = itemsToAdd.some((it) => Object.values(it || {}).some((v) => String(v || '').trim().length > 0));
    if (!hasValue) {
      alert('Please fill at least one field.');
      return;
    }

    const updated = [...(content[section] || []), ...itemsToAdd];
    setContent((prev) => ({ ...prev, [section]: updated }));
    if (resetDraft) resetDraft();
    try {
      await upsertContent({ section, content: updated });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving data. Check backend connection.');
    }
  };

  const onRemoveSkillCategory = async (category) => {
    const updated = (content.skills || []).filter((s) => (s.category || 'Uncategorized').trim() !== category);
    setContent((prev) => ({ ...prev, skills: updated }));
    try {
      await upsertContent({ section: 'skills', content: updated });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving data. Check backend connection.');
    }
  };

  const onRemoveItem = async (section, index) => {
    const updated = (content[section] || []).filter((_, i) => i !== index);
    setContent((prev) => ({ ...prev, [section]: updated }));
    try {
      await upsertContent({ section, content: updated });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving data. Check backend connection.');
    }
  };

  const onClearSection = async (section) => {
    const emptyValue = Array.isArray(DEFAULT_CONTENT[section])
      ? []
      : { ...DEFAULT_CONTENT[section] };
    setContent((prev) => ({ ...prev, [section]: emptyValue }));
    try {
      await upsertContent({ section, content: emptyValue });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving data. Check backend connection.');
    }
  };

  const onRemoveProject = async (id) => {
    try {
      await deleteProject(id);
      const res = await fetchProjects();
      setProjects(res.data);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Error removing project. Check backend connection.');
    }
  };

  const publishedProjects = projects.filter(p => p.published);

  // ── styles ──
  const S = {
    root: {
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: '#0b1120',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: '#e2e8f0',
    },

    // ── DESKTOP SIDEBAR ──
    sidebar: {
      width: sidebarOpen ? 220 : 68,
      minWidth: sidebarOpen ? 220 : 68,
      background: 'linear-gradient(180deg,#0f1e3d 0%,#0b1120 100%)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: isMobile ? 'none' : 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(.4,0,.2,1), min-width 0.3s',
      overflow: 'hidden',
      zIndex: 50,
    },

    sidebarHeader: {
      padding: '20px 14px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      minHeight: 64,
    },

    logo: {
      fontSize: 15, fontWeight: 800, letterSpacing: '0.08em',
      color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden',
      opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.2s',
    },

    hamburger: {
      background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
      color: '#e2e8f0', width: 36, height: 36, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, flexShrink: 0,
    },

    navList: {
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      padding: '12px 8px',
    },

    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: 12,
      width: '100%', padding: '10px 10px',
      background: active ? 'rgba(79,70,229,0.25)' : 'transparent',
      border: active ? '1px solid rgba(79,70,229,0.4)' : '1px solid transparent',
      borderRadius: 10, cursor: 'pointer', color: active ? '#a5b4fc' : '#94a3b8',
      fontSize: 14, fontWeight: active ? 600 : 400,
      transition: 'all 0.18s', whiteSpace: 'nowrap', overflow: 'hidden',
      marginBottom: 4,
    }),

    navIcon: { fontSize: 17, flexShrink: 0 },

    navLabel: {
      opacity: sidebarOpen ? 1 : 0,
      transition: 'opacity 0.2s',
      overflow: 'hidden',
    },

    sidebarFooter: {
      padding: '12px 8px 16px',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    },

    logoutBtn: {
      display: 'flex', alignItems: 'center', gap: 12,
      width: '100%', padding: '10px 10px',
      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 10, cursor: 'pointer', color: '#fca5a5',
      fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden',
    },

    // ── MOBILE BOTTOM NAV ──
    bottomNav: {
      display: isMobile ? 'flex' : 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(11,17,32,0.97)', borderTop: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(16px)',
      overflowX: 'auto', overflowY: 'hidden',
      scrollbarWidth: 'none',
      padding: '8px 4px 12px',
      gap: 0,
    },

    bottomItem: (active) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '6px 14px', cursor: 'pointer', flexShrink: 0,
      background: 'none', border: 'none', color: active ? '#a5b4fc' : '#64748b',
    }),

    // ── MAIN ──
    main: {
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    },

    header: {
      padding: isMobile ? '16px 16px 0' : '20px 32px 0',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(11,17,32,0.95)',
      backdropFilter: 'blur(8px)',
      zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      minHeight: 60, flexShrink: 0,
    },

    content: {
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      padding: isMobile ? '20px 16px 100px' : '32px 32px 40px',
      scrollBehavior: 'smooth',
    },

    sectionBlock: {
      scrollMarginTop: 20,
      marginBottom: 40,
    },

    sectionTitle: {
      fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#f1f5f9',
      marginBottom: 20, paddingBottom: 12,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', gap: 10,
    },

    liveBtn: {
      background: 'linear-gradient(135deg,#4f46e5,#06b6d4)',
      border: 'none', borderRadius: 20, color: '#fff',
      padding: '8px 16px', fontSize: 13, fontWeight: 700,
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      letterSpacing: '0.04em',
    },
  };

  return (
    <div style={S.root}>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHeader}>
          {sidebarOpen && <span style={S.logo}>ANKIT<span style={{ color: '#06b6d4' }}>.admin</span></span>}
          <button style={S.hamburger} onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        <div style={S.navList}>
          {NAV_SECTIONS.map(s => (
            <button key={s.id} style={S.navItem(activeSection === s.id)} onClick={() => scrollTo(s.id)}>
              <span style={S.navIcon}>{s.icon}</span>
              <span style={S.navLabel}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={S.sidebarFooter}>
          <button style={S.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login'); }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>🚪</span>
            <span style={S.navLabel}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main style={S.main}>
        {/* Header */}
        <header style={S.header}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 16 : 20, fontWeight: 700, color: '#f1f5f9' }}>
              {isMobile ? '⚡ Dashboard' : '⚡ Portfolio Manager'}
            </h1>
            {!isMobile && <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: 13 }}>kmarankit.netlify.app</p>}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Live content badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block' }} />
              <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 600 }}>{publishedProjects.length} LIVE</span>
            </div>

            {/* Live preview button — always visible */}
            <button style={S.liveBtn} onClick={() => setShowLive(true)}>
              🌐 {isMobile ? 'Live' : 'Live Preview'}
            </button>
          </div>
        </header>

        {/* Scrollable content with ALL sections */}
        <div ref={mainRef} style={S.content}>
          {NAV_SECTIONS.map(s => (
            <div
              key={s.id}
              ref={el => { sectionRefs.current[s.id] = el; }}
              style={S.sectionBlock}
              id={`section-${s.id}`}
            >
              <h2 style={S.sectionTitle}>
                <span>{s.icon}</span> {s.label}
              </h2>
              <SectionContent
                id={s.id}
                content={content}
                setContent={setContent}
                drafts={drafts}
                setDrafts={setDrafts}
                projectForm={projectForm}
                setProjectForm={setProjectForm}
                onSaveSection={onSaveSection}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
                onRemoveSkillCategory={onRemoveSkillCategory}
                onAddProject={onAddProject}
                handleFileUpload={handleFileUpload}
                isLive={publishedProjects.length > 0}
              />
            </div>
          ))}
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav style={S.bottomNav}>
        {NAV_SECTIONS.map(s => (
          <button key={s.id} style={S.bottomItem(activeSection === s.id)} onClick={() => scrollTo(s.id)}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <span style={{ fontSize: 10, letterSpacing: '0.02em' }}>{s.label.slice(0, 6)}</span>
          </button>
        ))}
      </nav>

      {/* ── LIVE CONTENT POPUP ── */}
      {showLive && (
        <LivePopup
          projects={projects}
          content={content}
          onClearSection={onClearSection}
          onRemoveItem={onRemoveItem}
          onRemoveProject={onRemoveProject}
          sections={NAV_SECTIONS}
          onClose={() => setShowLive(false)}
        />
      )}

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        nav::-webkit-scrollbar { display: none; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
        input:focus, textarea:focus {
          border-color: rgba(79,70,229,0.5) !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
        }
        input::placeholder, textarea::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

export default Dashboard;
