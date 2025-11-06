import React, { useEffect, useState } from 'react';
import { labtechService } from '../../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [labTech, setLabTech] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabTech = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          toast.error('No user data found. Please log in again.');
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const id = parsedUser.lbId || parsedUser.id || parsedUser.labTechId;

        if (!id) {
          toast.error('Lab Technician ID not found in user data.');
          setLoading(false);
          return;
        }

        const response = await labtechService.getLabTechById(id);
        setLabTech(response.data);
      } catch (error) {
        console.error('Error fetching lab tech details:', error);
        toast.error('Failed to fetch profile details from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchLabTech();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!labTech) {
    return (
      <div className="text-center mt-8 text-red-600 font-medium">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Profile
      </h2>

      <div className="space-y-4">
        <ProfileRow label="Lab ID" value={labTech.lbId} />
        <ProfileRow label="Full Name" value={labTech.lbName} />
        <ProfileRow label="Mobile Number" value={labTech.mobileNo} />
        <ProfileRow label="Email ID" value={labTech.emailId} />
        <ProfileRow label="Gender" value={labTech.gender} />
        <ProfileRow label="Age" value={labTech.age} />
        <ProfileRow label="Experience" value={`${labTech.experience} years`} />
        <ProfileRow
          label="Password"
          value={labTech.password ? '********' : 'Not set'}
        />
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default Profile;
