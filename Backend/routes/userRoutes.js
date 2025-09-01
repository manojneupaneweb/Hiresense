import express from "express";
import {upload} from '../middleware/multer.js'
import { getUserProfile, loginUser, logOutUser, registerUser } from "../Controllers/user.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/register').post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route('/login').post(loginUser);



router.route('/getuser').get(verifyJwt, getUserProfile);

export default router;
