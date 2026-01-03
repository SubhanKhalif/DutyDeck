import React from 'react';
import Header from '../others/Header';
import Footer from '../others/Footer';
import UserInsights from "../MentorComponents/UserInsights";

const MentorDashboard = () => {
  return (
    <div>
      <Header/>
      <UserInsights />
      <Footer />
    </div>
  )
}

export default MentorDashboard;