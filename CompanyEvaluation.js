import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../App';

const initialData = {
  internName: 'Mina Gerges',
  companyName: 'GUC Tech Solutions',
  internshipRole: 'Software Engineering Intern',
  evaluationPeriodStart: '2024-02-01',
  evaluationPeriodEnd: '2024-05-01',
  evaluatorName: 'Eng. Sarah Mostafa',
  evaluatorTitle: 'Senior Software Engineer',
  dateOfEvaluation: new Date().toISOString().slice(0, 10),
  metrics: {
    technical: { rating: 4, comment: 'Strong coding skills, quick learner.' },
    communication: { rating: 5, comment: 'Excellent communicator, clear reports.' },
    workEthic: { rating: 5, comment: 'Always on time, very responsible.' },
    teamwork: { rating: 4, comment: 'Works well with others, open to feedback.' },
    adaptability: { rating: 4, comment: 'Learns new tools quickly, adapts well.' },
    projectImpact: { rating: 5, comment: 'Delivered a key project, innovative solutions.' },
  },
  overallRating: 4.5,
  recommendation: 'Yes',
  strengths: 'Technical proficiency, communication, reliability.',
  improvement: 'Could take more initiative in proposing new ideas.',
  additionalComments: 'Mina was a pleasure to work with. She also provided a thoughtful self-assessment.',
  signature: '',
  submissionMethod: 'GUC portal',
  companyId: 'GUC_TECH_001',
};

const metricLabels = [
  { key: 'technical', label: 'Technical Skills', example: 'Quality of work, problem-solving, tool proficiency.' },
  { key: 'communication', label: 'Communication Skills', example: 'Clarity, collaboration, written reports.' },
  { key: 'workEthic', label: 'Work Ethic and Responsibility', example: 'Meeting deadlines, initiative, attendance.' },
  { key: 'teamwork', label: 'Teamwork and Interpersonal Skills', example: 'Cooperation, handling feedback, attitude.' },
  { key: 'adaptability', label: 'Adaptability and Learning Ability', example: 'Learning new skills, handling challenges, growth.' },
  { key: 'projectImpact', label: 'Project Impact', example: 'Project completion, value added, innovation.' },
];

