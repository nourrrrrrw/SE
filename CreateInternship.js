import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const CreateInternship = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const editingInternship = location.state?.internship;

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    duration: '',
    isPaid: false,
    salary: '',
    skills: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    applicationLink: '',
    status: 'open', // 'open', 'in-progress', 'completed'
    applicants: [],
    currentInterns: []
  });

  useEffect(() => {
    if (editingInternship) {
      setFormData({ ...formData, ...editingInternship });
    }
    // eslint-disable-next-line
  }, [editingInternship]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const applicationDeadline = new Date(formData.applicationDeadline);

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    // Duration validation
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (formData.duration < 1 || formData.duration > 12) {
      newErrors.duration = 'Duration must be between 1 and 12 months';
    }

    // Salary validation for paid internships
    if (formData.isPaid) {
      if (!formData.salary) {
        newErrors.salary = 'Salary is required for paid internships';
      } else if (formData.salary < 0) {
        newErrors.salary = 'Salary cannot be negative';
      }
    }

    // Skills validation
    if (!formData.skills.trim()) {
      newErrors.skills = 'Required skills are required';
    } else if (formData.skills.split(',').length < 2) {
      newErrors.skills = 'Please list at least 2 required skills';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    // Requirements validation
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    // Responsibilities validation
    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = 'Responsibilities are required';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Start Date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    // End Date validation
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Application Deadline validation
    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Application deadline is required';
    } else if (applicationDeadline >= startDate) {
      newErrors.applicationDeadline = 'Application deadline must be before start date';
    } else if (applicationDeadline < today) {
      newErrors.applicationDeadline = 'Application deadline cannot be in the past';
    }

    // Application Link validation
    if (!formData.applicationLink.trim()) {
      newErrors.applicationLink = 'Application link is required';
    } else {
      try {
        new URL(formData.applicationLink);
      } catch {
        newErrors.applicationLink = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Here you would typically make an API call to save the internship
      console.log('Submitting internship:', formData);
      
      // For now, we'll just navigate back to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating internship:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-[#234B73] mb-6">Create New Internship Position</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="e.g., Software Engineering Intern"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.department ? 'border-red-500' : ''}`}
                    placeholder="e.g., Engineering"
                  />
                  {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.location ? 'border-red-500' : ''}`}
                    placeholder="e.g., Cairo, Egypt"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Application Link *</label>
                  <input
                    type="url"
                    name="applicationLink"
                    value={formData.applicationLink}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.applicationLink ? 'border-red-500' : ''}`}
                    placeholder="e.g., https://company.com/apply"
                  />
                  {errors.applicationLink && <p className="mt-1 text-sm text-red-600">{errors.applicationLink}</p>}
                </div>
              </div>

              {/* Duration and Compensation */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Duration and Compensation</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (in months) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.duration ? 'border-red-500' : ''}`}
                    min="1"
                    max="12"
                  />
                  {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPaid"
                    checked={formData.isPaid}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#234B73] focus:ring-[#234B73] border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">This is a paid internship</label>
                </div>

                {formData.isPaid && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Salary (EGP) *</label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.salary ? 'border-red-500' : ''}`}
                      min="0"
                    />
                    {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Important Dates</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.startDate ? 'border-red-500' : ''}`}
                    />
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.endDate ? 'border-red-500' : ''}`}
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Deadline *</label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.applicationDeadline ? 'border-red-500' : ''}`}
                    />
                    {errors.applicationDeadline && <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>}
                  </div>
                </div>
              </div>

              {/* Requirements and Description */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#234B73]">Requirements and Description</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Required Skills *</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="3"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.skills ? 'border-red-500' : ''}`}
                    placeholder="List the required skills (e.g., Python, React, Communication)"
                  />
                  {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe the internship position and what the intern will be doing"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Requirements *</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="3"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.requirements ? 'border-red-500' : ''}`}
                    placeholder="List any additional requirements (e.g., GPA, year of study)"
                  />
                  {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsibilities *</label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows="3"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#234B73] focus:ring-[#234B73] ${errors.responsibilities ? 'border-red-500' : ''}`}
                    placeholder="List the main responsibilities of the intern"
                  />
                  {errors.responsibilities && <p className="mt-1 text-sm text-red-600">{errors.responsibilities}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#234B73]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#234B73] hover:bg-[#1a3a5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#234B73]"
                >
                  Create Internship
                </button>
              </div>
            </form>

            {/* Placeholder for update/delete/read actions for internships */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[#234B73] mb-2">Manage Internships (Coming Soon)</h2>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" disabled>Update</button>
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" disabled>Delete</button>
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" disabled>Read</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInternship; 