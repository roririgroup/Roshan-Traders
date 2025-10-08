import React, { useState, useEffect } from "react";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeFilter from "./EmployeeFilter";
import EmployeeList from "./EmployeeList";
import AddEmployeeModal from "./AddEmployeeModal";
import ConfirmRemoveModal from "./ConfirmRemoveModal";
import { MOCK_EMPLOYEES } from "./employeeConstants";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  // Load data from localStorage + merge mock
  useEffect(() => {
    const saved = localStorage.getItem("employees");
    const parsed = saved ? JSON.parse(saved) : [];

    const merged = [...MOCK_EMPLOYEES, ...parsed].filter(
      (emp, index, self) => index === self.findIndex((e) => e.id === emp.id)
    );

    setEmployees(merged);
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleAssignEmployee = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, status: "On Job" } : emp
        )
      );
      setIsLoading(false);
    }, 1000);
  };

  const handleRemoveEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    setRemoveTarget(null);
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const filteredEmployees =
    filter === "All"
      ? employees
      : employees.filter((emp) => emp.status === filter);

  return (
    <section className="p-6" role="main" aria-labelledby="employees-heading">
      <EmployeeHeader onAddEmployee={() => setShowAddModal(true)} />
      
      <EmployeeFilter 
        currentFilter={filter} 
        onFilterChange={setFilter} 
      />

      <EmployeeList
        employees={filteredEmployees}
        onAssign={handleAssignEmployee}
        onRemoveClick={setRemoveTarget}
        isLoading={isLoading}
      />

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
        />
      )}

      {removeTarget && (
        <ConfirmRemoveModal
          onClose={() => setRemoveTarget(null)}
          onConfirm={() => handleRemoveEmployee(removeTarget)}
        />
      )}
    </section>
  );
};

export default EmployeesPage;
