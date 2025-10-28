import React, { useState } from 'react';
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

  const handleAssignTask = (employeeId, taskDetails) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === employeeId
          ? { ...emp, status: 'On Job', currentOrder: taskDetails }
          : emp
      )
    );
  };

  const handleRemoveEmployee = (employeeId) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    alert('Employee removed successfully!');
  };

  const handleEditEmployee = (employeeId, updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? {...emp, ...updatedEmployee} : emp))
    );
    alert('Employee updated successfully!');
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

      <div className="mb-4 text-sm text-gray-600">
        Total employees: {employees.length}
      </div>

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
          <div className="text-center py-8 text-gray-500">No employees found</div>
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
