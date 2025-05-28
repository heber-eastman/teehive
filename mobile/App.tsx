import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import TeeTimesList from './screens/TeeTimesList';

const App = () => {
  return (
    <PaperProvider>
      <TeeTimesList />
    </PaperProvider>
  );
};

export default App; 