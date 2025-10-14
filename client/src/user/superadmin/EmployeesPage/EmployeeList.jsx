// In your parent component (e.g., EmployeeList.jsx)
import React, { useState } from 'react';
import EmployeeCard from './EmployeeCard';
import { MOCK_EMPLOYEES } from './employeeConstants';

const EmployeeList = () => {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignTask = async (employeeId, taskDetails) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update employee status and store all order details
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId 
            ? { 
                ...emp, 
                status: "On Job",
                currentOrder: {
                  bricks: taskDetails.bricks,
                  address: taskDetails.address,
                  startTime: taskDetails.startTime,
                  estimatedArrival: taskDetails.estimatedArrival,
                  cargo: taskDetails.cargo,
                  agent: taskDetails.agent,
                  from: taskDetails.from,
                  to: taskDetails.to,
                  assignedAt: new Date().toISOString()
                }
              }
            : emp
        )
      );
      
      console.log(`Task assigned to employee ${employeeId}:`, taskDetails);
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
    <div className="grid gap-4">
      {employees.map(employee => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onAssign={handleAssignTask}
          onRemoveClick={handleRemoveEmployee}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default EmployeeList;