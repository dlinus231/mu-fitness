import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@env";
import {
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@gluestack-ui/themed";

const SignupScreen = ({ navigation, handleAuthChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [username, setUsername] = useState("");

  // makes signin request when signin form is submitted
  const handleSignUp = async () => {
    // TODO check that the password and password confirmation match

    try {
      const response = await axios.post(BACKEND_URL + "/user/create", {
        username,
        email,
        password,
      });
      if (response.status == 201) {
        handleAuthChange();
        Alert.alert(
          "Sign Up Successful",
          "You can now log in with your credentials."
        );
      }
    } catch (error) {
      // Handle errors, such as showing an alert with a message
      if (error.response) {
        if (error.response.status == 409) {
          Alert.alert(
            "There is already an account associated with this email.",
            "Please login with your existing credentials."
          );
        } else if (error.response.status == 400) {
          Alert.alert("Invalid request made");
        }
      } else {
        Alert.alert(
          "Server Issue: Sign Up Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>This is the signup screen</Text>
      <Text>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.space}
      >
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
  },
  space: {
    marginTop: 20,
  },
});

export default SignupScreen;
