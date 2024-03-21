import React, { lazy, useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  DeviceEventEmitter,
  Alert,
} from "react-native";
import { Text, View } from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

import WorkoutPlan from "./workoutPlansScreenComponents/WorkoutPlan";
import IndividualWorkoutPlanScreen from "./workoutPlansScreenComponents/IndividualWorkoutPlanScreen";
// import BackArrowIcon from "../../icons/BackArrowIcon";
import TopBarMenu from "../../TopBarMenu";

const WorkoutPlansScreen = ({ navigation }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setWorkoutPlans(
          response.data.sort((a, b) => {
            //Sort by recent
            const dateA = new Date(a.time_created);
            const dateB = new Date(b.time_created);
            return dateB - dateA;
          })
        );
        setLoading(false);
      }
    } catch (error) {
      if (!error.response) {
        Alert.alert("Server issue", "Please try again later");
      } else {
        setWorkoutPlans([]);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchWorkoutPlans();
  }, []);

  //Event listener for when new workout is created so that we update the list of workouts
  DeviceEventEmitter.addListener("createWorkoutEvent", () => {
    setCreated(true);
  });

  //Refetch workout plans when new one is created
  useEffect(() => {
    setLoading(true);
    fetchWorkoutPlans();
  }, [created]);

  const handleSwitchPage = (page) => {
    navigation.navigate(page, { prevPage: "FitnessPlans" });
  };

  // render the infinite scroll list unless the user has clicked a workout plan
  // then render individual page for that workout plan until they click back

  return (
    <View>
      {selectedWorkoutPlanId !== null ? (
        <IndividualWorkoutPlanScreen
          onLeaveWorkoutPlanPage={onLeaveWorkoutPlanPage}
          workout_id={selectedWorkoutPlanId}
          navigation={navigation}
        />
      ) : (
        <>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon></BackArrowIcon>
          </TouchableOpacity> */}
          <TopBarMenu onSwitchPage={handleSwitchPage} />
          <Text style={styles.text}>Your Workout Plans</Text>

          <TouchableOpacity
            style={styles.createNewWorkoutPlanButton}
            onPress={() => {
              setCreated(false);
              navigation.navigate("CreateNewWorkoutPlan");
            }}
          >
            <MaterialIcons name="post-add" size={48} color="black" />
            <Text> Create new workout plan</Text>
          </TouchableOpacity>
          {loading ? (
            <Text>Loading workouts...</Text>
          ) : workoutPlans.length > 0 ? (
            <FlatList
              style={styles.flatlist}
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
                Workout plans are lists of exercises (sets) that you can create
                and track your progress with.
              </Text>
              <Text style={styles.space}>
                You can also share your workout plans with others, or use
                workout plans that others have shared with you.
              </Text>
              <Text style={styles.space}>
                Click the button to create your first one!
              </Text>
            </View>
          )}
        </>
      )}
    </View>
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
    paddingHorizontal: "10%",
    textAlign: "center",
  },
  flatlist: {
    maxHeight: 550, //Todo - make responsive for diff screen sizes
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default WorkoutPlansScreen;
