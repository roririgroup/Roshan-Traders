import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Briefcase } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { EMPLOYEE_STATUS_CONFIG } from './employeeConstants';

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  

  // Mock employee data - in a real app, this would come from an API
  const employee = {
    id: id,
    name: 'John Doe',
    role: 'Software Engineer',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'Jan 2023',
    department: 'Engineering',
    manager: 'Sarah Wilson',
    salary: '$85,000',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    projects: [
      { name: 'E-commerce Platform', status: 'Active' },
      { name: 'Mobile App', status: 'Completed' },
      { name: 'API Development', status: 'In Progress' }
    ]
  };

  const statusConfig = EMPLOYEE_STATUS_CONFIG[employee.status];

  const handleImageError = (e) => {
    e.currentTarget.src = '/placeholder-avatar.png';
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/employees')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Employees
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#F08344] rounded-xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Employee Details</h1>
            <p className="text-slate-600">View and manage employee information</p>
          </div>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <img
                  src={employee.image}
                  alt={`${employee.name} profile`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={handleImageError}
                />
                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                  employee.status === 'Available' ? 'bg-green-500' :
                  employee.status === 'Unavailable' ? 'bg-red-500' : 'bg-amber-500'
                }`}></div>
              </div>

              <div className="mt-4 text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2>
                <p className="text-slate-600">{employee.role}</p>
                <Badge
                  color={statusConfig.color}
                  className="mt-2"
                >
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">{employee.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">Joined {employee.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Work Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-600">Manager: {employee.manager}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-medium">Salary: {employee.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Projects</h3>
          <div className="space-y-3">
            {employee.projects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-900">{project.name}</span>
                <Badge
                  variant={project.status === 'Active' ? 'success' : project.status === 'Completed' ? 'default' : 'warning'}
                  className="text-xs"
                >
                  {project.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
