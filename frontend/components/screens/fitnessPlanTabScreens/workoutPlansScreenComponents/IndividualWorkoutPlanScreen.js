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
  const [edited, setEdited] = useState(false);

  DeviceEventEmitter.addListener("editWorkoutEvent", (eventData) => {
    setEdited(true);
  });

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        BACKEND_URL + `/workout/one/${workout_id}`
      );
      setWorkout(result.data);
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

  useEffect(() => {
    setLoading(true);
    fetchWorkout();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchWorkout();
  }, [edited]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
              <Text>Description:</Text>
              <Text>{workout.description}</Text>
            </View>
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});
export default IndividualWorkoutPlanScreen;
