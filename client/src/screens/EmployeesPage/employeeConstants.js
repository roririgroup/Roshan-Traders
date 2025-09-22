// employeeConstants.js
export const EMPLOYEE_STATUS_CONFIG = {
  Available: { 
    className: "bg-green-100 text-green-800", 
    label: "Available" 
  },
  "On Job": { 
    className: "bg-amber-100 text-amber-800", 
    label: "On Job" 
  },
  Unavailable: { 
    className: "bg-red-100 text-red-800", 
    label: "Unavailable" 
  },
};

export const MOCK_EMPLOYEES = [
  {
    id: "emp_001",
    name: "Sanjay Kumar",
    role: "Driver",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "emp_002",
    name: "Karan Singh",
    role: "Loader",
    status: "On Job",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "emp_003",
    name: "Singh",
    role: "Loader",             
    status: "Unavailable",
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
  },
];

export const FILTER_OPTIONS = ["All", "Available", "On Job", "Unavailable"];