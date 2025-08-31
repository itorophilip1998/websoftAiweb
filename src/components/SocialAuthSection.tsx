import React from "react";
import SocialButton from "./SocialButton";
import { useClerkAuthentication } from "../hooks/useClerkAuth";

interface SocialAuthSectionProps {
  className?: string;
  mode?: "signin" | "signup";
  disabled?: boolean;
}

export default function SocialAuthSection({
  className = "",
  mode = "signin",
  disabled = false,
}: SocialAuthSectionProps) {
  const { signInWithOAuth, signUpWithOAuth } = useClerkAuthentication();

  const handleOAuthClick = async (
    provider: "google" | "facebook" | "apple"
  ) => {
    if (mode === "signin") {
      await signInWithOAuth(provider);
    } else {
      await signUpWithOAuth(provider);
    }
  };

  return (
    <div className={`social-auth-section ${className}`}>
      <div className="divider">
        <span>or continue with</span>
      </div>

      <div className="social-buttons">
        <SocialButton
          provider="google"
          onClick={() => handleOAuthClick("google")}
          disabled={disabled}
        />
        <SocialButton
          provider="facebook"
          onClick={() => handleOAuthClick("facebook")}
          disabled={disabled}
        />
        <SocialButton
          provider="apple"
          onClick={() => handleOAuthClick("apple")}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
