import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import axios from "axios";
import { Text, View } from "@gluestack-ui/themed";
import { BACKEND_URL } from "@env";

const Routine = ({ routine }) => {
  const [exercise, setExercise] = useState("");

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

  useEffect(() => {
    fetchExercise();
  }, []);

  return (
    <View style={{ marginTop: 15, backgroundColor: "lightgray", padding: 10 }}>
      <Text>{exercise.name}</Text>
      <Text>Repetitions: {routine.repetitions}</Text>
      <Text>Rest: {routine.rest} seconds</Text>
      <Text>Weight: {routine.weight_lbs}</Text>
    </View>
  );
};

export default Routine;
