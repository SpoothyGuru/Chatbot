import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';

/**
 * ChatInput Component
 * Handles user text input and message sending
 * Features: Enter to send, auto-focus, input validation
 */
const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Handle message submission
   */
  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/10 glass rounded-t-2xl p-4">
      <div className="flex gap-3">
        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={isLoading ? 'Waiting for response...' : 'Type your message...'}
          className="flex-1 px-4 py-3 rounded-full bg-slate-100 dark:bg-slate-800 
            text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            dark:focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="btn-primary px-6 flex items-center justify-center min-w-max
            disabled:opacity-50 disabled:cursor-not-allowed
            hover-glow"
        >
          {isLoading ? (
            <FiLoader className="animate-spin" size={20} />
          ) : (
            <FiSend size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
