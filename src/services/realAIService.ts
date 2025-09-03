// Real AI Service with OpenAI API Support
import FootballPredictionService from "./footballPredictionService";
import { RAGService } from "./ragService";
import { env } from "../config/env";

console.log("📦 RealAIService imported, environment config:", {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY ? "✅ SET" : "❌ NOT SET",
  OPENAI_API_URL:
    import.meta.env.VITE_OPENAI_API_URL || "https://api.openai.com/v1",
  ENABLE_REAL_AI: import.meta.env.VITE_ENABLE_REAL_AI === "true",
  ENABLE_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE !== "false",
});

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  type?: "text" | "image" | "file" | "search";
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    imageDescription?: string;
    searchResults?: SearchResult[];
  };
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  content?: string;
}

export interface AIConfig {
  openaiApiKey?: string;
  useDemoMode?: boolean;
}

// Real AI Model with OpenAI API
export class RealAIModel {
  private apiKey: string | null = null;
  private useDemoMode: boolean = true;

  constructor(config: AIConfig = {}) {
    // Try to get API key from environment first
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log("🔧 RealAIModel Constructor:");
    console.log("🌍 Environment API Key available:", !!envKey);
    console.log("🌍 Environment API Key value:", envKey);
    console.log("🔑 Config API Key available:", !!config.openaiApiKey);
    console.log("🔑 Config API Key value:", config.openaiApiKey);

    this.apiKey = config.openaiApiKey || envKey || null;
    this.useDemoMode = config.useDemoMode ?? (envKey ? false : true);

    console.log("🎯 Final API Key available:", !!this.apiKey);
    console.log("🎯 Final API Key value:", this.apiKey);
    console.log("🎭 Final Demo Mode:", this.useDemoMode);
  }

  setConfig(config: AIConfig) {
    console.log("⚙️ RealAIModel setConfig called:");
    console.log("🔑 New API Key provided:", !!config.openaiApiKey);
    console.log(
      "🌍 Environment API Key available:",
      !!import.meta.env.VITE_OPENAI_API_KEY
    );

    this.apiKey =
      config.openaiApiKey || import.meta.env.VITE_OPENAI_API_KEY || null;
    this.useDemoMode = config.useDemoMode ?? (this.apiKey ? false : true);

    console.log("🎯 Final API Key available:", !!this.apiKey);
    console.log("🎭 Final Demo Mode:", this.useDemoMode);
  }

  async generateResponse(userInput: string): Promise<string> {
    console.log("🔍 AI Service: generateResponse called with:", userInput);
    console.log("🔑 API Key available:", !!this.apiKey);
    console.log("🎭 Demo mode:", this.useDemoMode);

    try {
      // Try real API if key is available
      if (this.apiKey && !this.useDemoMode) {
        console.log("🚀 Attempting real OpenAI API call...");
        try {
          const response = await this.callOpenAI(userInput);
          console.log("✅ OpenAI API response received");
          return response;
        } catch (error) {
          console.warn("OpenAI API failed, falling back to demo mode:", error);
          // Fall back to demo mode
        }
      }

      // Demo mode - generate intelligent responses
      console.log("🎭 Using demo mode response");
      const demoResponse = this.generateDemoResponse(userInput);
      console.log("📝 Demo response generated:", demoResponse);
      return demoResponse;
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I apologize, but I'm experiencing technical difficulties. Please try again or check your API configuration.";
    }
  }

  private async callOpenAI(userInput: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("No API key provided");
    }

    const apiUrl =
      import.meta.env.VITE_OPENAI_API_URL || "https://api.openai.com/v1";

    console.log("🚀 OpenAI API Call Starting...");
    console.log(
      "🔑 API Key (first 10 chars):",
      this.apiKey.substring(0, 10) + "..."
    );
    console.log("📝 User Input:", userInput);
    console.log("🌐 API URL:", `${apiUrl}/chat/completions`);

    try {
      // Enhanced system prompt with more context
      const systemPrompt = `You are Rosie AI, an advanced and intelligent AI assistant. You are helpful, knowledgeable, and provide detailed, accurate responses. You excel at:

- Programming and software development (React, JavaScript, TypeScript, Python, etc.)
- Creative writing and content creation
- Business strategy and analysis
- Problem-solving and critical thinking
- Educational explanations and tutoring
- Football/soccer analysis and predictions
- General knowledge and research

Always provide comprehensive, well-structured responses that are both informative and engaging. If the user asks follow-up questions, maintain context from previous messages in the conversation.`;

      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        max_tokens: 1500, // Increased token limit for more detailed responses
        temperature: 0.7,
        presence_penalty: 0.1, // Encourage diverse responses
        frequency_penalty: 0.1, // Reduce repetition
      };

