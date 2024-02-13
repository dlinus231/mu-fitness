import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { GluestackUIProvider, Button, ButtonText } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <GluestackUIProvider config={config}>
      <Button>
        <ButtonText>Hello world</ButtonText>
      </Button>
    </GluestackUIProvider>
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
