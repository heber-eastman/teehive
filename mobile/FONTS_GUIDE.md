# Custom Fonts Guide for Teehive

This guide explains how to add and use custom fonts in your React Native/Expo app.

## Setup Process

### 1. Add Font Files
Place your custom font files (`.ttf`, `.otf`) in the `mobile/assets/fonts/` directory:

```
mobile/
  assets/
    fonts/
      Roboto-Regular.ttf
      Roboto-Bold.ttf
      OpenSans-Regular.ttf
      OpenSans-Bold.ttf
```

### 2. Configure Font Loading
Update `mobile/utils/fonts.ts` to include your fonts:

```typescript
export const customFonts = {
  'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
  'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
};

export const FontFamily = {
  regular: 'Roboto-Regular',
  bold: 'Roboto-Bold',
  openSansRegular: 'OpenSans-Regular',
  openSansBold: 'OpenSans-Bold',
};
```

### 3. Wrap Your App with FontLoader
Update your `App.tsx`:

```typescript
import FontLoader from './components/FontLoader';

const App = () => {
  const { teeTimes, isLoading, error, refetch } = useTeeTimes();

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <FontLoader>
          <TeeTimesList teeTimes={teeTimes} onRefresh={refetch} />
        </FontLoader>
      </PaperProvider>
    </SafeAreaProvider>
  );
};
```

## Using Custom Fonts

### In StyleSheet
```typescript
import { FontFamily } from '../utils/fonts';

const styles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
  },
});
```

### With React Native Paper Theme
```typescript
import { configureFonts, DefaultTheme } from 'react-native-paper';
import { FontFamily } from './utils/fonts';

const fontConfig = {
  web: {
    regular: {
      fontFamily: FontFamily.regular,
      fontWeight: 'normal' as const,
    },
    medium: {
      fontFamily: FontFamily.bold,
      fontWeight: 'normal' as const,
    },
  },
  ios: {
    regular: {
      fontFamily: FontFamily.regular,
      fontWeight: 'normal' as const,
    },
    medium: {
      fontFamily: FontFamily.bold,
      fontWeight: 'normal' as const,
    },
  },
  android: {
    regular: {
      fontFamily: FontFamily.regular,
      fontWeight: 'normal' as const,
    },
    medium: {
      fontFamily: FontFamily.bold,
      fontWeight: 'normal' as const,
    },
  },
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};

// Use in your PaperProvider
<PaperProvider theme={theme}>
```

## Font Sources

### Free Fonts
- [Google Fonts](https://fonts.google.com/) - Large collection of open-source fonts
- [Font Squirrel](https://www.fontsquirrel.com/) - Commercial-use free fonts

### Premium Fonts
- [Adobe Fonts](https://fonts.adobe.com/)
- [MyFonts](https://www.myfonts.com/)
- [Fontspring](https://www.fontspring.com/)

## Best Practices

1. **Font Formats**: Use `.ttf` files for best compatibility
2. **Font Weights**: Include multiple weights (Regular, Bold, etc.) for better typography
3. **Performance**: Only load fonts you actually use
4. **Fallbacks**: Always have system font fallbacks
5. **Testing**: Test on both iOS and Android devices

## Troubleshooting

### Fonts not loading
- Check file paths in `customFonts` object
- Ensure font files are in `assets/fonts/` directory
- Clear Metro cache: `npx expo start --clear`

### Metro bundler issues
- Restart Metro bundler
- Check `metro.config.js` includes asset types

### Font not displaying
- Check exact font family name
- Verify font file is valid
- Test with system fonts first 