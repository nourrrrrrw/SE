import React, { useState } from 'react';
import SCADNavbar from './SCADNavbar';

const dummyInternships = [
  {
    id: 1,
    company: 'Tech Innovators Ltd.',
    jobTitle: 'Frontend Developer Intern',
    industry: 'Technology',
    duration: '3 months',
    paid: true,
    expectedSalary: 1200,
    skills: ['React', 'JavaScript', 'CSS'],
    jobDescription: 'Work with the frontend team to build modern web applications using React.',
  },
  {
    id: 2,
    company: 'Green Future Corp.',
    jobTitle: 'Sustainability Analyst Intern',
    industry: 'Environmental',
    duration: '2 months',
    paid: false,
    expectedSalary: 0,
    skills: ['Data Analysis', 'Research', 'Excel'],
    jobDescription: 'Assist in analyzing sustainability data and preparing reports for eco-projects.',
  },
  {
    id: 3,
    company: 'MediCare Plus',
    jobTitle: 'Healthcare Data Intern',
    industry: 'Healthcare',
    duration: '6 months',
    paid: true,
    expectedSalary: 1500,
    skills: ['Python', 'Data Science', 'Healthcare'],
    jobDescription: 'Support the data science team in healthcare analytics and reporting.',
  },
  {
    id: 4,
    company: 'EduWorld',
    jobTitle: 'E-learning Content Creator',
    industry: 'Education',
    duration: '3 months',
    paid: false,
    expectedSalary: 0,
    skills: ['Content Writing', 'Instructional Design', 'Creativity'],
    jobDescription: 'Create engaging e-learning content for digital education platforms.',
  },
  {
    id: 5,
    company: 'Tech Innovators Ltd.',
    jobTitle: 'Backend Developer Intern',
    industry: 'Technology',
    duration: '4 months',
    paid: true,
    expectedSalary: 1300,
    skills: ['Node.js', 'APIs', 'Databases'],
    jobDescription: 'Develop and maintain backend services and APIs for scalable applications.',
  },
];

const industries = ['All', ...Array.from(new Set(dummyInternships.map(i => i.industry)))];
const durations = ['All', ...Array.from(new Set(dummyInternships.map(i => i.duration)))];
const paidOptions = ['All', 'Paid', 'Unpaid'];

const cardStyle = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(35,75,115,0.08)',
  padding: 24,
  marginBottom: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(53,112,142,0.18)',
  border: '2px solid #C0CEDB',
  padding: '32px 28px 24px 28px',
  zIndex: 2001,
  minWidth: 340,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const filterButtonStyle = {
  background: '#F08F36',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 28px',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  minWidth: 120,
  boxShadow: '0 2px 8px #C0CEDB',
  transition: 'background 0.18s',
};

const filterButtonHover = {
  background: '#35708E',
};

