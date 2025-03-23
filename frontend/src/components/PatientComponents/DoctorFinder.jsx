import { useState } from 'react';
import { Search } from 'lucide-react';

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    hospital: "Heart Care Center",
    phone: "555-0123",
    experience: "15 years",
    education: "MD - Cardiology, MBBS",
    availability: "Mon-Fri, 9AM-5PM",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    hospital: "Brain & Spine Institute",
    phone: "555-0124",
    experience: "12 years",
    education: "MD - Neurology, MBBS",
    availability: "Mon-Sat, 10AM-6PM",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300"
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    specialization: "Pediatrician",
    hospital: "Children's Medical Center",
    phone: "555-0125",
    experience: "10 years",
    education: "MD - Pediatrics, MBBS",
    availability: "Tue-Sun, 9AM-4PM",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300"
  }
];

export default function DoctorFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const filteredDoctors = doctors.filter(doctor => {
    const searchValue = searchTerm.toLowerCase();
    switch (filterBy) {
      case 'name':
        return doctor.name.toLowerCase().includes(searchValue);
      case 'specialization':
        return doctor.specialization.toLowerCase().includes(searchValue);
      case 'hospital':
        return doctor.hospital.toLowerCase().includes(searchValue);
      case 'phone':
        return doctor.phone.includes(searchValue);
      default:
        return true;
    }
  });

  if (selectedDoctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            <img
              src={selectedDoctor.image}
              alt={selectedDoctor.name}
              className="w-full md:w-1/3 h-64 md:h-auto object-cover"
            />
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">{selectedDoctor.name}</h2>
                  <p className="text-xl text-blue-600 mb-2">{selectedDoctor.specialization}</p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Hospital</h3>
                  <p className="text-gray-900">{selectedDoctor.hospital}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
                  <p className="text-gray-900">{selectedDoctor.phone}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Experience</h3>
                  <p className="text-gray-900">{selectedDoctor.experience}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Education</h3>
                  <p className="text-gray-900">{selectedDoctor.education}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Availability</h3>
                  <p className="text-gray-900">{selectedDoctor.availability}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Rating</h3>
                  <p className="text-gray-900">{selectedDoctor.rating}/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar with Filter Option */}
      <div className="mb-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Find a Doctor</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctors..."
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
            />
            <Search  className="h-6 w-6 text-gray-400 absolute left-4 top-4" />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors duration-200"
          >
            <option value="name">By Name</option>
            <option value="specialization">By Specialization</option>
            <option value="hospital">By Hospital</option>
            <option value="phone">By Phone</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            onClick={() => setSelectedDoctor(doctor)}
            className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{doctor.name}</h3>
              <p className="text-blue-600 mb-3">{doctor.specialization}</p>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <span className="w-4 h-4 mr-2">🏥</span>
                  {doctor.hospital}
                </p>
                <p className="text-gray-600 flex items-center">
                  <span className="w-4 h-4 mr-2">📞</span>
                  {doctor.phone}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}