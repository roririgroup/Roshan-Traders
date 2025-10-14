// employeeConstants.js
export const EMPLOYEE_STATUS_CONFIG = {
  Available: { 
    color: "green", 
    label: "Available" 
  },
  "On Job": { 
    color: "amber", 
    label: "On Job" 
  },
  Unavailable: { 
    color: "red", 
    label: "Unavailable" 
  },
};

export const MOCK_EMPLOYEES = [
  {
    id: "emp_001",
    name: "Sanjay Kumar",
    role: "Truck Owner",
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
    status: "Available",
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
  },
];

export const FILTER_OPTIONS = ["All", "Available", "On Job", "Unavailable"];