import React, { useState } from "react";
import Button from "../../components/ui/Button";
import { X } from "lucide-react";

const AddAgentsModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    status: "active",
    referrals: 0,
    image: "", // store base64 string or URL
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAgent = {
      id: `a_${Date.now()}`,
      ...form,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop",
      joinDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };
    onAdd(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-2xl w-96 max-w-lg p-0 transform transition-all overflow-hidden">
        {/* Header */}
        <div className="bg-[#F08344] px-5 py-3 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">Add New Agent</h3>
            <p className="text-white/90 text-xs mt-1">
              Fill in the details below to add a new agent
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 hover:cursor-pointer" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto max-h-[80vh] space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter agent name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-md px-3 py-2 text-sm outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-md px-3 py-2 text-sm outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-md px-3 py-2 text-sm outline-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={form.location}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-md px-3 py-2 text-sm outline-none"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-md px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Referrals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referrals
            </label>
            <input
              type="number"
              name="referrals"
              placeholder="Enter number of referrals"
              value={form.referrals}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-md px-3 py-2 text-sm outline-none"
              min="0"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 w-full border-2 border-gray-200 focus:border-[#F08344] focus:ring-2 focus:ring-[#F08344]/20 rounded-lg px-4 py-3 text-sm outline-none bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Upload photo or leave blank for default avatar
            </p>
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="mt-2 h-16 w-16 rounded-full object-cover border-2 border-gray-200"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-2 text-sm"
            >
              Add Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgentsModal;
