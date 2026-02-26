import { useState, useEffect } from 'react';
import { useThemeStore } from '../store';

/**
 * Custom hook for theme management
 */
export const useTheme = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply initial theme
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, [isDark]);

  return { isDark: mounted ? isDark : false, toggleTheme };
};
