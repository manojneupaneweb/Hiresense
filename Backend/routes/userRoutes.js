import express from "express";
import {upload} from '../middleware/multer.js'
import { registerUser } from "../Controllers/user.controller.js";

const router = express.Router();

router.route('/register').post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

export default router;
