import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY_STORAGE_KEY = '@teehive/api_key';
const API_KEY_URL = 'http://localhost:3000/v1/public/api-key';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApiKey = async () => {
    try {
      const response = await fetch(API_KEY_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API key: ${response.statusText}`);
      }

      const data = await response.json();
      const newApiKey = data.apiKey;

      if (!newApiKey) {
        throw new Error('No API key in response');
      }

      // Cache the new API key
      await AsyncStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
      setApiKey(newApiKey);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      // Clear cached key on error
      await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey(null);
    } finally {
      setLoading(false);
    }
  };

  const handle401 = async () => {
    // Clear cached key and fetch new one
    await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
    await fetchApiKey();
  };

  useEffect(() => {
    const initializeApiKey = async () => {
      try {
        // Try to get cached key first
        const cachedKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
        
        if (cachedKey) {
          setApiKey(cachedKey);
          setLoading(false);
          return;
        }

        // If no cached key, fetch new one
        await fetchApiKey();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize API key'));
        setLoading(false);
      }
    };

    initializeApiKey();
  }, []);

  return {
    apiKey,
    error,
    loading,
    refreshKey: fetchApiKey,
    handle401
  };
}; 