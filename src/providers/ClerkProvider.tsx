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
  if (!clerkConfig.publishableKey) {
    console.warn(
      "Clerk publishable key not found. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file."
    );
    return <div>Error: Clerk configuration missing</div>;
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
