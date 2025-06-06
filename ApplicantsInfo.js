import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const ApplicantsInfo = () => {
  const { internshipId } = useParams();
  
  // Helper to get and set localStorage
  const getLocal = (key, fallback) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  };
  const setLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const applicantsKey = `applicants_${internshipId}`;
  const internsKey = `interns_${internshipId}`;

  // Initialize with mock data if none exists
  const initialApplicants = [
    {
      id: 11,
      name: "Mina Gerges",
      email: "mina.gerges@student.guc.edu.eg",
      phone: "+20 101 234 5678",
      studentId: "STU011",
      applicationDate: "2024-04-01",
      status: "finalized",
      gpa: "3.8",
      year: "4",
      major: "Electrical Engineering",
      lastEmailSent: "Application Process",
      internshipPost: "Embedded Systems Intern"
    },
    {
      id: 12,
      name: "Nourhan Tarek",
      email: "nourhan.tarek@student.guc.edu.eg",
      phone: "+20 102 345 6789",
      studentId: "STU012",
      applicationDate: "2024-04-02",
      status: "accepted",
      gpa: "3.6",
      year: "3",
      major: "Architecture",
      lastEmailSent: "Acceptance",
      internshipPost: "Urban Planning Intern"
    },
    {
      id: 13,
      name: "Karim Fathy",
      email: "karim.fathy@student.guc.edu.eg",
      phone: "+20 103 456 7890",
      studentId: "STU013",
      applicationDate: "2024-04-03",
      status: "rejected",
      gpa: "3.2",
      year: "2",
      major: "Business Administration",
      lastEmailSent: "Rejection",
      internshipPost: "Business Analyst Intern"
    },
    {
      id: 14,
      name: "Dina Magdy",
      email: "dina.magdy@student.guc.edu.eg",
      phone: "+20 104 567 8901",
      studentId: "STU014",
      applicationDate: "2024-04-04",
      status: "accepted",
      gpa: "3.9",
      year: "5",
      major: "Pharmacy",
      lastEmailSent: "Acceptance",
      internshipPost: "Pharmaceutical Research Intern"
    },
    {
      id: 15,
      name: "Yara Samir",
      email: "yara.samir@student.guc.edu.eg",
      phone: "+20 105 678 9012",
      studentId: "STU015",
      applicationDate: "2024-04-05",
      status: "finalized",
      gpa: "3.5",
      year: "1",
      major: "Computer Science",
      lastEmailSent: "Application Process",
      internshipPost: "Frontend Developer Intern"
    }
  ];

  const [applicants, setApplicants] = useState(() => {
    const storedApplicants = getLocal(applicantsKey, null);
    if (!storedApplicants) {
      setLocal(applicantsKey, initialApplicants);
      return initialApplicants;
    }
    return storedApplicants;
  });

  useEffect(() => {
    setLocal(applicantsKey, applicants);
  }, [applicants, applicantsKey]);

  // Simulate sending an email (replace with real API call in production)
  const sendEmail = (to, subject, body) => {
    // For demo, just log to console
    console.log(`Email sent to ${to}: ${subject}\n${body}`);
  };

  const handleAccept = (applicant) => {
    setApplicants(prev => prev.map(a => {
      if (a.id === applicant.id) {
        return {
          ...a,
          status: 'accepted',
          lastEmailSent: 'Acceptance'
        };
      }
      return a;
    }));

    const newIntern = {
      ...applicant,
      status: 'current intern',
      startDate: new Date().toISOString().slice(0,10),
      endDate: '',
      performance: 'N/A',
      jobTitle: applicant.internshipPost
    };
    const prevInterns = getLocal(internsKey, []);
    setLocal(internsKey, [...prevInterns, newIntern]);

    sendEmail(
      applicant.email,
      'Internship Application Accepted',
      `Dear ${applicant.name},\n\nCongratulations! You have been accepted for the ${applicant.internshipPost} position. Please check your dashboard for more details.\n\nBest regards,\nGUC Internship System`
    );
  };

  const handleReject = (applicant) => {
    setApplicants(prev => prev.map(a => {
      if (a.id === applicant.id) {
        return {
          ...a,
          status: 'rejected',
          lastEmailSent: 'Rejection'
        };
      }
      return a;
    }));

    sendEmail(
      applicant.email,
      'Internship Application Rejected',
      `Dear ${applicant.name},\n\nWe regret to inform you that your application for the ${applicant.internshipPost} position was not successful.\n\nBest regards,\nGUC Internship System`
    );
  };

  const handleStatusChange = (applicantId, newStatus) => {
    setApplicants(prev => prev.map(a => {
      if (a.id === applicantId) {
        let emailSubject = 'Internship Application Status Update';
        let emailBody = `Dear ${a.name},\n\nYour application status for the ${a.internshipPost} position has been updated to: ${newStatus}.\n\nBest regards,\nGUC Internship System`;

        if (newStatus === 'accepted') {
          emailSubject = 'Internship Application Accepted';
          emailBody = `Dear ${a.name},\n\nCongratulations! You have been accepted for the ${a.internshipPost} position. Please check your dashboard for more details.\n\nBest regards,\nGUC Internship System`;
        } else if (newStatus === 'rejected') {
          emailSubject = 'Internship Application Rejected';
          emailBody = `Dear ${a.name},\n\nWe regret to inform you that your application for the ${a.internshipPost} position was not successful.\n\nBest regards,\nGUC Internship System`;
        }

        sendEmail(a.email, emailSubject, emailBody);
        return { 
          ...a, 
          status: newStatus, 
          lastEmailSent: emailSubject.split(' ').pop()
        };
      }
      return a;
    }));
  };

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
    'Biotechnology',
  ];
  const years = ['1', '2', '3', '4', '5'];

  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState('');
  const [filterGpa, setFilterGpa] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMajor, setFilterMajor] = useState('');

  const handleFilterTypeSelect = (type) => {
    setSelectedFilterType(type);
  };

  const handleFilterValueSelect = (value) => {
    switch (selectedFilterType) {
      case 'GPA':
        setFilterGpa(value);
        break;
      case 'Year':
        setFilterYear(value);
        break;
      case 'Major':
        setFilterMajor(value);
        break;
      default:
        break;
    }
  };

  const getFilterOptions = () => {
    switch (selectedFilterType) {
      case 'GPA':
        return ['3.0+', '3.3+', '3.5+', '3.7+'];
      case 'Year':
        return years;
      case 'Major':
        return majors;
      default:
        return [];
    }
  };

  const clearFilters = () => {
    setFilterGpa('');
    setFilterYear('');
    setFilterMajor('');
    setSelectedFilterType('');
    setShowFilter(false);
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(search.toLowerCase());
    let matchesGpa = true;
    if (filterGpa) {
      const minGpa = parseFloat(filterGpa.replace('+', ''));
      matchesGpa = parseFloat(applicant.gpa) >= minGpa;
    }
    const matchesYear = filterYear ? applicant.year === filterYear : true;
    const matchesMajor = filterMajor ? applicant.major === filterMajor : true;
    return matchesSearch && matchesGpa && matchesYear && matchesMajor;
  });

  const [expandedId, setExpandedId] = useState(null);

  const studentDetails = {
    'STU011': {
      skills: 'Python, C++, Arduino, MATLAB, PCB Design',
      bio: 'Passionate about embedded systems and IoT solutions. Looking to apply theoretical knowledge in practical industry scenarios.',
      previousInternships: ['Summer Intern at Siemens - 2023', 'Research Assistant at GUC Labs - 2022'],
      certificates: ['Arduino Certification', 'Embedded Systems Professional Certificate', 'IoT Fundamentals']
    },
    'STU012': {
      skills: 'AutoCAD, Revit, SketchUp, 3D Modeling, Sustainable Design',
      bio: 'Creative architect with a focus on sustainable urban development and modern design principles.',
      previousInternships: ['Intern Architect at EGEC - 2023', 'Design Assistant at Modern Architects - 2022'],
      certificates: ['LEED Green Associate', 'AutoCAD Professional', 'Sustainable Architecture Design']
    },
    'STU013': {
      skills: 'Financial Analysis, Excel, PowerBI, SQL, Business Strategy',
      bio: 'Analytical thinker with strong business acumen and interest in strategic planning.',
      previousInternships: ['Business Analyst Intern at PWC - 2023', 'Finance Intern at CIB - 2022'],
      certificates: ['Financial Modeling Certificate', 'Business Analytics Specialization', 'Excel Advanced']
    },
    'STU014': {
      skills: 'Lab Techniques, Research Methods, Data Analysis, Clinical Trials',
      bio: 'Dedicated to pharmaceutical research with a focus on drug development and clinical studies.',
      previousInternships: ['Research Intern at Eva Pharma - 2023', 'Lab Assistant at GUC - 2022'],
      certificates: ['GMP Certification', 'Clinical Research Associate', 'Pharmaceutical Analysis']
    },
    'STU015': {
      skills: 'React, Node.js, TypeScript, AWS, UI/UX Design',
      bio: 'Passionate web developer with a keen eye for design and user experience.',
      previousInternships: ['Frontend Developer at Vodafone - 2023', 'Web Developer at Instabug - 2022'],
      certificates: ['AWS Developer Associate', 'React Advanced', 'UI/UX Design Fundamentals']
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <div style={{ padding: 32, maxWidth: 1200, margin: '72px auto 0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(35,75,115,0.10)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700 }}>Applicants Information</h1>
          <Link
            to="/company-internships"
            style={{
              background: '#234B73',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 16,
              transition: 'background 0.2s'
            }}
          >
            Back to Internships
          </Link>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #C0CEDB',
              fontSize: 16,
              color: '#234B73',
              outline: 'none'
            }}
          />
          <button
            onClick={() => setShowFilter(true)}
            style={{
              background: '#F08F36',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter by
          </button>
        </div>

        {/* Filter Modal */}
        {showFilter && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.18)',
                zIndex: 2000
              }}
              onClick={() => setShowFilter(false)}
            />
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(35,75,115,0.18)',
                padding: '32px',
                zIndex: 2001,
                minWidth: 400,
                maxWidth: '90vw'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>Filter Applicants</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  style={{ background: 'none', border: 'none', fontSize: 24, color: '#F08F36', cursor: 'pointer', padding: 4 }}
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Filter Condition Dropdown */}
                <div>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>Filter Condition:</label>
                  <select
                    value={selectedFilterType}
                    onChange={e => handleFilterTypeSelect(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #C0CEDB',
                      fontSize: 16,
                      color: '#234B73',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23234B73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="">Select a filter condition</option>
                    <option value="GPA">GPA</option>
                    <option value="Year">Year</option>
                    <option value="Major">Major</option>
                  </select>
                </div>

                {/* Filter Options Dropdown */}
                {selectedFilterType && (
                  <div>
                    <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>
                      {selectedFilterType === 'GPA' ? 'Select Minimum GPA' :
                       selectedFilterType === 'Year' ? 'Select Year' :
                       'Select Major'}:
                    </label>
                    <select
                      value={
                        selectedFilterType === 'GPA' ? filterGpa :
                        selectedFilterType === 'Year' ? filterYear :
                        selectedFilterType === 'Major' ? filterMajor : ''
                      }
                      onChange={e => handleFilterValueSelect(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #C0CEDB',
                        fontSize: 16,
                        color: '#234B73',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23234B73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '16px'
                      }}
                    >
                      <option value="">All</option>
                      {getFilterOptions().map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Current Filter Display */}
                {(filterGpa || filterYear || filterMajor) && (
                  <div style={{ 
                    marginTop: 8, 
                    padding: '12px', 
                    background: '#F3F4F6', 
                    borderRadius: 8,
                    color: '#234B73'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Current Filter:</div>
                    {filterGpa && <div>GPA: {filterGpa}</div>}
                    {filterYear && <div>Year: {filterYear}</div>}
                    {filterMajor && <div>Major: {filterMajor}</div>}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <button
                    onClick={clearFilters}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#E5E7EB',
                      color: '#374151',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={applyFilters}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#F08F36',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Applicants Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Phone Number</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Email Address</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Internship Post</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Application Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Last Email Sent</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: 14, fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => (
                <React.Fragment key={applicant.id}>
                  <tr style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 8 }}>
                    <td style={{ padding: '16px', color: '#234B73', fontWeight: 500 }}>{applicant.name}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{applicant.phone}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{applicant.email}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{applicant.internshipPost}</td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>
                      {new Date(applicant.applicationDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select
                        value={applicant.status}
                        onChange={e => handleStatusChange(applicant.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: '1px solid #C0CEDB',
                          color: applicant.status === 'accepted' ? '#22C55E' :
                                applicant.status === 'rejected' ? '#EF4444' :
                                applicant.status === 'finalized' ? '#234B73' : '#234B73',
                          background: applicant.status === 'accepted' ? '#F0FDF4' :
                                    applicant.status === 'rejected' ? '#FEF2F2' :
                                    applicant.status === 'finalized' ? '#F0F9FF' : '#fff',
                          fontWeight: '600'
                        }}
                      >
                        <option value="finalized" style={{ color: '#234B73', background: '#F0F9FF' }}>Finalized</option>
                        <option value="accepted" style={{ color: '#22C55E', background: '#F0FDF4' }}>Accepted</option>
                        <option value="rejected" style={{ color: '#EF4444', background: '#FEF2F2' }}>Rejected</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', color: '#6B7280' }}>{applicant.lastEmailSent}</td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => setExpandedId(expandedId === applicant.id ? null : applicant.id)}
                        style={{
                          color: '#F08F36',
                          background: 'none',
                          border: 'none',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        View Profile
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          style={{
                            transform: expandedId === applicant.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {expandedId === applicant.id && (
                    <tr>
                      <td colSpan="8" style={{ padding: '0 16px 16px' }}>
                        <div style={{
                          background: '#F8FAFC',
                          padding: '24px',
                          borderRadius: 8,
                          border: '1px solid #E2E8F0',
                          marginTop: -8
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                            <div>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Student ID:</div>
                                <div style={{ color: '#234B73', fontWeight: 500 }}>{applicant.studentId}</div>
                              </div>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Email:</div>
                                <div style={{ color: '#234B73', fontWeight: 500 }}>{applicant.email}</div>
                              </div>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Major:</div>
                                <div style={{ color: '#234B73', fontWeight: 500 }}>{applicant.major}</div>
                              </div>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Year:</div>
                                <div style={{ color: '#234B73', fontWeight: 500 }}>{applicant.year}</div>
                              </div>
                              <div>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>GPA:</div>
                                <div style={{ color: '#234B73', fontWeight: 500 }}>{applicant.gpa}</div>
                              </div>
                            </div>
                            <div>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Skills:</div>
                                <div style={{ color: '#234B73', fontWeight: 500 }}>{studentDetails[applicant.studentId].skills}</div>
                              </div>
                              <div>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Bio:</div>
                                <div style={{ color: '#234B73', fontWeight: 500 }}>{studentDetails[applicant.studentId].bio}</div>
                              </div>
                            </div>
                            <div>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Previous Internships:</div>
                                <ul style={{ color: '#234B73', fontWeight: 500, paddingLeft: '20px' }}>
                                  {studentDetails[applicant.studentId].previousInternships.map((internship, idx) => (
                                    <li key={idx}>{internship}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div style={{ color: '#6B7280', marginBottom: '4px' }}>Certificates:</div>
                                <ul style={{ color: '#234B73', fontWeight: 500, paddingLeft: '20px' }}>
                                  {studentDetails[applicant.studentId].certificates.map((cert, idx) => (
                                    <li key={idx}>{cert}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsInfo; 