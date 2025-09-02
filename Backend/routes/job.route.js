import express from "express";
import { createJobPost, getMyJobs, jobapplicants, jobDetails, getjobs } from "../Controllers/job.controller.js";
import  verifyJwt  from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getalljobs", getjobs);

// router.get("/getjobbyid/:id", jobDetails);



router.post("/createJobpost", verifyJwt,  createJobPost);
router.get("/getmyJobs", verifyJwt,  getMyJobs);
router.get("/applicants/:id", verifyJwt,  jobapplicants);
router.get("/jobdetails/:id", jobDetails);

export default router;
