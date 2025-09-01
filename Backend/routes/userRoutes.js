import { Router } from "express";
import { registerUser } from "../Controllers/user.controller";

const router = Router();

router.route('/register').post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);



export default router;