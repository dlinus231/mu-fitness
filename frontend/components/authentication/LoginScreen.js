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

const LoginScreen = ({ navigation, handleAuthChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // makes signin request when signin form is submitted
  const handleLogin = async () => {
    if (email == "" || password == "") {
      Alert.alert("All fields must be filled out");
      return;
    }

    console.log(BACKEND_URL);

    try {
      const response = await axios.post(BACKEND_URL + "/user/login", {
        email,
        password,
      });
      const data = response.data;

      // console.log("bm - response from login request: ", response);
      // console.log(response.data);

      if (response.status == 200) {
        //Session variables set on login
        AsyncStorage.setItem("user_id", "" + data.id);
        AsyncStorage.setItem("email", data.email);
        AsyncStorage.setItem("username", data.username);
        if (data.active) {
          handleAuthChange();
        } else {
          const response = await axios.post(BACKEND_URL + `/user/createauth`, {
            user_id: data.id,
          });

          navigation.navigate("emailAuthScreen");
        }
      }
    } catch (error) {
      console.log(
        "bm - error occurred in handleLogin function: ",
        error.response?.data?.error
      );
      console.log(error);
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

{/* <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      /> */}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity> */}
        <Text style={styles.headerText}>Log in</Text>
      </View>
      <View style={styles.space}></View>
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
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 0,
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

export default LoginScreen;
