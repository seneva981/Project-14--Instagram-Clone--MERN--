import { Router } from "express";
import { followUser, getSuggestedUsers, getUser, loginUser, logoutUser, registerUser, unfollowUser, updateUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser/:username", isAuthenticated, getUser);
router.put("/updateUser", isAuthenticated, upload.single("profilePicture"), updateUser);
router.get("/getSuggestedUsers", isAuthenticated, getSuggestedUsers);
router.put("/followUser/:username", isAuthenticated, followUser);
router.put("/unfollowUser/:username", isAuthenticated, unfollowUser);

export default router;
