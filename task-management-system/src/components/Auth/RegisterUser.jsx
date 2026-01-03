import { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", organization: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await API.post("/auth/register-user", form);
      toast.success("User registered successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <ToastContainer />
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md mx-4 glass-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-blue-200 tracking-tight drop-shadow">
            User Registration
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
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="flex-1 bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
              placeholder="Enter your email"
            />
          </div>

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
            <input
              id="organization"
              type="text"
              required
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              className="bg-white/20 border border-white/30 text-blue-100 placeholder-blue-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition text-lg shadow-inner"
              placeholder="Enter your organization"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-3 rounded-xl shadow-lg transition text-lg tracking-wide mt-2`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Registering...
              </span>
            ) : (
              "Register User"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
