import React, { useState, useRef } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const headerGradient = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  color: '#fff',
  padding: '0',
  textAlign: 'center',
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  position: 'relative',
  zIndex: 1,
  height: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const headerInner = {
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
};
const headerTitle = {
  fontWeight: 700,
  fontSize: 26,
  letterSpacing: 0.5,
  flex: 1,
  textAlign: 'center',
};
const logoutBtn = {
  background: 'none',
  border: '1.5px solid #fff',
  color: '#fff',
  borderRadius: 8,
  padding: '8px 24px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  marginLeft: 24,
  boxShadow: '0 2px 8px #234B73',
  transition: 'background 0.2s',
};
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
  position: 'relative',
  zIndex: 2,
};
const profileHeaderStyle = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  padding: '60px 0 30px 0',
  marginBottom: '80px',
  position: 'relative',
};
const profileCardStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  padding: '24px',
  marginBottom: '24px',
};
const avatarStyle = {
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: '#C0CEDB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 32,
  color: '#234B73',
  fontWeight: 700,
  border: '3px solid #fff',
  boxShadow: '0 2px 8px #C0CEDB',
  position: 'relative',
};
const nameStyle = {
  color: '#234B73',
  fontWeight: 700,
  fontSize: 24,
  margin: '0 0 4px 0',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
const labelStyle = {
  color: '#234B73',
  fontWeight: 600,
  fontSize: 15,
  marginRight: 8,
};
const valueStyle = {
  color: '#1a3a5a',
  fontWeight: 500,
  fontSize: 15,
};
const sectionTitleStyle = {
  color: '#234B73',
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '2px solid #C0CEDB'
};
const gridLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '24px',
  marginTop: '24px',
};
const cardStyle = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  padding: 24,
  marginBottom: 24,
};
const headerExtension = {
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  padding: '0 0 0 60px',
  height: 140,
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  marginBottom: 40,
};
const avatarLarge = {
  width: 100,
  height: 100,
  borderRadius: '50%',
  background: '#C0CEDB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 48,
  color: '#234B73',
  fontWeight: 700,
  border: '3px solid #fff',
  boxShadow: '0 2px 8px #C0CEDB',
  marginRight: 32,
};
const companyHeaderInfo = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  color: '#fff',
  gap: 4,
};
const companyNameStyle = {
  fontWeight: 700,
  fontSize: 28,
  marginBottom: 2,
};
const companyLocationStyle = {
  fontSize: 16,
  color: 'rgba(255,255,255,0.9)',
  marginBottom: 2,
};
const companyIndustryStyle = {
  fontSize: 15,
  color: 'rgba(255,255,255,0.8)',
};

const dummyCompany = {
  name: 'Nour Company',
  about: 'Nour Company is a leading tech firm specializing in innovative software solutions for businesses worldwide. We value creativity, teamwork, and growth.',
  website: 'https://nourcompany.com',
  location: 'Cairo, Egypt',
  industry: 'Software & IT Services',
};
const currentInternships = [
  { title: 'Frontend Developer Intern', description: 'Work with React and modern web technologies on real client projects.' },
  { title: 'Backend Developer Intern', description: 'Join our backend team to build scalable APIs and services.' },
  ];
  const previousInternships = [
  { title: 'UI/UX Designer Intern', description: 'Helped design user interfaces for our flagship products.' },
  { title: 'QA Engineer Intern', description: 'Tested and ensured quality for multiple releases.' },
];

const persistentHeader = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  color: '#fff',
  padding: '0',
  textAlign: 'center',
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  position: 'relative',
  zIndex: 1,
  height: 70,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const persistentHeaderInner = {
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
};
const persistentHeaderTitle = {
  fontWeight: 700,
  fontSize: 26,
  letterSpacing: 0.5,
  flex: 1,
  textAlign: 'center',
};

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: 300,
  background: '#234B73',
  color: '#fff',
  boxShadow: '2px 0 16px rgba(0,0,0,0.10)',
  zIndex: 2001,
  padding: '32px 18px 18px 18px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s',
};
const sidebarOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 2000,
};
const sidebarMenuItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
  fontSize: 17,
  fontWeight: 500,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'background 0.15s',
};
const sidebarMenuSection = {
  borderRadius: 10,
  marginBottom: 6,
  transition: 'background 0.15s',
};
const sidebarSubMenu = {
  paddingLeft: 18,
  paddingBottom: 8,
  paddingTop: 2,
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer',
};
const sidebarActiveItem = {
  background: '#35708E',
  borderRadius: 7,
  color: '#fff',
  fontWeight: 600,
};

