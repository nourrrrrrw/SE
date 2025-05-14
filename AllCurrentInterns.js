import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Helper to map legacy statuses to new ones
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

const AllCurrentInterns = () => {
  const [currentInterns, setCurrentInterns] = useState([]);
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Get internships from localStorage
    const storedInternships = JSON.parse(localStorage.getItem('internships')) || [];
    setInternships(storedInternships);

    // Aggregate all interns from localStorage
    const allInterns = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('interns_')) {
        try {
          const interns = JSON.parse(localStorage.getItem(key));
          const internshipId = key.replace('interns_', '');
          const internshipTitle = getInternshipTitle(internshipId, storedInternships);
          if (Array.isArray(interns)) {
            interns.forEach(intern => {
              if (
                (intern.status === 'Active' || intern.status === 'current intern' || intern.status === 'accepted' || intern.status === 'finalized' || intern.status === 'pending' || intern.status === 'shortlisted' || intern.status === 'under review') &&
                intern.status !== 'terminated'
              ) {
                allInterns.push({ ...intern, internshipId, internshipTitle });
              }
            });
          }
        } catch {}
      }
    });
    setCurrentInterns(allInterns);
  }, []);

  const applyFilters = () => {
    setStatus(pendingStatus);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setPendingStatus('');
    setStatus('');
    setShowFilter(false);
  };

  const filteredInterns = currentInterns.filter(intern => {
    const matchesSearch =
      intern.name.toLowerCase().includes(search.toLowerCase()) ||
      (intern.internshipTitle && intern.internshipTitle.toLowerCase().includes(search.toLowerCase()));
    const displayStatus = mapStatus(intern.status, new Date(intern.endDate), intern.status === 'terminated');
    const matchesStatus = status ? displayStatus === status : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#234B73]">All Current Interns</h1>
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
            placeholder="Search by name or internship title..."
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
                  <label className="block text-[#234B73] font-medium mb-2">Status</label>
                  <select
                    value={pendingStatus}
                    onChange={e => setPendingStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#234B73] focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="current intern">Current Intern</option>
                    <option value="internship complete">Internship Complete</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterns.length === 0 ? (
                  <tr><td colSpan={9} className="text-center text-gray-400 py-8">No current interns found.</td></tr>
                ) : (
                  filteredInterns.map((intern) => {
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
                            ${displayStatus === 'current intern' ? 'bg-green-100 text-green-800' :
                              displayStatus === 'internship complete' ? 'bg-purple-100 text-purple-800' :
                              displayStatus === 'finalized' ? 'bg-yellow-100 text-yellow-800' :
                              displayStatus === 'accepted' ? 'bg-blue-100 text-blue-800' :
                              displayStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>{displayStatus}</span>
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

export default AllCurrentInterns; 