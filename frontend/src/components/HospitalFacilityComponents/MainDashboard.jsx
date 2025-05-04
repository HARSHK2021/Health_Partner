import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, Activity, Calendar, Home, Clipboard, Bell, UserPlus, PlusCircle, Search,
  Menu, X, ChevronDown, User, Hospital, Phone, Mail
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

// Mock data for various charts and tables
const patientTreatmentData = [
  { name: 'Cardiology', value: 340 },
  { name: 'Orthopedic', value: 280 },
  { name: 'Neurology', value: 200 },
  { name: 'Pediatrics', value: 260 },
  { name: 'Oncology', value: 180 },
];

const patientGenderData = [
  { name: 'Male', value: 540 },
  { name: 'Female', value: 620 },
  { name: 'Other', value: 40 },
];

const patientAgeData = [
  { name: '0-18', value: 120 },
  { name: '19-35', value: 250 },
  { name: '36-50', value: 310 },
  { name: '51-65', value: 280 },
  { name: '65+', value: 240 },
];

const monthlyPatientData = [
  { name: 'Jan', patients: 150 },
  { name: 'Feb', patients: 200 },
  { name: 'Mar', patients: 180 },
  { name: 'Apr', patients: 250 },
  { name: 'May', patients: 280 },
  { name: 'Jun', patients: 260 },
];

const weeklyAdmissionData = [
  { name: 'Mon', admissions: 28 },
  { name: 'Tue', admissions: 35 },
  { name: 'Wed', admissions: 42 },
  { name: 'Thu', admissions: 38 },
  { name: 'Fri', admissions: 30 },
  { name: 'Sat', admissions: 25 },
  { name: 'Sun', admissions: 20 },
];

const doctorsData = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    experience: '15 years',
    rating: 4.9,
    patients: 2500,
    education: 'Harvard Medical School',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@medcenter.com'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    experience: '12 years',
    rating: 4.8,
    patients: 1800,
    education: 'Johns Hopkins University',
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@medcenter.com'
  },
  {
    id: 3,
    name: 'Dr. Amelia Rodriguez',
    specialty: 'Pediatrics',
    experience: '10 years',
    rating: 4.9,
    patients: 3200,
    education: 'Stanford Medical School',
    phone: '+1 (555) 345-6789',
    email: 'amelia.rodriguez@medcenter.com'
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgery',
    experience: '18 years',
    rating: 4.7,
    patients: 2100,
    education: 'Yale School of Medicine',
    phone: '+1 (555) 456-7890',
    email: 'james.wilson@medcenter.com'
  },
];

const staffData = [
  { id: 1, name: 'Nina Patel', role: 'Head Nurse', department: 'Emergency', shift: 'Morning' },
  { id: 2, name: 'Robert Garcia', role: 'Nurse', department: 'ICU', shift: 'Night' },
  { id: 3, name: 'Jennifer Lee', role: 'Pharmacist', department: 'Pharmacy', shift: 'Day' },
  { id: 4, name: 'Thomas Wright', role: 'Lab Technician', department: 'Laboratory', shift: 'Evening' },
  { id: 5, name: 'Emma Johnson', role: 'Receptionist', department: 'Administration', shift: 'Day' },
];

const COLORS = ['#4F46E5', '#3B82F6', '#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#22C55E'];
const GENDER_COLORS = ['#3B82F6', '#EC4899', '#8B5CF6'];
const AGE_COLORS = ['#22D3EE', '#38BDF8', '#60A5FA', '#818CF8', '#A78BFA'];

