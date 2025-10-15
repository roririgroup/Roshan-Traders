import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import AddEmployeeModal from './AddEmployeeModal';
import { Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:7700/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const response = await fetch('http://localhost:7700/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees([...employees, newEmployee]);
        alert('Employee added successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

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

  const handleRemoveEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      try {
        const response = await fetch(`http://localhost:7700/api/employees/${employeeId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
          alert('Employee removed successfully!');
        } else {
          alert('Failed to remove employee');
        }
      } catch (error) {
        console.error('Error removing employee:', error);
        alert('Error removing employee');
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading employees...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#F08344] hover:bg-[#e0733a] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

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

      {isAddModalOpen && (
        <AddEmployeeModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
