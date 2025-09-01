import React from "react";
import {
  ClerkProvider as BaseClerkProvider,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/clerk-react";
import { clerkConfig } from "../config/clerk";

interface ClerkProviderProps {
  children: React.ReactNode;
}

export default function ClerkProvider({ children }: ClerkProviderProps) {
  if (
    !clerkConfig.publishableKey ||
    clerkConfig.publishableKey === "pk_test_your_publishable_key_here"
  ) {
    console.warn(
      "Clerk publishable key not found or not configured. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file."
    );

    // Return a more helpful error message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Clerk Configuration Missing
            </h2>
            <p className="text-gray-600 mb-4">
              To use social media authentication, you need to configure Clerk.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <h3 className="font-medium text-gray-900 mb-2">
              Setup Instructions:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>
                Sign up at{" "}
                <a
                  href="https://clerk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  clerk.com
                </a>
              </li>
              <li>Create a new application</li>
              <li>Go to API Keys in your dashboard</li>
              <li>Copy your Publishable Key</li>
              <li>
                Create a <code className="bg-gray-200 px-1 rounded">.env</code>{" "}
                file in your project root
              </li>
              <li>
                Add:{" "}
                <code className="bg-gray-200 px-1 rounded">
                  VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
                </code>
              </li>
              <li>Replace with your actual key</li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>For now, you can still use email/password authentication.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseClerkProvider publishableKey={clerkConfig.publishableKey}>
      <ClerkLoading>
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner">Loading Clerk...</div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </BaseClerkProvider>
  );
}
