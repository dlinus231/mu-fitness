import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Text, View } from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

import WorkoutPlan from "./workoutPlansScreenComponents/WorkoutPlan";
import IndividualWorkoutPlanScreen from "./workoutPlansScreenComponents/IndividualWorkoutPlanScreen";
import BackArrowIcon from "../../icons/BackArrowIcon";

const WorkoutPlansScreen = ({ navigation }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);

  // TODO set this to be back to null when the user clicks back on individual workout plan page
  const [selectedWorkoutPlanId, setSelectedWorkoutPlanId] = useState(null);

  const onEnterWorkoutPlanPage = (id) => {
    setSelectedWorkoutPlanId(id);
  };

  const onLeaveWorkoutPlanPage = () => {
    setSelectedWorkoutPlanId(null);
    fetchWorkoutPlans();
  };

  const renderItem = ({ item }) => {
    return (
      <WorkoutPlan
        title={item.name}
        id={item.id}
        onEnterWorkoutPlanPage={onEnterWorkoutPlanPage}
      />
    );
  };

  const fetchWorkoutPlans = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    try {
      const response = await axios.get(BACKEND_URL + `/workout/many/${userId}`);
      if (response.status == 200) {
        setWorkoutPlans(response.data);
      }
    } catch (error) {
      if (!error.response) {
        Alert.alert("Server issue", "Please try again later");
      } else {
        setWorkoutPlans([]);
        console.log(workoutPlans.length);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  // render the infinite scroll list unless the user has clicked a workout plan
  // then render individual page for that workout plan until they click back

  return (
    <SafeAreaView>
      {selectedWorkoutPlanId !== null ? (
        <IndividualWorkoutPlanScreen
          onLeaveWorkoutPlanPage={onLeaveWorkoutPlanPage}
          workout_id={selectedWorkoutPlanId}
          navigation={navigation}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon></BackArrowIcon>
          </TouchableOpacity>
          <Text>Your Workout Plans</Text>

          <TouchableOpacity
            style={styles.createNewWorkoutPlanButton}
            onPress={() => navigation.navigate("CreateNewWorkoutPlan")}
          >
            <MaterialIcons name="post-add" size={48} color="black" />
            <Text> Create new workout plan</Text>
          </TouchableOpacity>

          {
            //Todo: weird thing where when we have >4 plans the last one cant be scrolled to
          }
          {workoutPlans.length > 0 ? (
            <FlatList
              data={workoutPlans}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              onEndReached={() => {}} // TODO in the future this is where we would put logic to fetch more workout plans from the backend
              onEndReachedThreshold={0.3} // determines how close to end to call the onEndReached function, will probably adjust this later
            />
          ) : (
            <View style={styles.container}>
              <Text style={styles.space}>
                You currently have no workout plans.
              </Text>
              <Text style={styles.space}>
                Click the button to create your first one!
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createNewWorkoutPlanButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#CCCCCC",
    marginTop: 20,
  },
  space: {
    marginTop: 20,
  },
});

export default WorkoutPlansScreen;
