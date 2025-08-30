import React, { createContext, useContext, useState, useEffect } from "react";
import IntroScreen from "../components/IntroScreen";

interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  createdAt: string;
  lastSignInAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  signUp: (
    email: string,
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  resendVerificationCode: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; message: string }>;
  showIntro: boolean;
  isNewUser: boolean;
  completeIntro: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          // In a real app, you'd verify the token with your backend
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Generate a simple token (in real app, this would come from backend)
  const generateToken = () => {
    return (
      "token_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: User & { password: string; isVerified: boolean }) =>
          u.email === email && u.password === password
      );

      if (user && user.isVerified) {
        const userData = {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          createdAt: user.createdAt,
          lastSignInAt: new Date().toISOString(),
        };

        // Generate and store token
        const token = generateToken();
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

        // Check if this is a new user (first time signing in)
        const isFirstSignIn = !localStorage.getItem(
          `introShown_${userData.id}`
        );
        if (isFirstSignIn) {
          setIsNewUser(true);
          setShowIntro(true);
          localStorage.setItem(`introShown_${userData.id}`, "true");
        }

        return { success: true, message: "Sign in successful!" };
      } else if (user && !user.isVerified) {
        return { success: false, message: "Please verify your email first." };
      } else {
        return { success: false, message: "Invalid email or password." };
      }
    } catch {
      return { success: false, message: "An error occurred during sign in." };
    }
  };

  const signUp = async (email: string, username: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(
        (u: User & { password: string; isVerified: boolean }) =>
          u.email === email || u.username === username
      );

      if (existingUser) {
        return {
          success: false,
          message: "User with this email or username already exists.",
        };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        username,
        password,
        fullName: "",
        isVerified: false,
        createdAt: new Date().toISOString(),
        lastSignInAt: "",
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Store verification code (in real app, this would be sent via email)
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      localStorage.setItem(`verification_${email}`, verificationCode);

      return {
        success: true,
        message:
          "Account created! Please check your email for verification code.",
      };
    } catch {
      return { success: false, message: "An error occurred during sign up." };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const forgotPassword = async (email: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: User & { password: string; isVerified: boolean }) =>
          u.email === email
      );

      if (!user) {
        return {
          success: false,
          message: "No account found with this email address.",
        };
      }

      // Generate reset code (in real app, this would be sent via email)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`reset_${email}`, resetCode);

      return {
        success: true,
        message: "Password reset instructions sent to your email.",
      };
    } catch {
      return {
        success: false,
        message: "An error occurred while processing your request.",
      };
    }
  };

  const resendVerificationCode = async (email: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: User & { password: string; isVerified: boolean }) =>
          u.email === email
      );

      if (!user) {
        return {
          success: false,
          message: "No account found with this email address.",
        };
      }

      // Generate new verification code (in real app, this would be sent via email)
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      localStorage.setItem(`verification_${email}`, verificationCode);

      return {
        success: true,
        message: "New verification code sent to your email.",
      };
    } catch {
      return {
        success: false,
        message: "An error occurred while sending the code.",
      };
    }
  };

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify reset code
      const storedCode = localStorage.getItem(`reset_${email}`);
      if (storedCode !== code) {
        return { success: false, message: "Invalid verification code." };
      }

      // Update password
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(
        (u: User & { password: string; isVerified: boolean }) =>
          u.email === email
      );

      if (userIndex === -1) {
        return { success: false, message: "User not found." };
      }

      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.removeItem(`reset_${email}`);

      return {
        success: true,
        message:
          "Password reset successful! You can now sign in with your new password.",
      };
    } catch {
      return {
        success: false,
        message: "An error occurred while resetting your password.",
      };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify code
      const storedCode = localStorage.getItem(`verification_${email}`);
      if (storedCode !== code) {
        return { success: false, message: "Invalid verification code." };
      }

      // Mark user as verified
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(
        (u: User & { password: string; isVerified: boolean }) =>
          u.email === email
      );

      if (userIndex === -1) {
        return { success: false, message: "User not found." };
      }

      users[userIndex].isVerified = true;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.removeItem(`verification_${email}`);

      // Auto-sign in the user after verification
      const userData = {
        id: users[userIndex].id,
        email: users[userIndex].email,
        username: users[userIndex].username,
        fullName: users[userIndex].fullName,
        createdAt: users[userIndex].createdAt,
        lastSignInAt: new Date().toISOString(),
      };

      // Generate and store token
      const token = generateToken();
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      // Show intro screen for newly verified users
      setIsNewUser(true);
      setShowIntro(true);
      localStorage.setItem(`introShown_${userData.id}`, "true");

      return {
        success: true,
        message: "Email verified successfully! You are now signed in.",
      };
    } catch {
      return {
        success: false,
        message: "An error occurred while verifying your email.",
      };
    }
  };

  const completeIntro = () => {
    setShowIntro(false);
    setIsNewUser(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resendVerificationCode,
    resetPassword,
    verifyEmail,
    showIntro,
    isNewUser,
    completeIntro,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showIntro && user && (
        <IntroScreen onComplete={completeIntro} username={user.username} />
      )}
    </AuthContext.Provider>
  );
};
