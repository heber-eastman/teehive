import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock FontLoader to avoid async font loading
jest.mock('../components/FontLoader', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

// Mock hooks
jest.mock('../hooks/useTeeTimes');
jest.mock('../hooks/useApiKey');

// Mock the providers
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-paper', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    colors: {
      primary: '#000000',
    },
  }),
}));

describe('App', () => {
  beforeEach(() => {
    // Mock useApiKey
    require('../hooks/useApiKey').useApiKey = jest.fn().mockReturnValue({
      apiKey: 'test-api-key',
      loading: false,
      error: null,
      handle401: jest.fn()
    });
  });

  it('renders TeeTimesList with loading state', () => {
    // Mock useTeeTimes to force loading state
    require('../hooks/useTeeTimes').useTeeTimes = jest.fn().mockReturnValue({
      teeTimes: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = render(<App />);
    // Check for loading text instead of testID since we removed the old structure
    expect(getByText('Loading tee times...')).toBeTruthy();
  });

  it('renders TeeTimesList with tee times', () => {
    // Mock useTeeTimes with data
    require('../hooks/useTeeTimes').useTeeTimes = jest.fn().mockReturnValue({
      teeTimes: [{
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
      }],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = render(<App />);
    expect(getByText('Test Course')).toBeTruthy();
  });
}); 