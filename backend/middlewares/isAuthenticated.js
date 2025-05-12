import jwt from "jsonwebtoken";
import blacklistToken from "../models/blacklistToken.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized because token is missing",
        success: false,
      });
    }
    const isBlacklisted = await blacklistToken.findOne({ token: token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized because token is blacklisted",
        success: false,
      });
    }
    const isdecoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!isdecoded) {
      return res.status(401).json({
        message: "Unauthorized because token is not verified",
        success: false,
      });
    }
    req.id = isdecoded.userId;
    return next();
  } catch (error) {
    console.log(error);
  }
};
