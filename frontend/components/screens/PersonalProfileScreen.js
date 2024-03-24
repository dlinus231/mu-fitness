import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Text, FlatList, RefreshControl, Image } from "react-native";
import { View, VStack, Button, ButtonText, set, Avatar } from "@gluestack-ui/themed";
import { formatDistanceToNow } from "date-fns";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import TopBarMenu from "../TopBarMenu";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { BACKEND_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

const PersonalProfileScreen = ({ route, navigation, handleAuthChange }) => {
  const [userData, setUserData] = useState(null); // note: workouts are included in userData

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

  // fetch the user data each time the page is navigated back to
  useFocusEffect(
    useCallback(() => {
      if (!userData) return;
      fetchUserData();
      getFavoriteExercises();
    }, [])
  )

  // calculate number of followers and following when userData is updated
  useEffect(() => {
    if (!userData) return;
    setFollowers(userData.followers.length);
    setFollowing(userData.following.length);

    // setWorkouts(userData.workouts);
    // setFavoriteExercises(userData.favoriteExercises);

    const parsedWorkouts = userData.workouts.map((workout) => {
      return {
        id: workout.id,
        name: workout.name,
        timeCreated: workout.time_created,
      }
    })
    setWorkouts(parsedWorkouts);

    getFavoriteExercises();
  }, [userData])

  // useEffect(() => {
  //   console.log("bm - workouts State: ", workouts)
  // }, [workouts])

  const getFavoriteExercises = async () => {
    try {
      const response = await axios.get(BACKEND_URL + `/exercises/saved/${userData.id}`);
      const parsedExercises = response.data.map((exercise) => {
        return {
          id: exercise.id,
          name: exercise.name,
          timeCreated: exercise.saved,
        }
      })
      // console.log("bm - setting favorite exercises to: ", parsedExercises)
      setFavoriteExercises(parsedExercises);
    } catch (e) {
      console.log("bm - error fetching favorite exercises: ", e);
    }
  }

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

  const renderWorkoutItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.workoutPlan}
        onPress={() => navigation.navigate("IndividualWorkoutScreen", { workout_id: item.id, workoutFrom: "PersonalProfile" })}
      >
        <View style={styles.workoutMainContent}>
          <Text style={styles.workoutName}>{item.name}</Text>
        </View>
        
        <Text style={styles.workoutTime}>created {formatDistanceToNow(new Date(item.timeCreated), { addSuffix: true })}</Text>

      </TouchableOpacity>
    );
  }

  const goToExercise = async (id) => {
    const response = await axios.get(BACKEND_URL + `/exercises/one/${id}`);
    navigation.navigate("ExerciseScreen", {
      exerciseData: response.data,
      prevPage: null,
      exerciseFrom: "PersonalProfile",
    });
  };

  // silly guy image lol
  const image = require("../../assets/Man-Doing-Air-Squats-A-Bodyweight-Exercise-for-Legs.png");

  const renderExerciseItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.exerciseContainer}
        onPress={() => {
          goToExercise(item.id);
        }}
      >
        <Image source={image} style={styles.exerciseImage} />
        <Text
          style={styles.exerciseName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name
            .split(" ")
            .map(
              (word) => word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ")}
        </Text>
      </TouchableOpacity>
    )
  }

  const handleAddMoreButtonPress = async () => {
    if (activeTab === 'workouts') {
      navigation.navigate("CreateNewWorkoutPlan", { prevPage: "PersonalProfile" });
    } 
    if (activeTab === 'favoriteExercises'){
      navigation.navigate("search", { prevPage: "PersonalProfile" });
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await getFavoriteExercises();
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
      <View style={styles.buttonsAndIconsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAuthChange}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => setActiveTab('workouts')}>
          <MaterialIcons
            name="fitness-center"
            size={30}
            color={activeTab === 'workouts' ? '#6A5ACD' : '#aaa'} //
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => setActiveTab('favoriteExercises')}>
          <MaterialIcons
            name="favorite-border"
            size={30}
            color={activeTab === 'favoriteExercises' ? '#6A5ACD' : '#aaa'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainerHeader}>
        <Text style={styles.contentContainerText}>{(activeTab === 'workouts') ? "Workout Plans" : "Saved Exercises"}</Text>
        <TouchableOpacity style={styles.contentContainerButton} onPress={handleAddMoreButtonPress}>
          <MaterialIcons name="add-circle" size={32} color="#6A5ACD" />
        </TouchableOpacity>
      </View>

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
            renderItem={renderExerciseItem}
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
  contentContainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 0, 
  },
  contentContainerText: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1, 
  },
  contentContainerButton: {
    marginTop: 3,
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
    width: '60%',
    marginTop: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginTop: 10,
  },
  divider: {
    height: 1, 
    backgroundColor: '#D3D3D3',
    width: '100%',
    marginTop: 20, 
    marginBottom: 10,
  },
  buttonsAndIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignSelf: 'center', // center icons horitzontally
  },
  contentContainer: {
    marginTop: 5,
    marginBottom: '60%' // contols how close to the footerNavigator that the content (FlatLists) is
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
  workoutPlan: {
    backgroundColor: '#FFF',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginLeft: 16,
    marginRight: 20,
    borderRadius: 10,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 23,
  },
  exerciseContainer: {
    marginBottom: 16,
  },
  exerciseImage: {
    width: 300,
    height: 175,
    borderRadius: 10,
    marginLeft: '2%', // controls where the image is horizontally (how close to either side of screen)
  },
  exerciseName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PersonalProfileScreen;
