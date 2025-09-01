import JobPost from "../models/job.model.js";

// Create a new job post
export const createJobPost = async (req, res) => {
  try {
    const { title, description, requirements, location, jobType, endDate } = req.body;

    const postBy = req.user._id;

    const newJob = new JobPost({
      title,
      description,
      requirements,
      location,
      jobType,
      endDate,
      postBy,
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const userId = req.user._id; 

    const jobs = await JobPost.find({ postBy: userId });

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
