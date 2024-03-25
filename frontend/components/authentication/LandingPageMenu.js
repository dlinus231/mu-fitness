import React from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { VStack, Button, ButtonText, Text } from "@gluestack-ui/themed";

const LandingPageMenu = ({ navigation, handleAuthChange }) => {
  return (
    <SafeAreaView style={styles.container}>
      <VStack space="md" style={styles.buttonContainer}>
        <Text style={styles.titleText}>
          Welcome to Mu, your window into the fitness community
        </Text>
        {/* <Button onPress={() => navigation.navigate("signupScreen")}>
          <ButtonText>Sign up</ButtonText>
        </Button>
        <Button onPress={() => navigation.navigate("loginScreen")}>
          <ButtonText>Log in</ButtonText>
        </Button> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('signupScreen')}
        >
          <Text style={styles.text}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('loginScreen')}
        >
          <Text style={styles.text}>Log in</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('emailAuthScreen')}
        >
          <Text style={styles.text}>email verif screen</Text>
        </TouchableOpacity> */}
        {/* Comment this button and text out if you need a way to "login" without having a working account */}
        {/* <Text>
          {" "}
          Note: Although login works, debug login is kept for testing purposes
          (workouts will not work properly)
        </Text>
        <Button onPress={handleAuthChange}>
          <ButtonText>Log in (debugging purposes)</ButtonText>
        </Button> */}
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
  buttonContainer: {
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  top_text: {
    textAlign: 'center',
    paddingHorizontal: '3%',
    paddingBottom: '10%',
  },
  button: {
      borderColor: '#6A5ACD',
      backgroundColor: '#6A5ACD',
      padding: 10,
      borderRadius: 5,
      // height: '17%',
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center',
  },
  text: {
      textAlign: 'center',
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default LandingPageMenu;
