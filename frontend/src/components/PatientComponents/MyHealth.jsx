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
  WeightIcon,
  RulerIcon,
  ChartCandlestickIcon,
  ChartColumnStackedIcon,
  Video,
  MapPin,
  Link,
  X,
  AlertTriangle,
  CalendarClock,
  Check
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import WeightChart from "./WeightChart";
import ConditionChart from "./ConditionChart";
import { UserDataContext } from "../../context/UserContext";
import BMIChart from "./BMIChart";
import axios from "axios";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";
const host = `${import.meta.env.VITE_BASE_URL}`;

const MyHealth = () => {
  const { user, setUser } = React.useContext(UserDataContext);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Appointment booking states
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [consultationMode, setConsultationMode] = useState('offline');
  const [meetingLink, setMeetingLink] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  
  // Upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Reschedule states
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [isRescheduling, setIsRescheduling] = useState(false);
  
  // Cancel states
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Meeting link edit state
  const [editingMeetingLink, setEditingMeetingLink] = useState(false);
  const [newMeetingLink, setNewMeetingLink] = useState('');
  const [isSavingLink, setIsSavingLink] = useState(false);

  const weightData = user.weightData;
  const bmiData = user.bmiRecords;
  const latestBmi = user.bmiRecords[user.bmiRecords.length - 1]?.bmi;

  // Fetch doctors when modal opens
  useEffect(() => {
    if (showBookAppointment) {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/doctor/all-doctors`
          );
          if (response.data && Array.isArray(response.data.doctors)) {
            setDoctors(response.data.doctors);
          }
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };
      fetchDoctors();
    }
  }, [showBookAppointment]);

  // Fetch available slots when doctor and date change
  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      const fetchSlots = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/patient/appointments/slots?doctorId=${selectedDoctor}&date=${appointmentDate}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          if (response.data && response.data.availableSlots) {
            setAvailableSlots(response.data.availableSlots);
            setAppointmentTime(''); // Reset time when date changes
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
          setAvailableSlots([]);
        }
      };
      fetchSlots();
    }
  }, [selectedDoctor, appointmentDate]);

  // Handle appointment booking
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/appointments/book`,
        {
          doctorId: selectedDoctor,
          appointmentDate: appointmentDate,
          appointmentTime: appointmentTime,
          reason: appointmentReason || 'General checkup',
          consultationMode: consultationMode,
          meetingLink: consultationMode === 'online' ? meetingLink : null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data && response.data.appointment) {
        // Close modal and reset form
        setShowBookAppointment(false);
        setSelectedDoctor('');
        setAppointmentDate('');
        setAppointmentTime('');
        setAppointmentReason('');
        setConsultationMode('offline');
        setMeetingLink('');
        // Refresh appointments list
        const appointmentsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/appointments?status=scheduled`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data.appointments)) {
          const now = new Date();
          const futureAppointments = appointmentsResponse.data.appointments
            .filter(apt => new Date(apt.appointmentDate) >= now)
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
          setUpcomingAppointments(futureAppointments);
        }
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  // Handle reschedule
  const handleReschedule = async (e) => {
    e.preventDefault();
    
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select a new date and time');
      return;
    }

    setIsRescheduling(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/patient/appointments/${selectedAppointment._id}/reschedule`,
        {
          newDate: rescheduleDate,
          newTime: rescheduleTime
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data && response.data.appointment) {
        setShowReschedule(false);
        setRescheduleDate('');
        setRescheduleTime('');
        setSelectedAppointment(response.data.appointment);
        // Refresh appointments list
        const appointmentsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/appointments?status=scheduled`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data.appointments)) {
          const now = new Date();
          const futureAppointments = appointmentsResponse.data.appointments
            .filter(apt => new Date(apt.appointmentDate) >= now)
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
          setUpcomingAppointments(futureAppointments);
        }
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert(error.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setIsRescheduling(false);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/patient/appointments/${selectedAppointment._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: {
            cancellationReason: cancellationReason || 'Patient requested cancellation'
          }
        }
      );

      setShowCancelConfirm(false);
      setCancellationReason('');
      setSelectedAppointment(null);
      // Refresh appointments list
      const appointmentsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/patient/appointments?status=scheduled`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data.appointments)) {
        const now = new Date();
        const futureAppointments = appointmentsResponse.data.appointments
          .filter(apt => new Date(apt.appointmentDate) >= now)
          .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        setUpcomingAppointments(futureAppointments);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle meeting link update
  const handleSaveMeetingLink = async () => {
    setIsSavingLink(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/patient/appointments/${selectedAppointment._id}/meeting-link`,
        {
          meetingLink: newMeetingLink
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data && response.data.appointment) {
        setSelectedAppointment(response.data.appointment);
        setEditingMeetingLink(false);
        setNewMeetingLink('');
        // Refresh appointments list
        const appointmentsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/appointments?status=scheduled`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data.appointments)) {
          const now = new Date();
          const futureAppointments = appointmentsResponse.data.appointments
            .filter(apt => new Date(apt.appointmentDate) >= now)
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
          setUpcomingAppointments(futureAppointments);
        }
      }
    } catch (error) {
      console.error('Error updating meeting link:', error);
      alert(error.response?.data?.message || 'Failed to update meeting link');
    } finally {
      setIsSavingLink(false);
    }
  };

  // Fetch reschedule slots
  useEffect(() => {
    if (showReschedule && selectedAppointment && rescheduleDate) {
      const fetchSlots = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/patient/appointments/slots?doctorId=${selectedAppointment.doctor._id}&date=${rescheduleDate}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          if (response.data && response.data.availableSlots) {
            setRescheduleSlots(response.data.availableSlots);
            setRescheduleTime('');
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
          setRescheduleSlots([]);
        }
      };
      fetchSlots();
    }
  }, [showReschedule, selectedAppointment, rescheduleDate]);

  //fetch active meditation
  useEffect(() => {
    const fetchActiveMedication = async () => {
      try {
        const response = await axios.get(
          `${host}/patient/activeMedicine/${user._id}`
        );
        setUser((prevUser) => ({
          ...prevUser,
          activeMedication: response.data.activeMedication,
        }));
      } catch (error) {
        console.error("Error fetching active medication:", error);
      }
    };

    fetchActiveMedication();
  }, []);

  // Fetch upcoming appointments
  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/appointments?status=scheduled`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.data && Array.isArray(response.data.appointments)) {
          // Filter for future appointments only
          const now = new Date();
          const futureAppointments = response.data.appointments
            .filter(apt => new Date(apt.appointmentDate) >= now)
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
          setUpcomingAppointments(futureAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchUpcomingAppointments();
  }, []);

  return (
    <div className="p-5">
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user.firstName}
        </h1>
        <p className="text-gray-600">Your health dashboard</p>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white flex justify-between rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Weight */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <WeightIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">Weight</p>
              <h3 className="text-lg font-bold">{user.weight} kg</h3>
            </div>
          </div>

          {/* Height */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <RulerIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">Height</p>
              <h3 className="text-lg font-bold">{user.height} cm</h3>
            </div>
          </div>

          {/* BMI */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartColumnStackedIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">BMI</p>
              <h3 className="text-lg font-bold">{latestBmi}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">BloodGroup</p>
              <h3 className="text-xl font-bold">A+</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Pills className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Medications</p>
              <h3 className="text-2xl font-bold">{user.activeMedication}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
          <ConditionChart />
        </div>
        <div className="flex flex-col gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Weight Trends</h2>
            <WeightChart data={weightData} />
          </div>
          <div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4"> BMI Trends</h2>
              <BMIChart data={bmiData} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              <button
                onClick={() => setShowBookAppointment(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Book New
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {loadingAppointments ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => {
                const doctorName = appointment.doctor?.firstName && appointment.doctor?.lastName 
                  ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                  : 'Doctor';
                const appointmentDate = new Date(appointment.appointmentDate);
                const formattedDate = appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                return (
                  <div
                    key={appointment._id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{doctorName}</h3>
                        <p className="text-sm text-gray-600">{appointment.reason || 'General Checkup'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-sm text-gray-600">{appointment.appointmentTime}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Medication Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Today&apos;s Medications</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                name: "Lisinopril",
                dosage: "10mg",
                time: "8:00 AM",
                status: "taken",
              },
              {
                name: "Metformin",
                dosage: "500mg",
                time: "2:00 PM",
                status: "upcoming",
              },
            ].map((medication, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium"> medine name</h3>
                    <p className="text-sm text-gray-600">medinuce dose </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">medicine time </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      medication.status === "taken"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {medication.status.charAt(0).toUpperCase() +
                      medication.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBookAppointment && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
                </div>
                <button
                  onClick={() => setShowBookAppointment(false)}
                  className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleBookAppointment} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                <select 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-0 px-4 py-3 bg-gray-50 transition-colors"
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-0 px-4 py-3 bg-gray-50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-0 px-4 py-3 bg-gray-50 transition-colors"
                    required
                    disabled={!selectedDoctor || !appointmentDate}
                  >
                    <option value="">Select time...</option>
                    {availableSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Consultation Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationMode('offline')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      consultationMode === 'offline' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">In-Person</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationMode('online')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      consultationMode === 'online' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span className="font-medium">Online</span>
                  </button>
                </div>
              </div>

              {consultationMode === 'online' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting Link <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Link className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-0 pl-12 pr-4 py-3 bg-gray-50 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">You can add this later if not available now</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-0 px-4 py-3 bg-gray-50 transition-colors resize-none"
                  rows="3"
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookAppointment(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBooking}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Book Appointment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && !showReschedule && !showCancelConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">Appointment Details</h2>
                  <p className="text-blue-100">
                    with Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedAppointment.status === 'scheduled' ? 'bg-green-400/20 text-green-100' :
                  selectedAppointment.status === 'completed' ? 'bg-blue-400/20 text-blue-100' :
                  selectedAppointment.status === 'cancelled' ? 'bg-red-400/20 text-red-100' :
                  'bg-gray-400/20 text-gray-100'
                }`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Date & Time Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Date & Time</h3>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedAppointment.appointmentTime}</p>
                </div>

                {/* Consultation Mode Card */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      {selectedAppointment.consultationMode === 'online' ? (
                        <Video className="w-5 h-5 text-purple-600" />
                      ) : (
                        <MapPin className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800">Consultation Mode</h3>
                  </div>
                  <p className="text-lg font-semibold text-purple-700 capitalize">
                    {selectedAppointment.consultationMode === 'online' ? 'Online Consultation' : 'In-Person Visit'}
                  </p>
                  {selectedAppointment.consultationMode !== 'online' && selectedAppointment.location && (
                    <p className="text-gray-600 text-sm mt-1">{selectedAppointment.location}</p>
                  )}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-5 rounded-xl border border-blue-200 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                    👨‍⚕️
                  </div>
                  <h3 className="font-semibold text-gray-800">Doctor Information</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {selectedAppointment.doctor?.email && (
                    <span className="flex items-center gap-1">
                      📧 {selectedAppointment.doctor.email}
                    </span>
                  )}
                  {selectedAppointment.doctor?.phone && (
                    <span className="flex items-center gap-1">
                      📱 {selectedAppointment.doctor.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Reason */}
              {selectedAppointment.reason && (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      📝
                    </div>
                    <h3 className="font-semibold text-gray-800">Reason for Visit</h3>
                  </div>
                  <p className="text-gray-700">{selectedAppointment.reason}</p>
                </div>
              )}

              {/* Meeting Link Section for Online Consultations */}
              {selectedAppointment.consultationMode === 'online' && selectedAppointment.status === 'scheduled' && (
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-5 rounded-xl border border-indigo-200 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Meeting Link</h3>
                    </div>
                    {!editingMeetingLink && (
                      <button
                        onClick={() => {
                          setEditingMeetingLink(true);
                          setNewMeetingLink(selectedAppointment.meetingLink || '');
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {selectedAppointment.meetingLink ? 'Edit' : 'Add Link'}
                      </button>
                    )}
                  </div>
                  
                  {editingMeetingLink ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <Link className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={newMeetingLink}
                          onChange={(e) => setNewMeetingLink(e.target.value)}
                          placeholder="https://meet.google.com/..."
                          className="w-full rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 pl-10 pr-4 py-2 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingMeetingLink(false);
                            setNewMeetingLink('');
                          }}
                          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveMeetingLink}
                          disabled={isSavingLink}
                          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-400 flex items-center gap-2"
                        >
                          {isSavingLink ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : 'Save Link'}
                        </button>
                      </div>
                    </div>
                  ) : selectedAppointment.meetingLink ? (
                    <a 
                      href={selectedAppointment.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium bg-white px-4 py-2 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">No meeting link added yet. Click "Add Link" to add one.</p>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Additional Notes</h3>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedAppointment.status === 'scheduled' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowReschedule(true);
                      setRescheduleDate('');
                      setRescheduleTime('');
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <CalendarClock className="w-5 h-5" />
                    Reschedule
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              )}

              {selectedAppointment.status !== 'scheduled' && (
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showReschedule && selectedAppointment && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Reschedule Appointment</h2>
                  <p className="text-amber-100 text-sm">Select a new date and time</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleReschedule} className="p-6 space-y-5">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600">Current Appointment:</p>
                <p className="font-semibold text-gray-800">
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })} at {selectedAppointment.appointmentTime}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-amber-500 focus:ring-0 px-4 py-3 bg-gray-50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Time <span className="text-red-500">*</span>
                </label>
                <select 
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-amber-500 focus:ring-0 px-4 py-3 bg-gray-50 transition-colors"
                  required
                  disabled={!rescheduleDate}
                >
                  <option value="">Select time...</option>
                  {rescheduleSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {rescheduleDate && rescheduleSlots.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No available slots for this date</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReschedule(false);
                    setRescheduleDate('');
                    setRescheduleTime('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isRescheduling || !rescheduleDate || !rescheduleTime}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isRescheduling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Rescheduling...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && selectedAppointment && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Cancel Appointment</h2>
                  <p className="text-red-100 text-sm">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-sm text-red-700 mb-2">You are about to cancel your appointment:</p>
                <p className="font-semibold text-gray-800">
                  Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })} at {selectedAppointment.appointmentTime}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Cancellation <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-red-500 focus:ring-0 px-4 py-3 bg-gray-50 transition-colors resize-none"
                  rows="3"
                  placeholder="Let us know why you're cancelling..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancellationReason('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-400 font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      Cancel Appointment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHealth;
