import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock useTeeTimes to force loading state
jest.mock('../hooks/useTeeTimes', () => ({
  useTeeTimes: () => ({
    teeTimes: [],
    isLoading: true,
    error: null,
    refetch: jest.fn(),
  }),
}));

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
  it('renders TeeTimesList with loading state', () => {
    const { getByTestId } = render(<App />);
    const teeTimesList = getByTestId('tee-times-list');
    expect(teeTimesList).toBeTruthy();
  });
}); 