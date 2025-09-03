# RAG (Retrieval-Augmented Generation) Integration

This document explains how to integrate the RAG functionality with your PostgreSQL database to enhance the AI chat capabilities.

## Overview

The RAG integration allows Rosie AI to:

- Access your personal database of assets, spaces, and locations
- Retrieve warranty information for assets
- Estimate asset values using AI vision
- Create and manage locations, spaces, and assets
- Search through conversation history and knowledge base
- Provide context-aware responses based on your data

## Setup

### 1. Environment Variables

Add these environment variables to your `.env` file:

```env
# RAG Configuration
VITE_RAG_API_URL=http://localhost:8000
VITE_ENABLE_RAG=true

# OpenAI Configuration (if not already set)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_API_URL=https://api.openai.com/v1
```

### 2. Backend API Setup

You need to set up a backend API that implements the endpoints expected by the RAG service. Based on your Python code, you should create endpoints for:

- `POST /search` - Vector search for knowledge retrieval
- `POST /user-info` - Get user's assets, spaces, and locations
- `POST /warranty` - Get asset warranty information
- `POST /estimate-value` - Estimate asset value
- `POST /create-location` - Create new location
- `POST /create-space` - Create new space
- `POST /edit-location` - Edit location
- `POST /edit-space` - Edit space
- `POST /edit-asset` - Edit asset
- `POST /store-conversation` - Store conversation in vector DB
- `POST /chat-history` - Get chat history for context
- `POST /enhanced-response` - Get AI response with RAG

### 3. Database Schema

Your PostgreSQL database should have these tables:

```sql
-- Locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    image TEXT,
    "isDefault" BOOLEAN DEFAULT FALSE,
    location JSONB
);

-- Spaces table
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    "locationId" UUID REFERENCES locations(id),
    icon VARCHAR(100) DEFAULT 'living_room',
    "isDefault" BOOLEAN DEFAULT FALSE,
    "isActive" BOOLEAN DEFAULT TRUE
);

-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    "spaceId" UUID REFERENCES spaces(id),
    "thumbnailId" UUID,
    description TEXT,
    color VARCHAR(50),
    depth DECIMAL(10,2),
    height DECIMAL(10,2),
    weight DECIMAL(10,2),
    width DECIMAL(10,2),
    metadata JSONB
);

-- Images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vector embeddings table (for LangChain PGVector)
CREATE TABLE langchain_pg_embedding (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document TEXT,
    cmetadata JSONB,
    embedding VECTOR(1536) -- Adjust dimension based on your embedding model
);
```

## Usage

### Basic RAG Features

Once enabled, Rosie AI can:

1. **Access Your Data**: Ask questions like "What assets do I have?" or "Show me my locations"

2. **Asset Management**:

   - "Create a new location called 'Home Office'"
   - "Add a space called 'Desk Area' to my Home Office"
   - "What's the warranty on my laptop?"

3. **Value Estimation**:

   - "What's the estimated value of my MacBook Pro?"
   - "How much is my camera worth?"

4. **Knowledge Search**:
   - The AI can search through past conversations and stored documents
   - Provides context-aware responses based on your history

### Example Queries

```
User: "What assets do I have in my living room?"
Rosie: "Let me check your assets... I found a TV, sofa, and coffee table in your living room."

User: "What's the warranty on my laptop?"
Rosie: "Let me look up the warranty information for your laptop using its image..."

User: "Create a new location called 'Garage'"
Rosie: "I've created a new location called 'Garage' for you."

User: "How much is my camera worth?"
Rosie: "Based on the image of your camera, I estimate it's worth around $800-1200..."
```

## API Integration

The RAG service expects your backend to handle these operations:

### Search Knowledge

```typescript
POST /search
{
  "query": "user's search query",
  "k": 5,
  "user_id": "user_id"
}
```

### Get User Info

```typescript
POST /user-info
{
  "user_id": "user_id"
}
```

### Enhanced Response

```typescript
POST /enhanced-response
{
  "message": "user's message",
  "session_id": "session_id",
  "user_id": "user_id",
  "use_rag": true
}
```

## Fallback Behavior

If RAG is disabled or the backend is unavailable, the AI will:

- Fall back to standard OpenAI responses
- Continue to work with conversation memory
- Show appropriate error messages for database operations

## Security Considerations

- Ensure your backend API is properly secured
- Use authentication tokens for user identification
- Validate all input data
- Implement rate limiting
- Use HTTPS in production

## Troubleshooting

1. **RAG not working**: Check that `VITE_ENABLE_RAG=true` and `VITE_RAG_API_URL` is correct
2. **Database errors**: Verify your backend API is running and database is accessible
3. **Authentication issues**: Ensure user IDs are properly passed to the RAG service
4. **Vector search issues**: Check that embeddings are properly stored and indexed

## Development

To test RAG functionality locally:

1. Set up your Python backend with the provided code
2. Configure your database with the required schema
3. Set environment variables in your `.env` file
4. Start both the backend API and React frontend
5. Test with sample queries

The RAG integration provides a powerful way to make Rosie AI truly personal and context-aware by connecting it to your actual data and conversation history.
