import React from "react";
import { useState } from "react";

function Jobs() {
  const jobTypes = [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];

  // Job categories for filter (like Upwork)
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

  // Dummy job data
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      category: "Frontend",
      posted: "2 days ago",
      applicants: 24,
      skills: ["React", "JavaScript", "CSS", "HTML5"],
      description:
        "We're looking for a talented Frontend Developer to join our team. You'll be responsible for building user interfaces and implementing designs.",
      salary: "$90,000 - $120,000",
      remote: true,
      logo: "https://via.placeholder.com/60/3B82F6/FFFFFF?text=TC",
    },
    {
      id: 2,
      title: "UX Designer",
      company: "DesignHub",
      location: "New York, NY",
      type: "Part-time",
      category: "UX/UI",
      posted: "1 week ago",
      applicants: 42,
      skills: ["Figma", "UI/UX", "User Research", "Wireframing"],
      description:
        "Join our design team to create beautiful and functional user experiences for our products.",
      salary: "$85,000 - $110,000",
      remote: true,
      logo: "https://via.placeholder.com/60/EF4444/FFFFFF?text=DH",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSystems",
      location: "Austin, TX",
      type: "Full-time",
      category: "Backend",
      posted: "3 days ago",
      applicants: 18,
      skills: ["Node.js", "Python", "SQL", "AWS"],
      description:
        "We need a backend engineer to develop and maintain our server infrastructure and APIs.",
      salary: "$100,000 - $130,000",
      remote: false,
      logo: "https://via.placeholder.com/60/10B981/FFFFFF?text=DS",
    },
    {
      id: 4,
      title: "iOS Developer",
      company: "AppWorks",
      location: "Remote",
      type: "Contract",
      category: "Mobile",
      posted: "Just now",
      applicants: 8,
      skills: ["Swift", "iOS", "Xcode", "Objective-C"],
      description:
        "Looking for an experienced iOS developer to build new features for our popular productivity app.",
      salary: "$70 - $90 per hour",
      remote: true,
      logo: "https://via.placeholder.com/60/8B5CF6/FFFFFF?text=AW",
    },
    {
      id: 5,
      title: "DevOps Specialist",
      company: "CloudNova",
      location: "Seattle, WA",
      type: "Full-time",
      category: "DevOps",
      posted: "5 days ago",
      applicants: 12,
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      description:
        "Join our infrastructure team to build and maintain our cloud deployment systems.",
      salary: "$110,000 - $140,000",
      remote: true,
      logo: "https://via.placeholder.com/60/F59E0B/FFFFFF?text=CN",
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "AnalyticsPro",
      location: "Boston, MA",
      type: "Freelance",
      category: "Data Science",
      posted: "2 days ago",
      applicants: 31,
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      description:
        "Work with our data team to extract insights and build predictive models.",
      salary: "$80 - $110 per hour",
      remote: true,
      logo: "https://via.placeholder.com/60/EC4899/FFFFFF?text=AP",
    },
    {
      id: 7,
      title: "Full-stack Developer",
      company: "WebSolutions",
      location: "Miami, FL",
      type: "Full-time",
      category: "Full-stack",
      posted: "1 day ago",
      applicants: 22,
      skills: ["React", "Node.js", "MongoDB", "Express"],
      description:
        "We're seeking a full-stack developer to help build our next generation web applications.",
      salary: "$95,000 - $125,000",
      remote: false,
      logo: "https://via.placeholder.com/60/06B6D4/FFFFFF?text=WS",
    },
    {
      id: 8,
      title: "Android Developer",
      company: "MobileFirst",
      location: "Remote",
      type: "Contract",
      category: "Mobile",
      posted: "3 days ago",
      applicants: 15,
      skills: ["Kotlin", "Java", "Android Studio", "Firebase"],
      description:
        "Looking for an Android developer to create new features for our fitness application.",
      salary: "$75 - $95 per hour",
      remote: true,
      logo: "https://via.placeholder.com/60/84CC16/FFFFFF?text=MF",
    },
  ]);

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

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    // Filter by job type
    if (filters.jobType !== "All" && job.type !== filters.jobType) {
      return false;
    }

    // Filter by category
    if (filters.category !== "All" && job.category !== filters.category) {
      return false;
    }

    // Filter by remote only
    if (filters.remoteOnly && !job.remote) {
      return false;
    }

    // Filter by search term
    if (
      filters.search &&
      !job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !job.company.toLowerCase().includes(filters.search.toLowerCase()) &&
      !job.skills.some((skill) =>
        skill.toLowerCase().includes(filters.search.toLowerCase())
      )
    ) {
      return false;
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

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    setApplications({
      ...applications,
      [selectedJob.id]: {
        job: selectedJob.title,
        company: selectedJob.company,
        status: "Pending",
        appliedDate: new Date().toLocaleDateString(),
      },
    });
    setShowApplicationModal(false);
    setApplicationForm({ name: "", email: "", coverLetter: "" });

    // Show success notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleInputChange = (e) => {
    setApplicationForm({
      ...applicationForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Notification state
  const [showNotification, setShowNotification] = useState(false);

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

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                {jobCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Job title, company, or skills"
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
              key={job.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <img
                    className="h-12 w-12 rounded-md mr-4 object-contain"
                    src={job.logo}
                    alt={`${job.company} logo`}
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {job.title}
                    </h2>
                    <p className="text-gray-700">
                      {job.company} • {job.location}{" "}
                      {job.remote && (
                        <span className="text-green-600 text-sm">• Remote</span>
                      )}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {job.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">{job.description}</p>
                  <p className="mt-2 text-gray-900 font-medium">{job.salary}</p>
                </div>

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

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {job.posted} • {job.applicants} applicants
                  </div>
                  <button
                    onClick={() => handleApplyClick(job)}
                    disabled={applications[job.id]}
                    className={`px-5 py-2 rounded-md font-medium ${
                      applications[job.id]
                        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {applications[job.id] ? "Applied" : "Apply Now"}
                  </button>
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
                className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
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
                    className={`min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-300 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none ${
                  currentPage === totalPages
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

        {/* No Results Message */}
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

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Apply for {selectedJob.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedJob.company} • {selectedJob.location}
              </p>

              <form onSubmit={handleApplicationSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={applicationForm.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={applicationForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="coverLetter"
                  >
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={applicationForm.coverLetter}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Why are you interested in this position?"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
            Application submitted successfully!
          </div>
        )}

        {/* Applications Section */}
        {Object.keys(applications).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Applications
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {Object.entries(applications).map(([jobId, application]) => (
                  <li key={jobId} className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.job}
                        </h3>
                        <p className="text-gray-600">{application.company}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            application.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {application.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied on {application.appliedDate}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
