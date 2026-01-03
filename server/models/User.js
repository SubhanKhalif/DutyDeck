import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "mentor"],
    default: "user",
    required: true,
  },
  otp: String,
  otpExpires: Date,
  verified: { type: Boolean, default: false },
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
});

export default mongoose.model("User", userSchema);