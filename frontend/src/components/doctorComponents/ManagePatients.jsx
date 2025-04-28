import React, { useState, useEffect } from 'react';
import { Search, UserPlus, AlertCircle, Check, X, Clock } from 'lucide-react';
import axios from 'axios';
import { CMH_ROUTES } from '../../cmhRoutes/cmh.routes';
import { toast } from 'react-hot-toast';

const ManagePatients = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientFound, setPatientFound] = useState(null);
  const [requestStatus, setRequestStatus] = useState('none'); // none, pending, approved, denied
  const [myPatients, setMyPatients] = useState([]);
  const token = localStorage.getItem('token');
  // Fetch patients the doctor has access to
  const fetchMyPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CMH_ROUTES.GET_MY_PATIENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyPatients(response.data.patients);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };
  // On component mount, fetch the doctor's patients
  useEffect(() => {
    fetchMyPatients();
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(CMH_ROUTES.SEARCH_PATIENT_BY_EMAIL, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setPatientFound(response.data.patient);
      
      // Check if we already have access or have a pending request
      if (response.data.patient._id) {
        const accessResponse = await axios.get(
          `${CMH_ROUTES.CHECK_ACCESS}/${response.data.patient._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequestStatus(accessResponse.data.requestStatus);
      }
    } catch (err) {
      console.error('Error searching patient:', err);
      setError(err.response?.data?.message || 'Failed to search for patient');
      setPatientFound(null);
    } finally {
      setLoading(false);
    }
  };

  const requestAccess = async () => {
    if (!patientFound) return;
    
    try {
      setLoading(true);
      const response = await axios.post(
        CMH_ROUTES.REQUEST_ACCESS,
        { patientEmail: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      setRequestStatus('pending');
      toast.success('Access request sent successfully');
    } catch (err) {
      console.error('Error requesting access:', err);
      toast.error(err.response?.data?.message || 'Failed to request access');
    } finally {
      setLoading(false);
    }
  };

  const viewPatientDetails = async (patientId) => {
    window.location.href = `/doctor-dashboard/patient/${patientId}`;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Patients</h1>
      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Find Patient</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="email"
              placeholder="Search by patient email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {/* Patient Found Card */}
        {patientFound && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{patientFound.firstName} {patientFound.lastName}</h3>
                <p className="text-gray-600">{patientFound.email}</p>
              </div>
              
              {requestStatus === 'none' && (
                <button
                  onClick={requestAccess}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <UserPlus size={16} />
                  Request Access
                </button>
              )}
              {requestStatus === 'pending' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                  <Clock size={16} />
                  Request Pending
                </div>
              )}
              
              {requestStatus === 'approved' && (
                <button
                  onClick={() => viewPatientDetails(patientFound._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Check size={16} />
                  View Records
                </button>
              )}
              
              {requestStatus === 'denied' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                  <X size={16} />
                  Access Denied
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* My Patients List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">My Patients</h2>
        
        {loading && <p className="text-gray-500">Loading patients...</p>}
        
        {!loading && myPatients.length === 0 && (
          <p className="text-gray-500">You don't have any patients yet</p>
        )}
        
        {myPatients.length > 0 && (
          <div className="grid gap-4">
            {myPatients.map((patient) => (
              <div 
                key={patient._id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => viewPatientDetails(patient._id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{patient.firstName} {patient.lastName}</h3>
                    <p className="text-gray-600">{patient.email}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePatients;
