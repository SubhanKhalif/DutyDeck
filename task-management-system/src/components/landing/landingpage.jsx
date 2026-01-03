import { FaUserPlus, FaSignInAlt, FaChartBar, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <FaUsers className="text-blue-400 text-3xl drop-shadow" />
          <span className="text-2xl font-bold text-blue-200 tracking-tight">DutyDeck</span>
        </div>
        <nav className="flex gap-6">
          <a href="/login" className="text-blue-200 hover:text-white font-semibold transition">Login</a>
          <a href="/register-user" className="text-blue-200 hover:text-white font-semibold transition">Register</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-200 mb-6 tracking-tight drop-shadow-lg leading-tight">
            Welcome to <span className="text-blue-400">Employer Task Management System</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-12 font-light">
            Streamline your organization's employee management with our powerful and intuitive platform.<br />
            Manage profiles, track performance, and enhance productivity effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
            <a
              href="/register-user"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-2xl shadow-xl transition text-lg tracking-wide border-2 border-blue-500/80"
            >
              <FaUserPlus className="text-xl" /> Get Started
            </a>
            <a
              href="/login"
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-blue-500/80 hover:border-blue-600 text-blue-200 hover:text-white font-bold py-3 px-8 rounded-2xl shadow-xl transition text-lg tracking-wide"
            >
              <FaSignInAlt className="text-xl" /> Login
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="backdrop-blur-xl bg-white/10 border border-blue-400/20 rounded-3xl p-8 glass-card hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <FaUsers className="text-blue-300 text-2xl" />
              <h2 className="text-2xl font-bold text-blue-200">Efficient Management</h2>
            </div>
            <p className="text-blue-100 text-base">
              Centralize all employee data and manage it with ease through our intuitive interface.
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-blue-400/20 rounded-3xl p-8 glass-card hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <FaChartBar className="text-blue-300 text-2xl" />
              <h2 className="text-2xl font-bold text-blue-200">Real-time Analytics</h2>
            </div>
            <p className="text-blue-100 text-base">
              Get insights into your workforce with comprehensive analytics and reporting tools.
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-blue-400/20 rounded-3xl p-8 glass-card hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <FaShieldAlt className="text-blue-300 text-2xl" />
              <h2 className="text-2xl font-bold text-blue-200">Secure Platform</h2>
            </div>
            <p className="text-blue-100 text-base">
              Your data is protected with enterprise-grade security measures and encryption.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-16 text-center text-blue-300 text-sm bg-gradient-to-t from-gray-900/80 via-gray-900 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            &copy; {new Date().getFullYear()} Employer Task Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}