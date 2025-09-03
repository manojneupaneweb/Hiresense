import mongoose from 'mongoose'

const InterviewScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
        required: true
    },
    cvScore: {
        type: Number,
        required: true
    },
    cvSuggestion: {
        type: String
    },
    questionAnswers: [
        {
            question: { type: String },
            answer: { type: String },
        }
    ],
    interviewScore: {
        type: Number
    },
    photos: [{
        type: String
    }]
}, { timestamps: true });

export const InterviewScore = mongoose.model("InterviewScore", InterviewScoreSchema);