import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { staffService } from "../services/api"; // ensure this points to your axios service
import { SPECIALIZATION_OPTIONS } from "../utils/enums";

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    drName: "",
    mobileNo: "",
    emailId: "",
    gender: "Male",
    age: "",
    experience: "",
    password: "",
    confirmPassword: "",
    spId: "",
    picture: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.drName) newErrors.drName = "Name is required";
    if (!/^[0-9]{10}$/.test(form.mobileNo)) newErrors.mobileNo = "Mobile must be 10 digits";
    if (!form.emailId || !/\S+@\S+\.\S+/.test(form.emailId)) newErrors.emailId = "Valid email required";
    if (!form.age || form.age <= 0) newErrors.age = "Valid age required";
    if (!form.experience) newErrors.experience = "Experience required";
    if (!form.spId) newErrors.spId = "Specialization required";
    if (!form.password || form.password.length < 6) newErrors.password = "Password must be at least 6 chars";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        drName: form.drName.trim(),
        mobileNo: form.mobileNo.trim(),
        emailId: form.emailId.trim(),
        gender: form.gender,
        age: Number(form.age),
        experience: Number(form.experience),
        password: form.password.trim(),
        spId: Number(form.spId),
        picture: form.picture || null
      };

      console.log("Doctor registration payload:", payload);

      await staffService.createDoctor(payload);
      toast.success("Doctor registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Doctor registration failed", err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow mb-4">
            <UserCircleIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold">Doctor Registration</h1>
          <p className="text-sm text-gray-600">Enter doctor details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="drName"
              value={form.drName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.drName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Dr. John Doe"
            />
            {errors.drName && <p className="text-red-500 text-sm">{errors.drName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                name="mobileNo"
                value={form.mobileNo}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.mobileNo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0123456789"
              />
              {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="emailId"
                  value={form.emailId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.emailId ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="doctor@example.com"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="35"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Experience (Years)</label>
              <input
                name="experience"
                type="number"
                value={form.experience}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.experience ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10"
              />
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <select
                name="spId"
                value={form.spId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.spId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select specialization</option>
                {SPECIALIZATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.spId && <p className="text-red-500 text-sm">{errors.spId}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 text-gray-400"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 text-gray-400"
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white bg-primary-600 hover:bg-primary-700"
          >
            {loading ? "Creating..." : "Register Doctor"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-primary-600 font-medium">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
