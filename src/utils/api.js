import axios from 'axios';

// Use Vite env var when available, otherwise fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Send message to chat API
 * @param {string} message - User message
 * @returns {Promise<{reply: string}>}
 */
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message }, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Chat service unavailable. Ensure backend is running on ${API_BASE_URL}`);
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Backend may be slow or offline.');
    }
    if (error.request) {
      throw new Error(`Unable to reach backend at ${API_BASE_URL}. Is it running?`);
    }
    throw error;
  }
};

/**
 * Format timestamp for display
 * @param {Date} date
 * @returns {string}
 */
export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Generate unique ID
 * @returns {string}
 */
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Truncate text to specified length
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export const truncateText = (text, length = 50) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};
