import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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

    setError("");
    console.log("Form submitted:", formData);

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate("/user/login"); // Fixed path to match your routes
    }, 2000);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-6 bg-blue-100">
      {/* Success Popup */}
      {success && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg animate-bounce z-10">
          ✅ Account Created Successfully!
        </div>
      )}

      {/* Card */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Illustration */}
       {/* Left Side - Illustration */}
<div className="lg:w-[40%] w-full flex items-center justify-center relative overflow-hidden bg-white">
  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5B2BEB] via-[#6C36F4] to-[#8848FF] rounded-r-full"></div>
  <div className="w-[420px] h-[420px] flex items-center justify-center relative z-10">
    <div className="text-white text-center">
      <img 
        src="/lottie/working.gif" 
        alt="Truck Animation" 
        className="w-[420px] object-contain mx-auto mb-4"
      />
     
    </div>
  </div>
</div>

        {/* Right Side - Form */}
        <div className="lg:w-[60%] w-full flex flex-col justify-center p-8 lg:p-12 bg-white relative">
          <div className="text-center mb-8">
            {/* Fixed logo path */}
            <div className="h-13 mx-auto mb-4">
              <img src="/lottie/Roshan_black.png" alt="Logo" className="h-13 ml-18 mx-auto object-contain" />
            </div>
            <h1 className="text-3xl lg:text-2xl font-bold text-gray-900 mt-3">
              Create Account
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-md mx-auto w-full"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full h-10 border-2 border-gray-300 rounded-lg px-4 text-base focus:outline-none hover:border-[#555] focus:border-[#555] transition-all"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role (Optional)
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-10 border-2 border-gray-300 rounded-lg px-4 text-base focus:outline-none hover:border-[#555] focus:border-[#555] transition-all"
              >
                <option value="">Select Role</option>
                <option value="Agent">Agent</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Truck Owner">Truck Owner</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            {/* Create Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Create Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full h-10 border-2 border-gray-300 rounded-lg px-4 text-base focus:outline-none hover:border-[#555] focus:border-[#555] transition-all"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full h-10 border-2 border-gray-300 rounded-lg px-4 text-base focus:outline-none hover:border-[#555] focus:border-[#555] transition-all"
                required
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-10 bg-gradient-to-br from-[#5B2BEB] via-[#6C36F4] to-[#8848FF] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:cursor-pointer hover:scale-[1.02] transition-all duration-200 mt-6"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-gray-600 text-center text-base">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/user/login")} // Fixed path
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