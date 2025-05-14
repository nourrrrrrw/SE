import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');

  const validateEmail = (email, type) => {
  const studentRegex = /^[a-zA-Z]+\.[a-zA-Z]+@student\.guc\.edu\.eg$/;
  const facultyRegex = /^[a-zA-Z]+@guc\.edu\.eg$/;
  // Allow any email for company
  if (type === 'student') {
    return studentRegex.test(email);
  } else if (type === 'faculty') {
    return facultyRegex.test(email);
  } else if (type === 'company') {
    return true;
  } else {
    return false;
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!validateEmail(email, userType)) {
      setError(`Invalid email format. For ${userType}s, use firstname.lastname@${userType === 'student' ? 'student.' : ''}guc.edu.eg`);
      return;
    }
    
    // Call the login function passed from App.js
    const success = onLogin(email, password, userType);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'linear-gradient(135deg, #234B73 0%, #1a3a5a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(240, 143, 54, 0.15)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(192, 206, 219, 0.2)',
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#234B73',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            GUC
          </div>
          
          <h2 style={{ 
            textAlign: 'center', 
            color: '#234B73', 
            marginBottom: '5px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            GUC Internship System
          </h2>
          <p style={{ 
            color: '#8C8C8C', 
            fontSize: '14px', 
            textAlign: 'center', 
            marginBottom: '30px' 
          }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                backgroundColor: '#FEE2E2', 
                color: '#DC2626', 
                padding: '10px 15px', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px' 
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder={`firstname.lastname@${userType === 'student' ? 'student.' : ''}guc.edu.eg`}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#234B73'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px',
                  border: '1px solid #C0CEDB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Your password"
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <span style={{ 
                fontSize: '14px', 
                color: '#234B73' 
              }}>
                I am a:
              </span>
              <select
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setEmail(''); // Clear email when user type changes
                }}
                required
                style={{ 
                  width: '80%',
                  padding: '10px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: '15px',
                  color: '#234B73',
                  marginBottom: 18
                }}
              >
                <option value="student">Student</option>
                <option value="scad">SCAD</option>
                <option value="faculty">Faculty Member</option>
                <option value="company">Company</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              style={{ 
                width: '100%',
                padding: '12px',
                backgroundColor: '#234B73',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1a3a5a'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#234B73'}
            >
              Sign in
            </button>
          </form>
          
          <div style={{ 
            borderTop: '1px solid #EEE', 
            paddingTop: '15px', 
            textAlign: 'center' 
          }}>
            <a 
              href="/register" 
              style={{ 
                color: '#F08F36', 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.color = '#d97b22'}
              onMouseOut={(e) => e.target.style.color = '#F08F36'}
            >
              New company? Register now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;