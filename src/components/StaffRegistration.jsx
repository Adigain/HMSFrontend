import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { staffService } from '../services/api';
import { DESIGNATION_OPTIONS, SPECIALIZATION_OPTIONS } from '../utils/enums';

const StaffRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    mobileNo: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    designation: '',
    specialization: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    if (!form.age || isNaN(form.age) || parseInt(form.age) <= 0) newErrors.age = 'Valid age required';
    if (!form.gender) newErrors.gender = 'Gender required';
    if (!form.bloodGroup) newErrors.bloodGroup = 'Blood group required';
    if (!/^[0-9]{10}$/.test(form.mobileNo)) newErrors.mobileNo = 'Mobile must be 10 digits';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.designation) newErrors.designation = 'Designation required';
    // If designation is DOCTOR, require specialization
    if (form.designation === 'DOCTOR' && !form.specialization) {
      newErrors.specialization = 'Specialization required for doctors';
    }
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 chars';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {      
      let payload;

      const designationUpper = (form.designation || '').toUpperCase();

      if (designationUpper === 'DOCTOR') {
        
        payload = {
          
          Dr_name: form.name,
          Mobile_no: form.mobileNo,
          Email_id: form.email,
          Gender: form.gender,
          Age: form.age ? Number(form.age) : null,
          Experience: form.experience ? Number(form.experience) : null, 
          Password: form.password,
          Sp_Id: form.specialization ? Number(form.specialization) : null,
          picture: form.picture || null
        };
      } else if (designationUpper === 'LABTECH') {
        
        payload = {
        
          Lb_name: form.name,
          Mobile_no: form.mobileNo,
          Email_id: form.email,
          Gender: form.gender,
          Age: form.age ? Number(form.age) : null,
          Experience: form.experience ? Number(form.experience) : null, 
          Password: form.password
        };
      } else if (designationUpper === 'ADMIN') {
        
        payload = {
          
          Name: form.name,
          Email: form.email,
          Password: form.password
        };
      } else {
        
        payload = { ...form };
        delete payload.confirmPassword;
      }
      console.log('Registration payload:', payload);

      
      if (payload.confirmPassword) delete payload.confirmPassword;

      await staffService.createStaff(payload);
      toast.success('Staff registered successfully');
      navigate('/login');
    } catch (err) {
      console.error('Staff registration failed', err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow mb-4">
            <UserCircleIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold">Staff Registration</h1>
          <p className="text-sm text-gray-600">Enter staff details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className={`block w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={`block w-full px-4 py-3 border rounded-lg ${errors.dob ? 'border-red-500' : 'border-gray-300'}`} max={new Date().toISOString().split('T')[0]} />
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input name="age" value={form.age} onChange={handleChange} type="number" min="1" max="120" className={`block w-full px-4 py-3 border rounded-lg ${errors.age ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={`block w-full px-4 py-3 border rounded-lg ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={`block w-full px-4 py-3 border rounded-lg ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select blood group</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input name="mobileNo" value={form.mobileNo} onChange={handleChange} className={`block w-full px-4 py-3 border rounded-lg ${errors.mobileNo ? 'border-red-500' : 'border-gray-300'}`} placeholder="0123456789" />
              {errors.mobileNo && <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="block w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`block w-full px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="staff@example.com"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter a strong password"
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-0 pr-3 text-gray-400">{showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Confirm password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute inset-y-0 right-0 pr-3 text-gray-400">{showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <select name="designation" value={form.designation} onChange={handleChange} className={`block w-full px-4 py-3 border rounded-lg ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Select designation</option>
              {DESIGNATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
          </div>

          {/* Visible only when designation === 'DOCTOR' */}
          {form.designation === 'DOCTOR' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-lg ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select specialization</option>
                {SPECIALIZATION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white bg-primary-600 hover:bg-primary-700"
            >
              {loading ? 'Creating...' : 'Create Staff Account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-primary-600 font-medium">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration;
