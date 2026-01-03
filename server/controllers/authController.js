import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, generateToken } from "../utils/helpers.js";
import transporter from "../utils/mailer.js";

const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";

/**
 * Checks that necessary email environment variables are set.
 */
function checkMailerEnvVars() {
  if (!process.env.EMAIL) {
    throw new Error("EMAIL environment variable is not set.");
  }
  if (
    !process.env.EMAIL_PASSWORD &&
    !process.env.SMTP_PASSWORD &&
    !process.env.MAILER_PASS
  ) {
    throw new Error(
      "Email transport credentials are missing in environment variables."
    );
  }
}

/**
 * Sends a welcome email to the user's email address.
 */
const sendWelcomeEmail = async (email, name) => {
  checkMailerEnvVars();
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "🎉 Welcome to DutyDeck!",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Welcome Email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0d0d0d;
            color: #ffffff;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            padding: 30px 24px;
            background-color: #1a1a1a;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          .header {
            font-size: 26px;
            font-weight: 600;
            color: #a78bfa;
            margin-bottom: 24px;
            text-align: center;
          }
          .content p {
            font-size: 15px;
            line-height: 1.6;
            color: #e5e7eb;
            margin: 12px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 13px;
            color: #9ca3af;
            border-top: 1px solid #2e2e2e;
            padding-top: 16px;
          }
          @media (max-width: 480px) {
            .email-container {
              padding: 20px 16px;
            }
            .header {
              font-size: 22px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Welcome to DutyDeck, ${name}!</div>
          <div class="content">
            <p>We're thrilled to have you on board 🎉</p>
            <p>DutyDeck is built to help you streamline your tasks and make your experience productive and rewarding.</p>
            <p>If you have any questions or need help getting started, feel free to reach out to our support team anytime.</p>
            <p>Cheers,<br/>The DutyDeck Team</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} DutyDeck. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendRegistrationOtp = async (email, role) => {
  checkMailerEnvVars();
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.role !== "temp") {
    throw new Error("Email already in use.");
  }

  const otp = generateOTP();
  const tempUser = await User.findOneAndUpdate(
    { email },
    {
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      name: "temp",
      password: "temp",
      organization: "temp",
      role: "temp",
    },
    { upsert: true, new: true }
  );

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Confirm your email address",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify OTP</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #0d0d0d;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffffff;
            -webkit-font-smoothing: antialiased;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 40px auto;
            padding: 30px 24px;
            background-color: #1a1a1a;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #2e2e2e;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .app-name {
            font-size: 26px;
            font-weight: 600;
            color: #a78bfa;
          }
          h2 {
            font-size: 22px;
            margin-bottom: 10px;
            color: #ffffff;
          }
          p {
            font-size: 15px;
            line-height: 1.6;
            color: #e5e7eb;
            margin: 8px 0;
          }
          .otp-box {
            background-color: #27272a;
            color: #a78bfa;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 10px;
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            margin: 30px auto;
            width: 220px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 13px;
            color: #9ca3af;
            border-top: 1px solid #2e2e2e;
            padding-top: 16px;
          }
          @media (max-width: 480px) {
            .email-wrapper {
              padding: 20px 16px;
            }
            .otp-box {
              width: 90%;
              font-size: 22px;
              padding: 16px;
              letter-spacing: 8px;
            }
            .app-name {
              font-size: 22px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <div class="app-name">DutyDeck</div>
          </div>
          <h2>Confirm Verification Code</h2>
          <p>Please enter the following code to verify your email address:</p>
          <div class="otp-box">${otp}</div>
          <p>This verification code will only be valid for the next 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} DutyDeck. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
  return tempUser;
};

const verifyRegistrationOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user || user.role !== "temp") {
    throw new Error("User not found or already registered");
  }

  if (Date.now() > user.resetPasswordExpires) {
    throw new Error("OTP expired. Please request a new one.");
  }

  if (
    user.resetPasswordOTP?.toString().toLowerCase() !== otp.toString().toLowerCase()
  ) {
    throw new Error("Invalid OTP");
  }

  return user;
};

