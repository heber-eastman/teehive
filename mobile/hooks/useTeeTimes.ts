import { useState, useEffect } from 'react';
import { useApiKey } from './useApiKey';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || '';

export interface TeeTime {
  id: string;
  courseName: string;
  date: string;
  time: string;
  price: number;
  availableSpots: number;
  holes: number;
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
    if (!apiKey) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/v1/tee-times`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tee times: ${response.statusText}`);
      }

      const data = await response.json();
      setTeeTimes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tee times'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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