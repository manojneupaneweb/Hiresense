import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  X,
  Trash2,
  Loader,
  AlertCircle
} from "lucide-react";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("accessToken")

  const [newJob, setNewJob] = useState({
    title: "",
    jobType: "Full-time",
    location: "",
    description: "",
    requirements: "",
    responsibilities: [""],
    skills: [""],
  });
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
  ];

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/job/getmyJobs', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        setJobs(response.data.jobs || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle job creation
  const handleAddJob = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const jobData = {
        ...newJob,
        responsibilities: newJob.responsibilities.filter((r) => r.trim() !== ""),
        skills: newJob.skills.filter((s) => s.trim() !== ""),
      };

      const response = await axios.post(
        'api/job/createJobpost',
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Add the new job to the local state
      setJobs([...jobs, response.data.job]);

      // Close modal and reset form
      setIsAddModalOpen(false);
      setNewJob({
        title: "",
        jobType: "Full-time",
        location: "",
        description: "",
        requirements: "",
        responsibilities: [""],
        skills: [""],
      });
      setNewResponsibility("");
      setNewSkill("");
    } catch (err) {
      console.error("Error creating job:", err);
      setError("Failed to create job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setNewJob({
        ...newJob,
        responsibilities: [...newJob.responsibilities, newResponsibility],
      });
      setNewResponsibility("");
    }
  };

  const removeResponsibility = (index) => {
    const updatedResponsibilities = [...newJob.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setNewJob({
      ...newJob,
      responsibilities: updatedResponsibilities,
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setNewJob({
        ...newJob,
        skills: [...newJob.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...newJob.skills];
    updatedSkills.splice(index, 1);
    setNewJob({
      ...newJob,
      skills: updatedSkills,
    });
  };

  // Fixed filtering function with safe property access
  const filteredJobs = jobs.filter((job) => {
    // Safely handle potentially undefined properties
    const title = job.title || "";
    const jobType = job.jobType || "";
    const location = job.location || "";
    const status = job.status || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size={32} className="animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600">Create and manage your job postings</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          Add New Job
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-gray-500">No jobs found. Create your first job posting!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                  <th className="py-4 px-6 font-medium">Job Title</th>
                  <th className="py-4 px-6 font-medium">Job Type</th>
                  <th className="py-4 px-6 font-medium">Location</th>
                  <th className="py-4 px-6 font-medium">Posted Date</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Applicants</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredJobs.map((job) => (
                  <tr key={job._id || job.id} className="hover:bg-gray-50 group">
                    <td className="py-4 px-6">
                      <Link
                        to={`/organization/jobs/${job._id || job.id}`}
                        className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors"
                      >
                        {job.title || "Untitled Position"}
                      </Link>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {job.description || "No description available"}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{job.jobType || "Not specified"}</td>
                    <td className="py-4 px-6 text-gray-900">
                      <div className="flex items-center">
                        <MapPin size={14} className="text-gray-400 mr-1" />
                        {job.location || "Remote"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-1" />
                        {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "Unknown date"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {job.status === "Active" ? (
                          <CheckCircle size={16} className="text-green-500 mr-1" />
                        ) : (
                          <XCircle size={16} className="text-gray-500 mr-1" />
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {job.status || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Users size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{job.applicants || 0}</span>
                      </div>
                    </td>
                    <a
                      href={`/organization/jobs/${job._id}/applicants`}
                      target="_blank"
                      className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                      View Applicant
                    </a>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredJobs.map((job) => (
              <Link
                key={job._id || job.id}
                to={`/organization/jobs/${job._id || job.id}`}
                className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{job.title || "Untitled Position"}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    <span>{job.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "Unknown date"}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {job.jobType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center">
                      {job.status === "Active" ? (
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                      ) : (
                        <XCircle size={14} className="text-gray-500 mr-1" />
                      )}
                      <span
                        className={`text-xs font-medium ${job.status === "Active"
                          ? "text-green-800"
                          : "text-gray-800"
                          }`}
                      >
                        {job.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applicants</p>
                    <div className="flex items-center">
                      <Users size={14} className="text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {job.applicants || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm"
            onClick={() => !submitting && setIsAddModalOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative z-10 border border-gray-200 shadow-xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Job</h2>
              <button
                onClick={() => !submitting && setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={submitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) =>
                      setNewJob({ ...newJob, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Senior Frontend Developer"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJob.jobType}
                    onChange={(e) =>
                      setNewJob({ ...newJob, jobType: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    disabled={submitting}
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) =>
                    setNewJob({ ...newJob, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. San Francisco, CA or Remote"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Describe the role, responsibilities, etc."
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  value={newJob.requirements}
                  onChange={(e) =>
                    setNewJob({ ...newJob, requirements: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="List the required skills and experience"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities
                </label>
                <div className="space-y-2">
                  {newJob.responsibilities.map(
                    (responsibility, index) =>
                      responsibility && (
                        <div key={index} className="flex items-center">
                          <span className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-gray-50">
                            {responsibility}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeResponsibility(index)}
                            className="ml-2 p-2 text-red-500 hover:text-red-700"
                            disabled={submitting}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder="Add a responsibility"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={addResponsibility}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                      disabled={submitting}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills Required
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newJob.skills.map(
                    (skill, index) =>
                      skill && (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                            disabled={submitting}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      )
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Add a skill"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddJob}
                disabled={submitting}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader size={18} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Create Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;