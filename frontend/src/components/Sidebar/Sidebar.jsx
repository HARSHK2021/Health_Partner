import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  HeartPulse,
  Search,
  Hospital,
  FolderPlus,
  MessageCircle
  
} from 'lucide-react';

function Sidebar({ role }) {
  const menuItems = {
    doctor: [
      { icon: Home, label: 'Dashboard' },
      { icon: Users, label: 'Patients' },
      { icon: Calendar, label: 'Appointments' },
      { icon: MessageSquare, label: 'Messages' },
      { icon: BarChart, label: 'Analytics' },
    ],
    patient: [
      { icon: Home, label: 'My Health' , link: '/patient-dashboard/myhealth' },
      { icon: Search, label: 'Search Doctor' ,link:'/patient-dashboard/searchdoctor' },
      { icon: Calendar, label: 'Track Menstruation',link:'/patient-dashboard/menstruation'  },
      { icon: Hospital, label: 'Search Hospital', link:'/patient-dashboard/findhospital' },
      { icon: FolderPlus, label: ' Add Medical Record', link:'/patient-dashboard/addmedicalrecord' },
      { icon: MessageCircle, label: ' Notification', link:'/patient-dashboard/notification' },
    ],
    facility: [
      { icon: Home, label: 'Overview' },
      { icon: Users, label: 'Staff' },
      { icon: BarChart, label: 'Monitoring' },
      { icon: Calendar, label: 'Schedule' },
    ],
  };

  const navigate = useNavigate();
  const logoutHandler = async()=>{

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signout`);
        console.log(response);
        if(response.status==200){
          localStorage.removeItem('token');
          localStorage.removeItem('type');
          localStorage.removeItem('id');
          navigate("/")
        }
      
      
    } catch (error) {
      console.error(error);
      
    }
    

  }

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex items-center space-x-3">
        <HeartPulse className="h-8 w-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-blue-600">Health Partner</h2>
      </div>
      <nav className="flex-1 px-4">
        {menuItems[role].map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg mb-1"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>

        ))}
      </nav>
      <div className="p-4 border-t">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button onClick={logoutHandler} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  role: PropTypes.oneOf(['doctor', 'patient', 'facility']).isRequired
};

export default Sidebar;
