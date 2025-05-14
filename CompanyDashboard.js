import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import PostModal from './PostModal';

const dummyApplications = [
  { id: 1, student: 'Youssef Khaled', position: 'Frontend Developer Intern', status: 'Pending', date: '2025-05-02' },
  { id: 2, student: 'Salma Ahmed', position: 'Backend Developer Intern', status: 'Reviewed', date: '2025-04-22' }
];

const dummyReports = [
  { id: 1, title: 'Internship Progress Report', status: 'Submitted', feedback: 'Pending review' },
  { id: 2, title: 'Final Evaluation', status: 'Not Submitted', feedback: '-' }
];

const dummyNotifications = [
  { id: 1, message: 'New application received for Frontend Developer Intern', isNew: true },
  { id: 2, message: 'Internship "Backend Developer Intern" has closed', isNew: false }
];

const cardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
  padding: '28px',
  marginBottom: '32px',
};
const badge = {
  display: 'inline-block',
  borderRadius: '999px',
  padding: '2px 10px',
  fontSize: '13px',
  fontWeight: 500,
};
const badgeSuccess = { ...badge, background: '#D1FAE5', color: '#065F46' };
const badgeWarning = { ...badge, background: '#FEF3C7', color: '#92400E' };
const badgeDanger = { ...badge, background: '#FEE2E2', color: '#991B1B' };
const badgeInfo = { ...badge, background: '#DBEAFE', color: '#1E40AF' };

const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: 300,
  background: '#234B73',
  color: '#fff',
  boxShadow: '2px 0 16px rgba(0,0,0,0.10)',
  zIndex: 1001,
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
  zIndex: 1000,
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

const companyPosts = [
  {
    id: 'c1',
    title: 'Summer Internship: Software Engineer',
    content: 'We are looking for passionate students to join our summer internship program. Apply now for hands-on experience with real projects!',
    date: '2024-06-10',
  },
  {
    id: 'c2',
    title: 'UX Design Internship',
    content: 'We are offering a 3-month paid internship for UX Designers. Collaborate with top professionals and grow your skills.',
    date: '2024-06-08',
  },
  {
    id: 'c3',
    title: 'Product Management Intern',
    content: 'Seeking Product Management interns for the summer. Work on innovative products and learn from the best.',
    date: '2024-06-05',
  },
];

const navbarStyle = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2000,
};
const navInner = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 48px',
  maxWidth: 1600,
  margin: '0 auto',
};
const profileBtn = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: '#C0CEDB',
  color: '#234B73',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: 20,
  cursor: 'pointer',
  position: 'relative',
};

