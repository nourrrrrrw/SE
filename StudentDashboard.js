import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import PostModal from './PostModal';
import Navbar from './Navbar';

const dummyApplications = [
  { id: 1, company: 'Microsoft', position: 'Software Engineer', status: 'Pending', date: '2025-04-25' },
  { id: 2, company: 'Google', position: 'UX Designer', status: 'Approved', date: '2025-04-20' },
  { id: 3, company: 'Amazon', position: 'Product Manager', status: 'Rejected', date: '2025-04-15' }
];

const dummyReports = [
  { id: 1, title: 'Week 1 Report', status: 'Submitted', grade: 'N/A', feedback: 'Pending review' },
  { id: 2, title: 'Week 2 Report', status: 'Graded', grade: 'A', feedback: 'Excellent work!' }
];

const dummyNotifications = [
  { id: 1, message: 'Your internship application has been approved', isNew: true },
  { id: 2, message: 'New internship opportunity at Google', isNew: true },
  { id: 3, message: 'Deadline for submission is approaching', isNew: false }
];

const cardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
  padding: '28px',
  marginBottom: '32px',
};

const buttonPrimary = {
  backgroundColor: '#234B73',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '10px 18px',
  fontWeight: 500,
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: '8px',
  transition: 'background 0.2s',
};
const buttonSecondary = {
  backgroundColor: '#F08F36',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '10px 18px',
  fontWeight: 500,
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: '8px',
  transition: 'background 0.2s',
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
const sidebarMenuItemHover = {
  background: '#C0CEDB',
  color: '#234B73',
};

const sidebarMenuSection = {
  borderRadius: 10,
  marginBottom: 6,
  transition: 'background 0.15s',
};
const sidebarMenuSectionOpen = {
  background: '#35708E',
};
const sidebarSubMenu = {
  paddingLeft: 18,
  paddingBottom: 8,
  paddingTop: 2,
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer',
};
const sidebarSubMenuActive = {
  color: '#F08F36',
  fontWeight: 600,
};

const sidebarActiveItem = {
  background: '#35708E',
  borderRadius: 7,
  color: '#fff',
  fontWeight: 600,
};
const sidebarVerticalLine = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 4,
  background: '#fff',
  borderRadius: 2,
};

// Add dummy company posts for the dashboard feed
const companyPosts = [
  {
    id: 'c1',
    title: 'Summer Internship: Software Engineer',
    content: 'Microsoft is looking for passionate students to join our summer internship program. Apply now for hands-on experience with real projects!',
    date: '2024-06-10',
    company: 'Microsoft',
  },
  {
    id: 'c2',
    title: 'UX Design Internship',
    content: 'Google is offering a 3-month paid internship for UX Designers. Collaborate with top professionals and grow your skills.',
    date: '2024-06-08',
    company: 'Google',
  },
  {
    id: 'c3',
    title: 'Product Management Intern',
    content: 'Amazon is seeking Product Management interns for the summer. Work on innovative products and learn from the best.',
    date: '2024-06-05',
    company: 'Amazon',
  },
];

