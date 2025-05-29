import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import TeeTimesList from '../screens/TeeTimesList';

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
  it('renders correctly', () => {
    const { toJSON } = render(
      <PaperProvider>
        <TeeTimesList teeTimes={mockTeeTimes} onRefresh={() => {}} />
      </PaperProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders all mock tee times', () => {
    const { getByText } = render(
      <PaperProvider>
        <TeeTimesList teeTimes={mockTeeTimes} onRefresh={() => {}} />
      </PaperProvider>
    );

    // Check if all course names are rendered
    expect(getByText('Pine Valley Golf Club')).toBeTruthy();
    expect(getByText('Augusta National')).toBeTruthy();
    expect(getByText('St Andrews Links')).toBeTruthy();

    // Check if spots and holes are rendered
    expect(getByText(/4 spots • 18 holes/)).toBeTruthy();
    expect(getByText(/2 spots • 18 holes/)).toBeTruthy();
    expect(getByText(/1 spots • 9 holes/)).toBeTruthy();

    // Check if prices are rendered
    expect(getByText('$150.00')).toBeTruthy();
    expect(getByText('$200.00')).toBeTruthy();
    expect(getByText('£175.00')).toBeTruthy();
  });
}); 