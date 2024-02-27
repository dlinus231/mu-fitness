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

const IndividualWorkoutPlanScreen = ({
  navigation,
  onLeaveWorkoutPlanPage,
  workout_id,
}) => {
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
  // const [updatingRoutineState, setUpdateRoutineState] = useState({});

  DeviceEventEmitter.addListener("editWorkoutEvent", (eventData) => {
    setEdited(true);
  });

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      console.log('making call to backend to fetch workout')
      const result = await axios.get(
        BACKEND_URL + `/workout/one/${workout_id}`
      );
      console.log('bm - response from fetch workout request: ', result.data)
      setWorkout(result.data);
      setRoutines(result.data.routines);
      setLoading(false);
    } catch (error) {
      console.log('bm - error occurred in fetchWorkout function: ', error)
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
            onPress: onLeaveWorkoutPlanPage,
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
    console.log('bm - deleting routine with id: ', routineId)
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
    console.log('bm - updating routine with id: ', routineId, ' and data: ', updatedRoutineData)
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
  }

  useEffect(() => {
    setLoading(true);
    fetchWorkout();
    fetchExercises();
  }, []);

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


  console.log('bm - rendering routines: ', routines)
  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={dismissKeyboard}
    >
      <ScrollView style={styles.content}>
        {/* <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}> */}
        <TouchableOpacity
          style={styles.chevron}
          onPress={onLeaveWorkoutPlanPage}
        >
          <BackArrowIcon></BackArrowIcon>
        </TouchableOpacity>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <View style={styles.container}>
              <Text>{workout.name}</Text>
              <Text>Difficulty: {workout.difficulty}</Text>
              <Text>Notes:</Text>
              <Text>{workout.description}</Text>
              <Text>Exercises:</Text>

              <View>
                {routines.length === 0 && (
                  <>
                    <Text style={styles.no_exercises_text}>You haven't added any exercises to this workout yet.</Text>
                    <Text style={styles.no_exercises_text}>Add a set by clicking the button below.</Text>
                  </>
                )}
              </View>
              
              <View>
                {routines.map((routine) => {
                  return <Routine 
                    routine={routine} 
                    onDeleteRoutine={() => onDeleteRoutine(routine.id)} 
                    onUpdateRoutine={onUpdateRoutine}
                    key={routine.id}/>;
                })}
              </View>

              {addingWorkout ? (
                <View style={styles.space}>
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
                      color="#333333"
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
                <TouchableOpacity
                  style={styles.addNewButton}
                  onPress={() => {
                    setAddingWorkout(true);
                  }}
                >
                  <MaterialIcons name="post-add" size={48} color="black" />
                  <Text>Add an exercise</Text>
                </TouchableOpacity>
              )}
            </View>

            {addingWorkout ? (
              <></>
            ) : (
              <View style={styles.bottomContent}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    //Todo conditionally render buttons if this workout belongs to this user
                    style={styles.deleteButton}
                    onPress={handleDeleteWorkout}
                  >
                    <Text style={{ color: "lightcoral" }}>Delete</Text>
                  </TouchableOpacity>
                  <View style={{ width: 20 }}></View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditWorkout}
                  >
                    <Text style={{ color: "white" }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    paddingRight: 30,
  },
  buttonContainer: {
    flexDirection: "row",
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
    textAlign: 'center',
    paddingHorizontal: '3%',
  }
});
export default IndividualWorkoutPlanScreen;
