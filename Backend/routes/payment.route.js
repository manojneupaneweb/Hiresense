import express from "express";
import { initiateKhaltiPayment, verifyKhaltiPayment } from "../Controllers/payment.controller.js";

const router = express.Router();

router.post("/khalti/initiate", initiateKhaltiPayment);
router.post("/khalti/verify", verifyKhaltiPayment);

export default router;
