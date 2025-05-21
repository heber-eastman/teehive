import Constants from 'expo-constants';
import { getConfig } from '../config';

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      API_BASE_URL: 'http://localhost:3000',
      BOOTSTRAP_PATH: '/v1/public/api-key',
    },
  },
}));

describe('config', () => {
  it('loads configuration successfully', () => {
    const config = getConfig();
    expect(config).toEqual({
      API_BASE_URL: 'http://localhost:3000',
      BOOTSTRAP_PATH: '/v1/public/api-key',
    });
  });

  it('throws error when API_BASE_URL is missing', () => {
    // Mock missing API_BASE_URL
    (Constants.expoConfig as any).extra.API_BASE_URL = undefined;
    
    expect(() => {
      getConfig();
    }).toThrow('API_BASE_URL is not configured');
  });

  it('throws error when BOOTSTRAP_PATH is missing', () => {
    // Set API_BASE_URL to a valid value, and BOOTSTRAP_PATH to undefined
    (Constants.expoConfig as any).extra.API_BASE_URL = 'http://localhost:3000';
    (Constants.expoConfig as any).extra.BOOTSTRAP_PATH = undefined;
    
    expect(() => {
      getConfig();
    }).toThrow('BOOTSTRAP_PATH is not configured');
  });
}); 