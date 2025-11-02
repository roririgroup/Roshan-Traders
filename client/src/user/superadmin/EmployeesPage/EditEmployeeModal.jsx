import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";

const EditEmployeeModal = ({ onClose, onEdit, employee }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    status: "Available",
    salary: "",
  });

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        phone: employee.phone || "",
        email: employee.email || "",
        role: employee.role || "",
        status: employee.status || "Available",
        salary: employee.salary?.toString() || "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEmployee = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      role: form.role,
      status: form.status,
      salary: parseFloat(form.salary) || 0,
    };
    onEdit(employee.id, updatedEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-0 transform transition-all overflow-hidden">
        {/* Header */}
        <div className="bg-[#F08344] px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Edit Employee</h3>
          <p className="text-white/90 text-sm mt-1">Update employee details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter employee name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
            <input
              type="text"
              name="role"
              placeholder="Enter job role"
              value={form.role}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm outline-none"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
            <input
              type="number"
              name="salary"
              placeholder="Enter salary amount"
              value={form.salary}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm outline-none bg-white"
            >
              <option>Available</option>
              <option>On Job</option>
              <option>Unavailable</option>
            </select>
          </div>




          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="primary" onClick={onClose} className="px-6 py-2.5">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-6 py-2.5">
              Update Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
