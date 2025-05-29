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
    API_BASE_URL: 'http://192.168.1.254:3000',
    BOOTSTRAP_PATH: '/v1/public/api-key',
  }
}; 