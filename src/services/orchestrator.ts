/**
 * BRAVO Orchestration Service
 * 
 * This service acts as the central orchestrator for all AI/RAG interactions.
 * It manages communication between the frontend and the RAG API backend.
 */

// Configuration
const RAG_API_BASE_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:5000';

// Types
export interface UserContext {
  goal?: string;
  fitnessLevel?: string;
  age?: number;
  weight?: number;
  height?: number;
  name?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  sources?: Array<{
    type: string;
    name: string;
    details: string;
  }>;
  verified?: boolean;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  initialized: boolean;
}

/**
 * BravoOrchestrator Class
 * Handles all communication with the BRAVO RAG API
 */
class BravoOrchestrator {
  private baseUrl: string;
  private isOnline: boolean = false;
  private userContext: UserContext = {};

  constructor(baseUrl: string = RAG_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set user context for personalized responses
   */
  setUserContext(context: UserContext): void {
    this.userContext = { ...this.userContext, ...context };
  }

  /**
   * Clear user context
   */
  clearUserContext(): void {
    this.userContext = {};
  }

  /**
   * Check if the RAG API is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: HealthCheckResponse = await response.json();
        this.isOnline = data.status === 'healthy' && data.initialized;
        return this.isOnline;
      }
      
      this.isOnline = false;
      return false;
    } catch (error) {
      console.warn('BRAVO API is offline, using fallback responses');
      this.isOnline = false;
      return false;
    }
  }

  /**
   * Send a message to the RAG API and get a response
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    // First check if API is available
    if (!this.isOnline) {
      await this.checkHealth();
    }

    // If still offline, return fallback response
    if (!this.isOnline) {
      return this.getFallbackResponse(message);
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userContext: this.userContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error communicating with BRAVO API:', error);
      return this.getFallbackResponse(message);
    }
  }

  /**
   * Fallback response when API is unavailable
   */
  private getFallbackResponse(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based fallback responses
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      return {
        success: true,
        response: "I'd love to help you with workouts! For personalized exercise recommendations, please make sure the BRAVO AI server is running. In the meantime, here are some general tips:\n\n• Start with a 5-10 minute warm-up\n• Include both cardio and strength training\n• Rest between sets (30-90 seconds)\n• Cool down and stretch after your workout",
        verified: false,
      };
    }
    
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return {
        success: true,
        response: "Nutrition is key to your fitness goals! While the BRAVO AI server is offline, here are some general guidelines:\n\n• Eat plenty of protein (lean meats, fish, legumes)\n• Include complex carbohydrates for energy\n• Don't forget healthy fats (avocado, nuts, olive oil)\n• Stay hydrated - aim for 8 glasses of water daily",
        verified: false,
      };
    }
    
    if (lowerMessage.includes('weight loss') || lowerMessage.includes('lose weight')) {
      return {
        success: true,
        response: "Weight loss is about creating a sustainable calorie deficit. Here are some tips:\n\n• Create a moderate calorie deficit (300-500 calories/day)\n• Combine cardio with strength training\n• Focus on whole, unprocessed foods\n• Get adequate sleep (7-9 hours)\n• Stay consistent - results take time!",
        verified: false,
      };
    }
    
    if (lowerMessage.includes('muscle') || lowerMessage.includes('strength') || lowerMessage.includes('build')) {
      return {
        success: true,
        response: "Building muscle requires the right combination of training and nutrition:\n\n• Progressive overload - gradually increase weights\n• Eat sufficient protein (1.6-2.2g per kg bodyweight)\n• Get adequate rest between workouts\n• Focus on compound movements (squats, deadlifts, bench press)\n• Be patient - muscle building takes time!",
        verified: false,
      };
    }

    // Default response
    return {
      success: true,
      response: "I'm BRAVO, your AI fitness coach! I can help you with:\n\n• Personalized workout recommendations\n• Nutrition advice and meal planning\n• Exercise techniques and alternatives\n• Fitness goal setting\n\nThe full AI system is currently connecting. Please try again in a moment, or ask me about workouts, nutrition, or your fitness goals!",
      verified: false,
    };
  }

  /**
   * Get the online status
   */
  getStatus(): { online: boolean; baseUrl: string } {
    return {
      online: this.isOnline,
      baseUrl: this.baseUrl,
    };
  }
}

// Export singleton instance
export const bravoOrchestrator = new BravoOrchestrator();

// Export class for custom instances
export { BravoOrchestrator };
