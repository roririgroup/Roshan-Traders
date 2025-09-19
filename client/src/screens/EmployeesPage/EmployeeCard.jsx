import React from "react";
import Button from '../../components/ui/Button';
import Badge from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

// Status config
const EMPLOYEE_STATUS_CONFIG = {
  Available: { color: "green", label: "Available" },
  "On Job": { color: "amber", label: "On Job" },
  Unavailable: { color: "red", label: "Unavailable" },
};

const EmployeeCard = ({ employee, onAssign, onRemoveClick, isLoading }) => {
  const { id, name, role, status, image } = employee;
  const statusConfig = EMPLOYEE_STATUS_CONFIG[status];
  const isAvailable = status === "Available";

  const handleImageError = (e) => {
    e.currentTarget.src = "/placeholder-avatar.png";
  };

  return (
    <Card className="p-4 border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={image}
              alt={`${name} profile`}
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
              onError={handleImageError}
              loading="lazy"
            />
            <div
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                isAvailable ? "bg-green-500" : "bg-amber-500"
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
                className="text-xs"
                aria-label={`Employment status: ${statusConfig.label}`}
              >
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAssign(id)}
            disabled={!isAvailable || isLoading}
            aria-label={`Assign tasks to ${name}`}
            className="shrink-0"
          >
            {isLoading ? "Assigning..." : isAvailable ? "Assign" : "Busy"}
          </Button>
          <button
            className="border border-gray-200 px-2 rounded-lg cursor-pointer hover:border-black hover:text-red-500"
            onClick={() => onRemoveClick(id)}
          >
            Remove
          </button>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeCard;