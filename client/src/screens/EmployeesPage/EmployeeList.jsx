import React from "react";
import EmployeeCard from "./EmployeeCard";

const EmployeeList = ({ employees, onAssign, onRemoveClick, isLoading }) => {
  return (
    <div className="space-y-4" role="list">
      {employees.map((employee) => (
        <div key={employee.id} role="listitem">
          <EmployeeCard
            employee={employee}
            onAssign={onAssign}
            onRemoveClick={onRemoveClick}
            isLoading={isLoading}
          />
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;