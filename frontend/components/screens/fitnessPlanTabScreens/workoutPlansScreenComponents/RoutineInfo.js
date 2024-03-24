import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { BACKEND_URL } from "@env";
import axios from "axios";

const RoutineInfo = ({
  setShowRoutineInfo,
  routineInfoId,
  fetchWorkout,
  isOwnedByCurrentUser,
}) => {
  const [sets, setSets] = useState([]);

  const fetchRoutineInfo = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + `/workout/routine/${routineInfoId}`
      );
      setSets(response.data.sets);
    } catch (error) {
      Alert.alert("Error fetching exercise info", "Please try again later");
      console.error(error);
    }
  };

  const handleDeleteRoutine = async () => {
    try {
      const response = await axios.delete(
        BACKEND_URL + `/workout/routine/delete/${routineInfoId}`
      );
      fetchWorkout();
      setShowRoutineInfo(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error deleting exercise", "Please try again later");
    }
  };

  useEffect(() => {
    fetchRoutineInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Routine Info</Text>
        <FlatList
          data={sets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <Text>
                Set {index + 1}: {item.repetitions} x {item.weight_lbs}lbs
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {isOwnedByCurrentUser && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            // onPress={handleEditWorkout}
          >
            <Text style={{ color: "black" }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteRoutine}
          >
            <Text style={{ color: "#FF0000" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setShowRoutineInfo(false);
        }}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginBottom: 8,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: "20%",
    marginVertical: "5%",
    backgroundColor: "white",
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: "#FF0000",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  editButton: {
    borderWidth: 2,
    borderColor: "#90EE90",
    borderRadius: 10,
    backgroundColor: "#90EE90",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
});

export default RoutineInfo;
