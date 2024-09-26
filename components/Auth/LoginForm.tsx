'use client';

import Image from "next/image";
import React, { useState } from "react";
import CustomInput from "../common/CustomInput";
import { Divider, TextInput } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { userState } from "@/state/state";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, password }),
      });

      console.log("response", response);

      if (response.ok) {
        console.log("logged in successfully");
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        userState.user = data.user;
        userState.isLoggedIn = true;

        setSuccess("Login successful!");
        setError("");
        router.push("/");
      } else {
        notifications.show({
          title: 'Error Loggin in',
          message: 'Login failed, please try again',
          color: 'red',
          position: 'top-right',
        })
        const errorData = await response.json();
        setError(errorData.detail || "Login failed");
        setSuccess("");
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error Loggin in',
        message: { error },
      })
      setError("An error occurred");
      setSuccess("");
    }
  };

  return (
    <section className="bg-primary flex items-center md:min-h-[80dvh]">
      <div className="md:w-[60%] ">
        <h1 className="text-7xl text-white">Welcome Back!</h1>
      </div>
      <div className="md:w-[40%] flex flex-col items-center justify-center px-6 py-8 mx-auto border border-gray-600 rounded-xl">
        <Link
          href="#"
          className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            width={32}
            height={32}
          />
          SoundLeaf
        </Link>
        <div className="w-full rounded-xl shadow md:mt-0 sm:max-w-md xl:p-0 ">
          <form onSubmit={handleSubmit} className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <div className="flex justify-center mb-6 w-full">
              <button className="flex items-center border border-gray-500 gap-4 font-medium rounded-xl text-white text-sm md:text-base px-5 py-2.5 shadow-md bg-transparent hover:bg-green-950 transition-colors w-full">
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
                <p>Signin with Google</p>
              </button>
            </div>

            <Divider label="or" />

            <div className="space-y-4 md:space-y-6">
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                radius="md"
                size="md"
                placeholder="Email"
                styles={{
                  input: {
                    backgroundColor: "transparent",
                    borderColor: "#6b7280",
                    color: "white",
                  },
                }}
              />
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                radius="md"
                size="md"
                placeholder="Password"
                styles={{
                  input: {
                    backgroundColor: "transparent",
                    borderColor: "#6b7280",
                    color: "white",
                  },
                }}
              />

              {/* TODO: Remember me to be added here */}
              <button
                type="submit"
                className="w-full text-white bg-secondary border border-transparent hover:bg-green-950 hover:border hover:border-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="/auth/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
