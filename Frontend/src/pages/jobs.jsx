import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Jobs() {
  const jobTypes = [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Remote"
  ];

  const jobCategories = [
    "All",
    "Frontend",
    "Backend",
    "Full-stack",
    "Mobile",
    "DevOps",
    "Data Science",
    "UX/UI",
  ];

  // State for real job data from API
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    jobType: "All",
    category: "All",
    remoteOnly: false,
    search: "",
  });

  // State for applications
  const [applications, setApplications] = useState({});
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    coverLetter: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        const response = await axios.get('/api/job/getalljobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setJobs(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    // Safely handle potentially undefined properties
    const title = job.title || "";
    const jobType = job.jobType || "";
    const location = job.location || "";
    const description = job.description || "";
    const skills = job.skills || [];

    // Filter by job type
    if (filters.jobType !== "All" && jobType !== filters.jobType) {
      return false;
    }

    // Filter by remote only - assuming location "Remote" indicates remote work
    if (filters.remoteOnly && !location.toLowerCase().includes("remote")) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (
        !title.toLowerCase().includes(searchTerm) &&
        !description.toLowerCase().includes(searchTerm) &&
        !skills.some(skill =>
          skill && skill.toLowerCase().includes(searchTerm)
        )
      ) {
        return false;
      }
    }

    return true;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Notification state
  const [showNotification, setShowNotification] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size={32} className="animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl mb-6">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Job Opportunities
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Find your next career move from our curated listings
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Jobs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={filters.jobType}
                onChange={(e) => handleFilterChange("jobType", e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Remote Filter */}
            <div className="flex items-end">
              <div className="flex items-center">
                <input
                  id="remote-only"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={filters.remoteOnly}
                  onChange={(e) =>
                    handleFilterChange("remoteOnly", e.target.checked)
                  }
                />
                <label
                  htmlFor="remote-only"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remote Only
                </label>
              </div>
            </div>

            {/* Search Filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Job title, description, or skills"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""}{" "}
            Available
          </h2>
          <span className="text-sm text-gray-500">
            Showing {Math.min(filteredJobs.length, jobsPerPage)} of{" "}
            {filteredJobs.length} jobs
          </span>
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-md mr-4 bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {job.title?.charAt(0) || "J"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {job.title || "Untitled Position"}
                    </h2>
                    <p className="text-gray-700">
                      {job.location || "Location not specified"}{" "}
                      {job.location?.toLowerCase().includes("remote") && (
                        <span className="text-green-600 text-sm">• Remote</span>
                      )}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.jobType || "Full-time"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 line-clamp-3">
                    {job.description || "No description available"}
                  </p>
                  {job.salary && (
                    <p className="mt-2 text-gray-900 font-medium">{job.salary}</p>
                  )}
                </div>
``
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "Recent"} • {job.applicants || 0} applicants
                  </div>
                  <Link to={`/jobs/${job._id}`}>View Details</Link>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredJobs.length > jobsPerPage && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
              >
                <svg
                  className="flex-shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-300 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 ${currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ${currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
                  }`}
              >
                <span>Next</span>
                <svg
                  className="flex-shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </nav>
          </div>
        )}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;