// components/AssignTaskModal.jsx
import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const AssignTaskModal = ({ isOpen, onClose, employee, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    bricksCount: '',
    startTime: '',
    estimatedArrival: '',
    agent: '',
    from: '',
    to: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.bricksCount) {
      const newTrip = {
        id: Date.now(),
        driver: employee?.name || "Unknown Driver",
        truckNo: "TN01AB1234", // Make dynamic if needed
        from: formData.from,
        to: formData.to,
        startTime: formData.startTime,
        estimatedArrival: formData.estimatedArrival,
        cargo: `${formData.bricksCount} Bricks`,
        agent: formData.agent,
        status: "Upcoming",
        podUploaded: false,
      };

      // Store in localStorage so it shows in Trips.jsx
      const existingTrips = JSON.parse(localStorage.getItem("truckTrips")) || [];
      localStorage.setItem("truckTrips", JSON.stringify([newTrip, ...existingTrips]));

      alert(`Task successfully assigned to ${employee?.name}`);

      // Reset form & close modal
      setFormData({
        bricksCount: '',
        startTime: '',
        estimatedArrival: '',
        agent: '',
        from: '',
        to: ''
      });

      onClose(); // ✅ close modal
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Task to {employee?.name}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Number of Bricks */}
          <div>
            <label htmlFor="bricksCount" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Bricks *
            </label>
            <input
              type="number"
              id="bricksCount"
              name="bricksCount"
              value={formData.bricksCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter number of bricks"
              min="1"
              required
            />
          </div>

          {/* Start / Estimated Arrival */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="estimatedArrival" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Arrival
              </label>
              <input
                type="datetime-local"
                id="estimatedArrival"
                name="estimatedArrival"
                value={formData.estimatedArrival}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
                From Location
              </label>
              <input
                type="text"
                id="from"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter starting location"
              />
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                To Location
              </label>
              <input
                type="text"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter destination"
              />
            </div>
          </div>

          {/* Agent */}
          <div>
            <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              id="agent"
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter agent name"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose} // ✅ Use onClose directly
              disabled={isLoading}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.bricksCount}
              className="px-4 py-2"
            >
              {isLoading ? 'Assigning...' : 'Assign Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;

