import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTask from '../admincomponents/CreateTask';
import AllTask from '../admincomponents/AllTask';
import Header from '../others/Header';
import Footer from '../others/Footer';
import UserInsights from "../admincomponents/UserInsights";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (e.g., by checking localStorage for a token)
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
        <Header/>
        <CreateTask />
        <AllTask />
        <UserInsights />
        <Footer />
    </div>
  )
}

export default AdminDashboard