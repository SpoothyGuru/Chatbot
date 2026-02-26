import React from 'react';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import { useChatStore } from '../store';
import { truncateText } from '../utils/api';

/**
 * Sidebar Component
 * Displays conversation history and navigation
 * Features: New chat, search, delete conversation
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { conversations, currentConversationId, setCurrentConversation, deleteConversation, addConversation } = useChatStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Create new conversation
  const handleNewChat = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
    };
    addConversation(newConversation);
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] w-64 glass border-r
          transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <button
            onClick={handleNewChat}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <FiPlus size={18} />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              {conversations.length === 0 ? 'Create your first chat' : 'No conversations found'}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-white/5 cursor-pointer hover-glow transition-colors
                  ${currentConversationId === conversation.id
                    ? 'bg-primary-500/10 border-l-2 border-l-primary-500'
                    : 'hover:bg-white/5'
                  }
                `}
                onClick={() => setCurrentConversation(conversation.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{conversation.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {conversation.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="btn-icon text-red-500 hover:bg-red-500/10"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
