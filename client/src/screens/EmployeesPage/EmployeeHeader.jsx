import React from "react";

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
      <button
        className="border border-gray-300 p-2 rounded-lg cursor-pointer hover:border-black"
        onClick={onAddEmployee}
      >
        Add Employee
      </button>
    </header>
  );
};

export default EmployeeHeader;