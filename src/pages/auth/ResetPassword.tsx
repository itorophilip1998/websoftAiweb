import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import OTPInput from "otp-input-react";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingReset');
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6 || !newPassword || newPassword.length < 8) {
      showError("Please enter a valid 6-digit code and password (minimum 8 characters)");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(email, code, newPassword);
      
      if (result.success) {
        showSuccess(result.message);
        localStorage.removeItem('pendingReset');
        setTimeout(() => {
          navigate("/signin");
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

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter the verification code from your email and your new password.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
              Verification Code
            </label>
            <OTPInput
              value={code}
              onChange={setCode}
              autoFocus
              OTPLength={6}
              otpType="number"
              disabled={loading}
              secure
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading || code.length !== 6 || newPassword.length < 8}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/forgot-password" style={{ color: "#00917c", textDecoration: "none" }}>
            Didn't receive the code? Resend
          </Link>
        </p>
      </div>
    </div>
  );
}
