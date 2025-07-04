const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, generateToken } = require("../utils/helpers");
const transporter = require("../utils/mailer");

const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Welcome to Our Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome, ${name}!</h2>
        <p>Thank you for joining our platform. We're excited to have you on board!</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendRegistrationOtp = async (email, role) => {
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.role !== 'temp') {
    throw new Error("Email already in use.");
  }

  const otp = generateOTP();
  const tempUser = await User.findOneAndUpdate(
    { email },
    {
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: Date.now() + 10 * 60 * 1000,
      name: "temp",
      password: "temp",
      organization: "temp",
      role: "temp"
    },
    { upsert: true, new: true }
  );

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `<h3>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</h3>`
  };

  await transporter.sendMail(mailOptions);
  return tempUser;
};

const verifyRegistrationOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user || user.role !== 'temp') {
    throw new Error("User not found or already registered");
  }

  if (Date.now() > user.resetPasswordExpires) {
    throw new Error("OTP expired. Please request a new one.");
  }

  if (user.resetPasswordOTP !== otp) {
    throw new Error("Invalid OTP");
  }

  return user;
};

const completeRegistration = async (email, name, password, organization, role) => {
  const user = await User.findOne({ email });
  if (!user || user.role !== "temp") {
    throw new Error("OTP verification required or already registered.");
  }

  user.name = name;
  user.password = await bcrypt.hash(password, 10);
  user.organization = organization;
  user.role = role;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  await sendWelcomeEmail(email, name);
  return user;
};

const sendUserRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendRegistrationOtp(email, "user");
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyUserRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyRegistrationOtp(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    await completeRegistration(email, name, password, organization, "user");
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendAdminRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendRegistrationOtp(email, "admin");
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyAdminRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyRegistrationOtp(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    await completeRegistration(email, name, password, organization, "admin");
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMentorRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendRegistrationOtp(email, "mentor");
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyMentorRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyRegistrationOtp(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerMentor = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    await completeRegistration(email, name, password, organization, "mentor");
    res.status(201).json({ message: "Mentor registered successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Your OTP for password reset is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 1 hour.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "OTP sent to email" });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (Date.now() > user.resetPasswordExpires) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    if (user.resetPasswordOTP?.toLowerCase() !== otp.toLowerCase()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

module.exports = {
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
};
