import crypto from "crypto";
import jwt from "jsonwebtoken";

export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}