import { useState } from "react";
import { Search } from "lucide-react";

const hospitals = [
  {
    id: 1,
    name: "City Health Hospital",
    address: "123 Main Street, Aukat Ke Bahar",
    phone: "555-1001",
    departments: "Emergency, Cardiology, Orthopedics",
    facilities: "24/7 Emergency, ICU, Pharmacy",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300",
  },
  {
    id: 2,
    name: "Green Valley Medical Center",
    address: "456, Eta Park Nearby Eww Complex, Bombay",
    phone: "555-1002",
    departments: "Pediatrics, Neurology, Oncology",
    facilities: "Ambulance Service, Laboratory, Radiology",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300",
  },
  {
    id: 3,
    name: "Sunrise & Sunshine Care Clinic",
    address: "789, Sunshine Road, New Delhi",
    phone: "555-1003",
    departments: "General Medicine, Dentistry, Dermatology",
    facilities: "Walk-in Clinic, Pharmacy, Outpatient Services",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300",
  },
];

export default function HospitalFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [selectedHospital, setSelectedHospital] = useState(null);

  const filteredHospitals = hospitals.filter((hospital) => {
    const searchValue = searchTerm.toLowerCase();
    switch (filterBy) {
      case "name":
        return hospital.name.toLowerCase().includes(searchValue);
      case "address":
        return hospital.address.toLowerCase().includes(searchValue);
      case "phone":
        return hospital.phone.includes(searchValue);
      default:
        return true;
    }
  });

  if (selectedHospital) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            <img
              src={selectedHospital.image}
              alt={selectedHospital.name}
              className="w-full md:w-1/3 h-64 md:h-auto object-cover"
            />
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    {selectedHospital.name}
                  </h2>
                  <p className="text-xl text-blue-600 mb-2">
                    {selectedHospital.address}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Phone</h3>
                  <p className="text-gray-900">{selectedHospital.phone}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Departments
                  </h3>
                  <p className="text-gray-900">
                    {selectedHospital.departments}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Facilities
                  </h3>
                  <p className="text-gray-900">{selectedHospital.facilities}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Rating</h3>
                  <p className="text-gray-900">{selectedHospital.rating}/5</p>
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
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Find Nearby Hospitals
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hospitals..."
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
            />
            <Search className="h-6 w-6 text-gray-400 absolute left-4 top-4" />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors duration-200"
          >
            <option value="name">By Name</option>
            <option value="address">By Address</option>
            <option value="phone">By Phone</option>
          </select>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital.id}
            onClick={() => setSelectedHospital(hospital)}
            className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {hospital.name}
              </h3>
              <p className="text-blue-600 mb-3">{hospital.address}</p>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <span className="w-4 h-4 mr-2">📞</span>
                  {hospital.phone}
                </p>
                <p className="text-gray-600 flex items-center">
                  <span className="w-4 h-4 mr-2">🏥</span>
                  {hospital.departments.split(",")[0]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
