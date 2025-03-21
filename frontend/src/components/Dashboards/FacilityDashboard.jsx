import React, { useState } from 'react';
import {
  Users,
  BedDouble,
  Activity,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Search,
  Plus,
  Bell,
  Calendar
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

const occupancyTrends = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Bed Occupancy Rate',
      data: [75, 82, 78, 85, 80, 85],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'ICU Occupancy Rate',
      data: [65, 75, 70, 85, 90, 85],
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    },
  ],
};

export default function FacilityDashboard({ user }) {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facility Overview</h1>
          <p className="text-gray-600">{user.name}</p>
        </div>
        <button
          onClick={() => setShowAddStaff(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      {/* Facility Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Patients</p>
              <h3 className="text-2xl font-bold">248</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BedDouble className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Available Beds</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600">ICU Capacity</p>
              <h3 className="text-2xl font-bold">85%</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600">Active Staff</p>
              <h3 className="text-2xl font-bold">124</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Occupancy Trends</h2>
          <Line
            data={occupancyTrends}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              Send Staff Alert
            </button>
            <button className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              View Schedule
            </button>
            <button className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3">
              <BedDouble className="w-5 h-5 text-blue-600" />
              Manage Beds
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Critical Alerts</h2>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                4 New
              </span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                title: 'ICU Bed Shortage',
                description: 'Only 2 ICU beds remaining',
                priority: 'high',
                time: '10 mins ago',
              },
              {
                title: 'Emergency Department Capacity',
                description: 'ED approaching maximum capacity',
                priority: 'medium',
                time: '25 mins ago',
              },
              {
                title: 'Blood Supply Alert',
                description: 'Low O-negative blood supply',
                priority: 'high',
                time: '1 hour ago',
              },
            ].map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <AlertCircle
                    className={`w-5 h-5 ${
                      alert.priority === 'high'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  />
                  <div>
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="text-sm text-gray-600">
                      {alert.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Department Performance</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                name: 'Emergency Department',
                patients: 45,
                efficiency: 92,
                trend: 'up',
              },
              {
                name: 'Cardiology',
                patients: 28,
                efficiency: 88,
                trend: 'up',
              },
              {
                name: 'Pediatrics',
                patients: 32,
                efficiency: 85,
                trend: 'down',
              },
            ]
              .filter((dept) =>
                dept.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <TrendingUp
                      className={`w-5 h-5 ${
                        dept.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    />
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      <p className="text-sm text-gray-600">
                        {dept.patients} patients
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{dept.efficiency}%</p>
                    <p className="text-sm text-gray-600">Efficiency</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showAddStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Staff Member</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Administrator</option>
                  <option>Technician</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Emergency</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Surgery</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaff(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}