export default function MedicalDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  
  // State for facility information
  const facilityInfo = {
    name: "Metropolitan Medical Center",
    address: "123 Healthcare Blvd, Medicity, MC 12345",
    specialization: "Multi-specialty tertiary care hospital",
    totalBeds: 500,
    occupiedBeds: 342,
    availableBeds: 158,
    totalStaff: 728,
    totalDoctors: 125,
    emergencyContacts: "+1 (555) 911-0000",
    email: "info@metropolitanmedical.com",
    website: "www.metropolitanmedical.com"
  };

  // Form state for new entries
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    experience: '',
    education: '',
    phone: '',
    email: ''
  });

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    department: '',
    shift: ''
  });

  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    reason: '',
    department: ''
  });

  // Form handlers
  const handleDoctorChange = (e) => {
    setNewDoctor({...newDoctor, [e.target.name]: e.target.value});
  };

  const handleStaffChange = (e) => {
    setNewStaff({...newStaff, [e.target.name]: e.target.value});
  };

  const handlePatientChange = (e) => {
    setNewPatient({...newPatient, [e.target.name]: e.target.value});
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send data to backend
    // For now, just close the modal
    setShowDoctorModal(false);
    alert('Doctor added successfully!');
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send data to backend
    // For now, just close the modal
    setShowStaffModal(false);
    alert('Staff member added successfully!');
  };

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send data to backend
    // For now, just close the modal
    setShowPatientModal(false);
    alert('Patient registered successfully!');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar role="facility" />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Hospital className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{facilityInfo.name}</h1>
                <p className="text-sm text-gray-500">{facilityInfo.specialization}</p>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('doctors')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'doctors' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Doctors
              </button>
              <button 
                onClick={() => setActiveTab('staff')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'staff' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Staff
              </button>
              <button 
                onClick={() => setActiveTab('patients')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'patients' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Patients
              </button>
            </nav>

            {/* Mobile menu button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden rounded-md p-2 text-gray-400 hover:bg-gray-100"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile nav */}
          {showMobileMenu && (
            <div className="md:hidden bg-white pb-3 px-4">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => {setActiveTab('dashboard'); setShowMobileMenu(false);}}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => {setActiveTab('doctors'); setShowMobileMenu(false);}}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'doctors' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Doctors
                </button>
                <button 
                  onClick={() => {setActiveTab('staff'); setShowMobileMenu(false);}}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'staff' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Staff
                </button>
                <button 
                  onClick={() => {setActiveTab('patients'); setShowMobileMenu(false);}}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'patients' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Patients
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Facility Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Beds</p>
                      <h3 className="text-2xl font-bold text-gray-900">{facilityInfo.totalBeds}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-blue-100 h-10 w-10 flex items-center justify-center">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex space-x-4">
                    <div>
                      <span className="text-xs text-gray-500">Available</span>
                      <p className="text-sm font-medium text-green-600">{facilityInfo.availableBeds}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Occupied</span>
                      <p className="text-sm font-medium text-red-600">{facilityInfo.occupiedBeds}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Doctors</p>
                      <h3 className="text-2xl font-bold text-gray-900">{facilityInfo.totalDoctors}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-indigo-100 h-10 w-10 flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Specialties</span>
                    <p className="text-sm font-medium text-gray-800">25+ medical specialties</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Staff</p>
                      <h3 className="text-2xl font-bold text-gray-900">{facilityInfo.totalStaff}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-teal-100 h-10 w-10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Departments</span>
                    <p className="text-sm font-medium text-gray-800">15 departments</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Patients (Monthly)</p>
                      <h3 className="text-2xl font-bold text-gray-900">1,200+</h3>
                    </div>
                    <div className="p-2 rounded-full bg-amber-100 h-10 w-10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Avg. Daily</span>
                    <p className="text-sm font-medium text-gray-800">~40 patients</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Patient Treatment Types */}
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Treatment Categories</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientTreatmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {patientTreatmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Patient Demographics */}
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Demographics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Gender Distribution</h4>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={patientGenderData}
                              cx="50%"
                              cy="50%"
                              outerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {patientGenderData.map((entry, index) => (
                                <Cell key={`gender-cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Age Distribution</h4>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={patientAgeData}
                              cx="50%"
                              cy="50%"
                              outerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {patientAgeData.map((entry, index) => (
                                <Cell key={`age-cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Monthly Trends */}
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Patient Trends</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyPatientData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="patients" stroke="#4F46E5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weekly Admissions */}
                <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Admissions</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyAdmissionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="admissions" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Facility Info Card */}
              <div className="bg-white rounded-lg shadow p-5 border border-gray-200 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Facility Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-base text-gray-900">{facilityInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-base text-gray-900">{facilityInfo.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Specialization</p>
                    <p className="text-base text-gray-900">{facilityInfo.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                    <p className="text-base text-gray-900">{facilityInfo.emergencyContacts}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base text-gray-900">{facilityInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <p className="text-base text-gray-900">{facilityInfo.website}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctors View */}
          {activeTab === 'doctors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Medical Staff - Doctors</h2>
                <button 
                  onClick={() => setShowDoctorModal(true)} 
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Add Doctor
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {doctorsData.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <div className="bg-indigo-50 p-4 flex justify-center">
                      <div className="h-24 w-24 rounded-full bg-white shadow-inner flex items-center justify-center border-2 border-indigo-100">
                        <User className="h-16 w-16 text-indigo-300" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                      <p className="text-indigo-600 font-medium">{doctor.specialty}</p>
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p><span className="font-medium">Experience:</span> {doctor.experience}</p>
                        <p><span className="font-medium">Education:</span> {doctor.education}</p>
                        <p><span className="font-medium">Patients:</span> {doctor.patients}+</p>
                        <p><span className="font-medium">Rating:</span> {doctor.rating}/5.0</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>Email</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Doctor Modal */}
              {showDoctorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Add New Doctor</h3>
                      <button onClick={() => setShowDoctorModal(false)} className="text-gray-400 hover:text-gray-500">
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleDoctorSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={newDoctor.name}
                            onChange={handleDoctorChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                          <input
                            type="text"
                            name="specialty"
                            value={newDoctor.specialty}
                            onChange={handleDoctorChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                          <input
                            type="text"
                            name="experience"
                            value={newDoctor.experience}
                            onChange={handleDoctorChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                          <input
                            type="text"
                            name="education"
                            value={newDoctor.education}
                            onChange={handleDoctorChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={newDoctor.phone}
                            onChange={handleDoctorChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={newDoctor.email}
                            onChange={handleDoctorChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowDoctorModal(false)}
                          className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Add Doctor
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Staff View */}
          {activeTab === 'staff' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Support Staff</h2>
                <button 
                  onClick={() => setShowStaffModal(true)}
                  className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Add Staff
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffData.map((staff) => (
                      <tr key={staff.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-teal-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-teal-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${staff.shift === 'Morning' ? 'bg-blue-100 text-blue-800' : 
                            staff.shift === 'Day' ? 'bg-green-100 text-green-800' : 
                            staff.shift === 'Evening' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-purple-100 text-purple-800'}`}>
                            {staff.shift}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Staff Modal */}
              {showStaffModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Add New Staff Member</h3>
                      <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-500">
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleStaffSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={newStaff.name}
                            onChange={handleStaffChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            name="role"
                            value={newStaff.role}
                            onChange={handleStaffChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <select
                            name="department"
                            value={newStaff.department}
                            onChange={handleStaffChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          >
                            <option value="">Select Department</option>
                            <option value="Emergency">Emergency</option>
                            <option value="ICU">ICU</option>
                            <option value="Pharmacy">Pharmacy</option>
                            <option value="Laboratory">Laboratory</option>
                            <option value="Administration">Administration</option>
                            <option value="Radiology">Radiology</option>
                            <option value="Surgery">Surgery</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                          <select
                            name="shift"
                            value={newStaff.shift}
                            onChange={handleStaffChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          >
                            <option value="">Select Shift</option>
                            <option value="Morning">Morning</option>
                            <option value="Day">Day</option>
                            <option value="Evening">Evening</option>
                            <option value="Night">Night</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowStaffModal(false)}
                          className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                        >
                          Add Staff
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Patients View */}
          {activeTab === 'patients' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Patient Management</h2>
                <button 
                  onClick={() => setShowPatientModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Register Patient
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-5 border border-gray-200 mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                    Filter
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                    Export
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: 'P-1001', name: 'Emma Thompson', age: 45, department: 'Cardiology', status: 'Admitted', date: '04/28/2025', doctor: 'Dr. Sarah Johnson' },
                        { id: 'P-1002', name: 'James Brown', age: 32, department: 'Orthopedic', status: 'Discharged', date: '04/25/2025', doctor: 'Dr. James Wilson' },
                        { id: 'P-1003', name: 'Olivia Martinez', age: 8, department: 'Pediatrics', status: 'Admitted', date: '05/01/2025', doctor: 'Dr. Amelia Rodriguez' },
                        { id: 'P-1004', name: 'William Davis', age: 67, department: 'Neurology', status: 'Critical', date: '04/30/2025', doctor: 'Dr. Michael Chen' },
                        { id: 'P-1005', name: 'Sophia Wilson', age: 52, department: 'Oncology', status: 'Stable', date: '04/29/2025', doctor: 'Dr. Sarah Johnson' },
                      ].map((patient, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                <div className="text-xs text-gray-500">Age: {patient.age}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${patient.status === 'Admitted' ? 'bg-blue-100 text-blue-800' : 
                              patient.status === 'Discharged' ? 'bg-green-100 text-green-800' : 
                              patient.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.doctor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">42</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>

              {/* Register Patient Modal */}
              {showPatientModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Register New Patient</h3>
                      <button onClick={() => setShowPatientModal(false)} className="text-gray-400 hover:text-gray-500">
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handlePatientSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newPatient.name}
                          onChange={handlePatientChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={newPatient.age}
                          onChange={handlePatientChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={newPatient.gender}
                          onChange={handlePatientChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                          type="text"
                          name="contact"
                          value={newPatient.contact}
                          onChange={handlePatientChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={newPatient.address}
                          onChange={handlePatientChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          name="department"
                          value={newPatient.department}
                          onChange={handlePatientChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Orthopedic">Orthopedic</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Oncology">Oncology</option>
                          <option value="Emergency">Emergency</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                        <input
                          type="text"
                          name="reason"
                          value={newPatient.reason}
                          onChange={handlePatientChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2 mt-2">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowPatientModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Register Patient
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                © 2025 {facilityInfo.name}. All rights reserved.
              </div>
              <div className="text-sm text-gray-500">
                <a href="#" className="hover:text-indigo-600">Privacy Policy</a> | <a href="#" className="hover:text-indigo-600">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}