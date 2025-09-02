import express from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import { khaltiInitiate } from "../Controllers/payment.controller.js";

const router = express.Router();

router.route('/khalti/initiate').get(verifyJwt, khaltiInitiate);

export default router;
