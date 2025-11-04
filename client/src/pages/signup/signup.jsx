import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from '@lottiefiles/react-lottie-player';
import Construction from '../../../public/lottie/construction.json';
const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    role: "", 
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.role.length === 0) {
      setError("Please select at least one role!");
      return;
    }

    setError("");

    // Create user object with additional fields
    const userData = {
      id: Date.now().toString(), // Simple ID generation
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.contact, // Changed from 'contact' to 'phone' to match approval page
      address: formData.address,
      role: formData.role,
      password: formData.password, // Note: In real app, hash this!
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("Form submitted:", userData);

    // Store in localStorage for approval
    const existingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const updatedUsers = [...existingUsers, userData];
    localStorage.setItem('pendingUsers', JSON.stringify(updatedUsers));

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate("/user/login");
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4 overflow-hidden">
      {/* Success Popup */}
      {success && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg animate-bounce z-10">
          ✅ Registration Submitted Successfully! Waiting for admin approval.
        </div>
      )}

      {/* Card - Fixed height to prevent scrolling */}
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[650px]">
        {/* Left Side - Illustration */}
        <div className="w-2/5 flex items-center justify-center relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5B2BEB] via-[#6C36F4] to-[#8848FF] rounded-r-full"></div>
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <Player
        autoplay
        loop
        src={Construction}
        style={{ height: 400, width: 400 }}
      />
          </div>
        </div>
           <div>
      
    </div>

        {/* Right Side - Form */}
        <div className="w-3/5 flex flex-col justify-center p-8 bg-white relative">
          <div className="text-center mb-6">
            {/* <img 
              src="/lottie/Roshan_black.png" 
              alt="Logo" 
              className="h-12  ml-12 mx-auto object-contain" 
            /> */}
            <h1 className="text-2xl font-bold text-gray-900">
              Create Account
            </h1>
            <p className="text-sm text-gray-600 ">
              Your account will be activated after admin approval
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto w-full"
          >
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                required
              >
                <option value="">Select Role</option>
                <option value="Agent">Agent</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Truck Owner">Truck Owner</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-[#555] transition-all"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center ">{error}</p>
            )}

            {/* Submit Button */}
            
            <button
              type="submit"
              className="w-full h-10 bg-gradient-to-br from-[#5B2BEB] via-[#6C36F4] to-[#8848FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 mt-2"
            >
              Submit for Approval
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-2 text-gray-600 text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/user/login")}
              className="text-purple-600 font-semibold cursor-pointer hover:underline hover:text-purple-700 transition-colors"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Signup;