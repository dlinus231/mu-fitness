import React, { useEffect, useState } from "react";
import { SafeAreaView, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { Text, View, Button, ButtonText } from "@gluestack-ui/themed";
import { BACKEND_URL } from "@env";

const Routine = ({ routine, onDeleteRoutine, onUpdateRoutine }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [exercise, setExercise] = useState("");

  const [reps, setRepetitions] = useState(routine.repetitions);
  const [rest, setRest] = useState(routine.rest);
  const [weight, setWeight] = useState(routine.weight_lbs);

  const fetchExercise = async () => {
    try {
      const result = await axios.get(
        BACKEND_URL + `/exercises/one/${routine.exercise_id}`
      );
      setExercise(result.data);
    } catch (error) {
      if (error.response) {
        "Server Issue: Fetching Exercises Failed",
          error.response?.data?.error || "Please try again later.";
      }
    }
  };

  const updateRoutine = async () => {
    try {
      const result = await axios.put(
        BACKEND_URL + `/workout/routine/update/${routine.id}`,
        {
          repetitions: reps,
          rest: rest,
          weight_lbs: weight,
        }
      );
      console.log("Updated Routine", result.data);
    } catch (error) {
      if (error.response) {
        "Server Issue: Updating Routine Failed",
          error.response?.data?.error || "Please try again later.";
      }
    }
  };

  useEffect(() => {
    fetchExercise();
  }, []);

  const _handleEditButtonClick = () => {
    setIsEditing(!isEditing);
  };

  const _handleSave = async () => {
    console.log('bm - handleSave called with reps:', reps, 'rest:', rest, 'weight:', weight)
    const updatedRoutineData = {
      repetitions: reps,
      rest: rest,
      weight_lbs: weight,
    };

    setIsEditing(false);

    // TODO make a put request to update the routine
      // await the put request so that it saves the new routine before continuing

    console.log("updating routine", updatedRoutineData);
    await onUpdateRoutine(routine.id, updatedRoutineData);
    console.log("bm - onUpdateRoutine returned")
  };

  const _renderEditingView = () => {
    return (
      <View style={{ marginTop: 15, backgroundColor: "lightgray", padding: 10 }}>
        <Text>Editing Routine</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={String(reps)}
            onChangeText={setRepetitions}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rest (s)</Text>
          <TextInput
            style={styles.input}
            value={String(rest)}
            onChangeText={setRest}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            value={String(weight)}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.bottomContent}>
          <View style={styles.buttonContainer}>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={_handleEditButtonClick}
            >
              <Text style={{ color: "lightcoral" }}>Cancel</Text>
            </TouchableOpacity>
            <View style={{ width: 10 }}></View>
            <TouchableOpacity
              //Todo conditionally render buttons if this workout belongs to this user
              style={styles.editButton}
              onPress={_handleSave}
            >
              <Text style={{ color: "white" }}>Update</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  }

  return isEditing ? _renderEditingView() : (
    <View style={{ marginTop: 15, backgroundColor: "lightgray", padding: 10 }}>
      <Text>{exercise.name}</Text>
      <Text>Repetitions: {routine.repetitions}</Text>
      <Text>Rest: {routine.rest} seconds</Text>
      <Text>Weight: {routine.weight_lbs}</Text>
      {/* <Button onPress={_handleEditButtonClick}>
        <ButtonText> Edit </ButtonText>
      </Button>
      <Button onPress={onDeleteRoutine}>
        <ButtonText> Delete </ButtonText>
      </Button> */}
      <View style={styles.bottomContent}>
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={_handleEditButtonClick}
          >
            <Text style={{ color: "white" }}>Edit</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }}></View>
          <TouchableOpacity
            //Todo conditionally render buttons if this workout belongs to this user
            style={styles.deleteButton}
            onPress={onDeleteRoutine}
          >
            <Text style={{ color: "lightcoral" }}>Delete</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    display: 'flex',
    alignItems: "flex-end",
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
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
  container: {
    // Container styling if needed
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10, 
  },
  label: {
    marginRight: 10,
    width: 60, 
  },
  input: {
    flex: 1, // Take up remaining space
    height: 40,
    borderWidth: 1,
    padding: 10,
    // Input styling
  },
});

export default Routine;
