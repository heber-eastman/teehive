import React from 'react';
import * as Font from 'expo-font';

// Define your custom fonts here
export const customFonts = {
  // Rubik font family
  'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
  'Rubik-Light': require('../assets/fonts/Rubik-Light.ttf'),
  'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
  'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
  'Rubik-Black': require('../assets/fonts/Rubik-Black.ttf'),
  'Rubik-Italic': require('../assets/fonts/Rubik-Italic.ttf'),
  'Rubik-LightItalic': require('../assets/fonts/Rubik-LightItalic.ttf'),
  'Rubik-MediumItalic': require('../assets/fonts/Rubik-MediumItalic.ttf'),
  'Rubik-BoldItalic': require('../assets/fonts/Rubik-BoldItalic.ttf'),
  'Rubik-BlackItalic': require('../assets/fonts/Rubik-BlackItalic.ttf'),
};

// Font family names for easier usage
export const FontFamily = {
  regular: 'Rubik-Regular',
  light: 'Rubik-Light',
  medium: 'Rubik-Medium',
  bold: 'Rubik-Bold',
  black: 'Rubik-Black',
  italic: 'Rubik-Italic',
  lightItalic: 'Rubik-LightItalic',
  mediumItalic: 'Rubik-MediumItalic',
  boldItalic: 'Rubik-BoldItalic',
  blackItalic: 'Rubik-BlackItalic',
};

// Function to load all custom fonts
export const loadCustomFonts = async (): Promise<void> => {
  try {
    await Font.loadAsync(customFonts);
    console.log('Custom fonts loaded successfully');
  } catch (error) {
    console.error('Error loading custom fonts:', error);
  }
};

// Hook to check if fonts are loaded
export const useFontsLoaded = (): boolean => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadFonts = async () => {
      await loadCustomFonts();
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return fontsLoaded;
}; 