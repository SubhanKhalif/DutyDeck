const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { generateOTP, generateToken };