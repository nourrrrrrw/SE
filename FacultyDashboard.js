import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../App';

// Dummy data for demonstration
const dummyReports = [
  {
    id: 1,
    student: { name: 'Youssef Khaled', major: 'CS', email: 'youssef.khaled@student.guc.edu.eg' },
    company: 'Google',
    supervisor: 'John Smith',
    startDate: '2024-07-15',
    endDate: '2024-10-15',
    status: 'pending',
    submissionDate: '2024-07-20',
    title: 'UX Internship Report',
    body: 'Worked on Google UX team...',
    selectedCourses: ['Data Structures', 'Machine Learning'],
    evaluation: { rating: 4.8, comments: 'Excellent performance.' },
    clarification: '',
  },
  {
    id: 2,
    student: { name: 'Salma Ahmed', major: 'CS', email: 'salma.ahmed@student.guc.edu.eg' },
    company: 'Amazon',
    supervisor: 'Sarah Johnson',
    startDate: '2024-07-10',
    endDate: '2024-09-10',
    status: 'flagged',
    submissionDate: '2024-07-18',
    title: 'Backend Internship Report',
    body: 'Worked on AWS backend...',
    selectedCourses: ['Operating Systems', 'Database Systems'],
    evaluation: { rating: 4.2, comments: 'Needs improvement.' },
    clarification: 'Please clarify the data sources used.',
  },
  {
    id: 3,
    student: { name: 'Ahmed Mohamed', major: 'Engineering', email: 'ahmed.mohamed@student.guc.edu.eg' },
    company: 'Microsoft',
    supervisor: 'Michael Brown',
    startDate: '2024-07-05',
    endDate: '2024-09-05',
    status: 'accepted',
    submissionDate: '2024-07-19',
    title: 'Engineering Internship Report',
    body: 'Worked on Azure cloud...',
    selectedCourses: ['Control Systems', 'Dynamics'],
    evaluation: { rating: 4.9, comments: 'Outstanding.' },
    clarification: '',
  },
  {
    id: 4,
    student: { name: 'Sarah Ali', major: 'Business', email: 'sarah.ali@student.guc.edu.eg' },
    company: 'Meta',
    supervisor: 'Anna Schmidt',
    startDate: '2024-07-12',
    endDate: '2024-09-12',
    status: 'rejected',
    submissionDate: '2024-07-21',
    title: 'Business Internship Report',
    body: 'Worked on Meta business analytics...',
    selectedCourses: ['Marketing', 'Business Strategy'],
    evaluation: { rating: 3.5, comments: 'Report incomplete.' },
    clarification: 'Missing key sections.',
  },
];

const majors = ['All', 'CS', 'Engineering', 'Business'];
const statuses = ['All', 'pending', 'flagged', 'rejected', 'accepted'];

