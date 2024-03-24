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

import SetInfo from "./SetInfo";

const RoutineInfo = ({
  setShowRoutineInfo,
  routineInfoId,
  fetchWorkout,
  isOwnedByCurrentUser,
}) => {
  const [sets, setSets] = useState([]);
  const [editing, setEditing] = useState(false);

  const fetchRoutineInfo = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + `/workout/routine/${routineInfoId}`
      );
      const setData = response.data.sets.sort(
        (a, b) => a.set_order - b.set_order
      );
      setSets(setData);
    } catch (error) {
      Alert.alert("Error fetching exercise info", "Please try again later");
      console.error(error);
    }
  };

  const handleAddSet = async () => {
    try {
      const response = await axios.post(
        BACKEND_URL + `/workout/routine/addSet`,
        {
          routine_id: routineInfoId,
        }
      );
      fetchRoutineInfo();
    } catch (error) {
      console.error(error);
      Alert.alert("Issue creating new set", "Please try again later");
    }
  };

  const handleRemoveSet = async (id) => {
    try {
      const response = await axios.delete(
        BACKEND_URL + `/workout/routine/deleteSet/${id}`
      );
      fetchRoutineInfo();
    } catch (error) {
      console.error(error);
      Alert.alert("Issue deleting set from exericse", "Please try again later");
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

  const renderSet = (item) => {
    return (
      <SetInfo
        item={item}
        handleRemoveSet={handleRemoveSet}
        editing={editing}
        fetchRoutineInfo={fetchRoutineInfo}
      ></SetInfo>
    );
  };

  useEffect(() => {
    fetchRoutineInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Exercise Info</Text>
        <FlatList
          data={sets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderSet(item)}
        />
        {editing && (
          <>
            <TouchableOpacity
              style={styles.addNewButton}
              onPress={handleAddSet}
            >
              <Text style={styles.addNewText}>Create New Set</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.transparentButton}
              onPress={() => {
                setEditing(false);
              }}
            >
              <Text style={styles.transparentButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {isOwnedByCurrentUser && !editing && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setEditing(true);
            }}
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
      {!editing && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setShowRoutineInfo(false);
          }}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addNewButton: {
    padding: 16,
    backgroundColor: "#6A5ACD",
    marginTop: 10,
    borderRadius: 10,
  },
  addNewText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
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
    paddingVertical: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginBottom: 8,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 50,
  },
  closeButton: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#6A5ACD",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: "20%",
    marginBottom: "5%",
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
  setButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
  transparentButton: {
    padding: 16,
    borderColor: "#000",
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  transparentButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RoutineInfo;
