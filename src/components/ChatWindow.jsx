import React from 'react';
import { FiTrash2, FiRefreshCw } from 'react-icons/fi';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { sendMessage, generateId } from '../utils/api';
import { useChatStore } from '../store';

/**
 * TypingIndicator Component
 * Shows animated dots while bot is thinking
 */
const TypingIndicator = () => (
  <div className="flex justify-start message-bubble">
    <div className="glass rounded-bl-none px-4 py-3 rounded-2xl">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

/**
 * EmptyState Component
 * Professional empty state design
 */
const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500/20 to-cyan-500/20 mb-6">
        <span className="text-3xl">💬</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
      <p className="text-slate-400 dark:text-slate-500">
        Ask me anything and I'll help you get answers. Let's have an intelligent conversation.
      </p>
    </div>
  </div>
);

/**
 * ChatWindow Component
 * Main chat display area with message history
 * Features: Message rendering, auto-scroll, typing indicator
 */
const ChatWindow = () => {
  const {
    conversations,
    currentConversationId,
    isLoading,
    setLoading,
    setError,
    clearError,
    addMessage,
    clearCurrentChat,
  } = useChatStore();

  const messagesEndRef = React.useRef(null);
  const [localError, setLocalError] = React.useState(null);

  // Get current conversation
  const currentConversation = conversations.find((c) => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  // Auto-scroll to bottom
  const scrollToBottom = React.useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /**
   * Handle sending a message
   */
  const handleSendMessage = async (userMessage) => {
    // Add user message
    const userMsg = {
      id: generateId(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };
    addMessage(userMsg);

    setLoading(true);
    setLocalError(null);
    clearError();

    try {
      // Call API
      const response = await sendMessage(userMessage);

      // Add bot message
      const botMsg = {
        id: generateId(),
        text: response.reply,
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(botMsg);

      // Auto-update conversation title if first message
      if (messages.length === 0) {
        conversations[0].title = userMessage.substring(0, 50);
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to get response. Please try again.';
      setLocalError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If no current conversation, show empty state
  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header with title and actions */}
      <div className="glass border-b sticky top-16 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentConversation.title}</h2>
            <p className="text-xs text-slate-400">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-icon"
              title="Refresh"
            >
              <FiRefreshCw size={18} />
            </button>
            <button
              onClick={() => clearCurrentChat()}
              className="btn-icon text-red-500 hover:bg-red-500/10"
              title="Clear chat"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-400 dark:text-slate-500">No messages yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">
                Type something to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.isUser}
              />
            ))}

            {/* Typing indicator while loading */}
            {isLoading && <TypingIndicator />}

            {/* Error message */}
            {localError && (
              <div className="flex justify-center">
                <div className="glass rounded-lg px-4 py-3 text-red-500 text-sm max-w-md">
                  <p className="font-medium">Error</p>
                  <p className="mt-1">{localError}</p>
                </div>
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;
