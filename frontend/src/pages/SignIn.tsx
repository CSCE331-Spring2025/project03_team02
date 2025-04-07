import React, { useState } from "react";
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router";
import { FcGoogle } from 'react-icons/fc';

const SignInPage: React.FC = () => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function getUserInfo(codeResponse: CodeResponse) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/google_login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: codeResponse.code }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Login failed");
        }

        return await response.json();
    }

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            try {
                const loginDetails = await getUserInfo(codeResponse);
                if (loginDetails) {
                    navigate('/')
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setErrorMessage(err.message);
            }
        },
    });

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
            {/* Overlay Alert */}
            {errorMessage && (
                <div className="fixed inset-0 bg-opacity-50 z-50 m-auto mt-4 w-3xl">
                    <div role="alert" className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-600 font-semibold">{errorMessage}</span>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Sign-In UI */}
            <button
                onClick={() => googleLogin()}
                className="flex items-center justify-center w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white text-gray-700 mb-6"
            >
                <FcGoogle className="mr-2 text-xl" />
                Sign in with Google
            </button>
        </div>
    );
};

export default SignInPage;