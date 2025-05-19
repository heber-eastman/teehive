const express = require('express');
const shared = require('@teehive/shared');

console.log('Express version:', express.version);
console.log('Shared package loaded:', !!shared);

try {
  require.resolve('expo');
  require.resolve('react-native-paper');
  console.log('Expo and React Native Paper are resolvable!');
} catch (e) {
  console.error('Expo or React Native Paper could not be resolved:', e);
  process.exit(1);
}

console.log('\n✅ All workspace imports successful!'); 