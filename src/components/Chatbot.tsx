import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle,
  Trash2,
  Plus,
  Bot,
  User,
  Clock,
} from "lucide-react";
import { ChatAgent, ChatSession, ChatMessage } from "../utils/llmModel";

interface ChatbotProps {
  className?: string;
}

export default function Chatbot({ className = "" }: ChatbotProps) {
  const [chatAgent] = useState(() => new ChatAgent());
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatAgent.loadSessions();
    const allSessions = chatAgent.getAllSessions();
    setSessions(allSessions);

    if (allSessions.length > 0 && !currentSession) {
      setCurrentSession(allSessions[0]);
    }
  }, [chatAgent, currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createNewSession = () => {
    const newSession = chatAgent.createSession();
    setSessions(chatAgent.getAllSessions());
    setCurrentSession(newSession);
    setInputMessage("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteSession = (sessionId: string) => {
    chatAgent.deleteSession(sessionId);
    const updatedSessions = chatAgent.getAllSessions();
    setSessions(updatedSessions);

    if (currentSession?.id === sessionId) {
      setCurrentSession(updatedSessions[0] || null);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || isLoading) return;

    setIsLoading(true);
    const message = inputMessage.trim();
    setInputMessage("");

    try {
      await chatAgent.sendMessage(currentSession.id, message);
      const updatedSessions = chatAgent.getAllSessions();
      setSessions(updatedSessions);
      setCurrentSession(chatAgent.getSession(currentSession.id) || null);
    } catch (error) {
      console.error("Error sending message:", error);
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

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
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
      className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 py-5 rounded-t-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold">Rosie AI</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewSession}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      </div>

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
                  {currentSession.messages.map((message, index) => (
                    <motion.div
                      key={message.id}
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
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.role === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
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

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
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
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No chat session selected</p>
                <button
                  onClick={createNewSession}
                  className="mt-2 text-primary hover:underline"
                >
                  Start a new chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
