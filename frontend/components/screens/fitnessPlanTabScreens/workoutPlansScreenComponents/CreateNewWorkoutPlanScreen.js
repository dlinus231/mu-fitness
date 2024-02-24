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
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";

const CreateNewWorkoutPlanScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState("beginner");
  const [exercises, setSelectedExercises] = useState([]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const difficulties = [
    { key: 1, value: "beginner" },
    { key: 2, value: "intermediate" },
    { key: 3, value: "expert" },
  ];
  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "/exercises/names"); 
        if (response.status === 200) {
          //const exerciseNames = response.data.map((exercise) => exercise);

          console.log("Exercises:", response.data); // Log the exercises

          const exerciseIdNames = response.data.map((exercise) => ({key: exercise.id, value: exercise.name}));
          setSelectedExercises((prevExercises) => {
            console.log("Previous Exercises State:", prevExercises);
            console.log("Exercises:", exerciseIdNames); // Log the exercises
            return exerciseIdNames;
          });

        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, []); 

// used to create a routine, and return its routineId
async function createRoutine(workoutId, exerciseId) {
  try {
    const response = await axios.post(BACKEND_URL + "/routine/create", {
      workoutId: workoutId,
      exerciseId: exerciseId,
      repetitions: 10,
      rest: 60,
      weightLbs: 50,
    });

    console.log("createdRoutine: " + response.status);
    console.log("routine.data: " + response.data)
    return parseInt(response.data.id); // Assuming the server returns the ID of the created routine
  } catch (error) {
    console.error("Error creating routine:", error);
    return null; // Handle the error as needed
  }
}
  //callback function when button is pressed, makes call to API and handles response
const handleCreateWorkout = async () => {
  let selectedExercises = exercises.filter((item) => typeof item === 'number')
  // selectedExercises.forEach((item) => {
  //   console.log("HERE:" + item)
  // })
  // console.log("Selected Exercises: " + selectedExercises)
  try {
    // Create workout first
    const workoutResponse = await axios.post(BACKEND_URL + "/workout/create", {
      userId: await AsyncStorage.getItem("user_id"),
      name,
      difficulty: selected,
      description,
      tags: [], // ToDo - Implement Tags
    });

    if (workoutResponse.status !== 201) {
      Alert.alert("Failed to create workout", "Please try again");
      return;
    }

    const workoutId = workoutResponse.data.id; // Assuming the response has the workoutId
    // console.log("workoutID: " + workoutId)
    const routinePromises = selectedExercises.map((exerciseId) => createRoutine(workoutId, exerciseId));

    const routineIds = await Promise.all(routinePromises);

    console.log("created routine ids: " + routineIds)
    anyRoutineNull = routineIds.some((element) => element === null || element === undefined)
    console.log("anyRoutineNull: " + anyRoutineNull)

    // Create an array to store the routine creation promises
    // const routineCreationPromises = [];

    // // Create routines for each selected exercise
    // selectedExercises.forEach(key => {
    //   axios.post(BACKEND_URL + "/routine/create", {
    //       workoutId: workoutId,
    //       exerciseId: key,
    //       repetitions: 10,
    //       rest: 60,
    //       weightLbs: 50,
    //   }).then((response) => {
    //       console.log("createdRoutine: " + response.status);
    //       routineCreationPromises.push(response);
    //   }).catch((error) => {
    //       console.error("Error creating routine:", error);
    //   });
    // });

    // Wait for all routine creation promises to resolve
    // const routineResponses = await Promise.all(routineCreationPromises);

    // Check if all routines were successfully created
    // const allRoutinesCreated = routineResponses.every((response) => response.status === 201);

    if (!anyRoutineNull) {
      const updateWorkoutResponse = await axios.post(BACKEND_URL + "/workout/edit", {
        workoutId: workoutId,
        routineIds: routineIds
      });
      console.log("Attempting to add routines: " + updateWorkoutResponse.data)
      console.log("Status: " + updateWorkoutResponse.status)
      DeviceEventEmitter.emit("createWorkoutEvent");
      Alert.alert("Workout created successfully", "", [
        {
          text: "Ok",
          onPress: () => navigation.navigate("WorkoutPlans"),
        },
      ]);
    } else {
      Alert.alert("Failed to create routines", "Please try again");
    }
  } catch (error) {
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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

          
            <Text style={styles.space}>Exercises:</Text>
            <MultipleSelectList
              
              setSelected={(val) => setSelectedExercises(val)}
              data={exercises}
              save="key"
              search={true}
              maxHeight={240}
              placeholder="Select exercises"
            />

            <View style={styles.space}></View>

            <Text style={styles.space}>Description: </Text>
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
                color="#333333"
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

export default CreateNewWorkoutPlanScreen;
