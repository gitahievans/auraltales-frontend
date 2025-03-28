import React, { useState, useEffect } from "react";
import { Modal, TextInput, Button, Group } from "@mantine/core";
import { User, Mail, Phone, X } from "lucide-react";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
  initialUserData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  onSubmit: (updatedUser: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  opened,
  onClose,
  initialUserData,
  onSubmit,
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
      newErrors.firstName = "First name is required";
    }

    if (!editedUser.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!editedUser.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!editedUser.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
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
      title={
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-green-600" />
          <span className="text-lg font-semibold text-gray-800">
            Edit Profile
          </span>
        </div>
      }
      centered
      size="lg"
      classNames={{
        root: "rounded-xl shadow-lg p-6 bg-white",
        title: "text-lg font-semibold",
        close: "text-gray-500 hover:text-gray-700",
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            value={editedUser.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            error={errors.firstName}
            leftSection={<User className="h-5 w-5 text-gray-500" />}
            classNames={{
              input:
                "border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg",
              label: "text-sm font-medium text-gray-700 mb-1",
              error: "text-sm text-red-500 mt-1",
            }}
            withAsterisk
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            value={editedUser.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            error={errors.lastName}
            leftSection={<User className="h-5 w-5 text-gray-500" />}
            classNames={{
              input:
                "border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg",
              label: "text-sm font-medium text-gray-700 mb-1",
              error: "text-sm text-red-500 mt-1",
            }}
            withAsterisk
          />
        </div>

        <TextInput
          label="Email Address"
          placeholder="Enter email address"
          value={editedUser.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          leftSection={<Mail className="h-5 w-5 text-gray-500" />}
          classNames={{
            input:
              "border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg",
            label: "text-sm font-medium text-gray-700 mb-1",
            error: "text-sm text-red-500 mt-1",
          }}
          withAsterisk
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          value={editedUser.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          error={errors.phoneNumber}
          leftSection={<Phone className="h-5 w-5 text-gray-500" />}
          classNames={{
            input:
              "border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg",
            label: "text-sm font-medium text-gray-700 mb-1",
            error: "text-sm text-red-500 mt-1",
          }}
          withAsterisk
        />

        <Group className="mt-6" grow>
          <Button
            onClick={onClose}
            variant="outline"
            color="gray"
            className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            leftSection={<X className="h-5 w-5" />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="green"
            className="rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
            leftSection={<User className="h-5 w-5" />}
          >
            Save Changes
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