const SCADInternships = () => {
  const [internships, setInternships] = useState(dummyInternships);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [duration, setDuration] = useState('All');
  const [paid, setPaid] = useState('All');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  // Temporary filter state for modal
  const [pendingIndustry, setPendingIndustry] = useState(industry);
  const [pendingDuration, setPendingDuration] = useState(duration);
  const [pendingPaid, setPendingPaid] = useState(paid);
  const [filterBtnHover, setFilterBtnHover] = useState(false);

  const filtered = internships.filter(i =>
    (industry === 'All' || i.industry === industry) &&
    (duration === 'All' || i.duration === duration) &&
    (paid === 'All' || (paid === 'Paid' ? i.paid : !i.paid)) &&
    (
      search.trim() === '' ||
      i.jobTitle.toLowerCase().startsWith(search.toLowerCase()) ||
      i.company.toLowerCase().startsWith(search.toLowerCase())
    )
  );

  return (
    <>
      <SCADNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Available Internships</h1>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by job title or company name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 2, minWidth: 180, padding: '10px 14px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73' }}
            />
            <button
              style={filterBtnHover ? { ...filterButtonStyle, ...filterButtonHover } : filterButtonStyle}
              onMouseOver={() => setFilterBtnHover(true)}
              onMouseOut={() => setFilterBtnHover(false)}
              onFocus={() => setFilterBtnHover(true)}
              onBlur={() => setFilterBtnHover(false)}
              onClick={() => {
                setPendingIndustry(industry);
                setPendingDuration(duration);
                setPendingPaid(paid);
                setShowFilterModal(true);
              }}
            >
              Filter
            </button>
          </div>
          {filtered.length === 0 ? (
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No internships found.</div>
          ) : (
            filtered.map(internship => (
              <div key={internship.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{internship.jobTitle}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>{internship.company}</div>
                  </div>
                  <button
                    style={{ background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
                    onClick={() => setSelectedInternship(internship)}
                  >
                    View Details
                  </button>
                </div>
                <div style={{ color: '#8C8C8C', fontSize: 15 }}>{internship.industry} | {internship.duration} | {internship.paid ? 'Paid' : 'Unpaid'}</div>
              </div>
            ))
          )}
        </div>
        {/* Filter Modal */}
        {showFilterModal && (
          <>
            <div
              style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }}
              onClick={() => setShowFilterModal(false)}
            />
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22, letterSpacing: 0.2 }}>Filter Internships</span>
                <button
                  onClick={() => setShowFilterModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: 28, color: '#F08F36', cursor: 'pointer', fontWeight: 900, borderRadius: 6, transition: 'background 0.15s' }}
                  aria-label="Close filter modal"
                  onMouseOver={e => (e.currentTarget.style.background = '#C0CEDB')}
                  onMouseOut={e => (e.currentTarget.style.background = 'none')}
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={{ color: '#234B73', fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Industry:
                  <select
                    value={pendingIndustry}
                    onChange={e => setPendingIndustry(e.target.value)}
                    style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73', boxShadow: '0 1px 4px #C0CEDB22' }}
                  >
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </label>
                <label style={{ color: '#234B73', fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Duration:
                  <select
                    value={pendingDuration}
                    onChange={e => setPendingDuration(e.target.value)}
                    style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73', boxShadow: '0 1px 4px #C0CEDB22' }}
                  >
                    {durations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
                  </select>
                </label>
                <label style={{ color: '#234B73', fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Paid/Unpaid:
                  <select
                    value={pendingPaid}
                    onChange={e => setPendingPaid(e.target.value)}
                    style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73', boxShadow: '0 1px 4px #C0CEDB22' }}
                  >
                    {paidOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
                <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                  <button
                    style={{ flex: 1, background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'background 0.18s' }}
                    onMouseOver={e => (e.currentTarget.style.background = '#35708E')}
                    onMouseOut={e => (e.currentTarget.style.background = '#8C8C8C')}
                    onClick={() => {
                      setPendingIndustry('All');
                      setPendingDuration('All');
                      setPendingPaid('All');
                    }}
                  >
                    Clear Filters
                  </button>
                  <button
                    style={{ flex: 1, background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'background 0.18s' }}
                    onMouseOver={e => (e.currentTarget.style.background = '#35708E')}
                    onMouseOut={e => (e.currentTarget.style.background = '#F08F36')}
                    onClick={() => {
                      setIndustry(pendingIndustry);
                      setDuration(pendingDuration);
                      setPaid(pendingPaid);
                      setShowFilterModal(false);
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Internship Details Modal */}
        {selectedInternship && (
          <div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={() => setSelectedInternship(null)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '36px 32px 28px 32px', zIndex: 2001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 24, marginBottom: 10 }}>{selectedInternship.jobTitle}</h2>
              <div style={{ color: '#5A6A7A', fontSize: 17, marginBottom: 8 }}>{selectedInternship.company}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Industry:</b> {selectedInternship.industry}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Duration:</b> {selectedInternship.duration}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Paid:</b> {selectedInternship.paid ? 'Paid' : 'Unpaid'}</div>
              {selectedInternship.paid && (
                <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Expected Salary:</b> ${selectedInternship.expectedSalary} / month</div>
              )}
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 8 }}><b>Skills Required:</b> {selectedInternship.skills.join(', ')}</div>
              <div style={{ color: '#234B73', fontSize: 16, marginBottom: 16 }}><b>Job Description:</b> {selectedInternship.jobDescription}</div>
              <button
                style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10 }}
                onClick={() => setSelectedInternship(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SCADInternships; 