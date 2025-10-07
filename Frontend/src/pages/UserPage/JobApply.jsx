import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Loader,
    AlertCircle,
    MapPin,
    Clock,
    ArrowLeft,
    Upload,
    FileText,
    X,
    CheckCircle,
    Star,
    Award,
    Zap,
    BookOpen
} from 'lucide-react';

// Analysis Popup Component
function AnalysisPopup({ result, onClose, onContinue, onRedirectToJobs }) {
    const score = result?.analysis?.score || 0;
    const suggestion = result?.analysis?.suggestion || 'No suggestions available.';
    const canContinue = score >= 35;

    // Determine color based on score
    const getScoreColor = () => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        if (score >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred Background */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Popup Content */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 mx-auto z-10">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Analysis Result</h2>
                    <p className="text-gray-600">How your resume matches the job requirements</p>
                </div>

                {/* Score Circle */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <svg className="w-32 h-32" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : score >= 40 ? "#F97316" : "#EF4444"}
                                strokeWidth="3"
                                strokeDasharray={`${score}, 100`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-2xl font-bold ${getScoreColor()}`}>
                                {score}/100
                            </span>
                        </div>
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Feedback & Suggestions</h3>
                    <p className="text-gray-700 text-sm">{suggestion}</p>
                </div>

                {/* Score Warning */}
                {!canContinue && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle size={20} className='text-red-600 mr-2' />
                            <p className="text-red-700 text-sm font-medium">
                                Your resume score is below the required threshold (35/100).
                                Please improve your resume before applying.
                            </p>
                        </div>
                        <button
                            onClick={onRedirectToJobs}
                            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Other Jobs
                        </button>
                    </div>
                )}

                {/* Success Message */}
                {canContinue && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <CheckCircle size={20} className="text-green-600 mr-2" />
                            <p className="text-green-700 text-sm font-medium">
                                Congratulations! Your resume meets our requirements.
                                You can now proceed to the interview.
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={canContinue ? onContinue : onClose}
                    className={`w-full py-3 px-4 rounded-xl transition-colors font-medium ${canContinue
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {canContinue ? 'Proceed to Interview' : 'Upload Improved Resume'}
                </button>
            </div>
        </div>
    );
}

function JobApply() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setResumeFile(file);
        setUploadSuccess(false);

        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        try {
            setAnalyzing(true);
            setError(null);

            const formData = new FormData();
            formData.append("resume", file);
            formData.append("jobDescription", job?.description || "");
            formData.append("requirements", job?.requirements || "");
            formData.append("responsibilities", JSON.stringify(job?.responsibilities || []));
            formData.append("skills", JSON.stringify(job?.skills || []));

            const token = localStorage.getItem("accessToken");

            const response = await axios.post("/api/ai/cvanalysis", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            localStorage.setItem("cvAnalysis", JSON.stringify(response.data.analysis));

            setAnalysisResult(response.data);
            setShowAnalysisPopup(true);
            setUploadSuccess(true);

            if (response.data?.analysis?.score >= 35) {
                setTimeout(() => {
                    navigate(`/jobs/${id}/interview`);
                }, 10000); // Redirect after 10 seconds
            }
        } catch (err) {
            console.error('Error analyzing CV:', err);
            setError(err.response?.data?.message || 'Failed to analyze CV');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleContinueApplication = () => {
        // Redirect to interview page
        navigate(`/jobs/${id}/interview`);
    };

    const handleRedirectToJobs = () => {
        // Redirect to jobs page
        navigate('/jobs');
    };
   

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center justify-center text-red-500 mb-4">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Oops! Something went wrong</h2>
                    <p className="text-gray-600 text-center mb-6">{error}</p>
                    <Link
                        to="/jobs"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors block text-center font-medium"
                    >
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to={`/jobs/${id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        <span className="font-medium">Back to Job Details</span>
                    </Link>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Position</h1>
                        <p className="text-gray-600">You're applying for: {job?.title}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Job Information */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
                                Job Information
                            </h2>

                            {job && (
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                                        <div className="space-y-2">
                                            {job.location && (
                                                <div className="flex items-center text-gray-600">
                                                    <MapPin size={18} className="mr-2 text-blue-500" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}
                                            {job.jobType && (
                                                <div className="flex items-center text-gray-600">
                                                    <Clock size={18} className="mr-2 text-purple-500" />
                                                    <span className="capitalize">{job.jobType}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Job Description */}
                                    {job.description && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <BookOpen size={18} className="mr-2 text-green-500" />
                                                Job Description
                                            </h4>
                                            <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
                                        </div>
                                    )}

                                    {/* Requirements */}
                                    {job.requirements && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <Award size={18} className="mr-2 text-orange-500" />
                                                Requirements
                                            </h4>
                                            <p className="text-gray-700 text-sm leading-relaxed">{job.requirements}</p>
                                        </div>
                                    )}

                                    {/* Responsibilities */}
                                    {job.responsibilities && job.responsibilities.length > 0 && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <Star size={18} className="mr-2 text-yellow-500" />
                                                Key Responsibilities
                                            </h4>
                                            <ul className="space-y-2">
                                                {job.responsibilities.map((responsibility, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                        <span className="text-gray-700 text-sm">{responsibility}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {job.skills && job.skills.length > 0 && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <Zap size={18} className="mr-2 text-red-500" />
                                                Required Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume & Analysis Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="w-2 h-6 bg-green-600 rounded mr-3"></span>
                            Resume & Analysis
                        </h2>

                        <div className="space-y-6">
                            {/* File Upload */}
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-lg font-medium text-gray-700 mb-2">Upload Your Resume</p>
                                <p className="text-sm text-gray-500 mb-6">PDF format only. We'll analyze it against the job requirements.</p>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="resume-upload"
                                />

                                {/* Label acts as the button */}
                                <label
                                    htmlFor="resume-upload"
                                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer font-medium shadow-md hover:shadow-lg"
                                >
                                    <FileText size={20} className="mr-2" />
                                    {resumeFile ? 'Change File' : 'Choose File'}
                                </label>

                                {/* Display selected file */}
                                {resumeFile && (
                                    <p className={`text-sm mt-4 ${uploadSuccess ? 'text-green-600' : 'text-gray-600'}`}>
                                        {uploadSuccess ? '✓ ' : ''}{resumeFile.name}
                                    </p>
                                )}
                            </div>

                            {/* Analyzing Indicator */}
                            {analyzing && (
                                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                                    <Loader size={20} className="animate-spin text-blue-600 mr-3" />
                                    <span className="text-blue-700 font-medium">Analyzing your resume...</span>
                                </div>
                            )}

                            {/* Continue Application Button */}
                            <button
                                onClick={handleContinueApplication}
                                disabled={!uploadSuccess || (analysisResult?.analysis?.score || 0) < 35}
                                className={`w-full px-4 py-3 rounded-xl transition-colors font-medium ${uploadSuccess && (analysisResult?.analysis?.score || 0) >= 35
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {analyzing ? 'Analyzing...' : 'Continue to Interview'}
                            </button>

                            {/* Score warning */}
                            {analysisResult && analysisResult.analysis.score < 35 && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-start">
                                        <AlertCircle size={20} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <p className="text-red-700 text-sm">
                                            Your resume score is below the required threshold (35/100).
                                            Please upload an improved resume to continue with your application.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Success message */}
                            {analysisResult && analysisResult.analysis.score >= 35 && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-start">
                                        <CheckCircle size={20} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <p className="text-green-700 text-sm">
                                            Your resume meets our requirements! You can now proceed to the interview.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Popup */}
            {showAnalysisPopup && analysisResult && (
                <AnalysisPopup
                    result={analysisResult}
                    onClose={() => setShowAnalysisPopup(false)}
                    onContinue={handleContinueApplication}
                    onRedirectToJobs={handleRedirectToJobs}
                />
            )}
        </div>
    );
}

export default JobApply;