const completeRegistration = async (
  email,
  name,
  password,
  organization,
  role
) => {
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

// API ENDPOINTS

export const sendUserRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendRegistrationOtp(email, "user");
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyUserRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyRegistrationOtp(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    await completeRegistration(email, name, password, organization, "user");
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendAdminRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendRegistrationOtp(email, "admin");
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyAdminRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyRegistrationOtp(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    await completeRegistration(email, name, password, organization, "admin");
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendMentorRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await sendRegistrationOtp(email, "mentor");
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyMentorRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await verifyRegistrationOtp(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const registerMentor = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    await completeRegistration(email, name, password, organization, "mentor");
    res.status(201).json({ message: "Mentor registered successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      checkMailerEnvVars();
    } catch (envErr) {
      return res.status(500).json({
        message: "Email sending unavailable. Server missing env config.",
        error: envErr.message,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify OTP</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #0d0d0d;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #ffffff;
              -webkit-font-smoothing: antialiased;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 40px auto;
              padding: 30px 24px;
              background-color: #1a1a1a;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #2e2e2e;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .app-name {
              font-size: 26px;
              font-weight: 600;
              color: #a78bfa;
            }
            h2 {
              font-size: 22px;
              margin-bottom: 10px;
              color: #ffffff;
            }
            p {
              font-size: 15px;
              line-height: 1.6;
              color: #e5e7eb;
              margin: 8px 0;
            }
            .otp-box {
              background-color: #27272a;
              color: #a78bfa;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 10px;
              text-align: center;
              padding: 20px;
              border-radius: 10px;
              margin: 30px auto;
              width: 220px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              font-size: 13px;
              color: #9ca3af;
              border-top: 1px solid #2e2e2e;
              padding-top: 16px;
            }
            @media (max-width: 480px) {
              .email-wrapper {
                padding: 20px 16px;
              }
              .otp-box {
                width: 90%;
                font-size: 22px;
                padding: 16px;
                letter-spacing: 8px;
              }
              .app-name {
                font-size: 22px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="app-name">DutyDeck</div>
            </div>
            <h2>Confirm Verification Code</h2>
            <p>Hey ${user.name || "User"},</p>
            <p>Please enter the following code on the page where you requested a password reset:</p>
            <div class="otp-box">${otp}</div>
            <p>This verification code will only be valid for the next 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <div class="footer">
              &copy; ${new Date().getFullYear()} DutyDeck. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV !== "production") {
        console.log("Reset password OTP sent:", info.response);
      }
      return res.status(200).json({ message: "OTP sent to email" });
    } catch (emailError) {
      // Provide extra debugging for SMTP/email issues
      let errMsg =
        emailError && emailError.toString
          ? emailError.toString()
          : String(emailError);
      console.error(
        "Error sending email (forgotPassword):",
        errMsg,
        emailError
      );
      return res.status(500).json({
        message: "Failed to send OTP email",
        error: errMsg,
      });
    }
  } catch (error) {
    let msg = error && error.message ? error.message : String(error);
    console.error("Error in forgotPassword:", msg, error);
    return res.status(500).json({
      message: "Internal server error",
      error: msg,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetPasswordExpires || !user.resetPasswordOTP) {
      return res
        .status(400)
        .json({ message: "No OTP request found for this user" });
    }

    if (Date.now() > user.resetPasswordExpires) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    if (
      user.resetPasswordOTP?.toString().toLowerCase() !==
      otp.toString().toLowerCase()
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    let msg = error && error.message ? error.message : String(error);
    console.error("Error in verifyOtp:", msg, error);
    res.status(500).json({
      message: "Internal server error",
      error: msg,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
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
    let msg = error && error.message ? error.message : String(error);
    console.error("Error in resetPassword:", msg, error);
    res.status(500).json({
      message: "Internal server error",
      error: msg,
    });
  }
};