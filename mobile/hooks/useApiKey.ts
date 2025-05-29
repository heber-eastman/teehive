import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_KEY_STORAGE_KEY = '@teehive/api_key';
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || '';
const BOOTSTRAP_PATH = Constants.expoConfig?.extra?.BOOTSTRAP_PATH || '';
const API_KEY_URL = `${API_BASE_URL}${BOOTSTRAP_PATH}`;

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApiKey = async () => {
    try {
      console.log('=== API Key Fetch Debug ===');
      console.log('API Key URL:', API_KEY_URL);
      console.log('API Base URL from config:', API_BASE_URL);
      console.log('Bootstrap Path from config:', BOOTSTRAP_PATH);
      
      const response = await fetch(API_KEY_URL);
      console.log('API Key response status:', response.status);
      console.log('API Key response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Key error response:', errorText);
        throw new Error(`Failed to fetch API key: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received API key data:', JSON.stringify(data, null, 2));
      
      const newApiKey = data.apiKey;

      if (!newApiKey) {
        throw new Error('No API key in response');
      }

      // Cache the new API key
      await AsyncStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
      setApiKey(newApiKey);
      setError(null);
    } catch (err) {
      console.error('Error in fetchApiKey:', err);
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
        console.log('=== API Key Initialization Debug ===');
        console.log('Initializing API key...');
        console.log('API Base URL from config:', API_BASE_URL);
        console.log('Bootstrap Path from config:', BOOTSTRAP_PATH);
        
        // Try to get cached key first
        const cachedKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
        console.log('Cached API key found:', !!cachedKey);
        
        if (cachedKey) {
          setApiKey(cachedKey);
          setLoading(false);
          return;
        }

        // If no cached key, fetch new one
        await fetchApiKey();
      } catch (err) {
        console.error('Error in initializeApiKey:', err);
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