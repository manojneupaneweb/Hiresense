import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Calendar,
  Briefcase,
  ArrowLeft,
  Edit3,
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample job data - in a real app, you would fetch this from an API
  const sampleJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      jobType: "Full-time",
      location: "San Francisco, CA",
      postedDate: "2023-10-15",
      status: "Active",
      applicants: 42,
      description:
        "We are looking for an experienced frontend developer with React expertise to join our growing team. You will be responsible for building user-facing features and ensuring the technical feasibility of UI/UX designs.",
      requirements:
        "5+ years experience with React, TypeScript, and modern CSS frameworks. Experience with state management libraries (Redux, MobX) and testing frameworks (Jest, Cypress). Strong understanding of web performance optimization.",
      salary: "$120,000 - $150,000",
      experience: "Senior Level",
      responsibilities: [
        "Develop new user-facing features using React.js",
        "Build reusable components and front-end libraries for future use",
        "Translate designs and wireframes into high-quality code",
        "Optimize components for maximum performance across browsers",
        "Collaborate with back-end developers and web designers",
      ],
      skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Redux"],
    },
    {
      id: 2,
      title: "Product Manager",
      jobType: "Full-time",
      location: "New York, NY",
      postedDate: "2023-10-10",
      status: "Active",
      applicants: 28,
      description:
        "Lead product initiatives and work with cross-functional teams to deliver exceptional products that meet customer needs and business goals.",
      requirements:
        "3+ years of product management experience, strong analytical skills, and experience with Agile methodology. Computer Science background or technical experience is preferred.",
      salary: "$130,000 - $160,000",
      experience: "Mid Level",
      responsibilities: [
        "Define product vision, strategy, and roadmap",
        "Gather and prioritize product and customer requirements",
        "Work closely with engineering teams to deliver with quick time-to-market",
        "Drive product launches including working with marketing team",
        "Develop product pricing and positioning strategies",
      ],
      skills: [
        "Product Management",
        "Agile",
        "Analytics",
        "Strategy",
        "User Research",
      ],
    },
    {
      id: 3,
      title: "UX Designer",
      jobType: "Contract",
      location: "Austin, TX",
      postedDate: "2023-09-25",
      status: "Closed",
      applicants: 35,
      description:
        "Create beautiful and functional user experiences for our products. You'll work closely with product managers and developers to design intuitive interfaces.",
      requirements:
        "Strong portfolio demonstrating UX/UI design skills, 4+ years experience in UX design, proficiency in Figma, Sketch, or similar design tools.",
      salary: "$90,000 - $110,000",
      experience: "Mid Level",
      responsibilities: [
        "Create user-centered designs by considering market analysis and customer feedback",
        "Use sitemaps, process flows, and storyboards to illustrate design ideas",
        "Design graphic user interface elements like menus, tabs, and widgets",
        "Build page navigation buttons and search fields",
        "Develop UI mockups and prototypes that clearly illustrate how sites function",
      ],
      skills: [
        "Figma",
        "UI/UX Design",
        "Wireframing",
        "Prototyping",
        "User Research",
      ],
    },
    {
      id: 4,
      title: "Data Scientist",
      jobType: "Remote",
      location: "Remote",
      postedDate: "2023-10-05",
      status: "Active",
      applicants: 51,
      description:
        "Build machine learning models to derive insights from our data. You'll work with large datasets and help shape our data strategy.",
      requirements:
        "Strong programming skills in Python, experience with SQL and ML frameworks (TensorFlow, PyTorch), strong statistical knowledge, and experience with data visualization tools.",
      salary: "$110,000 - $140,000",
      experience: "Senior Level",
      responsibilities: [
        "Develop machine learning models to solve business problems",
        "Implement predictive models and algorithms",
        "Process, clean, and verify the integrity of data used for analysis",
        "Create data visualizations to communicate findings",
        "Collaborate with engineering teams to implement models in production",
      ],
      skills: [
        "Python",
        "Machine Learning",
        "SQL",
        "TensorFlow",
        "Data Analysis",
        "Statistics",
      ],
    },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchJob = () => {
      const foundJob = sampleJobs.find((job) => job.id === parseInt(id));
      setJob(foundJob);
      setLoading(false);
    };

    fetchJob();
  }, [id]);

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
    <div className="max-w-4xl mx-auto">
      <Link
        to="/organization/jobs"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Jobs
      </Link>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center mt-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  job.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {job.status}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600">{job.experience}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center">
            <Briefcase size={18} className="text-gray-400 mr-3" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={18} className="text-gray-400 mr-3" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={18} className="text-gray-400 mr-3" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center">
            <Users size={18} className="text-gray-400 mr-3" />
            <span>{job.applicants} Applicants</span>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className="text-gray-400 mr-3" />
            <span>Posted on {job.postedDate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Job Description
            </h2>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Requirements
            </h2>
            <p className="text-gray-700">{job.requirements}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Job Actions
            </h2>
            <div className="space-y-3">
              <Link
                to={`/organization/jobs/${job.id}/applicants`}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <Users size={18} className="mr-2" />
                View Applicants
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
