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
import { BACKEND_URL } from "@env";
import BackArrowIcon from "../../../icons/BackArrowIcon";
import Routine from "./Routine";
import RoutineInfo from "./RoutineInfo";
import { AntDesign } from "@expo/vector-icons";

import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";

import AsyncStorage from "@react-native-async-storage/async-storage";

const IndividualWorkoutPlanScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loadingReccs, setLoadingReccs] = useState(true);
  const [workout, setWorkout] = useState({});
  const [routines, setRoutines] = useState([]);
  const [edited, setEdited] = useState(false);
  const [addingWorkout, setAddingWorkout] = useState(false);
  const [exercises, setExercises] = useState(false);
  const [selected, setSelected] = useState("");
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  // const [updatingRoutineState, setUpdateRoutineState] = useState({});

  // we will use this to check if the workout belongs to the current user
  const [workoutOwnerId, setWorkoutOwnerId] = useState(-1);
  const [workoutOwnerUsername, setWorkoutOwnerUsername] = useState("");
  const [isOwnedByCurrentUser, setIsOwnedByCurrentUser] = useState(false);

  const [showRoutineInfo, setShowRoutineInfo] = useState(false);
  const [routineInfoId, setRoutineInfoId] = useState(-1);

  // console.log("bm - individual workout plan screen route params: ", route.params);

  const workout_id = route.params?.workout_id;
  const prevPage = route.params?.prevPage;
  const workoutFrom = route.params?.workoutFrom;

  console.log("bm - workoutFrom in individual workout plan screen: ", workoutFrom);

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
            setIsOwnedByCurrentUser(true);
          } else {
            setIsOwnedByCurrentUser(false);
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
    setShowRoutineInfo(false);
    fetchWorkout();
    fetchExercises();
  }, [workout_id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        BACKEND_URL + `/workout/one/${workout_id}`
      );
      fetchRecommendations();
      console.log("bm - workout data: ", result.data);
      console.log("bm - username: ", result.data.user.username);
      setWorkout(result.data);
      setRoutines(result.data.routines);
      setWorkoutOwnerId(result.data.user_id);
      setWorkoutOwnerUsername(result.data.user.username)
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
        navigation.navigate(workoutFrom, { prevPage: prevPage })
      }
      // if (result.status == 200) {
      //   Alert.alert("Workout deleted successfully", "", [
      //     {
      //       text: "Ok",
      //       onPress: navigation.navigate(workoutFrom, { prevPage: prevPage }),
      //     },
      //   ]);
      // }
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
      workout_id: workout_id,
      prevPage: "IndividualWorkoutScreen",
      workoutFrom: "IndividualWorkoutScreen",
      workoutFromFrom: workoutFrom,
    });
  };

  // TODO: recommendations reset after checking out a different workout, can change implementation
  // to pull in previous exercise_ids whenever the workout_id changes!
  const fetchRecommendations = async () => {
    setLoadingReccs(true);
    try {
      const response = await axios.get(
        BACKEND_URL + `/exercises/recommendations/${workout_id}`
      );
      if (response.status === 200) {
        setRecommendedExercises(response.data);
        console.log(response.data);
        setLoadingReccs(false);
      }
    } catch (error) {
      console.error(error);
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
            value: exercise.name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
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
      });
      if (response.status == 201) {
        // Alert.alert("Exercise added successfully");
        setAddingWorkout(false);
        fetchWorkout();
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

  const handleAddExerciseWithId = async (exercise_id) => {
    try {
      const response = await axios.post(BACKEND_URL + `/workout/routine/add`, {
        workout_id,
        exercise_id: exercise_id,
      });
      if (response.status == 201) {
        //  Alert.alert("Exercise added successfully");
        setAddingWorkout(false);
        fetchWorkout();
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
        // Alert.alert("Exercise deleted successfully");
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
        // Alert.alert("Exercise updated successfully");
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
    navigation.navigate(workoutFrom, {
      prevPage: prevPage,
      workout_id: workout_id,
    });
  };

  // fetch workout on initial render and if we try to access a new workout (meaning wokrout_id changed)
  useEffect(() => {
    setLoading(true);
    fetchWorkout();
    fetchExercises();
  }, [workout_id]);

  useEffect(() => {
    setSelected("");
  }, [addingWorkout]);

  useEffect(() => {
    setLoading(true);
    fetchWorkout();
  }, [edited]);

  return (
    <>
      <TouchableWithoutFeedback
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
            <View style={styles.container}>
              <View style={styles.workoutInfo}>
                <Text style={styles.titleText}>{workout.name}</Text>
                <Text style={styles.notesText}>Created by {workoutOwnerUsername}</Text>
                <Text style={styles.subTitleText}>
                  {workout.difficulty
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")} Difficulty
                </Text>
                <Text style={styles.notesText}>{workout.description}</Text>
                {isOwnedByCurrentUser && (
                  <View style={styles.topButtonContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={handleEditWorkout}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>Edit Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDeleteWorkout}
                    >
                      <Text style={{ color: "#cd695a", fontWeight: "bold" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <Text style={styles.exercisesText}>Exercises</Text>

              <View>
                {routines.length === 0 &&
                  (!isOwnedByCurrentUser && (
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
                      setShowRoutineInfo={setShowRoutineInfo}
                      setRoutineInfoId={setRoutineInfoId}
                    />
                  );
                })}
              </View>

              {addingWorkout ? (
                <View style={[styles.space, styles.addWorkout]}>
                  <Text style={styles.addExercisesText}>Add Exercise</Text>
                  <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={exercises}
                    save="key"
                    search={true}
                    maxHeight={240}
                    placeholder="Select Exercises"
                  />

                  <View style={styles.submit_button}>
                    <Button
                      title="Add"
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
                    {/* <MaterialIcons name="post-add" size={48} color="black" /> */}
                    <Text style={styles.addNewText}>Add a New Exercise</Text>
                  </TouchableOpacity>
                )
              )}

              {addingWorkout ? (
                <></>
              ) : (
                isOwnedByCurrentUser &&
                recommendedExercises.length !== 0 &&
                !loadingReccs && (
                  <View style={styles.bottomContent}>
                    <Text style={styles.exercisesText}>
                      Recommended Exercises
                    </Text>
                    {recommendedExercises.map((exercise) => {
                      return (
                        <View
                          key={exercise.id}
                          style={styles.recommendationContainer}
                        >
                          <Text>
                            {exercise.name
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              handleAddExerciseWithId(exercise.id);
                            }}
                          >
                            <AntDesign
                              name="pluscircleo"
                              size={20}
                              color="#888888"
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )
              )}
            </View>
          )}
          {/* </KeyboardAvoidingView> */}
        </ScrollView>
      </TouchableWithoutFeedback>
      {showRoutineInfo && (
        <RoutineInfo
          setShowRoutineInfo={setShowRoutineInfo}
          routineInfoId={routineInfoId}
          fetchWorkout={fetchWorkout}
          workoutId={workout_id}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          workoutFromFrom={workoutFrom}
        ></RoutineInfo>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  addNewButton: {
    padding: 10,
    backgroundColor: "#695acd",
    borderColor: "#695acd",
    borderWidth: 3,
    marginTop: 20,
    borderRadius: 10,
  },
  addNewText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  bottomContent: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "3%",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  topButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: "5%",
    paddingTop: "3%",
  },
  container: {
    padding: "3%",
    marginTop: -20,
  },
  recommendationContainer: {
    marginTop: 15,
    backgroundColor: "lightgray",
    padding: 15,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
    borderColor: "#cd695a",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "45%",
    alignItems: "center",
  },
  editButton: {
    borderWidth: 2,
    borderColor: "#695acd",
    borderRadius: 10,
    backgroundColor: "#695acd",
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "45%",
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
    minWidth: 300,
  },
  submit_button: {
    backgroundColor: "#B0E0E6",
    border: "none",
    marginTop: 10,
  },
  cancel_button: {
    backgroundColor: "#FFCCCC",
    border: "none",
    marginTop: 10,
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
    textAlign: "center",
    paddingBottom: "1%",
  },
  notesText: {
    fontSize: 16,
    textAlign: "center",
  },
  exercisesText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: "6%",
    paddingLeft: "1%",
    textAlign: "center",
  },
  addExercisesText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: "6%",
    paddingLeft: "1%",
    textAlign: "center",
    marginBottom: "4%",
  },
  workoutInfo: {
    backgroundColor: "lightgrey",
    paddingVertical: 15,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
});
export default IndividualWorkoutPlanScreen;
