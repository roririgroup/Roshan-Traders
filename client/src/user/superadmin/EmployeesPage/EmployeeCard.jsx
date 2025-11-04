import React, { useState } from "react";
import Button from '../../../components/ui/Button';
import Badge from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { EMPLOYEE_STATUS_CONFIG } from "./employeeConstants";
import AssignTaskModal from "./AssignTaskModal"; // Import the modal

const EmployeeCard = ({ employee, onAssign, onRemoveClick, isLoading }) => {
  const { id, name, role, status, image } = employee;
  const statusConfig = EMPLOYEE_STATUS_CONFIG[status];
  const isAvailable = status === "Available";
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageError = (e) => {
    e.currentTarget.src = "/placeholder-avatar.png";
  };

  const handleAssignClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTaskSubmit = (taskDetails) => {
    // Call the parent's onAssign function with employee ID and task details
    onAssign(id, taskDetails);
    setIsModalOpen(false);
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
            {isAvailable ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAssignClick}
                disabled={isLoading}
                aria-label={`Assign tasks to ${name}`}
                className="shrink-0"
              >
                Assign
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                disabled
                className="shrink-0"
              >
                Busy
              </Button>
            )}

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

      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        employee={employee}
        onSubmit={handleTaskSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default EmployeeCard;