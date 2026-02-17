import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import ConfirmDialog from '../common/ConfirmDialog';
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
  MessageCircle,
  Shield,
  FileText
  
} from 'lucide-react';

function Sidebar({ role, user }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const baseMenuItems = {
    doctor: [
      { icon: Home, label: 'My Health' , link: '/doctor-dashboard/myhealth' },
      { icon: FolderPlus, label: ' Add self Medical Record', link:'/doctor-dashboard/addmedicalrecord' },
      { icon: Users, label: 'My Patients', link:'/doctor-dashboard/managepatients' },
      { icon: MessageCircle, label: ' Notification', link:'/doctor-dashboard/notification' },
      { icon: BarChart, label: 'Analytics' },
    ],
    patient: [
      { icon: Home, label: 'My Health' , link: '/patient-dashboard/myhealth' },
      { icon: Search, label: 'Search Doctor' ,link:'/patient-dashboard/searchdoctor' },
      { icon: Shield, label: 'Manage Access', link:'/patient-dashboard/access-control' },
      { icon: Hospital, label: 'Search Hospital', link:'/patient-dashboard/findhospital' },
      { icon: FolderPlus, label: ' Add Medical Record', link:'/patient-dashboard/addmedicalrecord' },
      { icon: FileText, label: 'View Medical Records', link:'/patient-dashboard/medical-records' },
      { icon: MessageCircle, label: ' Notification', link:'/patient-dashboard/notification' },
    ],
    facility: [
      { icon: Home, label: 'Overview' },
      { icon: Users, label: 'Staff' },
      { icon: BarChart, label: 'Monitoring' },
      { icon: Calendar, label: 'Schedule' },
    ],
  };

  const menuItems = { ...baseMenuItems };
  const userGender = user?.gender?.toLowerCase();
  
  if (userGender === 'female') {
    if (role === 'patient') {
      menuItems.patient = [
        ...baseMenuItems.patient.slice(0, 3),
        { icon: Calendar, label: 'Track Menstruation', link: '/patient-dashboard/menstruation' },
        ...baseMenuItems.patient.slice(3)
      ];
    } else if (role === 'doctor') {
      menuItems.doctor = [
        ...baseMenuItems.doctor.slice(0, 3),
        { icon: Calendar, label: 'Track Menstruation', link: '/doctor-dashboard/menstruation' },
        ...baseMenuItems.doctor.slice(3)
      ];
    }
  }

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
          setShowLogoutConfirm(false);
          navigate("/")
        }
    } catch (error) {
      console.error(error);
      setShowLogoutConfirm(false);
    }
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto z-50">
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
      <div className=" bg-gray-100  p-6 shadow-sm border border-gray-100">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg cursor-pointer"
        onClick={()=>navigate(`/${role}-dashboard/user-settings`)}>
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logoutHandler}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
      />
     
    </div>
    
  );
}

Sidebar.propTypes = {
  role: PropTypes.oneOf(['doctor', 'patient', 'facility']).isRequired,
  user: PropTypes.object
};

export default Sidebar;
