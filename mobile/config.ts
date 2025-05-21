import Constants from 'expo-constants';

interface Config {
  API_BASE_URL: string;
  BOOTSTRAP_PATH: string;
}

// Get the environment variables from app.config.js or .env file
export const getConfig = (): Config => {
  const config = Constants.expoConfig?.extra as Config | undefined;

  if (!config) {
    throw new Error('Failed to load environment configuration');
  }

  // Validate required environment variables
  if (!config.API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  if (!config.BOOTSTRAP_PATH) {
    throw new Error('BOOTSTRAP_PATH is not configured');
  }

  return {
    API_BASE_URL: config.API_BASE_URL,
    BOOTSTRAP_PATH: config.BOOTSTRAP_PATH,
  };
};

// Export the config for use in the app
export const config = getConfig(); 