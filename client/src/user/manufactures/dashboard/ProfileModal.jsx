import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, profile, isEditing, setProfile, handleInputChange, handleServiceChange, handleSave, handleCancel }) => {
  const profileFields = [
    {
      label: 'Full Name',
      name: 'name',
      type: 'text',
      icon: User,
      placeholder: 'Enter your full name'
    },
    {
      label: 'Email Address',
      name: 'email',
      type: 'email',
      icon: Mail,
      placeholder: 'Enter your email'
    },
    
    {
      label: 'Phone Number',
      name: 'phone',
      type: 'tel',
      icon: Phone,
      placeholder: 'Enter your phone number'
    },
    {
      label: 'Address',
      name: 'address',
      type: 'textarea',
      icon: MapPin,
      placeholder: 'Enter your address'
    },
    {
      label: 'Bank Details',
      name: 'bankDetails',
      type: 'text',
      icon: CreditCard,
      placeholder: 'Enter bank account details'
    },
    {
      label: 'UPI ID',
      name: 'upiId',
      type: 'text',
      icon: CreditCard,
      placeholder: 'Enter your UPI ID'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
        <div className="space-y-6">
          {profileFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <field.icon className="size-5 text-slate-400" />
                </div>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${
                      isEditing ? 'bg-white' : 'bg-slate-50'
                    }`}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${
                      isEditing ? 'bg-white' : 'bg-slate-50'
                    }`}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={profile.role}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${
                isEditing ? 'bg-white' : 'bg-slate-50'
              }`}
            >
              <option value="">Select Role</option>
              <option value="agent">Agent</option>
              <option value="manufactures">Manufactures</option>
            </select>
          </div>

          {/* Services Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Services
            </label>
            <div className="space-y-2">
              {['wood', 'sand', 'bricks', 'truck'].map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                    disabled={!isEditing}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                  />
                  <span className={`text-sm capitalize ${!isEditing ? 'text-slate-500' : 'text-slate-700'}`}>
                    {service}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
