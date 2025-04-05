/* eslint-disable react/jsx-no-undef */
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconBuilding,
  IconCalendar,
  IconEdit,
  IconBadge,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import EditProfileModal from "../../components/Modals/EditProfileModal";
import { useDisclosure } from "@mantine/hooks";
import { Loader } from "@mantine/core";
import apiClient from "@/lib/apiClient";
import { useValidSession } from "@/hooks/useValidSession";

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_seller: boolean;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, session, status } = useValidSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  console.log("Session profile page:", session);

  useEffect(() => {
    if (session?.jwt) {
      fetchUserProfile();
    }
  }, [session?.jwt]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get<UserProfile>("/accounts/profile/");
      if (response.status === 200) {
        console.log("User profile data:", response.data);

        setUserProfile(response.data); // Ensure state is updated
      } else {
        throw new Error("Failed to fetch profile.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      notifications.show({
        title: "Error",
        message: "Failed to load profile",
        color: "red",
      });
    }
  };

  const handleProfileUpdate = async (updatedUser: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => {
    const updatedProfile = {
      first_name: updatedUser.firstName,
      last_name: updatedUser.lastName,
      email: updatedUser.email,
      phone_number: updatedUser.phoneNumber,
    };
    try {
      const response = await apiClient.patch<UserProfile>(
        "/accounts/update-profile/",
        updatedProfile
      );
      if (response.status === 200) {
        setUserProfile(response.data); // Ensure updated data is stored
        notifications.show({
          title: "Success",
          message: "Profile updated successfully",
          color: "green",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update profile",
        color: "red",
      });
    }
  };

  if (!session?.jwt) {
    return (
      <div className="flex justify-center items-center min-h-[60dvh] bg-primary">
        <Loader />
        <p className="ml-2 text-white text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80dvh] bg-gray-900 py-8 px-4 flex items-center justify-center">
      <EditProfileModal
        opened={opened}
        onClose={close}
        initialUserData={{
          firstName: userProfile?.first_name || "",
          lastName: userProfile?.last_name || "",
          email: userProfile?.email || "",
          phoneNumber: userProfile?.phone || "",
        }}
        onSubmit={handleProfileUpdate}
      />
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover shadow-lg"
                  width={96}
                  height={96}
                />
                <span className="absolute bottom-0 right-0 block h-6 w-6 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {userProfile?.first_name} {userProfile?.last_name}
                </h2>
                <p className="text-green-100 opacity-90 text-sm sm:text-base">
                  {userProfile?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-100 transition-colors">
                <IconUser className="text-green-600" size={24} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Full Name
                  </p>
                  <p className="font-semibold text-gray-800">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-100 transition-colors">
                <IconMail className="text-green-600" size={24} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Email
                  </p>
                  <p className="font-semibold text-gray-800">
                    {userProfile?.email}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-100 transition-colors">
                <IconPhone className="text-green-600" size={24} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-800">
                    {userProfile?.phone || "Not Provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-center space-x-4">
                <IconBadge className="text-green-600" size={24} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Account Status
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userProfile?.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userProfile?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-6 border-t border-gray-200 flex justify-center">
            <button
              onClick={open}
              className="bg-green-500 flex items-center text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-md"
            >
              <IconEdit size={20} className="mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
