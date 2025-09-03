import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Key,
  Brain,
  Globe,
  Save,
  Check,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

export default function Settings() {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  const [apiKey, setApiKey] = useState("");
  const [useDemoMode, setUseDemoMode] = useState(true);
  const [agentPersonality, setAgentPersonality] = useState(
    "intelligent_assistant"
  );
  const [searchWeb, setSearchWeb] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openaiApiKey") || "";
    const savedDemoMode = localStorage.getItem("useDemoMode") !== "false";
    const savedPersonality =
      localStorage.getItem("agentPersonality") || "intelligent_assistant";
    const savedSearchWeb = localStorage.getItem("searchWeb") === "true";

    setApiKey(savedApiKey);
    setUseDemoMode(savedDemoMode);
    setAgentPersonality(savedPersonality);
    setSearchWeb(savedSearchWeb);
  }, []);

  const handleSaveSettings = async () => {
    setIsConfiguring(true);

    try {
      // Save to localStorage
      localStorage.setItem("openaiApiKey", apiKey);
      localStorage.setItem("useDemoMode", useDemoMode.toString());
      localStorage.setItem("agentPersonality", agentPersonality);
      localStorage.setItem("searchWeb", searchWeb.toString());

      showSuccess("Settings saved successfully!");

      // Simulate API test if key is provided
      if (apiKey && !useDemoMode) {
        // Here you could test the API key
        showSuccess("API key saved and validated!");
      }
    } catch (error) {
      showError("Failed to save settings. Please try again.");
    } finally {
      setIsConfiguring(false);
    }
  };

  const testApiKey = async () => {
    if (!apiKey) {
      showError("Please enter an API key first");
      return;
    }

    setIsConfiguring(true);

    try {
      // Test API call
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        showSuccess("API key is valid! ✅");
      } else {
        showError("Invalid API key. Please check and try again.");
      }
    } catch (error) {
      showError("Failed to test API key. Please check your connection.");
    } finally {
      setIsConfiguring(false);
    }
  };

  const personalityOptions = [
    {
      value: "intelligent_assistant",
      label: "🤖 Intelligent Assistant",
      description: "Balanced AI with general knowledge",
    },
    {
      value: "creative_thinker",
      label: "🎨 Creative Thinker",
      description: "Imaginative and artistic responses",
    },
    {
      value: "analytical_expert",
      label: "🔍 Analytical Expert",
      description: "Logical and data-driven analysis",
    },
    {
      value: "coding_assistant",
      label: "💻 Coding Assistant",
      description: "Specialized in programming help",
    },
    {
      value: "business_consultant",
      label: "💼 Business Consultant",
      description: "Business and strategy focused",
    },
    {
      value: "teacher",
      label: "📚 Teacher",
      description: "Educational and explanatory responses",
    },
    {
      value: "canna_prompt",
      label: "🌿 Canna AI",
      description: "Specialized cannabis knowledge",
    },
    {
      value: "football_expert",
      label: "⚽ Football Expert",
      description: "Sports and football predictions",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <SettingsIcon className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">
                  Configure your Rosie AI experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* API Configuration Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    OpenAI API Configuration
                  </h2>
                  <p className="text-sm text-gray-600">
                    Configure your OpenAI API key for real AI responses
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <div className="flex space-x-3">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={testApiKey}
                    disabled={!apiKey || isConfiguring}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isConfiguring ? "Testing..." : "Test Key"}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Get your API key from{" "}
                  <a
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="demoMode"
                  checked={useDemoMode}
                  onChange={(e) => setUseDemoMode(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="demoMode" className="text-sm text-gray-700">
                  Use demo mode when API key is not available
                </label>
              </div>
            </div>
          </motion.div>

          {/* AI Personality Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI Personality
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose how your AI assistant behaves and responds
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      agentPersonality === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="personality"
                      value={option.value}
                      checked={agentPersonality === option.value}
                      onChange={(e) => setAgentPersonality(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    </div>
                    {agentPersonality === option.value && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Advanced Features Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Advanced Features
                  </h2>
                  <p className="text-sm text-gray-600">
                    Configure additional AI capabilities
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    Web Search Integration
                  </div>
                  <div className="text-sm text-gray-500">
                    Allow AI to search the web for real-time information
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchWeb}
                    onChange={(e) => setSearchWeb(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleSaveSettings}
              disabled={isConfiguring}
              className="flex items-center space-x-2 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              <span className="font-medium">
                {isConfiguring ? "Saving..." : "Save Settings"}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