      console.log("📤 Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response Status:", response.status);
      console.log(
        "📥 Response Headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("❌ OpenAI API Error:", error);
        throw new Error(
          `OpenAI API error: ${error.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        "✅ OpenAI API Response Data:",
        JSON.stringify(data, null, 2)
      );

      const aiResponse =
        data.choices?.[0]?.message?.content || "No response from AI";
      console.log("🤖 AI Response Content:", aiResponse);

      return aiResponse;
    } catch (error) {
      console.error("❌ OpenAI API call failed:", error);
      throw error;
    }
  }

  private generateDemoResponse(userInput: string): string {
    const input = userInput.toLowerCase();

    // Enhanced responses with more context and detail
    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! I'm Rosie AI, your intelligent assistant. I'm here to help you with a wide range of tasks including coding, analysis, creative writing, problem-solving, and much more. What would you like to work on today?";
    } else if (
      input.includes("explain") ||
      input.includes("how") ||
      input.includes("why")
    ) {
      return `I'd be happy to explain that for you! Let me break this down into clear, understandable steps. This is an excellent question that deserves a thorough and comprehensive answer. I'll make sure to cover all the important aspects and provide you with actionable insights.`;
    } else if (
      input.includes("react") ||
      input.includes("javascript") ||
      input.includes("code")
    ) {
      return "I'd be delighted to help with programming! I have extensive knowledge of React, JavaScript, TypeScript, and many other technologies. Whether you need help with hooks, components, state management, or debugging, I'm here to assist. What specific coding challenge are you working on?";
    } else if (input.includes("joke") || input.includes("funny")) {
      return "Why don't programmers like nature? It has too many bugs! 😄 But seriously, I can help with much more than just jokes - I'm great at problem-solving, creative thinking, and technical assistance!";
    } else if (input.includes("math") || input.includes("calculate")) {
      return "I can definitely help with mathematics! I can assist with calculations, problem-solving, algebra, calculus, statistics, and more. Please provide the specific math problem or calculation you'd like help with, and I'll work through it step by step.";
    } else if (input.includes("weather")) {
      return "I'd be happy to help with weather-related questions! While I don't have access to real-time weather data, I can help you understand weather patterns, climate science, or assist with weather-related projects and research.";
    } else if (input.includes("canna") || input.includes("cannabis")) {
      return "I'm your specialized cannabis assistant! I can help with cannabis education, research, cultivation techniques, medical applications, legal information, and industry insights. What specific aspect of cannabis would you like to explore?";
    } else if (input.includes("football") || input.includes("soccer")) {
      return "I'm passionate about football! I can help with match predictions, team analysis, league standings, player statistics, tactical discussions, and betting insights. What football topic interests you today?";
    } else if (
      input.includes("creative") ||
      input.includes("write") ||
      input.includes("story")
    ) {
      return "I love creative writing! I can help you craft stories, poems, articles, marketing copy, or any other creative content. I can assist with brainstorming, structure, character development, and editing. What kind of creative project are you working on?";
    } else if (
      input.includes("business") ||
      input.includes("marketing") ||
      input.includes("strategy")
    ) {
      return "I'm excellent at business strategy and marketing! I can help with business plans, marketing strategies, market analysis, competitive research, and growth planning. What business challenge can I help you tackle?";
    } else {
      return `That's a fascinating question about "${userInput}". I'm excited to dive into this topic with you! Let me provide a comprehensive and thoughtful response that addresses all aspects of your question. I'll make sure to give you actionable insights and clear explanations. What specific angle would you like me to focus on?`;
    }
  }
}

// Real Chat Agent
export class RealChatAgent {
  private aiModel: RealAIModel;
  private sessions: Map<string, any> = new Map();
  private footballService: FootballPredictionService;
  private conversationMemory: Map<string, AIMessage[]> = new Map();
  private contextWindow: number = 10; // Keep last 10 messages for context
  private ragService: RAGService;
  private userId: string;

