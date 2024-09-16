import Image from "next/image";
import React from "react";
import CustomInput from "../common/CustomInput";
import { TextInput } from "@mantine/core";
import Link from "next/link";

const LoginForm = () => {
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
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <TextInput radius='md' size="md" placeholder="Email" styles={{ input: { backgroundColor: 'transparent', borderColor: '#6b7280', color: 'white' } }} />
                            <TextInput radius='md' size="md" placeholder="Password" styles={{ input: { backgroundColor: 'transparent', borderColor: '#6b7280', color: 'white' } }} />

                            {/* TODO: Remember me to be added here */}
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet?{" "}
                                <a
                                    href="#"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;
