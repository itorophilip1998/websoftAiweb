import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        showSuccess(result.message);
        // Store email for reset password page
        localStorage.setItem('pendingReset', email);
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
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
      <div className="auth-form">
        <div className="auth-header">
          <h1>Forgot Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />

          <button type="submit" disabled={loading || !email}>
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
