import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SCADNavbar from './SCADNavbar';

const dummyStudents = [
  {
    id: 1,
    name: 'Youssef Khaled',
    email: 'youssef.khaled@student.guc.edu.eg',
    status: 'Current Internship',
    major: 'CS',
    profile: {
      year: '3',
      gpa: 3.7,
      phone: '+20 100 123 4567',
      bio: 'Passionate about software engineering and AI.',
    },
    reports: [
      { id: 1, title: 'Google Internship Report', status: 'Accepted' },
      { id: 2, title: 'Microsoft Internship Report', status: 'Flagged' },
    ],
  },
  {
    id: 2,
    name: 'Salma Ahmed',
    email: 'salma.ahmed@student.guc.edu.eg',
    status: 'Completed Internship',
    major: 'CS',
    profile: {
      year: '4',
      gpa: 3.9,
      phone: '+20 101 234 5678',
      bio: 'Interested in UX/UI and product design.',
    },
    reports: [
      { id: 3, title: 'Amazon Internship Report', status: 'Accepted' },
    ],
  },
  {
    id: 3,
    name: 'Omar Fathy',
    email: 'omar.fathy@student.guc.edu.eg',
    status: 'No Internship',
    major: 'Engineering',
    profile: {
      year: '2',
      gpa: 3.2,
      phone: '+20 102 345 6789',
      bio: 'Aspiring mechanical engineer.',
    },
    reports: [],
  },
];

const statuses = ['All', 'No Internship', 'Current Internship', 'Completed Internship'];

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

const SCADManageStudents = () => {
  const [students] = useState(dummyStudents);
  const [status, setStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReports, setShowReports] = useState(false);
  const navigate = useNavigate();

  const filtered = students.filter(s => status === 'All' || s.status === status);

  return (
    <>
      <SCADNavbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Manage Students</h1>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ minWidth: 180, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #C0CEDB', fontSize: 16, background: '#fff', color: '#234B73', boxShadow: '0 1px 4px #C0CEDB22' }}
            >
              {statuses.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? (
            <div style={{ color: '#8C8C8C', textAlign: 'center', padding: 32 }}>No students found.</div>
          ) : (
            filtered.map(student => (
              <div key={student.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: '#234B73' }}>{student.name}</div>
                    <div style={{ color: '#5A6A7A', fontSize: 15 }}>{student.email}</div>
                    <div style={{ color: '#35708E', fontWeight: 600, fontSize: 15 }}>{student.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      style={{ background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.18s' }}
                      onClick={() => navigate(`/scad-students/${student.id}`)}
                      onMouseOver={e => (e.currentTarget.style.background = '#35708E')}
                      onMouseOut={e => (e.currentTarget.style.background = '#F08F36')}
                    >
                      View Profile
                    </button>
                    <button
                      style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.18s' }}
                      onClick={() => { setSelectedStudent(student); setShowReports(true); }}
                      onMouseOver={e => (e.currentTarget.style.background = '#35708E')}
                      onMouseOut={e => (e.currentTarget.style.background = '#234B73')}
                    >
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Reports Modal */}
        {showReports && selectedStudent && (
          <div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000 }} onClick={() => setShowReports(false)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(53,112,142,0.18)', border: '2px solid #C0CEDB', padding: '32px 28px 24px 28px', zIndex: 2001, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#234B73', fontWeight: 700, fontSize: 24, marginBottom: 10 }}>Reports for {selectedStudent.name}</h2>
              {selectedStudent.reports.length === 0 ? (
                <div style={{ color: '#8C8C8C', fontSize: 16 }}>No reports submitted.</div>
              ) : (
                <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                  {selectedStudent.reports.map(report => (
                    <li key={report.id} style={{ marginBottom: 10, color: '#234B73', fontSize: 16, background: '#C0CEDB', borderRadius: 8, padding: '10px 16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span>{report.title}</span>
                      <span style={{ color: report.status === 'Accepted' ? '#065F46' : report.status === 'Flagged' ? '#F08F36' : '#991B1B', fontWeight: 700, fontSize: 15, marginLeft: 'auto' }}>{report.status}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                style={{ background: '#8C8C8C', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 10 }}
                onClick={() => setShowReports(false)}
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

export default SCADManageStudents; 