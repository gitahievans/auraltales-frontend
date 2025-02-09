"use client";

import { Divider, TextInput, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PhoneInputComponent from "./PhoneInput";
import { userState } from "@/state/state";
import { signIn, useSession } from "next-auth/react";

const SignupForm = ({
  opened,
  close,
  openLogin,
}: {
  opened: boolean;
  close: () => void;
  openLogin: () => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const { data: session } = useSession();

  console.log("session", session);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userPayload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      profile: {
        phone_number: phoneNumber,
      },
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      console.log("response", response);

      if (response.ok) {
        console.log("registered successfully");

        const data = await response.json();

        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        userState.isLoggedIn = true;
        userState.user = data.user;

        router.push("/");
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error Registering",
        message: "Registration failed, please try again",
        color: "red",
        position: "top-right",
      });
    }
  };

  const handlePhoneChange = (phone: string, isValid: boolean) => {
    setPhoneNumber(phone);
    setIsPhoneValid(isValid);
  };

  const handleHaveAccount = () => {
    close();
    openLogin();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="md"
      overlayProps={{
        opacity: 0.9,
        blur: 100,
        backgroundOpacity: 0.9,
      }}
      closeOnClickOutside={false}
      styles={{
        content: {
          backgroundColor: "#041714",
        },
        header: {
          backgroundColor: "#041714",
          color: "white",
        },
      }}
    >
      <section className="bg-primary flex items-center">
        <div className="flex flex-col w-full max-w-xl items-center justify-center mx-auto rounded-xl">
          <div className="w-full rounded-xl shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="space-y-4 md:space-y-3 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create a new account
              </h1>
              <div className="flex justify-center mb-3 w-full">
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center border border-gray-500 gap-4 font-medium rounded-xl text-white text-sm md:text-base px-5 py-2.5 shadow-md bg-transparent hover:bg-green-950 transition-colors w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="30"
                    height="30"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <p>Continue with Google</p>
                </button>
              </div>

              <Divider label="or" />

              <form
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-2"
                action="#"
              >
                {/* Username Input */}
                <TextInput
                  label="First Name"
                  radius="md"
                  size="md"
                  placeholder="First Name"
                  styles={{
                    input: {
                      backgroundColor: "transparent",
                      borderColor: "#6b7280",
                      color: "white",
                    },
                    label: {
                      color: "white",
                      fontSize: "14px",
                    },
                  }}
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <TextInput
                  label="Last Name"
                  radius="md"
                  size="md"
                  placeholder="Last Name"
                  styles={{
                    input: {
                      backgroundColor: "transparent",
                      borderColor: "#6b7280",
                      color: "white",
                    },
                    label: {
                      color: "white",
                      fontSize: "14px",
                    },
                  }}
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {/* Email Input */}
                <TextInput
                  label="Email"
                  radius="md"
                  size="md"
                  placeholder="Email"
                  styles={{
                    input: {
                      backgroundColor: "transparent",
                      borderColor: "#6b7280",
                      color: "white",
                    },
                    label: {
                      color: "white",
                      fontSize: "14px",
                    },
                  }}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* <TextInput
                                radius="md"
                                size="md"
                                placeholder="Phone Number"
                                styles={{
                                    input: {
                                        backgroundColor: "transparent",
                                        borderColor: "#6b7280",
                                        color: "white",
                                    },
                                }}
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            /> */}
                <PhoneInputComponent
                  defaultCountry="ke"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
                <TextInput
                  label="Password"
                  radius="md"
                  size="md"
                  placeholder="Password"
                  type="password"
                  styles={{
                    input: {
                      backgroundColor: "transparent",
                      borderColor: "#6b7280",
                      color: "white",
                    },
                    label: {
                      color: "white",
                      fontSize: "14px",
                    },
                  }}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full text-white bg-secondary border border-transparent hover:bg-green-950 hover:border hover:border-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300"
                >
                  Sign up
                </button>
                <div className="flex items-center justify-center">
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                  </p>
                  <div onClick={handleHaveAccount}>
                    <p className="cursor-pointer text-green-500 text-sm ml-1">
                      Sign In
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default SignupForm;
