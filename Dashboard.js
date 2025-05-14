import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
///import { sendApplicationStatusEmail } from '../services/emailService';
import { useAuth } from '../App';

const Dashboard = ({ userType = "student", companyName = "Company Name" }) => {
  const { user, userType: authUserType } = useAuth();
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "Your company registration has been approved by SCAD", 
      isNew: true,
      type: 'registration',
      status: 'approved'
    },
    { 
      id: 2, 
      message: "New application received for Software Engineering Internship", 
      isNew: true,
      type: 'application',
      internshipTitle: 'Software Engineering Internship'
    },
    { 
      id: 3, 
      message: "Your company registration is pending SCAD approval", 
      isNew: false,
      type: 'registration',
      status: 'pending'
    }
  ]);

  // Add state for edit modes
  const [editModes, setEditModes] = useState({
    companyDescription: false,
    previousInternships: false,
    achievements: false
  });

  // Add state for editable content
  const [editableContent, setEditableContent] = useState({
    companyDescription: "A 50-employee startup innovating payment technologies since 2020",
    previousInternships: {
      overview: "Hosted 5 interns in 2024, worked on payment gateway enhancements",
      testimonials: [
        "Great learning experience — John, 2024 Intern",
        "Excellent mentorship and real-world projects — Sarah, 2024 Intern"
      ]
    },
    achievements: [
      "Successfully launched payment gateway in 2023",
      "Processed over 1M transactions in 2024",
      "Recognized as Top FinTech Startup 2024",
      "Achieved 99.9% uptime for payment services"
    ]
  });

  // Get active interns count from localStorage
  const getActiveInternsCount = () => {
    const allInterns = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('applicants_')) {
        const applicants = JSON.parse(localStorage.getItem(key) || '[]');
        applicants.forEach(applicant => {
          if (applicant.status === 'current intern') {
            allInterns.push(applicant);
          }
        });
      }
    }
    return allInterns.length;
  };

  // Get successful interns count from localStorage
  const getSuccessfulInternsCount = () => {
    const allInterns = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('applicants_')) {
        const applicants = JSON.parse(localStorage.getItem(key) || '[]');
        applicants.forEach(applicant => {
          if (applicant.status === 'completed') {
            allInterns.push(applicant);
          }
        });
      }
    }
    return allInterns.length;
  };

  const [activeInternsCount, setActiveInternsCount] = useState(getActiveInternsCount());
  const [successfulInternsCount, setSuccessfulInternsCount] = useState(getSuccessfulInternsCount());

  // Update counts when component mounts
  useEffect(() => {
    setActiveInternsCount(getActiveInternsCount());
    setSuccessfulInternsCount(getSuccessfulInternsCount());
  }, []);

  // Add profile completion notification if needed
  useEffect(() => {
    if (userType === 'company') {
      const missingProfile = [
        !user?.companyOverview,
        !user?.website,
        !user?.linkedin,
        !user?.instagram,
        !user?.foundedYear,
        !user?.location,
      ].some(Boolean);
      const alreadyNotified = notifications.some(n => n.message.includes('complete your company profile'));
      if (missingProfile && !alreadyNotified) {
        setNotifications(prev => [
          { id: Date.now(), message: 'Please complete your company profile for a better experience.', isNew: true },
          ...prev
        ]);
      }
    }
    // eslint-disable-next-line
  }, [user, userType]);

  const [applications, setApplications] = useState([
    { id: 1, student: "Ahmed Mohamed", position: "Software Engineer", status: "Pending", date: "2025-04-25" },
    { id: 2, student: "Sarah Ali", position: "UX Designer", status: "Approved", date: "2025-04-20" },
    { id: 3, student: "Mohamed Hassan", position: "Product Manager", status: "Rejected", date: "2025-04-15" }
  ]);

  const [interns, setInterns] = useState([
    { id: 1, name: "Ahmed Mohamed", position: "Software Engineer", startDate: "2025-03-01", status: "Active" },
    { id: 2, name: "Sarah Ali", position: "UX Designer", startDate: "2025-03-15", status: "Active" }
  ]);

  const [reports, setReports] = useState([
    { id: 1, intern: "Ahmed Mohamed", title: "Week 1 Report", status: "Submitted", date: "2025-04-01" },
    { id: 2, intern: "Sarah Ali", title: "Week 2 Report", status: "Pending Review", date: "2025-04-08" }
  ]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isNew: false
    }));
    setNotifications(updatedNotifications);
  };

  const handleApplicationStatusChange = async (applicationId, newStatus) => {
    try {
      // Update application status
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);

      // Get the application details
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        // Send email notification
        // await sendApplicationStatusEmail(
        //   user.email,
        //   companyName,
        //   application.student,
        //   application.position,
        //   newStatus
        // );
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  // Toggle edit mode for a section
  const toggleEditMode = (section) => {
    setEditModes(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle content changes
  const handleContentChange = (section, value) => {
    setEditableContent(prev => ({
      ...prev,
      [section]: value
    }));
  };

  // Handle testimonial changes
  const handleTestimonialChange = (index, value) => {
    setEditableContent(prev => ({
      ...prev,
      previousInternships: {
        ...prev.previousInternships,
        testimonials: prev.previousInternships.testimonials.map((testimonial, i) => 
          i === index ? value : testimonial
        )
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner with Summary Cards */}
        <div className="bg-gradient-to-r from-[#234B73] to-[#1a3a5a] text-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {companyName}!</h2>
          <p className="mb-4">Here's a summary of your internship program status.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-80">Active Interns</p>
              <p className="text-2xl font-bold">{activeInternsCount}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-80">Pending Applications</p>
              <p className="text-2xl font-bold">{applications.filter(app => app.status === "Pending").length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm opacity-80">Successful Interns</p>
              <p className="text-2xl font-bold">{successfulInternsCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / Navigation */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-[#234B73] mb-4">Navigation</h2>
              <nav className="space-y-2">
                <Link to="/dashboard" className="block px-4 py-2 rounded-md bg-[#234B73] text-white font-medium">Dashboard</Link>
                <Link to="/internships" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#F08F36] hover:text-white transition duration-150 font-semibold">Internships</Link>
                <Link to="/all-applicants" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#F08F36] hover:text-white transition duration-150 font-semibold">Applicants</Link>
                {authUserType === 'company' && (
                  <Link to="/all-current-interns" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#F08F36] hover:text-white transition duration-150 font-semibold">Interns</Link>
                )}
                {authUserType === 'company' && (
                  <Link to="/completed-interns" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#F08F36] hover:text-white transition duration-150 font-semibold">Completed Interns</Link>
                )}
                <Link to="/browse-internships" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#F08F36] hover:text-white transition duration-150 font-semibold">SCAD Offered Internships</Link>
                <Link to="/profile" className="block px-4 py-2 rounded-md text-[#234B73] hover:bg-[#F08F36] hover:text-white transition duration-150 font-semibold">Profile</Link>
              </nav>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Notifications</h2>
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-[#F08F36] hover:underline">
                  Mark all as read
                </button>
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-[#8C8C8C] text-center py-2">No new notifications</p>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded ${notification.isNew ? 'bg-[#C0CEDB] bg-opacity-40' : 'bg-gray-50'}`}>
                      <p className="text-sm text-[#234B73]">{notification.message}</p>
                      {notification.isNew && (
                        <span className="inline-block w-2 h-2 bg-[#F08F36] rounded-full ml-2"></span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Company Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#234B73]">Company Description</h3>
                <button 
                  onClick={() => toggleEditMode('companyDescription')}
                  className="text-[#F08F36] hover:text-[#e07d25] transition duration-150"
                >
                  {editModes.companyDescription ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                {editModes.companyDescription ? (
                  <>
                    <textarea 
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08F36] text-base"
                      rows="3"
                      value={editableContent.companyDescription}
                      onChange={(e) => handleContentChange('companyDescription', e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <button className="px-4 py-2 bg-[#F08F36] text-white rounded-md hover:bg-[#e07d25] transition duration-150">
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-[#234B73] text-base leading-relaxed">{editableContent.companyDescription}</p>
                )}
              </div>
            </div>

            {/* Previous Internships and Experience */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#234B73]">Previous Internships and Experience</h3>
                <button 
                  onClick={() => toggleEditMode('previousInternships')}
                  className="text-[#F08F36] hover:text-[#e07d25] transition duration-150"
                >
                  {editModes.previousInternships ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className="font-medium text-[#234B73] mb-2">Internship Program Overview</h4>
                  {editModes.previousInternships ? (
                    <textarea 
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08F36] text-base"
                      rows="2"
                      value={editableContent.previousInternships.overview}
                      onChange={(e) => handleContentChange('previousInternships', {
                        ...editableContent.previousInternships,
                        overview: e.target.value
                      })}
                    />
                  ) : (
                    <p className="text-[#234B73] text-base leading-relaxed">{editableContent.previousInternships.overview}</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-[#234B73] mb-2">Intern Testimonials</h4>
                  <div className="space-y-2">
                    {editModes.previousInternships ? (
                      <>
                        {editableContent.previousInternships.testimonials.map((testimonial, index) => (
                          <textarea
                            key={index}
                            className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08F36] mb-2 text-base"
                            rows="2"
                            value={testimonial}
                            onChange={(e) => handleTestimonialChange(index, e.target.value)}
                          />
                        ))}
                        <div className="mt-2 flex justify-end">
                          <button className="px-4 py-2 bg-[#F08F36] text-white rounded-md hover:bg-[#e07d25] transition duration-150">
                            Save Changes
                          </button>
                        </div>
                      </>
                    ) : (
                      editableContent.previousInternships.testimonials.map((testimonial, index) => (
                        <p key={index} className="text-[#234B73] text-base leading-relaxed italic">{testimonial}</p>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#234B73]">Achievements</h3>
                <button 
                  onClick={() => toggleEditMode('achievements')}
                  className="text-[#F08F36] hover:text-[#e07d25] transition duration-150"
                >
                  {editModes.achievements ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="space-y-4">
                {editModes.achievements ? (
                  <>
                    <textarea 
                      className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08F36] text-base"
                      rows="5"
                      value={editableContent.achievements.join('\n')}
                      onChange={(e) => handleContentChange('achievements', e.target.value.split('\n'))}
                      placeholder="• List your company achievements here&#10;• Each achievement on a new line&#10;• Use bullet points for better readability"
                    />
                    <div className="mt-2 flex justify-end">
                      <button className="px-4 py-2 bg-[#F08F36] text-white rounded-md hover:bg-[#e07d25] transition duration-150">
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <ul className="list-disc list-inside text-[#234B73] text-base leading-relaxed">
                    {editableContent.achievements.map((achievement, index) => (
                      <li key={index} className="mb-2">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;