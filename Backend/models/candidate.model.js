import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cvMatch: {
      type: Number,
      required: true,
    },
    score: {
      type: Number, 
    },
    photos: {
      type: [String], 
    },
    aiQuestions: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    improvement: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
