import React, { useState } from 'react'
import {
    Activity,
    Calendar,
    MessageSquare,
    Pill as Pills,
    Clock,
    Heart,
    Search,
    Plus,
    ChevronDown,
    
    
  } from 'lucide-react';

import Sidebar from '../components/Sidebar/Sidebar';
import { UserDataContext } from "../context/UserContext";
import MyHealth from '../components/PatientComponents/MyHealth';
import { Outlet } from 'react-router-dom';


const PatientDashboard = () => {


const {user , setUser} = React.useContext(UserDataContext);
  
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar role="patient" user={user} />
      <div className="ml-64 transition-all duration-300">
        <div className="bg-gray-100">
          <Outlet /> {/* Render the selected component here */}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
