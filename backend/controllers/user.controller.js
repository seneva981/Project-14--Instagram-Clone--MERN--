import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

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