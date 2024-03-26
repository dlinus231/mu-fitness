import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Text, View, Button, ButtonText } from "@gluestack-ui/themed";
import { BACKEND_URL } from "@env";
import { MaterialIcons } from "@expo/vector-icons";

const Routine = ({
  routine,
  onDeleteRoutine,
  onUpdateRoutine,
  isOwnedByCurrentUser,
  setShowRoutineInfo,
  setRoutineInfoId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [exercise, setExercise] = useState("");

  const [reps, setRepetitions] = useState(routine.repetitions);
  const [rest, setRest] = useState(routine.rest);
  const [weight, setWeight] = useState(routine.weight_lbs);

  const [loading, setLoading] = useState(true);

  const fetchExercise = async () => {
    try {
      const result = await axios.get(
        BACKEND_URL + `/exercises/one/${routine.exercise_id}`
      );
      await setExercise(result.data);
      setLoading(false);
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
    const updatedRoutineData = {
      repetitions: reps,
      rest: rest,
      weight_lbs: weight,
    };

    setIsEditing(false);

    // TODO make a put request to update the routine
    // await the put request so that it saves the new routine before continuing

    await onUpdateRoutine(routine.id, updatedRoutineData);
  };

  const _renderEditingView = () => {
    return (
      <View
        style={{ marginTop: 15, backgroundColor: "lightgray", padding: 10 }}
      >
        <Text>Editing</Text>
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
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return isEditing ? (
    _renderEditingView()
  ) : (
    <View style={styles.container}>
      <Text>
        {exercise.name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setRoutineInfoId(routine.id);
          setShowRoutineInfo(true);
        }}
      >
        <MaterialIcons name="info-outline" size={24} color="grey" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    display: "flex",
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
    marginTop: 15,
    backgroundColor: "#ebe7f7",
    padding: 15,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  viewInfo: {
    lineHeight: 16,
  },
});

export default Routine;
