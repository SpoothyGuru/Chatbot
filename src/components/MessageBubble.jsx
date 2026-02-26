import React from 'react';
import { formatTime } from '../utils/api';

/**
 * MessageBubble Component
 * Displays individual chat messages with animation
 * Features: Auto-timestamp, different styling for user/bot
 */
const MessageBubble = ({ message, isUser }) => {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-bubble`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
          ${
            isUser
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-none shadow-lg'
              : 'glass rounded-bl-none'
          }
        `}
      >
        {/* Message text */}
        <p className="text-sm md:text-base leading-relaxed break-words">
          {message.text}
        </p>

        {/* Timestamp */}
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-primary-100' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
