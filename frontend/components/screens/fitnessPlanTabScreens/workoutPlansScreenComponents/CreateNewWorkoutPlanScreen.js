import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Button,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { BACKEND_URL } from "@env";
import { Text, View } from "@gluestack-ui/themed";
import { Octicons } from "@expo/vector-icons";
import BackArrowIcon from "../../../icons/BackArrowIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";

const CreateNewWorkoutPlanScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState("beginner");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const difficulties = [
    { key: 1, value: "beginner" },
    { key: 2, value: "intermediate" },
    { key: 3, value: "expert" },
  ];

  //callback function when button is pressed, makes call to API and handles response
  const handleCreateWorkout = async () => {
    console.log(
      "bm - entering handle create workout function, about to make request"
    );
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const response = await axios.post(BACKEND_URL + "/workout/create", {
        userId,
        name,
        difficulty: selected,
        description,
        tags: [], //ToDo - Implement Tags
        // exercises: selectedExercises,
      });
      if (response.status == 201) {
        DeviceEventEmitter.emit("createWorkoutEvent");
        Alert.alert("Workout created successfully", "", [
          {
            text: "Ok",
            onPress: () => navigation.navigate("WorkoutPlans"),
          },
        ]);
      }
    } catch (error) {
      console.log(
        "bm - error occurred in handleCreateWorkout function: ",
        error.response?.data?.error
      );
      if (error.response) {
        Alert.alert("Invalid request made to server", "Please try again");
      } else {
        Alert.alert(
          "Server Issue: Workout Creation Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            // style={styles.space}
          >
            <BackArrowIcon></BackArrowIcon>
        </TouchableOpacity>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <View style={styles.container}>
            <Text> New Workout Plan </Text>

            <Text style={styles.space}>Name: </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              maxLength={100}
            ></TextInput>

            <Text style={styles.space}>Difficulty:</Text>
            <SelectList
              setSelected={(val) => setSelected(val)}
              data={difficulties}
              save="value"
              search={false}
              maxHeight={120}
              placeholder="beginner"
            ></SelectList>

            <View style={styles.space}></View>

            <Text style={styles.space}>Notes: </Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={10}
              minHeight={100}
              maxHeight={100}
            ></TextInput>

            <View style={styles.submit_button}>
              <Button
                title="Create Workout"
                onPress={() => {
                  if (name.length > 0) {
                    handleCreateWorkout();
                  } else {
                    Alert.alert("Workout name cannot be empty");
                  }
                }}
                color="#6A5ACD"
              ></Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  submit_button: {
    backgroundColor: "#B0E0E6",
    border: "none",
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
    width: 300,
  },
  space: {
    marginTop: 20,
    minWidth: 300,
  },
  flatlist: {
    maxHeight: 550, //Todo - make responsive for diff screen sizes
  },
});

export default CreateNewWorkoutPlanScreen;
