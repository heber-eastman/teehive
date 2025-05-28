import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useTeeTimes } from '../hooks/useTeeTimes';
import { TeeTimesList } from '../screens/TeeTimesList';

export function TeeTimesContainer() {
  const { teeTimes, isLoading, error, refetch } = useTeeTimes();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge" children="Error loading tee times. Please try again." />
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
  },
}); 