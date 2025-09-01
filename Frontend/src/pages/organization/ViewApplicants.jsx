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
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  XCircle,
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
    },
    {
      id: 4,
      jobId: 1,
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 234-5678",
      appliedDate: "2023-10-19",
      status: "Pending",
      score: 95,
      experience: "7 years",
      currentPosition: "Lead Frontend Engineer at StartupX",
      location: "Palo Alto, CA",
      resume: "david_kim_resume.pdf",
      skills: ["React", "TypeScript", "GraphQL", "Jest", "AWS"],
      notes:
        "Top candidate. Exceptional technical skills and leadership experience. Schedule for technical interview.",
    },
    {
      id: 5,
      jobId: 1,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+1 (555) 876-5432",
      appliedDate: "2023-10-21",
      status: "Pending",
      score: 84,
      experience: "3 years",
      currentPosition: "Frontend Developer at AppWorks",
      location: "Berkeley, CA",
      resume: "priya_sharma_resume.pdf",
      skills: ["React", "JavaScript", "CSS", "Redux"],
      notes: "",
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
    return matchesSearch && matchesStatus;
  });

  const statusStyles = {
    Pending: "bg-blue-100 text-blue-800",
    Shortlisted: "bg-purple-100 text-purple-800",
    Rejected: "bg-red-100 text-red-800",
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
          to="/jobs"
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
            to={`/jobs/${id}`}
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
            <button className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100">
              <Filter size={18} className="mr-2" />
              More Filters
            </button>
          </div>
        </div>
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
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors">
                      View Details
                    </button>
                    <a
                      href={`/${applicant.resume}`}
                      download
                      className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                    >
                      <Download size={18} />
                    </a>
                  </div>
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
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria."
                : "No one has applied for this position yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicants;
