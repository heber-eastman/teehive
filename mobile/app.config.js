import 'dotenv/config';

export default {
  name: 'Teehive',
  slug: 'teehive',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.teehive.app'
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    },
    package: 'com.teehive.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    API_BASE_URL: process.env.API_BASE_URL,
    BOOTSTRAP_PATH: process.env.BOOTSTRAP_PATH,
  }
}; 