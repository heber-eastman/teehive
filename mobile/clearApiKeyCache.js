// Simple script to clear API key cache
// This can be run manually to force the app to fetch a new API key

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY_STORAGE_KEY = '@teehive/api_key';

export const clearApiKeyCache = async () => {
  try {
    await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
    console.log('API key cache cleared successfully');
  } catch (error) {
    console.error('Error clearing API key cache:', error);
  }
};

// If running directly
if (require.main === module) {
  clearApiKeyCache();
} 