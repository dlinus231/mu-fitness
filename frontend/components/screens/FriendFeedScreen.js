import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Text, View, FlatList, RefreshControl } from "@gluestack-ui/themed";
import TopBarMenu from "../TopBarMenu";

import axios from "axios";
import { BACKEND_URL } from "@env";
import { formatDistanceToNow, set } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterTab from "../FooterTab";

const FriendFeedScreen = ({ navigation }) => {
  const handleSwitchPage = (page) => {
    navigation.navigate(page, { prevPage: "FriendFeed" });
  };

  const [workouts, setWorkouts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch workouts in initial load
  // in the future, we can grab other types of data (journal entries, favorited exercises?) and display them
  useEffect(() => {
    const getUserId = async () => {
      setCurrentUserId(await AsyncStorage.getItem("user_id"));
    };
    getUserId();
  }, []);

  // fetch workouts when page is navigated to
  useFocusEffect(
    useCallback(() => {
      console.log("bm - in useFocusEffect useCallback");
      if (currentUserId) {
        console.log("bm - in useFocusEffect currentUserId: ", currentUserId);
        fetchFriendWorkouts();
      }
    }, [])
  );

  // fetch workouts when page is navigated to
  useFocusEffect(
    useCallback(() => {
      console.log("bm - in useFocusEffect useCallback")
      if (currentUserId) {
        console.log("bm - in useFocusEffect currentUserId: ", currentUserId)
        fetchFriendWorkouts();
      }
    }, [currentUserId])
  )

  // fetch friend workouts (after user id is fetched)
  useEffect(() => {
    console.log("bm - in currentUserId useEffect");
    if (currentUserId) {
      console.log("in currentUserId useEffect if statement withcurrentUserId: ", currentUserId)
      fetchFriendWorkouts();
    }
  }, [currentUserId]);

  const fetchFriendWorkouts = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + `/feed/workouts/${currentUserId}`
      );
      const parsedWorkouts = response.data.map((workout) => {
        return {
          type: "workout",
          id: workout.id,
          username: workout.user.username,
          name: workout.name,
          difficulty: workout.difficulty,
          description: workout.description,
          timeCreated: workout.time_created,
        };
      });
      // console.log("bm - parsedWorkouts: ", parsedWorkouts)
      setWorkouts(parsedWorkouts);
      setLoading(false);
    } catch (e) {
      console.log("error fetching friend workouts for friendFeed page: ", e);
    }
  };

  // function to render cells in flatlist
  const renderItem = ({ item }) => {
    // NOTE: we give each piece of data an item.type
    // if we want to add the ability for this page to show more than just workouts in the future
    // it will be as simple as adding another switch case here and adding the new data type to the data we fetch
    switch (item.type) {
      case "workout":
        return (
          <TouchableOpacity
            style={styles.workoutPlan}
            onPress={() =>
              navigation.navigate("IndividualWorkoutScreen", {
                workout_id: item.id,
                workoutFrom: "FriendFeed",
              })
            }
          >
            <View style={styles.workoutMainContent}>
              <Text>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.workoutDescription}>
                  {" "}
                  created a new workout plan
                </Text>
              </Text>
              <Text style={styles.workoutName}>{item.name}</Text>
            </View>

            <Text style={styles.workoutTime}>
              {formatDistanceToNow(new Date(item.timeCreated), {
                addSuffix: true,
              })}
            </Text>
          </TouchableOpacity>
        );
      default:
        return (
          <View>
            <Text>{item.title}</Text>
          </View>
        );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriendWorkouts();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!loading && workouts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <MaterialCommunityIcons
          name="weight-lifter"
          size={48}
          color={"black"}
        />
        <Text style={styles.welcomeText}>Welcome to your Feed!</Text>
        <Text style={styles.subWelcomeText}>
          {" "}
          Workout plans created by accounts that you follow will be displayed
          here
        </Text>
        <FooterTab focused="FriendFeed"></FooterTab>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* <TopBarMenu onSwitchPage={handleSwitchPage} /> */}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
      <FooterTab focused="FriendFeed"></FooterTab>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "17%",
  },
  workoutPlan: {
    backgroundColor: "#FFF",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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
  workoutMainContent: {},
  workoutDetail: {
    fontSize: 14,
  },
  workoutTime: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
  },
  username: {
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  subWelcomeText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});

export default FriendFeedScreen;
