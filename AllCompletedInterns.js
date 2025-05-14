import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const mapStatus = (status, endDate, isTerminated) => {
  const now = new Date();
  if (isTerminated) return 'rejected';
  if (endDate < now) return 'internship complete';
  if (!status) return 'current intern';
  const s = status.toLowerCase();
  if (s === 'pending' || s === 'shortlisted' || s === 'under review') return 'finalized';
  if (s === 'accepted' || s === 'current intern' || s === 'active') return 'current intern';
  if (s === 'rejected') return 'rejected';
  if (s === 'finalized') return 'finalized';
  return status;
};

const getInternshipTitle = (internshipId, internships) => {
  const found = internships.find(i => String(i.id) === String(internshipId));
  return found ? found.title : 'N/A';
};

const AllCompletedInterns = () => {
  const [completedInterns, setCompletedInterns] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Get internships from localStorage
    const storedInternships = JSON.parse(localStorage.getItem('internships')) || [
      { id: 1, title: 'Software Engineering Intern' },
      { id: 2, title: 'Marketing Intern' },
      { id: 3, title: 'Data Analyst Intern' },
    ];
    setInternships(storedInternships);

    // Aggregate all completed interns from localStorage
    let allInterns = [];
    let foundAny = false;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('interns_')) {
        try {
          const interns = JSON.parse(localStorage.getItem(key));
          const internshipId = key.replace('interns_', '');
          const internshipTitle = getInternshipTitle(internshipId, storedInternships);
          if (Array.isArray(interns)) {
            interns.forEach(intern => {
              const endDate = new Date(intern.endDate);
              const isTerminated = intern.status === 'terminated';
              const displayStatus = mapStatus(intern.status, endDate, isTerminated);
              if (displayStatus === 'internship complete') {
                allInterns.push({ ...intern, internshipId, internshipTitle });
                foundAny = true;
              }
            });
          }
        } catch {}
      }
    });
    // If no completed interns in localStorage, add mock data
    if (!foundAny) {
      allInterns = [
        {
          id: 101,
          name: 'Mina Gerges',
          email: 'mina.gerges@student.guc.edu.eg',
          phone: '+20 101 234 5678',
          studentId: 'STU011',
          startDate: '2024-02-01',
          endDate: '2024-05-01',
          status: 'internship complete',
          gpa: '3.8',
          year: '4',
          major: 'Electrical Engineering',
          performance: 'Excellent',
          internshipId: 1,
          internshipTitle: 'Software Engineering Intern',
        },
        {
          id: 102,
          name: 'Nourhan Tarek',
          email: 'nourhan.tarek@student.guc.edu.eg',
          phone: '+20 102 345 6789',
          studentId: 'STU012',
          startDate: '2024-01-15',
          endDate: '2024-04-15',
          status: 'internship complete',
          gpa: '3.6',
          year: '3',
          major: 'Architecture',
          performance: 'Good',
          internshipId: 2,
          internshipTitle: 'Marketing Intern',
        },
        {
          id: 103,
          name: 'Karim Fathy',
          email: 'karim.fathy@student.guc.edu.eg',
          phone: '+20 103 456 7890',
          studentId: 'STU013',
          startDate: '2024-03-01',
          endDate: '2024-06-01',
          status: 'internship complete',
          gpa: '3.2',
          year: '2',
          major: 'Business Administration',
          performance: 'Average',
          internshipId: 3,
          internshipTitle: 'Data Analyst Intern',
        },
      ];
    }
    setCompletedInterns(allInterns);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#234B73]">All Completed Interns</h1>
          <Link
            to="/internships"
            className="px-4 py-2 text-[#234B73] border border-[#234B73] rounded-md hover:bg-[#234B73] hover:text-white transition duration-150"
          >
            Back to Internships
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluation</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedInterns.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-gray-400 py-8">No completed interns found.</td></tr>
                ) : (
                  completedInterns.map((intern) => {
                    const endDate = new Date(intern.endDate);
                    const isTerminated = intern.status === 'terminated';
                    const displayStatus = mapStatus(intern.status, endDate, isTerminated);
                    return (
                      <tr key={intern.id + '-' + intern.internshipId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{intern.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{intern.internshipTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{intern.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{intern.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(intern.startDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(intern.endDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            bg-purple-100 text-purple-800`}>{displayStatus}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{intern.performance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/student-profile/${intern.studentId}`}
                            className="text-[#234B73] hover:text-[#1a3a5a] mr-4"
                          >
                            View Profile
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/company-evaluation/${intern.studentId}`}
                            className="text-[#F08F36] hover:text-[#e07e25] underline"
                          >
                            Evaluate
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCompletedInterns; 