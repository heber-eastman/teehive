const { execSync } = require('child_process');

test('npm run dev should exit with code 0', () => {
  // Set a timeout of 10 seconds for the test
  jest.setTimeout(10000);
  
  // Run the dev command and expect it to complete successfully
  expect(() => {
    execSync('npm run dev', { stdio: 'ignore' });
  }).not.toThrow();
}); 