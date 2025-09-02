import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  ArrowLeft,
  Mail,
  Phone,
  Star,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  FileText,
  Video,
  Image,
  MessageSquare,
} from "lucide-react";

const ViewApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("appliedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sample data
  const sampleJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      jobType: "Full-time",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      title: "Product Manager",
      jobType: "Full-time",
      location: "New York, NY",
    },
    {
      id: 3,
      title: "UX Designer",
      jobType: "Contract",
      location: "Austin, TX",
    },
    {
      id: 4,
      title: "Data Scientist",
      jobType: "Remote",
      location: "Remote",
    },
  ];

  const sampleApplicants = [
    {
      id: 1,
      jobId: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      appliedDate: "2023-10-20",
      status: "Shortlisted",
      score: 92,
      experience: "5 years",
      currentPosition: "Frontend Developer at TechCorp",
      location: "San Francisco, CA",
      resume: "sarah_johnson_resume.pdf",
      skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
      notes:
        "Strong portfolio with impressive projects. Excellent communication skills during initial screening.",
      // Additional details for the view details modal
      interviewDetails: {
        totalQuestions: 12,
        completedQuestions: 12,
        averageResponseTime: "12 seconds",
        videoRecording: "available",
        screenshots: 8,
        aiFeedback:
          "Candidate demonstrated strong technical knowledge and communication skills. Showed confidence in React concepts and problem-solving abilities.",
        questions: [
          {
            question:
              "Can you explain the Virtual DOM in React and how it improves performance?",
            answer:
              "The Virtual DOM is a lightweight copy of the actual DOM. When changes are made to a React component, they're first made to the Virtual DOM. React then compares this with the actual DOM and only updates the specific parts that changed, which is much faster than updating the entire DOM.",
            score: 9,
            feedback:
              "Excellent explanation with clear understanding of performance benefits",
          },
          {
            question:
              "How would you handle state management in a large React application?",
            answer:
              "For large applications, I prefer using Redux or Context API with useReducer. Redux is great for complex state interactions across components, while Context API is suitable for simpler global state needs. I also consider using React Query for server state management.",
            score: 8,
            feedback: "Good understanding of state management options",
          },
          {
            question: "What are React hooks and why were they introduced?",
            answer:
              "React hooks were introduced in React 16.8 to allow using state and other React features in functional components. They provide a way to reuse stateful logic between components without changing component hierarchy. Common hooks include useState, useEffect, and useContext.",
            score: 10,
            feedback: "Perfect explanation of hooks and their purpose",
          },
        ],
        screenshots: [
          {
            id: 1,
            time: "00:45",
            description: "Candidate explaining React concepts",
          },
          {
            id: 2,
            time: "02:30",
            description: "Whiteboard session for problem-solving",
          },
          { id: 3, time: "05:15", description: "Code example discussion" },
        ],
      },
    },
    {
      id: 2,
      jobId: 1,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 987-6543",
      appliedDate: "2023-10-18",
      status: "Pending",
      score: 88,
      experience: "4 years",
      currentPosition: "UI Developer at DesignHub",
      location: "Oakland, CA",
      resume: "michael_chen_resume.pdf",
      skills: ["React", "Vue", "SASS", "UI/UX Design"],
      notes: "",
      interviewDetails: {
        totalQuestions: 12,
        completedQuestions: 10,
        averageResponseTime: "15 seconds",
        videoRecording: "available",
        screenshots: 6,
        aiFeedback:
          "Candidate showed good design sense but struggled with some advanced technical questions. Strong CSS skills evident.",
        questions: [
          {
            question: "What's the difference between CSS Grid and Flexbox?",
            answer:
              "Flexbox is designed for one-dimensional layouts - either a row or a column. Grid is designed for two-dimensional layouts - both rows and columns. I use Flexbox for components and Grid for overall page layout.",
            score: 9,
            feedback:
              "Clear and accurate distinction between the two layout systems",
          },
          {
            question: "How do you ensure your web applications are accessible?",
            answer:
              "I use semantic HTML, ensure proper contrast ratios, implement keyboard navigation, and test with screen readers. I also follow ARIA guidelines when needed.",
            score: 7,
            feedback: "Good awareness of accessibility principles",
          },
        ],
        screenshots: [
          { id: 1, time: "01:20", description: "Discussing CSS methodologies" },
          { id: 2, time: "03:45", description: "UI design portfolio review" },
        ],
      },
    },
    {
      id: 3,
      jobId: 1,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@example.com",
      phone: "+1 (555) 456-7890",
      appliedDate: "2023-10-22",
      status: "Rejected",
      score: 76,
      experience: "6 years",
      currentPosition: "Senior Developer at WebSolutions",
      location: "San Jose, CA",
      resume: "emma_rodriguez_resume.pdf",
      skills: ["Angular", "JavaScript", "CSS", "Node.js"],
      notes:
        "Lacking recent React experience. Strong backend skills but not the right fit for this role.",
      interviewDetails: {
        totalQuestions: 12,
        completedQuestions: 8,
        averageResponseTime: "18 seconds",
        videoRecording: "available",
        screenshots: 4,
        aiFeedback:
          "Candidate has strong backend knowledge but limited React experience. May be better suited for full-stack or backend roles.",
        questions: [
          {
            question: "What experience do you have with React?",
            answer:
              "I've worked with React in a few smaller projects, but most of my experience is with Angular. I understand the component-based architecture and have been learning React through online courses.",
            score: 6,
            feedback: "Limited practical React experience",
          },
        ],
        screenshots: [
          {
            id: 1,
            time: "00:30",
            description: "Technical concepts discussion",
          },
        ],
      },
    },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchData = () => {
      const foundJob = sampleJobs.find((job) => job.id === parseInt(id));
      const jobApplicants = sampleApplicants.filter(
        (app) => app.jobId === parseInt(id)
      );

      setJob(foundJob);
      setApplicants(jobApplicants);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleStatusChange = (applicantId, newStatus) => {
    setApplicants(
      applicants.map((applicant) =>
        applicant.id === applicantId
          ? { ...applicant, status: newStatus }
          : applicant
      )
    );
  };

  const openApplicantDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailsModal(true);
  };

  const sortedApplicants = [...applicants].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "appliedDate") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const filteredApplicants = sortedApplicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "All" || applicant.status === statusFilter;

    // Apply score filter
    let matchesScore = true;
    if (scoreFilter !== "All") {
      switch (scoreFilter) {
        case "90+":
          matchesScore = applicant.score >= 90;
          break;
        case "80-89":
          matchesScore = applicant.score >= 80 && applicant.score <= 89;
          break;
        case "70-79":
          matchesScore = applicant.score >= 70 && applicant.score <= 79;
          break;
        case "60-69":
          matchesScore = applicant.score >= 60 && applicant.score <= 69;
          break;
        case "Below 60":
          matchesScore = applicant.score < 60;
          break;
        default:
          matchesScore = true;
      }
    }

    return matchesSearch && matchesStatus && matchesScore;
  });

  const statusStyles = {
    Pending: "bg-blue-100 text-blue-800",
    Shortlisted: "bg-purple-100 text-purple-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const scoreOptions = [
    { value: "All", label: "All Scores", color: "gray" },
    { value: "90+", label: "90+ (Excellent)", color: "green" },
    { value: "80-89", label: "80-89 (Good)", color: "blue" },
    { value: "70-79", label: "70-79 (Average)", color: "amber" },
    { value: "60-69", label: "60-69 (Below Average)", color: "orange" },
    { value: "Below 60", label: "Below 60 (Poor)", color: "red" },
  ];

  const getScoreOption = (value) => {
    return (
      scoreOptions.find((option) => option.value === value) || scoreOptions[0]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Job Not Found</h2>
        <p className="text-gray-600 mt-2">
          The job you're looking for doesn't exist.
        </p>
        <Link
          to={`/organization/jobs/${id}`}
          className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Link
            to={`/organization/jobs/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Job Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Applicants for {job.title}
          </h1>
          <div className="flex items-center mt-2 text-gray-600">
            <Briefcase size={16} className="mr-2" />
            <span>{job.jobType}</span>
            <span className="mx-2">•</span>
            <MapPin size={16} className="mr-2" />
            <span>{job.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {applicants.length} Applicants
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 ${
                showAdvancedFilters
                  ? "bg-blue-50 text-blue-700 border-blue-500"
                  : "bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters (Score Filter) */}
        {showAdvancedFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Filter by Score</h3>
              <button
                onClick={() => {
                  setScoreFilter("All");
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <button
                onClick={() => setScoreFilter("All")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  scoreFilter === "All"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                All Scores
              </button>
              <button
                onClick={() => setScoreFilter("90+")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  scoreFilter === "90+"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                90+ (Excellent)
              </button>
              <button
                onClick={() => setScoreFilter("80-89")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  scoreFilter === "80-89"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                80-89 (Good)
              </button>
              <button
                onClick={() => setScoreFilter("70-79")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  scoreFilter === "70-79"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                70-79 (Average)
              </button>
              <button
                onClick={() => setScoreFilter("60-69")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  scoreFilter === "60-69"
                    ? "bg-orange-100 text-orange-800 border border-orange-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                60-69 (Below Avg)
              </button>
              <button
                onClick={() => setScoreFilter("Below 60")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  scoreFilter === "Below 60"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Below 60 (Poor)
              </button>
            </div>

            {scoreFilter !== "All" && (
              <div className="mt-3 text-sm text-gray-600">
                Showing applicants with score: {scoreFilter}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-sm">
              <th
                className="py-4 px-6 font-medium cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  <span>Applicant</span>
                  {sortField === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="py-4 px-6 font-medium">Contact</th>
              <th
                className="py-4 px-6 font-medium cursor-pointer"
                onClick={() => handleSort("appliedDate")}
              >
                <div className="flex items-center">
                  <span>Applied</span>
                  {sortField === "appliedDate" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                className="py-4 px-6 font-medium cursor-pointer"
                onClick={() => handleSort("score")}
              >
                <div className="flex items-center">
                  <span>Score</span>
                  {sortField === "score" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredApplicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">
                      {applicant.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {applicant.currentPosition}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {applicant.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {applicant.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{applicant.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={14} className="mr-2" />
                      <span className="truncate">{applicant.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone size={14} className="mr-2" />
                      <span>{applicant.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-900">
                  <div className="flex items-center">
                    <Calendar size={14} className="text-gray-400 mr-2" />
                    <span>{applicant.appliedDate}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <Star size={14} className="text-amber-500 mr-1" />
                    <span className="font-medium">{applicant.score}</span>
                    <span className="text-gray-500 ml-1">/100</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      statusStyles[applicant.status]
                    }`}
                  >
                    {applicant.status}
                  </span>
                  {applicant.status === "Pending" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleStatusChange(applicant.id, "Shortlisted")
                        }
                        className="flex items-center text-xs text-green-600 hover:text-green-800"
                      >
                        <CheckCircle size={12} className="mr-1" />
                        Select
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(applicant.id, "Rejected")
                        }
                        className="flex items-center text-xs text-red-600 hover:text-red-800"
                      >
                        <XCircle size={12} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <Link
                    to={`/organization/jobs/${job.id}/applicants/${applicant.id}`}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors inline-block"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplicants.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No applicants found
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || statusFilter !== "All" || scoreFilter !== "All"
                ? "Try adjusting your search or filter criteria."
                : "No one has applied for this position yet."}
            </p>
          </div>
        )}
      </div>

      {/* Applicant Details Modal */}
      {showDetailsModal && selectedApplicant && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedApplicant.name}'s Application Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                  Score: {selectedApplicant.score}/100
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    statusStyles[selectedApplicant.status]
                  }`}
                >
                  {selectedApplicant.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{selectedApplicant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedApplicant.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedApplicant.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {selectedApplicant.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Professional Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Current Position</p>
                      <p className="font-medium">
                        {selectedApplicant.currentPosition}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">
                        {selectedApplicant.experience}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="font-medium">
                        {selectedApplicant.appliedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Skills</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Resume
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText size={20} className="text-gray-400 mr-3" />
                      <span className="font-medium">
                        {selectedApplicant.resume}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Download Resume
                    </button>
                  </div>
                </div>
              </div>

              {/* Interview Summary */}
              {selectedApplicant.interviewDetails && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    AI Interview Summary
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedApplicant.interviewDetails.totalQuestions}
                        </p>
                        <p className="text-sm text-gray-600">Total Questions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {
                            selectedApplicant.interviewDetails
                              .completedQuestions
                          }
                        </p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">
                          {
                            selectedApplicant.interviewDetails
                              .averageResponseTime
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          Avg Response Time
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {selectedApplicant.interviewDetails.screenshots}
                        </p>
                        <p className="text-sm text-gray-600">Screenshots</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        AI Feedback:
                      </p>
                      <p className="text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                        {selectedApplicant.interviewDetails.aiFeedback}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Video size={16} className="mr-2" />
                        Watch Recording
                      </button>
                      <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Image size={16} className="mr-2" />
                        View Screenshots
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions & Answers */}
              {selectedApplicant.interviewDetails &&
                selectedApplicant.interviewDetails.questions && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Interview Questions & Answers
                    </h3>
                    <div className="space-y-4">
                      {selectedApplicant.interviewDetails.questions.map(
                        (qa, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                <MessageSquare
                                  size={16}
                                  className="text-blue-500 mr-2"
                                />
                                <p className="font-medium">
                                  Question {index + 1}
                                </p>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Score: {qa.score}/10
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3 font-medium">
                              {qa.question}
                            </p>
                            <p className="text-gray-600 mb-3 bg-white p-3 rounded-lg border border-gray-200">
                              {qa.answer}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Feedback:</span>{" "}
                              {qa.feedback}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Screenshots */}
              {selectedApplicant.interviewDetails &&
                selectedApplicant.interviewDetails.screenshots && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Interview Screenshots
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedApplicant.interviewDetails.screenshots.map(
                        (screenshot, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 rounded-xl p-3 border border-gray-200"
                          >
                            <div className="aspect-video bg-gray-300 rounded-lg mb-2 flex items-center justify-center">
                              <Image size={24} className="text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              {screenshot.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              Time: {screenshot.time}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;