const StudentDashboard = ({ posts, setPosts, ...props }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [applications] = useState(dummyApplications);
  const [reports] = useState(dummyReports);
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
  const [postMedia, setPostMedia] = useState({ photo: null, video: null, document: null });
  const [mediaURLs, setMediaURLs] = useState({ photo: null, video: null, document: null });
  const [postObjectURLs, setPostObjectURLs] = useState([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const notificationsDropdownRef = useRef();
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Get first name initial and full name for welcome
  const firstInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S';
  const displayName = user?.fullName || 'Student';

  const menuStructure = [
    {
      label: 'Main',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 8-4 8-4s8 0 8 4" /></svg>,
      submenu: [
        { label: 'Dashboard', action: () => navigate('/dashboard') },
        { label: 'My Profile', action: () => navigate('/profile') },
      ],
    },
    {
      label: 'Internships',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
      submenu: [
        { label: 'My Internships', action: () => navigate('/my-internships') },
        { label: 'Browse Internships', action: () => navigate('/browse-internships') },
      ],
    },
    {
      label: 'Reservation',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v2M8 3v2" /></svg>,
      submenu: [
        { label: 'SCAD Appointment', action: () => alert('SCAD Appointment') },
        { label: 'Career Workshop', action: () => alert('Career Workshop') },
        { label: 'Online Assessments', action: () => alert('Online Assessments') },
      ],
    },
    {
      label: 'Certificates',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>,
      submenu: [
        { label: 'My Certificate', action: () => alert('My Certificate') },
      ],
    },
    {
      label: 'Opportunities',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>,
      submenu: [
        { label: 'Browse Opportunities', action: () => navigate('/browse-internships') },
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

  // Clean up all post object URLs on unmount
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
          title: postHeader,
          content: postBody,
          date: new Date().toISOString().slice(0, 10),
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => {
        // Only add if not already present
        if (prev.some(n => n.message === 'Your application has been accepted!')) return prev;
        return [
          { id: Date.now(), message: 'Your application has been accepted!', isNew: true },
          ...prev,
        ];
      });
      setShowToast(true);
      // Hide toast after 10 seconds
      setTimeout(() => setShowToast(false), 10000);
    }, 20000); // 20 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <Navbar />
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
        {/* Feed Row: 3-column layout: left (Apply), center (Add Post + posts), right (Report) */}
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
          {/* Apply for Internship Card (left) */}
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
            <div style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 4, marginTop: 4 }}>Apply for Internship</div>
            <div style={{ color: '#8C8C8C', fontSize: 17, marginBottom: 24 }}>Browse through available internship opportunities.</div>
            <button style={{
              background: '#F08F36',
              color: '#fff',
              border: 'none',
              borderRadius: 7,
              padding: '16px 32px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 8px #F08F36',
              transition: 'background 0.2s',
            }} onClick={() => navigate('/browse-internships')}>Browse Opportunities →</button>
            {/* Recent Applications below */}
            <div style={{ marginTop: 32, width: '100%' }}>
              <div style={{ color: '#234B73', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Recent Applications</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Company</th>
                      <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Position</th>
                      <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Date</th>
                      <th style={{ color: '#234B73', fontWeight: 700, fontSize: 15, textAlign: 'left', padding: '8px 0', background: '#C0CEDB' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '10px 0', color: '#234B73', fontSize: 15 }}>{app.company}</td>
                        <td style={{ padding: '10px 0', color: '#8C8C8C', fontSize: 15 }}>{app.position}</td>
                        <td style={{ padding: '10px 0', color: '#8C8C8C', fontSize: 15 }}>{app.date}</td>
                        <td style={{ padding: '10px 0' }}>
                          <span style={app.status === 'Approved' ? badgeSuccess : app.status === 'Rejected' ? badgeDanger : badgeWarning}>
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
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#234B73', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>
                  {firstInitial}
                </div>
                <span style={{ opacity: 0.7, fontSize: 18 }}>Share an update, photo, or document...</span>
              </button>
            </div>
            <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 24, marginBottom: 24, marginLeft: 8, width: '100%', textAlign: 'left' }}>Posts</h2>
            <div style={{ width: '100%' }}>
              {[...companyPosts, ...posts]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(post => (
                  (() => {
                    const isCompany = !!post.company;
                    const isUserPost = !isCompany;
                    const posterName = isCompany ? post.company : displayName;
                    const posterInitials = isCompany
                      ? post.company[0]
                      : (user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : firstInitial);
                    const avatarBg = isCompany ? '#F08F36' : '#234B73';
                    const avatarColor = '#fff';
                    const nameColor = isCompany ? '#F08F36' : '#234B73';
                    return (
                      <div key={post.id} style={{
                        background: '#fff',
                        borderRadius: '22px',
                        boxShadow: '0 8px 36px rgba(35,75,115,0.14)',
                        padding: '24px 28px',
                        marginBottom: 40,
                        color: '#234B73',
                        fontSize: 18,
                        fontWeight: 500,
                        border: isCompany ? '2px solid #F08F36' : '2px solid #C0CEDB',
                        transition: 'box-shadow 0.2s',
                        width: '100%',
                        maxWidth: '100%',
                        position: 'relative',
                      }}>
                        {/* Poster info (always at top) */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: avatarBg, color: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginRight: 16, boxShadow: '0 2px 8px rgba(35,75,115,0.10)' }}>
                            {posterInitials}
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, color: nameColor, fontSize: 20 }}>{posterName}</span>
                            <div style={{ color: '#8C8C8C', fontSize: 15, fontWeight: 400 }}>{post.date}</div>
                          </div>
                          {/* Three-dot menu for user posts */}
                          {isUserPost && (
                            <div style={{ marginLeft: 'auto', position: 'relative' }}>
                              <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 22, color: '#8C8C8C' }}
                                onClick={() => setPostMenuOpen(post.id === postMenuOpen ? null : post.id)}
                                aria-label="Post options"
                              >
                                &#8942;
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
                          )}
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
                    );
                  })()
                ))}
            </div>
          </div>
          {/* Submit Weekly Report Card (right) */}
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
            <div style={{ color: '#234B73', fontWeight: 700, fontSize: 22, marginBottom: 4, marginTop: 4 }}>Submit Weekly Report</div>
            <div style={{ color: '#8C8C8C', fontSize: 17, marginBottom: 24 }}>Submit your weekly progress report for evaluation.</div>
            <button style={{
              background: '#234B73',
              color: '#fff',
              border: 'none',
              borderRadius: 7,
              padding: '16px 32px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 8px #234B73',
              transition: 'background 0.2s',
            }} onClick={() => alert('Submit Report')}>Submit Report →</button>
            {/* Recent Reports below */}
            <div style={{ marginTop: 32, width: '100%' }}>
              <div style={{ color: '#234B73', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Recent Reports</div>
              <div>
                {reports.map(report => (
                  <div key={report.id} style={{ border: '1px solid #C0CEDB', borderRadius: 10, padding: 16, marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#234B73', fontWeight: 600, fontSize: 16 }}>{report.title}</div>
                      <span style={report.status === 'Graded' ? badgeSuccess : badgeInfo}>{report.status}</span>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 24 }}>
                      <div>
                        <div style={{ color: '#8C8C8C', fontSize: 13 }}>Grade</div>
                        <div style={{ color: '#234B73', fontWeight: 600 }}>{report.grade}</div>
                      </div>
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
        userName={displayName}
        userInitials={firstInitial}
      />

      {/* Toast Notification (Facebook style) */}
      {showToast && (
        <div style={{
          position: 'fixed',
          left: 32,
          bottom: 32,
          zIndex: 9999,
          background: '#23272f',
          color: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
          minWidth: 320,
          maxWidth: 360,
          padding: '20px 24px 18px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontFamily: 'inherit',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>New notification</span>
            <button onClick={() => setShowToast(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', borderRadius: 8, padding: 2, marginLeft: 8 }} aria-label="Close notification">&times;</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#C0CEDB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#234B73' }}>Y</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, color: '#fff' }}>Your application has been accepted!</span>
            </div>
            <span style={{ width: 10, height: 10, background: '#1877f2', borderRadius: '50%', display: 'inline-block', marginLeft: 6 }}></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
