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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="patient" />
      <div className="flex-1 p-6">
      <div className="flex-1 bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.firstName}</h1>
        <p className="text-gray-600">Your health dashboard</p>
      </div>
      
      <Outlet /> {/* Render the selected component here */}

    </div>
       
      </div>
    
      
    </div>
  )
}

export default PatientDashboard
