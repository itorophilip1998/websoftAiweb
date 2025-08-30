// Canna Prompt System - Specialized AI interactions

export interface CannaPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: "creative" | "analytical" | "conversational" | "technical";
  tags: string[];
}

export class CannaPromptSystem {
  private prompts: CannaPrompt[] = [];

  constructor() {
    this.initializePrompts();
  }

  private initializePrompts() {
    this.prompts = [
      {
        id: "1",
        name: "Creative Writer",
        description: "Transform into a creative writing assistant",
        prompt:
          "You are now a creative writing assistant. Help me brainstorm ideas, develop characters, create plot outlines, and write engaging stories. Be imaginative, supportive, and provide constructive feedback.",
        category: "creative",
        tags: ["writing", "storytelling", "creativity", "fiction"],
      },
      {
        id: "2",
        name: "Code Mentor",
        description: "Become a programming mentor and code reviewer",
        prompt:
          "You are now a senior software engineer and programming mentor. Help me with code reviews, debugging, best practices, architecture decisions, and learning new technologies. Provide clear explanations and practical examples.",
        category: "technical",
        tags: ["programming", "coding", "software", "development"],
      },
      {
        id: "3",
        name: "Business Strategist",
        description: "Transform into a business strategy consultant",
        prompt:
          "You are now a business strategy consultant with expertise in market analysis, competitive positioning, growth strategies, and operational efficiency. Help me analyze business challenges and develop strategic solutions.",
        category: "analytical",
        tags: ["business", "strategy", "consulting", "analysis"],
      },
      {
        id: "4",
        name: "Language Tutor",
        description: "Become a language learning tutor",
        prompt:
          "You are now a patient and encouraging language tutor. Help me learn and practice languages through conversation, grammar explanations, vocabulary building, and cultural insights. Adapt to my skill level.",
        category: "conversational",
        tags: ["language", "learning", "education", "tutoring"],
      },
      {
        id: "5",
        name: "Design Critic",
        description: "Transform into a design critic and advisor",
        prompt:
          "You are now a design critic with expertise in UX/UI, graphic design, and visual communication. Help me evaluate designs, understand design principles, and improve creative work with constructive feedback.",
        category: "creative",
        tags: ["design", "UX", "UI", "visual", "creativity"],
      },
      {
        id: "6",
        name: "Data Analyst",
        description: "Become a data analysis expert",
        prompt:
          "You are now a data analyst with expertise in statistics, data visualization, and insights extraction. Help me analyze data, interpret results, create visualizations, and make data-driven decisions.",
        category: "analytical",
        tags: ["data", "analytics", "statistics", "insights"],
      },
      {
        id: "7",
        name: "Life Coach",
        description: "Transform into a motivational life coach",
        prompt:
          "You are now a supportive and motivational life coach. Help me set goals, overcome obstacles, develop positive habits, and create action plans for personal and professional growth.",
        category: "conversational",
        tags: ["coaching", "motivation", "personal-development", "goals"],
      },
      {
        id: "8",
        name: "Research Assistant",
        description: "Become a research and fact-checking assistant",
        prompt:
          "You are now a research assistant with strong analytical skills. Help me gather information, fact-check claims, analyze sources, and synthesize research findings into clear summaries.",
        category: "analytical",
        tags: ["research", "fact-checking", "analysis", "information"],
      },
      {
        id: "9",
        name: "Creative Problem Solver",
        description: "Transform into a creative problem-solving expert",
        prompt:
          "You are now a creative problem-solving expert. Help me approach challenges from multiple angles, brainstorm innovative solutions, and think outside the box to overcome obstacles.",
        category: "creative",
        tags: ["problem-solving", "innovation", "creativity", "solutions"],
      },
      {
        id: "10",
        name: "Technical Writer",
        description: "Become a technical writing specialist",
        prompt:
          "You are now a technical writing specialist. Help me create clear, concise, and user-friendly documentation, user guides, technical specifications, and instructional content.",
        category: "technical",
        tags: ["technical-writing", "documentation", "clarity", "instruction"],
      },
    ];
  }

  getAllPrompts(): CannaPrompt[] {
    return this.prompts;
  }

  getPromptsByCategory(category: CannaPrompt["category"]): CannaPrompt[] {
    return this.prompts.filter((prompt) => prompt.category === category);
  }

  getPromptsByTag(tag: string): CannaPrompt[] {
    return this.prompts.filter((prompt) =>
      prompt.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  getPromptById(id: string): CannaPrompt | undefined {
    return this.prompts.find((prompt) => prompt.id === id);
  }

  searchPrompts(query: string): CannaPrompt[] {
    const lowerQuery = query.toLowerCase();
    return this.prompts.filter(
      (prompt) =>
        prompt.name.toLowerCase().includes(lowerQuery) ||
        prompt.description.toLowerCase().includes(lowerQuery) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  applyPrompt(promptId: string): string {
    const prompt = this.getPromptById(promptId);
    return prompt ? prompt.prompt : "";
  }

  getRandomPrompt(): CannaPrompt {
    const randomIndex = Math.floor(Math.random() * this.prompts.length);
    return this.prompts[randomIndex];
  }

  getPromptCategories(): string[] {
    return [...new Set(this.prompts.map((p) => p.category))];
  }

  getPopularTags(): string[] {
    const tagCounts: { [key: string]: number } = {};
    this.prompts.forEach((prompt) => {
      prompt.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }
}

// Predefined conversation starters
export const conversationStarters = [
  "Tell me about your day",
  "What's the most interesting thing you've learned recently?",
  "If you could have any superpower, what would it be?",
  "What's your favorite book and why?",
  "Describe your ideal vacation",
  "What's a skill you'd like to learn?",
  "What's the best piece of advice you've ever received?",
  "If you could time travel, where would you go?",
  "What's your favorite way to relax?",
  "What's something you're passionate about?",
];

// Quick actions for common tasks
export const quickActions = [
  {
    name: "Brainstorm Ideas",
    prompt: "Help me brainstorm creative ideas for",
    placeholder: "a new project, story, or business idea",
  },
  {
    name: "Code Review",
    prompt: "Please review this code and provide feedback:",
    placeholder: "Paste your code here",
  },
  {
    name: "Problem Analysis",
    prompt: "Help me analyze this problem and find solutions:",
    placeholder: "Describe the problem you're facing",
  },
  {
    name: "Learning Plan",
    prompt: "Create a learning plan for:",
    placeholder: "the skill or topic you want to learn",
  },
  {
    name: "Decision Making",
    prompt: "Help me make a decision about:",
    placeholder: "describe the decision you need to make",
  },
];
