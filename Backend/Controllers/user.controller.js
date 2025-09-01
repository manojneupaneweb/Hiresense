import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudiny.util.js'
import bcrypt from 'bcrypt'

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const localFilePath = req.files?.avatar[0]?.path;
    if (!localFilePath) {
      return ("Profile picture is required");
    }

    const avatarUrl = await uploadOnCloudinary(localFilePath);
    console.log('res from cloudnery: ', avatarUrl);
    

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    if (!newUser) {
      await deleteFromCloudinary(localFilePath);
      return(500, "Failed to create user");
    }

    return res.status(201).json(new ApiResponse(201, { message: "User created successfully!", user: newUser }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  // const { email, password } = req.body;

  // if (!email || !password) {
  //   return (400, "Email and password are required");
  // }

  // const user = await User.findOne({ where: { email } });
  // if (!user) {
  //   return (404, "User does not exist");
  // }

  // const isPasswordValid = await user.isPasswordCorrect(password);
  // if (!isPasswordValid) {
  //   return (401, "Invalid user credentials");
  // }

  // const { accessToken, refreshToken } = await generateAccessRefreshToken(user.id);

  // if (!accessToken || !refreshToken) {
  //   throw new ApiError(500, "Failed to generate tokens");
  // }

  // const loggedInUser = await User.findByPk(user.id, {
  //   attributes: { exclude: ["password", "refreshToken"] }
  // });

  // res.status(200)
  //   .cookie("accessToken", accessToken, cookieOption)
  //   .cookie("refreshToken", refreshToken, cookieOption)
  //   .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
};


const logOutUser = async (req, res, next) => {
  // try {
  //   res.clearCookie("accessToken", cookieOption);
  //   res.clearCookie("refreshToken", cookieOption);
  //   return res.status(200, { message: "User logged out successfully" });
  // } catch (error) {
  //   next(error);
  // }
};

export {
  registerUser,
  loginUser,
  logOutUser
}
