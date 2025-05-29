import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiKey } from '../hooks/useApiKey';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('useApiKey', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should fetch and cache API key on initial load when no cached key exists', async () => {
    // Mock AsyncStorage to return no cached key
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    // Mock successful API response
    const mockApiKey = 'test-api-key';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: () => Promise.resolve({ apiKey: mockApiKey }),
    });

    const { result } = renderHook(() => useApiKey());

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.apiKey).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the hook to finish loading
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify final state
    expect(result.current.loading).toBe(false);
    expect(result.current.apiKey).toBe(mockApiKey);
    expect(result.current.error).toBe(null);

    // Verify AsyncStorage was called correctly
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@teehive/api_key', mockApiKey);
  });

  it('should use cached API key if available', async () => {
    // Mock AsyncStorage to return cached key
    const cachedKey = 'cached-api-key';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(cachedKey);

    const { result } = renderHook(() => useApiKey());

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.apiKey).toBe(null);

    // Wait for the hook to finish loading
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify final state
    expect(result.current.loading).toBe(false);
    expect(result.current.apiKey).toBe(cachedKey);
    expect(result.current.error).toBe(null);

    // Verify fetch was not called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle 401 errors by clearing cache and fetching new key', async () => {
    // Mock AsyncStorage to return cached key
    const cachedKey = 'cached-api-key';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(cachedKey);

    // Mock successful API response for new key
    const newApiKey = 'new-api-key';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: () => Promise.resolve({ apiKey: newApiKey }),
    });

    const { result } = renderHook(() => useApiKey());

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Call handle401
    await act(async () => {
      await result.current.handle401();
    });

    // Verify cache was cleared
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@teehive/api_key');

    // Verify new key was fetched and cached
    expect(mockFetch).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@teehive/api_key', newApiKey);
    expect(result.current.apiKey).toBe(newApiKey);
  });

  it('should handle fetch errors', async () => {
    // Mock AsyncStorage to return no cached key
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    // Mock failed API response
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useApiKey());

    // Wait for the hook to finish loading
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify error state
    expect(result.current.loading).toBe(false);
    expect(result.current.apiKey).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');

    // Verify cache was cleared
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@teehive/api_key');
  });
}); 