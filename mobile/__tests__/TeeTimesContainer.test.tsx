import React from 'react';
import { render, screen } from '@testing-library/react-native';
import * as useTeeTimesModule from '../hooks/useTeeTimes';
import { TeeTimesContainer } from '../components/TeeTimesContainer';

jest.mock('../hooks/useTeeTimes');
jest.mock('../hooks/useApiKey');

// Mock FontLoader to avoid async issues
jest.mock('../components/FontLoader', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe('TeeTimesContainer', () => {
  beforeEach(() => {
    // Mock useApiKey for all tests
    require('../hooks/useApiKey').useApiKey = jest.fn().mockReturnValue({
      apiKey: 'test-api-key',
      loading: false,
      error: null,
      handle401: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays error message if fetch fails', () => {
    (useTeeTimesModule.useTeeTimes as jest.Mock).mockReturnValue({
      teeTimes: [],
      isLoading: false,
      error: new Error('Network error'),
      refetch: jest.fn(),
    });
    render(<TeeTimesContainer />);
    expect(screen.getByText(/Error loading tee times/i)).toBeTruthy();
    expect(screen.getAllByText(/Network error/i)).toHaveLength(2);
  });

  it('displays empty state message if no tee times', () => {
    (useTeeTimesModule.useTeeTimes as jest.Mock).mockReturnValue({
      teeTimes: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    render(<TeeTimesContainer />);
    expect(screen.getByText(/No tee times available right now/i)).toBeTruthy();
  });

  it('renders tee times list if data is present', () => {
    (useTeeTimesModule.useTeeTimes as jest.Mock).mockReturnValue({
      teeTimes: [{
        id: '1',
        courseName: 'Test Course',
        dateTime: '2024-06-01T14:30:00Z',
        priceAmount: 50,
        currency: 'USD',
        spotsAvailable: 4,
        holes: 18,
        bookingUrl: 'https://example.com/book1',
        createdAt: '2024-03-19T00:00:00Z',
        updatedAt: '2024-03-19T00:00:00Z'
      }],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    render(<TeeTimesContainer />);
    expect(screen.getByText('Test Course')).toBeTruthy();
  });
}); 