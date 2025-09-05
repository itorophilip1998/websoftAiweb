import { AIMessage } from "../types/ai";

// Database connection configuration
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Asset, Space, and Location types
export interface Asset {
  id: string;
  name: string;
  description?: string;
  spaceId: string;
  locationId: string;
  metadata?: any;
  thumbnailUrl?: string;
  color?: string;
  depth?: number;
  height?: number;
  weight?: number;
  width?: number;
}

export interface Space {
  id: string;
  name: string;
  icon?: string;
  locationId: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface Location {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  street1?: string;
  zipcode?: string;
  isDefault?: boolean;
  image?: string;
}

export interface UserInfo {
  assets: Asset[];
  spaces: Space[];
  locations: Location[];
}

// RAG Service class
export class RAGService {
  private apiBaseUrl: string;
  private userId: string;

  constructor(userId: string = "default-user") {
    this.apiBaseUrl =
      import.meta.env.VITE_RAG_API_URL || "http://localhost:8000";
    this.userId = userId;
  }

  // Vector search for knowledge retrieval
  async searchKnowledge(query: string, k: number = 5): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          k,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      return [];
    }
  }

  // Get user information (assets, spaces, locations)
  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/user-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting user info:", error);
      return { assets: [], spaces: [], locations: [] };
    }
  }

  // Get asset warranty information
  async getAssetWarranty(assetId: string, assetName: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/warranty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_id: assetId,
          asset_name: assetName,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get warranty info: ${response.statusText}`);
      }

      const data = await response.json();
      return data.warranty_info || "Unable to retrieve warranty information.";
    } catch (error) {
      console.error("Error getting warranty info:", error);
      return "Unable to retrieve warranty information.";
    }
  }

  // Estimate asset value
  async estimateAssetValue(
    assetId: string,
    assetName: string
  ): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/estimate-value`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_id: assetId,
          asset_name: assetName,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to estimate value: ${response.statusText}`);
      }

      const data = await response.json();
      return data.estimated_value || "Unable to estimate asset value.";
    } catch (error) {
      console.error("Error estimating asset value:", error);
      return "Unable to estimate asset value.";
    }
  }

  // Create new location
  async createLocation(locationData: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
    street1?: string;
    zipcode?: string;
  }): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/create-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...locationData,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create location: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message || "Location created successfully.";
    } catch (error) {
      console.error("Error creating location:", error);
      return "Failed to create location.";
    }
  }

  // Create new space
  async createSpace(spaceName: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/create-space`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          space_name: spaceName,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create space: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message || "Space created successfully.";
    } catch (error) {
      console.error("Error creating space:", error);
      return "Failed to create space.";
    }
  }

  // Edit location
  async editLocation(
    locationId: string,
    updates: Partial<Location>
  ): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/edit-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_id: locationId,
          ...updates,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit location: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message || "Location updated successfully.";
    } catch (error) {
      console.error("Error editing location:", error);
      return "Failed to update location.";
    }
  }

  // Edit space
  async editSpace(spaceId: string, updates: Partial<Space>): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/edit-space`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          space_id: spaceId,
          ...updates,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit space: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message || "Space updated successfully.";
    } catch (error) {
      console.error("Error editing space:", error);
      return "Failed to update space.";
    }
  }

  // Edit asset
  async editAsset(assetId: string, updates: Partial<Asset>): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/edit-asset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_id: assetId,
          ...updates,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit asset: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message || "Asset updated successfully.";
    } catch (error) {
      console.error("Error editing asset:", error);
      return "Failed to update asset.";
    }
  }

  // Store conversation in vector database
  async storeConversation(
    userMessage: string,
    aiResponse: string,
    sessionId: string
  ): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/store-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: userMessage,
          ai_response: aiResponse,
          session_id: sessionId,
          user_id: this.userId,
        }),
      });
    } catch (error) {
      console.error("Error storing conversation:", error);
    }
  }

  // Get chat history for context
  async getChatHistory(sessionId: string): Promise<AIMessage[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/chat-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get chat history: ${response.statusText}`);
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error("Error getting chat history:", error);
      return [];
    }
  }

  // Enhanced AI response with RAG
  async getEnhancedResponse(
    userMessage: string,
    sessionId: string,
    useRAG: boolean = true
  ): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/enhanced-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
          user_id: this.userId,
          use_rag: useRAG,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get enhanced response: ${response.statusText}`
        );
      }

      const data = await response.json();
      return (
        data.response ||
        "I apologize, but I encountered an issue processing your request."
      );
    } catch (error) {
      console.error("Error getting enhanced response:", error);
      return "I apologize, but I encountered an issue processing your request.";
    }
  }
}

// Export singleton instance
export const ragService = new RAGService();
<<<<<<< HEAD
=======

>>>>>>> 5febe5e (update)
