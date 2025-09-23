import React, { useState } from "react";
import Button from '../../components/ui/Button';

const AddEmployeeModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    status: "Available",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: `emp_${Date.now()}`,
      ...form,
      image: form.image || "/placeholder-avatar.png",
    };
    onAdd(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-0 transform transition-all overflow-hidden">
        {/* Header with brand color */}
        <div className="bg-[#F08344] px-6 py-4">
          <h3 className="text-xl font-semibold text-white">
            Add New Employee
          </h3>
          <p className="text-white/90 text-sm mt-1">
            Fill in the details below to add a new employee
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter employee name"
                value={form.name}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Role
              </label>
              <input
                type="text"
                name="role"
                placeholder="Enter job role"
                value={form.role}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none bg-white"
              >
                <option>Available</option>
                <option>On Job</option>
                <option>Unavailable</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text- -700 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/avatar.jpg"
                value={form.image}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none"
              />
              <p className="text-xs text-black-500 mt-1 ">Optional: Leave blank for default avatar</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <Button 
              type="button" 
              variant="primary" 
              onClick={onClose}
              className="px-6 py-2.5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              className="px-6 py-2.5"
            >
              Add Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddEmployeeModal;