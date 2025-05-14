import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

// Sidebar styles
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

const CompanyNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState('');
  const [openMenus, setOpenMenus] = useState([]);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef();

  // Menu structure
  const menuStructure = [
    {
      label: 'Main',
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
        { label: 'Company Internships', action: () => { setActiveSubItem('Company Internships'); navigate('/company-internships'); setSidebarOpen(false); } },
        { label: 'Post New Internship', action: () => { setActiveSubItem('Post New Internship'); navigate('/create-internship'); setSidebarOpen(false); } },
      ],
    },
    {
      label: 'Applications',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v2M8 3v2" /></svg>,
      submenu: [
        { label: 'Applications Received', action: () => { setActiveSubItem('Applications Received'); navigate('/company-applications'); setSidebarOpen(false); } },
      ],
    },
    {
      label: 'Interns',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z" /><path d="M12 6v4M12 13h.01" /></svg>,
      submenu: [
        { label: 'Current Interns', action: () => { setActiveSubItem('Current Interns'); navigate('/current-interns'); setSidebarOpen(false); } },
        { label: 'Past Interns', action: () => { setActiveSubItem('Past Interns'); navigate('/past-interns'); setSidebarOpen(false); } },
      ],
    },
  ];

  // Handlers
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => !sidebarPinned && setSidebarOpen(false);
  
  const handleMenuClick = (label) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isMenuOpen = (label) => openMenus.includes(label);

  // Effect for profile menu click outside
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

  return (
    <>
      <div style={navbarStyle}>
        <div style={navInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={handleSidebarOpen}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: 8,
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div style={{ fontSize: 24, fontWeight: 600 }}>GUC Internship System</div>
          </div>
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 8,
              }}
            >
              <div style={{
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
              }}>
                {user?.companyName?.charAt(0).toUpperCase() || 'C'}
              </div>
            </button>
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: 8,
                minWidth: 200,
              }}>
                <div style={{ padding: '8px 16px', color: '#234B73', fontWeight: 600 }}>
                  {user?.companyName || 'Company Name'}
                </div>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    borderRadius: 4,
                    textAlign: 'left',
                    color: '#DC2626',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && !sidebarPinned && (
        <div style={sidebarOverlay} onClick={handleSidebarClose} />
      )}
      <div
        style={{
          ...sidebarStyle,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
        onMouseEnter={() => !sidebarPinned && handleSidebarOpen()}
        onMouseLeave={() => !sidebarPinned && handleSidebarClose()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <img
            src={user?.logo || 'https://via.placeholder.com/48x48.png?text=Logo'}
            alt="Company Logo"
            style={{ width: 48, height: 48, borderRadius: 8 }}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{user?.companyName || 'Company Name'}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>Company Dashboard</div>
          </div>
        </div>

        {menuStructure.map((section) => (
          <div
            key={section.label}
            style={{
              ...sidebarMenuSection,
              background: sidebarHover === section.label ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onMouseEnter={() => setSidebarHover(section.label)}
            onMouseLeave={() => setSidebarHover('')}
          >
            <div
              style={sidebarMenuItem}
              onClick={() => handleMenuClick(section.label)}
            >
              {section.icon}
              <span style={{ flex: 1 }}>{section.label}</span>
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transform: isMenuOpen(section.label) ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isMenuOpen(section.label) && (
              <div style={{ paddingLeft: 32 }}>
                {section.submenu.map((item) => (
                  <div
                    key={item.label}
                    onClick={item.action}
                    style={{
                      ...sidebarSubMenu,
                      ...(activeSubItem === item.label ? sidebarActiveItem : {}),
                      paddingLeft: 16,
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '16px 0' }}>
          <button
            onClick={() => setSidebarPinned(!sidebarPinned)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              opacity: 0.8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                transform: sidebarPinned ? 'rotate(45deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h14M5 12h14M5 19h14" />
            </svg>
            {sidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CompanyNavBar; 