import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from '../utils/cloudiny.util.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { cookieOption } from "../utils/cookieOption.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
const generateAccessRefreshToken = async (userId) => {

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };

};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const localFilePath = req.files?.avatar?.[0]?.path;
    if (!localFilePath) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const avatarUrl = await uploadOnCloudinary(localFilePath);

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

    return res.status(201).json({ message: "User created successfully!", user: newUser });

  } catch (error) {
    console.log('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('isPasswordValid: ', isPasswordValid);

    // if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

    if (!accessToken || !refreshToken)
      return res.status(500).json({ message: "Failed to generate tokens" });

    const { password: _, refreshToken: __, ...userData } = user.toObject();

    // Send cookies & response
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOption)
      .cookie("refreshToken", refreshToken, { ...cookieOption, maxAge: 1000 * 60 * 60 * 24 * 28 })
      .json({
        user: userData,
        accessToken,
        refreshToken,
        message: "User logged in successfully"
      });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    status: 200,
    message: "User profile retrieved",
    user
  });
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
  logOutUser,
  getUserProfile
}
