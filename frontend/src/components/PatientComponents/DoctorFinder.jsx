import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

export default function DoctorFinder() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [page, setPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setError(null);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        params.append('page', page);
        params.append('limit', 10);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/v1/doctor/all-doctors?${params}`
        );

        // Check if doctors array exists in response
        if (response.data && Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
          setFilteredDoctors(response.data.doctors);
          setTotalDoctors(response.data.total || 0);
          setError(null);
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.response?.data?.message || 'Failed to fetch doctors');
      }
    };

    const timeoutId = setTimeout(fetchDoctors, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page]);

  // Detailed Doctor View
  if (selectedDoctor) {
    const fullName = `${selectedDoctor.firstName || ''} ${selectedDoctor.lastName || ''}`.trim();
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            {selectedDoctor.profileImage && (
              <img
                src={selectedDoctor.profileImage}
                alt={fullName}
                className="w-full md:w-1/3 h-64 md:h-auto object-cover bg-gray-200"
              />
            )}
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">Dr. {fullName}</h2>
                  <p className="text-xl text-blue-600 mb-2">Healthcare Professional</p>
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
                  <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
                  <p className="text-gray-900">{selectedDoctor.email || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-gray-700 mb-2">Phone</h3>
                  <p className="text-gray-900">{selectedDoctor.phone || 'N/A'}</p>
                </div>
                {selectedDoctor.address && (
                  <div className="bg-gray-50 p-6 rounded-xl shadow-inner md:col-span-2">
                    <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
                    <p className="text-gray-900">{selectedDoctor.address}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedDoctor(null)}
                className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Doctor List View
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Find a Doctor</h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on new search
            }}
            placeholder="Search by name or email..."
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
          />
          <Search className="h-6 w-6 text-gray-400 absolute left-4 top-4" />
        </div>
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No doctors found. Try a different search.</p>
        </div>
      )}

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => {
          const fullName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
          return (
            <div
              key={doctor._id}
              onClick={() => setSelectedDoctor(doctor)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={fullName}
                  className="w-full h-56 object-cover bg-gray-200"
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                  <span className="text-white text-4xl">👨‍⚕️</span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Dr. {fullName}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <span>📧</span>
                  {doctor.email}
                </p>
                {doctor.phone && (
                  <p className="text-gray-600 flex items-center gap-2 mt-2">
                    <span>📞</span>
                    {doctor.phone}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalDoctors > 10 && (
        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
            Page {page} of {Math.ceil(totalDoctors / 10)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(totalDoctors / 10)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}