  constructor(config: AIConfig = {}, userId: string = "default-user") {
    this.aiModel = new RealAIModel(config);
    this.footballService = new FootballPredictionService();
    this.userId = userId;
    this.ragService = new RAGService(userId);
  }

  getUserId(): string {
    return this.userId;
  }

  setConfig(config: AIConfig) {
    this.aiModel.setConfig(config);
  }

  getConfig(): AIConfig {
    return {
      openaiApiKey: this.aiModel["apiKey"] || undefined,
      useDemoMode: this.aiModel["useDemoMode"] || true,
    };
  }

  async sendMessage(
    sessionId: string,
    message: string,
    files?: File[],
    searchWeb?: boolean
  ): Promise<AIMessage> {
    console.log("💬 Chat Agent: sendMessage called");
    console.log("📝 Message:", message);
    console.log("📁 Files:", files?.length || 0);
    console.log("🔍 Search web:", searchWeb);

    try {
      let response = "";

      // Get conversation context for this session
      const conversationHistory = this.conversationMemory.get(sessionId) || [];
      const recentContext = conversationHistory.slice(-this.contextWindow);

      // Process files if any
      if (files && files.length > 0) {
        console.log("📁 Processing files...");
        response += "\n\n**📁 Files:**\n";
        for (const file of files) {
          response += `📄 ${file.name} (${this.formatFileSize(
            file.size
          )}) - Type: ${file.type}\n`;
        }
        response += "\n";
      }

      // Check for football prediction requests
      if (this.isFootballPredictionRequest(message)) {
        console.log("⚽ Football prediction request detected");
        const footballResponse = await this.handleFootballPrediction(message);
        response = footballResponse;
      } else {
        // Generate AI response with RAG if enabled
        console.log("🤖 Calling AI model with context...");

        if (env.ENABLE_RAG) {
          console.log("🧠 RAG enabled - using enhanced response");
          try {
            const enhancedResponse = await this.ragService.getEnhancedResponse(
              message,
              sessionId,
              true
            );
            response = enhancedResponse + response;
          } catch (ragError) {
            console.warn(
              "RAG service failed, falling back to standard AI:",
              ragError
            );
            const contextualMessage = this.buildContextualMessage(
              message,
              recentContext
            );
            const aiResponse = await this.aiModel.generateResponse(
              contextualMessage
            );
            response = aiResponse + response;
          }
        } else {
          const contextualMessage = this.buildContextualMessage(
            message,
            recentContext
          );
          const aiResponse = await this.aiModel.generateResponse(
            contextualMessage
          );
          response = aiResponse + response;
        }

        console.log("✅ AI response received:", response);
      }

      const finalMessage: AIMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: "text",
        metadata: {
          fileName: files?.[0]?.name,
        },
      };

      // Update conversation memory
      this.updateConversationMemory(sessionId, message, finalMessage);

      // Store conversation in RAG database if enabled
      if (env.ENABLE_RAG) {
        try {
          await this.ragService.storeConversation(
            message,
            finalMessage.content,
            sessionId
          );
        } catch (ragError) {
          console.warn(
            "Failed to store conversation in RAG database:",
            ragError
          );
        }
      }

      console.log("📤 Final message prepared:", finalMessage);
      return finalMessage;
    } catch (error) {
      console.error("Error in sendMessage:", error);

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "Hello! I'm Rosie AI. How can I help you today?",
        timestamp: new Date(),
        type: "text",
        metadata: {},
      };
    }
  }

  // Session management
  createSession(title?: string): any {
    const session = {
      id: Date.now().toString(),
      title: title || `AI Chat ${this.sessions.size + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): any | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): any[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  deleteSession(sessionId: string): boolean {
    // Clear conversation memory when deleting session
    this.clearConversationMemory(sessionId);
    return this.sessions.delete(sessionId);
  }

  getCannedPrompts(personality: string): string[] {
    const prompts = [
      "Hello! How can I help you today?",
      "Explain React hooks",
      "Help me solve a coding problem",
      "Tell me a joke",
      "What can you help me with?",
      "How do I get started with programming?",
      "Explain async/await in JavaScript",
      "What are the best practices for React?",
      "Help me understand TypeScript",
      "How do I optimize my website performance?",
      // Football prediction prompts
      "Show me today's football predictions",
      "Premier League standings",
      "La Liga table",
      "Upcoming matches this week",
      "Predict Manchester City vs Arsenal",
      "Football betting tips for today",
      "Champions League predictions",
      "Best football bets this weekend",
    ];

    if (personality.includes("coding") || personality.includes("programming")) {
      return [
        "Explain React hooks",
        "Help me solve a coding problem",
        "How do I get started with programming?",
        "Explain async/await in JavaScript",
        "What are the best practices for React?",
        "Help me understand TypeScript",
      ];
    } else if (
      personality.includes("football") ||
      personality.includes("soccer")
    ) {
      return [
        "Show me today's football predictions",
        "Premier League standings",
        "La Liga table",
        "Upcoming matches this week",
        "Predict Manchester City vs Arsenal",
        "Football betting tips for today",
        "Champions League predictions",
        "Best football bets this weekend",
      ];
    }

    return prompts;
  }

  setAgentPersonality(personality: string): void {
    console.log(`Personality set to: ${personality}`);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Build contextual message with conversation history
  private buildContextualMessage(
    currentMessage: string,
    context: AIMessage[]
  ): string {
    if (context.length === 0) {
      return currentMessage;
    }

    let contextualPrompt = "Previous conversation context:\n";

    // Add recent conversation history
    context.forEach((msg) => {
      const role = msg.role === "user" ? "User" : "Assistant";
      contextualPrompt += `${role}: ${msg.content}\n`;
    });

    contextualPrompt += `\nCurrent message: ${currentMessage}`;
    contextualPrompt += `\n\nPlease respond to the current message while considering the conversation context above. Be helpful and maintain continuity with the previous discussion.`;

    return contextualPrompt;
  }

  // Update conversation memory for a session
  private updateConversationMemory(
    sessionId: string,
    userMessage: string,
    aiResponse: AIMessage
  ): void {
    const currentMemory = this.conversationMemory.get(sessionId) || [];

    // Add user message
    const userMsg: AIMessage = {
      id: Date.now().toString() + "_user",
      role: "user",
      content: userMessage,
      timestamp: new Date(),
      type: "text",
    };

    // Add both messages to memory
    const updatedMemory = [...currentMemory, userMsg, aiResponse];

    // Keep only the last contextWindow messages to prevent memory overflow
    const trimmedMemory = updatedMemory.slice(-this.contextWindow);

    this.conversationMemory.set(sessionId, trimmedMemory);

    console.log(
      `🧠 Updated conversation memory for session ${sessionId}: ${trimmedMemory.length} messages`
    );
  }

  // Get conversation context for a session
  getConversationContext(sessionId: string): AIMessage[] {
    return this.conversationMemory.get(sessionId) || [];
  }

  // Clear conversation memory for a session
  clearConversationMemory(sessionId: string): void {
    this.conversationMemory.delete(sessionId);
    console.log(`🧠 Cleared conversation memory for session ${sessionId}`);
  }

  // Football prediction methods
  private isFootballPredictionRequest(message: string): boolean {
    const footballKeywords = [
      "football",
      "soccer",
      "prediction",
      "match",
      "team",
      "league",
      "premier league",
      "la liga",
      "bundesliga",
      "serie a",
      "champions league",
      "today",
      "tomorrow",
      "weekend",
      "bet",
      "odds",
      "forecast",
      "result",
    ];

    return footballKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private async handleFootballPrediction(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("today") || lowerMessage.includes("today's")) {
      return this.generateTodayPredictions();
    } else if (
      lowerMessage.includes("standings") ||
      lowerMessage.includes("table")
    ) {
      return this.generateLeagueStandings(message);
    } else if (
      lowerMessage.includes("upcoming") ||
      lowerMessage.includes("next")
    ) {
      return this.generateUpcomingMatches();
    } else {
      return this.generateGeneralFootballInfo();
    }
  }

  private generateTodayPredictions(): string {
    const predictions = this.footballService.generateTodayPredictions();

    let response = "⚽ **Today's Football Predictions**\n\n";

    predictions.forEach((pred, index) => {
      response += `**${index + 1}. ${pred.homeTeam} vs ${pred.awayTeam}**\n`;
      response += `🏆 League: ${pred.league}\n`;
      response += `🎯 Prediction: **${pred.prediction}** (${pred.confidence}% confidence)\n`;
      response += `💭 Reasoning: ${pred.reasoning}\n`;

      if (pred.odds) {
        response += `💰 Odds: H: ${pred.odds.home.toFixed(
          2
        )}, D: ${pred.odds.draw.toFixed(2)}, A: ${pred.odds.away.toFixed(2)}\n`;
      }

      response += `🔑 Key Factors: ${pred.keyFactors.join(", ")}\n\n`;
    });

    response +=
      "⚠️ **Disclaimer**: These are AI-generated predictions for entertainment purposes only. Please gamble responsibly.";

    return response;
  }

  private generateLeagueStandings(message: string): string {
    const leagues = ["Premier League", "La Liga", "Bundesliga"];
    const league =
      leagues.find((l) => message.toLowerCase().includes(l.toLowerCase())) ||
      "Premier League";

    const standings = this.footballService.getLeagueStandings(league);

    let response = `🏆 **${league} Standings**\n\n`;
    response += "Pos | Team | P | W | D | L | GF | GA | Pts\n";
    response += "----|------|---|----|----|----|----|----|----\n";

    standings.slice(0, 10).forEach((team) => {
      response += `${team.position.toString().padStart(3)} | ${team.team.padEnd(
        20
      )} | ${team.played} | ${team.won} | ${team.drawn} | ${team.lost} | ${
        team.goalsFor
      } | ${team.goalsAgainst} | ${team.points}\n`;
    });

    return response;
  }

  private generateUpcomingMatches(): string {
    const upcoming = this.footballService.getUpcomingMatches();

    let response = "📅 **Upcoming Matches (Next 7 Days)**\n\n";

    upcoming.forEach((match, index) => {
      response += `${index + 1}. ${match}\n`;
    });

    return response;
  }

  private generateGeneralFootballInfo(): string {
    return (
      `⚽ **Football Information & Predictions**\n\n` +
      `I can help you with:\n` +
      `• Today's match predictions\n` +
      `• League standings and tables\n` +
      `• Upcoming matches\n` +
      `• Team analysis and statistics\n\n` +
      `Just ask me about:\n` +
      `• "Show me today's football predictions"\n` +
      `• "Premier League standings"\n` +
      `• "Upcoming matches this week"\n` +
      `• "Predict the result of [Team A] vs [Team B]"`
    );
  }

  // RAG Database Operations
  async getUserInfo(): Promise<any> {
    if (!env.ENABLE_RAG) {
      return { assets: [], spaces: [], locations: [] };
    }
    return await this.ragService.getUserInfo();
  }

  async getAssetWarranty(assetId: string, assetName: string): Promise<string> {
    if (!env.ENABLE_RAG) {
      return "RAG functionality is not enabled.";
    }
    return await this.ragService.getAssetWarranty(assetId, assetName);
  }

  async estimateAssetValue(
    assetId: string,
    assetName: string
  ): Promise<string> {
    if (!env.ENABLE_RAG) {
      return "RAG functionality is not enabled.";
    }
    return await this.ragService.estimateAssetValue(assetId, assetName);
  }

  async createLocation(locationData: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
    street1?: string;
    zipcode?: string;
  }): Promise<string> {
    if (!env.ENABLE_RAG) {
      return "RAG functionality is not enabled.";
    }
    return await this.ragService.createLocation(locationData);
  }

  async createSpace(spaceName: string): Promise<string> {
    if (!env.ENABLE_RAG) {
      return "RAG functionality is not enabled.";
    }
    return await this.ragService.createSpace(spaceName);
  }

  async editLocation(locationId: string, updates: any): Promise<string> {
    if (!env.ENABLE_RAG) {
      return "RAG functionality is not enabled.";
    }
    return await this.ragService.editLocation(locationId, updates);
  }

  async editSpace(spaceId: string, updates: any): Promise<string> {
    if (!env.ENABLE_RAG) {
      return "RAG functionality is not enabled.";
    }
    return await this.ragService.editSpace(spaceId, updates);
  }

  async editAsset(assetId: string, updates: any): Promise<string> {
    if (!env.ENABLE_RAG) {
      return "RAG functionality is not enabled.";
    }
    return await this.ragService.editAsset(assetId, updates);
  }

  async searchKnowledge(query: string, k: number = 5): Promise<string[]> {
    if (!env.ENABLE_RAG) {
      return [];
    }
    return await this.ragService.searchKnowledge(query, k);
  }
}
