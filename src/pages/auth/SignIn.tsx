import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerkAuthentication } from "../../hooks/useClerkAuth";
import { useToast } from "../../contexts/ToastContext";
import { Mail, Lock, Eye, EyeOff, Brain } from "lucide-react";
import SocialAuthSection from "../../components/SocialAuthSection";
import Button from "../../components/Button";

export default function SignIn() {
  const { signInWithEmail } = useClerkAuthentication();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmail(userData.email, userData.password);

      if (result.success) {
        showSuccess(result.message);
        // Navigation is handled by the hook
      } else {
        showError(result.message);
      }
    } catch {
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo Section */}
        <div className="auth-logo">
          <div className="logo-icon">
            <Brain />
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-header">
            <h1 className="font-display text-2xl">Welcome Back</h1>
            <p>Sign in to continue your AI journey</p>
          </div>

          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={userData.email}
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="input-group password-input">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={userData.password}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              minLength={8}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>

          <Button type="submit" loading={loading} size="lg" className="w-full">
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Social Authentication */}
          <SocialAuthSection mode="signin" />

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
