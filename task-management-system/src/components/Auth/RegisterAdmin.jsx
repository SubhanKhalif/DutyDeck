import { useState, useRef, useEffect } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", organization: "" });
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingStep, setLoadingStep] = useState(""); // "otp", "resend", "verify", "register"
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  const isLoading = (step) => loadingStep === step;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    setLoadingStep("otp");
    try {
      await API.post("/auth/send-admin-otp", { email: form.email });
      toast.success("OTP sent to your email");
      setOtpSent(true);
      startResendTimer();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingStep("");
    }
  };

  const resendOtp = async () => {
    setLoadingStep("resend");
    try {
      await API.post("/auth/send-admin-otp", { email: form.email });
      toast.success("OTP resent");
      startResendTimer();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoadingStep("");
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otpInputs.join("");
    setLoadingStep("verify");
    try {
      await API.post("/auth/verify-admin-otp", { email: form.email, otp: enteredOtp });
      toast.success("OTP verified successfully!");
      setOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoadingStep("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify your email first.");
      return;
    }

    setLoadingStep("register");
    try {
      await API.post("/auth/register-admin", form);
      toast.success("Admin registered successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoadingStep("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <ToastContainer />
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md mx-4 glass-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-200 tracking-tight drop-shadow">
            Admin Registration
          </h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-blue-100 font-medium">Name</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-blue-100 font-medium">Email</label>
            <div className="flex gap-2 items-center">
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setOtpVerified(false);
                  setOtpSent(false);
                  setOtpInputs(["", "", "", "", "", ""]);
                }}
                disabled={otpVerified}
                className="flex-1 bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
                placeholder="Enter your email"
              />
              {otpVerified ? (
                <span className="text-green-400 font-semibold text-sm ml-1">✅ Verified</span>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={isLoading("otp")}
                  className={`text-sm px-4 py-2 rounded-xl text-white transition ${
                    isLoading("otp") ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isLoading("otp") ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Sending...
                    </span>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              )}
            </div>
          </div>

          {otpSent && !otpVerified && (
            <div className="flex flex-col gap-2">
              <label className="text-blue-100 font-medium">Enter OTP</label>
              <div className="flex gap-2 justify-center">
                {otpInputs.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^[0-9]?$/.test(val)) {
                        const newInputs = [...otpInputs];
                        newInputs[index] = val;
                        setOtpInputs(newInputs);
                        if (val && index < 5) inputRefs.current[index + 1]?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
                        inputRefs.current[index - 1]?.focus();
                      }
                    }}
                    className="w-10 h-10 text-center text-lg font-bold rounded-md bg-white/20 text-blue-100 border border-white/30 shadow focus:ring-2 focus:ring-blue-400"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={verifyOtp}
                disabled={isLoading("verify")}
                className={`mt-2 text-white font-semibold py-2 rounded-xl shadow ${
                  isLoading("verify") ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading("verify") ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Verifying...
                  </span>
                ) : (
                  "Confirm OTP"
                )}
              </button>

              <div className="text-sm text-blue-200 mt-2 text-center">
                Didn’t get the code?{" "}
                {resendTimer > 0 ? (
                  <span className="text-blue-400 font-medium">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isLoading("resend")}
                    className="text-blue-400 hover:underline font-medium flex items-center gap-1"
                  >
                    {isLoading("resend") ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                        Resending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-blue-100 font-medium">Password</label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="organization" className="text-blue-100 font-medium">Organization</label>
            <select
              id="organization"
              required
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              className="bg-white/20 border border-white/30 text-blue-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
            >
              <option value="" disabled>Select your organization</option>
              <option value="MERN stack">MERN stack</option>
              <option value="AI software development">AI software development</option>
              <option value="App development">App development</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!otpVerified || isLoading("register")}
            className={`${
              otpVerified
                ? isLoading("register")
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-bold py-3 rounded-xl shadow-lg transition text-lg tracking-wide mt-2`}
          >
            {isLoading("register") ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Registering...
              </span>
            ) : (
              "Register Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
