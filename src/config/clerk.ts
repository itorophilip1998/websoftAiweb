// Clerk configuration for frontend
export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
};

// Social OAuth providers configuration
export const socialProviders = {
  google: {
    name: "Google",
    strategy: "oauth_google",
    icon: "google",
  },
  facebook: {
    name: "Facebook",
    strategy: "oauth_facebook",
    icon: "facebook",
  },
  apple: {
    name: "Apple",
    strategy: "oauth_apple",
    icon: "apple",
  },
};

// Email verification settings
export const emailVerificationConfig = {
  redirectUrl: `${window.location.origin}/verification`,
  afterSignUpUrl: "/verification",
  afterSignInUrl: "/",
};
