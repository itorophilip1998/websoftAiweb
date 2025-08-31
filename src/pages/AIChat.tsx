import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useSplash } from "../contexts/SplashContext";
import {
  Send,
  Trash2,
  Plus,
  Bot,
  User,
  Upload,
  File,
  Image,
  X,
  Globe,
  Settings,
  Brain,
  Menu,
  Search,
  Sparkles,
  Code,
  Briefcase,
  GraduationCap,
  Leaf,
  Mic,
  MicOff,
} from "lucide-react";
import {
  RealChatAgent,
  type AIMessage,
  type AIConfig,
} from "../services/realAIService";

export default function AIChat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const { showSplash, hideSplash } = useSplash();
  const [chatAgent] = useState(() => new RealChatAgent());
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchWeb, setSearchWeb] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [agentPersonality, setAgentPersonality] = useState(
    "intelligent_assistant"
  );
  const [showCannedPrompts, setShowCannedPrompts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [useDemoMode, setUseDemoMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(
    null
  );
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState("");

  // Get user data from authenticated context
  const userData = {
    username: user?.username || "User",
    email: user?.email || "user@example.com",
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Format message content with proper typography
  const formatMessageContent = (content: string) => {
    if (!content) return "";

    // Convert markdown-like syntax to proper HTML structure
    const formatted = content
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>'
      )

      // Bold and italic
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')

      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm text-gray-800">$1</code></pre>'
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800 font-mono">$1</code>'
      )

      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4 text-gray-700">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-700">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 text-gray-700">$1</li>')

      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )

      // Paragraphs (group consecutive lines that aren't headers, lists, or code blocks)
      .replace(
        /^(?!<[h|li|pre|code])(.+)$/gim,
        '<p class="mb-3 text-gray-700 leading-relaxed">$1</p>'
      )

      // Clean up empty paragraphs
      .replace(/<p class="mb-3 text-gray-700 leading-relaxed"><\/p>/g, "")

      // Fix list structure
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc space-y-1 my-3">$1</ul>')
      .replace(/<\/ul>\s*<ul/g, "")

      // Add proper spacing
      .replace(/<\/h[1-3]>/g, '</h$1><div class="mb-4"></div>')
      .replace(/<\/p>/g, '</p><div class="mb-2"></div>');

    return formatted;
  };

  // Generate SportyBet code from prediction results
  const generateSportyBetCode = (content: string) => {
    // Extract match predictions and odds from AI response
    const matches = content.match(/([A-Za-z\s]+)\s+vs\s+([A-Za-z\s]+)/g);
    const odds = content.match(/(\d+\.\d+)/g);

    if (!matches || matches.length === 0) {
      return "No match predictions found to generate SportyBet code.";
    }

    let sportyBetCode = "SPORTYBET_" + Date.now().toString().slice(-6) + "\n\n";
    sportyBetCode += "Generated from Websoft AI Predictions\n";
    sportyBetCode += "Date: " + new Date().toLocaleDateString() + "\n\n";

    matches.forEach((match, index) => {
      const teams = match.split(" vs ");
      const homeTeam = teams[0].trim();
      const awayTeam = teams[1].trim();
      const odd = odds && odds[index] ? odds[index] : "2.00";

      sportyBetCode += `${index + 1}. ${homeTeam} vs ${awayTeam}\n`;
      sportyBetCode += `   Prediction: ${
        Math.random() > 0.5 ? "Home Win" : "Away Win"
      }\n`;
      sportyBetCode += `   Odds: ${odd}\n\n`;
    });

    sportyBetCode += "Visit: sporty.bet.com/nigeria\n";
    sportyBetCode += "Code valid for 24 hours";

    return sportyBetCode;
  };

  // Chat menu functions
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showSuccess("Message copied to clipboard!");
    } catch (err) {
      showError("Failed to copy message");
    }
  };

  const replyToMessage = (content: string) => {
    setInputMessage(content);
    inputRef.current?.focus();
  };

  const deleteMessage = (messageId: string) => {
    if (currentSession) {
      const updatedMessages = currentSession.messages.filter(
        (msg) => msg.id !== messageId
      );
      setCurrentSession({ ...currentSession, messages: updatedMessages });
      showSuccess("Message deleted!");
    }
  };

  const startEditingMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditMessageContent(content);
  };

  const saveEditedMessage = (messageId: string) => {
    if (currentSession) {
      const updatedMessages = currentSession.messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: editMessageContent } : msg
      );
      setCurrentSession({ ...currentSession, messages: updatedMessages });
      setEditingMessageId(null);
      setEditMessageContent("");
      showSuccess("Message updated!");
    }
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageContent("");
  };

  // File drop handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/*": [
        ".txt",
        ".md",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".css",
        ".scss",
        ".csv",
        ".xml",
        ".html",
        ".htm",
      ],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/zip": [".zip", ".rar"],
      "application/x-rar-compressed": [".rar"],
    },
    multiple: true,
    maxSize: 15 * 1024 * 1024, // 15MB max file size
  });

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Create initial session if none exists
    if (sessions.length === 0) {
      const newSession = chatAgent.createSession("New Chat");
      setSessions([newSession]);
      setCurrentSession(newSession);
    }
  }, [chatAgent, sessions.length]);

  useEffect(() => {
    if (currentSession?.messages && currentSession.messages.length > 0) {
      // Only scroll to bottom when there are actual messages
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [currentSession?.messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setInputMessage(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const scrollToBottom = () => {
    // Only scroll if we're near the bottom or if it's a new message
    const messagesContainer = document.querySelector(".messages-scrollable");
    if (messagesContainer) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainer as HTMLElement;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const createNewSession = () => {
    const newSession = chatAgent.createSession();
    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession);
    setInputMessage("");
    setUploadedFiles([]);
    setSearchWeb(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteSession = (sessionId: string) => {
    chatAgent.deleteSession(sessionId);
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);

    if (currentSession?.id === sessionId) {
      setCurrentSession(updatedSessions[0] || null);
    }
  };

  const handlePersonalityChange = (personality: string) => {
    setAgentPersonality(personality);
    chatAgent.setAgentPersonality(personality);
  };

  const toggleMicrophone = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      setTranscript("");
    }
  };

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) return;

    setIsConfiguring(true);
    try {
      // Test the API key
      const testResponse = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
        },
      });

      if (testResponse.ok) {
        chatAgent.setConfig({
          openaiApiKey: apiKey.trim(),
          useDemoMode: false,
        });
        setUseDemoMode(false);
        setShowApiConfig(false);
        setApiKey("");
        // Show success message
        alert(
          "API key configured successfully! You're now using real AI responses."
        );
      } else {
        throw new Error("Invalid API key");
      }
    } catch (error) {
      alert("Invalid API key. Please check your key and try again.");
    } finally {
      setIsConfiguring(false);
    }
  };

  const toggleDemoMode = () => {
    const newDemoMode = !useDemoMode;
    setUseDemoMode(newDemoMode);
    chatAgent.setConfig({ useDemoMode: newDemoMode });
  };

  const insertCannedPrompt = async (prompt: string) => {
    if (!currentSession || isLoading) return;

    setIsLoading(true);
    showSplash("Processing your request...", false);

    try {
      // Add user message directly
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: "user",
        content: prompt,
        timestamp: new Date(),
        type: "text",
      };

      // Update session with user message
      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        updatedAt: new Date(),
      };
      setCurrentSession(updatedSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
      );

      // Get AI response
      const aiResponse = await chatAgent.sendMessage(
        currentSession.id,
        prompt,
        [],
        searchWeb
      );

      // Update session with AI response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
        updatedAt: new Date(),
      };
      setCurrentSession(finalSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? finalSession : s))
      );
    } catch (error) {
      console.error("Error sending canned prompt:", error);
      // Show error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but something went wrong. Please try again.",
        timestamp: new Date(),
        type: "text",
      };

      const errorSession = {
        ...currentSession,
        messages: [...currentSession.messages, errorMessage],
        updatedAt: new Date(),
      };
      setCurrentSession(errorSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? errorSession : s))
      );
    } finally {
      setIsLoading(false);
      hideSplash();
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    if (!currentSession || isLoading) return;

    setIsLoading(true);
    showSplash("Processing your message...", false);
    const message = inputMessage.trim();
    const files = [...uploadedFiles];

    // Clear input and files
    setInputMessage("");
    setUploadedFiles([]);

    try {
      // Add user message
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: "user",
        content: message || `Uploaded ${files.length} file(s)`,
        timestamp: new Date(),
        type: files.length > 0 ? "file" : "text",
        metadata: {
          fileName: files[0]?.name,
          fileSize: files[0]?.size,
          fileType: files[0]?.type,
        },
      };

      // Update session with user message
      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        updatedAt: new Date(),
      };
      setCurrentSession(updatedSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
      );

      // Get AI response
      const aiResponse = await chatAgent.sendMessage(
        currentSession.id,
        message || "Analyze the uploaded files",
        files,
        searchWeb
      );

      // Update session with AI response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
        updatedAt: new Date(),
      };
      setCurrentSession(finalSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? finalSession : s))
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but something went wrong. Please try again.",
        timestamp: new Date(),
        type: "text",
      };

      const errorSession = {
        ...currentSession,
        messages: [...currentSession.messages, errorMessage],
        updatedAt: new Date(),
      };
      setCurrentSession(errorSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? errorSession : s))
      );
    } finally {
      setIsLoading(false);
      hideSplash();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case "creative_thinker":
        return <Sparkles className="w-4 h-4" />;
      case "analytical_expert":
        return <Search className="w-4 h-4" />;
      case "coding_assistant":
        return <Code className="w-4 h-4" />;
      case "business_consultant":
        return <Briefcase className="w-4 h-4" />;
      case "teacher":
        return <GraduationCap className="w-4 h-4" />;
      case "canna_prompt":
        return <Leaf className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="w-80 bg-white border-r border-gray-200 flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3 }}
          >
            {/* Sidebar Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-primary" />
                  <h1 className="text-lg font-semibold text-gray-900">
                    Websoft AI
                  </h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <button
                onClick={createNewSession}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-hidden p-4">
              {sessions.map((session, index) => (
                <div key={session.id}>
                  <motion.div
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      currentSession?.id === session.id
                        ? "bg-white text-primary border-primary shadow-sm"
                        : "hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setCurrentSession(session)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {session.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className={`text-xs opacity-70 hover:opacity-100 transition-opacity ${
                          currentSession?.id === session.id
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        currentSession?.id === session.id
                          ? "text-primary opacity-80"
                          : "opacity-70"
                      }`}
                    >
                      {session.messages.length} messages
                    </div>
                  </motion.div>

                  {/* Separator line between sessions */}
                  {index < sessions.length - 1 && (
                    <div className="h-px bg-gray-200 my-2 mx-2"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Footer - User Profile */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-full flex items-center space-x-3 text-gray-600 hover:text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {userData?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">
                    {userData?.username || "User"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {userData?.email || "user@example.com"}
                  </div>
                </div>
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar - Fixed */}
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                )}
                <div className="flex flex-col space-y-2">
                  <h2 className="text-xl font-display font-bold text-primary block">
                    {currentSession?.title || "Websoft AI Chat"}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-gray-600">
                      💬{" "}
                      {currentSession?.messages?.filter(
                        (m) => m.role === "user"
                      ).length || 0}{" "}
                      Prompts
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium text-gray-600">
                      🤖{" "}
                      {currentSession?.messages?.filter(
                        (m) => m.role === "assistant"
                      ).length || 0}{" "}
                      Responses
                    </span>
                    {currentSession?.messages &&
                      currentSession.messages.length > 0 && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium text-gray-600">
                            📊 {currentSession.messages.length} Total
                          </span>
                        </>
                      )}
                    {isLoading && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium text-blue-600 animate-pulse">
                          ⚡ AI Thinking...
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/settings")}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* API Configuration Panel */}
          <AnimatePresence>
            {showApiConfig && (
              <motion.div
                className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 mx-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">
                      🔑 Configure OpenAI API Key
                    </h4>
                    <p className="text-sm text-blue-600">
                      Add your OpenAI API key to get real AI responses powered
                      by GPT-3.5
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        OpenAI API Key
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={handleApiKeySubmit}
                        disabled={!apiKey.trim() || isConfiguring}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                      >
                        {isConfiguring ? "Testing..." : "Test & Save Key"}
                      </button>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <input
                        type="checkbox"
                        id="demoMode"
                        checked={useDemoMode}
                        onChange={toggleDemoMode}
                        className="rounded"
                      />
                      <label
                        htmlFor="demoMode"
                        className="text-sm text-blue-700"
                      >
                        Use Demo Mode (No API key required)
                      </label>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-800 mb-2">
                        How to Get Your API Key:
                      </h5>
                      <ol className="text-sm text-blue-600 text-left space-y-1">
                        <li>
                          1. Go to{" "}
                          <a
                            href="https://platform.openai.com/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium"
                          >
                            OpenAI Platform
                          </a>
                        </li>
                        <li>2. Sign in or create an account</li>
                        <li>3. Click "Create new secret key"</li>
                        <li>4. Copy the key (starts with "sk-")</li>
                        <li>5. Paste it above and click "Test & Save Key"</li>
                      </ol>
                    </div>

                    <p className="text-xs text-blue-500">
                      Your API key is stored locally and never sent to our
                      servers. Demo mode provides simulated responses when no
                      key is configured.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvancedOptions && (
              <motion.div
                className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="searchWeb"
                      checked={searchWeb}
                      onChange={(e) => setSearchWeb(e.target.checked)}
                      className="rounded"
                    />
                    <label
                      htmlFor="searchWeb"
                      className="text-sm font-medium text-gray-700 flex items-center space-x-1"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Search Web</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      AI Agent Personality
                    </label>
                    <select
                      value={agentPersonality}
                      onChange={(e) => handlePersonalityChange(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="intelligent_assistant">
                        🤖 Intelligent Assistant
                      </option>
                      <option value="creative_thinker">
                        🎨 Creative Thinker
                      </option>
                      <option value="analytical_expert">
                        🔍 Analytical Expert
                      </option>
                      <option value="coding_assistant">
                        💻 Coding Assistant
                      </option>
                      <option value="business_consultant">
                        💼 Business Consultant
                      </option>
                      <option value="teacher">📚 Teacher</option>
                      <option value="canna_prompt">🌿 Canna AI</option>
                      <option value="football_expert">
                        ⚽ Football Expert
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Messages - Scrollable */}
        <div
          className="flex-1 overflow-y-auto relative transition-all duration-200"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "none",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("bg-blue-50/30");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("bg-blue-50/30");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("bg-blue-50/30");
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
              setUploadedFiles((prev) => [...prev, ...files]);
            }
          }}
        >
          {/* Messages Container */}
          <div
            className="max-w-6xl mx-auto px-4 py-4 space-y-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Drag & Drop Overlay */}
            {isDragActive && (
              <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-blue-700">
                    Drop files here
                  </p>
                  <p className="text-blue-600">Release to upload files</p>
                </div>
              </div>
            )}
            {currentSession?.messages?.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Brain className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome to Websoft AI
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  I'm your intelligent Websoft AI companion. Ask me anything,
                  upload files, or let me help you with creative tasks.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  {getPersonalityIcon(agentPersonality)}
                  <span>
                    {agentPersonality
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                    Mode Active
                  </span>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {currentSession?.messages?.map(
                  (message: AIMessage, index: number) => (
                    <motion.div
                      key={message.id || index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className={`max-w-3xl p-4 rounded-xl ${
                          message.role === "user"
                            ? "bg-white text-gray-800 rounded-br-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            : "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 rounded-bl-md border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {message.role === "user" ? (
                            <User className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Brain className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.type === "file" && (
                            <File className="w-3 h-3" />
                          )}
                          {message.type === "image" && (
                            <Image className="w-3 h-3" />
                          )}
                        </div>

                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none text-sm leading-relaxed bg-gradient-to-r from-blue-50/30 to-indigo-50/30 p-3 rounded-lg border-l-3 border-blue-300">
                            <div
                              className="whitespace-pre-wrap break-words"
                              dangerouslySetInnerHTML={{
                                __html:
                                  formatMessageContent(message.content) ||
                                  "No content",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="text-sm break-words prose prose-sm max-w-none bg-gray-50/30 p-3 rounded-lg border-l-3 border-gray-300"
                            dangerouslySetInnerHTML={{
                              __html:
                                formatMessageContent(message.content) ||
                                "No content",
                            }}
                          />
                        )}

                        {/* Chat Message Menu */}
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className={`p-1 rounded transition-colors ${
                              message.role === "user"
                                ? "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            }`}
                            title="Copy message"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => replyToMessage(message.content)}
                            className={`p-1 rounded transition-colors ${
                              message.role === "user"
                                ? "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            }`}
                            title="Reply to message"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              />
                            </svg>
                          </button>

                          {message.role === "user" && (
                            <>
                              <button
                                onClick={() =>
                                  startEditingMessage(
                                    message.id,
                                    message.content
                                  )
                                }
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                                title="Edit message"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>

                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                                title="Delete message"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </>
                          )}

                          {/* SportyBet Code Generation for AI Responses */}
                          {message.role === "assistant" &&
                            message.content.includes("football") && (
                              <button
                                onClick={() => {
                                  const sportyBetCode = generateSportyBetCode(
                                    message.content
                                  );
                                  const newMessage = {
                                    id: Date.now().toString(),
                                    role: "user" as const,
                                    content: `Generate SportyBet code for Nigeria: ${sportyBetCode}`,
                                    timestamp: new Date().toISOString(),
                                    type: "text" as const,
                                  };
                                  if (currentSession) {
                                    setCurrentSession({
                                      ...currentSession,
                                      messages: [
                                        ...currentSession.messages,
                                        newMessage,
                                      ],
                                    });
                                  }
                                }}
                                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
                                title="Generate SportyBet Code"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            )}
                        </div>

                        {/* Edit Message Input */}
                        {editingMessageId === message.id && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                            <textarea
                              value={editMessageContent}
                              onChange={(e) =>
                                setEditMessageContent(e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-md resize-none"
                              rows={3}
                            />
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => saveEditedMessage(message.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            )}

            {/* Show canned prompts when no messages exist */}
            {!isLoading &&
              (!currentSession?.messages ||
                currentSession.messages.length === 0) && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Ultra-compact prompt grid - no background, no padding, no margins */}
                  <div className="grid grid-cols-4 gap-1.5 max-w-6xl w-full">
                    {/* Football Prompts */}
                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Predict today's football matches and provide odds analysis"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-800 rounded-md transition-all hover:scale-105 text-center border border-green-200"
                    >
                      <div className="text-xs font-medium">
                        ⚽ Today's Matches
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Analyze Premier League standings and predict top 4 finish"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-800 rounded-md transition-all hover:scale-105 text-center border border-blue-200"
                    >
                      <div className="text-xs font-medium">
                        📊 League Analysis
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Give me betting tips for this weekend's matches with odds"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-800 rounded-md transition-all hover:scale-105 text-center border border-purple-200"
                    >
                      <div className="text-xs font-medium">💰 Betting Tips</div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Analyze team form and head-to-head statistics"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 text-orange-800 rounded-md transition-all hover:scale-105 text-center border border-orange-200"
                    >
                      <div className="text-xs font-medium">
                        📈 Team Analysis
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Generate a SportyBet code for Nigeria with today's football predictions and odds"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-yellow-100 to-amber-100 hover:from-yellow-200 hover:to-amber-200 text-yellow-800 rounded-md transition-all hover:scale-105 text-center border border-yellow-200"
                    >
                      <div className="text-xs font-medium">
                        🎯 SportyBet Code
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt("Explain React hooks with examples")
                      }
                      className="p-1 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-indigo-800 rounded-md transition-all hover:scale-105 text-center border border-indigo-200"
                    >
                      <div className="text-xs font-medium">💻 React Help</div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Help me solve a coding problem step by step"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 text-teal-800 rounded-md transition-all hover:scale-105 text-center border border-teal-200"
                    >
                      <div className="text-xs font-medium">🔧 Coding Help</div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Write a professional email template"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-800 rounded-md transition-all hover:scale-105 text-center border border-amber-200"
                    >
                      <div className="text-xs font-medium">✉️ Email Help</div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Create a workout plan for beginners"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-800 rounded-md transition-all hover:scale-105 text-center border border-red-200"
                    >
                      <div className="text-xs font-medium">💪 Fitness Plan</div>
                    </button>

                    <button
                      onClick={() => insertCannedPrompt("Tell me a joke")}
                      className="p-1 bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 text-pink-800 rounded-md transition-all hover:scale-105 text-center border border-pink-200"
                    >
                      <div className="text-xs font-medium">😄 Joke</div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt("Write a short creative story")
                      }
                      className="p-1 bg-gradient-to-r from-violet-100 to-purple-100 hover:from-violet-200 hover:to-purple-200 text-violet-800 rounded-md transition-all hover:scale-105 text-center border border-violet-200"
                    >
                      <div className="text-xs font-medium">
                        📚 Creative Story
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt("Give me a random fact")
                      }
                      className="p-1 bg-gradient-to-r from-emerald-100 to-green-100 hover:from-emerald-200 hover:to-green-200 text-emerald-800 rounded-md transition-all hover:scale-105 text-center border border-emerald-200"
                    >
                      <div className="text-xs font-medium">🧠 Random Fact</div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Analyze Champions League quarter-finals predictions"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-800 rounded-md transition-all hover:scale-105 text-center border border-blue-200"
                    >
                      <div className="text-xs font-medium">
                        🏆 Champions League
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "Predict World Cup qualifiers and rankings"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-red-100 to-orange-100 hover:from-red-200 hover:to-orange-200 text-red-800 rounded-md transition-all hover:scale-105 text-center border border-red-200"
                    >
                      <div className="text-xs font-medium">🌍 World Cup</div>
                    </button>

                    <button
                      onClick={() =>
                        insertCannedPrompt(
                          "What are the trending news stories today?"
                        )
                      }
                      className="p-1 bg-gradient-to-r from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 text-cyan-800 rounded-md transition-all hover:scale-105 text-center border border-cyan-200"
                    >
                      <div className="text-xs font-medium">
                        📰 Trending News
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white text-gray-800 p-6 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5" />
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />

            {/* Manual Scroll to Bottom Button */}
            {currentSession?.messages && currentSession.messages.length > 5 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={scrollToBottom}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 flex items-center space-x-2"
                >
                  <span className="text-sm">↓ Scroll to Bottom</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-6xl mx-auto">
            {/* File Upload Area */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200"
                    >
                      {file.type.startsWith("image/") ? (
                        <Image className="w-4 h-4 text-blue-500" />
                      ) : (
                        <File className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-700 max-w-[200px] truncate">
                        {file.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ChatGPT-style Input - Fixed */}
            <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
              <div className="relative max-w-6xl mx-auto ai-chat-container">
                {/* Speech Recognition Status */}
                {isRecording && (
                  <div className="mb-3 text-center">
                    <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-700 font-medium">
                        Listening... Speak now
                      </span>
                    </div>
                  </div>
                )}
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    // Auto-resize textarea
                    const textarea = e.target;
                    textarea.style.height = "auto";
                    textarea.style.height =
                      Math.min(textarea.scrollHeight, 120) + "px";
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Message Websoft AI..."
                  className="w-full px-6 py-4 pr-32 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none overflow-hidden ai-chat-input"
                  disabled={isLoading}
                  rows={1}
                  style={{
                    minHeight: "56px",
                    maxHeight: "120px",
                    // Prevent extension interference
                    all: "unset",
                    boxSizing: "border-box",
                    display: "block",
                    width: "100%",
                    padding: "24px 128px 24px 24px",
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    resize: "none",
                    overflow: "hidden",
                    backgroundColor: "white",
                    color: "#374151",
                  }}
                />

                {/* Microphone Button */}
                <button
                  onClick={toggleMicrophone}
                  disabled={!recognition}
                  className={`absolute right-20 top-1/2 transform -translate-y-1/2 p-2.5 rounded-lg transition-colors ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  } ${
                    !recognition
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                  style={{
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: "80px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                {/* File Upload Button */}
                <div
                  {...getRootProps()}
                  className="absolute p-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  title="Upload files"
                  style={{
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: "120px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                </div>

                {/* Send Button */}
                <motion.button
                  onClick={sendMessage}
                  disabled={
                    (!inputMessage.trim() && uploadedFiles.length === 0) ||
                    isLoading
                  }
                  className="absolute bg-primary hover:bg-primary/90 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    height: "48px",
                    width: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Help Text */}
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line • Drag & drop
                  files anywhere or click the upload icon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        <AnimatePresence>
          {showProfileModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-lg max-w-2xl w-full mx-4 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {userData?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {userData?.username || "User"}
                      </h3>
                      <p className="text-white/80">
                        {userData?.email || "user@example.com"}
                      </p>
                      {user?.createdAt && (
                        <p className="text-white/60 text-sm mt-1">
                          Member since{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      navigate("/dashboard");
                    }}
                    className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Dashboard</div>
                      <div className="text-sm text-gray-500">
                        View your main dashboard
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Settings</div>
                      <div className="text-sm text-gray-500">
                        Configure API keys, AI personalities & more
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      // Add logout logic here
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("username");
                      localStorage.removeItem("userEmail");
                      navigate("/signin");
                    }}
                    className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-red-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Logout</div>
                      <div className="text-sm text-gray-500">
                        Sign out of your account
                      </div>
                    </div>
                  </button>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
