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
      <h1 className="text-2xl font-bold mb-6">Employees</h1>
      
      {/* Debug: Check if employees data is loaded */}
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