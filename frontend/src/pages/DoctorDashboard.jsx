
import React from 'react'
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar/Sidebar';
const DoctorDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
    <Sidebar role="doctor" />
    <div className="flex-1 ">
    <div className="flex-1 bg-gray-100 ">
   
    <Outlet /> {/* Render the selected component here */}

  </div>
     
    </div>
  
    
  </div>
  )
}

export default DoctorDashboard
