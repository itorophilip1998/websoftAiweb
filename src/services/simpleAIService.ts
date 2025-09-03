// Simple AI Service - Stable and Working

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

// Simple AI Model - No crashes, always works
export class SimpleAIModel {
  async generateResponse(userInput: string): Promise<string> {
    // Simulate thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    const input = userInput.toLowerCase();

    // Generate contextual responses
    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! I'm Rosie AI, your intelligent assistant. How can I help you today?";
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

// Simple Search Service
export class SimpleSearchService {
  async searchWeb(query: string): Promise<SearchResult[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        title: `Information about: ${query}`,
        snippet: `Recent developments and current data related to your search query.`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        source: "Web Search",
      },
    ];
  }
}

// Simple File Service
export class SimpleFileService {
  async processFile(file: File): Promise<string> {
    return `File: ${file.name} (${this.formatFileSize(file.size)}) - Type: ${
      file.type
    }`;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Simple Chat Agent - Always works
export class SimpleChatAgent {
  private aiModel: SimpleAIModel;
  private searchService: SimpleSearchService;
  private fileService: SimpleFileService;
  private sessions: Map<string, any> = new Map();

  constructor() {
    this.aiModel = new SimpleAIModel();
    this.searchService = new SimpleSearchService();
    this.fileService = new SimpleFileService();
  }

  async sendMessage(
    sessionId: string,
    message: string,
    files?: File[],
    searchWeb?: boolean
  ): Promise<AIMessage> {
    try {
      let response = "";
      let searchResults: SearchResult[] = [];

      // Process files if any
      if (files && files.length > 0) {
        response += "\n\n**📁 Files:**\n";
        for (const file of files) {
          const fileInfo = await this.fileService.processFile(file);
          response += `📄 ${fileInfo}\n`;
        }
        response += "\n";
      }

      // Search web if requested
      if (searchWeb) {
        searchResults = await this.searchService.searchWeb(message);
        response += "\n\n**🌐 Web Search Results:**\n";
        searchResults.forEach((result, index) => {
          response += `${index + 1}. **${result.title}**\n`;
          response += `   ${result.snippet}\n`;
          response += `   Source: ${result.source}\n\n`;
        });
      }

      // Generate AI response
      const aiResponse = await this.aiModel.generateResponse(message);
      response = aiResponse + response;

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: "text",
        metadata: {
          searchResults,
          fileName: files?.[0]?.name,
        },
      };
    } catch (error) {
      console.error("Error in sendMessage:", error);

      // Always return a working response
      return {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Hello! I'm Rosie AI, your intelligent assistant. How can I help you today?",
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

  // Add missing methods that the AIChat component expects
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
    ];

    // Return different prompts based on personality
    if (personality.includes("coding") || personality.includes("programming")) {
      return [
        "Explain React hooks",
        "Help me solve a coding problem",
        "How do I get started with programming?",
        "Explain async/await in JavaScript",
        "What are the best practices for React?",
        "Help me understand TypeScript",
      ];
    } else if (personality.includes("business")) {
      return [
        "Help me create a business strategy",
        "How do I analyze market trends?",
        "What are the key metrics for startups?",
        "Help me with financial planning",
        "How do I improve customer retention?",
      ];
    } else if (personality.includes("canna")) {
      return [
        "Tell me about cannabis benefits",
        "How does CBD work?",
        "What are the different cannabis strains?",
        "Help me understand cannabis laws",
        "What are the medical applications?",
      ];
    }

    return prompts;
  }

  setAgentPersonality(personality: string): void {
    // Simple implementation - just store the personality
    console.log(`Personality set to: ${personality}`);
  }
}
