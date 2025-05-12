import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser/:username", isAuthenticated, getUser);

export default router;
