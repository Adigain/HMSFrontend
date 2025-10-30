import React from 'react';
import { Link } from 'react-router-dom';

const RegisterChoice = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/register/patient" className="block p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as Patient</h2>
          <p className="text-gray-600">Create an account to book appointments, view prescriptions and manage your profile.</p>
        </Link>

        <Link to="/register/staff" className="block p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as Staff</h2>
          <p className="text-gray-600">Create a staff account. Staff accounts require a designation selected from available roles.</p>
        </Link>
      </div>
    </div>
  );
};

export default RegisterChoice;
