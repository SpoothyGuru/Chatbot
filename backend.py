"""
SAAS CHATBOT - BACKEND EXAMPLE
Python/Flask Backend Server

Installation:
pip install flask flask-cors python-dotenv

Run:
python backend.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'])

# In-memory conversation history
conversation_history = []

@app.route('/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint
    Request: { message: string }
    Response: { reply: string }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message field is required'}), 400
        
        message = data['message'].strip()
        
        if not message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Add to history
        conversation_history.append({
            'role': 'user',
            'content': message,
            'timestamp': datetime.now().isoformat(),
        })
        
        # Get AI response
        reply = get_ai_response(message)
        
        # Add bot response
        conversation_history.append({
            'role': 'assistant',
            'content': reply,
            'timestamp': datetime.now().isoformat(),
        })
        
        return jsonify({'reply': reply}), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to process message',
            'message': str(e),
        }), 500

@app.route('/chat/history', methods=['GET'])
def get_history():
    """Get conversation history"""
    return jsonify({'history': conversation_history}), 200

@app.route('/chat/history', methods=['DELETE'])
def clear_history():
    """Clear conversation history"""
    global conversation_history
    conversation_history = []
    return jsonify({'message': 'History cleared'}), 200

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat(),
    }), 200

def get_ai_response(user_message):
    """
    Get AI response
    Replace with your actual AI service
    """
    lower_message = user_message.lower()
    
    # Simple rule-based responses for demo
    responses = {
        'hello': 'Hello! 👋 How can I help you today?',
        'how are you': 'I\'m doing great! Thanks for asking. How can I assist you?',
        'what is ai': 'AI is the simulation of human intelligence by machines.',
        'help': 'I\'m here to help! Ask me anything!',
        'thank you': 'You\'re welcome! 😊',
        'bye': 'Goodbye! See you next time! 👋',
    }
    
    # Check keywords
    for keyword, response in responses.items():
        if keyword in lower_message:
            return response
    
    # Default response
    return f'I received: "{user_message}". Connect to your AI service for intelligent responses!'

if __name__ == '__main__':
    print("""
╔════════════════════════════════════════╗
║   SaaS Chatbot Backend Server          ║
║          Ready on port 5000            ║
╚════════════════════════════════════════╝

📝 Endpoints:
   POST /chat - Send a message
   GET /chat/history - Get conversation history
   DELETE /chat/history - Clear history
   GET /health - Health check

🔗 Connect from: http://localhost:3000
    """)
    app.run(debug=True, port=5000, host='0.0.0.0')
