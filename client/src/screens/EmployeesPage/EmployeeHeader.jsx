import React from "react";
import Button from "../../components/ui/Button";

const EmployeeHeader = ({ onAddEmployee }) => {
  return (
    <header className="mb-6 flex justify-between items-center">
      <div>
        <h2
          id="employees-heading"
          className="text-2xl font-bold text-gray-900"
        >
          Employees
        </h2>
        <p className="text-gray-600 mt-1">
          Manage and assign tasks to your team members
        </p>
      </div>
      <Button
          onClick={onAddEmployee}
      >
        Add Employee
      </Button>
    </header>
  );
};

export default EmployeeHeader;