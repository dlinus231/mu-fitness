import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Text, FlatList, RefreshControl } from "react-native";
import { View, VStack, Button, ButtonText, set, Avatar } from "@gluestack-ui/themed";
import { formatDistanceToNow } from "date-fns";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import TopBarMenu from "../TopBarMenu";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { BACKEND_URL } from "@env";

const PersonalProfileScreen = ({ route, navigation, handleAuthChange }) => {
  const [userData, setUserData] = useState(null);

  const [activeTab, setActiveTab] = useState('workouts'); // 'workouts' or 'favoriteExercises'

  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [workouts, setWorkouts] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);

  // when userId is not null and has changed, we need to fetch the user's data
  useEffect(() => {
    fetchUserData();
  }, []);

  // calculate number of followers and following when userData is updated
  useEffect(() => {
    if (!userData) return;
    console.log("bm - userData coming back: ", userData)
    setFollowers(userData.followers.length);
    setFollowing(userData.following.length);

    // setWorkouts(userData.workouts);
    // setFavoriteExercises(userData.favoriteExercises);

    // TODO remove placeholder debugging code
    setWorkouts([])
    setFavoriteExercises([])
  }, [userData])

  // fetch dat associated with current user and populate the userData state
  const fetchUserData = async () => {
    try {
      // fetch user data
      const response = await axios.get(
        BACKEND_URL + `/user/${await AsyncStorage.getItem("user_id")}`
      );
      await setUserData(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log("bm - error fetching user data: ", e);
    }
  };

  const renderWorkoutItem = async ({item}) => {
    print("bm - item: ", item)
    return (
      <TouchableOpacity
        style={styles.workoutPlan}
        onPress={() => navigation.navigate("IndividualWorkoutScreen", { workout_id: item.id, workoutFrom: "PersonalProfile" })}
      >
        <View style={styles.workoutMainContent}>
          <Text style={styles.workoutName}>{item.name}</Text>
        </View>
        
        {/* <Text style={styles.workoutTime}>{formatDistanceToNow(new Date(item.timeCreated), { addSuffix: true })}</Text> */}

      </TouchableOpacity>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: "center" }]}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <MaterialIcons
          name="account-circle"
          size={95}
          color="#000" 
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{userData.username}</Text>
          <View style={styles.stats}>
            <TouchableOpacity
              onPress={() => navigation.navigate("followersList", { userId: userData.id })}
            >
              <Text style={styles.statText}>{followers} Followers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate("followingList", { userId: userData.id })}
            >
              <Text style={styles.statText}>{following} Following</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAuthChange}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => setActiveTab('workouts')}>
          <MaterialIcons
            name="fitness-center"
            size={30}
            color={activeTab === 'workouts' ? '#6A5ACD' : '#aaa'} //
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('favoriteExercises')}>
          <MaterialIcons
            name="favorite-border"
            size={30}
            color={activeTab === 'favoriteExercises' ? '#6A5ACD' : '#aaa'}
          />
        </TouchableOpacity>
      </View>

      {/* Placeholder for the content based on the active tab */}
      <View style={styles.contentContainer}>
        {(activeTab === 'workouts' && workouts.length > 0) && (
          <FlatList
            data={workouts}
            keyExtractor={item => item.id.toString()}
            renderItem={renderWorkoutItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )} 
        {(activeTab === 'favoriteExercises' && favoriteExercises.length > 0) && (
          <FlatList
            data={favoriteExercises}
            keyExtractor={item => item.id.toString()}
            renderItem={renderWorkoutItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
    alignItems: "left", // specifies where items are aligned horizontally
    padding: "6%",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center", 
  },
  userInfo: {
    flexDirection: 'column',
    marginLeft: '5%',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  stats: {
    flexDirection: 'col',
    marginTop: 5,
  },
  statText: {
    marginRight: 15,
    fontSize: 16,
  },
  avatar: {

  },
  buttonContainer: {
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  top_text: {
    textAlign: "center",
    paddingHorizontal: "3%",
    paddingBottom: "10%",
  },
  mid_text: {
    textAlign: "center",
    paddingHorizontal: "3%",
    paddingBottom: "3%",
  },
  button: {
    borderColor: "#6A5ACD",
    backgroundColor: "#6A5ACD",
    padding: 10,
    borderRadius: 5,
    width: '90%',
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%', // adjust later if needed
    alignSelf: 'center', // center icons horitzontally
  },
  contentContainer: {
    marginTop: 20,
  },
  workoutName: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 23,
  },
  workoutMainContent: {

  },
  workoutDetail: {
    fontSize: 14,
  },
  workoutTime: {
    fontSize: 12,
    color: '#666', 
    alignSelf: 'flex-end', 
  },
});

export default PersonalProfileScreen;
