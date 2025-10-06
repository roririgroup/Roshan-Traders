import React, { useState, useEffect } from 'react';
import { UserCheck, X, Check, Clock, User, Factory, Truck, Wrench, Search, Filter, Mail, Phone, Calendar } from 'lucide-react';

const SignUpApprovalPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    const rejected = JSON.parse(localStorage.getItem('rejectedUsers') || '[]');
    
    setPendingUsers(pending);
    setApprovedUsers(approved);
    setRejectedUsers(rejected);
  };

  const approveUser = (user) => {
    const updatedPending = pendingUsers.filter(u => u.id !== user.id);
    const updatedApproved = [...approvedUsers, { 
      ...user, 
      status: 'approved', 
      approvedAt: new Date().toISOString(),
      approvedBy: 'Super Admin'
    }];
    
    setPendingUsers(updatedPending);
    setApprovedUsers(updatedApproved);
    
    localStorage.setItem('pendingUsers', JSON.stringify(updatedPending));
    localStorage.setItem('approvedUsers', JSON.stringify(updatedApproved));
    
    // Show success message
    alert(`User ${user.firstName} ${user.lastName} has been approved!`);
  };

  const rejectUser = (user) => {
    const updatedPending = pendingUsers.filter(u => u.id !== user.id);
    const updatedRejected = [...rejectedUsers, { 
      ...user, 
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Super Admin'
    }];
    
    setPendingUsers(updatedPending);
    setRejectedUsers(updatedRejected);
    
    localStorage.setItem('pendingUsers', JSON.stringify(updatedPending));
    localStorage.setItem('rejectedUsers', JSON.stringify(updatedRejected));
    
    // Show rejection message
    alert(`User ${user.firstName} ${user.lastName} has been rejected.`);
  };

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'agent': return <User className="w-4 h-4" />;
      case 'manufacturer': return <Factory className="w-4 h-4" />;
      case 'truck owner': return <Truck className="w-4 h-4" />;
      case 'driver': return <Wrench className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'agent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manufacturer': return 'bg-green-100 text-green-800 border-green-200';
      case 'truck owner': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'driver': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredUsers = () => {
    let users = [];
    
    switch(activeTab) {
      case 'pending':
        users = pendingUsers;
        break;
      case 'approved':
        users = approvedUsers;
        break;
      case 'rejected':
        users = rejectedUsers;
        break;
      default:
        users = [];
    }

    // Apply search filter
    if (searchTerm) {
      users = users.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      users = users.filter(user => user.role?.toLowerCase() === roleFilter.toLowerCase());
    }

    return users;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SignUp Approval</h1>
              <p className="text-gray-600">Manage user registration requests and approvals</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="agent">Agent</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="truck owner">Truck Owner</option>
                <option value="driver">Driver</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{pendingUsers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Users</p>
                <p className="text-2xl font-bold text-gray-900">{approvedUsers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Users</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedUsers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-yellow-500 text-yellow-600 bg-yellow-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Pending Approval
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {pendingUsers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Approved Users
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {approvedUsers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-red-500 text-red-600 bg-red-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <X className="w-4 h-4 mr-2" />
              Rejected Users
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {rejectedUsers.length}
              </span>
            </button>
          </div>

          {/* Users List */}
          <div className="p-6">
            {filteredUsers().length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'pending' && 'No Pending Approvals'}
                  {activeTab === 'approved' && 'No Approved Users'}
                  {activeTab === 'rejected' && 'No Rejected Users'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'pending' && 'All registration requests have been processed.'}
                  {activeTab === 'approved' && 'No users have been approved yet.'}
                  {activeTab === 'rejected' && 'No users have been rejected yet.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers().map((user) => (
                  <div 
                    key={user.id} 
                    className={`border rounded-lg p-6 transition-all hover:shadow-md ${
                      activeTab === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                      activeTab === 'approved' ? 'border-green-200 bg-green-50' :
                      'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            activeTab === 'pending' ? 'bg-yellow-100' :
                            activeTab === 'approved' ? 'bg-green-100' :
                            'bg-red-100'
                          }`}>
                            {activeTab === 'pending' && <Clock className="w-6 h-6 text-yellow-600" />}
                            {activeTab === 'approved' && <UserCheck className="w-6 h-6 text-green-600" />}
                            {activeTab === 'rejected' && <X className="w-6 h-6 text-red-600" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {getRoleIcon(user.role)}
                                <span className="ml-1">{user.role}</span>
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Registered: {formatDate(user.createdAt)}</span>
                            </div>
                            {user.approvedAt && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Approved: {formatDate(user.approvedAt)}</span>
                              </div>
                            )}
                            {user.rejectedAt && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span>Rejected: {formatDate(user.rejectedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {activeTab === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => approveUser(user)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectUser(user)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpApprovalPage;