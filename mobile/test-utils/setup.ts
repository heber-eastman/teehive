import '@testing-library/jest-native/extend-expect';
import { configure } from '@testing-library/react-native';

// Configure testing library
configure({
  asyncUtilTimeout: 1000,
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      API_BASE_URL: 'http://localhost:3000',
    },
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

// Mock expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: () => ({ uri: 'mocked-uri' }),
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 