import React, { useEffect, useState } from "react";
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
import BackArrowIcon from "../../../icons/BackArrowIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectList } from "react-native-dropdown-select-list";
import { useRoute } from "@react-navigation/native";

const EditWorkoutPlanScreen = ({ navigation }) => {
  const route = useRoute();
  const { workout_id } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState("beginner");
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState([]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const difficulties = [
    { key: 1, value: "beginner" },
    { key: 2, value: "intermediate" },
    { key: 3, value: "expert" },
  ];

  const fetchWorkout = async () => {
    try {
      const result = await axios.get(
        BACKEND_URL + `/workout/one/${workout_id}`
      );
      const workout = result.data;
      setName(workout.name);
      setDescription(workout.description);
      setSelected(workout.difficulty);
      setLoading(false);
      setRoutines(workout.routines);
    } catch (error) {
      if (error.response) {
        Alert.alert("Could not find this workout");
      } else {
        Alert.alert(
          "Server Issue: Fetching Workout Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  const handleEditWorkout = async () => {
    try {
      const response = await axios.post(BACKEND_URL + "/workout/edit", {
        workoutId: workout_id,
        name,
        description,
        difficulty: selected,
      });
      if (response.status == 200) {
        DeviceEventEmitter.emit("editWorkoutEvent");
        Alert.alert("Workout edited successfully", "", [
          {
            text: "Ok",
            onPress: () => navigation.navigate("WorkoutPlans"),
          },
        ]);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Invalid request", "Please try again");
      } else {
        Alert.alert(
          "Server Issue: Workout Edit Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon></BackArrowIcon>
        </TouchableOpacity>
        {loading ? (
          <Text>Loading content...</Text>
        ) : (
          <ScrollView automaticallyAdjustKeyboardInsets={true}>
            <View style={styles.container}>
              <Text> Edit Workout Plan </Text>

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
                placeholder={selected}
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
                  title="Edit Workout"
                  onPress={() => {
                    if (name.length > 0) {
                      handleEditWorkout();
                    } else {
                      Alert.alert("Workout name cannot be empty");
                    }
                  }}
                  color="#6A5ACD"
                ></Button>
              </View>
            </View>
          </ScrollView>
        )}
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
});

export default EditWorkoutPlanScreen;
