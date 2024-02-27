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
    console.log("bm - entering handle login function, about to make request");
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.space}
      >
        <BackArrowIcon></BackArrowIcon>
      </TouchableOpacity>
      <Text>Sign Into Your Account</Text>
      <View style={styles.space}></View>
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
      <Button title="Sign In" onPress={handleLogin} />
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

export default LoginScreen;
