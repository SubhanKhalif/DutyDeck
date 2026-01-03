import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/components/Auth/Login";
import RegisterUser from "../src/components/Auth/RegisterUser";
import RegisterAdmin from "../src/components/Auth/RegisterAdmin";
import RegisterMentor from "../src/components/Auth/RegisterMentor";
import DashboardUser from "../src/components/Dashboard/EmployeeDashboard";
import DashboardAdmin from "../src/components/Dashboard/AdminDashboard";
import DashboardMentor from "../src/components/Dashboard/MentorDashboard";
import LandingPage from "../src/components/landing/landingpage";
import AllTaskPreview from "../src/components/admincomponents/AllTaskPreview";
import TaskListPreview from "../src/components/usercomponents/TaskListPreview";
import UserTaskList from "../src/components/admincomponents/UserTaskList";
import ForgotPassword from "../src/components/Auth/ForgotPassword";
import NotFound from "./components/landing/404";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/register-mentor" element={<RegisterMentor />} />
        <Route path="/user" element={<DashboardUser />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/mentor" element={<DashboardMentor />} />
        <Route path="/all-tasks-preview" element={<AllTaskPreview />} />
        <Route path="/task-list-preview" element={<TaskListPreview />} />
        <Route path="/user-tasks" element={<UserTaskList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
