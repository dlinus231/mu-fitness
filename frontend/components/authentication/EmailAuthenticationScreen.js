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
        <Text style={styles.mainText}>
          You're almost there! Please validate the email associated with your
          account by entering the code sent to your email.
        </Text>
        <TextInput
          keyboardType="numeric"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          style={styles.input}
        />
        {/* <Button title="Submit" onPress={handleSubmit} color="#6A5ACD" /> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainText: {
    textAlign: "center",
    paddingBottom: 12,
  },
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

export default EmailAuthenticationScreen;
