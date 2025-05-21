import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Button mode="contained" onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 