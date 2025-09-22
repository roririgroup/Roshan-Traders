import React from "react";
import Button from "../../components/ui/Button";

const ConfirmRemoveModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 transform transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Confirm Removal
        </h3>
      </div>

      {/* Body */}
      <p className="text-gray-600 mb-6 leading-relaxed">
        This action cannot be undone. Are you sure you want to{" "}
        <span className="font-medium text-red-600">remove this employee</span>?
      </p>

      {/* Actions */}
     <div className="flex justify-end gap-3">
  <Button
    onClick={onClose}
    className="border border-gray-400 text-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition"
  >
    Cancel
  </Button>
  <Button
    onClick={onConfirm}
    className="border border-gray-400 text-black px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition"
  >
    Remove
  </Button>
</div>

    </div>
  </div>
);

export default ConfirmRemoveModal;