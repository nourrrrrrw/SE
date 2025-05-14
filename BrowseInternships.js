import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../App';
//import { sendApplicationNotificationToCompany } from '../services/emailService';

const industryOptions = [
  'Technology', 'E-Commerce', 'Automotive', 'Finance', 'Media', 'Consulting', 'Manufacturing', 'Healthcare', 'Telecommunications', 'Energy', 'Retail', 'Logistics', 'Design', 'Marketing', 'Engineering', 'Education', 'Government', 'Hospitality', 'Real Estate', 'Aerospace', 'Agriculture', 'Legal', 'Nonprofit', 'Research', 'Sports', 'Travel', 'Utilities', 'Others'
];

const dummyInternships = [
  {
    id: 1,
    company: 'Google',
    industry: 'Technology',
    title: 'Software Engineer Intern',
    location: 'Mountain View, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3500,
    skills: ['Python', 'Cloud', 'Distributed Systems'],
    description: 'Work on scalable backend systems and contribute to Google Cloud.'
  },
  {
    id: 26,
    company: 'BMW',
    industry: 'Automotive',
    title: 'Automotive Engineering Intern',
    location: 'Munich, Germany',
    duration: '6 months',
    paid: true,
    expectedSalary: 6000,
    skills: ['Automotive Engineering', 'CAD', 'Vehicle Dynamics', 'German Language'],
    description: 'Work on next-generation electric vehicle development and testing. Collaborate with international teams on innovative automotive solutions.'
  },
  {
    id: 2,
    company: 'Microsoft',
    industry: 'Technology',
    title: 'Product Manager Intern',
    location: 'Redmond, WA',
    duration: '12 weeks',
    paid: false,
    expectedSalary: 0,
    skills: ['Product Management', 'Communication', 'Leadership'],
    description: 'Drive product vision and collaborate with engineering teams.'
  },
  {
    id: 3,
    company: 'Amazon',
    industry: 'E-Commerce',
    title: 'Data Analyst Intern',
    location: 'Seattle, WA',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['SQL', 'Data Analysis', 'Python'],
    description: 'Analyze large datasets to improve customer experience.'
  },
  {
    id: 4,
    company: 'Meta',
    industry: 'Technology',
    title: 'UX Designer Intern',
    location: 'Menlo Park, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['UX Design', 'Figma', 'Prototyping'],
    description: 'Design user interfaces for new social media features.'
  },
  {
    id: 5,
    company: 'Tesla',
    industry: 'Automotive',
    title: 'Mechanical Engineer Intern',
    location: 'Fremont, CA',
    duration: '4 months',
    paid: true,
    expectedSalary: 4000,
    skills: ['Mechanical Engineering', 'CAD', 'Manufacturing'],
    description: 'Work on electric vehicle design and manufacturing.'
  },
  {
    id: 6,
    company: 'Apple',
    industry: 'Technology',
    title: 'iOS Developer Intern',
    location: 'Cupertino, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3700,
    skills: ['Swift', 'iOS', 'Mobile Development'],
    description: 'Develop and test new features for iOS devices.'
  },
  {
    id: 7,
    company: 'IBM',
    industry: 'Technology',
    title: 'AI Research Intern',
    location: 'Yorktown Heights, NY',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['AI', 'Machine Learning', 'Python'],
    description: 'Research and prototype AI models for enterprise solutions.'
  },
  {
    id: 8,
    company: 'Intel',
    industry: 'Technology',
    title: 'Hardware Engineer Intern',
    location: 'Santa Clara, CA',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3300,
    skills: ['Hardware', 'VHDL', 'Microprocessors'],
    description: 'Design and test next-generation microprocessors.'
  },
  {
    id: 9,
    company: 'Netflix',
    industry: 'Media',
    title: 'Content Analyst Intern',
    location: 'Los Gatos, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3200,
    skills: ['Data Analysis', 'Content', 'SQL'],
    description: 'Analyze viewing data to optimize content recommendations.'
  },
  {
    id: 10,
    company: 'Salesforce',
    industry: 'Technology',
    title: 'Cloud Solutions Intern',
    location: 'San Francisco, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['Cloud', 'Salesforce', 'APEX'],
    description: 'Support cloud platform development and customer onboarding.'
  },
  {
    id: 11,
    company: 'Oracle',
    industry: 'Technology',
    title: 'Database Admin Intern',
    location: 'Austin, TX',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['Databases', 'SQL', 'Oracle'],
    description: 'Assist in database management and optimization.'
  },
  {
    id: 12,
    company: 'Adobe',
    industry: 'Design',
    title: 'Graphic Designer Intern',
    location: 'San Jose, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3000,
    skills: ['Graphic Design', 'Photoshop', 'Illustrator'],
    description: 'Create marketing materials and digital assets.'
  },
  {
    id: 13,
    company: 'Spotify',
    industry: 'Media',
    title: 'Music Data Intern',
    location: 'New York, NY',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['Data Analysis', 'Music', 'Python'],
    description: 'Analyze music trends and user listening patterns.'
  },
  {
    id: 14,
    company: 'Twitter',
    industry: 'Media',
    title: 'Backend Developer Intern',
    location: 'San Francisco, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['Backend', 'APIs', 'Node.js'],
    description: 'Build and maintain scalable backend services.'
  },
  {
    id: 15,
    company: 'Uber',
    industry: 'Logistics',
    title: 'Operations Intern',
    location: 'Chicago, IL',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['Operations', 'Excel', 'Data Analysis'],
    description: 'Support city operations and data-driven decision making.'
  },
  {
    id: 16,
    company: 'Airbnb',
    industry: 'Hospitality',
    title: 'Frontend Developer Intern',
    location: 'San Francisco, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3300,
    skills: ['Frontend', 'React', 'JavaScript'],
    description: 'Develop user-facing features for the Airbnb platform.'
  },
  {
    id: 17,
    company: 'LinkedIn',
    industry: 'Technology',
    title: 'Business Analyst Intern',
    location: 'Sunnyvale, CA',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['Business Analysis', 'Excel', 'SQL'],
    description: 'Analyze business metrics and support product strategy.'
  },
  {
    id: 18,
    company: 'Snap Inc.',
    industry: 'Media',
    title: 'AR Developer Intern',
    location: 'Los Angeles, CA',
    duration: '3 months',
    paid: true,
    expectedSalary: 3200,
    skills: ['AR', 'Unity', 'C#'],
    description: 'Prototype augmented reality features for Snapchat.'
  },
  {
    id: 19,
    company: 'Dell',
    industry: 'Technology',
    title: 'IT Support Intern',
    location: 'Round Rock, TX',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3000,
    skills: ['IT Support', 'Troubleshooting', 'Windows'],
    description: 'Provide technical support and troubleshoot IT issues.'
  },
  {
    id: 20,
    company: 'Siemens',
    industry: 'Engineering',
    title: 'Electrical Engineer Intern',
    location: 'Munich, Germany',
    duration: '4 months',
    paid: true,
    expectedSalary: 3500,
    skills: ['Electrical Engineering', 'Automation', 'PLC'],
    description: 'Work on industrial automation and control systems.'
  },
  {
    id: 21,
    company: 'Samsung',
    industry: 'Technology',
    title: 'Mobile App Developer Intern',
    location: 'Seoul, South Korea',
    duration: '3 months',
    paid: true,
    expectedSalary: 3400,
    skills: ['Android', 'Kotlin', 'Mobile Development'],
    description: 'Develop and test Android applications for Samsung devices.'
  },
  {
    id: 22,
    company: 'Huawei',
    industry: 'Telecommunications',
    title: 'Network Engineer Intern',
    location: 'Shenzhen, China',
    duration: '12 weeks',
    paid: true,
    expectedSalary: 3200,
    skills: ['Networking', 'Cisco', 'Linux'],
    description: 'Support network infrastructure projects and testing.'
  },
  {
    id: 23,
    company: 'BASF',
    industry: 'Manufacturing',
    title: 'Chemical Engineer Intern',
    location: 'Ludwigshafen, Germany',
    duration: '3 months',
    paid: true,
    expectedSalary: 3300,
    skills: ['Chemical Engineering', 'Process Optimization', 'Safety'],
    description: 'Assist in chemical process optimization and safety.'
  },
  {
    id: 24,
    company: 'Procter & Gamble',
    industry: 'Retail',
    title: 'Marketing Intern',
    location: 'Cincinnati, OH',
    duration: '10 weeks',
    paid: true,
    expectedSalary: 3100,
    skills: ['Marketing', 'Consumer Research', 'Excel'],
    description: 'Support marketing campaigns and consumer research.'
  },
  {
    id: 25,
    company: 'Unilever',
    industry: 'Retail',
    title: 'Supply Chain Intern',
    location: 'London, UK',
    duration: '3 months',
    paid: true,
    expectedSalary: 3200,
    skills: ['Supply Chain', 'Logistics', 'Excel'],
    description: 'Optimize supply chain processes and logistics.'
  }
];

