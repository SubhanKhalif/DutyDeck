import React from 'react'
import Header from '../others/Header'
import Tasknumber from '../usercomponents/Tasknumber'
import TaskList from '../usercomponents/TaskList'
import Footer from '../others/Footer'

const EmployeeDashboard = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <div className='flex-grow p-10'>
        <Header />
        <Tasknumber />
        <TaskList />
      </div>
      <Footer />
    </div>
  )
}

export default EmployeeDashboard