import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email: form.email });
      if (res.status === 200) {
        setMessage("We've sent a 6-digit OTP to your email. Please check your inbox.");
        setError("");
        setStep(2);
        setResendTimer(60); // 1 minute timer
      } else {
        setError("We couldn't send the OTP. Please try again in a moment.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.response?.data?.message || "We're having trouble sending the OTP. Please double-check your email address and try again.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!form.email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email: form.email });
      if (res.status === 200) {
        setMessage("We've resent the 6-digit OTP to your email. Please check your inbox.");
        setError("");
        setResendTimer(60); // Reset timer
      } else {
        setError("We couldn't resend the OTP. Please try again in a moment.");
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError(err.response?.data?.message || "We're having trouble resending the OTP. Please try again later.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!form.otp) {
      setError("Please enter the 6-digit OTP we sent to your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      if (res.status === 200) {
        setMessage("OTP verified successfully! You can now set a new password.");
        setError("");
        setStep(3);
      } else {
        setError("The OTP you entered is incorrect. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.response?.data?.message || "The OTP you entered is invalid or has expired. Please request a new one.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!form.newPassword || !form.confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Your password must be at least 8 characters long");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("The passwords you entered don't match. Please make sure they're identical.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        email: form.email,
        newPassword: form.newPassword,
      });
      if (res.status === 200) {
        setMessage("Your password has been successfully reset! Redirecting to login...");
        setError("");
        setStep(1);
        setForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("We couldn't reset your password. Please try again.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.response?.data?.message || "We're having trouble resetting your password. Please try again later.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md mx-4 glass-card">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-200 tracking-tight drop-shadow">
          Forgot Password
        </h2>

        {message && (
          <div className="bg-green-500/80 text-white rounded-lg px-4 py-2 text-center text-sm font-semibold shadow">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/80 text-white rounded-lg px-4 py-2 text-center text-sm font-semibold shadow">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-blue-100 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
                required
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={isLoading}
              className="bg-blue-600/80 hover:bg-blue-700/90 text-white font-bold py-3 rounded-xl shadow-lg transition text-lg tracking-wide relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="otp" className="text-blue-100 font-medium">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
                required
                maxLength={6}
              />
            </div>
            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className="bg-blue-600/80 hover:bg-blue-700/90 text-white font-bold py-3 rounded-xl shadow-lg transition text-lg tracking-wide relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
            <div className="text-center text-blue-100">
              {resendTimer > 0 ? (
                <p>Resend OTP in {resendTimer} seconds</p>
              ) : (
                <button
                  onClick={resendOtp}
                  disabled={isLoading}
                  className="text-blue-300 hover:text-blue-400 underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="text-blue-100 font-medium">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password (min 8 characters)"
                value={form.newPassword}
                onChange={handleChange}
                className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
                required
                minLength={8}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-blue-100 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
                required
                minLength={8}
              />
            </div>
            <button
              onClick={resetPassword}
              disabled={isLoading}
              className="bg-green-600/80 hover:bg-green-700/90 text-white font-bold py-3 rounded-xl shadow-lg transition text-lg tracking-wide relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;