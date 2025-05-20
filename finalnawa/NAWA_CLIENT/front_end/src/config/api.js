/**
 * API Configuration
 * This file centralizes the API configuration to easily switch between development and production environments
 */

// Get the API base URL from environment variables, with a fallback for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Default request configuration
const DEFAULT_CONFIG = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
};

/**
 * Builds the full API URL for a given endpoint
 * @param {string} endpoint - The API endpoint (e.g., "/getTeachers")
 * @returns {string} The full API URL
 */
export const getApiUrl = (endpoint) => {
  // Make sure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};

/**
 * Environment information
 */
export const isProduction = import.meta.env.VITE_APP_ENV === 'production';
export const isDevelopment = !isProduction;

/**
 * School information
 */
export const SCHOOL_NAME = import.meta.env.VITE_APP_NAME || 'Nawa Tara English School';

export default {
  API_BASE_URL,
  DEFAULT_CONFIG,
  getApiUrl,
  isProduction,
  isDevelopment,
  SCHOOL_NAME
}; 