import express from "express";
import { CVAnalysis } from "../Controllers/ai.controller.js";
import  verifyJwt  from "../middleware/auth.middleware.js";

import {upload} from '../middleware/multer.js'

const router = express.Router();

router.post(
  "/cvanalysis",
  verifyJwt,
  upload.single("resume"),
  CVAnalysis
);


export default router;
