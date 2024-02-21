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

const LoginScreen = ({ navigation, handleAuthChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // makes signin request when signin form is submitted
  const handleLogin = async () => {
    try {
      const response = await axios.post(BACKEND_URL + "/user/login", {
        email,
        password,
      });
      if (response.status == 200) {
        handleAuthChange();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == 401) {
          Alert.alert("Invalid email or password", "Please try again");
        } else if (error.response.status == 400) {
          Alert.alert("Invalid request made");
        }
      } else {
        Alert.alert(
          "Server Issue: Login Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>This is the login screen</Text>
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
      <Button title="Sign Up" onPress={handleLogin} />
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

export default LoginScreen;
