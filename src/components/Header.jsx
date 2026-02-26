import React from 'react';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiSettings } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store';

/**
 * Header Component
 * Main navigation with theme toggle and user menu
 */
const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = React.useState(false);
  const [aiProvider, setAiProvider] = React.useState('demo');

  React.useEffect(() => {
    let mounted = true;
    fetch('/ai/status')
      .then(r => r.json())
      .then(data => {
        if (mounted && data?.provider) setAiProvider(data.provider);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <header className="glass sticky top-0 z-20 border-b">
      <div className="max-w-full px-4 py-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="btn-icon lg:hidden"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">AiChat Pro</h1>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* AI Provider Badge */}
          <div className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-200 mr-2">
            {aiProvider === 'demo' ? 'Demo' : aiProvider === 'openrouter' ? 'OpenRouter' : 'OpenAI'}
          </div>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon relative"
            title="Toggle theme"
          >
            {isDark ? (
              <FiSun className="text-yellow-400" size={20} />
            ) : (
              <FiMoon className="text-primary-500" size={20} />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn-icon"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.[0] || 'U'}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg overflow-hidden -mr-4">
                <div className="p-3 border-b border-white/10">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-2 text-sm">
                  <FiSettings size={16} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-500/10 text-red-500 flex items-center gap-2 text-sm border-t border-white/10"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
