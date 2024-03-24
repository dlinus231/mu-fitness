import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { BACKEND_URL } from "@env";
import axios from "axios";

const SetEditor = ({ setId, setEditingSet, fetchRoutineInfo }) => {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSet = async () => {
    try {
      const result = await axios.get(
        BACKEND_URL + `/workout/routine/set/${setId}`
      );
      setReps(result.data.repetitions);
      setWeight(result.data.weight_lbs);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Unknown error encountered", "Please try again later");
    }
  };

  const handleUpdateSet = async () => {
    try {
      const response = await axios.post(
        BACKEND_URL + `/workout/routine/set/update`,
        {
          set_id: setId,
          repetitions: reps,
          weight_lbs: weight,
        }
      );
      setEditingSet(false);
      fetchRoutineInfo();
    } catch (error) {
      console.error(error);
      Alert.alert("Error updating set info", "Please try again later");
    }
  };

  useEffect(() => {
    fetchSet();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Button
              title="-"
              onPress={() => {
                setReps(Math.max(0, parseInt(reps) - 1));
              }}
            />
            <TextInput
              placeholder="Reps"
              style={styles.input}
              value={reps.toString()}
              onChangeText={setReps}
              inputMode="numeric"
              keyboardType="numeric"
            />
            <Button
              title="+"
              onPress={() => {
                setReps(parseInt(reps) + 1);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Button
              title="-"
              onPress={() => {
                setWeight(Math.max(0, parseInt(weight) - 1));
              }}
            />
            <TextInput
              placeholder="Weight"
              style={styles.input}
              value={weight.toString()}
              onChange={setWeight}
              inputMode="numeric"
              keyboardType="numeric"
            />
            <Button
              title="+"
              onPress={() => {
                setWeight(parseInt(weight) + 1);
              }}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleUpdateSet} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginHorizontal: "2.5%",
    width: "45%",
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginHorizontal: 8,
    width: "60%",
  },
});

export default SetEditor;
