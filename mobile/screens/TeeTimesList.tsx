import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTeeTimes, TeeTime } from '../hooks/useTeeTimes';
import TeeTimeCard from '../components/TeeTimeCard';

export default function TeeTimesList() {
  const { teeTimes, isLoading, error, refetch } = useTeeTimes();



  const handleBooking = (url: string) => {
    Linking.openURL(url);
  };

  const renderTeeTime = ({ item }: { item: TeeTime }) => {
    return (
      <TeeTimeCard 
        teeTime={item}
        onPress={() => handleBooking(item.bookingUrl)}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading tee times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={teeTimes}
        renderItem={renderTeeTime}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    fontFamily: 'System',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
}); 