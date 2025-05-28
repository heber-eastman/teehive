import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

// Mock data type matching our backend schema
interface TeeTime {
  id: string;
  courseName: string;
  dateTime: string;
  spotsAvailable: number;
  priceAmount: number;
  currency: string;
  holes: number;
  bookingUrl: string;
}

// Mock data
const mockTeeTimes: TeeTime[] = [
  {
    id: '1',
    courseName: 'Pine Valley Golf Club',
    dateTime: '2024-03-20T10:00:00Z',
    spotsAvailable: 4,
    priceAmount: 150.00,
    currency: 'USD',
    holes: 18,
    bookingUrl: 'https://example.com/book1'
  },
  {
    id: '2',
    courseName: 'Augusta National',
    dateTime: '2024-03-21T14:30:00Z',
    spotsAvailable: 2,
    priceAmount: 200.00,
    currency: 'USD',
    holes: 18,
    bookingUrl: 'https://example.com/book2'
  },
  {
    id: '3',
    courseName: 'St Andrews Links',
    dateTime: '2024-03-22T09:15:00Z',
    spotsAvailable: 1,
    priceAmount: 175.00,
    currency: 'GBP',
    holes: 9,
    bookingUrl: 'https://example.com/book3'
  }
];

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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const TeeTimesList: React.FC = () => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: TeeTime }) => (
    <List.Item
      title={item.courseName}
      description={`${item.spotsAvailable} spots • ${item.holes} holes`}
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
      data={mockTeeTimes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
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