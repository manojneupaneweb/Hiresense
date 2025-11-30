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

function AnalysisPopup({ result, onClose, onContinue, onRedirectToJobs }) {
  const score = result?.score || result?.analysis?.cvScore || result?.analysis?.score || 0;
  const suggestion = result?.analysis?.cvSuggestion || result?.analysis?.suggestion || 'No suggestions available.';
  const canContinue = score >= 35;

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-blue-500 bg-opacity-20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 mx-auto z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Analysis Result</h2>
          <p className="text-gray-600">How your resume matches the job requirements</p>
        </div>

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

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Feedback & Suggestions</h3>
          <p className="text-gray-700 text-sm">{suggestion}</p>
        </div>

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
  const [existingAnalysis, setExistingAnalysis] = useState(null);

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

        setJob(response.data.job);
        setExistingAnalysis(response.data.score);
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
      formData.append("jobId", id || "");
      const token = localStorage.getItem("accessToken");

      const response = await axios.post("/api/ai/cvanalysis", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        if (response.data.analysis) {
          localStorage.setItem("cvAnalysis", JSON.stringify(response.data.analysis));
        }

        setAnalysisResult(response.data);
        setShowAnalysisPopup(true);
        setUploadSuccess(true);

        if (response.data.analysis?.cvScore >= 35) {
          setTimeout(() => {
            navigate(`/jobs/${existingAnalysis._id}/interview`);
          }, 10000);
        }
      } else {
        setError(response.data.message || 'Failed to analyze CV');
      }
    } catch (err) {
      console.error('Error analyzing CV:', err);
      setError(err.response?.data?.message || 'Failed to analyze CV');
    } finally {
      setAnalyzing(false);
    }
  };


  const handleContinueApplication = () => {

    navigate(`/jobs/${existingAnalysis._id}/interview`);
  };

  const handleRedirectToJobs = () => {
    navigate('/jobs');
  };

  const getScore = () => {
    if (existingAnalysis) return existingAnalysis.cvScore;
    if (!analysisResult) return 0;
    return analysisResult.analysis?.cvScore || analysisResult.analysis?.score || 0;
  };

  const getSuggestion = () => {
    if (existingAnalysis) return existingAnalysis.cvSuggestion;
    if (!analysisResult) return '';
    return analysisResult.analysis?.cvSuggestion || analysisResult.analysis?.suggestion || '';
  };

  const canContinue = getScore() >= 35;
  const hasExistingAnalysis = existingAnalysis !== null;

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
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
                Job Information
              </h2>

              {job && (
                <div className="space-y-6">
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

                  {job.description && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <BookOpen size={18} className="mr-2 text-green-500" />
                        Job Description
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
                    </div>
                  )}

                  {job.requirements && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Award size={18} className="mr-2 text-orange-500" />
                        Requirements
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{job.requirements}</p>
                    </div>
                  )}

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

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-6 bg-green-600 rounded mr-3"></span>
              Resume & Analysis
            </h2>

            <div className="space-y-6">
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${hasExistingAnalysis
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-300 hover:border-blue-400'
                }`}>
                <Upload size={48} className={`mx-auto mb-4 ${hasExistingAnalysis ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload Your Resume</p>
                <p className="text-sm text-gray-500 mb-6">PDF format only. We'll analyze it against the job requirements.</p>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={analyzing || hasExistingAnalysis}
                />

                <label
                  htmlFor="resume-upload"
                  className={`inline-flex items-center px-8 py-3 rounded-xl transition-colors font-medium shadow-md hover:shadow-lg ${analyzing || hasExistingAnalysis
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    }`}
                >
                  <FileText size={20} className="mr-2" />
                  {hasExistingAnalysis ? 'CV Already Analyzed' : analyzing ? 'Analyzing...' : resumeFile ? 'Change File' : 'Choose File'}
                </label>

                {resumeFile && (
                  <p className={`text-sm mt-4 ${uploadSuccess ? 'text-green-600' : 'text-gray-600'}`}>
                    {uploadSuccess ? '✓ ' : ''}{resumeFile.name}
                  </p>
                )}
              </div>

              {analyzing && (
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                  <Loader size={20} className="animate-spin text-blue-600 mr-3" />
                  <span className="text-blue-700 font-medium">Analyzing your resume...</span>
                </div>
              )}

              {(hasExistingAnalysis || analysisResult) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Current Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Score:</span>
                      <span className={`text-lg font-bold ${getScore() >= 80 ? 'text-green-600' :
                          getScore() >= 60 ? 'text-yellow-600' :
                            getScore() >= 40 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                        {getScore()}/100
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-700 block mb-1">Feedback:</span>
                      <p className="text-gray-700 text-sm bg-white p-3 rounded-lg border">
                        {getSuggestion()}
                      </p>
                    </div>
                    {hasExistingAnalysis && (
                      <div className="text-xs text-gray-500">
                        Analyzed on: {new Date(existingAnalysis.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(hasExistingAnalysis || analysisResult) && (
                <div className={`border rounded-xl p-4 ${canContinue ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start">
                    {canContinue ? (
                      <CheckCircle size={20} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <p className={canContinue ? "text-green-700 text-sm" : "text-red-700 text-sm"}>
                      {canContinue
                        ? "Your resume meets our requirements! You can now proceed to the interview."
                        : "Your resume score is below the required threshold (35/100). Please contact support if you need to re-analyze your CV."}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleContinueApplication}
                disabled={!canContinue}
                className={`w-full px-4 py-3 rounded-xl transition-colors font-medium ${canContinue
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Continue to Interview
              </button>
            </div>
          </div>
        </div>
      </div>

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