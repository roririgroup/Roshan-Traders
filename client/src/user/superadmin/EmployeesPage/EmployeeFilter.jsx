import React from "react";
import Button from '../../../components/ui/Button';

const EmployeeFilter = ({ currentFilter, onFilterChange }) => {
  const filterOptions = ["All", "Available", "On Job", "Unavailable"];

  return (
    <div className="mb-4 flex gap-2">
      {filterOptions.map((status) => (
        <Button
          key={status}
          variant={currentFilter === status ? "default" : "secondary"}
          size="sm"
          onClick={() => onFilterChange(status)}
        >
          {status}
        </Button>
      ))}
    </div>
    
  );
};


export default EmployeeFilter;
