import {
  useAuth as useClerkAuth,
  useUser,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

export function useClerkAuthentication() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { user } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signIn.authenticateWithPassword({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        showSuccess("Successfully signed in!");
        navigate("/");
        return { success: true, message: "Successfully signed in!" };
      } else {
        showError("Sign in failed. Please try again.");
        return { success: false, message: "Sign in failed. Please try again." };
      }
    } catch (error: any) {
      const message =
        error.errors?.[0]?.message || "An error occurred during sign in.";
      showError(message);
      return { success: false, message };
    }
  };

  // Sign up with email/password
  const signUpWithEmail = async (
    email: string,
    password: string,
    username?: string
  ) => {
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        username: username || email.split("@")[0],
      });

      if (result.status === "complete") {
        showSuccess("Account created successfully! Please verify your email.");
        navigate("/verification");
        return { success: true, message: "Account created successfully!" };
      } else if (result.status === "missing_requirements") {
        // Email verification required
        showSuccess(
          "Account created! Please check your email for verification."
        );
        navigate("/verification");
        return {
          success: true,
          message: "Account created! Please verify your email.",
        };
      } else {
        showError("Sign up failed. Please try again.");
        return { success: false, message: "Sign up failed. Please try again." };
      }
    } catch (error: any) {
      const message =
        error.errors?.[0]?.message || "An error occurred during sign up.";
      showError(message);
      return { success: false, message };
    }
  };

  // Sign in with OAuth provider
  const signInWithOAuth = async (provider: "google" | "facebook" | "apple") => {
    try {
      // Check if user is already signed in
      if (isSignedIn) {
        showSuccess("You're already signed in!");
        navigate("/");
        return { success: true, message: "Already signed in!" };
      }

      const result = await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });

      return { success: true, message: "Redirecting to OAuth provider..." };
    } catch (error: any) {
      // Handle session exists error gracefully
      if (error.errors?.[0]?.code === "session_exists") {
        showSuccess("You're already signed in!");
        navigate("/");
        return { success: true, message: "Already signed in!" };
      }
      
      const message =
        error.errors?.[0]?.message || `Failed to sign in with ${provider}.`;
      showError(message);
      return { success: false, message };
    }
  };

  // Sign up with OAuth provider
  const signUpWithOAuth = async (provider: "google" | "facebook" | "apple") => {
    try {
      // Check if user is already signed in
      if (isSignedIn) {
        showSuccess("You're already signed in!");
        navigate("/");
        return { success: true, message: "Already signed in!" };
      }

      const result = await signUp.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/verification",
        redirectUrlComplete: "/verification",
      });

      return { success: true, message: "Redirecting to OAuth provider..." };
    } catch (error: any) {
      // Handle session exists error gracefully
      if (error.errors?.[0]?.code === "session_exists") {
        showSuccess("You're already signed in!");
        navigate("/");
        return { success: true, message: "Already signed in!" };
      }
      
      const message =
        error.errors?.[0]?.message || `Failed to sign up with ${provider}.`;
      showError(message);
      return { success: false, message };
    }
  };

  // Verify email
  const verifyEmail = async (email: string, code: string) => {
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        showSuccess("Email verified successfully!");
        navigate("/");
        return { success: true, message: "Email verified successfully!" };
      } else {
        showError("Email verification failed. Please try again.");
        return { success: false, message: "Email verification failed." };
      }
    } catch (error: any) {
      const message =
        error.errors?.[0]?.message || "Email verification failed.";
      showError(message);
      return { success: false, message };
    }
  };

  // Resend verification code
  const resendVerificationCode = async (email: string) => {
    try {
      await signUp.prepareEmailAddressVerification();
      showSuccess("Verification code sent! Please check your email.");
      return { success: true, message: "Verification code sent!" };
    } catch (error: any) {
      const message =
        error.errors?.[0]?.message || "Failed to resend verification code.";
      showError(message);
      return { success: false, message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await signIn.signOut();
      showSuccess("Successfully signed out!");
      navigate("/signin");
      return { success: true, message: "Successfully signed out!" };
    } catch (error: any) {
      const message = error.errors?.[0]?.message || "Failed to sign out.";
      showError(message);
      return { success: false, message };
    }
  };

  return {
    isSignedIn,
    isLoaded,
    user,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signUpWithOAuth,
    verifyEmail,
    resendVerificationCode,
    signOut,
    signInLoaded,
    signUpLoaded,
  };
}
