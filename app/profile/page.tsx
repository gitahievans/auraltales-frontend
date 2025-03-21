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

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  business_phone: string | null;
  is_seller: boolean;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session?.jwt) {
      fetchUserProfile();
    }
  }, [session?.jwt]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/profile/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch profile data",
        color: "red",
      });
    }
  };

  const handleProfileUpdate = async (updatedProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    businessPhone: string;
  }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/update-profile/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            email: updatedProfile.email,
            phoneNumber: updatedProfile.phoneNumber,
            businessPhone: updatedProfile.businessPhone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      // Update the local state with the returned data
      setUserProfile({
        ...userProfile!,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: data.user.email,
        phone_number: data.user.phone_number,
        business_phone: data.user.business_phone,
      });

      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update profile",
        color: "red",
      });
    }
  };

  if (!session || !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-[60dvh] bg-primary">
        <Loader type="dots" />
        <p className="ml-2 text-white text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80dvh] bg-primary py-10 px-4 flex items-center justify-center">
      <EditProfileModal
        opened={opened}
        onClose={close}
        initialUserData={{
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          email: userProfile.email,
          phoneNumber: userProfile.phone_number || "",
          businessPhone: userProfile.business_phone || "",
        }}
        onSubmit={handleProfileUpdate}
      />
      <div className="w-full max-w-xl">
        {/* Profile Card */}
        <div className="bg-primary shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                  width={96}
                  height={96}
                />
                <span className="absolute bottom-0 right-0 block h-6 w-6 rounded-full bg-green-500 ring-2 ring-white"></span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {userProfile.first_name} {userProfile.last_name}
                </h2>
                <p className="text-green-100 opacity-90">{userProfile.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4">
                <IconUser className="text-green-500" size={28} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Full Name</p>
                  <p className="font-semibold">
                    {userProfile.first_name} {userProfile.last_name}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4">
                <IconMail className="text-green-500" size={28} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Email</p>
                  <p className="font-semibold">{userProfile.email}</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4">
                <IconPhone className="text-green-500" size={28} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Phone</p>
                  <p className="font-semibold">{userProfile.phone_number}</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4">
                <IconBuilding className="text-green-500" size={28} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Business Phone
                  </p>
                  <p className="font-semibold">
                    {userProfile.business_phone || "Not Provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex items-center space-x-4">
                <IconBadge className="text-green-600" size={28} />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Account Status
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userProfile.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userProfile.is_active ? "Active" : "Inactive"}
                    </span>
                    {userProfile.is_seller && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Seller
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <IconCalendar size={20} />
              <span className="text-sm">
                Joined: {new Date(userProfile.date_joined).toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={open}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <IconEdit size={20} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
