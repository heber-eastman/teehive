import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { TeeTime } from '../hooks/useTeeTimes';

interface TeeTimesListProps {
  teeTimes: TeeTime[];
  onRefresh: () => void;
}

// Format date to "Mon, Jun 1 • 2:30 PM"
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }) + ' • ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format price with currency
const formatPrice = (amount: number, currency: string): string => {
  const validCurrency = currency && currency.length === 3 ? currency : 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: validCurrency
  }).format(amount);
};

export const TeeTimesList: React.FC<TeeTimesListProps> = ({ teeTimes, onRefresh }) => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: TeeTime }) => (
    <List.Item
      title={item.courseName}
      description={`${formatDateTime(item.dateTime)} • ${item.spotsAvailable} spots • ${item.holes} holes`}
      right={() => (
        <Text style={[styles.price, { color: theme.colors.primary }]}>
          {formatPrice(item.priceAmount, item.currency)}
        </Text>
      )}
      left={props => <List.Icon {...props} icon="golf" />}
      style={styles.listItem}
    />
  );

  return (
    <FlatList
      testID="tee-times-list"
      data={teeTimes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      onRefresh={onRefresh}
      refreshing={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  listItem: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default TeeTimesList; 