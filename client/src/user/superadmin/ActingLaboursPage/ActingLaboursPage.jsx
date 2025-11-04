import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  UserCheck,
  Building2,
  Truck,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  User
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';


export default function ActingLaboursPage() {
  const [labours, setLabours] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [truckOwners, setTruckOwners] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddTruckOwnerModalOpen, setIsAddTruckOwnerModalOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    assignTo: '',
    assignType: 'manufacturer', // 'manufacturer' or 'truckOwner'
    role: 'driver' // 'driver' or 'loadman'
  });
  const [addForm, setAddForm] = useState({
    name: '',
    type: 'driver',
    phone: '',
    email: '',
    location: '',
    experience: 0,
    rating: 0
  });
  const [addTruckOwnerForm, setAddTruckOwnerForm] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    vehicleType: '',
    vehicleCapacity: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [actingLaboursResponse, manufacturersResponse] = await Promise.all([
        fetch('http://localhost:7700/api/acting-labours'),
        fetch('http://localhost:7700/api/manufacturers')
      ]);

      const actingLabours = actingLaboursResponse.ok ? await actingLaboursResponse.json() : [];
      const manufacturersData = manufacturersResponse.ok ? await manufacturersResponse.json() : [];

      // Transform acting labours into a consistent format
      const combinedLabours = actingLabours.map((labour) => ({
        id: `acting-${labour.id}`,
        name: labour.name || 'Unknown',
        type: (labour.type || '').toLowerCase(),
        phone: labour.phone || '',
        email: labour.email || '',
        location: labour.location || 'Not specified',
        status: (labour.status || 'available').toLowerCase(),
        rating: Number(labour.rating) || 0,
        experience: Number(labour.experience) || 0,
        assignedTo: labour.assignedToId
          ? manufacturersData.find(m => m.id === labour.assignedToId)?.companyName
          : null,
        assignedType: labour.assignedToType,
        originalData: labour,
        source: 'acting_labour'
      }));

      setLabours(combinedLabours);
      setManufacturers(manufacturersData);
      setTruckOwners([]); // No truck owners for assignment in acting labours

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredLabours = labours.filter((labour) => {
    const matchesSearch =
      labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || labour.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || labour.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAssign = (labour) => {
    setSelectedLabour(labour);
    setAssignmentForm({
      assignTo: labour.assignedTo || '',
      assignType: labour.assignedType || 'manufacturer',
      role: labour.type
    });
    setIsAssignModalOpen(true);
  };

  const handleAssignmentSubmit = async () => {
    if (!selectedLabour || !assignmentForm.assignTo) {
      alert('Please select an assignment target');
      return;
    }

    try {
      // Find the target ID based on the selected name
      let assignedToId = null;
      let assignedToType = assignmentForm.assignType;

      if (assignedToType === 'manufacturer') {
        const manufacturer = manufacturers.find(m => m.companyName === assignmentForm.assignTo);
        assignedToId = manufacturer?.id;
        assignedToType = 'manufacturer';
      } else if (assignedToType === 'truckOwner') {
        const truckOwner = truckOwners.find(t => (t.companyName || t.name) === assignmentForm.assignTo);
        assignedToId = truckOwner?.id;
        assignedToType = 'truck_owner';
      }

      if (!assignedToId) {
        alert('Selected target not found');
        return;
      }

      // Extract the actual labour ID (remove prefix for acting labours)
      const labourId = selectedLabour.id.startsWith('acting-') ? selectedLabour.id.replace('acting-', '') : selectedLabour.id;

      // Make API call to assign labour
      const response = await fetch(`http://localhost:7700/api/acting-labours/${labourId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedToId: assignedToId,
          assignedToType: assignedToType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign labour');
      }

      // Refresh data to get updated state
      await fetchData();
      setIsAssignModalOpen(false);
      setSelectedLabour(null);
      alert('Labour assigned successfully!');

    } catch (error) {
      console.error('Error assigning labour:', error);
      alert(`Failed to assign labour: ${error.message}`);
    }
  };

  const handleUnassign = async (labourId) => {
    if (window.confirm('Are you sure you want to unassign this labour?')) {
      try {
        // Extract the actual labour ID (remove prefix for acting labours)
        const actualLabourId = labourId.startsWith('acting-') ? labourId.replace('acting-', '') : labourId;

        // Make API call to unassign labour
        const response = await fetch(`http://localhost:7700/api/acting-labours/${actualLabourId}/unassign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to unassign labour');
        }

        // Refresh data to get updated state
        await fetchData();
        alert('Labour unassigned successfully!');

      } catch (error) {
        console.error('Error unassigning labour:', error);
        alert(`Failed to unassign labour: ${error.message}`);
      }
    }
  };

  const handleAddLabour = async () => {
    if (!addForm.name || !addForm.phone || !addForm.location) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Make API call to add acting labour
      const response = await fetch('http://localhost:7700/api/acting-labours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: addForm.name,
          type: addForm.type.toUpperCase(),
          phone: addForm.phone,
          email: addForm.email || null,
          location: addForm.location,
          experience: addForm.experience || 0,
          rating: addForm.rating || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add labour');
      }

      // Refresh data to get updated state
      await fetchData();
      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        type: 'driver',
        phone: '',
        email: '',
        location: '',
        experience: 0,
        rating: 0
      });
      alert('Acting labour added successfully!');

    } catch (error) {
      console.error('Error adding labour:', error);
      alert(`Failed to add labour: ${error.message}`);
    }
  };

  const handleAddTruckOwner = async () => {
    if (!addTruckOwnerForm.name || !addTruckOwnerForm.phone || !addTruckOwnerForm.address) {
      alert('Please fill in all required fields (Name, Phone, Address)');
      return;
    }

    try {
      // Make API call to add truck owner as acting labour
      const response = await fetch('http://localhost:7700/api/acting-labours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: addTruckOwnerForm.name,
          type: 'TRUCK_OWNER',
          phone: addTruckOwnerForm.phone,
          email: addTruckOwnerForm.email || null,
          location: addTruckOwnerForm.address,
          experience: 0,
          rating: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add truck owner');
      }

      // Refresh data to get updated state
      await fetchData();
      setIsAddTruckOwnerModalOpen(false);
      setAddTruckOwnerForm({
        name: '',
        companyName: '',
        phone: '',
        email: '',
        address: '',
        licenseNumber: '',
        vehicleType: '',
        vehicleCapacity: ''
      });
      alert('Truck owner added successfully!');

    } catch (error) {
      console.error('Error adding truck owner:', error);
      alert(`Failed to add truck owner: ${error.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'assigned':
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'busy':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading labours...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Acting Labours</h1>
              <p className="text-slate-600 mt-2">Manage and assign drivers and load men to manufacturers and truck owners</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div className="text-2xl font-bold text-slate-900">{filteredLabours.length}</div>
                <div className="text-sm text-slate-600">Total Labours</div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredLabours.filter(l => l.assignedTo).length}
                </div>
                <div className="text-sm text-slate-600">Assigned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400"
              />
            </div>

            {/* Filters and Add Buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Add Labour Button */}
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Labour
              </Button>

              {/* Add Truck Owner Button */}
              <Button
                onClick={() => setIsAddTruckOwnerModalOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Add Truck Owner
              </Button>

              {/* Type Filter */}
              <div className="relative flex items-center">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="driver">Drivers</option>
                  <option value="loadman">Load Men</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative flex items-center">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="busy">Busy</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Labours Grid */}
        {filteredLabours.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabours.map((labour) => (
              <div
                key={labour.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {labour.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{labour.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{labour.type}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(labour.status)}`}>
                      {getStatusIcon(labour.status)}
                      <span className="capitalize">{labour.status}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{labour.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{labour.phone}</span>
                    </div>
                    {labour.rating > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{labour.rating} rating</span>
                      </div>
                    )}
                  </div>

                  {labour.assignedTo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <UserCheck className="w-4 h-4" />
                        <span>
                          Assigned to {labour.assignedType === 'manufacturer' ? 'Manufacturer' : 'Truck Owner'}: {labour.assignedTo}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAssign(labour)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {labour.assignedTo ? 'Reassign' : 'Assign'}
                    </Button>
                    {labour.assignedTo && (
                      <Button
                        onClick={() => handleUnassign(labour.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-3xl p-16 max-w-lg mx-auto border border-gray-200 shadow-md">
              <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No labours found</h3>
              <p className="text-gray-500 mb-8">
                Your search and filter criteria did not match any labours.
                Try broadening your search.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedLabour(null);
        }}
        title={`Assign ${selectedLabour?.name || 'Labour'}`}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="manufacturer"
                  checked={assignmentForm.assignType === 'manufacturer'}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, assignType: e.target.value })}
                  className="mr-2"
                />
                <Building2 className="w-4 h-4 mr-2" />
                Manufacturer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="truckOwner"
                  checked={assignmentForm.assignType === 'truckOwner'}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, assignType: e.target.value })}
                  className="mr-2"
                />
                <Truck className="w-4 h-4 mr-2" />
                Truck Owner
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select {assignmentForm.assignType === 'manufacturer' ? 'Manufacturer' : 'Truck Owner'}
            </label>
            <select
              value={assignmentForm.assignTo}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, assignTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              {assignmentForm.assignType === 'manufacturer'
                ? manufacturers.map(m => (
                    <option key={m.id} value={m.companyName}>{m.companyName}</option>
                  ))
                : truckOwners.map(t => (
                    <option key={t.id} value={t.companyName || t.name}>{t.companyName || t.name}</option>
                  ))
              }
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignModalOpen(false);
                setSelectedLabour(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignmentSubmit}>
              Assign Labour
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Labour Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddForm({
            name: '',
            type: 'driver',
            phone: '',
            email: '',
            location: '',
            experience: 0,
            rating: 0
          });
        }}
        title="Add Acting Labour"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter labour name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={addForm.type}
              onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="driver">Driver</option>
              <option value="loadman">Load Man</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="text"
              value={addForm.phone}
              onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={addForm.location}
              onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (years)
              </label>
              <input
                type="number"
                value={addForm.experience}
                onChange={(e) => setAddForm({ ...addForm, experience: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <input
                type="number"
                value={addForm.rating}
                onChange={(e) => setAddForm({ ...addForm, rating: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setAddForm({
                  name: '',
                  type: 'driver',
                  phone: '',
                  email: '',
                  location: '',
                  experience: 0,
                  rating: 0
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddLabour}>
              Add Labour
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Truck Owner Modal */}
      <Modal
        isOpen={isAddTruckOwnerModalOpen}
        onClose={() => {
          setIsAddTruckOwnerModalOpen(false);
          setAddTruckOwnerForm({
            name: '',
            companyName: '',
            phone: '',
            email: '',
            address: '',
            licenseNumber: '',
            vehicleType: '',
            vehicleCapacity: ''
          });
        }}
        title="Add Truck Owner"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name *
            </label>
            <input
              type="text"
              value={addTruckOwnerForm.name}
              onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter owner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={addTruckOwnerForm.companyName}
              onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="text"
              value={addTruckOwnerForm.phone}
              onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={addTruckOwnerForm.email}
              onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              value={addTruckOwnerForm.address}
              onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full address"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={addTruckOwnerForm.licenseNumber}
                onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, licenseNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="License number (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={addTruckOwnerForm.vehicleType}
                onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, vehicleType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select vehicle type</option>
                <option value="truck">Truck</option>
                <option value="trailer">Trailer</option>
                <option value="container">Container</option>
                <option value="lorry">Lorry</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Capacity
            </label>
            <input
              type="text"
              value={addTruckOwnerForm.vehicleCapacity}
              onChange={(e) => setAddTruckOwnerForm({ ...addTruckOwnerForm, vehicleCapacity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10 tons, 20 ft container (optional)"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddTruckOwnerModalOpen(false);
                setAddTruckOwnerForm({
                  name: '',
                  companyName: '',
                  phone: '',
                  email: '',
                  address: '',
                  licenseNumber: '',
                  vehicleType: '',
                  vehicleCapacity: ''
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTruckOwner}>
              Add Truck Owner
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}