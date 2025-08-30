// Simple LLM Model and Agent Implementation

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "image" | "code";
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Simple LLM Model - Simulates AI responses
export class SimpleLLMModel {
  private knowledgeBase: Map<string, string> = new Map();
  private personality: string;

  constructor(personality: string = "helpful") {
    this.personality = personality;
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    // Add some basic knowledge
    this.knowledgeBase.set("greeting", "Hello! How can I help you today?");
    this.knowledgeBase.set(
      "weather",
      "I can help you with weather information. What city are you interested in?"
    );
    this.knowledgeBase.set(
      "math",
      "I can help with basic math calculations. What would you like to calculate?"
    );
    this.knowledgeBase.set(
      "coding",
      "I can help with programming questions. What language or problem are you working on?"
    );
    this.knowledgeBase.set(
      "general",
      "I'm here to help! Feel free to ask me anything."
    );
  }

  async generateResponse(userInput: string): Promise<string> {
    // Simulate processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    const input = userInput.toLowerCase();

    // Simple pattern matching for responses
    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return this.generateGreeting();
    }

    if (input.includes("weather")) {
      return this.generateWeatherResponse();
    }

    if (
      input.includes("math") ||
      input.includes("calculate") ||
      input.includes("+") ||
      input.includes("-") ||
      input.includes("*") ||
      input.includes("/")
    ) {
      return this.generateMathResponse(userInput);
    }

    if (
      input.includes("code") ||
      input.includes("programming") ||
      input.includes("javascript") ||
      input.includes("python") ||
      input.includes("react")
    ) {
      return this.generateCodingResponse(userInput);
    }

    if (input.includes("joke") || input.includes("funny")) {
      return this.generateJoke();
    }

    if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    // Default response with some intelligence
    return this.generateIntelligentResponse(userInput);
  }

  private generateGreeting(): string {
    const greetings = [
      "Hello! How can I assist you today?",
      "Hi there! What can I help you with?",
      "Greetings! How may I be of service?",
      "Hello! I'm here to help. What do you need?",
      "Hi! Welcome to our chat. How can I help?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private generateWeatherResponse(): string {
    return "I'd be happy to help with weather information! However, I don't have access to real-time weather data. You might want to check a weather app or website for current conditions.";
  }

  private generateMathResponse(input: string): string {
    try {
      // Extract numbers and operators
      const mathExpression = input.replace(/[^0-9+\-*/().]/g, "");
      if (mathExpression) {
        // Safe evaluation (in real app, use a math library)
        const result = eval(mathExpression);
        if (isFinite(result)) {
          return `The result of ${mathExpression} is ${result}`;
        }
      }
      return "I can help with math! Please provide a simple calculation like '2 + 2' or '10 * 5'.";
    } catch {
      return "I can help with math! Please provide a simple calculation like '2 + 2' or '10 * 5'.";
    }
  }

  private generateCodingResponse(input: string): string {
    const responses = [
      "I'd be happy to help with programming! What specific question do you have?",
      "Programming is my specialty! What language or framework are you working with?",
      "I can help with coding questions. Are you working on a specific problem?",
      "Great question about programming! Let me know what you'd like to learn or solve.",
      "I love helping with code! What's your programming question?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateJoke(): string {
    const jokes = [
      "Why don't programmers like nature? It has too many bugs!",
      "Why did the developer go broke? Because he used up all his cache!",
      "What do you call a programmer from Finland? Nerdic!",
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  private generateIntelligentResponse(input: string): string {
    const responses = [
      "That's an interesting question! Let me think about it...",
      "I understand you're asking about that. Could you provide more details?",
      "That's a great point! What specifically would you like to know?",
      "I'm here to help with that. Can you elaborate a bit more?",
      "Interesting question! Let me help you find the answer.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Chat Agent that manages conversations
export class ChatAgent {
  private llm: SimpleLLMModel;
  private sessions: Map<string, ChatSession> = new Map();

  constructor() {
    this.llm = new SimpleLLMModel("helpful");
  }

  async sendMessage(sessionId: string, message: string): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    session.messages.push(userMessage);
    session.updatedAt = new Date();

    // Generate AI response
    const aiResponse = await this.llm.generateResponse(message);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    session.messages.push(assistantMessage);
    session.updatedAt = new Date();

    // Save to localStorage
    this.saveSessions();

    return assistantMessage;
  }

  createSession(title?: string): ChatSession {
    const session: ChatSession = {
      id: Date.now().toString(),
      title: title || `Chat ${this.sessions.size + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    this.saveSessions();
    return session;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      this.saveSessions();
    }
    return deleted;
  }

  private saveSessions() {
    localStorage.setItem(
      "chatSessions",
      JSON.stringify(Array.from(this.sessions.entries()))
    );
  }

  loadSessions() {
    try {
      const saved = localStorage.getItem("chatSessions");
      if (saved) {
        const sessionsArray = JSON.parse(saved);
        this.sessions = new Map(sessionsArray);
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
    }
  }
}
