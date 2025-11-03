// EmployeesPage.jsx or your main component
import React, { useState } from 'react';
import EmployeeCard from './EmployeeCard';
import { MOCK_EMPLOYEES } from './employeeConstants';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignTask = async (employeeId, taskDetails) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId 
            ? { 
                ...emp, 
                status: "On Job",
                currentOrder: taskDetails
              }
            : emp
        )
      );
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveEmployee = (employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage regular employees (excluding truck owners and drivers)
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#F08344] hover:bg-[#e0733a] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          Error: {error}
          <button 
            onClick={fetchEmployees} 
            className="ml-2 text-red-700 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}
      

      <div className="mb-4 text-sm text-gray-600">
        Total employees: {employees.length}
      </div>

      <div className="grid gap-4">
        {employees.length > 0 ? (
          employees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onAssign={handleAssignTask}
              onRemoveClick={handleRemoveEmployee}
              isLoading={isLoading}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No employees found
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;