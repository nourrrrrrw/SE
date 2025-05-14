import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Helper to map legacy statuses to new ones
const mapStatus = (status) => {
  if (!status) return 'finalized';
  const s = status.toLowerCase();
  if (s === 'pending' || s === 'shortlisted' || s === 'under review') return 'finalized';
  if (s === 'accepted' || s === 'current intern') return 'accepted';
  if (s === 'rejected') return 'rejected';
  if (s === 'finalized') return 'finalized';
  return status;
};

const getInternshipTitle = (internshipId, internships) => {
  const found = internships.find(i => String(i.id) === String(internshipId));
  return found ? found.title : 'N/A';
};

const AllApplicants = () => {
  // Helper to get and set localStorage
  const getLocal = (key, fallback) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  };

  // Get all internships
  const internships = getLocal('internships', []);

  // Get all applicants from all internships, attaching internshipId and title
  const getAllApplicants = () => {
    const allApplicants = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('applicants_')) {
        const internshipId = key.replace('applicants_', '');
        const applicants = getLocal(key, []);
        const internshipTitle = getInternshipTitle(internshipId, internships);
        applicants.forEach(applicant => {
          allApplicants.push({ ...applicant, internshipId, internshipTitle });
        });
      }
    }
    return allApplicants;
  };

  const [applicants, setApplicants] = useState(getAllApplicants());
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setApplicants(getAllApplicants());
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

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(search.toLowerCase()) ||
      (applicant.internshipTitle && applicant.internshipTitle.toLowerCase().includes(search.toLowerCase()));
    const displayStatus = mapStatus(applicant.status);
    const matchesStatus = status ? displayStatus === status : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#234B73]">All Applicants</h1>
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
                <h2 className="text-2xl font-bold text-[#234B73]">Filter Applicants</h2>
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
                    <option value="finalized">Finalized</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex gap-4">
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#234B73]">{applicant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#234B73]">{applicant.internshipTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#234B73]">{applicant.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#234B73]">{applicant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#234B73]">{applicant.applicationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      mapStatus(applicant.status) === 'accepted' ? 'bg-green-100 text-green-800' :
                      mapStatus(applicant.status) === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mapStatus(applicant.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#234B73]">
                    <Link
                      to={`/applicants/${applicant.internshipId}`}
                      className="text-[#F08F36] hover:text-[#e07e25]"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllApplicants; 