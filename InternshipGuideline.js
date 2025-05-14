import React from 'react';
import Navbar from './Navbar';

const guidelineVideos = {
  CS: {
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    desc: 'For Computer Science majors, internships in software development, data science, cybersecurity, IT support, and related tech fields count towards your requirement.'
  },
  Engineering: {
    url: 'https://www.w3schools.com/html/movie.mp4',
    desc: 'For Engineering majors, internships in mechanical, electrical, civil, chemical, or related engineering fields are accepted.'
  },
  Business: {
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    desc: 'For Business majors, internships in finance, marketing, management, HR, accounting, and similar business roles count towards your requirement.'
  }
};

const InternshipGuideline = ({ user }) => {
  const major = user?.major || 'CS';
  const video = guidelineVideos[major] || guidelineVideos['CS'];

  return (
    <>
      <Navbar />
      <div style={{ padding: 32, maxWidth: 700, margin: '72px auto 0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(35,75,115,0.10)' }}>
        <h1 style={{ color: '#234B73', fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Internship Guideline</h1>
        <video width="100%" controls style={{ borderRadius: 12, marginBottom: 24 }}>
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={{ color: '#234B73', fontSize: 18, fontWeight: 500, marginBottom: 12 }}>
          What kinds of internships count towards your requirement?
        </div>
        <div style={{ color: '#5A6A7A', fontSize: 16, lineHeight: 1.7 }}>{video.desc}</div>
      </div>
    </>
  );
};

export default InternshipGuideline; 