import { useState, useEffect } from 'react';
import { useApiKey } from './useApiKey';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || '';

export interface TeeTime {
  id: string;
  courseName: string;
  dateTime: string;
  spotsAvailable: number;
  priceAmount: number;
  currency: string;
  holes: number;
  bookingUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface UseTeeTimesResult {
  teeTimes: TeeTime[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTeeTimes(): UseTeeTimesResult {
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { apiKey, loading: isApiKeyLoading } = useApiKey();

  const fetchTeeTimes = async () => {
    if (!apiKey) {
      console.log('No API key available');
      return;
    }

    try {
      console.log('=== Tee Times Fetch Debug ===');
      console.log('API URL:', `${API_BASE_URL}/v1/tee-times`);
      console.log('API Key:', apiKey);
      console.log('API Base URL from config:', API_BASE_URL);
      
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/v1/tee-times`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch tee times');
      }

      const data = await response.json();
      console.log('Received tee times:', JSON.stringify(data, null, 2));
      setTeeTimes(data);
    } catch (err) {
      console.error('Error in fetchTeeTimes:', err);
      setError(new Error('Failed to fetch tee times'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('=== Tee Times Hook Debug ===');
    console.log('useEffect triggered');
    console.log('isApiKeyLoading:', isApiKeyLoading);
    console.log('apiKey available:', !!apiKey);
    console.log('Current tee times:', teeTimes);
    
    if (!isApiKeyLoading && apiKey) {
      fetchTeeTimes();
    }
  }, [apiKey, isApiKeyLoading]);

  return {
    teeTimes,
    isLoading: isLoading || isApiKeyLoading,
    error,
    refetch: fetchTeeTimes,
  };
} 