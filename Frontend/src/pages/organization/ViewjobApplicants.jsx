import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search, 
  X, 
  Star,
  Award,
  TrendingUp,
  BarChart3,
  Target
} from "lucide-react";

function ViewjobApplicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [expandedApplicant, setExpandedApplicant] = useState(null);

  // Static applicant data with AI interview scores
  const staticApplicants = [
    {
      _id: "1",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      appliedDate: "2023-10-15",
      status: "Reviewed",
      resume: "sarah_johnson_resume.pdf",
      coverLetter: "Dear Hiring Manager, I am excited to apply for this position...",
      experience: "5 years as a Frontend Developer at TechCorp",
      education: "BS in Computer Science, Stanford University",
      aiScore: 92,
      skillsMatch: 95,
      experienceMatch: 90,
      educationMatch: 88,
      aiFeedback: "Exceptional candidate with strong technical skills and relevant experience. Highly recommended for technical interview.",
      strengths: ["React", "TypeScript", "UI/UX Design", "Agile Methodology"],
      improvements: ["Could benefit from more backend experience", "Limited cloud infrastructure knowledge"]
    },
    {
      _id: "2",
      fullName: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 987-6543",
      location: "San Francisco, CA",
      appliedDate: "2023-10-18",
      status: "New",
      resume: "michael_chen_resume.pdf",
      coverLetter: "I was thrilled to see your opening for a Senior Developer...",
      experience: "3 years as a Software Engineer at StartupXYZ",
      education: "MS in Software Engineering, MIT",
      aiScore: 87,
      skillsMatch: 90,
      experienceMatch: 85,
      educationMatch: 95,
      aiFeedback: "Strong technical background with excellent problem-solving skills. Good cultural fit based on profile analysis.",
      strengths: ["Python", "Machine Learning", "Data Analysis", "Problem Solving"],
      improvements: ["Less experience with large-scale systems", "Could improve documentation skills"]
    },
    {
      _id: "3",
      fullName: "Emma Rodriguez",
      email: "emma.rodriguez@example.com",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      appliedDate: "2023-10-12",
      status: "Interview",
      resume: "emma_rodriguez_resume.pdf",
      coverLetter: "With my extensive experience in product management...",
      experience: "4 years as a Product Manager at GrowthInc",
      education: "MBA, Harvard Business School",
      aiScore: 95,
      skillsMatch: 97,
      experienceMatch: 96,
      educationMatch: 92,
      aiFeedback: "Top candidate with exceptional leadership qualities and strategic thinking. Perfect match for senior product role.",
      strengths: ["Product Strategy", "Team Leadership", "Market Analysis", "Stakeholder Management"],
      improvements: ["Technical depth could be improved", "Limited experience in B2B markets"]
    },
    {
      _id: "4",
      fullName: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+1 (555) 234-5678",
      location: "Chicago, IL",
      appliedDate: "2023-10-20",
      status: "Rejected",
      resume: "james_wilson_resume.pdf",
      coverLetter: "I am writing to express my interest in the UX Designer position...",
      experience: "2 years as a UX Designer at CreativeStudio",
      education: "BFA in Design, RISD",
      aiScore: 72,
      skillsMatch: 68,
      experienceMatch: 65,
      educationMatch: 85,
      aiFeedback: "Good design skills but lacks the technical experience required for this role. Better suited for junior positions.",
      strengths: ["UI Design", "User Research", "Wireframing", "Creativity"],
      improvements: ["Limited prototyping experience", "Needs improvement in UX writing", "Minimal front-end development knowledge"]
    },
    {
      _id: "5",
      fullName: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+1 (555) 876-5432",
      location: "Seattle, WA",
      appliedDate: "2023-10-22",
      status: "New",
      resume: "priya_patel_resume.pdf",
      coverLetter: "As a data scientist with 6 years of experience...",
      experience: "6 years as a Data Scientist at DataWorks",
      education: "PhD in Data Science, University of Washington",
      aiScore: 89,
      skillsMatch: 92,
      experienceMatch: 95,
      educationMatch: 90,
      aiFeedback: "Excellent technical candidate with strong analytical skills. Would benefit from more business acumen.",
      strengths: ["Data Analysis", "Statistical Modeling", "Python", "SQL", "Machine Learning"],
      improvements: ["Could improve communication skills", "Limited experience with real-time data systems"]
    }
  ];

  useEffect(() => {
    setApplicants(staticApplicants);
    setFilteredApplicants(staticApplicants);
  }, []);

  // Filter and sort applicants
  useEffect(() => {
    let result = [...applicants];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(applicant => 
        applicant.fullName.toLowerCase().includes(term) ||
        applicant.email.toLowerCase().includes(term) ||
        applicant.location.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(applicant => applicant.status === statusFilter);
    }
    
    // Apply sorting
    if (sortBy === "score") {
      result.sort((a, b) => b.aiScore - a.aiScore);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
    
    setFilteredApplicants(result);
  }, [applicants, searchTerm, statusFilter, sortBy]);

  const toggleApplicant = (id) => {
    if (expandedApplicant === id) {
      setExpandedApplicant(null);
    } else {
      setExpandedApplicant(id);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Reviewed": return "bg-purple-100 text-purple-800";
      case "Interview": return "bg-amber-100 text-amber-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Hired": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-green-50";
    if (score >= 70) return "bg-amber-50";
    if (score >= 60) return "bg-orange-50";
    return "bg-red-50";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Applicants for Job #{id}</h1>
        <p className="text-gray-600 mt-2">AI-powered candidate matching and ranking</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            >
              <option value="score">AI Score (High to Low)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Sort by Name</option>
            </select>
            
            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Applicant Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredApplicants.length} {filteredApplicants.length === 1 ? 'applicant' : 'applicants'} found
        </p>
        
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp size={16} className="mr-1" />
          Sorted by {sortBy === "score" ? "AI Match Score" : sortBy}
        </div>
      </div>

      {/* Applicants List */}
      {filteredApplicants.length > 0 ? (
        <div className="space-y-4">
          {filteredApplicants.map((applicant, index) => (
            <div key={applicant._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => toggleApplicant(applicant._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getScoreBgColor(applicant.aiScore)}`}>
                        <span className={`text-sm font-bold ${getScoreColor(applicant.aiScore)}`}>
                          {applicant.aiScore}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{applicant.fullName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                        {applicant.status}
                      </span>
                      {index === 0 && sortBy === "score" && (
                        <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          <Award size={12} className="mr-1" />
                          Top Match
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail size={16} className="mr-1 text-gray-400" />
                        {applicant.email}
                      </div>
                      <div className="flex items-center">
                        <Phone size={16} className="mr-1 text-gray-400" />
                        {applicant.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {applicant.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1 text-gray-400" />
                        Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {expandedApplicant === applicant._id ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedApplicant === applicant._id && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <BarChart3 size={18} className="mr-2" />
                      AI Match Analysis
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-700 font-medium">Skills Match</div>
                        <div className="flex items-end mt-1">
                          <div className="text-2xl font-bold text-blue-800">{applicant.skillsMatch}%</div>
                          <div className="ml-2 w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${applicant.skillsMatch}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm text-green-700 font-medium">Experience Match</div>
                        <div className="flex items-end mt-1">
                          <div className="text-2xl font-bold text-green-800">{applicant.experienceMatch}%</div>
                          <div className="ml-2 w-full bg-green-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${applicant.experienceMatch}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm text-purple-700 font-medium">Education Match</div>
                        <div className="flex items-end mt-1">
                          <div className="text-2xl font-bold text-purple-800">{applicant.educationMatch}%</div>
                          <div className="ml-2 w-full bg-purple-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${applicant.educationMatch}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">AI Feedback</h5>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">{applicant.aiFeedback}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Strengths</h5>
                        <div className="flex flex-wrap gap-2">
                          {applicant.strengths.map((strength, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Star size={12} className="mr-1" />
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Areas for Improvement</h5>
                        <div className="flex flex-wrap gap-2">
                          {applicant.improvements.map((improvement, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <Target size={12} className="mr-1" />
                              {improvement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                      <p className="text-gray-700">{applicant.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                      <p className="text-gray-700">{applicant.education}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-gray-700 whitespace-pre-line">{applicant.coverLetter}</p>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      <Download size={16} className="mr-2" />
                      Download Resume
                    </button>
                    
                    <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition">
                      Schedule Interview
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition">
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">No applicants found matching your criteria.</p>
          {(searchTerm || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewjobApplicants;