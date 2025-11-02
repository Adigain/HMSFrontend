import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { doctorService, labtechService, pharmacistService } from "../services/api"; 
import { SPECIALIZATION_OPTIONS } from "../utils/enums";

const StaffRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    designation: "Doctor", 
    name: "",
    mobileNo: "",
    emailId: "",
    gender: "Male",
    age: "",
    experience: "",
    password: "",
    confirmPassword: "",
    spId: "",
    picture: "", 
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "designation" && value !== "Doctor") {
      setForm((prev) => ({ ...prev, designation: value, spId: "", picture: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!/^[0-9]{10}$/.test(form.mobileNo)) newErrors.mobileNo = "Mobile must be 10 digits";
    if (!form.emailId || !/\S+@\S+\.\S+/.test(form.emailId)) newErrors.emailId = "Valid email required";
    if (!form.age || Number(form.age) <= 0) newErrors.age = "Valid age required";
    if (form.experience === "" || Number(form.experience) < 0) newErrors.experience = "Experience required";
    if (!form.password || form.password.length < 6) newErrors.password = "Password must be at least 6 chars";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    // specialization required only for Doctors
    if (form.designation === "Doctor" && !form.spId) newErrors.spId = "Specialization required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (form.designation === "Doctor") {
        // Doctor payload order: drName, mobileNo, emailId, gender, age, experience, password, spId, picture
        const doctorPayload = {
          drName: form.name.trim(),
          mobileNo: form.mobileNo.trim(),
          emailId: form.emailId.trim(),
          gender: form.gender,
          age: Number(form.age),
          experience: Number(form.experience),
          password: form.password.trim(),
          spId: Number(form.spId),
          picture: form.picture || null,
        };

        console.log("Doctor registration payload:", doctorPayload);
        await doctorService.addDoctor(doctorPayload);
        toast.success("Doctor registered successfully!");
      } else if (form.designation === "Labtech") {
        // Labtech payload order: lbName, mobileNo, emailId, gender, age, experience, password
        const labtechPayload = {
          lbName: form.name.trim(),
          mobileNo: form.mobileNo.trim(),
          emailId: form.emailId.trim(),
          gender: form.gender,
          age: Number(form.age),
          experience: Number(form.experience),
          password: form.password.trim(),
        };

        console.log("Labtech registration payload:", labtechPayload);
        await labtechService.addLabTech(labtechPayload);
        toast.success("Labtech registered successfully!");
      } else if (form.designation === "Pharmacist") {
        // Pharmacist payload order: phName, mobileNo, emailId, gender, age, experience, password
        const pharmacistPayload = {
          phName: form.name.trim(),
          mobileNo: form.mobileNo.trim(),
          emailId: form.emailId.trim(),
          gender: form.gender,
          age: Number(form.age),
          experience: Number(form.experience),
          password: form.password.trim(),
        };

        console.log("Pharmacist registration payload:", pharmacistPayload);
        await pharmacistService.addPharmacist(pharmacistPayload);
        toast.success("Pharmacist registered successfully!");
      }

      navigate("/login");
    } catch (err) {
      console.error("Staff registration failed", err);
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
          <h1 className="text-2xl font-bold">Staff Registration</h1>
          <p className="text-sm text-gray-600">Register a Doctor, Labtech or Pharmacist</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="Doctor">Doctor</option>
              <option value="Labtech">Labtech</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
              placeholder={form.designation === "Doctor" ? "Doctor Name" : form.designation === "Labtech" ? "Labtech Name" : "Pharmacist Name"}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                name="mobileNo"
                value={form.mobileNo}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${errors.mobileNo ? "border-red-500" : "border-gray-300"}`}
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
                  className={`w-full px-4 py-3 border rounded-lg ${errors.emailId ? "border-red-500" : "border-gray-300"}`}
                  placeholder="staff@example.com"
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
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg">
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
                className={`w-full px-4 py-3 border rounded-lg ${errors.age ? "border-red-500" : "border-gray-300"}`}
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
                className={`w-full px-4 py-3 border rounded-lg ${errors.experience ? "border-red-500" : "border-gray-300"}`}
                placeholder="10"
              />
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
            </div>

            {form.designation === "Doctor" ? (
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <select
                  name="spId"
                  value={form.spId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${errors.spId ? "border-red-500" : "border-gray-300"}`}
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
            ) : (
              <div />
            )}
          </div>

          {form.designation === "Doctor" && (
            <div>
              <label className="block text-sm font-medium mb-1">Picture URL (optional)</label>
              <input
                name="picture"
                value={form.picture}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>
          )}

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
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute inset-y-0 right-0 pr-3 text-gray-400">
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
              <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute inset-y-0 right-0 pr-3 text-gray-400">
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-white bg-primary-600 hover:bg-primary-700">
            {loading ? "Creating..." : "Register Staff"}
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

export default StaffRegistration;
