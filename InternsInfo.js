import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const InternsInfo = () => {
  const { internshipId } = useParams();
  
  // Helper to get and set localStorage
  const getLocal = (key, fallback) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  };
  const setLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const internsKey = `interns_${internshipId}`;

  // Initialize with mock data if none exists
  const initialInterns = [
    {
      id: 12,
      name: "Nourhan Tarek",
      email: "nourhan.tarek@student.guc.edu.eg",
      phone: "+20 102 345 6789",
      studentId: "STU012",
      startDate: "2024-04-02",
      endDate: "2024-07-02",
      status: "current intern",
      gpa: "3.6",
      year: "3",
      major: "Architecture",
      performance: "Excellent",
      jobTitle: "Urban Planning Intern",
      lastEmailSent: "Acceptance",
      emailType: "acceptance"
    },
    {
      id: 14,
      name: "Dina Magdy",
      email: "dina.magdy@student.guc.edu.eg",
      phone: "+20 104 567 8901",
      studentId: "STU014",
      startDate: "2024-04-04",
      endDate: "2024-07-04",
      status: "current intern",
      gpa: "3.9",
      year: "5",
      major: "Pharmacy",
      performance: "Good",
      jobTitle: "Pharmaceutical Research Intern",
      lastEmailSent: "Acceptance",
      emailType: "acceptance"
    }
  ];

  const [interns, setInterns] = useState(() => {
    const storedInterns = getLocal(internsKey, null);
    if (!storedInterns) {
      setLocal(internsKey, initialInterns);
      return initialInterns;
    }
    return storedInterns;
  });

  useEffect(() => {
    setLocal(internsKey, interns);
  }, [interns, internsKey]);

  // Simulate sending an email (replace with real API call in production)
  const sendEmail = (to, subject, body) => {
    // For demo, just log to console
    console.log(`Email sent to ${to}: ${subject}\n${body}`);
  };

  const handlePerformanceChange = (internId, newPerformance) => {
    setInterns(prev => prev.map(intern => {
      if (intern.id === internId) {
        const emailSubject = 'Internship Performance Update';
        const emailBody = `Dear ${intern.name},\n\nYour performance for the ${intern.jobTitle} position has been updated to: ${newPerformance}.\n\nBest regards,\nGUC Internship System`;
        
        sendEmail(intern.email, emailSubject, emailBody);
        
        return {
          ...intern,
          performance: newPerformance,
          lastEmailSent: 'Performance Update',
          emailType: 'performance_update'
        };
      }
      return intern;
    }));
  };

  const handleStatusChange = (internId, newStatus) => {
    setInterns(prev => prev.map(intern => {
      if (intern.id === internId) {
        let emailSubject = 'Internship Status Update';
        let emailBody = `Dear ${intern.name},\n\nYour status for the ${intern.jobTitle} position has been updated to: ${newStatus}.\n\nBest regards,\nGUC Internship System`;

        if (newStatus === 'internship complete') {
          emailSubject = 'Internship Completion';
          emailBody = `Dear ${intern.name},\n\nCongratulations on completing your ${intern.jobTitle} internship! We appreciate your hard work and dedication.\n\nBest regards,\nGUC Internship System`;
        } else if (newStatus === 'terminated') {
          emailSubject = 'Internship Termination';
          emailBody = `Dear ${intern.name},\n\nWe regret to inform you that your ${intern.jobTitle} internship has been terminated.\n\nBest regards,\nGUC Internship System`;
        }

        sendEmail(intern.email, emailSubject, emailBody);
        
        return {
          ...intern,
          status: newStatus,
          lastEmailSent: emailSubject.split(' ').pop(),
          emailType: newStatus === 'internship complete' ? 'completion' : 
                    newStatus === 'terminated' ? 'termination' : 'status_update'
        };
      }
      return intern;
    }));
  };

  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [pendingPerformance, setPendingPerformance] = useState('');
  const [pendingStatus, setPendingStatus] = useState('');
  const [performance, setPerformance] = useState('');
  const [status, setStatus] = useState('');

  const applyFilters = () => {
    setPerformance(pendingPerformance);
    setStatus(pendingStatus);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setPendingPerformance('');
    setPendingStatus('');
    setPerformance('');
    setStatus('');
    setShowFilter(false);
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(search.toLowerCase()) ||
                         intern.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesPerformance = performance ? intern.performance === performance : true;
    const matchesStatus = status ? intern.status === status : true;
    return matchesSearch && matchesPerformance && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#234B73]">Interns Information</h1>
          <Link
            to="/internships"
            className="px-4 py-2 text-[#234B73] border border-[#234B73] rounded-md hover:bg-[#234B73] hover:text-white transition duration-150"
          >
            Back to Internships
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name or job title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234B73] w-full md:w-1/3"
          />
          <button
            onClick={() => setShowFilter(true)}
            className="px-4 py-2 bg-[#F08F36] text-white rounded-lg font-semibold hover:bg-[#e07e25] transition duration-150 w-full md:w-auto"
          >
            Filter
          </button>
        </div>

        {showFilter && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowFilter(false)} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 z-50 min-w-[340px] max-w-[90vw] shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#234B73]">Filter Interns</h2>
                <button onClick={() => setShowFilter(false)} className="text-2xl text-[#F08F36] font-bold hover:text-[#e07e25]">×</button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[#234B73] font-medium mb-2">Performance</label>
                  <select
                    value={pendingPerformance}
                    onChange={e => setPendingPerformance(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#234B73] focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-2">Status</label>
                  <select
                    value={pendingStatus}
                    onChange={e => setPendingStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#234B73] focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="current intern">Current Intern</option>
                    <option value="internship complete">Internship Complete</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition duration-150"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-6 py-2 bg-[#F08F36] text-white rounded-lg font-semibold hover:bg-[#e07e25] transition duration-150"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Email Sent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{intern.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{intern.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{intern.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{intern.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(intern.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${intern.status === 'current intern' ? 'bg-green-100 text-green-800' : 
                          intern.status === 'internship complete' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}>{intern.status}</span>
                      <select
                        value={intern.status}
                        onChange={e => handleStatusChange(intern.id, e.target.value)}
                        className="ml-2 px-2 py-1 border rounded text-xs"
                      >
                        <option value="current intern">current intern</option>
                        <option value="internship complete">internship complete</option>
                        <option value="terminated">terminated</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${intern.performance === 'Excellent' ? 'bg-green-100 text-green-800' : 
                          intern.performance === 'Good' ? 'bg-blue-100 text-blue-800' : 
                          intern.performance === 'Average' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>{intern.performance}</span>
                      <select
                        value={intern.performance}
                        onChange={e => handlePerformanceChange(intern.id, e.target.value)}
                        className="ml-2 px-2 py-1 border rounded text-xs"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-700">{intern.lastEmailSent}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${intern.emailType === 'acceptance' ? 'bg-green-100 text-green-800' : 
                          intern.emailType === 'completion' ? 'bg-blue-100 text-blue-800' : 
                          intern.emailType === 'termination' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {intern.emailType === 'acceptance' ? 'Acceptance' :
                         intern.emailType === 'completion' ? 'Completion' :
                         intern.emailType === 'termination' ? 'Termination' :
                         intern.emailType === 'performance_update' ? 'Performance Update' :
                         'Status Update'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/student-profile/${intern.studentId}`}
                        className="text-[#234B73] hover:text-[#1a3a5a]"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternsInfo; 