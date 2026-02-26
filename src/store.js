import { create } from 'zustand';

/**
 * Chat Store - Manages all chat-related state
 * Using Zustand for lightweight state management
 */
export const useChatStore = create((set) => ({
  // State
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,

  // Actions
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      currentConversationId: conversation.id,
    })),

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      currentConversationId:
        state.currentConversationId === id
          ? state.conversations[0]?.id || null
          : state.currentConversationId,
    })),

  getCurrentConversation: () => {
    const state = useChatStore.getState();
    return state.conversations.find((c) => c.id === state.currentConversationId);
  },

  addMessage: (message) =>
    set((state) => {
      const conversations = state.conversations.map((conv) =>
        conv.id === state.currentConversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      );
      return { conversations };
    }),

  setCurrentConversation: (id) => set({ currentConversationId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  clearCurrentChat: () =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === state.currentConversationId
          ? { ...conv, messages: [] }
          : conv
      ),
    })),
}));

/**
 * Auth Store - Manages authentication state
 */
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user) =>
    set({
      user: { ...user, loginTime: new Date() },
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

/**
 * Theme Store - Manages theme preference
 */
export const useThemeStore = create((set) => ({
  isDark: typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false,

  toggleTheme: () =>
    set((state) => {
      const newTheme = !state.isDark;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newTheme);
      }
      return { isDark: newTheme };
    }),
}));
