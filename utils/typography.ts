import { StyleSheet, TextStyle } from 'react-native';
import { FontFamily } from './fonts';

// Typography styles using Rubik font
export const Typography = StyleSheet.create({
  // Headers
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
  } as TextStyle,
  
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
  } as TextStyle,
  
  h3: {
    fontFamily: FontFamily.medium,
    fontSize: 24,
    lineHeight: 32,
  } as TextStyle,
  
  h4: {
    fontFamily: FontFamily.medium,
    fontSize: 20,
    lineHeight: 28,
  } as TextStyle,
  
  h5: {
    fontFamily: FontFamily.medium,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,
  
  h6: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  
  // Body text
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: 18,
    lineHeight: 26,
  } as TextStyle,
  
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  
  // Special text styles
  caption: {
    fontFamily: FontFamily.light,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  
  button: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  
  // Emphasis styles
  bold: {
    fontFamily: FontFamily.bold,
  } as TextStyle,
  
  italic: {
    fontFamily: FontFamily.italic,
  } as TextStyle,
  
  light: {
    fontFamily: FontFamily.light,
  } as TextStyle,
  
  medium: {
    fontFamily: FontFamily.medium,
  } as TextStyle,
}); 