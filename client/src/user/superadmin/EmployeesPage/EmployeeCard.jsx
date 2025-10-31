import React, { useState } from "react";
import Button from '../../../components/ui/Button';
import Badge from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { EMPLOYEE_STATUS_CONFIG } from "./employeeConstants";
import EditEmployeeModal from "./EditEmployeeModal"; // Import the edit modal

const EmployeeCard = ({ employee, onRemoveClick, onEdit, isLoading }) => {
  const { id, name, role, status, image } = employee;
  const statusConfig = EMPLOYEE_STATUS_CONFIG[status];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleImageError = (e) => {
    e.currentTarget.src = "/placeholder-avatar.png";
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = (updatedEmployee) => {
    onEdit(id, updatedEmployee);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Card className="p-4 border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={image || "/placeholder-avatar.png"}
                alt={`${name} profile`}
                className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
                onError={handleImageError}
                loading="lazy"
              />
              
              <div
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                  status === "Available"
                    ? "bg-green-500"
                    : status === "Unavailable"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
                aria-label={`Status: ${status}`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{role}</span>
                <Badge 
                  color={statusConfig.color}
                  className={`text-xs`}
                  aria-label={`Employment status: ${statusConfig.label}`}
                >
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              disabled={isLoading}
              aria-label={`Edit ${name}`}
              className="shrink-0"
            >
              Edit
            </Button>

            <button
              className="border border-gray-300 text-black px-3 py-1.5 rounded-lg cursor-pointer
                         hover:bg-red-600 hover:text-white transition text-sm"
              onClick={() => onRemoveClick(id)}
            >
              Remove
            </button>
          </div>
        </div>
      </Card>

      {isEditModalOpen && (
        <EditEmployeeModal
          onClose={handleEditModalClose}
          employee={employee}
          onEdit={handleEditSubmit}
        />
      )}
    </>
  );
};

export default EmployeeCard;