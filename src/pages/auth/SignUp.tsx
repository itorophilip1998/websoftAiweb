import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerkAuthentication } from "../../hooks/useClerkAuth";
import { useToast } from "../../contexts/ToastContext";
import { Mail, Lock, Eye, EyeOff, Brain, User } from "lucide-react";
import SocialAuthSection from "../../components/SocialAuthSection";
import Button from "../../components/Button";

export default function SignUp() {
  const { signUpWithEmail } = useClerkAuthentication();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: "",
    class: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });

    // Calculate password strength when password changes
    if (e.target.name === "password") {
      const password = e.target.value;
      const strength = calculatePasswordStrength(password);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let text = "";
    let className = "";

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 0) {
      text = "Very Weak";
      className = "weak";
    } else if (score === 1) {
      text = "Weak";
      className = "weak";
    } else if (score === 2) {
      text = "Fair";
      className = "fair";
    } else if (score === 3) {
      text = "Good";
      className = "good";
    } else if (score === 4) {
      text = "Strong";
      className = "strong";
    } else {
      text = "Very Strong";
      className = "strong";
    }

    return { score, text, class: className };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpWithEmail(
        userData.email,
        userData.password,
        userData.username
      );

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
            <h1 className="font-display text-2xl">Create Account</h1>
            <p>Join us and start your AI journey</p>
          </div>

          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              value={userData.username}
              required
              autoComplete="username"
              autoFocus
            />
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
              autoComplete="email"
            />
          </div>

          <div className="input-group password-input">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={userData.password}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {userData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className={`strength-fill ${passwordStrength.class}`}
                ></div>
              </div>
              <div className={`strength-text ${passwordStrength.class}`}>
                Password Strength: {passwordStrength.text}
              </div>
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Social Authentication */}
          <SocialAuthSection mode="signup" />

          <p className="auth-footer">
            You already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
