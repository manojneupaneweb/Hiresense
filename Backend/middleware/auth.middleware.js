import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.error("❌ No Token Provided");
            return res.status(401).json({ message: "Unauthorized request" });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            console.error("❌ JWT Verification Failed:", error.message);
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            console.error("❌ No User Found for This Token");
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("❌ Middleware Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default verifyJwt;
