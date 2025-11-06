import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [labTech, setLabTech] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // --- New State for Remarks Modal ---
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [remarks, setRemarks] = useState("");
  // -------------------------------------

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("User not found. Please login again.");

      const user = JSON.parse(userStr);
      const labTechId = user.lbId || user.id;

      if (!labTechId)
        throw new Error("Lab technician ID missing in user data.");

      // Fetch lab tech details
      const labtechRes = await axios.get(
        `http://localhost:8080/api/labtechs/${labTechId}`
      );
      setLabTech(labtechRes.data);

      // Fetch appointments
      const appointRes = await axios.get(
        `http://localhost:8080/api/labappointments/labtech/${labTechId}`
      );
      setAppointments(appointRes.data || []);
    } catch (err) {
      console.error("❌ Failed to load dashboard data:", err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const openRemarksModal = (appointment) => {
    setCurrentAppointment(appointment);
    setRemarks(""); // Clear any previous remarks
    setShowRemarksModal(true);
  };

  const handleSaveRemarks = () => {
    if (!currentAppointment) return;

    updateLabStatus(currentAppointment, "Completed", remarks);

    setShowRemarksModal(false);
    setRemarks("");
    setCurrentAppointment(null);
  };
  const updateLabStatus = async (appointment, newStatus, customRemarks) => {
    try {
      let remarksToUpdate;

      if (newStatus === "Completed") {
        remarksToUpdate =
          customRemarks !== undefined
            ? customRemarks
            : "Lab test completed successfully.";
      } else if (newStatus === "Cancelled") {
        remarksToUpdate = "Appointment cancelled by technician.";
      } else {
        remarksToUpdate = appointment.remarks || ""; // Keep existing remarks for other statuses
      }

      const updatedAppointment = {
        ...appointment,
        status: newStatus,
        remarks: remarksToUpdate,
      };

      await axios.put(
        `http://localhost:8080/api/labappointments/${appointment.appointmentId}`,
        updatedAppointment
      );

      toast.success(`Appointment marked as ${newStatus}`);
      fetchData(); 
    } catch (err) {
      console.error("❌ Failed to update lab status:", err);
      toast.error("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin h-14 w-14 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    );

  const upcomingLabs = appointments.filter(
    (a) =>
      a.status?.toLowerCase() === "pending" ||
      a.status?.toLowerCase() === "upcoming"
  );
  const completedLabs = appointments.filter(
    (a) => a.status?.toLowerCase() === "completed"
  );
  const pastLabs = appointments.filter(
    (a) =>
      a.status?.toLowerCase() === "cancelled" ||
      a.status?.toLowerCase() === "expired"
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-teal-700 flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-9 w-9 text-teal-600" />
            Lab Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all your lab test appointments efficiently
          </p>
        </div>

        {labTech && (
          <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 text-gray-700">
            <p className="font-semibold text-teal-700">{labTech.lbName}</p>
            <p className="text-sm">{labTech.emailId}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Upcoming Labs"
          count={upcomingLabs.length}
          icon={<ClockIcon className="h-9 w-9 text-yellow-500" />}
          color="from-yellow-400/10 to-yellow-200/10"
          borderColor="border-yellow-300/40"
        />
        <StatCard
          title="Completed Labs"
          count={completedLabs.length}
          icon={<CheckCircleIcon className="h-9 w-9 text-green-500" />}
          color="from-green-400/10 to-green-200/10"
          borderColor="border-green-300/40"
        />
        <StatCard
          title="Past Labs"
          count={pastLabs.length}
          icon={<ArchiveBoxIcon className="h-9 w-9 text-blue-500" />}
          color="from-blue-400/10 to-blue-200/10"
          borderColor="border-blue-300/40"
        />
      </div>

      {/* Sections */}
      <Section
        title="Upcoming Labs"
        icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
        items={upcomingLabs}
        empty="No upcoming labs found."
        onAction={updateLabStatus}
        onMarkCompleteClick={openRemarksModal} 
      />

      <Section
        title="Completed Labs"
        icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
        items={completedLabs}
        empty="No completed labs yet."
      />

      <Section
        title="Past Labs"
        icon={<ArchiveBoxIcon className="h-6 w-6 text-blue-600" />}
        items={pastLabs}
        empty="No past labs found."
      />

      {/* --- Remarks Modal --- */}
      {showRemarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Remarks</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please add any remarks for completing lab test #
              {currentAppointment?.appointmentId}.
            </p>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="results normal..."
            ></textarea>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRemarksModal(false);
                  setRemarks("");
                  setCurrentAppointment(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRemarks}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium shadow-sm transition-all"
              >
                Save and Complete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --------------------- */}
    </div>
  );
};

// --- Components ---
const StatCard = ({ title, count, icon, color, borderColor }) => (
  <div
    className={`rounded-2xl border ${borderColor} bg-gradient-to-br ${color} p-6 shadow-sm hover:shadow-md transition-all duration-200`}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-5xl font-bold text-gray-800 mt-1">{count}</p>
      </div>
      <div className="bg-white/70 p-3 rounded-xl shadow-inner">{icon}</div>
    </div>
  </div>
);

const Section = ({ title, icon, items, empty, onAction, onMarkCompleteClick }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-10">
    <div className="flex items-center mb-4 border-b border-gray-100 pb-2">
      {icon}
      <h2 className="text-xl font-semibold ml-2 text-gray-800">{title}</h2>
    </div>

    {items.length === 0 ? (
      <div className="p-5 text-center text-gray-500 bg-gray-50 rounded-xl italic">
        {empty}
      </div>
    ) : (
      <div className="space-y-3">
        {items.map((lab) => (
          <div
            key={lab.appointmentId}
            className="p-5 border border-gray-100 rounded-xl hover:bg-teal-50/40 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-800">
                Appointment #{lab.appointmentId}
              </p>
              <span className="text-sm text-gray-500">
                {lab.appointmentDate
                  ? new Date(lab.appointmentDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold text-gray-800">Patient ID:</span>{" "}
              {lab.pId || "N/A"}{" "}
              <span className="ml-3 font-semibold text-gray-800">Test ID:</span>{" "}
              {lab.testId || "N/A"}
            </p>

            <p className="text-sm text-gray-600 mt-2 mb-4">
              Status:{" "}
              <span
                className={`font-medium ${
                  lab.status?.toLowerCase() === "completed"
                    ? "text-green-600"
                    : lab.status?.toLowerCase() === "cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {lab.status || "Pending"}
              </span>
            </p>
            
            {onAction && onMarkCompleteClick && (
              <div className="flex gap-3">
                <button
                  onClick={() => onMarkCompleteClick(lab)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm shadow-sm transition-all"
                >
                  ✅ Mark Complete
                </button>
                <button
                  onClick={() => onAction(lab, "Cancelled")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm shadow-sm transition-all"
                >
                  ✖ Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Dashboard;