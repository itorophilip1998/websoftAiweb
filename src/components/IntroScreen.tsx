import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  MessageSquare,
  Settings,
  BarChart3,
  User,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

interface IntroScreenProps {
  onComplete: () => void;
  username: string;
}

export default function IntroScreen({
  onComplete,
  username,
}: IntroScreenProps) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const options = [
    {
      id: "chat",
      title: "Start Chatting",
      description: "Begin a conversation with Websoft AI",
      icon: MessageSquare,
      color: "from-blue-500 to-indigo-600",
      action: () => navigate("/"),
    },
    {
      id: "dashboard",
      title: "View Dashboard",
      description: "Check your profile and analytics",
      icon: BarChart3,
      color: "from-green-500 to-emerald-600",
      action: () => navigate("/dashboard"),
    },
    {
      id: "settings",
      title: "Configure AI",
      description: "Set up API keys and preferences",
      icon: Settings,
      color: "from-purple-500 to-pink-600",
      action: () => navigate("/settings"),
    },
    {
      id: "explore",
      title: "Explore Features",
      description: "Discover all AI capabilities",
      icon: Sparkles,
      color: "from-orange-500 to-red-600",
      action: () => navigate("/"),
    },
  ];

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option.id);
    setTimeout(() => {
      option.action();
      onComplete();
    }, 800);
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#484ce0] via-[#9bb5ee] to-[#d0e1ff] flex items-center justify-center z-50">
        <motion.div
          className="text-left text-white max-w-2xl mx-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Welcome Animation */}
          <motion.div
            className="mb-8"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Brain className="w-32 h-32 mx-auto text-white/90" />
          </motion.div>

          <motion.h1
            className="text-3xl font-display font-bold mb-3"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome, {username}! 👋
          </motion.h1>

          <motion.p
            className="text-base text-white/90 mb-5 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            You're all set up with Websoft AI! Choose how you'd like to get
            started.
          </motion.p>

          <motion.button
            onClick={() => setShowWelcome(false)}
            className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 flex items-center space-x-2 mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-50 p-4">
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-left mb-8">
          <motion.div
            className="inline-flex items-center space-x-3 bg-[#484ce0] text-white px-3 py-1.5 rounded-full mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Zap className="w-3 h-3" />
            <span className="text-xs font-medium">Choose Your Path</span>
          </motion.div>

          <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
            What would you like to do first?
          </h2>
          <p className="text-gray-600 text-sm">
            Select an option to get started with Websoft AI
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                selectedOption === option.id
                  ? "ring-4 ring-[#484ce0] ring-opacity-50"
                  : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionSelect(option)}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-90`}
              />

              {/* Content */}
              <div className="relative p-8 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <option.icon className="w-8 h-8" />
                  </div>
                  <motion.div
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                    animate={
                      selectedOption === option.id ? { rotate: 360 } : {}
                    }
                    transition={{ duration: 0.8 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{option.title}</h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Skip Option */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <button
            onClick={() => {
              navigate("/");
              onComplete();
            }}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Skip and go to chat →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
