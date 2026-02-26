import React, { useEffect } from 'react';
import { useAuthStore, useChatStore, useThemeStore } from './store';
import Dashboard from './pages/Dashboard';
import './index.css';

/**
 * Auth Screen - Simple login/demo screen
 */
const AuthScreen = ({ onLogin }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2">AiChat Pro</h1>
          <p className="text-slate-400 text-center mb-8">
            Welcome to your intelligent conversation partner
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-2 font-medium mt-6"
            >
              Start Chatting
            </button>
          </form>

          {/* Demo info */}
          <p className="text-xs text-slate-400 text-center mt-6">
            Demo account - No real data is stored
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Main App Component
 */
function App() {
  const { user, isAuthenticated, login } = useAuthStore();
  const { conversations, addConversation } = useChatStore();
  const { isDark } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Create first conversation on login
  useEffect(() => {
    if (isAuthenticated && conversations.length === 0) {
      const initialConversation = {
        id: Date.now().toString(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date(),
      };
      addConversation(initialConversation);
    }
  }, [isAuthenticated, conversations.length, addConversation]);

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onLogin={login} />;
  }

  // Show dashboard
  return <Dashboard />;
}

export default App;
