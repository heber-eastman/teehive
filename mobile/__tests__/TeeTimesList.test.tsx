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

describe('TeeTimesList', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <PaperProvider>
        <TeeTimesList />
      </PaperProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders all mock tee times', () => {
    const { getByText } = render(
      <PaperProvider>
        <TeeTimesList />
      </PaperProvider>
    );

    // Check if all course names are rendered
    expect(getByText('Pine Valley Golf Club')).toBeTruthy();
    expect(getByText('Augusta National')).toBeTruthy();
    expect(getByText('St Andrews Links')).toBeTruthy();

    // Check if spots and holes are rendered
    expect(getByText('4 spots • 18 holes')).toBeTruthy();
    expect(getByText('2 spots • 18 holes')).toBeTruthy();
    expect(getByText('1 spots • 9 holes')).toBeTruthy();

    // Check if prices are rendered
    expect(getByText('$150.00')).toBeTruthy();
    expect(getByText('$200.00')).toBeTruthy();
    expect(getByText('£175.00')).toBeTruthy();
  });
}); 