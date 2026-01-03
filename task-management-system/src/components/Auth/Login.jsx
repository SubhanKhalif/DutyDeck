import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      // Save token and user info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        name: res.data.name,
        email: form.email,
        role: res.data.role
      }));
      
      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "mentor") {
        navigate("/mentor");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md mx-4 glass-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-200 tracking-tight drop-shadow">
            Login
          </h2>
          {error && (
            <div className="bg-red-500/80 text-white rounded-lg px-4 py-2 text-center text-sm font-semibold shadow">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-blue-100 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-blue-100 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600/80 hover:bg-blue-700/90 text-white font-bold py-3 rounded-xl shadow-lg transition text-lg tracking-wide mt-2"
          >
            Login
          </button>
        </form>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
          <button
            className="text-blue-300 hover:underline text-xs"
            onClick={() => navigate("/forgot-password")}
            type="button"
          >
            Forgot Password?
          </button>
          <button
            className="text-blue-300 hover:underline text-xs"
            onClick={() => navigate("/register-user")}
            type="button"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
