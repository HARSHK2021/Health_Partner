import React from "react";
import { Outlet } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import Sidebar from "../components/Sidebar/Sidebar";
const DoctorDashboard = () => {
  const { user } = React.useContext(UserDataContext);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="doctor" user={user} />
      <div className="flex-1 ">
        <div className="flex-1 bg-gray-100 ">
          <Outlet /> {/* Render the selected component here */}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;