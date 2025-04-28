import { useEffect, useState } from "react";
import { Search } from "lucide-react";
const host = `${import.meta.env.VITE_BASE_URL}`;

export default function HospitalFinder() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Get user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
    });
  }, []);

  // Fetch nearby hospitals based on geolocation
  useEffect(() => {
    if (latitude && longitude) {
      const fetchNearbyHospitals = async () => {
        try {
          const response = await fetch(
            `${host}/user/nearByHospital?latitude=${latitude}&longitude=${longitude}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          setNearbyHospitals(data.hospitals);
        } catch (error) {
          console.error("Error fetching nearby hospitals:", error);
        }
      };
      fetchNearbyHospitals();
    }
  }, [latitude, longitude]);

  // Search hospitals in the database
  useEffect(() => {
    if (searchTerm) {
      const fetchSearchedHospitals = async () => {
        try {
          const response = await fetch(
            `${host}/user/searchHospital?searchTerm=${searchTerm}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          setFilteredHospitals(data.hospitals); // Update the filtered hospitals with the search results
        } catch (error) {
          console.error("Error fetching searched hospitals:", error);
        }
      };
      fetchSearchedHospitals();
    } else {
      setFilteredHospitals(nearbyHospitals); // Reset filtered hospitals to nearby hospitals if no search term
    }
  }, [searchTerm, nearbyHospitals]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle hospital selection
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
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search hospitals..."
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
          />
          <Search className="h-6 w-6 text-gray-400 absolute left-4 top-4" />
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHospitals.length ? (
          filteredHospitals.map((hospital) => (
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
              </div>
            </div>
          ))
        ) : (
          <p>No hospitals found</p>
        )}
      </div>
    </div>
  );
}
