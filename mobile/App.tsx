import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TeeTimesList from './screens/TeeTimesList';
import { useTeeTimes } from './hooks/useTeeTimes';
import FontLoader from './components/FontLoader';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <FontLoader>
          <TeeTimesList />
        </FontLoader>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App; 