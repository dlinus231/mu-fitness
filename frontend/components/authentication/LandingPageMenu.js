import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { VStack, Button, ButtonText, Text } from "@gluestack-ui/themed";

const LandingPageMenu = ({ navigation, handleAuthChange }) => {
  return (
    <SafeAreaView style={styles.container}>
      <VStack space="md" style={styles.buttonContainer}>
        <Text style={styles.titleText}>
          Welcome to Mu, your window into the fitness community
        </Text>
        <Text></Text>
        <Button onPress={() => navigation.navigate("signupScreen")}>
          <ButtonText>Sign up</ButtonText>
        </Button>
        <Button onPress={() => navigation.navigate("loginScreen")}>
          <ButtonText>Log in</ButtonText>
        </Button>
        <Text>
          {" "}
          Note: Although login works, debug login is kept for testing purposes
          (workouts will not work properly)
        </Text>
        <Button onPress={handleAuthChange}>
          <ButtonText>Log in (debugging purposes)</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    textAlign: "center",
  },
});

export default LandingPageMenu;
