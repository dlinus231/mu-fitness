import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { GluestackUIProvider, Button, ButtonText } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import { NavigationContainer } from "@react-navigation/native";

import FooterNavigator from "./components/FooterNavigator";
import LandingPageScreen from "./components/authentication/LandingPageScreen";

//Session variables
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  // TODO this should be a state variable once its implemented
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleAuthChange() {
    setIsLoggedIn(!isLoggedIn);
  }

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        {isLoggedIn ? (
          <FooterNavigator handleAuthChange={handleAuthChange} />
        ) : (
          <LandingPageScreen handleAuthChange={handleAuthChange} />
        )}
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
