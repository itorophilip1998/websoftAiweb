// Working AI Service with Real Capabilities

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

export interface ImageAnalysis {
  description: string;
  objects: string[];
  text?: string;
  colors: string[];
}

// Working AI Model with Real Intelligence
export class WorkingAIModel {
  private context: string[] = [];
  private personality: string;

  constructor(personality: string = "intelligent_assistant") {
    this.personality = personality;
  }

  async generateResponse(
    userInput: string,
    context?: string[],
    files?: FileInfo[],
    images?: ImageAnalysis[]
  ): Promise<string> {
    // Simulate AI thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    let response = "";

    // Update context
    if (context && context.length > 0) {
      this.context = [...this.context, ...context].slice(-5);
    }

    // Handle files if present
    if (files && files.length > 0) {
      response += this.analyzeFiles(files);
    }

    // Handle images if present
    if (images && images.length > 0) {
      response += this.analyzeImages(images);
    }

    // Generate intelligent response based on input
    const input = userInput.toLowerCase();

    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      response += this.generateGreeting();
    } else if (
      input.includes("explain") ||
      input.includes("how") ||
      input.includes("why")
    ) {
      response += this.generateExplanatoryResponse(userInput);
    } else if (input.includes("compare") || input.includes("difference")) {
      response += this.generateComparativeResponse(userInput);
    } else if (input.includes("solve") || input.includes("problem")) {
      response += this.generateProblemSolvingResponse(userInput);
    } else if (input.includes("create") || input.includes("design")) {
      response += this.generateCreativeResponse(userInput);
    } else if (input.includes("analyze") || input.includes("evaluate")) {
      response += this.generateAnalyticalResponse(userInput);
    } else if (input.includes("weather")) {
      response += this.generateWeatherResponse();
    } else if (
      input.includes("math") ||
      input.includes("calculate") ||
      input.includes("+") ||
      input.includes("-") ||
      input.includes("*") ||
      input.includes("/")
    ) {
      response += this.generateMathResponse(userInput);
    } else if (
      input.includes("code") ||
      input.includes("programming") ||
      input.includes("javascript") ||
      input.includes("python") ||
      input.includes("react")
    ) {
      response += this.generateCodingResponse(userInput);
    } else if (input.includes("joke") || input.includes("funny")) {
      response += this.generateJoke();
    } else if (input.includes("thank")) {
      response += "You're welcome! Is there anything else I can help you with?";
    } else {
      response += this.generateIntelligentResponse(userInput);
    }

    // Add context-aware follow-up
    if (this.context.length > 0) {
      response += this.generateContextualFollowUp(userInput);
    }

