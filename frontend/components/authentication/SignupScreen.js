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
import BackArrowIcon from "../icons/BackArrowIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = ({ navigation, handleAuthChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [username, setUsername] = useState("");

  // makes signin request when signin form is submitted
  const handleSignUp = async () => {
    // console.log("bm - entering handle sign up function, about to make request");
    try {
      const response = await axios.post(BACKEND_URL + "/user/create", {
        username,
        email,
        password,
      });

      if (response.status == 201) {
        const data = response.data;
        await AsyncStorage.setItem("user_id", "" + data.id);
        await AsyncStorage.setItem("email", data.email);
        await AsyncStorage.setItem("username", data.username);

        const tokenResponse = await axios.post(
          BACKEND_URL + `/user/createauth`,
          {
            user_id: data.id,
          }
        );

        navigation.navigate("emailAuthScreen");
      }
    } catch (error) {
      console.log(
        "bm - error occurred in handleSignUp function: ",
        error.response?.data?.error
      );
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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.space}
      >
        <BackArrowIcon></BackArrowIcon>
      </TouchableOpacity>
      <Text>Create an Account</Text>
      <View style={styles.space}></View>
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
    minWidth: 200,
  },
  space: {
    marginTop: 20,
  },
});

export default SignupScreen;
