import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/components/Auth/Login";
import RegisterUser from "../src/components/Auth/RegisterUser";
import RegisterAdmin from "../src/components/Auth/RegisterAdmin";
import DashboardUser from "../src/components/Dashboard/EmployeeDashboard";
import DashboardAdmin from "../src/components/Dashboard/AdminDashboard";
import LandingPage from "../src/components/landing/landingpage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/user" element={<DashboardUser />} />
        <Route path="/admin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
