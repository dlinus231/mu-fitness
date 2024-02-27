import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@env";
import {
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Text, View } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BackArrowIcon from "../icons/BackArrowIcon";

const EmailAuthenticationScreen = ({ navigation, handleAuthChange }) => {
  const [code, setCode] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    try {
      const user_id = parseInt(await AsyncStorage.getItem("user_id"));
      const response = await axios.post(BACKEND_URL + `/user/validateAuth`, {
        user_id,
        code,
      });
      if (response.status == 200) {
        handleAuthChange();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == 401) {
          console.log(error.response.data.message);
          Alert.alert(error.response.data.message, "Please try again.");
        } else if (error.response.status == 400) {
          Alert.alert("Invalid request made");
        } else {
          Alert.alert(
            "Server Issue: Email Validation Failed",
            error.response?.data?.error || "Please try again later."
          );
        }
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.space}
        >
          <BackArrowIcon></BackArrowIcon>
        </TouchableOpacity>
        <Text style={{ textAlign: "center" }}>
          You're almost there! Please validate the email associated with your
          account.
        </Text>
        <View style={styles.space}></View>
        <Text>Enter the code you recieved via email:</Text>
        <TextInput
          keyboardType="numeric"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          style={styles.input}
        />
        <Button title="Submit" onPress={handleSubmit} color="#6A5ACD" />
      </View>
    </TouchableWithoutFeedback>
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
    marginVertical: 20,
    minWidth: 100,
    textAlign: "center",
  },
  space: {
    marginTop: 20,
  },
});

export default EmailAuthenticationScreen;
