import React, { useState, useEffect, useContext } from 'react';
import { Shield, UserX, User, Check, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { CMH_ROUTES } from '../../cmhRoutes/cmh.routes';
import { toast } from 'react-hot-toast';
import { UserDataContext } from '../../context/UserContext';

const AccessControl = () => {
  const { user } = useContext(UserDataContext);
  const [accessRequests, setAccessRequests] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get access requests
      const requestsResponse = await axios.get(CMH_ROUTES.GET_ACCESS_REQUESTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Get doctors with access
      const doctorsResponse = await axios.get(CMH_ROUTES.GET_DOCTORS_WITH_ACCESS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setAccessRequests(requestsResponse.data.requests.filter(r => r.status === 'pending'));
      setApprovedDoctors(doctorsResponse.data.doctors);
    } catch (err) {
      console.error('Error fetching access data:', err);
      setError('Failed to load access requests and permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResponseToRequest = async (doctorId, granted) => {
    try {
      await axios.post(
        CMH_ROUTES.RESPOND_TO_ACCESS_REQUEST,
        { doctorId, granted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      toast.success(`Request ${granted ? 'approved' : 'denied'} successfully`);
      // Refresh the data
      fetchData();
    } catch (err) {
      console.error('Error responding to request:', err);
      toast.error('Failed to process request');
    }
  };

  const handleRevokeAccess = async (doctorId) => {
    try {
      await axios.post(
        CMH_ROUTES.REVOKE_ACCESS,
        { doctorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Access revoked successfully');
      fetchData();
    } catch (err) {
      console.error('Error revoking access:', err);
      toast.error('Failed to revoke access');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-center gap-3">
          <AlertCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Data Access Control</h1>
      </div>
      
      <p className="text-gray-600 mb-8">
        Manage which healthcare providers can access your medical records
      </p>
      {/* Pending Access Requests */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Access Requests</h2>
        
        {accessRequests.length === 0 ? (
          <p className="text-gray-500">No pending access requests</p>
        ) : (
          <div className="space-y-4">
            {accessRequests.map((request) => (
              <div key={request.doctor._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      Dr. {request.doctor.firstName} {request.doctor.lastName}
                    </h3>
                    <p className="text-gray-600">{request.doctor.doctorProfile?.specialization || "Doctor"}</p>
                    <p className="text-sm text-gray-500">{request.doctor.email}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResponseToRequest(request.doctor._id, false)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      title="Deny access"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={() => handleResponseToRequest(request.doctor._id, true)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      title="Approve access"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Approved Doctors */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Doctors With Access</h2>
        
        {approvedDoctors.length === 0 ? (
          <p className="text-gray-500">No doctors currently have access to your records</p>
        ) : (
          <div className="space-y-4">
            {approvedDoctors.map((doctor) => (
              <div key={doctor._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {doctor.profileImage ? (
                      <img 
                        src={doctor.profileImage} 
                        alt={doctor.firstName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={24} className="text-blue-600" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-gray-600">{doctor.doctorProfile?.specialization || "Doctor"}</p>
                      <p className="text-sm text-gray-500">{doctor.email}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRevokeAccess(doctor._id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <UserX size={16} />
                    Revoke Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessControl;