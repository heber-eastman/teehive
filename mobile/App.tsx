import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TeeTimesList from './screens/TeeTimesList';
import { useTeeTimes } from './hooks/useTeeTimes';

const App = () => {
  const { teeTimes, isLoading, error, refetch } = useTeeTimes();

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <TeeTimesList teeTimes={teeTimes} onRefresh={refetch} />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App; 