import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,  
      required: true,
    },
    responsibilities: [{
      type: String,
      required: true,
    }],
    skills: [{
      type: String,
      required: true,
    }],
    location: {
      type: String,
      required: true,
      trim: true
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time"
    },
    postBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active"
    },
    applicants: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Index for better query performance
jobPostSchema.index({ postBy: 1, status: 1 });
jobPostSchema.index({ jobType: 1, location: 1 });

const JobPost = mongoose.model("JobPost", jobPostSchema);

export default JobPost;