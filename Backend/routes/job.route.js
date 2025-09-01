import express from "express";
import { createJobPost } from "../Controllers/job.controller.js";
import { verifyJwt } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createJobpost", verifyJwt,  createJobPost);
router.post("/getJobs", verifyJwt,  getJobs);

export default router;
