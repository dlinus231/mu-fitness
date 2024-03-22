import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
  DeviceEventEmitter,
  TextInput,
  Keyboard,
  Button,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { Text, View, set } from "@gluestack-ui/themed";
import { Octicons } from "@expo/vector-icons";
import { BACKEND_URL } from "@env";
import BackArrowIcon from "../../../icons/BackArrowIcon";
import { MaterialIcons } from "@expo/vector-icons";
import Routine from "./Routine";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";

import AsyncStorage from "@react-native-async-storage/async-storage";

const IndividualWorkoutPlanScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState({});
  const [routines, setRoutines] = useState([]);
  const [edited, setEdited] = useState(false);
  const [addingWorkout, setAddingWorkout] = useState(false);
  const [exercises, setExercises] = useState(false);
  const [selected, setSelected] = useState("");
  const [reps, setReps] = useState(8);
  const [rest, setRest] = useState(60);
  const [weight, setWeight] = useState(0);
  const [exerciseIds, setExerciseIds] = useState([]);
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  // const [updatingRoutineState, setUpdateRoutineState] = useState({});

  // we will use this to check if the workout belongs to the current user
  const [workoutOwnerId, setWorkoutOwnerId] = useState(-1);
  const [isOwnedByCurrentUser, setIsOwnedByCurrentUser] = useState(false);

  // console.log("bm - individual workout plan screen route params: ", route.params);

  const workout_id = route.params?.workout_id;
  const prevPage = route.params?.prevPage;
  const workoutFrom = route.params?.workoutFrom;

  DeviceEventEmitter.addListener("editWorkoutEvent", (eventData) => {
    setEdited(true);
  });

  // check if the workout belongs to the current user (compare to AsyncStorage user_id)
  useEffect(() => {
    const checkIfOwnedByCurrentUser = async () => {
      if (workoutOwnerId == -1) return; // don't run if workoutOwnerId hasn't been populated yet
      try {
        const uId = await AsyncStorage.getItem("user_id");
        if (uId !== null) {
          if (uId == workoutOwnerId) {
            // console.log("bm - setting isOwnedByCurrentUser to true because user_id matches workoutOwnerId");
            // console.log("bm - uId: ", uId);
            // console.log("bm - workoutOwnerId: ", workoutOwnerId);
            setIsOwnedByCurrentUser(true);
          }
        }
      } catch (e) {
        console.log("bm - error getting user id: ", e);
      }
    };
    checkIfOwnedByCurrentUser();
  }, [workoutOwnerId]);

  useEffect(() => {
    setLoading(true);
    fetchWorkout();
    fetchExercises();
    setExerciseIds([]); // Clear recommended exercises when a new workout is loaded
  }, [workout_id]);

  useEffect(() => {
    fetchRecommendations(); // fetchRecommendations() when exerciseIds changes
  }, [exerciseIds]);

  const addExerciseId = (id) => {
    setExerciseIds([...exerciseIds, id]);
  };

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        BACKEND_URL + `/workout/one/${workout_id}`
      );
      setWorkout(result.data);
      setRoutines(result.data.routines);
      setWorkoutOwnerId(result.data.user_id);
      setLoading(false);
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

  const handleDeleteWorkout = async () => {
    try {
      const result = await axios.delete(
        BACKEND_URL + `/workout/delete/${workout_id}`
      );
      if (result.status == 200) {
        Alert.alert("Workout deleted successfully", "", [
          {
            text: "Ok",
            onPress: navigation.navigate("FitnessPlans"),
          },
        ]);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Could not find this workout");
      } else {
        Alert.alert(
          "Server Issue: Deleting Workout Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  const handleEditWorkout = () => {
    setEdited(false);
    navigation.navigate("EditWorkoutPlan", {
      workout_id,
    });
  };

  // TODO: recommendations reset after checking out a different workout, can change implementation
  // to pull in previous exercise_ids whenever the workout_id changes!
  const fetchRecommendations = async () => {
    try {
      if (exerciseIds.length === 0) {
        return;
      }
      const exerciseIdsString = exerciseIds.join("+");
      console.log(
        "ENDPOINT: " +
          BACKEND_URL +
          `/exercises/recommendations/${exerciseIdsString}`
      );

      const response = await axios.get(
        BACKEND_URL + `/exercises/recommendations/${exerciseIdsString}`
      );
      if (response.status === 200) {
        const recommendations = [];
        response.data.forEach((exercise) => {
          recommendations.push({
            key: exercise.id,
            value: exercise.name,
          });
        });
        setRecommendedExercises(recommendations);
        // console.log("Recommendations: " + response.data)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/exercises/names");
      if (response.status === 200) {
        const exerciseIdNames = [];

        response.data.forEach((exercise) => {
          exerciseIdNames.push({
            key: exercise.id,
            value: exercise.name,
          });
        });

        setExercises(exerciseIdNames);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleAddExercise = async () => {
    try {
      const response = await axios.post(BACKEND_URL + `/workout/routine/add`, {
        workout_id,
        exercise_id: selected,
        reps,
        rest,
        weight,
      });
      if (response.status == 201) {
        Alert.alert("Exercise added successfully");
        setAddingWorkout(false);
        fetchWorkout();
        addExerciseId(selected); // used to fetchRecommendations
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Could not add this exercise to this workout");
      } else {
        Alert.alert(
          "Server Issue: Adding Exercise Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  const onDeleteRoutine = async (routineId) => {
    try {
      const response = await axios.delete(
        BACKEND_URL + `/workout/routine/delete/${routineId}`
      );
      if (response.status === 200) {
        Alert.alert("Exercise deleted successfully");
        // re-fetch workouts to re-render list
        fetchWorkout();
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Could not delete this exercise from this workout");
      } else {
        Alert.alert(
          "Server Issue: Deleting Exercise Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  const onUpdateRoutine = async (routineId, updatedRoutineData) => {
    // updatedRoutineData should have the form {repetitions: reps, rest: rest, weight_lbs: weight}
    try {
      const response = await axios.patch(
        BACKEND_URL + `/workout/routine/update/${routineId}`,
        updatedRoutineData // TODO is this correct format / syntax ?
      );

      if (response.status === 201) {
        // TODO this is never being called
        Alert.alert("Exercise updated successfully");
        // re-fetch workouts to re-render list w updated data
        fetchWorkout();
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Could not update this exercise in this workout");
      } else {
        Alert.alert(
          "Server Issue: Updating Exercise Failed",
          error.response?.data?.error || "Please try again later."
        );
      }
    }
  };

  const returnToWorkoutPlans = () => {
    navigation.navigate(workoutFrom, { prevPage: prevPage });
  };

  // fetch workout on initial render and if we try to access a new workout (meaning wokrout_id changed)
  useEffect(() => {
    setLoading(true);
    fetchWorkout();
    fetchExercises();
  }, [workout_id]);

  useEffect(() => {
    setReps(8);
    setRest(60);
    setWeight(0);
    setSelected("");
  }, [addingWorkout]);

  useEffect(() => {
    setLoading(true);
    fetchWorkout();
  }, [edited]);

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={dismissKeyboard}
    >
      <ScrollView style={styles.content}>
        {/* <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}> */}
        <TouchableOpacity
          style={[
            styles.chevron,
            { flexDirection: "row", alignItems: "center" },
          ]}
          onPress={returnToWorkoutPlans}
        >
          <BackArrowIcon></BackArrowIcon>
          {/* <Text> Back to your Workout Plans</Text> */}
        </TouchableOpacity>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <View style={styles.container}>
              <Text style={styles.titleText}>{workout.name}</Text>
              <Text style={styles.subTitleText}>
                {workout.difficulty} difficulty
              </Text>
              <Text style={styles.notesText}>Notes: {workout.description}</Text>
              {isOwnedByCurrentUser && (
                <View style={styles.topButtonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditWorkout}
                  >
                    <Text style={{ color: "white" }}> Edit Plan </Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.exercisesText}>Exercises</Text>

              <View>
                {routines.length === 0 &&
                  (isOwnedByCurrentUser ? (
                    <>
                      <Text style={styles.no_exercises_text}>
                        You haven't added any exercises to this workout yet.
                      </Text>
                      <Text style={styles.no_exercises_text}>
                        Add a set by clicking the button below.
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.no_exercises_text}>
                      This workout plan does not have any exercises yet.
                    </Text>
                  ))}
              </View>

              <View>
                {routines.map((routine) => {
                  return (
                    <Routine
                      routine={routine}
                      onDeleteRoutine={() => onDeleteRoutine(routine.id)}
                      onUpdateRoutine={onUpdateRoutine}
                      key={routine.id}
                      isOwnedByCurrentUser={isOwnedByCurrentUser}
                    />
                  );
                })}
              </View>

              {addingWorkout ? (
                <View style={styles.space}>
                  <Text>Recommended Exercises:</Text>
                  <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={recommendedExercises}
                    save="key"
                    search={true}
                    maxHeight={240}
                    placeholder="Select exercises"
                  />
                  <Text>New Exercise:</Text>
                  <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={exercises}
                    save="key"
                    search={true}
                    maxHeight={240}
                    placeholder="Select exercises"
                  />
                  <View style={styles.inputContainer}>
                    <Text style={{ flex: 1 }}>Repetitions:</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={[styles.input, { flex: 1 }]}
                      value={reps.toString()}
                      onChangeText={setReps}
                    ></TextInput>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={{ flex: 1 }}>Rest Time (s):</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={[styles.input, { flex: 1 }]}
                      value={rest.toString()}
                      onChangeText={setRest}
                    ></TextInput>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={{ flex: 1 }}>Weight (lbs):</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={[styles.input, { flex: 1 }]}
                      value={weight.toString()}
                      onChangeText={setWeight}
                    ></TextInput>
                  </View>
                  <View style={styles.submit_button}>
                    <Button
                      title="Add Exercise"
                      onPress={() => {
                        if (selected != "") {
                          handleAddExercise();
                        } else {
                          Alert.alert("Fields cannot be empty.");
                        }
                      }}
                      color="#6A5ACD"
                    ></Button>
                  </View>
                  <View style={styles.cancel_button}>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        setAddingWorkout(false);
                      }}
                      color="#333333"
                    ></Button>
                  </View>
                </View>
              ) : (
                isOwnedByCurrentUser && (
                  <TouchableOpacity
                    style={styles.addNewButton}
                    onPress={() => {
                      setAddingWorkout(true);
                    }}
                  >
                    <MaterialIcons name="post-add" size={48} color="black" />
                    <Text>Add an exercise</Text>
                  </TouchableOpacity>
                )
              )}
              <View>
                {/* Display the most recently added routine first */}
                {routines
                  .slice()
                  .reverse()
                  .map((routine) => {
                    return (
                      <Routine
                        routine={routine}
                        onDeleteRoutine={() => onDeleteRoutine(routine.id)}
                        onUpdateRoutine={onUpdateRoutine}
                        key={routine.id}
                      />
                    );
                  })}
              </View>
            </View>

            {addingWorkout ? (
              <></>
            ) : (
              isOwnedByCurrentUser && (
                <View style={styles.bottomContent}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDeleteWorkout}
                    >
                      <Text style={{ color: "lightcoral" }}>
                        Delete Workout Plan
                      </Text>
                    </TouchableOpacity>
                    {/* <View style={{ width: 20 }}></View> */}
                  </View>
                </View>
              )
            )}
          </>
        )}
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#CCCCCC",
    marginTop: 20,
  },
  bottomContent: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: "3%",
    paddingBottom: "3%",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  topButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "5%",
  },
  container: {
    padding: "3%",
  },
  chevron: {
    paddingTop: "3%",
    paddingBottom: "2%",
  },
  content: {
    marginTop: 20,
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: "lightcoral",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  editButton: {
    borderWidth: 2,
    borderColor: "#6A5ACD",
    borderRadius: 10,
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    minWidth: 150,
    marginLeft: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  space: {
    marginTop: 20,
    minWidth: 300,
  },
  submit_button: {
    backgroundColor: "#B0E0E6",
    border: "none",
    marginTop: 20,
  },
  cancel_button: {
    backgroundColor: "#FFCCCC",
    border: "none",
    marginTop: 20,
  },
  no_exercises_text: {
    textAlign: "center",
    paddingHorizontal: "3%",
    paddingTop: "3%",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: "1%",
    paddingTop: "4%",
  },
  subTitleText: {
    fontSize: 16,
    // fontWeight: "bold",
    textAlign: "center",
    paddingBottom: "1%",
  },
  notesText: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: "3%",
  },
  exercisesText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: "5%",
    paddingLeft: "1%",
  },
});
export default IndividualWorkoutPlanScreen;
