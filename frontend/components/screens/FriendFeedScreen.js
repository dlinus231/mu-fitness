import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, FlatList, RefreshControl } from "@gluestack-ui/themed";
import TopBarMenu from "../TopBarMenu";

import axios from "axios";
import { BACKEND_URL } from "@env";
import { formatDistanceToNow } from "date-fns";

import AsyncStorage from "@react-native-async-storage/async-storage";

const FriendFeedScreen = ({ navigation }) => {
  const handleSwitchPage = (page) => {
    navigation.navigate(page, { prevPage: "FriendFeed" });
  };

  const [workouts, setWorkouts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // fetch workouts in initial load
  // in the future, we can grab other types of data (journal entries, favorited exercises?) and display them
  useEffect(() => {
    const getUserId = async () => {
      setCurrentUserId(await AsyncStorage.getItem("user_id"));
    };
    getUserId();
  }, []);

  // fetch friend workouts (after user id is fetched)
  useEffect(() => {
    if (currentUserId) {
      fetchFriendWorkouts();
    }
  }, [currentUserId]);

  const fetchFriendWorkouts = async () => {
    try {
      const response = await axios.get(BACKEND_URL + `/feed/workouts/${currentUserId}`);
      const parsedWorkouts = response.data.map((workout) => {
        return {
          type: "workout",
          id: workout.id,
          username: workout.user.username,
          name: workout.name,
          difficulty: workout.difficulty,
          description: workout.description,
          timeCreated: workout.time_created,
        }
      });
      console.log("bm - parsedWorkouts: ", parsedWorkouts)
      setWorkouts(parsedWorkouts);
    } catch (e) {
      console.log("error fetching friend workouts for friendFeed page: ", e);
    }
  };

  // function to render cells in flatlist
  const renderItem = ({ item }) => {
    // NOTE: we give each piece of data an item.type
      // if we want to add the ability for this page to show more than just workouts in the future
      // it will be as simple as adding another switch case here and adding the new data type to the data we fetch
    switch(item.type) {
      case "workout":
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("IndividualWorkoutScreen", { workout_id: item.id, workoutFrom: "FriendFeed" })}
          >
            <Text>{item.username} created a workout plan: {item.name}</Text>
            <Text>Difficulty: {item.difficulty}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Created: {formatDistanceToNow(new Date(item.timeCreated), { addSuffix: true })}</Text>
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


  return (
    <>
      <TopBarMenu onSwitchPage={handleSwitchPage} />
      <View style={styles.container}>
        <FlatList
          data={workouts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendFeedScreen;
