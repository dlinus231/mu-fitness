import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { GluestackUIProvider, Button, ButtonText } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import { NavigationContainer } from '@react-navigation/native';

import FooterNavigator from './components/FooterNavigator';

export default function App() {
  return (

    <GluestackUIProvider config={config}>
      <NavigationContainer>
        {/* <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
        </View> */}
      
        <FooterNavigator />
      </NavigationContainer>
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