const FacultyDashboard = () => {
  const [reports, setReports] = useState(dummyReports);
  const [filterMajor, setFilterMajor] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [clarificationText, setClarificationText] = useState('');
  const reportContentRef = useRef();
  const { logout } = useAuth();

  // Filtered reports
  const filteredReports = reports.filter(r =>
    (filterMajor === 'All' || r.student.major === filterMajor) &&
    (filterStatus === 'All' || r.status === filterStatus) &&
    (r.student.name.toLowerCase().includes(search.toLowerCase()) || r.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Statistics
  const stats = {
    accepted: reports.filter(r => r.status === 'accepted').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
    flagged: reports.filter(r => r.status === 'flagged').length,
    pending: reports.filter(r => r.status === 'pending').length,
    avgReviewTime: 2.3, // Dummy value
    topCourses: ['Data Structures', 'Machine Learning', 'Marketing'],
    topRatedCompanies: [
      { name: 'Microsoft', rating: 4.9 },
      { name: 'Google', rating: 4.8 },
    ],
    topCompaniesByCount: [
      { name: 'Google', count: 2 },
      { name: 'Amazon', count: 1 },
    ],
  };

  // Change report status
  const setStatus = (id, status) => {
    setReports(reports => reports.map(r => r.id === id ? { ...r, status } : r));
  };

  // Submit clarification
  const submitClarification = (id) => {
    setReports(reports => reports.map(r => r.id === id ? { ...r, clarification: clarificationText } : r));
    setClarificationText('');
    setSelectedReport(null);
  };

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text('Internship Reports Statistics', 10, 10);
    doc.text(`Accepted: ${stats.accepted}`, 10, 20);
    doc.text(`Rejected: ${stats.rejected}`, 10, 30);
    doc.text(`Flagged: ${stats.flagged}`, 10, 40);
    doc.text(`Pending: ${stats.pending}`, 10, 50);
    doc.text(`Avg. Review Time: ${stats.avgReviewTime} days`, 10, 60);
    doc.text(`Top Courses: ${stats.topCourses.join(', ')}`, 10, 70);
    doc.text(`Top Rated Companies: ${stats.topRatedCompanies.map(c => c.name + ' (' + c.rating + ')').join(', ')}`, 10, 80);
    doc.text(`Top Companies by Count: ${stats.topCompaniesByCount.map(c => c.name + ' (' + c.count + ')').join(', ')}`, 10, 90);
    doc.save('faculty-internship-report.pdf');
  };

  // Download full report as PDF
  const downloadReportPDF = (report) => {
    const doc = new jsPDF();
    doc.text('Internship Report', 10, 10);
    doc.text(`Title: ${report.title}`, 10, 20);
    doc.text(`Student: ${report.student.name} (${report.student.major})`, 10, 30);
    doc.text(`Email: ${report.student.email}`, 10, 40);
    doc.text(`Company: ${report.company}`, 10, 50);
    doc.text(`Supervisor: ${report.supervisor}`, 10, 60);
    doc.text(`Internship Dates: ${report.startDate} to ${report.endDate}`, 10, 70);
    doc.text(`Status: ${report.status}`, 10, 80);
    doc.text(`Courses: ${report.selectedCourses.join(', ')}`, 10, 90);
    doc.text('Body:', 10, 100);
    doc.text(report.body, 10, 110, { maxWidth: 180 });
    doc.text(`Evaluation: ${report.evaluation.rating} ★ - ${report.evaluation.comments}`, 10, 140);
    if (report.clarification) {
      doc.text(`Clarification: ${report.clarification}`, 10, 150, { maxWidth: 180 });
    }
    doc.save('internship-report.pdf');
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px' }}>
          <span style={{ fontWeight: 700, fontSize: 28, letterSpacing: 0.5 }}>GUC Internship System</span>
          <button
            onClick={handleLogout}
            style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginLeft: 24 }}
          >
            Logout
          </button>
        </div>
      </div>
      <div style={{ padding: '32px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Welcome, Faculty Member!</h1>
          <div style={{ color: '#35708E', fontSize: 20, fontWeight: 500, marginBottom: 32 }}>
            Here you can review, filter, and manage all internship reports. Use the filters and actions below to get started.
          </div>
          <h2 style={{ color: '#234B73', fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Internship Reports</h2>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 18, marginBottom: 24, alignItems: 'center' }}>
            <select value={filterMajor} onChange={e => setFilterMajor(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 15, color: '#234B73' }}>
              {majors.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 15, color: '#234B73' }}>
              {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <input type="text" placeholder="Search by student or company..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 15, color: '#234B73', flex: 1 }} />
            <button onClick={generateReport} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Generate Report</button>
          </div>
          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 18, marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#C0CEDB', color: '#234B73', fontWeight: 700 }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>Student</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Major</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Company</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Submission</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#8C8C8C', padding: 32 }}>No reports found.</td></tr>
                ) : filteredReports.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: 12 }}>{r.student.name}</td>
                    <td style={{ padding: 12 }}>{r.student.major}</td>
                    <td style={{ padding: 12 }}>{r.company}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ borderRadius: 8, padding: '2px 12px', fontWeight: 700, fontSize: 14, background: r.status === 'accepted' ? '#D1FAE5' : r.status === 'flagged' ? '#FEF3C7' : r.status === 'rejected' ? '#FEE2E2' : '#DBEAFE', color: r.status === 'accepted' ? '#065F46' : r.status === 'flagged' ? '#92400E' : r.status === 'rejected' ? '#991B1B' : '#1E40AF' }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                    </td>
                    <td style={{ padding: 12 }}>{r.submissionDate}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => { setSelectedReport(r); setClarificationText(r.clarification || ''); }} style={{ background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginRight: 8 }}>View</button>
                      <select value={r.status} onChange={e => setStatus(r.id, e.target.value)} style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #C0CEDB', fontSize: 14, color: '#234B73' }}>
                        <option value="pending">Pending</option>
                        <option value="flagged">Flagged</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Statistics */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', padding: '28px', minWidth: 220, minHeight: 120, flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 18, marginBottom: 8 }}>Report Status</div>
              <div>Accepted: <b style={{ color: '#065F46' }}>{stats.accepted}</b> | Rejected: <b style={{ color: '#991B1B' }}>{stats.rejected}</b> | Flagged: <b style={{ color: '#92400E' }}>{stats.flagged}</b> | Pending: <b style={{ color: '#1E40AF' }}>{stats.pending}</b></div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', padding: '28px', minWidth: 220, minHeight: 120, flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 18, marginBottom: 8 }}>Avg. Review Time</div>
              <div style={{ fontSize: 22, color: '#35708E', fontWeight: 800 }}>{stats.avgReviewTime} days</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', padding: '28px', minWidth: 220, minHeight: 120, flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 18, marginBottom: 8 }}>Top Courses</div>
              <div>{stats.topCourses.join(', ')}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', padding: '28px', minWidth: 220, minHeight: 120, flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 18, marginBottom: 8 }}>Top Rated Companies</div>
              <div>{stats.topRatedCompanies.map(c => `${c.name} (${c.rating})`).join(', ')}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', padding: '28px', minWidth: 220, minHeight: 120, flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#234B73', fontSize: 18, marginBottom: 8 }}>Top Companies by Count</div>
              <div>{stats.topCompaniesByCount.map(c => `${c.name} (${c.count})`).join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Report Details Modal */}
      {selectedReport && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={() => setSelectedReport(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(35,75,115,0.18)', padding: '36px 32px 28px 32px', zIndex: 2001, minWidth: 340, maxWidth: '95vw', width: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ color: '#234B73', fontWeight: 700, fontSize: 22 }}>Internship Report Details</span>
              <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#F08F36', cursor: 'pointer', fontWeight: 700 }} aria-label="Close modal">×</button>
            </div>
            <div ref={reportContentRef}>
              <div style={{ color: '#234B73', fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{selectedReport.title}</div>
              <div style={{ color: '#35708E', fontSize: 15, marginBottom: 8 }}>{selectedReport.body}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Courses:</b> {selectedReport.selectedCourses.join(', ')}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Status:</b> <span style={{ borderRadius: 8, padding: '2px 12px', fontWeight: 700, fontSize: 14, background: selectedReport.status === 'accepted' ? '#D1FAE5' : selectedReport.status === 'flagged' ? '#FEF3C7' : selectedReport.status === 'rejected' ? '#FEE2E2' : '#DBEAFE', color: selectedReport.status === 'accepted' ? '#065F46' : selectedReport.status === 'flagged' ? '#92400E' : selectedReport.status === 'rejected' ? '#991B1B' : '#1E40AF' }}>{selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}</span></div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Student:</b> {selectedReport.student.name} ({selectedReport.student.major}) - {selectedReport.student.email}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Company:</b> {selectedReport.company}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Supervisor:</b> {selectedReport.supervisor}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Internship Dates:</b> {selectedReport.startDate} to {selectedReport.endDate}</div>
              <div style={{ color: '#234B73', fontSize: 15, marginBottom: 8 }}><b>Evaluation:</b> {selectedReport.evaluation.rating} ★ - {selectedReport.evaluation.comments}</div>
              {(selectedReport.status === 'flagged' || selectedReport.status === 'rejected') && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ color: '#991B1B', fontWeight: 700, marginBottom: 6 }}>Clarification</div>
                  <textarea value={clarificationText} onChange={e => setClarificationText(e.target.value)} rows={3} style={{ width: '100%', borderRadius: 8, border: '1px solid #C0CEDB', padding: 10, fontSize: 15, resize: 'vertical', background: '#fff', color: '#234B73' }} placeholder="Submit a clarification..." />
                  <button onClick={() => submitClarification(selectedReport.id)} style={{ marginTop: 10, background: '#35708E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Submit Clarification</button>
                </div>
              )}
            </div>
            <button onClick={() => downloadReportPDF(selectedReport)} style={{ marginTop: 18, background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Download Report</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyDashboard; 