import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import TeeTimesList from '../screens/TeeTimesList';

// Mock the hooks since TeeTimesList now uses them internally
jest.mock('../hooks/useTeeTimes');
jest.mock('../hooks/useApiKey');

// Mock FontLoader to avoid async issues
jest.mock('../components/FontLoader', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

// Mock the theme
jest.mock('react-native-paper', () => {
  const original = jest.requireActual('react-native-paper');
  return {
    ...original,
    useTheme: () => ({
      colors: {
        primary: '#000000',
      },
    }),
  };
});

const mockTeeTimes = [
  {
    id: '1',
    courseName: 'Pine Valley Golf Club',
    dateTime: '2024-03-20T10:00:00Z',
    spotsAvailable: 4,
    holes: 18,
    priceAmount: 150,
    currency: 'USD',
    bookingUrl: 'https://example.com/book1',
    createdAt: '2024-03-19T00:00:00Z',
    updatedAt: '2024-03-19T00:00:00Z'
  },
  {
    id: '2',
    courseName: 'Augusta National',
    dateTime: '2024-03-21T14:30:00Z',
    spotsAvailable: 2,
    holes: 18,
    priceAmount: 200,
    currency: 'USD',
    bookingUrl: 'https://example.com/book2',
    createdAt: '2024-03-19T00:00:00Z',
    updatedAt: '2024-03-19T00:00:00Z'
  },
  {
    id: '3',
    courseName: 'St Andrews Links',
    dateTime: '2024-03-22T09:15:00Z',
    spotsAvailable: 1,
    holes: 9,
    priceAmount: 175,
    currency: 'GBP',
    bookingUrl: 'https://example.com/book3',
    createdAt: '2024-03-19T00:00:00Z',
    updatedAt: '2024-03-19T00:00:00Z'
  }
];

describe('TeeTimesList', () => {
  beforeEach(() => {
    // Mock useApiKey
    require('../hooks/useApiKey').useApiKey = jest.fn().mockReturnValue({
      apiKey: 'test-api-key',
      loading: false,
      error: null,
      handle401: jest.fn()
    });
  });

  it('renders correctly with tee times', () => {
    // Mock useTeeTimes
    require('../hooks/useTeeTimes').useTeeTimes = jest.fn().mockReturnValue({
      teeTimes: mockTeeTimes,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    });

    const { toJSON } = render(
      <PaperProvider>
        <TeeTimesList />
      </PaperProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders all mock tee times', () => {
    // Mock useTeeTimes
    require('../hooks/useTeeTimes').useTeeTimes = jest.fn().mockReturnValue({
      teeTimes: mockTeeTimes,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    });

    const { getByText } = render(
      <PaperProvider>
        <TeeTimesList />
      </PaperProvider>
    );

    // Check if all course names are rendered
    expect(getByText('Pine Valley Golf Club')).toBeTruthy();
    expect(getByText('Augusta National')).toBeTruthy();
    expect(getByText('St Andrews Links')).toBeTruthy();

    // Check if prices are rendered (now displayed as $150, $200, £175 without decimals)
    expect(getByText('$150')).toBeTruthy();
    expect(getByText('$200')).toBeTruthy();
    expect(getByText('£175')).toBeTruthy();
  });

  it('renders loading state', () => {
    // Mock useTeeTimes for loading state
    require('../hooks/useTeeTimes').useTeeTimes = jest.fn().mockReturnValue({
      teeTimes: [],
      isLoading: true,
      error: null,
      refetch: jest.fn()
    });

    const { getByText } = render(
      <PaperProvider>
        <TeeTimesList />
      </PaperProvider>
    );

    expect(getByText('Loading tee times...')).toBeTruthy();
  });

  it('renders error state', () => {
    // Mock useTeeTimes for error state
    require('../hooks/useTeeTimes').useTeeTimes = jest.fn().mockReturnValue({
      teeTimes: [],
      isLoading: false,
      error: new Error('Network error'),
      refetch: jest.fn()
    });

    const { getByText } = render(
      <PaperProvider>
        <TeeTimesList />
      </PaperProvider>
    );

    expect(getByText('Error: Network error')).toBeTruthy();
  });
}); 