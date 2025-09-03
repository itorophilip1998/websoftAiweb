import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AIChat from "../pages/AIChat";
import Settings from "../pages/Settings";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import AuthLayouts from "../layouts/AuthLayouts";
import EmailVerification from "../pages/auth/EmailVerification";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import { useAuth } from "../contexts/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  // Check for token in localStorage as additional security
  const token = localStorage.getItem("authToken");
  if (!isAuthenticated || !token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (only for non-authenticated users)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default function AppRouter() {
  return (
    <Routes>
      {/* Protected routes */}
      <Route path="/" element={<AIChat />} />
      <Route path="/ai-chat" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Public routes */}
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <AuthLayouts>
              <SignIn />
            </AuthLayouts>
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthLayouts>
              <SignUp />
            </AuthLayouts>
          </PublicRoute>
        }
      />
      <Route
        path="/verification"
        element={
          <PublicRoute>
            <AuthLayouts>
              <EmailVerification />
            </AuthLayouts>
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <AuthLayouts>
              <ForgotPassword />
            </AuthLayouts>
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <AuthLayouts>
              <ResetPassword />
            </AuthLayouts>
          </PublicRoute>
        }
      />
    </Routes>
  );
}
