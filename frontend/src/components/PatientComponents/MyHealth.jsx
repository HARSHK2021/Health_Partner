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
} from "lucide-react";
import React, { useState } from "react";

import { format } from "date-fns";
import WeightChart from "./WeightChart";
import ConditionChart from "./ConditionChart";
import MedicalRecordsList from "./MedicalRecordsList";
import { UserDataContext } from "../../context/UserContext";
import BMIChart from "./BMIChart";

const weightData = [
  { date: "2024-01-01", weight: 68 },
  { date: "2024-02-01", weight: 69 },
  { date: "2024-03-01", weight: 70 },
  { date: "2024-04-01", weight: 72 },
  { date: "2024-05-01", weight: 71 },
  { date: "2024-06-01", weight: 73 },
];
const sampleMedicalRecords = [
  {
    _id: "1",
    condition: "Diabetes",
    symptoms: ["Frequent urination", "Increased thirst"],
    dateDiagnosed: "2024-01-10T00:00:00.000Z",
    recoveryStatus: "ongoing",
    medicines: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice a day",
        duration: "30 days",
        takenAt: ["2024-01-10T08:00:00.000Z", "2024-01-10T20:00:00.000Z"],
      },
    ],
    doctor: "Dr. John Doe",
    hospital: "City General Hospital",
    pharmacy: "HealthPlus Pharmacy",
    prescriptionImages: ["https://via.placeholder.com/150"],
    medicalReports: ["https://via.placeholder.com/150"],
    additionalNotes: "Patient should maintain a healthy diet and exercise.",
    createdAt: "2024-01-10T12:00:00.000Z",
  },
  {
    _id: "2",
    condition: "Hypertension",
    symptoms: ["Headache", "Dizziness", "Blurred vision"],
    dateDiagnosed: "2024-02-05T00:00:00.000Z",
    recoveryStatus: "ongoing",
    medicines: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once a day",
        duration: "60 days",
        takenAt: ["2024-02-05T09:00:00.000Z"],
      },
    ],
    doctor: "Dr. Emily Clark",
    hospital: "Metro Care Clinic",
    pharmacy: "Wellness Pharmacy",
    prescriptionImages: [],
    medicalReports: [],
    additionalNotes: "Monitor blood pressure regularly.",
    createdAt: "2024-02-05T10:30:00.000Z",
  },
  {
    _id: "3",
    condition: "Asthma",
    symptoms: ["Shortness of breath", "Coughing", "Wheezing"],
    dateDiagnosed: "2024-03-15T00:00:00.000Z",
    recoveryStatus: "recovered",
    medicines: [
      {
        name: "Albuterol Inhaler",
        dosage: "90mcg",
        frequency: "As needed",
        duration: "As required",
        takenAt: [],
      },
    ],
    doctor: "Dr. Sarah Lee",
    hospital: "Greenwood Medical Center",
    pharmacy: "MediTrust Pharmacy",
    prescriptionImages: ["https://via.placeholder.com/150"],
    medicalReports: ["https://via.placeholder.com/150"],
    additionalNotes: "Avoid triggers like dust and cold air.",
    createdAt: "2024-03-15T14:45:00.000Z",
  },
];
const conditionData = [
  { condition: "Diabetes", date: "2024-01-10" },
  { condition: "Hypertension", date: "2024-02-05" },
  { condition: "Asthma", date: "2024-03-15" },
  { condition: "Flu", date: "2024-03-20" },
  { condition: "COVID-19", date: "2024-04-01" },
  { condition: "Heart Disease", date: "2024-05-10" },
  { condition: "Flu", date: "2024-05-15" },
  { condition: "Hypertension", date: "2024-06-01" },
];
const bmiData = [
  { date: "2024-01-01", bmi: 22.5 },
  { date: "2024-02-01", bmi: 23.1 },
  { date: "2024-03-01", bmi: 22.8 },
  { date: "2024-04-01", bmi: 23.4 },
  { date: "2024-05-01", bmi: 22.9 },
  { date: "2024-06-01", bmi: 23.2 },
  { date: "2024-07-01", bmi: 23.0 },
  { date: "2024-08-01", bmi: 23.5 },
  { date: "2024-09-01", bmi: 22.7 },
  { date: "2024-10-01", bmi: 22.6 },
  { date: "2024-11-01", bmi: 23.3 },
  { date: "2024-12-01", bmi: 23.1 },
];
const MyHealth = () => {
  const { user, setUser } = React.useContext(UserDataContext);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
              <h3 className="text-lg font-bold">{user.height} ft</h3>
            </div>
          </div>

          {/* BMI */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartColumnStackedIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">BMI</p>
              <h3 className="text-lg font-bold">{user.bodyMassIndex}</h3>
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
              <h3 className="text-2xl font-bold">2 Active</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
          <ConditionChart data={conditionData} />
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Book New
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                doctor: "Dr. Sarah Wilson",
                specialty: "Cardiologist",
                date: "2024-03-20",
                time: "10:00 AM",
              },
              {
                doctor: "Dr. Michael Brown",
                specialty: "General Physician",
                date: "2024-03-25",
                time: "2:30 PM",
              },
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium"> doctor kanak </h3>
                    <p className="text-sm text-gray-600">cardio serugen</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">10/2/1000</p>
                  <p className="text-sm text-gray-600">10:20</p>
                </div>
              </div>
            ))}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Cardiology</option>
                  <option>General Medicine</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>02:00 PM</option>
                  <option>03:00 PM</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookAppointment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <MedicalRecordsList records={sampleMedicalRecords} />
    </div>
  );
};

export default MyHealth;
