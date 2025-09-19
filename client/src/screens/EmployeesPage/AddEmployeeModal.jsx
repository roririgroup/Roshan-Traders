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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 transform transition-all">
        {/* Header */}
        <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
          Add Employee
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter employee name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              name="role"
              placeholder="Enter role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2 text-sm"
            >
              <option>Available</option>
              <option>On Job</option>
              <option>Unavailable</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/avatar.jpg"
              value={form.image}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;