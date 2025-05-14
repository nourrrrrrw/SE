import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentProfile from './components/StudentProfile';
import Login from './components/Login';
import CompanyRegistration from './components/CompanyRegistration';
import CompanyDashboard from './components/CompanyDashboard';
import CompanyProfile from './components/CompanyProfile';
import CompanyInternships from './components/CompanyInternships';
import MyInternships from './components/MyInternships';
import BrowseInternships from './components/BrowseInternships';
import ProFeature from './components/ProFeature';
import SCADAppointment from './components/SCADAppointment';
import OnlineAssessments from './components/OnlineAssessments';
import CareerWorkshop from './components/CareerWorkshop';
import WorkshopCertificates from './components/WorkshopCertificates';
import InternshipGuideline from './components/InternshipGuideline';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ApplicantsInfo from './components/ApplicantsInfo';
import './App.css';

// Create Auth context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student', 'admin', 'academic', 'company'
  const [user, setUser] = useState(null);
  // Shared posts state
  const [posts, setPosts] = useState([]);
  // Shared applications state
  const [applications, setApplications] = useState([]);
  // Shared assessment scores state
  const [assessmentScores, setAssessmentScores] = useState({});
  // Workshop certificates state
  const [registrations, setRegistrations] = useState([]);
  const [attendedWorkshops, setAttendedWorkshops] = useState([]);
  const [certificates, setCertificates] = useState([]);
  // Company registrations state
  const [registeredCompanies, setRegisteredCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem('registeredCompanies');
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  });

  // Save companies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('registeredCompanies', JSON.stringify(registeredCompanies));
  }, [registeredCompanies]);

  // Login function
  const handleLogin = async (email, password, type) => {
    console.log('Login attempt:', { email, type });
    if (type === 'company') {
      // Hardcoded company user
      if (email.toLowerCase() === 'nour@gmail.com' && password === 'nour@password') {
        setIsAuthenticated(true);
        setUserType('company');
        setUser({
          email,
          type: 'company',
          fullName: 'Nour Company',
          companyName: 'Nour Company',
          industry: 'Tech',
          logo: ''
        });
        return true;
      }
      // Check if company exists in registered companies
      const company = registeredCompanies.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (company && company.password === password) {
        setIsAuthenticated(true);
        setUserType(type);
        setUser({
          email: company.email,
          type: 'company',
          companyName: company.companyName,
          industry: company.industry,
          logo: company.logo
        });
        return true;
      }
      return false;
    }

    // Handle student logins
    const allowedUsers = {
      'youssef.khaled@student.guc.edu.eg': { password: 'youssef123', isProStudent: true, fullName: 'Youssef Khaled', type: 'student' },
      'salma.ahmed@student.guc.edu.eg': { password: 'salma123', isProStudent: false, fullName: 'Salma Ahmed', type: 'student' },
      'nourhan.ehab@guc.edu.eg': { password: 'nourhan123', fullName: 'Nourhan Ehab', type: 'scad' },
      'syn@guc.edu.eg': { password: 'syn123', fullName: 'Dr. Syn Faculty', type: 'faculty' },
      'hr@company.com': { password: 'company123', fullName: 'HR Manager', type: 'company' },
    };
    // Allow any email/password for company login
    if (type === 'company') {
      setIsAuthenticated(true);
      setUserType('company');
      setUser({
        email,
        type: 'company',
        fullName: email.split('@')[0] || 'Company User',
        isProStudent: false
      });
      return true;
    }
    const userInfo = allowedUsers[email.toLowerCase()];
    if (email && password && userInfo && password === userInfo.password) {
      setIsAuthenticated(true);
      setUserType(userInfo.type);
      setUser({
        email,
        type: userInfo.type,
        fullName: userInfo.fullName,
        isProStudent: userInfo.isProStudent || false
      });
      return true;
    }
    return false;
  };

  // Company registration handler
  const handleCompanyRegistration = (companyData) => {
    console.log('Attempting to register company:', companyData.email);
    // Check if company email already exists
    if (registeredCompanies.some(c => c.email.toLowerCase() === companyData.email.toLowerCase())) {
      console.log('Company already exists:', companyData.email);
      throw new Error('A company with this email already exists');
    }

    // Add new company to registered companies
    console.log('Adding new company:', companyData.email);
    setRegisteredCompanies(prev => {
      const newCompanies = [...prev, companyData];
      console.log('Updated companies list:', newCompanies);
      return newCompanies;
    });
    return true;
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType('');
    setUser(null);
    setApplications([]); // Clear applications on logout
    setAssessmentScores({}); // Clear assessment scores on logout
    setRegistrations([]);
    setAttendedWorkshops([]);
    setCertificates([]);
  };

  // Auth context value
  const authContextValue = {
    isAuthenticated,
    userType,
    user,
    setUser,
    login: handleLogin,
    logout: handleLogout,
    registerCompany: handleCompanyRegistration,
    applications,
    setApplications,
    assessmentScores,
    setAssessmentScores
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {isAuthenticated && <Header />}
          <div className={`${isAuthenticated ? 'pt-16' : ''}`}>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={userType === 'scad' ? "/scad-dashboard" : userType === 'faculty' ? "/faculty-dashboard" : userType === 'company' ? "/company-dashboard" : "/dashboard"} replace /> : <Login onLogin={handleLogin} />} 
          />
          
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CompanyRegistration />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {userType === 'student' ? (
                  <StudentDashboard userType={userType} onLogout={handleLogout} activePage="dashboard" posts={posts} setPosts={setPosts} />
                ) : userType === 'company' ? (
                  <CompanyDashboard />
                ) : (
                  <Dashboard userType={userType} onLogout={handleLogout} activePage="dashboard" />
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-internships" 
            element={
              <ProtectedRoute>
                <MyInternships />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="applications" />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="reports" />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/opportunities" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="opportunities" />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/company-profile" 
            element={
              <ProtectedRoute>
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <StudentProfile posts={posts} setPosts={setPosts} user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Dashboard userType={userType} onLogout={handleLogout} activePage="settings" />
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="/browse-internships"
            element={
              <ProtectedRoute>
                <BrowseInternships />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/applicants-info/:internshipId"
            element={
              <ProtectedRoute>
                <ApplicantsInfo />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/scad-appointment" 
            element={
              <ProtectedRoute>
                <SCADAppointment />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/online-assessments" 
            element={
              <ProtectedRoute>
                <OnlineAssessments />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/career-workshop" 
            element={
              <ProtectedRoute>
                <CareerWorkshop 
                  registrations={registrations}
                  setRegistrations={setRegistrations}
                  attendedWorkshops={attendedWorkshops}
                  setAttendedWorkshops={setAttendedWorkshops}
                  certificates={certificates}
                  setCertificates={setCertificates}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/workshop-certificates" 
            element={
              <ProtectedRoute>
                <WorkshopCertificates 
                  registrations={registrations}
                  attendedWorkshops={attendedWorkshops}
                  certificates={certificates}
                  user={user}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/internship-guideline" 
            element={
              <ProtectedRoute>
                <InternshipGuideline user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/pro-feature" element={<ProFeature />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route 
            path="/company-dashboard" 
            element={
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/company-internships" 
            element={
              <ProtectedRoute>
                <CompanyInternships />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
              <p className="mt-4 text-gray-600">The page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 px-4 py-2 bg-[#234B73] text-white rounded hover:bg-[#1a3a5a]"
              >
                Go Home
              </button>
            </div>
          } />
        </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;