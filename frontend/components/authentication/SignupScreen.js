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
  const [username, setUsername] = useState("");

  // makes signin request when signin form is submitted
  const handleSignUp = async () => {
    if (email == "" || password == "" || username == "") {
      Alert.alert("All fields must be filled out");
      return;
    }

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
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity> */}
        <Text style={styles.headerText}>Create an Account</Text>
      </View>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {/* <Button title="Sign Up" onPress={handleSignUp} color="#6A5ACD"/> */}
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
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  space: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  button: {
    width: "45%",
    padding: '4%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: "#b0b0b0",
  },
  signUpButton: {
    backgroundColor: "#6A5ACD",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default SignupScreen;
