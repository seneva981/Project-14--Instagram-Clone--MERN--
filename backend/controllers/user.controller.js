import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const user = await User.findOne({ $or: [{email},{username}] });
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
      posts: user.posts
    }
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1 * 24 * 60 * 60 * 1000 }).status(200).json({
      message: "Login successfully",
      success: true,
      userCopy,
    });
  } catch (error) {
    console.log(error);
  }
}