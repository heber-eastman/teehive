import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { FontFamily } from '../utils/fonts';
import { TeeTime } from '../hooks/useTeeTimes';
import { FontAwesome5 } from '@expo/vector-icons';

interface TeeTimeCardProps {
  teeTime: TeeTime;
  onPress: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const TeeTimeCard: React.FC<TeeTimeCardProps> = ({ teeTime, onPress }) => {
  // Format time to match Figma (24-hour format, UTC)
  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format price
  const formatPrice = (amount: number, currency: string) => {
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'GBP': '£',
      'EUR': '€'
    };
    
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount}`;
  };

  // Create player range display (assuming min is 1)
  const formatPlayers = (spotsAvailable: number) => {
    return `1-${spotsAvailable}`;
  };

  const time = formatTime(teeTime.dateTime);
  const price = formatPrice(teeTime.priceAmount, teeTime.currency);
  const players = formatPlayers(teeTime.spotsAvailable);

  return (
    <TouchableOpacity 
      style={[styles.card, { width: screenWidth - 32 }]} // Responsive width with 16px margin on each side
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Status Indicator */}
      <View style={styles.statusDot} />
      
      {/* Left Section - Image with Time Overlay */}
      <View style={styles.imageSection}>
        {/* Placeholder image - you can replace with actual course image */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=200&h=200&fit=crop' }}
          style={styles.courseImage}
          resizeMode="cover"
        />
        {/* Image overlay */}
        <View style={styles.imageOverlay} />
        {/* Time text */}
        <Text style={styles.timeText}>{time}</Text>
      </View>
      
      {/* Main Content Section */}
      <View style={styles.contentSection}>
        {/* Course Name */}
        <Text style={styles.courseName}>{teeTime.courseName}</Text>
        
        {/* Tee Time Details */}
        <View style={styles.detailsContainer}>
          {/* Number of Holes */}
          <View style={styles.detailItem}>
            <FontAwesome5 name="flag" size={15} color="#003a37" style={styles.detailIcon} />
            <Text style={styles.detailText}>{teeTime.holes}</Text>
          </View>
          
          {/* Number of Players */}
          <View style={styles.detailItem}>
            <FontAwesome5 name="user" size={15} color="#003a37" style={styles.detailIcon} />
            <Text style={styles.detailText}>{players}</Text>
          </View>
          
          {/* Side (hardcoded for now) */}
          <View style={styles.detailItem}>
            <FontAwesome5 name="golf-ball" size={15} color="#003a37" style={styles.detailIcon} />
            <Text style={styles.detailText}>Front</Text>
          </View>
        </View>
      </View>
      
      {/* Price Section */}
      <View style={styles.priceSection}>
        <View style={styles.priceBackground} />
        <Text style={styles.priceText}>{price}</Text>
        <Text style={styles.priceSubText}>/ player</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8, // Increased for Android
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  
  statusDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#92F882',
    zIndex: 10,
  },
  
  imageSection: {
    width: 96,
    height: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  
  courseImage: {
    position: 'absolute',
    width: 210,
    height: 108,
    left: -13,
    top: -3,
  },
  
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(173, 173, 173, 0.4)',
  },
  
  timeText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 28,
    paddingTop: 36, // Fine-tune vertical centering to match Figma
  },
  
  contentSection: {
    flex: 1,
    paddingLeft: 22,
    paddingTop: 16,
    paddingRight: 16,
  },
  
  courseName: {
    fontFamily: FontFamily.medium, // Using medium instead of semibold as we don't have it
    fontSize: 20,
    color: '#003a37',
    marginBottom: 8,
  },
  
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  detailIcon: {
    marginRight: 4,
  },
  
  detailText: {
    fontFamily: FontFamily.light,
    fontSize: 16,
    color: '#003a37',
  },
  
  priceSection: {
    position: 'absolute',
    right: 16,
    top: -2,
    width: 40,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  priceBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(172, 238, 198, 0.5)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  
  priceText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#2bb260',
    textAlign: 'center',
    marginTop: 8,
  },
  
  priceSubText: {
    fontFamily: FontFamily.light,
    fontSize: 9,
    color: '#2bb260',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginTop: 2,
  },
});

export default TeeTimeCard; 