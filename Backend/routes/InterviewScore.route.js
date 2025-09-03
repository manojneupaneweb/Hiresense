import express from "express";
import  verifyJwt  from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/createscore", verifyJwt);

export default router;
