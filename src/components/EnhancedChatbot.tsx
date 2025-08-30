import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  MessageCircle,
  Trash2,
  Plus,
  Bot,
  User,
  Upload,
  Search,
  File,
  Image,
  X,
  Globe,
  Sparkles,
  Settings,
  Brain,
} from "lucide-react";
import {
  EnhancedChatAgent,
  AIMessage,
  SearchResult,
} from "../services/aiService";

interface EnhancedChatbotProps {
  className?: string;
}

function EnhancedChatbotComponent({ className = "" }: EnhancedChatbotProps) {
  const [chatAgent] = useState(() => {
    try {
      return new EnhancedChatAgent();
    } catch (error) {
      console.error("Error creating chat agent:", error);
      // Return a fallback agent
      return {
        sendMessage: async () => ({
          role: "assistant" as const,
          content: "I'm having trouble initializing. Please refresh the page.",
          timestamp: new Date(),
          type: "text" as const,
        }),
        loadSessions: () => {},
        getAllSessions: () => [],
        createSession: () => ({
          id: Date.now().toString(),
          title: "Fallback Chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      };
    }
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchWeb, setSearchWeb] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiPersonality, setAiPersonality] = useState("intelligent_assistant");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      ],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    try {
      // Load saved sessions
      chatAgent.loadSessions();
      const allSessions = chatAgent.getAllSessions();
      setSessions(allSessions);

      if (allSessions.length > 0 && !currentSession) {
        setCurrentSession(allSessions[0]);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      // Create a default session if loading fails
      const defaultSession = {
        id: Date.now().toString(),
        title: "AI Chat 1",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSessions([defaultSession]);
      setCurrentSession(defaultSession);
    }
  }, [chatAgent, currentSession]);

  useEffect(() => {
    if (currentSession?.messages) {
      scrollToBottom();
    }
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: `AI Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession);
    setInputMessage("");
    setUploadedFiles([]);
    setSearchWeb(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(sessions[0] || null);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    if (!currentSession || isLoading) return;

    setIsLoading(true);
    const message = inputMessage.trim();
    const files = [...uploadedFiles];

    // Clear input and files
    setInputMessage("");
    setUploadedFiles([]);

    try {
      // Add user message
      const userMessage: AIMessage = {
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

      // Get AI response with error handling
      let aiResponse: AIMessage;
      try {
        aiResponse = await chatAgent.sendMessage(
          currentSession.id,
          message || "Analyze the uploaded files",
          files,
          searchWeb
        );
      } catch (aiError) {
        console.error("AI service error:", aiError);
        // Create a fallback response
        aiResponse = {
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
          timestamp: new Date(),
          type: "text",
        };
      }

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
      // Show user-friendly error message
      const errorMessage: AIMessage = {
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

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Brain className="w-6 h-6" />
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {sessions.length}
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`fixed bottom-6 right-6 w-[500px] h-[700px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Websoft AI</h3>
              <p className="text-xs opacity-90">Powered by Enhanced LLM</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              title="Advanced Options"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={createNewSession}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Options Panel */}
      <AnimatePresence>
        {showAdvancedOptions && (
          <motion.div
            className="bg-gray-50 border-b border-gray-200 p-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="space-y-3">
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
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  AI Personality
                </label>
                <select
                  value={aiPersonality}
                  onChange={(e) => setAiPersonality(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="intelligent_assistant">
                    Intelligent Assistant
                  </option>
                  <option value="creative_thinker">Creative Thinker</option>
                  <option value="analytical_expert">Analytical Expert</option>
                  <option value="friendly_mentor">Friendly Mentor</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions Sidebar */}
      <div className="flex-1 flex">
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-3">
          <div className="space-y-2">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  currentSession?.id === session.id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200"
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
                    className="text-xs opacity-70 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {session.messages.length} messages
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentSession ? (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {currentSession.messages.map(
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
                          className={`max-w-[85%] p-3 rounded-2xl ${
                            message.role === "user"
                              ? "bg-primary text-white rounded-br-md"
                              : "bg-gray-100 text-gray-800 rounded-bl-md"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {message.role === "user" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
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
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                className="text-sm"
                                components={{
                                  // Add error boundary for links
                                  a: ({ href, children }) => (
                                    <span className="text-primary underline cursor-pointer">
                                      {children}
                                    </span>
                                  ),
                                }}
                              >
                                {message.content || "No content"}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content || "No content"}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
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
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* File Upload Area */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
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
                        <span className="text-xs text-gray-700 max-w-[120px] truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
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

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                {/* File Drop Zone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-3 mb-3 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary hover:bg-gray-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? "Drop files here..."
                      : "Drag & drop files here, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports: Text, Images, Documents, Code files
                  </p>
                </div>

                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything or upload files..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={sendMessage}
                    disabled={
                      (!inputMessage.trim() && uploadedFiles.length === 0) ||
                      isLoading
                    }
                    className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No chat session selected</p>
                <button
                  onClick={createNewSession}
                  className="mt-2 text-primary hover:underline"
                >
                  Start a new AI chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Error Boundary Wrapper
class EnhancedChatbotErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("EnhancedChatbot Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-6 right-6 w-[500px] h-[700px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 p-6">
          <div className="text-center">
            <Brain className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-4">
              Websoft AI encountered an error. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function EnhancedChatbot(props: EnhancedChatbotProps) {
  return (
    <EnhancedChatbotErrorBoundary>
      <EnhancedChatbotComponent {...props} />
    </EnhancedChatbotErrorBoundary>
  );
}
