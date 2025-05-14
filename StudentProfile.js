import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../App';

const headerGradient = {
  background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
  color: '#fff',
  padding: '48px 0 60px 0',
  textAlign: 'center',
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
};
const profileCard = {
  background: '#fff',
  borderRadius: '18px',
  boxShadow: '0 8px 32px rgba(35,75,115,0.10)',
  padding: '36px 40px',
  maxWidth: 540,
  margin: '-80px auto 32px auto',
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  borderTop: '6px solid #F08F36',
};
const avatarStyle = {
  width: 110,
  height: 110,
  borderRadius: '50%',
  background: '#C0CEDB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 54,
  color: '#234B73',
  fontWeight: 700,
  border: '3px solid #fff',
  boxShadow: '0 2px 8px #C0CEDB',
};
const infoBlock = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};
const nameStyle = {
  color: '#234B73',
  fontWeight: 700,
  fontSize: 28,
  letterSpacing: 1,
  marginBottom: 2,
};
const emailStyle = {
  color: '#8C8C8C',
  fontSize: 16,
  marginBottom: 8,
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
const editBtn = {
  background: '#F08F36',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 28px',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'not-allowed',
  opacity: 0.8,
  marginLeft: 24,
  boxShadow: '0 2px 8px #F08F36',
};
const postsSection = {
  maxWidth: 700,
  margin: '0 auto',
  padding: '0 16px 40px 16px',
};
const postsTitle = {
  color: '#234B73',
  fontWeight: 700,
  fontSize: 22,
  marginBottom: 18,
  marginLeft: 8,
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

const dummyPosts = [
  {
    id: 1,
    title: 'Looking for a summer internship',
    content: 'I am looking for a software engineering internship this summer. Any recommendations?',
    date: '2024-06-01',
  },
  {
    id: 2,
    title: 'Completed my first project!',
    content: 'Excited to share that I have completed my first web app project for the internship system.',
    date: '2024-05-20',
  },
  {
    id: 3,
    title: 'Question about report submission',
    content: 'Does anyone know the deadline for the week 3 report?',
    date: '2024-05-15',
  },
];

// Mock student data for demonstration
const mockStudents = [
  {
    id: '1',
    fullName: 'Ahmed Mohamed',
    email: 'ahmed@student.guc.edu.eg',
    major: 'Computer Science',
    year: '3',
    gpa: '3.7',
    skills: ['Python', 'React', 'SQL'],
    bio: 'Passionate about software engineering and AI.'
  },
  {
    id: '2',
    fullName: 'Sarah Ali',
    email: 'sarah@student.guc.edu.eg',
    major: 'Design',
    year: '2',
    gpa: '3.9',
    skills: ['Figma', 'UX', 'Illustrator'],
    bio: 'Creative designer with a love for user experience.'
  }
];

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const [showAddInternship, setShowAddInternship] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddPartTime, setShowAddPartTime] = useState(false);
  const [openMenus, setOpenMenus] = useState([]);
  const [activeSubItem, setActiveSubItem] = useState('Profile');
  const [postInput, setPostInput] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [postMedia, setPostMedia] = useState({ photo: null, video: null, document: null });
  const [mediaURLs, setMediaURLs] = useState({ photo: null, video: null, document: null });
  const [postObjectURLs, setPostObjectURLs] = useState([]);
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [editPostModal, setEditPostModal] = useState(null);
  const [editPostInput, setEditPostInput] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState(null);
  const [editVideoURL, setEditVideoURL] = useState(null);
  const [editDocURL, setEditDocURL] = useState(null);
  const [editDocName, setEditDocName] = useState('');
  const editPhotoInputRef = useRef();
  const editVideoInputRef = useRef();
  const editDocumentInputRef = useRef();

  // List of available majors
  const majors = [
    'Computer Science',
    'Computer Engineering',
    'Information Systems',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Architecture',
    'Business Administration',
    'Economics',
    'Pharmacy',
    'Biotechnology'
  ];

  // Get student data from localStorage
  const getStudentData = () => {
    // Search through all applicants in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('applicants_')) {
        const applicants = JSON.parse(localStorage.getItem(key) || '[]');
        const foundStudent = applicants.find(a => a.studentId === studentId);
        if (foundStudent) {
          return {
            id: foundStudent.studentId,
            fullName: foundStudent.name,
            email: foundStudent.email,
            major: foundStudent.major,
            year: foundStudent.year,
            gpa: foundStudent.gpa,
            skills: [], // You might want to add skills to your applicant data
            bio: `Student at GUC studying ${foundStudent.major}`
          };
        }
      }
    }
    // If student not found, return default data
    return {
      id: studentId,
      fullName: 'Student Not Found',
      email: 'N/A',
      major: 'N/A',
      year: 'N/A',
      gpa: 'N/A',
      skills: [],
      bio: 'Student information not available'
    };
  };

  const [student, setStudent] = useState(getStudentData());

  // Update student data when studentId changes
  useEffect(() => {
    setStudent(getStudentData());
  }, [studentId]);

  // Clean up all post object URLs on unmount
  useEffect(() => {
    return () => {
      postObjectURLs.forEach(urls => {
        Object.values(urls).forEach(url => url && URL.revokeObjectURL(url));
      });
    };
  }, [postObjectURLs]);

  // Delete post handler
  const handleDeletePost = (id) => {
    // Implementation needed
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.post-menu')) setPostMenuOpen(null);
    };
    if (postMenuOpen !== null) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [postMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the changes
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    // Implementation needed
  };

  const handleAddInternship = (e) => {
    // Implementation needed
  };

  const handleAddActivity = (e) => {
    // Implementation needed
  };

  const handleAddPartTime = (e) => {
    // Implementation needed
  };

  const handleNewInternshipChange = (e) => {
    // Implementation needed
  };

  const handleNewActivityChange = (e) => {
    // Implementation needed
  };

  const handleNewPartTimeChange = (e) => {
    // Implementation needed
  };

  const handleMediaChange = (type, e) => {
    // Implementation needed
  };

  const handleRemoveMedia = (type) => {
    // Implementation needed
  };

  const handlePostSubmit = (e) => {
    // Implementation needed
  };

  // Open edit modal
  const handleEditPost = (post) => {
    // Implementation needed
  };

  // Edit media change
  const handleEditMediaChange = (type, e) => {
    // Implementation needed
  };

  const handleRemoveEditMedia = (type) => {
    // Implementation needed
  };

  // Save edited post
  const handleSaveEditPost = () => {
    // Implementation needed
  };

  const navbarStyle = {
    background: '#234B73',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const navButtonStyle = {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const formGroupStyle = {
    marginBottom: '16px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #C0CEDB',
    fontSize: '14px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  };

  const saveButtonStyle = {
    ...editBtn,
    cursor: 'pointer',
    opacity: 1
  };

  const cancelButtonStyle = {
    ...editBtn,
    background: '#C0CEDB',
    cursor: 'pointer',
    opacity: 1
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23234B73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px'
  };

  const profileHeaderStyle = {
    background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
    padding: '120px 0 60px 0',
    marginBottom: '80px',
    position: 'relative'
  };

  const profileCardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
    padding: '24px',
    marginBottom: '24px'
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
    marginTop: '24px'
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '8px 0'
  };

  const infoLabelStyle = {
    ...labelStyle,
    minWidth: '120px',
    marginBottom: 0
  };

  const burgerMenuStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '250px',
    height: '100vh',
    background: '#234B73',
    color: 'white',
    padding: '20px',
    transform: showBurgerMenu ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000
  };

  const burgerButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '10px'
  };

  const menuItemStyle = {
    padding: '12px 16px',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const menuIconStyle = {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const submenuStyle = {
    marginLeft: '32px',
    marginTop: '4px'
  };

  const addButtonStyle = {
    background: '#F08F36',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    marginBottom: '16px'
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

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
        { label: 'Browse Internships', action: () => alert('Browse Internships') },
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
  ];

  const handleMenuClick = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isMenuOpen = (label) => openMenus.includes(label);

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
    transform: showBurgerMenu ? 'translateX(0)' : 'translateX(-100%)',
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

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar Drawer */}
      {showBurgerMenu && (
        <>
          <div style={sidebarOverlay} onClick={() => setShowBurgerMenu(false)} />
          <div style={sidebarStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 18 }}>
              <button
                onClick={() => setShowBurgerMenu(false)}
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
            {menuStructure.map((item) => (
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
        </>
      )}

      {/* Navbar */}
      <div style={navbarStyle}>
        <button style={burgerButtonStyle} onClick={() => setShowBurgerMenu(true)}>☰</button>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>GUC Internship System</div>
        <button style={navButtonStyle} onClick={handleLogout}>Logout</button>
      </div>

      {/* Profile Header - More Compact */}
      <div style={{...profileHeaderStyle, padding: '60px 0 30px 0'}}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{...avatarStyle, width: '80px', height: '80px', fontSize: '32px', position: 'relative'}}>
              {(student.fullName ? student.fullName[0] : student.fullName[0]) || 'S'}
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '24px', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                {student.fullName}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0 0 2px 0', fontSize: '14px' }}>{student.major}</p>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0', fontSize: '14px' }}>Year {student.year}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={containerStyle}>
        <div style={gridLayoutStyle}>
          {/* Left Column */}
          <div>
            {/* Basic Information - now at the top of the left column */}
            <div style={profileCardStyle}>
              <h2 style={sectionTitleStyle}>Basic Information</h2>
              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={student.fullName}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Major</label>
                    <input
                      type="text"
                      name="major"
                      value={student.major}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Year</label>
                    <input
                      type="text"
                      name="year"
                      value={student.year}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>GPA</label>
                    <input
                      type="text"
                      name="gpa"
                      value={student.gpa}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Skills</label>
                    <textarea
                      name="skills"
                      value={student.skills.join(', ')}
                      onChange={handleInputChange}
                      style={textareaStyle}
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Bio</label>
                    <textarea
                      name="bio"
                      value={student.bio}
                      onChange={handleInputChange}
                      style={textareaStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '24px 0' }}>
                    <button type="button" style={addButtonStyle} onClick={() => setShowAddInternship(true)}>
                      Add Internship
                    </button>
                    <button type="button" style={addButtonStyle} onClick={() => setShowAddPartTime(true)}>
                      Add Part-Time Job
                    </button>
                    <button type="button" style={addButtonStyle} onClick={() => setShowAddActivity(true)}>
                      Add Activity
                    </button>
                  </div>
                  <div style={buttonGroupStyle}>
                    <button type="submit" style={saveButtonStyle}>Save Changes</button>
                    <button type="button" onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Student ID:</span>
                    <span style={valueStyle}>{student.id}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Email:</span>
                    <span style={valueStyle}>{student.email}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Major:</span>
                    <span style={valueStyle}>{student.major}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Year:</span>
                    <span style={valueStyle}>{student.year}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>GPA:</span>
                    <span style={valueStyle}>{student.gpa}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Skills:</span>
                    <span style={valueStyle}>{student.skills.join(', ')}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <span style={infoLabelStyle}>Bio:</span>
                    <span style={valueStyle}>{student.bio}</span>
                  </div>
                  <button style={{...editBtn, cursor: 'pointer', opacity: 1}} onClick={handleEdit}>Edit Profile</button>
                </div>
              )}
            </div>
            {/* Posts Section - now below Basic Information */}
            <div style={profileCardStyle}>
              <h2 style={sectionTitleStyle}>Posts</h2>
              {/* Button-like input to open modal */}
              <div
                onClick={() => setShowPostModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: '#F5F7FA',
                  borderRadius: 20,
                  padding: '12px 18px',
                  marginBottom: 24,
                  cursor: 'pointer',
                  border: '1px solid #C0CEDB',
                  color: '#8C8C8C',
                  fontSize: 16,
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>
                  {(student.fullName ? student.fullName[0] : student.fullName[0]) || 'S'}
                </div>
                What's on your mind, {student.fullName.split(' ')[0]}?
              </div>
              {/* Posts List */}
              {[...dummyPosts]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(post => (
                  <div
                    key={post.id}
                    style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: post.id < dummyPosts.length ? '1px solid #C0CEDB' : 'none', position: 'relative', background: '#fff', borderRadius: '14px', boxShadow: '0 4px 24px rgba(35,75,115,0.10)', padding: '22px 28px', color: '#234B73', fontSize: 17, fontWeight: 500, borderLeft: '6px solid #234B73', transition: 'box-shadow 0.2s' }}
                  >
                    {post.title && <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8, color: '#234B73' }}>{post.title}</div>}
                    <p style={{ color: '#666', margin: '0 0 8px 0' }}>{post.date}</p>
                    <p style={{ color: '#1a3a5a', margin: '0 0 8px 0', fontWeight: 400 }}>{post.content}</p>
                  </div>
                ))}
            </div>
          </div>
          {/* Right Column */}
          <div>
            {/* Previous Internships */}
            <div style={profileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={sectionTitleStyle}>Previous Internships</h2>
                {isEditing && (
                  <button style={addButtonStyle} onClick={() => setShowAddInternship(true)}>
                    Add Internship
                  </button>
                )}
              </div>
              {/* Implementation needed */}
            </div>
            {/* Part-Time Jobs */}
            <div style={profileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={sectionTitleStyle}>Part-Time Jobs</h2>
                {isEditing && (
                  <button style={addButtonStyle} onClick={() => setShowAddPartTime(true)}>
                    Add Part-Time Job
                  </button>
                )}
              </div>
              {/* Implementation needed */}
            </div>
            {/* College Activities */}
            <div style={profileCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={sectionTitleStyle}>College Activities</h2>
                {isEditing && (
                  <button style={addButtonStyle} onClick={() => setShowAddActivity(true)}>
                    Add Activity
                  </button>
                )}
              </div>
              {/* Implementation needed */}
            </div>
          </div>
        </div>
      </div>

      {/* Add Internship Modal */}
      {showAddInternship && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#234B73', marginBottom: '20px' }}>Add New Internship</h2>
            <form onSubmit={handleAddInternship}>
              {/* Implementation needed */}
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#234B73', marginBottom: '20px' }}>Add New Activity</h2>
            <form onSubmit={handleAddActivity}>
              {/* Implementation needed */}
            </form>
          </div>
        </div>
      )}

      {/* Add Part-Time Job Modal */}
      {showAddPartTime && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#234B73', marginBottom: '20px' }}>Add New Part-Time Job</h2>
            <form onSubmit={handleAddPartTime}>
              {/* Implementation needed */}
            </form>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
            width: '100%',
            maxWidth: 520,
            padding: 0,
            position: 'relative',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#C0CEDB', color: '#234B73', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>
                  {(student.fullName ? student.fullName[0] : student.fullName[0]) || 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>{student.fullName}</div>
                  <div style={{ color: '#8C8C8C', fontSize: 13 }}>Post to Anyone</div>
                </div>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 26, color: '#8C8C8C', cursor: 'pointer', borderRadius: 6, padding: 4, transition: 'background 0.15s' }}
                aria-label="Close"
                onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                ×
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={postInput}
                onChange={e => setPostInput(e.target.value)}
                placeholder="What do you want to talk about?"
                style={{
                  width: '100%',
                  minHeight: 120,
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  fontSize: 18,
                  color: '#234B73',
                  margin: '18px 0 0 0',
                  padding: '0 24px',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
                maxLength={1000}
                autoFocus
              />
              {/* Media Previews */}
              <div style={{ padding: '0 24px', marginTop: 10, marginBottom: 0 }}>
                {/* Implementation needed */}
              </div>
              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 0 24px' }}>
                {/* Implementation needed */}
              </div>
              <div style={{ height: 18 }} />
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editPostModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
            width: '100%',
            maxWidth: 520,
            padding: 0,
            position: 'relative',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0 24px' }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 17 }}>Edit Post</div>
              <button
                onClick={() => setEditPostModal(null)}
                style={{ background: 'none', border: 'none', fontSize: 26, color: '#8C8C8C', cursor: 'pointer', borderRadius: 6, padding: 4, transition: 'background 0.15s' }}
                aria-label="Close"
                onMouseOver={e => (e.currentTarget.style.background = '#F08F36')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                ×
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={e => { e.preventDefault(); handleSaveEditPost(); }}>
              <textarea
                value={editPostInput}
                onChange={e => setEditPostInput(e.target.value)}
                placeholder="Edit your post..."
                style={{
                  width: '100%',
                  minHeight: 120,
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  fontSize: 18,
                  color: '#234B73',
                  margin: '18px 0 0 0',
                  padding: '0 24px',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
                maxLength={1000}
                autoFocus
              />
              {/* Media Previews */}
              <div style={{ padding: '0 24px', marginTop: 10, marginBottom: 0 }}>
                {/* Implementation needed */}
              </div>
              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px 0 24px' }}>
                {/* Implementation needed */}
              </div>
              <div style={{ height: 18 }} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile; 