const CompanyDashboard = () => {
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [applications] = useState(dummyApplications);
  const [reports] = useState(dummyReports);
  const [posts, setPosts] = useState(companyPosts);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState('');
  const [openMenus, setOpenMenus] = useState([]);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState('Dashboard');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef();
  const [showPostModal, setShowPostModal] = useState(false);
  const [postHeader, setPostHeader] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [postMedia, setPostMedia] = useState({ photo: null, video: null, document: null });
  const [mediaURLs, setMediaURLs] = useState({ photo: null, video: null, document: null });
  const [postObjectURLs, setPostObjectURLs] = useState([]);
  const navigate = useNavigate();
  const companyName = user?.companyName || user?.fullName || 'Company Name';
  const logoUrl = user?.logo || 'https://via.placeholder.com/48x48.png?text=Logo';
  const companyInitial = user?.companyName ? user.companyName.charAt(0).toUpperCase() : 'N';

  // Add profile dropdown logic
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  useEffect(() => {
    const handleClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showProfileMenu]);

  // Sidebar menu structure (with linkages removed)
  const menuStructure = [
    {
      label: 'Dashboard',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
      submenu: [
        { label: 'Dashboard', action: () => { setActiveSubItem('Dashboard'); navigate('/company-dashboard'); setSidebarOpen(false); } },
        { label: 'Profile', action: () => { setActiveSubItem('Profile'); navigate('/company-profile'); setSidebarOpen(false); } },
      ],
    },
    {
      label: 'Internships',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
      submenu: [
        { label: 'Internships', action: () => { setActiveSubItem('Internships'); navigate('/company-internships'); setSidebarOpen(false); } },
      ],
    },
    {
      label: 'Applicants',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v2M8 3v2" /></svg>,
      submenu: [
        { label: 'View Applicants', action: () => { setActiveSubItem('View Applicants'); navigate('/company-applications'); setSidebarOpen(false); } },
      ],
    },
    {
      label: 'Interns',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>,
      submenu: [
        { label: 'Current Interns', action: () => { setActiveSubItem('Current Interns'); navigate('/company-current-interns'); setSidebarOpen(false); } },
      ],
    },
    {
      label: 'Internship Completers',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15l-2-2h4l-2 2z"/><path d="M3 4h18v16H3z"/></svg>,
      submenu: [
        { label: 'Evaluate Intern', action: () => { setActiveSubItem('Evaluate Intern'); navigate('/evaluate-intern'); setSidebarOpen(false); } },
      ],
    },
  ];

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  // Sidebar open/close logic (no hover)
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleMenuClick = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };
  const isMenuOpen = (label) => openMenus.includes(label);
  // Close menu on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

  useEffect(() => {
    return () => {
      postObjectURLs.forEach(urls => {
        Object.values(urls).forEach(url => url && URL.revokeObjectURL(url));
      });
    };
  }, [postObjectURLs]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postHeader.trim() && !postBody.trim() && !postMedia.photo && !postMedia.video && !postMedia.document) return;
    if (editingPostId) {
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === editingPostId
          ? { ...post, title: postHeader, content: postBody, media: postMedia, mediaURLs: { ...mediaURLs }, date: new Date().toISOString().slice(0, 10) }
          : post
      ));
      setEditingPostId(null);
    } else {
      setPosts(prevPosts => [
        {
          id: Date.now(),
          title: 'Summer Internship: Software Engineer',
          content: 'We are looking for passionate students to join our summer internship program. Apply now for hands-on experience with real projects!',
          date: '2024-06-10',
          media: postMedia,
          mediaURLs: { ...mediaURLs },
        },
        ...prevPosts,
      ]);
    }
    setPostObjectURLs(prev => [{ ...mediaURLs }, ...prev]);
    setPostHeader('');
    setPostBody('');
    setPostMedia({ photo: null, video: null, document: null });
    setMediaURLs({ photo: null, video: null, document: null });
    setShowPostModal(false);
  };

  const handleEditPost = (post) => {
    setPostHeader(post.title || '');
    setPostBody(post.content || '');
    setPostMedia(post.media || { photo: null, video: null, document: null });
    setMediaURLs(post.mediaURLs || { photo: null, video: null, document: null });
    setShowPostModal(true);
    setPostMenuOpen(null);
    setEditingPostId(post.id);
  };

  const handleDeletePost = (id) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
    setPostMenuOpen(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {/* Blue Header Bar */}
      <nav style={navbarStyle}>
        <div style={navInner}>
          {/* Burger menu button */}
          <button style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 28,
            cursor: 'pointer',
            marginRight: 18,
            padding: 4,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} onClick={handleSidebarOpen} aria-label="Open sidebar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontWeight: 700, fontSize: 26, letterSpacing: 0.5, cursor: 'pointer', margin: '0 auto' }} onClick={() => navigate('/company-dashboard')}>GUC Internship System</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
            <div style={profileBtn} onClick={() => setShowProfileMenu(v => !v)} title="Company Profile">
              {companyInitial}
            </div>
            {showProfileMenu && (
              <div ref={profileMenuRef} style={{ position: 'absolute', top: 50, right: 0, background: '#fff', color: '#234B73', borderRadius: 14, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', minWidth: 260, zIndex: 100, padding: '18px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 10px 20px', borderBottom: '1px solid #eee' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>
                    {companyInitial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{companyName}</div>
                    <div style={{ color: '#8C8C8C', fontSize: 13 }}>{user?.email || '--'}</div>
                  </div>
                </div>
                <button
                  style={{ width: '90%', margin: '14px 5%', padding: '8px 0', borderRadius: 22, border: '1.5px solid #234B73', color: '#234B73', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}
                  onClick={() => { setShowProfileMenu(false); navigate('/company-profile'); }}
                >
                  View Profile
                </button>
                <div style={{ borderTop: '1px solid #eee', margin: '10px 0' }} />
                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    style={{ background: 'none', border: 'none', color: '#F08F36', fontWeight: 600, fontSize: 15, textAlign: 'left', padding: '8px 0', cursor: 'pointer' }}
                    onClick={() => { setShowProfileMenu(false); logout(); navigate('/login'); }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: 80 }}>
      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <>
          <div style={sidebarOverlay} onClick={handleSidebarClose} />
          <div style={sidebarStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 18 }}>
              <button
                onClick={handleSidebarClose}
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
                      {item.submenu.map((sub) => (
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
                          onClick={e => { e.stopPropagation(); setActiveSubItem(sub.label); sub.action(); }}
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

      {/* Main Content */}
      <div style={{ background: '#f5f7fa', borderRadius: 24, padding: '48px 0', maxWidth: 1500, margin: '0 auto 40px auto', boxShadow: '0 2px 24px rgba(35,75,115,0.07)', marginTop: 72 }}>
          {/* Feed Row: 3-column layout: left (Applications), center (Add Post + posts), right (Report) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 64,
          margin: '0 auto',
          width: '100%',
          maxWidth: 1400,
          minHeight: 600,
        }}>
            {/* Applications Card (left) */}
          <div style={{
            ...cardStyle,
            borderLeft: '5px solid #F08F36',
            width: 320,
            minWidth: 280,
            maxWidth: 340,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '36px 32px',
            marginBottom: 32,
          }}>
              <div style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 4, marginTop: 4 }}>Applications Received</div>
              <div style={{ color: '#8C8C8C', fontSize: 17, marginBottom: 24 }}>See who applied to your internships.</div>
            <div style={{ marginTop: 32, width: '100%' }}>
              <div style={{ color: '#234B73', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Recent Applications</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                        <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Student</th>
                      <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Position</th>
                      <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Date</th>
                      <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '10px 0', color: '#234B73', fontSize: 15 }}>{app.student}</td>
                        <td style={{ padding: '10px 0', color: '#8C8C8C', fontSize: 15 }}>{app.position}</td>
                        <td style={{ padding: '10px 0', color: '#8C8C8C', fontSize: 15 }}>{app.date}</td>
                        <td style={{ padding: '10px 0' }}>
                            <span style={app.status === 'Reviewed' ? badgeSuccess : badgeWarning}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Center: Add Post + Posts Feed */}
          <div style={{
            flex: 2,
            minWidth: 0,
            maxWidth: 800,
            width: '100%',
            padding: '0 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 600,
          }}>
            {/* Add Post Button/Input */}
            <div style={{ marginBottom: 32, width: '100%' }}>
              <button
                style={{
                  width: '100%',
                  background: '#fff',
                  border: '1.5px solid #C0CEDB',
                  borderRadius: 18,
                  padding: '22px 32px',
                  fontSize: 20,
                  color: '#234B73',
                  fontWeight: 500,
                  textAlign: 'left',
                  boxShadow: '0 2px 12px rgba(35,75,115,0.09)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() => setShowPostModal(true)}
              >
                <span style={{ opacity: 0.7, fontSize: 18 }}>Share an update, photo, or document...</span>
              </button>
            </div>
            <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 24, marginBottom: 24, marginLeft: 8, width: '100%', textAlign: 'left' }}>Posts</h2>
            <div style={{ width: '100%' }}>
                {[...posts]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(post => (
                      <div key={post.id} style={{
                        background: '#fff',
                        borderRadius: '22px',
                        boxShadow: '0 8px 36px rgba(35,75,115,0.14)',
                        padding: '24px 28px',
                        marginBottom: 40,
                        color: '#234B73',
                        fontSize: 18,
                        fontWeight: 500,
                      border: '2px solid #F08F36',
                        transition: 'box-shadow 0.2s',
                        width: '100%',
                        maxWidth: '100%',
                        position: 'relative',
                      }}>
                        {/* Poster info (always at top) */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F08F36', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginRight: 16, boxShadow: '0 2px 8px rgba(35,75,115,0.10)' }}>
                          {companyName[0]}
                          </div>
                          <div>
                          <span style={{ fontWeight: 700, color: '#F08F36', fontSize: 20 }}>{companyName}</span>
                            <div style={{ color: '#8C8C8C', fontSize: 15, fontWeight: 400 }}>{post.date}</div>
                          </div>
                          {/* Three-dot menu for user posts */}
                            <div style={{ marginLeft: 'auto', position: 'relative' }}>
                              <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 22, color: '#8C8C8C' }}
                                onClick={() => setPostMenuOpen(post.id === postMenuOpen ? null : post.id)}
                                aria-label="Post options"
                              >
                                ⋮
                              </button>
                              {postMenuOpen === post.id && (
                                <div style={{ position: 'absolute', top: 32, right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 12px rgba(35,75,115,0.10)', zIndex: 10, minWidth: 120 }}>
                                  <button style={{ width: '100%', background: 'none', border: 'none', padding: '10px 16px', textAlign: 'left', color: '#234B73', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleEditPost(post)}>
                                    Edit
                                  </button>
                                  <button style={{ width: '100%', background: 'none', border: 'none', padding: '10px 16px', textAlign: 'left', color: '#F08F36', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDeletePost(post.id)}>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                        </div>
                        {post.title && <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 10, color: '#234B73' }}>{post.title}</div>}
                        <p style={{ color: '#1a3a5a', margin: '0 0 14px 0', fontWeight: 400, fontSize: 16 }}>{post.content}</p>
                        {post.media && (
                          <div style={{ marginTop: 10 }}>
                            {post.media.photo && post.mediaURLs && post.mediaURLs.photo && (
                              <img src={post.mediaURLs.photo} alt="post-img" style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 10, marginBottom: 8 }} />
                            )}
                            {post.media.video && post.mediaURLs && post.mediaURLs.video && (
                              <video controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 10, marginBottom: 8 }}>
                                <source src={post.mediaURLs.video} />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {post.media.document && post.mediaURLs && post.mediaURLs.document && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#C0CEDB', borderRadius: 8, padding: '6px 12px', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>
                                <svg width="20" height="20" fill="none" stroke="#234B73" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
                                {post.media.document.name}
                                <button
                                  type="button"
                                  style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', marginLeft: 8, cursor: 'pointer', fontWeight: 500 }}
                                  onClick={() => window.open(post.mediaURLs.document, '_blank')}
                                >
                                  View
                                </button>
                                <a
                                  href={post.mediaURLs.document}
                                  download={post.media.document.name}
                                  style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', marginLeft: 6, cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}
                                >
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                ))}
            </div>
          </div>
            {/* Reports Card (right) */}
          <div style={{
            ...cardStyle,
            borderLeft: '5px solid #234B73',
            width: 320,
            minWidth: 280,
            maxWidth: 340,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '36px 32px',
            marginBottom: 32,
          }}>
              <div style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 4, marginTop: 4 }}>Company Reports</div>
              <div style={{ color: '#8C8C8C', fontSize: 17, marginBottom: 24 }}>View your company's reports and feedback.</div>
            <div style={{ marginTop: 32, width: '100%' }}>
              <div style={{ color: '#234B73', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Recent Reports</div>
              <div>
                {reports.map(report => (
                  <div key={report.id} style={{ border: '1px solid #C0CEDB', borderRadius: 10, padding: 16, marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#234B73', fontWeight: 600, fontSize: 16 }}>{report.title}</div>
                        <span style={report.status === 'Submitted' ? badgeSuccess : badgeInfo}>{report.status}</span>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 24 }}>
                      <div>
                        <div style={{ color: '#8C8C8C', fontSize: 13 }}>Feedback</div>
                        <div style={{ color: '#234B73', fontWeight: 600 }}>{report.feedback}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          {/* Notifications */}
          <div style={cardStyle}>
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <ul>
              {notifications.length === 0 ? (
                <li className="text-gray-500">No new notifications</li>
              ) : notifications.map(n => (
                <li key={n.id} className={n.isNew ? 'font-bold text-blue-800' : 'text-gray-700'}>
                  {n.message}
                </li>
              ))}
            </ul>
        </div>
      </div>
      {/* PostModal for Add Post */}
      <PostModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handlePostSubmit}
        postHeader={postHeader}
        setPostHeader={setPostHeader}
        postBody={postBody}
        setPostBody={setPostBody}
        postMedia={postMedia}
        setPostMedia={setPostMedia}
        mediaURLs={mediaURLs}
        setMediaURLs={setMediaURLs}
          userName={companyName}
          userInitials={companyName[0]}
        />
        </div>
    </div>
  );
};

export default CompanyDashboard;