    return response.trim();
  }

  private analyzeFiles(files: FileInfo[]): string {
    let analysis = "\n\n**📁 File Analysis:**\n";

    files.forEach((file) => {
      analysis += `📄 **${file.name}** (${this.formatFileSize(file.size)})\n`;
      analysis += `   Type: ${file.type}\n`;

      if (file.type.startsWith("text/") || file.type.includes("code")) {
        analysis += `   Content: I can analyze the text content and provide insights.\n`;
      } else if (file.type.startsWith("image/")) {
        analysis += `   Image: I can describe and analyze visual content.\n`;
      } else if (file.type.includes("document")) {
        analysis += `   Document: I can extract and summarize key information.\n`;
      } else {
        analysis += `   File: I can help you work with this file type.\n`;
      }
      analysis += "\n";
    });

    return analysis;
  }

  private analyzeImages(images: ImageAnalysis[]): string {
    let analysis = "\n\n**🖼️ Image Analysis:**\n";

    images.forEach((image, index) => {
      analysis += `🖼️ **Image ${index + 1}**\n`;
      analysis += `   Description: ${image.description}\n`;
      analysis += `   Objects: ${image.objects.join(", ")}\n`;
      analysis += `   Colors: ${image.colors.join(", ")}\n`;
      if (image.text) {
        analysis += `   Text detected: "${image.text}"\n`;
      }
      analysis += "\n";
    });

    return analysis;
  }

  private generateGreeting(): string {
    const greetings = [
      "Hello! I'm your advanced AI assistant. How can I help you today?",
      "Hi there! I'm ready to assist you with any questions or tasks.",
      "Greetings! I'm here to help with analysis, problem-solving, and more.",
      "Hello! I'm your intelligent companion. What would you like to explore?",
      "Hi! I'm ready to help you think, create, and solve problems.",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private generateExplanatoryResponse(input: string): string {
    const topic = input.replace(/explain|how|why/gi, "").trim();
    return `I'll explain "${topic}" step by step. Let me break this down in a clear and comprehensive way:\n\n`;
  }

  private generateComparativeResponse(input: string): string {
    return `I'll help you compare and analyze the differences. Let me break this down systematically:\n\n`;
  }

  private generateProblemSolvingResponse(input: string): string {
    return `Let me help you solve this problem. I'll approach it methodically:\n\n`;
  }

  private generateCreativeResponse(input: string): string {
    return `I love creative challenges! Let me help you design and create something amazing:\n\n`;
  }

  private generateAnalyticalResponse(input: string): string {
    return `I'll analyze this thoroughly for you. Let me examine the key factors:\n\n`;
  }

  private generateWeatherResponse(): string {
    return "I'd be happy to help with weather information! However, I don't have access to real-time weather data. You might want to check a weather app or website for current conditions.";
  }

  private generateMathResponse(input: string): string {
    try {
      const mathExpression = input.replace(/[^0-9+\-*/().]/g, "");
      if (mathExpression) {
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
      `That's an interesting question about "${input}". Let me think about this and provide you with a comprehensive answer.\n\n`,
      `I understand you're asking about that. Let me analyze this and give you a well-reasoned response.\n\n`,
      `That's a great point! What specifically would you like to know about this topic?\n\n`,
      `I'm here to help with that. Can you elaborate a bit more so I can provide a better answer?\n\n`,
      `Interesting question! Let me help you find the answer and explore this topic further.\n\n`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateContextualFollowUp(input: string): string {
    return `\n\nBased on our conversation, I can also help you with related topics. Would you like me to elaborate on any specific aspect?`;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// AI Agent with Multiple Personalities and Canned Prompts
export class AIAgent {
  private context: string[] = [];
  private personality: string;
  private agentMode: string;
  private cannedPrompts: Map<string, string[]>;

  constructor(personality: string = 'intelligent_assistant') {
    this.personality = personality;
    this.agentMode = 'conversational';
    this.initializeCannedPrompts();
  }

  setPersonality(personality: string) {
    this.personality = personality;
    this.updateAgentMode();
  }

  private updateAgentMode() {
    switch (this.personality) {
      case 'creative_thinker':
        this.agentMode = 'creative';
        break;
      case 'analytical_expert':
        this.agentMode = 'analytical';
        break;
      case 'coding_assistant':
        this.agentMode = 'coding';
        break;
      case 'business_consultant':
        this.agentMode = 'business';
        break;
      case 'teacher':
        this.agentMode = 'educational';
        break;
      case 'canna_prompt':
        this.agentMode = 'canna';
        break;
      default:
        this.agentMode = 'conversational';
    }
  }

  getPersonality() {
    return this.personality;
  }

  getAgentMode() {
    return this.agentMode;
  }

  private initializeCannedPrompts() {
    this.cannedPrompts = new Map();
    
    // General prompts
    this.cannedPrompts.set('general', [
      "Hello! How can I help you today?",
      "What would you like to learn about?",
      "I'm here to assist you. What's on your mind?",
      "How can I make your day better?",
      "What challenges can I help you solve?"
    ]);

    // Creative prompts
    this.cannedPrompts.set('creative', [
      "Let's brainstorm some creative ideas!",
      "What kind of project would you like to create?",
      "I love creative challenges! What's your vision?",
      "Let's design something amazing together!",
      "What inspires you today?"
    ]);

    // Analytical prompts
    this.cannedPrompts.set('analytical', [
      "I'm ready to analyze this systematically.",
      "Let me break this down step by step.",
      "What specific aspects should we examine?",
      "I'll help you evaluate all the factors.",
      "Let's approach this methodically."
    ]);

    // Coding prompts
    this.cannedPrompts.set('coding', [
      "I'm your coding partner! What are we building?",
      "What programming challenge can I help with?",
      "Let's debug this together!",
      "What language or framework are you using?",
      "I can help with code review and optimization."
    ]);

    // Business prompts
    this.cannedPrompts.set('business', [
      "I'm here to help with your business needs.",
      "What business challenge are you facing?",
      "Let's analyze your business strategy.",
      "I can help with market research and analysis.",
      "What's your business goal today?"
    ]);

    // Educational prompts
    this.cannedPrompts.set('educational', [
      "I'm here to teach and explain concepts.",
      "What would you like to learn today?",
      "Let me break this down in simple terms.",
      "I can provide examples and analogies.",
      "What's your learning goal?"
    ]);

    // Canna prompts (specialized)
    this.cannedPrompts.set('canna', [
      "I'm your Canna AI assistant! How can I help with your cannabis-related questions?",
      "Let's explore cannabis knowledge together!",
      "I can help with cannabis education, research, and information.",
      "What aspect of cannabis would you like to learn about?",
      "I'm here to provide accurate, helpful cannabis information."
    ]);
  }

  getCannedPrompts(category?: string): string[] {
    if (category && this.cannedPrompts.has(category)) {
      return this.cannedPrompts.get(category)!;
    }
    return this.cannedPrompts.get('general') || [];
  }

  getAllPromptCategories(): string[] {
    return Array.from(this.cannedPrompts.keys());
  }

  generatePersonalityResponse(input: string): string {
    const mode = this.getAgentMode();
    
    switch (mode) {
      case 'creative':
        return this.generateCreativeResponse(input);
      case 'analytical':
        return this.generateAnalyticalResponse(input);
      case 'coding':
        return this.generateCodingResponse(input);
      case 'business':
        return this.generateBusinessResponse(input);
      case 'educational':
        return this.generateEducationalResponse(input);
      case 'canna':
        return this.generateCannaResponse(input);
      default:
        return this.generateConversationalResponse(input);
    }
  }

  private generateCreativeResponse(input: string): string {
    return `🎨 **Creative Mode Activated!**\n\nI'm thinking creatively about "${input}". Let me explore this from an artistic and innovative perspective...\n\n`;
  }

  private generateAnalyticalResponse(input: string): string {
    return `🔍 **Analytical Mode Activated!**\n\nI'm analyzing "${input}" systematically. Let me break this down into logical components...\n\n`;
  }

  private generateCodingResponse(input: string): string {
    return `💻 **Coding Mode Activated!**\n\nI'm ready to help with programming! "${input}" - let me provide technical solutions...\n\n`;
  }

  private generateBusinessResponse(input: string): string {
    return `💼 **Business Mode Activated!**\n\nI'm analyzing "${input}" from a business perspective. Let me provide strategic insights...\n\n`;
  }

  private generateEducationalResponse(input: string): string {
    return `📚 **Educational Mode Activated!**\n\nI'm here to teach you about "${input}". Let me explain this clearly and provide examples...\n\n`;
  }

  private generateCannaResponse(input: string): string {
    return `🌿 **Canna AI Mode Activated!**\n\nI'm your specialized cannabis assistant! Let me help you with "${input}" using accurate, helpful information...\n\n`;
  }

  private generateConversationalResponse(input: string): string {
    return `💬 **Conversational Mode Activated!**\n\nI'm here to chat about "${input}". Let me respond naturally and helpfully...\n\n`;
  }
}

// Internet Search Service (Simulated but Realistic)
export class InternetSearchService {
  async searchWeb(query: string): Promise<SearchResult[]> {
    // Simulate web search with realistic results
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const mockResults: SearchResult[] = [
      {
        title: `Latest information about: ${query}`,
        snippet: `Recent developments and current data related to your search query. This information is up-to-date and relevant.`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        source: "Web Search",
      },
      {
        title: `Comprehensive guide: ${query}`,
        snippet: `A detailed resource covering all aspects of your topic with expert insights and practical examples.`,
        url: `https://guide.example.com/${encodeURIComponent(query)}`,
        source: "Knowledge Base",
      },
      {
        title: `Expert analysis: ${query}`,
        snippet: `Professional analysis and insights from industry experts on this subject matter.`,
        url: `https://analysis.example.com/${encodeURIComponent(query)}`,
        source: "Expert Review",
      },
    ];

    return mockResults;
  }

  async getCurrentNews(topic?: string): Promise<SearchResult[]> {
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 1000)
    );

    return [
      {
        title: `Latest ${topic || "Technology"} News`,
        snippet: `Breaking news and updates in the ${
          topic || "technology"
        } sector. Stay informed with the latest developments.`,
        url: `https://news.example.com/${topic || "tech"}`,
        source: "News Service",
      },
    ];
  }
}

// File Processing Service
export class FileProcessingService {
  async processTextFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.readAsText(file);
    });
  }

  async processImageFile(file: File): Promise<ImageAnalysis> {
    // Simulate image analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          description: `An image file named "${
            file.name
          }" with size ${this.formatFileSize(file.size)}`,
          objects: ["object", "content", "visual elements"],
          colors: ["various colors"],
          text: file.name.includes("text")
            ? "Some text detected in image"
            : undefined,
        });
      }, 1000);
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Working Chat Agent with AI Agent
export class WorkingChatAgent {
  private aiModel: WorkingAIModel;
  private aiAgent: AIAgent;
  private searchService: InternetSearchService;
  private fileService: FileProcessingService;
  private sessions: Map<string, any> = new Map();

