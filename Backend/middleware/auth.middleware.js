// Middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

const verifyJwt = async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        console.error("❌ No Token Provided");
        return(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decodedToken) {
        console.error("❌ JWT Verification Failed");
        return(401, "Invalid Access Token");
    }

    const user = await User.findOne({
        where: { id: decodedToken?.id }, 
        attributes: { exclude: ["password", "refreshToken"] }
    });

    if (!user) {
        console.error("❌ No User Found for This Token");
        return(401, "Invalid Access Token");
    }

    req.user = user;
    next();
};

export default verifyJwt;