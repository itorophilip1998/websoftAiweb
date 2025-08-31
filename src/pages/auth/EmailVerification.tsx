import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClerkAuthentication } from "../../hooks/useClerkAuth";
import { useToast } from "../../contexts/ToastContext";
import OTPInput from "otp-input-react";
import Button from "../../components/Button";

export default function EmailVerification() {
  const { verifyEmail, resendVerificationCode } = useClerkAuthentication();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingVerification");
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      navigate("/signup");
    }
  }, [navigate]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      showError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyEmail(email, otp);

      if (result.success) {
        showSuccess(result.message);
        localStorage.removeItem("pendingVerification");
        setTimeout(() => {
          navigate("/");
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

  const handleResend = async () => {
    setResendLoading(true);

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        showSuccess(result.message);
        // Clear the OTP input for the new code
        setOtp("");
      } else {
        showError(result.message);
      }
    } catch {
      showError("Failed to resend verification code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <div className="auth-header">
          <h1 className="font-display text-2xl">Email Verification</h1>
          <p>Please enter the verification code sent to</p>
          <div className="email-display">
            <strong>{email}</strong>
          </div>
        </div>

        <div className="otp-container">
          <label className="otp-label">Verification Code</label>
          <div className="otp-input-wrapper">
            <OTPInput
              value={otp}
              onChange={setOtp}
              autoFocus
              OTPLength={6}
              otpType="number"
              disabled={loading}
              secure
            />
          </div>
          <p className="otp-hint">Enter the 6-digit code from your email</p>
        </div>

        <div className="verification-actions">
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6}
            loading={loading}
            size="lg"
            className="w-full mb-3"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          <Button
            onClick={handleResend}
            disabled={loading}
            loading={resendLoading}
            variant="outline"
            size="md"
            className="w-full"
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </Button>
        </div>

        <div className="verification-footer">
          <p>Didn't receive the code?</p>
          <p className="verification-tips">
            • Check your spam folder
            <br />
            • Make sure the email address is correct
            <br />• Wait a few minutes before requesting a new code
          </p>
        </div>
      </div>
    </div>
  );
}
