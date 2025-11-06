import React, { useState, useEffect } from 'react';
import { labtechService } from '../../services/api';
import { toast } from 'react-toastify';
import { BeakerIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const PatientLabAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [labTests, setLabTests] = useState({}); // To map testId to testName
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get patient ID from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) throw new Error("User not found. Please login again.");
        const user = JSON.parse(userStr);
        const patientId = user.id;
        if (!patientId) throw new Error("Patient ID not found.");

        // Fetch all lab tests to create a map
        const testsResponse = await labtechService.getAllLabTests();
        const testsMap = (testsResponse.data || []).reduce((acc, test) => {
          acc[test.testId] = test.testName || 'Unknown Test';
          return acc;
        }, {});
        setLabTests(testsMap);

        // Fetch patient's lab appointments
        const appointmentsResponse = await labtechService.getAppointmentsByPatient(patientId);
        // Sort by date, newest first
        const sortedAppointments = (appointmentsResponse.data || []).sort((a, b) => {
          return new Date(b.appointmentDate) - new Date(a.appointmentDate);
        });
        setAppointments(sortedAppointments);
        
      } catch (err) {
        console.error("Failed to load lab appointments:", err);
        setError(err.message || "Failed to load data.");
        toast.error(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const completedLabs = appointments.filter(a => a.status?.toLowerCase() === 'completed');
  const pendingLabs = appointments.filter(a => a.status?.toLowerCase() !== 'completed' && a.status?.toLowerCase() !== 'cancelled');

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error Loading Data</h2>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-700 mb-8 flex items-center gap-2">
        <BeakerIcon className="h-8 w-8 text-teal-600" />
        My Lab Appointments
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-100 border border-green-200 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-800">Completed</h3>
            <p className="text-5xl font-bold text-green-700 mt-1">{completedLabs.length}</p>
          </div>
          <CheckCircleIcon className="h-12 w-12 text-green-500 opacity-80" />
        </div>
        <div className="bg-red-100 border border-red-200 rounded-xl shadow p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-800">Pending / Other</h3>
            <p className="text-5xl font-bold text-red-700 mt-1">{pendingLabs.length}</p>
          </div>
          <ClockIcon className="h-12 w-12 text-red-500 opacity-80" />
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All Appointments</h2>
        {appointments.length === 0 ? (
          <div className="p-5 text-center text-gray-500 bg-gray-50 rounded-xl italic">
            You have no lab appointments.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(lab => (
              <div key={lab.appointmentId} className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
                  <h3 className="text-lg font-semibold text-teal-700">
                    {labTests[lab.testId] || `Test ID: ${lab.testId}`}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(lab.status)} flex items-center gap-2 mt-2 md:mt-0`}>
                    {getStatusIcon(lab.status)}
                    {lab.status || "Pending"}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
                  <div>
                    <span className="font-semibold text-gray-800">Appt. ID:</span> {lab.appointmentId}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Date:</span> {lab.appointmentDate ? new Date(lab.appointmentDate).toLocaleDateString() : "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Time:</span> {lab.appointmentTime || "N/A"}
                  </div>
                </div>

                {lab.status?.toLowerCase() === 'completed' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="h-5 w-5 text-green-700 flex-shrink-0" />
                      <h4 className="font-semibold text-green-800">Labtech Remarks:</h4>
                    </div>
                    <p className="text-green-700 italic mt-2 pl-7">
                      {lab.remarks || "No remarks provided."}
                    </p>
                  </div>
                )}

                {lab.status?.toLowerCase() === 'cancelled' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="h-5 w-5 text-red-700 flex-shrink-0" />
                      <h4 className="font-semibold text-red-800">Reason for Cancellation:</h4>
                    </div>
                    <p className="text-red-700 italic mt-2 pl-7">
                      {lab.remarks || "No reason provided."}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLabAppointments;