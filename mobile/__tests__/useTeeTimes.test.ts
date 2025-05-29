import { renderHook, act } from '@testing-library/react-native';
import { useTeeTimes } from '../hooks/useTeeTimes';
import { useApiKey } from '../hooks/useApiKey';

// Mock the useApiKey hook
jest.mock('../hooks/useApiKey');

// Mock fetch
global.fetch = jest.fn();

describe('useTeeTimes', () => {
  const mockTeeTimes = [
    {
      id: '1',
      courseName: 'Test Course',
      dateTime: '2024-03-20T14:30:00Z',
      priceAmount: 50,
      currency: 'USD',
      spotsAvailable: 4,
      holes: 18,
      bookingUrl: 'https://example.com/book1',
      createdAt: '2024-03-19T00:00:00Z',
      updatedAt: '2024-03-19T00:00:00Z'
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useApiKey as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
      loading: false,
    });
  });

  it('should fetch tee times when API key is available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: () => Promise.resolve(mockTeeTimes),
    });

    const { result } = renderHook(() => useTeeTimes());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.teeTimes).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.teeTimes).toEqual(mockTeeTimes);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/tee-times'),
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useTeeTimes());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.teeTimes).toEqual([]);
    expect(result.current.error?.message).toBe('Failed to fetch tee times');
  });

  it('should handle non-OK responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
    });

    const { result } = renderHook(() => useTeeTimes());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.teeTimes).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('Failed to fetch tee times');
  });

  it('should not fetch when API key is not available', () => {
    (useApiKey as jest.Mock).mockReturnValue({
      apiKey: null,
      loading: false,
    });

    renderHook(() => useTeeTimes());

    expect(global.fetch).not.toHaveBeenCalled();
  });
}); 