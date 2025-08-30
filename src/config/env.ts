// Environment Configuration
export const env = {
  // OpenAI Configuration
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || "",

  // API Configuration
  OPENAI_API_URL:
    import.meta.env.VITE_OPENAI_API_URL || "https://api.openai.com/v1",

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "Websoft AI",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Feature Flags
  ENABLE_REAL_AI: import.meta.env.VITE_ENABLE_REAL_AI === "true",
  ENABLE_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE !== "false",

  // Development
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Log environment variables for debugging
console.log("🔧 Environment Configuration Loaded:");
console.log(
  "🌍 VITE_OPENAI_API_KEY:",
  import.meta.env.VITE_OPENAI_API_KEY ? "✅ SET" : "❌ NOT SET"
);
console.log(
  "🔑 API Key Value (first 10 chars):",
  import.meta.env.VITE_OPENAI_API_KEY
    ? import.meta.env.VITE_OPENAI_API_KEY.substring(0, 10) + "..."
    : "NOT SET"
);
console.log("🌐 VITE_OPENAI_API_URL:", import.meta.env.VITE_OPENAI_API_URL);
console.log("📱 VITE_APP_NAME:", import.meta.env.VITE_APP_NAME);
console.log("🎯 VITE_ENABLE_REAL_AI:", import.meta.env.VITE_ENABLE_REAL_AI);
console.log("🎭 VITE_ENABLE_DEMO_MODE:", import.meta.env.VITE_ENABLE_DEMO_MODE);
console.log("🚀 IS_DEVELOPMENT:", import.meta.env.DEV);
console.log("📦 IS_PRODUCTION:", import.meta.env.PROD);

// Validate required environment variables
export const validateEnv = () => {
  const required = ["VITE_OPENAI_API_KEY"];
  const missing = required.filter((key) => !import.meta.env[key]);

  console.log("🔍 Environment Validation:");
  console.log("📋 Required variables:", required);
  console.log("❌ Missing variables:", missing);
  console.log(
    "✅ Validation result:",
    missing.length === 0 ? "PASSED" : "FAILED"
  );

  if (missing.length > 0 && env.IS_PRODUCTION) {
    console.warn("Missing environment variables:", missing);
  }

  return missing.length === 0;
};

export default env;
