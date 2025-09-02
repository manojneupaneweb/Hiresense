import express from "express";
import { createJobPost, getJobs } from "../Controllers/job.controller.js";
import  verifyJwt  from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createJobpost", verifyJwt,  createJobPost);
router.post("/getJobs", verifyJwt,  getJobs);

export default router;
