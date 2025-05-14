import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Navbar from './Navbar';
import { dummyWorkshops } from './CareerWorkshop';

// Helper to get attended workshops and certificates from local state
const getAttendedWorkshops = (registrations, attendedWorkshops) => {
  return dummyWorkshops.filter(ws => registrations[ws.id] && attendedWorkshops.includes(ws.id));
};

const WorkshopCertificates = ({ registrations, attendedWorkshops, certificates, user }) => {
  const navigate = useNavigate();
  const attended = getAttendedWorkshops(registrations, attendedWorkshops);

  // Restrict access to pro students only
  if (!user?.isProStudent) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#f6f8fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(35,75,115,0.10)', padding: '56px 48px 48px 48px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F08F36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" /></svg>
              </div>
            </div>
            <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Pro Feature</h1>
            <div style={{ color: '#5A6A7A', fontSize: 18, marginBottom: 32, lineHeight: 1.6 }}>
              This feature is exclusively available for Pro students. Upgrade your account to access SCAD appointments, career workshops, and online assessments.
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 38px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #234B7322' }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleDownloadCertificate = (ws) => {
    const certText = `Certificate of Attendance\n\nThis certifies that ${user?.fullName || 'Student'}' attended the workshop: ${ws.title} on ${ws.date} at ${ws.time}.`;
    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =` Certificate-${ws.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 32, maxWidth: 900, margin: '72px auto 0 auto' }}>
        <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>My Workshop Certificates</h1>
        {attended.length === 0 ? (
          <div style={{ color: '#8C8C8C', textAlign: 'center', padding: '32px', fontSize: 18 }}>
            You have not earned any workshop certificates yet.
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
            {attended.map(ws => (
              <div key={ws.id} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 20, color: '#234B73' }}>{ws.title}</div>
                <div style={{ color: '#8C8C8C', fontSize: 15, marginBottom: 8 }}>{ws.date} {ws.time}</div>
                <button onClick={() => handleDownloadCertificate(ws)} style={{ background: '#234B73', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Download Certificate</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => navigate('/career-workshop')} style={{ marginTop: 32, background: '#F08F36', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>&larr; Back to Workshops</button>
      </div>
    </>
  );
};

export default WorkshopCertificates;