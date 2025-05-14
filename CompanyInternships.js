import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Navbar from './Navbar';

const durationOptions = [
  '< 2 months',
  '2-3 months',
  '> 3 months'
];
const paidOptions = ['Paid', 'Unpaid'];

const CompanyInternships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState('');
  // Filter state
  const [filterDuration, setFilterDuration] = useState('');
  const [filterPaid, setFilterPaid] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Mock data - In a real app, this would come from an API
  useEffect(() => {
    // Simulate fetching internships
    const mockInternships = [
      {
        id: 1,
        title: "Software Engineering Intern",
        department: "Engineering",
        duration: "3 months",
        location: "Cairo, Egypt",
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        status: "open",
        isPaid: true,
        salary: 5000,
        applicationDeadline: "2024-05-20",
        applicationLink: "https://company.com/apply/1",
        skills: "Python, React, SQL",
        description: "Work on software engineering projects.",
        requirements: "GPA > 3.0, Teamwork",
        responsibilities: "Develop, Test, Deploy",
        applicants: [
          { id: 1, name: "Ahmed Mohamed", email: "ahmed@student.guc.edu.eg" },
          { id: 2, name: "Sarah Ali", email: "sarah@student.guc.edu.eg" }
        ],
        currentInterns: []
      },
      {
        id: 2,
        title: "UX Design Intern",
        department: "Design",
        duration: "2 months",
        location: "Remote",
        startDate: "2024-05-01",
        endDate: "2024-07-01",
        status: "in-progress",
        isPaid: false,
        salary: 0,
        applicationDeadline: "2024-04-20",
        applicationLink: "https://company.com/apply/2",
        skills: "Figma, UX, Illustrator",
        description: "Assist in UX design tasks.",
        requirements: "Portfolio, Creativity",
        responsibilities: "Design, Prototype, Test",
        applicants: [],
        currentInterns: [
          { id: 3, name: "Mohamed Hassan", email: "mohamed@student.guc.edu.eg" }
        ]
      }
    ];
    setInternships(mockInternships);
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'open':
        return { background: '#D1FAE5', color: '#065F46' };
      case 'in-progress':
        return { background: '#DBEAFE', color: '#1E40AF' };
      case 'completed':
        return { background: '#F3F4F6', color: '#374151' };
      default:
        return { background: '#F3F4F6', color: '#374151' };
    }
  };

  const handleDelete = (id) => {
    setInternships(prev => prev.filter(internship => internship.id !== id));
  };

  const handleEdit = (internship) => {
    navigate('/create-internship', { state: { internship } });
  };

  const handleFilterTypeSelect = (type) => {
    setSelectedFilterType(type);
  };

  const handleFilterValueSelect = (value) => {
    switch (selectedFilterType) {
      case 'Duration':
        setFilterDuration(value);
        break;
      case 'Paid/Unpaid':
        setFilterPaid(value);
        break;
      case 'Industry':
        setFilterIndustry(value);
        break;
      default:
        break;
    }
  };

  const getFilterOptions = () => {
    switch (selectedFilterType) {
      case 'Duration':
        return durationOptions;
      case 'Paid/Unpaid':
        return ['Paid', 'Unpaid'];
      case 'Industry':
        return [
          'Technology',
          'Finance',
          'Healthcare',
          'Education',
          'Manufacturing',
          'Retail',
          'Consulting',
          'Media'
        ];
      default:
        return [];
    }
  };

  const clearFilters = () => {
    setFilterDuration('');
    setFilterPaid('');
    setFilterIndustry('');
    setSelectedFilterType('');
    setShowFilter(false);
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  // Filtering logic
  const filteredInternships = internships.filter((internship) => {
    // Search by job title or department
    const s = search.trim().toLowerCase();
    if (s) {
      const title = internship.title.toLowerCase();
      const department = internship.department.toLowerCase();
      if (!(title.startsWith(s) || department.startsWith(s))) return false;
    }
    // Duration filter
    if (filterDuration && internship.duration !== filterDuration) return false;
    // Paid/Unpaid filter
    if (filterPaid) {
      if (filterPaid === 'Paid' && !internship.isPaid) return false;
      if (filterPaid === 'Unpaid' && internship.isPaid) return false;
    }
    // Industry filter
    if (filterIndustry && internship.department !== filterIndustry) return false;
    return true;
  });

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
        { label: 'Company Internships', action: (navigate) => navigate('/company-internships') },
        { label: 'Post New Internship', action: (navigate) => navigate('/create-internship') },
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
      label: 'Interns',
      icon: <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>,
      submenu: [
        { label: 'Current Interns', action: (navigate) => navigate('/all-current-interns') },
        { label: 'Completed Interns', action: (navigate) => navigate('/all-completed-interns') },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <div style={{ padding: 32, maxWidth: 900, margin: '72px auto 0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(35,75,115,0.10)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700 }}>Your Internships</h1>
          <Link
            to="/create-internship"
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
            Post New Internship
          </Link>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search by job title or department..."
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
          <div style={{ position: 'relative' }}>
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
                <h2 style={{ color: '#234B73', fontSize: 24, fontWeight: 700, margin: 0 }}>Filter Internships</h2>
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
                    <option value="Industry">Industry</option>
                    <option value="Duration">Duration</option>
                    <option value="Paid/Unpaid">Paid/Unpaid</option>
                  </select>
                </div>

                {/* Filter Options Dropdown */}
                {selectedFilterType && (
                  <div>
                    <label style={{ display: 'block', color: '#234B73', fontWeight: 600, marginBottom: 8 }}>
                      {selectedFilterType === 'Industry' ? 'Select Industry' :
                       selectedFilterType === 'Duration' ? 'Select Duration' :
                       'Select Payment Type'}:
                    </label>
                    <select
                      value={
                        selectedFilterType === 'Duration' ? filterDuration :
                        selectedFilterType === 'Paid/Unpaid' ? filterPaid :
                        selectedFilterType === 'Industry' ? filterIndustry : ''
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
                {(filterDuration || filterPaid || filterIndustry) && (
                  <div style={{ 
                    marginTop: 8, 
                    padding: '12px', 
                    background: '#F3F4F6', 
                    borderRadius: 8,
                    color: '#234B73'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Current Filter:</div>
                    {filterIndustry && <div>Industry: {filterIndustry}</div>}
                    {filterDuration && <div>Duration: {filterDuration}</div>}
                    {filterPaid && <div>Payment Type: {filterPaid}</div>}
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

        {/* Internships List */}
        <div>
          {filteredInternships.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#8C8C8C', padding: '32px 0' }}>No internships found.</div>
          ) : (
            filteredInternships.map((internship) => (
              <div
                key={internship.id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  padding: 24,
                  marginBottom: 16,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onClick={() => setExpandedId(expandedId === internship.id ? null : internship.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ color: '#234B73', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{internship.title}</h2>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Department: {internship.department}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Duration: {internship.duration}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15, marginBottom: 4 }}>Location: {internship.location}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>Applicants: {internship.applicants ? internship.applicants.length : 0}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <span style={{
                      ...getStatusBadgeColor(internship.status),
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: 14,
                      fontWeight: 500
                    }}>
                      {internship.status === 'open' ? 'Open for Applications' :
                       internship.status === 'in-progress' ? 'In Progress' : 'Completed'}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {internship.status === 'open' ? (
                        <Link
                          to={`/applicants-info/${internship.id}`}
                          state={{ internship }}
                          style={{
                            color: '#234B73',
                            border: '1px solid #234B73',
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          View Applicants ({internship.applicants ? internship.applicants.length : 0})
                        </Link>
                      ) : (
                        <Link
                          to={`/interns/${internship.id}`}
                          style={{
                            color: '#234B73',
                            border: '1px solid #234B73',
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          View Interns
                        </Link>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); handleEdit(internship); }}
                        style={{
                          color: '#234B73',
                          border: '1px solid #234B73',
                          borderRadius: 8,
                          padding: '6px 12px',
                          fontSize: 14,
                          fontWeight: 600,
                          background: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(internship.id); }}
                        style={{
                          color: '#DC2626',
                          border: '1px solid #DC2626',
                          borderRadius: 8,
                          padding: '6px 12px',
                          fontSize: 14,
                          fontWeight: 600,
                          background: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                {expandedId === internship.id && (
                  <div style={{ marginTop: 16, padding: 16, background: '#F6F8FA', borderRadius: 8 }}>
                    <div style={{ marginBottom: 8 }}><b>Start Date:</b> {new Date(internship.startDate).toLocaleDateString()}</div>
                    <div style={{ marginBottom: 8 }}><b>End Date:</b> {new Date(internship.endDate).toLocaleDateString()}</div>
                    <div style={{ marginBottom: 8 }}><b>Application Deadline:</b> {new Date(internship.applicationDeadline).toLocaleDateString()}</div>
                    <div style={{ marginBottom: 8 }}><b>Paid:</b> {internship.isPaid ? `Yes (EGP ${internship.salary})` : 'No'}</div>
                    <div style={{ marginBottom: 8 }}>
                      <b>Application Link:</b> {internship.applicationLink ? (
                        <a href={internship.applicationLink} target="_blank" rel="noopener noreferrer" style={{ color: '#234B73', textDecoration: 'underline' }}>{internship.applicationLink}</a>
                      ) : <span style={{ color: '#8C8C8C', fontStyle: 'italic' }}>Not provided</span>}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <b>Skills Required:</b>
                      <div style={{ marginLeft: 16, marginTop: 4 }}>
                        {internship.skills?.split(',').map((skill, idx) => (
                          <span key={idx} style={{
                            display: 'inline-block',
                            background: '#E5E7EB',
                            color: '#374151',
                            padding: '4px 12px',
                            borderRadius: 16,
                            fontSize: 14,
                            margin: '0 8px 8px 0'
                          }}>
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 8 }}><b>Job Description:</b> {internship.description}</div>
                    <div style={{ marginBottom: 8 }}>
                      <b>Requirements:</b>
                      <ul style={{ marginLeft: 24, marginTop: 4 }}>
                        {internship.requirements?.split(',').map((req, idx) => (
                          <li key={idx} style={{ color: '#5A6A7A' }}>{req.trim()}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <b>Responsibilities:</b>
                      <ul style={{ marginLeft: 24, marginTop: 4 }}>
                        {internship.responsibilities?.split(',').map((resp, idx) => (
                          <li key={idx} style={{ color: '#5A6A7A' }}>{resp.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInternships; 