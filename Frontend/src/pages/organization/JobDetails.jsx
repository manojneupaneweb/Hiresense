import React, { useState, useEffect } from 'react';
import { Link, redirect, useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader, AlertCircle, MapPin, Calendar, Users, Clock, Building, DollarSign, BookOpen } from 'lucide-react';
import VerifyUser from '../../../utils/verifyuser';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const navigate = useNavigate();
 
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        const response = await axios.get(`/api/job/jobdetails/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setJob(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size={32} className="animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading job details...</span>
      </div>
    );
  }
  const handleApplyButton = async (job) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("Token not found");
        toast.error('Please login first');
        return;
      }

      const response = await axios.get('/api/user/verifyuser', {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const userRole = response.data.user.role;
      if (userRole === 'recruiter') {
        toast.error(`As a ${userRole} you cannot apply for the job`);
        return;
      }

      navigate(`/jobs/${job._id}/apply`);
    } catch (error) {
      console.error("Error verifying user: ", error.response?.data?.message || error.message);
    }
  };




  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl mb-6">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <Building size={16} className="mr-1" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1" />
                <span>Competitive Salary</span>
              </div>
            </div>
          </div>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            onClick={() => handleApplyButton(job)} // wrap in arrow function
          >
            Apply Now
          </button>



        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Posted Date */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center mb-3">
            <Calendar size={20} className="text-blue-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Posted Date</h3>
          </div>
          <p className="text-gray-600">
            {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Not specified'}
          </p>
        </div>

        {/* Applicants */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center mb-3">
            <Users size={20} className="text-green-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Applicants</h3>
          </div>
          <p className="text-gray-600">{job.applicants || 0} applicants</p>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center mb-3">
            <Clock size={20} className="text-purple-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Status</h3>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${job.status === 'Active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
            }`}>
            {job.status || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <BookOpen size={20} className="text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* Requirements Section */}
      {job.requirements && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
          </div>
        </div>
      )}

      {/* Responsibilities Section */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
          <ul className="space-y-2">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills Section */}
      {job.skills && job.skills.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;