const CompanyEvaluation = () => {
  const { studentId } = useParams();
  const { userType, companyId } = useAuth();
  const [form, setForm] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Load evaluation if exists
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setForm(JSON.parse(saved));
      setSubmitted(true);
      setEditing(false);
    }
  }, [studentId]);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMetricChange = (key, field, value) => {
    setForm(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [key]: {
          ...prev.metrics[key],
          [field]: value
        }
      }
    }));
  };

  // Calculate average score
  const averageScore = (
    Object.values(form.metrics).reduce((sum, m) => sum + Number(m.rating), 0) / metricLabels.length
  ).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission without localStorage
    console.log('Form submitted:', form);
    // You can add your submission logic here
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = () => {
    localStorage.removeItem(storageKey);
    setForm(initialData);
    setSubmitted(false);
    setEditing(false);
  };

  // Access control logic
  if (userType !== 'scad' && userType !== 'company') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="mb-6 text-gray-700">You do not have permission to view this evaluation. Only SCAD and company users can access this page.</p>
          <Link to="/dashboard" className="px-4 py-2 bg-[#234B73] text-white rounded hover:bg-[#1a3a5a]">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Check if company user is authorized to edit
  const canEdit = userType === 'company' && form.companyId === companyId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#234B73]">Intern Evaluation Form</h1>
          <Link
            to="/completed-interns"
            className="px-4 py-2 text-[#234B73] border border-[#234B73] rounded-md hover:bg-[#234B73] hover:text-white transition duration-150"
          >
            Back to Completed Interns
          </Link>
        </div>
        {submitted && !editing ? (
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {canEdit && (
              <div className="flex justify-end gap-4 mb-4">
                <button onClick={handleEdit} className="px-4 py-2 bg-[#F08F36] text-white rounded hover:bg-[#e07e25]">Edit</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            )}
            <h2 className="text-xl font-semibold text-[#234B73] mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><b>Intern Name:</b> {form.internName}</div>
              <div><b>Company Name:</b> {form.companyName}</div>
              <div><b>Internship Role:</b> {form.internshipRole}</div>
              <div><b>Evaluation Period:</b> {form.evaluationPeriodStart} to {form.evaluationPeriodEnd}</div>
              <div><b>Evaluator Name:</b> {form.evaluatorName}</div>
              <div><b>Evaluator Title:</b> {form.evaluatorTitle}</div>
              <div><b>Date of Evaluation:</b> {form.dateOfEvaluation}</div>
            </div>
            <h2 className="text-xl font-semibold text-[#234B73] mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              {metricLabels.map(metric => (
                <div key={metric.key} className="bg-gray-50 rounded-lg p-4 border">
                  <div><b>{metric.label}:</b> {form.metrics[metric.key].rating} / 5</div>
                  <div className="text-gray-600 text-sm">{form.metrics[metric.key].comment}</div>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold text-[#234B73] mb-4">Overall Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><b>Overall Performance Rating:</b> {averageScore}</div>
              <div><b>Recommendation:</b> {form.recommendation}</div>
              <div><b>Strengths:</b> {form.strengths}</div>
              <div><b>Areas for Improvement:</b> {form.improvement}</div>
            </div>
            <h2 className="text-xl font-semibold text-[#234B73] mb-4">Additional Comments</h2>
            <div>{form.additionalComments}</div>
            <h2 className="text-xl font-semibold text-[#234B73] mb-4">Submission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><b>Signature:</b> {form.signature}</div>
              <div><b>Submission Method:</b> {form.submissionMethod}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {/* General Information */}
            <div>
              <h2 className="text-xl font-semibold text-[#234B73] mb-4">General Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Intern Name</label>
                  <input type="text" name="internName" value={form.internName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Company Name</label>
                  <input type="text" name="companyName" value={form.companyName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Internship Role</label>
                  <input type="text" name="internshipRole" value={form.internshipRole} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Evaluation Period</label>
                  <div className="flex gap-2">
                    <input type="date" name="evaluationPeriodStart" value={form.evaluationPeriodStart} onChange={handleChange} className="w-1/2 border rounded px-3 py-2" />
                    <span className="self-center">to</span>
                    <input type="date" name="evaluationPeriodEnd" value={form.evaluationPeriodEnd} onChange={handleChange} className="w-1/2 border rounded px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Evaluator Name</label>
                  <input type="text" name="evaluatorName" value={form.evaluatorName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Evaluator Title</label>
                  <input type="text" name="evaluatorTitle" value={form.evaluatorTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Date of Evaluation</label>
                  <input type="date" name="dateOfEvaluation" value={form.dateOfEvaluation} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h2 className="text-xl font-semibold text-[#234B73] mb-4">Performance Metrics</h2>
              <div className="space-y-6">
                {metricLabels.map(metric => (
                  <div key={metric.key} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
                      <label className="block text-[#234B73] font-medium mb-1 md:mb-0 md:w-1/3">{metric.label}</label>
                      <select
                        value={form.metrics[metric.key].rating}
                        onChange={e => handleMetricChange(metric.key, 'rating', e.target.value)}
                        className="w-24 border rounded px-2 py-1 mr-2"
                      >
                        {[1,2,3,4,5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <span className="text-xs text-gray-500">(1=Poor, 5=Excellent)</span>
                    </div>
                    <input
                      type="text"
                      value={form.metrics[metric.key].comment}
                      onChange={e => handleMetricChange(metric.key, 'comment', e.target.value)}
                      className="w-full border rounded px-3 py-2 mt-2"
                      placeholder={metric.example}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Assessment */}
            <div>
              <h2 className="text-xl font-semibold text-[#234B73] mb-4">Overall Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Overall Performance Rating (average score)</label>
                  <input type="number" value={averageScore} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Recommendation</label>
                  <select name="recommendation" value={form.recommendation} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Strengths</label>
                  <input type="text" name="strengths" value={form.strengths} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Technical proficiency, communication, reliability." />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Areas for Improvement</label>
                  <input type="text" name="improvement" value={form.improvement} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Could take more initiative in proposing new ideas." />
                </div>
              </div>
            </div>

            {/* Additional Comments */}
            <div>
              <h2 className="text-xl font-semibold text-[#234B73] mb-4">Additional Comments</h2>
              <textarea
                name="additionalComments"
                value={form.additionalComments}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows={4}
                placeholder="Narrative feedback and optional intern self-assessment."
              />
            </div>

            {/* Submission */}
            <div>
              <h2 className="text-xl font-semibold text-[#234B73] mb-4">Submission</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Signature</label>
                  <input type="text" name="signature" value={form.signature} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Evaluator's signature" />
                </div>
                <div>
                  <label className="block text-[#234B73] font-medium mb-1">Submission Method</label>
                  <input type="text" name="submissionMethod" value="GUC portal" readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button type="submit" className="px-6 py-2 bg-[#234B73] text-white rounded-lg font-semibold hover:bg-[#1a3a5a] transition duration-150">
                Submit Evaluation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanyEvaluation; 