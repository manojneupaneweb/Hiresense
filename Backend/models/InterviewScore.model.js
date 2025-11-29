import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['ai', 'user'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
})

const chatSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    messages: [messageSchema]
}, { timestamps: true })

const InterviewScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
    interviewScore: {
        type: Number
    },
    photos: {
        type: [String]
    },
    chat: chatSchema
}, { timestamps: true })

export const InterviewScore = mongoose.model("InterviewScore", InterviewScoreSchema)
