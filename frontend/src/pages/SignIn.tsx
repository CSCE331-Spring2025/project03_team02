/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import useAppStore from "../utils/useAppStore";
import { FcGoogle } from "react-icons/fc";

// main component for user authentication
const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setEmployee = useAppStore(state => state.setEmployee);
    const setCustomer = useAppStore(state => state.setCustomer);

    // handle employee authentication with google
    async function signInEmployee(codeResponse: CodeResponse) {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/google_employee_login`,
                { code: codeResponse.code },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || "Login failed");
            } else {
                throw new Error("Login failed");
            }
        }
    }

    // handle customer authentication with google
    async function signInCustomer(codeResponse: CodeResponse) {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/google_customer_login`,
                { code: codeResponse.code },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || "Login failed");
            } else {
                throw new Error("Login failed");
            }
        }
    }

    // google login configuration for employees
    const googleEmployeeLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            try {
                const loginDetails = await signInEmployee(codeResponse);
                if (loginDetails) {
                    // Navigate to the employee view upon successful login.
                    setEmployee(loginDetails.user)
                    navigate("/");
                }
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        },
    });

    // google login configuration for customers
    const googleCustomerLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            try {
                const loginDetails = await signInCustomer(codeResponse);
                if (loginDetails) {
                    // Navigate to the employee view upon successful login.
                    setCustomer(loginDetails.user)
                    navigate("/customer");
                }
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        },
    });

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
            {/* Overlay Alert for Error Messages */}
            {errorMessage && (
                <div className="fixed inset-0 bg-opacity-50 z-50 m-auto mt-4 w-3xl">
                    <div
                        role="alert"
                        className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-red-600 font-semibold">
                            {errorMessage}
                        </span>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Sign In UI with Two Options */}
            <div className="flex flex-col space-y-4 w-full max-w-sm">
                {/* Employee sign in button */}
                <button
                    onClick={() => googleEmployeeLogin()}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white text-gray-700"
                >
                    <FcGoogle className="mr-2 text-xl" />
                    Sign in with Google (Employee)
                </button>

                {/* Customer view button */}
                <button
                    onClick={() => googleCustomerLogin()}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white text-gray-700"
                >
                    <FcGoogle className="mr-2 text-xl" />
                    Sign in with Google (Customer)
                </button>
            </div>
        </div>
    );
};

export default SignInPage;