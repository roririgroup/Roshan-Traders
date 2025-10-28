import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import AddEmployeeModal from './AddEmployeeModal';
import { Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';

const initialEmployees = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Manager',
    status: 'Available',
    phone: '+91 98765 43210',
    email: 'john@example.com',
    location: 'Ahmedabad'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    role: 'HR',
    status: 'Available',
    phone: '+91 98765 43211',
    email: 'sarah@example.com',
    location: 'Mumbai'
  }
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      const response = await fetch('http://localhost:7700/api/employees?excludeLabours=true');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch employees');
      }
      
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error.message);
      setEmployees([]); // Reset employees on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employeeData) => {
    try {
      // Validate email if provided
      if (employeeData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch('http://localhost:7700/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...employeeData,
          status: 'Available',
          // Use default profile image that's guaranteed to work
          image: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(employeeData.name)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to add employee');
      }

      await fetchEmployees(); // Refresh the list
      alert('Employee added successfully!');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      setError(error.message);
      // Keep modal open so user can fix the error
    }


  const handleAddEmployee = (employeeData) => {
    const newEmployee = {
      id: String(Date.now()),
      ...employeeData,
      status: 'Available'
    };
    setEmployees(prev => [...prev, newEmployee]);
    alert('Employee added successfully!');
    setIsAddModalOpen(false);

  };

  const handleAssignTask = async (employeeId, taskDetails) => {
    try {
      const response = await fetch(`http://localhost:7700/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'On Job',
          currentOrder: taskDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign task');
      }

      await fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error assigning task:', error);
      alert(error.message);
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;

    
    try {
      const response = await fetch(`http://localhost:7700/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove employee');
      }

      await fetchEmployees(); // Refresh the list
      alert('Employee removed successfully!');
    } catch (error) {
      console.error('Error removing employee:', error);
      alert(error.message);
    }
  };

  const handleEditEmployee = async (employeeId, updatedEmployee) => {
    try {
      const response = await fetch(`http://localhost:7700/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update employee');
      }

      await fetchEmployees(); // Refresh the list
      alert('Employee updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert(error.message);
    }

    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    alert('Employee removed successfully!');
  };

  const handleEditEmployee = (employeeId, updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? {...emp, ...updatedEmployee} : emp))
    );
    alert('Employee updated successfully!');

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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-600">Loading employees...</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onRemoveClick={handleRemoveEmployee}
                onEdit={handleEditEmployee}
                isLoading={isLoading}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {error ? 'Failed to load employees' : 'No employees found'}
            </div>
          )}
        </div>
      )}

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
