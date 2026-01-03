import express from "express";
import {
  registerUser,
  registerAdmin,
  registerMentor,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// User registration (no OTP)
router.post("/register-user", registerUser);

// Admin registration (no OTP)
router.post("/register-admin", registerAdmin);

// Mentor registration (no OTP)
router.post("/register-mentor", registerMentor);

// Authentication routes
router.post("/login", login);

// Password reset routes with OTP handling
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;