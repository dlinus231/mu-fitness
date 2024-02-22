import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Text, View } from "@gluestack-ui/themed";
import { Octicons } from "@expo/vector-icons";
import { BACKEND_URL } from "@env";
import BackArrowIcon from "../../../icons/BackArrowIcon";

const IndividualWorkoutPlanScreen = ({
  navigation,
  onLeaveWorkoutPlanPage,
  workout_id,
}) => {
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState({});

  const fetchWorkout = async () => {
    try {
      const result = await axios.get(
        BACKEND_URL + `/workout/one/${workout_id}`
      );
      setWorkout(result.data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchWorkout();
  }, []);
  // TODO once backend is implemented we will fetch additional data about the workout plan from the backend

  return loading ? (
    <Text>Loading...</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.chevron} onPress={onLeaveWorkoutPlanPage}>
        <BackArrowIcon></BackArrowIcon>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text>{workout.name}</Text>
        <Text>Difficulty: {workout.difficulty}</Text>
        <Text>{workout.description}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "3%",
  },
  chevron: {
    paddingTop: "3%",
    paddingBottom: "2%",
  },
});
export default IndividualWorkoutPlanScreen;