const cardStyle = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: 24,
  marginBottom: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  cursor: 'pointer',
  transition: 'box-shadow 0.2s',
};
const expandedStyle = {
  background: '#F6F8FA',
  borderRadius: 10,
  marginTop: 12,
  padding: 18,
  color: '#234B73',
  fontSize: 15,
};

const getDurationCategory = (duration) => {
  // Normalize duration to weeks
  if (!duration) return '';
  const lower = duration.toLowerCase();
  let weeks = 0;
  if (lower.includes('month')) {
    const num = parseInt(lower);
    weeks = num * 4;
  } else if (lower.includes('week')) {
    const num = parseInt(lower);
    weeks = num;
  }
  if (weeks < 8) return '<2 months';
  if (weeks <= 12) return '2-3 months';
  return '>3 months';
};

const BrowseInternships = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  // Filter state for modal (pending)
  const [pendingIndustry, setPendingIndustry] = useState('');
  const [pendingDuration, setPendingDuration] = useState('');
  const [pendingPaid, setPendingPaid] = useState('');
  // Applied filter state
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterPaid, setFilterPaid] = useState('');
  // Application modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingInternship, setApplyingInternship] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({ cv: null, coverLetter: null, certificates: [] });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { applications, setApplications, user } = useAuth();
  const [internships, setInternships] = useState([]);

  // Duration categories
  const durationOptions = ['<2 months', '2-3 months', '>3 months'];

  useEffect(() => {
    // In a real app, fetch internships from API
    setInternships(dummyInternships.filter(i => i.status !== 'completed'));
  }, []);

  // Filtered and searched internships
  const filteredInternships = dummyInternships.filter(intern => {
    // Search by job title or company (first letters only, case-insensitive)
    const s = search.trim().toLowerCase();
    if (s) {
      const title = intern.title.toLowerCase();
      const company = intern.company.toLowerCase();
      if (!(title.startsWith(s) || company.startsWith(s))) return false;
    }
    // Industry filter
    if (filterIndustry && intern.industry !== filterIndustry) return false;
    // Duration filter
    if (filterDuration && getDurationCategory(intern.duration) !== filterDuration) return false;
    // Paid filter
    if (filterPaid && ((filterPaid === 'Paid' && !intern.paid) || (filterPaid === 'Unpaid' && intern.paid))) return false;
    return true;
  });

  const openFilterModal = () => {
    setPendingIndustry(filterIndustry);
    setPendingDuration(filterDuration);
    setPendingPaid(filterPaid);
    setShowFilter(true);
  };

  const applyFilters = () => {
    setFilterIndustry(pendingIndustry);
    setFilterDuration(pendingDuration);
    setFilterPaid(pendingPaid);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setPendingIndustry('');
    setPendingDuration('');
    setPendingPaid('');
  };

  // Application modal handlers
  const openApplyModal = (intern) => {
    setApplyingInternship(intern);
    setShowApplyModal(true);
    setUploadedFiles({ cv: null, coverLetter: null, certificates: [] });
    setSubmitSuccess(false);
  };
  const closeApplyModal = () => {
    setShowApplyModal(false);
    setApplyingInternship(null);
    setUploadedFiles({ cv: null, coverLetter: null, certificates: [] });
    setSubmitSuccess(false);
  };
  const handleFileChange = (e, type) => {
    if (type === 'certificates') {
      setUploadedFiles(f => ({ ...f, certificates: Array.from(e.target.files) }));
    } else {
      setUploadedFiles(f => ({ ...f, [type]: e.target.files[0] }));
    }
  };
  const handleApplySubmit = (e) => {
    e.preventDefault();
    // Create new application object
    const newApplication = {
      id: Date.now(), // Use timestamp as unique ID
      company: applyingInternship.company,
      position: applyingInternship.title,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      location: applyingInternship.location,
      duration: applyingInternship.duration,
      startDate: '', // These would be filled in when the application is approved
      endDate: '',
      files: uploadedFiles // Store the uploaded files
    };
    
    // Add to applications state
    setApplications(prev => [...prev, newApplication]);
    setSubmitSuccess(true);

    // Send email notification to company
    // sendApplicationNotificationToCompany(
    //   'company@email.com', // Replace with real company email if available
    //   applyingInternship.company,
    //   user?.fullName || user?.email || 'Student',
    //   user?.id || user?.email || 'student-id',
    //   applyingInternship.title
    // );
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0', marginTop: 72 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>SCAD Offered Internships</h1>
          <div style={{ display: 'flex', gap: 18, marginBottom: 32, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 16, outline: 'none', background: '#fff', color: '#234B73' }}
            />
            <button
              style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #F08F36', transition: 'background 0.2s' }}
              onClick={openFilterModal}
            >
              Filter
            </button>
          </div>
          {/* Filter Modal */}
          {showFilter && (
            <>
              <div
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }}
                onClick={() => setShowFilter(false)}
              />
              <div
                style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '36px 32px 28px 32px', zIndex: 2001, minWidth: 340, maxWidth: '90vw' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Filter Internships</span>
                  <button
                    onClick={() => setShowFilter(false)}
                    style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}
                    aria-label="Close filter modal"
                  >
                    ×
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <label style={{ color: '#234B73', fontWeight: 500 }}>
                    Industry:
                    <select
                      value={pendingIndustry}
                      onChange={e => setPendingIndustry(e.target.value)}
                      style={{ width: '100%', marginTop: 6, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      <option value="">All</option>
                      {industryOptions.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </label>
                  <label style={{ color: '#234B73', fontWeight: 500 }}>
                    Duration:
                    <select
                      value={pendingDuration}
                      onChange={e => setPendingDuration(e.target.value)}
                      style={{ width: '100%', marginTop: 6, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      <option value="">All</option>
                      {durationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </label>
                  <label style={{ color: '#234B73', fontWeight: 500 }}>
                    Paid/Unpaid:
                    <select
                      value={pendingPaid}
                      onChange={e => setPendingPaid(e.target.value)}
                      style={{ width: '100%', marginTop: 6, borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, background: '#fff', color: '#234B73' }}
                    >
                      <option value="">All</option>
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button
                      style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                    <button
                      style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {filteredInternships.length === 0 ? (
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No internships found.</div>
          ) : (
            filteredInternships.map((intern) => (
              <div
                key={intern.id}
                style={{ ...cardStyle, boxShadow: expandedId === intern.id ? '0 8px 32px rgba(35,75,115,0.18)' : cardStyle.boxShadow }}
                onClick={() => setExpandedId(expandedId === intern.id ? null : intern.id)}
              >
                <div style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{intern.title}</div>
                <div style={{ color: '#F08F36', fontWeight: 600, fontSize: 17 }}>{intern.company}</div>
                <div style={{ color: '#8C8C8C', fontSize: 15 }}>{intern.location} &bull; {intern.duration}</div>
                <div style={{ color: '#234B73', fontSize: 15 }}>{intern.description}</div>
                {expandedId === intern.id && (
                  <div style={expandedStyle}>
                    <div style={{ marginBottom: 10 }}><b>Company:</b> {intern.company}</div>
                    <div style={{ marginBottom: 10 }}><b>Industry:</b> {intern.industry}</div>
                    <div style={{ marginBottom: 10 }}><b>Job Title:</b> {intern.title}</div>
                    <div style={{ marginBottom: 10 }}><b>Duration:</b> {intern.duration}</div>
                    <div style={{ marginBottom: 10 }}><b>Paid:</b> {intern.paid ? 'Paid' : 'Unpaid'}</div>
                    {intern.paid && (
                      <div style={{ marginBottom: 10 }}><b>Expected Salary:</b> ${intern.expectedSalary} / month</div>
                    )}
                    <div style={{ marginBottom: 10 }}><b>Skills Required:</b> {intern.skills && intern.skills.length > 0 ? intern.skills.join(', ') : 'N/A'}</div>
                    <div style={{ marginBottom: 10 }}><b>Job Description:</b> {intern.description}</div>
                    <button
                      style={{ marginTop: 18, background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); openApplyModal(intern); }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Apply Modal */}
      {showApplyModal && applyingInternship && (
        <>
          <div
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 3000 }}
            onClick={closeApplyModal}
          />
          <div
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '36px 32px 28px 32px', zIndex: 3001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Apply for {applyingInternship.title} at {applyingInternship.company}</span>
              <button
                onClick={closeApplyModal}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }}
                aria-label="Close apply modal"
              >
                ×
              </button>
            </div>
            {submitSuccess ? (
              <div style={{ color: '#234B73', fontWeight: 600, fontSize: 18, textAlign: 'center', padding: 24 }}>
                Application submitted successfully!
                <div style={{ marginTop: 18 }}>
                  <button
                    style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                    onClick={closeApplyModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={{ color: '#234B73', fontWeight: 500 }}>
                  Upload CV:
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileChange(e, 'cv')} required style={{ marginTop: 6 }} />
                </label>
                <label style={{ color: '#234B73', fontWeight: 500 }}>
                  Upload Cover Letter:
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileChange(e, 'coverLetter')} style={{ marginTop: 6 }} />
                </label>
                <label style={{ color: '#234B73', fontWeight: 500 }}>
                  Upload Certificates (optional, multiple):
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={e => handleFileChange(e, 'certificates')} style={{ marginTop: 6 }} />
                </label>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    type="submit"
                    style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                    onClick={closeApplyModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default BrowseInternships; 