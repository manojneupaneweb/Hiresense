import JobPost from "../models/job.model.js";

// Create a new job post

export const createJobPost = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      skills,
      location,
      jobType,
      endDate
    } = req.body;

    const postBy = req.user._id;
    console.log('------------job create calling-----------');
    

    // Validate required fields
    if (!title || !description || !requirements || !location || !jobType) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: title, description, requirements, location, and jobType"
      });
    }

    // Validate jobType enum
    const validJobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
    if (!validJobTypes.includes(jobType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job type. Must be one of: Full-time, Part-time, Contract, Internship, Remote"
      });
    }

    // Filter out empty strings from arrays
    const filteredResponsibilities = Array.isArray(responsibilities) 
      ? responsibilities.filter(item => item.trim() !== "")
      : [];
    
    const filteredSkills = Array.isArray(skills) 
      ? skills.filter(item => item.trim() !== "")
      : [];

    const newJob = new JobPost({
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.trim(),
      responsibilities: filteredResponsibilities,
      skills: filteredSkills,
      location: location.trim(),
      jobType,
      endDate: endDate || null,
      postBy,
      status: "Active" // Default status
    });

    const savedJob = await newJob.save();

    // Populate the postBy field with user details if needed
    await savedJob.populate("postBy", "name email");

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("Error creating job post:", error);
    
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Job with this title already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create job post",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    });
  }
};



export const getMyJobs = async (req, res) => {
  try {
    // Make sure req.user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.user._id;

    const jobs = await JobPost.find({ postBy: userId });

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No jobs found",
        jobs: [],
      });
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};


export const jobapplicants = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await JobPost.findById(id).populate("applicants", "fullName email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job.applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const jobDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await JobPost.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getjobs = async (req, res) => {
  try {
    const jobs = await JobPost.find(); 

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};


