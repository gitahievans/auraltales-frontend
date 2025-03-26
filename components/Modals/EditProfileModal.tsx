import React, { useState, useEffect } from 'react';
import { Modal } from '@mantine/core';

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
  initialUserData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessPhone: string;
  };
  onSubmit: (updatedUser: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessPhone: string;
  }) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  opened,
  onClose,
  initialUserData,
  onSubmit
}) => {
  const [editedUser, setEditedUser] = useState(initialUserData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (opened) {
      setEditedUser(initialUserData);
      setErrors({});
    }
  }, [opened, initialUserData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editedUser.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!editedUser.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!editedUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!editedUser.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(editedUser);
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Edit Profile" 
      centered
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={editedUser.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-green-500 focus:ring focus:ring-green-200`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={editedUser.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-green-500 focus:ring focus:ring-green-200`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-green-500 focus:ring focus:ring-green-200`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            value={editedUser.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-green-500 focus:ring focus:ring-green-200`}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Phone (Optional)
          </label>
          <input
            type="tel"
            value={editedUser.businessPhone}
            onChange={(e) => handleInputChange('businessPhone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-green-500 focus:ring focus:ring-green-200"
            placeholder="Enter business phone number"
          />
        </div>

        <div className="flex space-x-4 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg 
              hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg 
              hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;