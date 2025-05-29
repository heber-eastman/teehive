import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useTeeTimes } from '../hooks/useTeeTimes';
import { TeeTimesList } from '../screens/TeeTimesList';

export function TeeTimesContainer() {
  const { teeTimes, isLoading, error, refetch } = useTeeTimes();

  // Debug information
  const debugInfo = {
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
    teeTimesCount: teeTimes.length,
    teeTimesData: JSON.stringify(teeTimes, null, 2)
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" testID="activity-indicator" />
        <Text style={styles.debugText}>Loading...</Text>
        <Text style={styles.debugText}>Debug Info: {JSON.stringify(debugInfo, null, 2)}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.center}>
        <Text variant="bodyLarge" style={styles.errorText}>Error loading tee times. Please try again.</Text>
        <Text style={styles.debugText}>Error: {error.message}</Text>
        <Text style={styles.debugText}>Debug Info: {JSON.stringify(debugInfo, null, 2)}</Text>
      </ScrollView>
    );
  }

  if (teeTimes.length === 0) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge">No tee times available right now.</Text>
        <Text style={styles.debugText}>Debug Info: {JSON.stringify(debugInfo, null, 2)}</Text>
      </View>
    );
  }

  return <TeeTimesList teeTimes={teeTimes} onRefresh={refetch} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  debugText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
}); 