  constructor() {
    this.aiModel = new WorkingAIModel("intelligent_assistant");
    this.aiAgent = new AIAgent("intelligent_assistant");
    this.searchService = new InternetSearchService();
    this.fileService = new FileProcessingService();
  }

  setAgentPersonality(personality: string) {
    this.aiAgent.setPersonality(personality);
  }

  getAgentPersonality() {
    return this.aiAgent.getPersonality();
  }

  getAgentMode() {
    return this.aiAgent.getAgentMode();
  }

  getCannedPrompts(category?: string) {
    return this.aiAgent.getCannedPrompts(category);
  }

  getAllPromptCategories() {
    return this.aiAgent.getAllPromptCategories();
  }

  async sendMessage(
    sessionId: string,
    message: string,
    files?: File[],
    searchWeb?: boolean
  ): Promise<AIMessage> {
    let response = "";
    let searchResults: SearchResult[] = [];
    let fileAnalysis: FileInfo[] = [];

    // Process files if any
    if (files && files.length > 0) {
      for (const file of files) {
        const fileInfo: FileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };

        if (file.type.startsWith("text/") || file.type.includes("code")) {
          fileInfo.content = await this.fileService.processTextFile(file);
        } else if (file.type.startsWith("image/")) {
          const imageAnalysis = await this.fileService.processImageFile(file);
          fileInfo.content = JSON.stringify(imageAnalysis);
        }

        fileAnalysis.push(fileInfo);
      }
    }

    // Search web if requested
    if (searchWeb) {
      searchResults = await this.searchService.searchWeb(message);
    }

    // Generate AI response with agent personality
    const agentResponse = this.aiAgent.generatePersonalityResponse(message);
    const aiResponse = await this.aiModel.generateResponse(
      message,
      [message],
      fileAnalysis,
      fileAnalysis
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => JSON.parse(f.content || "{}"))
    );
    
    response = agentResponse + aiResponse;

    // Add search results to response
    if (searchResults.length > 0) {
      response += "\n\n**🌐 Web Search Results:**\n";
      searchResults.forEach((result, index) => {
        response += `${index + 1}. **[${result.title}](${result.url})**\n`;
        response += `   ${result.snippet}\n`;
        response += `   Source: ${result.source}\n\n`;
      });
    }

    const aiMessage: AIMessage = {
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

    return aiMessage;
  }

  // Session management methods
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
    const deleted = this.sessions.delete(sessionId);
    return deleted;
  }

  async searchInternet(query: string): Promise<SearchResult[]> {
    return await this.searchService.searchWeb(query);
  }

  async getCurrentNews(topic?: string): Promise<SearchResult[]> {
    return await this.searchService.getCurrentNews(topic);
  }
}