const menuStructure = [
  {
    label: 'Main',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
    submenu: [
      { label: 'Dashboard', action: (navigate) => navigate('/company-dashboard') },
      { label: 'Company Profile', action: (navigate) => navigate('/company-profile') },
    ],
  },
  {
    label: 'Internships',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
    submenu: [
      { label: 'My Internships', action: (navigate) => navigate('/company-internships') },
    ],
  },
  {
    label: 'Applications',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v2M8 3v2" /></svg>,
    submenu: [
      { label: 'Applications Received', action: (navigate) => navigate('/company-applications') },
    ],
  },
  {
    label: 'Reports',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>,
    submenu: [
      { label: 'Company Reports', action: (navigate) => navigate('/company-reports') },
    ],
  },
  {
    label: 'Settings',
    icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
    submenu: [
      { label: 'Settings', action: (navigate) => navigate('/company-settings') },
    ],
  },
];

const companyPosts = [
  {
    id: 1,
    title: 'New Summer 2024 Software Engineering Internship Program',
    content: 'We are excited to announce our Summer 2024 Software Engineering Internship Program! Looking for passionate students with strong programming fundamentals and eagerness to learn. Duration: 3 months (June-August). Apply through the portal by April 30th.',
    date: '2024-03-15',
  },
  {
    id: 2,
    title: 'FAQ: Application Process for Data Science Internship',
    content: 'Common questions about our Data Science internship:\n1. What skills are required? Python, SQL, and basic statistics\n2. Is it remote or on-site? Hybrid model available\n3. Application deadline? April 15th, 2024\n4. Interview process? Technical assessment followed by 2 interviews',
    date: '2024-03-10',
  },
  {
    id: 3,
    title: 'Meet Our Previous Interns: Success Stories',
    content: 'Proud to share that 80% of our 2023 summer interns received full-time offers! Read about their experiences and projects on our company blog. Applications for Summer 2024 are now open!',
    date: '2024-03-05',
  },
  {
    id: 4,
    title: 'Important Update: Technical Assessment Platform',
    content: 'For all internship applicants: We have updated our technical assessment platform. Please ensure you have a stable internet connection and a quiet environment for the best experience. Assessment duration: 2 hours.',
    date: '2024-03-01',
  },
  {
    id: 5,
    title: 'Internship Spotlight: UI/UX Design Position',
    content: 'New opening for UI/UX Design interns! Looking for creative minds with: \n- Figma proficiency\n- Understanding of design principles\n- Portfolio of previous work\nDuration: 6 months with possibility of extension.',
    date: '2024-02-28',
  }
];
const postsCardStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  padding: '24px',
  marginBottom: '24px',
};
const sectionTitleStylePosts = {
  color: '#234B73',
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '2px solid #C0CEDB',
};
const postInputStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: '#F5F7FA',
  borderRadius: 20,
  padding: '12px 18px',
  marginBottom: 24,
  border: '1px solid #C0CEDB',
  color: '#8C8C8C',
  fontSize: 16,
  fontWeight: 500,
  transition: 'background 0.2s',
};
const postAvatarStyle = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: '#C0CEDB',
  color: '#234B73',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 20,
};
const postCard = {
  background: '#fff',
  borderRadius: '14px',
  boxShadow: '0 4px 24px rgba(35,75,115,0.10)',
  padding: '22px 28px',
  marginBottom: 24,
  color: '#234B73',
  fontSize: 17,
  fontWeight: 500,
  borderLeft: '6px solid #234B73',
  transition: 'box-shadow 0.2s',
};
const postTitle = {
  fontWeight: 700,
  fontSize: 19,
  marginBottom: 8,
  color: '#234B73',
};
const postDate = {
  color: '#8C8C8C',
  fontSize: 14,
  marginBottom: 12,
};

const CompanyProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState('Dashboard');

  const handleMenuClick = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };
  const isMenuOpen = (label) => openMenus.includes(label);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {/* Persistent GUC Internship System Header */}
      <div style={persistentHeader}>
        <div style={persistentHeaderInner}>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', marginRight: 18 }} onClick={() => setSidebarOpen(true)} title="Open menu">☰</button>
          <div style={persistentHeaderTitle}>GUC Internship System</div>
          <button style={logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>
      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <>
          <div style={sidebarOverlay} onClick={() => setSidebarOpen(false)} />
          <div style={sidebarStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 18 }}>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: '#fff',
                  fontSize: 28,
                  lineHeight: 1,
                  borderRadius: 6,
                  transition: 'background 0.15s',
                }}
                aria-label="Close sidebar"
                onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Menu Search..."
              style={{
                width: '90%',
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                marginBottom: 24,
                fontSize: 16,
                color: '#234B73',
                background: '#fff',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {menuStructure.map((item, idx) => (
                <div key={item.label}>
                  <div
                    style={{
                      ...sidebarMenuItem,
                      ...sidebarMenuSection,
                      position: 'relative',
                      flexDirection: 'row',
                      alignItems: 'center',
                      background: isMenuOpen(item.label) ? '#35708E' : 'none',
                      color: isMenuOpen(item.label) ? '#fff' : '#fff',
                      fontWeight: isMenuOpen(item.label) ? 700 : 500,
                    }}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    <span>{item.icon}</span>
                    <span style={{ fontWeight: isMenuOpen(item.label) ? 700 : 500 }}>{item.label}</span>
                    <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 'auto', opacity: 0.7, transform: isMenuOpen(item.label) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9" /></svg>
        </div>
                  {/* Submenu as a vertical list below the open menu */}
                  {isMenuOpen(item.label) && (
                    <div style={{ marginLeft: 0, marginTop: 0, marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {item.submenu.map((sub, subIdx) => (
                        <div
                          key={sub.label}
                          style={{
                            ...sidebarSubMenu,
                            ...(activeSubItem === sub.label ? sidebarActiveItem : {}),
                            marginBottom: 2,
                            borderRadius: 7,
                            padding: '10px 18px',
                            display: 'block',
                          }}
                          onClick={e => { e.stopPropagation(); setActiveSubItem(sub.label); sub.action(navigate); setSidebarOpen(false); }}
                          onMouseOver={e => e.currentTarget.style.background = '#35708E'}
                          onMouseOut={e => e.currentTarget.style.background = 'none'}
                        >
                          {sub.label}
                        </div>
                      ))}
          </div>
        )}
      </div>
              ))}
            </div>
          </div>
        </>
      )}
      {/* Blue Extension below header */}
      <div style={headerExtension}>
        <div style={avatarLarge}>{dummyCompany.name[0]}</div>
        <div style={companyHeaderInfo}>
          <div style={companyNameStyle}>{dummyCompany.name}</div>
          <div style={companyLocationStyle}>Founded 2012</div>
          <div style={companyIndustryStyle}>{dummyCompany.industry}</div>
        </div>
      </div>
      <div style={containerStyle}>
        <div style={gridLayoutStyle}>
          {/* Left Column: Basic Information Card */}
          <div>
            <div style={{ ...profileCardStyle, padding: '40px 40px', minWidth: 420, fontSize: 18 }}>
              <h2 style={{ ...sectionTitleStyle, fontSize: 24 }}>Basic Information</h2>
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...labelStyle, fontSize: 18, marginBottom: 2 }}>About:</div>
                <div style={{ ...valueStyle, fontSize: 17 }}>{dummyCompany.about}</div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...labelStyle, fontSize: 18, marginBottom: 2 }}>Website:</div>
                <a href={dummyCompany.website} target="_blank" rel="noopener noreferrer" style={{ ...valueStyle, color: '#234B73', textDecoration: 'underline', fontSize: 17 }}>{dummyCompany.website}</a>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ ...labelStyle, fontSize: 18, marginBottom: 2 }}>Location:</div>
                <div style={{ ...valueStyle, fontSize: 17 }}>{dummyCompany.location}</div>
              </div>
            </div>
            {/* Posts Card for Company */}
            <div style={postsCardStyle}>
              <h2 style={sectionTitleStylePosts}>Posts</h2>
              <div style={postInputStyle}>
                <div style={postAvatarStyle}>{dummyCompany.name[0]}</div>
                What's on your mind, {dummyCompany.name.split(' ')[0]}?
              </div>
              {companyPosts.map(post => (
                <div key={post.id} style={postCard}>
                  <div style={postTitle}>{post.title}</div>
                  <div style={postDate}>{post.date}</div>
                  <div style={{ color: '#1a3a5a', margin: '0 0 14px 0', fontWeight: 400, fontSize: 16 }}>{post.content}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Column: Internships */}
          <div>
            {/* Current Internships */}
            <div style={cardStyle}>
              <div style={sectionTitleStyle}>Current Internships</div>
              {currentInternships.map((intern, idx) => (
                <div key={idx} style={{ borderLeft: '5px solid #F08F36', paddingLeft: 12, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>{intern.title}</div>
                  <div style={{ color: '#8C8C8C', fontSize: 15 }}>{intern.description}</div>
                </div>
              ))}
            </div>
          {/* Previous Internships */}
            <div style={cardStyle}>
              <div style={sectionTitleStyle}>Previous Internships</div>
              {previousInternships.map((intern, idx) => (
                <div key={idx} style={{ borderLeft: '5px solid #234B73', paddingLeft: 12, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>{intern.title}</div>
                  <div style={{ color: '#8C8C8C', fontSize: 15 }}>{intern.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile; 