// Real AI Service with OpenAI API Support
import FootballPredictionService from "./footballPredictionService";

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
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are Websoft AI, a helpful and intelligent AI assistant. Provide clear, helpful, and accurate responses.",
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
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

    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! I'm Websoft AI, your intelligent assistant. How can I help you today?";
    } else if (
      input.includes("explain") ||
      input.includes("how") ||
      input.includes("why")
    ) {
      return `I'll explain that for you! Let me break it down step by step. This is a great question that deserves a comprehensive answer.`;
    } else if (
      input.includes("react") ||
      input.includes("javascript") ||
      input.includes("code")
    ) {
      return "I'd be happy to help with programming! What specific question do you have about coding?";
    } else if (input.includes("joke") || input.includes("funny")) {
      return "Why don't programmers like nature? It has too many bugs! 😄";
    } else if (input.includes("math") || input.includes("calculate")) {
      return "I can help with math! Please provide a simple calculation like '2 + 2' or '10 * 5'.";
    } else if (input.includes("weather")) {
      return "I'd be happy to help with weather information! However, I don't have access to real-time weather data.";
    } else if (input.includes("canna") || input.includes("cannabis")) {
      return "I'm your specialized cannabis assistant! I can help with cannabis education, research, and information.";
    } else {
      return `That's an interesting question about "${userInput}". Let me think about this and provide you with a comprehensive answer. I'm here to help!`;
    }
  }
}

// Real Chat Agent
export class RealChatAgent {
  private aiModel: RealAIModel;
  private sessions: Map<string, any> = new Map();
  private footballService: FootballPredictionService;

  constructor(config: AIConfig = {}) {
    this.aiModel = new RealAIModel(config);
    this.footballService = new FootballPredictionService();
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
        // Generate AI response
        console.log("🤖 Calling AI model...");
        const aiResponse = await this.aiModel.generateResponse(message);
        console.log("✅ AI response received:", aiResponse);
        response = aiResponse + response;
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

      console.log("📤 Final message prepared:", finalMessage);
      return finalMessage;
    } catch (error) {
      console.error("Error in sendMessage:", error);

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "Hello! I'm Websoft AI. How can I help you today?",
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

  // Football prediction methods
  private isFootballPredictionRequest(message: string): boolean {
    const footballKeywords = [
      "football",
      "soccer",
      "prediction",
      "match",
      "game",
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
}
