import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface SplashScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export default function SplashScreen({
  message = "Loading Rosie AI...",
  showProgress = false,
  progress = 0,
}: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center z-50">
      <motion.div
        className="text-center text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Animation */}
        <motion.div
          className="mb-8"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Brain className="w-24 h-24 mx-auto text-white/90" />
        </motion.div>

        {/* App Title */}
        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Rosie AI
        </motion.h1>

        {/* Loading Message */}
        <motion.p
          className="text-xl text-white/80 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {message}
        </motion.p>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            className="w-64 mx-auto bg-white/20 rounded-full h-2 overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>
        )}

        {/* Loading Dots */}
        <motion.div
          className="flex justify-center space-x-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
