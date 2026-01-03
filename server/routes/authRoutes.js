import express from "express";
import {
  sendUserRegistrationOtp,
  verifyUserRegistrationOtp,
  registerUser,
  sendAdminRegistrationOtp,
  verifyAdminRegistrationOtp,
  registerAdmin,
  sendMentorRegistrationOtp,
  verifyMentorRegistrationOtp,
  registerMentor,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// User registration routes with OTP verification
router.post("/send-user-otp", sendUserRegistrationOtp);
router.post("/verify-user-otp", verifyUserRegistrationOtp);
router.post("/register-user", registerUser);

// Admin registration routes with OTP verification
router.post("/send-admin-otp", sendAdminRegistrationOtp);
router.post("/verify-admin-otp", verifyAdminRegistrationOtp);
router.post("/register-admin", registerAdmin);

// Mentor registration routes with OTP verification
router.post("/send-mentor-otp", sendMentorRegistrationOtp);
router.post("/verify-mentor-otp", verifyMentorRegistrationOtp);
router.post("/register-mentor", registerMentor);

// Authentication routes
router.post("/login", login);

// Password reset routes with OTP handling
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;