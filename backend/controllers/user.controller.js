import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import blacklistToken from "../models/blacklistToken.model.js";
import cloudinary from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "Something is missing", success: false });
    }
    const isUserAlreadyExistByEmail = await User.findOne({ email });
    if (isUserAlreadyExistByEmail) {
      return res.status(401).json({
        message: "User already exist with this email",
        success: false,
      });
    }
    const isUserAlreadyExistByUsername = await User.findOne({ username });
    if (isUserAlreadyExistByUsername) {
      return res.status(401).json({
        message: "User already exist with this username",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    return res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      return res.status(401).json({
        message: "Either email, username or password is missing",
        success: false,
      });
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(401).json({
        message: "User not found with this email or username",
        success: false,
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }
    const userCopy = {
      _id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successfully",
        success: true,
        userCopy,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      await blacklistToken.create({
        token: token,
      });
    }
    res
      .clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" })
      .status(200)
      .json({
        message: "Logout successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const userName = req.params.username;
    if (!userName) {
      return res.status(400).json({
        message: "Username is missing in the params",
        success: false,
      });
    }
    const user = await User.findOne({ username: userName });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const userCopy = {
      _id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
    return res.status(200).json({
      message: "User found successfully",
      success: true,
      userCopy,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateUser = async (req, res) => {
  try {
    const { username, password, bio } = req.body;
    const updatedData = {};
    if (username) {
      updatedData.username = username;
    }
    if (bio) {
      updatedData.bio = bio;
    }
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(fileStr);
      updatedData.profilePicture = result.secure_url;
    }
    const updatedUser = await User.findByIdAndUpdate(req.id, updatedData, {
      new: true,
    });
    return res.status(200).json({
      updateUser: updatedUser,
      message: "User updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getSuggestedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const suggestedUsers = await User.find({
      _id: { $ne: req.id, $nin: user.following },
    })
      .limit(5)
      .select("-password");
    return res.status(200).json({
      message: "Suggested users found successfully",
      success: true,
      suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};
export const followUser = async (req, res) => {
  try {
    const userName = req.params.username;
    if (!userName) {
      return res.status(400).json({
        message: "Username is missing in the params",
        success: false,
      });
    }
    const user = await User.findOne({ username: userName });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const loggedInUser = await User.findById(req.id);
    if (!loggedInUser) {
      return res.status(404).json({
        message: "Logged in user not found",
        success: false,
      });
    }
    if (loggedInUser.following.includes(userName)) {
      return res.status(400).json({
        message: "You are already following this user",
        success: false,
      });
    }
    loggedInUser.following.push(userName);
    user.followers.push(userName);
    await loggedInUser.save();
    await user.save();
    return res.status(200).json({
      message: "User followed successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
}