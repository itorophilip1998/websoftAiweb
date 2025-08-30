import React, { createContext, useContext, useState, ReactNode } from "react";
import SplashScreen from "../components/SplashScreen";

interface SplashContextType {
  showSplash: (message?: string, showProgress?: boolean) => void;
  hideSplash: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
  isVisible: boolean;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error("useSplash must be used within a SplashProvider");
  }
  return context;
};

interface SplashProviderProps {
  children: ReactNode;
}

export const SplashProvider: React.FC<SplashProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("Loading Websoft AI...");
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const showSplash = (newMessage?: string, newShowProgress?: boolean) => {
    if (newMessage) setMessage(newMessage);
    if (newShowProgress !== undefined) setShowProgress(newShowProgress);
    setProgress(0);
    setIsVisible(true);
  };

  const hideSplash = () => {
    setIsVisible(false);
    setProgress(0);
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  const updateMessage = (newMessage: string) => {
    setMessage(newMessage);
  };

  const value: SplashContextType = {
    showSplash,
    hideSplash,
    updateProgress,
    updateMessage,
    isVisible,
  };

  return (
    <SplashContext.Provider value={value}>
      {children}
      {isVisible && (
        <SplashScreen
          message={message}
          showProgress={showProgress}
          progress={progress}
        />
      )}
    </SplashContext.Provider>
  );
};
