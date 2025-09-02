import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  FileText,
  Video,
  Image,
  MessageSquare,
  Download,
  User,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ViewDetails = () => {
  const { applicantId } = useParams();
  const [job, setJob] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Sample data - in a real app, you would fetch this from an API
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
            id: 1,
            question:
              "Can you explain the Virtual DOM in React and how it improves performance?",
            answer:
              "The Virtual DOM is a lightweight copy of the actual DOM. When changes are made to a React component, they're first made to the Virtual DOM. React then compares this with the actual DOM and only updates the specific parts that changed, which is much faster than updating the entire DOM.",
            score: 9,
            feedback:
              "Excellent explanation with clear understanding of performance benefits",
            timeSpent: "45 seconds",
          },
          {
            id: 2,
            question:
              "How would you handle state management in a large React application?",
            answer:
              "For large applications, I prefer using Redux or Context API with useReducer. Redux is great for complex state interactions across components, while Context API is suitable for simpler global state needs. I also consider using React Query for server state management.",
            score: 8,
            feedback: "Good understanding of state management options",
            timeSpent: "52 seconds",
          },
          {
            id: 3,
            question: "What are React hooks and why were they introduced?",
            answer:
              "React hooks were introduced in React 16.8 to allow using state and other React features in functional components. They provide a way to reuse stateful logic between components without changing component hierarchy. Common hooks include useState, useEffect, and useContext.",
            score: 10,
            feedback: "Perfect explanation of hooks and their purpose",
            timeSpent: "38 seconds",
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
        analysis: {
          communication: 9,
          technical: 9,
          problemSolving: 8,
          confidence: 9,
        },
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
            id: 1,
            question: "What's the difference between CSS Grid and Flexbox?",
            answer:
              "Flexbox is designed for one-dimensional layouts - either a row or a column. Grid is designed for two-dimensional layouts - both rows and columns. I use Flexbox for components and Grid for overall page layout.",
            score: 9,
            feedback:
              "Clear and accurate distinction between the two layout systems",
            timeSpent: "40 seconds",
          },
        ],
        screenshots: [
          { id: 1, time: "01:20", description: "Discussing CSS methodologies" },
          { id: 2, time: "03:45", description: "UI design portfolio review" },
        ],
        analysis: {
          communication: 8,
          technical: 7,
          problemSolving: 7,
          confidence: 8,
        },
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
            id: 1,
            question: "What experience do you have with React?",
            answer:
              "I've worked with React in a few smaller projects, but most of my experience is with Angular. I understand the component-based architecture and have been learning React through online courses.",
            score: 6,
            feedback: "Limited practical React experience",
            timeSpent: "30 seconds",
          },
        ],
        screenshots: [
          {
            id: 1,
            time: "00:30",
            description: "Technical concepts discussion",
          },
        ],
        analysis: {
          communication: 7,
          technical: 6,
          problemSolving: 7,
          confidence: 7,
        },
      },
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
      interviewDetails: {
        totalQuestions: 12,
        completedQuestions: 12,
        averageResponseTime: "10 seconds",
        videoRecording: "available",
        screenshots: 10,
        aiFeedback:
          "Exceptional candidate with strong technical skills and leadership qualities. Excellent problem-solving abilities and communication skills.",
        questions: [
          {
            id: 1,
            question: "How do you optimize React application performance?",
            answer:
              "I use several techniques: React.memo for component memoization, useCallback and useMemo hooks to prevent unnecessary re-renders, code splitting with React.lazy, virtualization for large lists, and optimizing bundle size through tree shaking and compression.",
            score: 10,
            feedback:
              "Comprehensive knowledge of performance optimization techniques",
            timeSpent: "55 seconds",
          },
        ],
        screenshots: [
          {
            id: 1,
            time: "01:15",
            description: "Performance optimization discussion",
          },
          { id: 2, time: "03:20", description: "Architecture diagram" },
        ],
        analysis: {
          communication: 10,
          technical: 10,
          problemSolving: 9,
          confidence: 10,
        },
      },
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
      interviewDetails: {
        totalQuestions: 12,
        completedQuestions: 11,
        averageResponseTime: "14 seconds",
        videoRecording: "available",
        screenshots: 7,
        aiFeedback:
          "Solid foundational knowledge with good practical skills. Shows potential for growth with some mentoring.",
        questions: [
          {
            id: 1,
            question: "What is Redux and how does it work?",
            answer:
              "Redux is a state management library for JavaScript applications. It works based on three principles: single source of truth (store), state is read-only (only changed through actions), and changes are made with pure functions (reducers).",
            score: 8,
            feedback: "Good understanding of Redux fundamentals",
            timeSpent: "42 seconds",
          },
        ],
        screenshots: [
          { id: 1, time: "02:10", description: "Redux concepts explanation" },
        ],
        analysis: {
          communication: 8,
          technical: 8,
          problemSolving: 7,
          confidence: 8,
        },
      },
    },
    {
      id: 6,
      jobId: 1,
      name: "Alex Turner",
      email: "alex.turner@example.com",
      phone: "+1 (555) 345-6789",
      appliedDate: "2023-10-23",
      status: "Pending",
      score: 65,
      experience: "2 years",
      currentPosition: "Junior Developer at CodeCraft",
      location: "San Francisco, CA",
      resume: "alex_turner_resume.pdf",
      skills: ["JavaScript", "HTML", "CSS", "React"],
      notes:
        "Limited experience but shows potential. Consider for junior role.",
      interviewDetails: {
        totalQuestions: 12,
        completedQuestions: 9,
        averageResponseTime: "20 seconds",
        videoRecording: "available",
        screenshots: 5,
        aiFeedback:
          "Enthusiastic candidate with basic knowledge. Would require significant training but shows good learning potential.",
        questions: [
          {
            id: 1,
            question: "What are your strengths as a developer?",
            answer:
              "I'm a quick learner, passionate about coding, and I work well in teams. I have good problem-solving skills and I'm always eager to learn new technologies and improve my skills.",
            score: 7,
            feedback: "Good self-awareness and positive attitude",
            timeSpent: "35 seconds",
          },
        ],
        screenshots: [
          {
            id: 1,
            time: "01:45",
            description: "Discussing learning experiences",
          },
        ],
        analysis: {
          communication: 7,
          technical: 6,
          problemSolving: 6,
          confidence: 7,
        },
      },
    },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchApplicant = () => {
      const foundApplicant = sampleApplicants.find(
        (app) => app.id === parseInt(applicantId)
      );
      setApplicant(foundApplicant);
      setLoading(false);
    };

    fetchApplicant();
  }, [applicantId]);

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "text-green-600 bg-green-100";
    if (score >= 7) return "text-blue-600 bg-blue-100";
    if (score >= 5) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  const handleStatusChange = (newStatus) => {
    // In a real application, you would make an API call here
    setApplicant((prev) => ({ ...prev, status: newStatus }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Applicant Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          The applicant you're looking for doesn't exist.
        </p>
        <Link
          to={`/organization/jobs/${job.id}/applicants`}
          className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Link
            to={`/organization/jobs/${job.id}/applicants`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Applicants
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {applicant.name}'s Application
          </h1>
          <div className="flex items-center mt-2 text-gray-600">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
              Score: {applicant.score}/100
            </span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                applicant.status === "Shortlisted"
                  ? "bg-purple-100 text-purple-800"
                  : applicant.status === "Rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {applicant.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={16} className="mr-2 inline" />
            Download Resume
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {["overview", "interview", "resume", "evaluation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Candidate Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User size={18} className="mr-2" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{applicant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center">
                      <Mail size={14} className="mr-2" />
                      {applicant.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium flex items-center">
                      <Phone size={14} className="mr-2" />
                      {applicant.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium flex items-center">
                      <MapPin size={14} className="mr-2" />
                      {applicant.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied On</p>
                    <p className="font-medium flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {applicant.appliedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Briefcase size={18} className="mr-2" />
                  Professional Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Current Position</p>
                    <p className="font-medium">{applicant.currentPosition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{applicant.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {applicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resume</p>
                    <div className="flex items-center mt-1">
                      <FileText size={14} className="text-gray-400 mr-2" />
                      <span className="font-medium">{applicant.resume}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            {applicant.status === "Pending" && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Review Application
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusChange("Shortlisted")}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Shortlist Candidate
                  </button>
                  <button
                    onClick={() => handleStatusChange("Rejected")}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject Application
                  </button>
                </div>
              </div>
            )}

            {/* AI Feedback Summary */}
            {applicant.interviewDetails && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Star size={18} className="mr-2" />
                  AI Interview Summary
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-600">
                    {applicant.interviewDetails.aiFeedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "interview" && applicant.interviewDetails && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              AI Interview Details
            </h2>

            {/* Interview Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">
                  {applicant.interviewDetails.totalQuestions}
                </p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">
                  {applicant.interviewDetails.completedQuestions}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-2xl font-bold text-amber-600">
                  {applicant.interviewDetails.averageResponseTime}
                </p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">
                  {applicant.interviewDetails.screenshots}
                </p>
                <p className="text-sm text-gray-600">Screenshots</p>
              </div>
            </div>

            {/* Questions & Answers */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Questions & Answers
              </h3>
              <div className="space-y-4">
                {applicant.interviewDetails.questions.map((qa) => (
                  <div
                    key={qa.id}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(qa.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <MessageSquare
                          size={16}
                          className="text-blue-500 mr-3"
                        />
                        <span className="text-left font-medium">
                          {qa.question}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full mr-3 ${getScoreColor(
                            qa.score
                          )}`}
                        >
                          Score: {qa.score}/10
                        </span>
                        {expandedQuestions[qa.id] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </button>

                    {expandedQuestions[qa.id] && (
                      <div className="p-4 bg-white">
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Answer:
                          </p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {qa.answer}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Feedback:
                          </p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {qa.feedback}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-2" />
                          Time spent: {qa.timeSpent}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Interview Screenshots
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applicant.interviewDetails.screenshots.map((screenshot) => (
                  <div
                    key={screenshot.id}
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
                ))}
              </div>
            </div>

            {/* Video Recording */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Video Recording
              </h3>
              <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                  <Video size={32} className="text-gray-400" />
                </div>
                <div className="mt-3 flex justify-center">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                    <Video size={16} className="mr-2" />
                    Watch Full Recording
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "resume" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Resume & Documents
            </h2>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText size={24} className="text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {applicant.resume}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Uploaded on {applicant.appliedDate}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                  <Download size={16} className="mr-2" />
                  Download Resume
                </button>
              </div>

              <div className="aspect-video bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Resume preview would be shown here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF document • 2.4 MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "evaluation" && applicant.interviewDetails && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Detailed Evaluation
            </h2>

            {/* Skills Assessment */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Skills Assessment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {applicant.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skill}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {Math.floor(Math.random() * 3) + 8}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(Math.floor(Math.random() * 3) + 8) * 10}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competency Analysis */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Competency Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(applicant.interviewDetails.analysis || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="bg-white p-4 rounded-xl border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {value}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${value * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Overall Recommendation */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Award size={18} className="mr-2" />
                Overall Recommendation
              </h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-gray-700">
                    Based on the AI interview analysis, this candidate is{" "}
                    <span className="font-semibold text-green-600">
                      {applicant.score >= 90
                        ? "highly recommended"
                        : applicant.score >= 80
                        ? "recommended"
                        : applicant.score >= 70
                        ? "moderately recommended"
                        : "not recommended"}
                    </span>{" "}
                    for the position.
                  </p>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {applicant.score}%
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Next Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 hover:bg-green-100 transition-colors">
                  <div className="font-medium mb-2">Schedule Interview</div>
                  <div className="text-sm">
                    Arrange next interview with team
                  </div>
                </button>
                <button className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 hover:bg-blue-100 transition-colors">
                  <div className="font-medium mb-2">
                    Request Additional Info
                  </div>
                  <div className="text-sm">Ask for references or portfolio</div>
                </button>
                <button className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 hover:bg-amber-100 transition-colors">
                  <div className="font-medium mb-2">Compare Candidates</div>
                  <div className="text-sm">Compare with other applicants</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;
