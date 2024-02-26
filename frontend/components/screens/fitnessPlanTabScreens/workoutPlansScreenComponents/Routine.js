import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import axios from "axios";
import { Text, View, Button, ButtonText } from "@gluestack-ui/themed";
import { BACKEND_URL } from "@env";

const Routine = ({ routine, onDeleteRoutine }) => {
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
    const updatedRoutineData = {
      repetitions: reps,
      rest: rest,
      weight_lbs: weight,
    };

    setIsEditing(false);

    // TODO make a put request to update the routine
      // await the put request so that it saves the new routine before continuing

    console.log("updating routine", updatedRoutineData);
    await updateRoutine();
    console.log("bm - routine updated successfully")
    // TODO I don't think we have to fetch again, we can just update the state with the new routine
    // await fetchExercise();

    // update the state with the new routine
    setRepetitions(reps);
    setRest(rest);
    setWeight(weight);
  };

  const _renderEditingView = () => {
    return (
      <View style={{ marginTop: 15, backgroundColor: "lightgray", padding: 10 }}>
        <Text>Editing Routine</Text>
        <TextInput value={String(reps)} onChangeText={setRepetitions} keyboardType="numeric" />
        <TextInput value={String(rest)} onChangeText={setRest} keyboardType="numeric" />
        <TextInput value={String(weight)} onChangeText={setWeight} keyboardType="numeric" />
        <Button title="Save" onPress={_handleSave}/>
        <Button title="Cancel" onPress={_handleEditButtonClick}/>
      </View>
    );
  }

  return isEditing ? _renderEditingView : (
    <View style={{ marginTop: 15, backgroundColor: "lightgray", padding: 10 }}>
      <Text>{exercise.name}</Text>
      <Text>Repetitions: {routine.repetitions}</Text>
      <Text>Rest: {routine.rest} seconds</Text>
      <Text>Weight: {routine.weight_lbs}</Text>
      {/* <Button onPress={_handleEditButtonClick}>
        <ButtonText> Edit </ButtonText>
      </Button> */}
      <Button onPress={onDeleteRoutine}>
        <ButtonText> Delete </ButtonText>
      </Button>
    </View>
  );
};

export default Routine;
