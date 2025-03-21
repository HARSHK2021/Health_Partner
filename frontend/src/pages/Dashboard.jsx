import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar'
import DoctorDashboard from '../components/Dashboards/DoctorDashboard';
import UserDashboard from '../components/Dashboards/UserDashboard';
import FacilityDashboard from '../components/Dashboards/FacilityDashboard'

// Mock users for demonstration
const mockUsers = {
  doctor: {
    id: '1',
    name: 'John Smith',
    role: 'doctor',
    specialty: 'Cardiologist',
    stats: {
      patientsCount: 145,
      upcomingAppointments: 8,
      alerts: 3
    }
  },
  patient: {
    id: '2',
    name: 'Emily Johnson',
    role: 'patient',
    stats: {
      upcomingAppointments: 2
    }
  },
  facility: {
    id: '3',
    name: 'Central Hospital',
    role: 'facility',
    stats: {
      patientsCount: 248
    }
  }
};

function Dashboard() {
  const [currentRole, setCurrentRole] = useState('doctor');
  const currentUser = mockUsers[currentRole];

  const getDashboard = () => {
    switch (currentRole) {
      case 'doctor':
        return <DoctorDashboard user={currentUser} />;
      case 'patient':
        return <UserDashboard user={currentUser} />;
      case 'facility':
        return <FacilityDashboard user={currentUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={currentRole} />
      <div className="flex-1 p-6">
        {getDashboard()}
      </div>
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 space-y-2">
        <p className="text-sm font-medium text-gray-600">Demo Role Switcher</p>
        {['doctor', 'patient', 'facility'].map((role) => (
          <button
            key={role}
            onClick={() => setCurrentRole(role)}
            className={`block w-full px-4 py-2 text-sm rounded-md ${
              currentRole === role
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;