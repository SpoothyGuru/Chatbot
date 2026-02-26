/**
 * SAAS CHATBOT - BACKEND EXAMPLE
 * Node.js/Express Backend Server
 * 
 * Installation:
 * npm init -y
 * npm install express cors body-parser dotenv
 * 
 * Run:
 * node backend.js
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());
app.options('*', cors()); // enable preflight for all routes

// In-memory conversation history
let conversationHistory = [];

/**
 * POST /chat
 * Main chat endpoint
 * Request: { message: string }
 * Response: { reply: string }
 */
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validation
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Add to history
    conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get AI response (replace with your AI service)
    let reply = await getAIResponse(message);

    // Add bot response to history
    conversationHistory.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
    });

    res.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message,
    });
  }
});

/**
 * GET /chat/history
 * Retrieve conversation history
 */
app.get('/chat/history', (req, res) => {
  res.json({ history: conversationHistory });
});

/**
 * DELETE /chat/history
 * Clear conversation history
 */
app.delete('/chat/history', (req, res) => {
  conversationHistory = [];
  res.json({ message: 'History cleared' });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

/**
 * GET /ai/status
 * Returns which AI provider is currently available/preferred
 */
app.get('/ai/status', (req, res) => {
  let provider = 'demo';
  if (process.env.OPENROUTER_API_KEY) provider = 'openrouter';
  else if (process.env.OPENAI_API_KEY) provider = 'openai';

  res.json({
    provider,
    details: {
      openrouter_url: process.env.OPENROUTER_API_URL || null,
      openai_model: process.env.OPENAI_MODEL || null,
    },
  });
});

/**
 * AI Response Generator
 * Replace with your actual AI service integration
 * Options: OpenAI, Azure OpenAI, Hugging Face, etc.
 */
async function getAIResponse(userMessage) {
  // EXAMPLE 1: Simple rule-based responses (for testing)
  const lowerMessage = userMessage.toLowerCase();

  const responses = {
    hello: 'Hello! 👋 How can I help you today?',
    'how are you': 'I\'m doing great! Thanks for asking. How can I assist you?',
    'what is ai': 'AI (Artificial Intelligence) is the simulation of human intelligence processes by machines.',
    'help': 'I\'m here to help! Ask me anything and I\'ll do my best to assist you.',
    'thank you': 'You\'re welcome! Happy to help! 😊',
    'bye': 'Goodbye! See you next time! 👋',
  };

  // Check for keyword matches
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  // EXAMPLE 2: OpenAI Integration (uncomment to use)
  // const openai = require('openai');
  // const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const response = await client.chat.completions.create({
  //   model: 'gpt-3.5-turbo',
  //   messages: conversationHistory.map(msg => ({
  //     role: msg.role,
  //     content: msg.content,
  //   })),
  //   max_tokens: 500,
  // });
  // return response.choices[0].message.content;

  // Default response
  // If an OpenRouter API key is provided, delegate to OpenRouter first
  if (process.env.OPENROUTER_API_KEY) {
    const openrouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
    try {
      const orResp = await fetch(openrouterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: conversationHistory.map(m => ({ role: m.role, content: m.content })),
          max_tokens: 500,
        }),
      });

      if (orResp.ok) {
        const data = await orResp.json();
        const aiMessage = data?.choices?.[0]?.message?.content;
        if (aiMessage) return aiMessage;
      } else {
        const errText = await orResp.text();
        console.error('OpenRouter error:', orResp.status, errText);
      }
    } catch (err) {
      console.error('Error calling OpenRouter:', err);
    }
  }

  // If an OpenAI API key is provided, delegate to OpenAI Chat Completions
  if (process.env.OPENAI_API_KEY) {
    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: conversationHistory.map(m => ({ role: m.role, content: m.content })),
          max_tokens: 500,
        }),
      });

      if (!openaiResponse.ok) {
        const errText = await openaiResponse.text();
        console.error('OpenAI error:', openaiResponse.status, errText);
      } else {
        const data = await openaiResponse.json();
        const aiMessage = data?.choices?.[0]?.message?.content;
        if (aiMessage) return aiMessage;
      }
    } catch (err) {
      console.error('Error calling OpenAI:', err);
    }
  }

  return `I received: "${userMessage}". Connected to Demo AI - connect to your AI service for intelligent responses.`;
}

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   SaaS Chatbot Backend Server          ║
║          Ready on port ${PORT}         ║
╚════════════════════════════════════════╝

📝 Endpoints:
   POST /chat - Send a message
   GET /chat/history - Get conversation history
   DELETE /chat/history - Clear history
   GET /health - Health check

🔗 Connect from: http://localhost:3000
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✋ Shutting down server...');
  process.exit(0);
});