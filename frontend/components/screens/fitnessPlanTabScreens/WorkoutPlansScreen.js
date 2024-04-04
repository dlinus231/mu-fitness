import React, { lazy, useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  DeviceEventEmitter,
  Alert,
  RefreshControl,
} from "react-native";
import { LinkingContext, useFocusEffect } from "@react-navigation/native";

import { Text, View } from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistanceToNow } from "date-fns";
import FooterTab from "../../FooterTab";

const WorkoutPlansScreen = ({ route, navigation }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // TODO set this to be back to null when the user clicks back on individual workout plan page
  const [selectedWorkoutPlanId, setSelectedWorkoutPlanId] = useState(null);

  const workoutPlanIdFromRoute = route.params?.workout_id;

  useEffect(() => {
    if (workoutPlanIdFromRoute) {
      setSelectedWorkoutPlanId(workoutPlanIdFromRoute);
    }
  }, [workoutPlanIdFromRoute]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchWorkoutPlans();
    }, [])
  );

  const handleAddMoreButtonPress = async () => {
    navigation.navigate("CreateNewWorkoutPlan");
  };

  // const onLeaveWorkoutPlanPage = () => {
  //   navigation.navigate("FitnessPlans");
  //   setSelectedWorkoutPlanId(null);
  //   fetchWorkoutPlans();
  // };

  const renderWorkoutItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.workoutPlan}
        onPress={() =>
          navigation.navigate("IndividualWorkoutScreen", {
            workout_id: item.id,
          })
        }
      >
        <View style={styles.workoutMainContent}>
          <Text style={styles.workoutName}>{item.name}</Text>
        </View>

        <Text style={styles.workoutTime}>
          created{" "}
          {formatDistanceToNow(new Date(item.time_created), {
            addSuffix: true,
          })}
        </Text>
      </TouchableOpacity>
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await getFavoriteExercises();
    setRefreshing(false);
  };

  //Event listener for when new workout is created so that we update the list of workouts
  DeviceEventEmitter.addListener("createWorkoutEvent", () => {
    setCreated(true);
  });

  //Refetch workout plans when new one is created
  useEffect(() => {
    setLoading(true);
    fetchWorkoutPlans();
  }, [created]);

  // render the infinite scroll list unless the user has clicked a workout plan
  // then render individual page for that workout plan until they click back

  return (
    <>
      <SafeAreaView>
        {selectedWorkoutPlanId !== null ? (
          <></>
        ) : (
          <>
            <View style={styles.contentContainerHeader}>
              <TouchableOpacity style={{ width: 28 }}></TouchableOpacity>
              <Text style={styles.contentContainerText}>
                Your Workout Plans
              </Text>
              <TouchableOpacity
                style={styles.contentContainerButton}
                onPress={handleAddMoreButtonPress}
              >
                <MaterialIcons name="add-circle" size={28} color="#6A5ACD" />
              </TouchableOpacity>
            </View>
            {loading ? (
              <Text>Loading workouts...</Text>
            ) : workoutPlans.length > 0 ? (
              <FlatList
                data={workoutPlans}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderWorkoutItem}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            ) : (
              <View style={styles.container}>
                <Text style={styles.space}>
                  You currently have no workout plans.
                </Text>
                <Text style={styles.space}>
                  Workout plans are lists of exercises (sets) that you can
                  create and track your progress with.
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
      </SafeAreaView>
      <FooterTab focused={"FitnessPlans"}></FooterTab>
    </>
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
  contentContainerHeader: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: "4%",
    width: "100%",
  },
  contentContainerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  contentContainerButton: {
    marginTop: 3,
  },
  workoutName: {
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 23,
  },
  workoutMainContent: {},
  workoutDetail: {
    fontSize: 14,
  },
  workoutTime: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
  },
  workoutPlan: {
    backgroundColor: "#FFF",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginLeft: 16,
    marginRight: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  workoutName: {
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 23,
  },
});

export default WorkoutPlansScreen;
