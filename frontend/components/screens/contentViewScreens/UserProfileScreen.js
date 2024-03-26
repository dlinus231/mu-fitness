import React, { useState, useEffect, useCallback } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import { View, VStack, Button, ButtonText, set } from "@gluestack-ui/themed";
import { MaterialIcons } from "react-native-vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";

// import TopBarMenu from "../TopBarMenu";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { BACKEND_URL } from "@env";

const UserProfileScreen = ({ route, navigation }) => {
  const userIdFromRoute = route.params?.userId;

  console.log("bm - userIdFromRoute: ", userIdFromRoute);

  const [userId, setUserId] = useState(userIdFromRoute); // id of user we want to display profile for (empty string means current user's profile)
  const [currentUserId, setCurrentUserId] = useState(""); // id of currently logged in user

  const [userData, setUserData] = useState(null);

  const [activeTab, setActiveTab] = useState('workouts'); // 'workouts' or 'favoriteExercises'

  const [refreshing, setRefreshing] = useState(false);

  const [workouts, setWorkouts] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  // if logged in user is looking at own profile, this has no effect (since userId is set to currentUserId)
  // if logged in user is looking at another user's profile, this will be set based on whether they follow them or not
  const [isFollowing, setIsFollowing] = useState(false);

  // when we access from a different user's profile, we need to set the userId state
  useEffect(() => {
    if (userIdFromRoute) {
      console.log("bm - setting userId to: ", userIdFromRoute)
      setUserId(userIdFromRoute);
    }
  }, [userIdFromRoute]);

  // fetch currently logged in user on iniital load
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const uId = await AsyncStorage.getItem("user_id");
        if (uId !== null) {
          setCurrentUserId(parseInt(uId));
        }

        // if userId is not set, we should just set it to the current user
        if (userId === "") {
          setUserId(uId);
        }

      } catch (e) {
        console.log("bm - error getting user id: ", e);
      }
    };
    getCurrentUserId();
  }, []);

  // check if the current user is following the user whose profile we are viewing
  useEffect(() => {
    if (currentUserId === "" || userId === "") return;
    const checkIfFollowing = async () => {
      try {
        const response = await axios.get(
          BACKEND_URL + `/user/follows/${currentUserId}/${userId}`
        );
        console.log("bm - response from isFollowing: ", response.data);
        setIsFollowing(response.data.follows);
      } catch (e) {
        console.log("bm - error checking if following: ", e);
      }
    };
    checkIfFollowing();
  }, [currentUserId, userId]);

  // when userId is not null and has changed, we need to fetch the user's data
  useEffect(() => {
    console.log("bm - fetching user data useEffect reached");
    if (userId) {
      // fetch user data
      fetchUserData();
      getFavoriteExercises();
    }
  }, [userId]);

  // if userId is populated, then we should be re-fetching data every time the page is navigated to
  // TODO: I think this is causing an error by running before the userId has been updated
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserData();
        getFavoriteExercises();
      }
    }, [userId])
  )

  useEffect(() => {
    // console.log("bm - setIsLoading useEffect reached");
    if (currentUserId !== "" && userData !== null && userId) {
      setIsLoading(false);
    }
  }, [userId, currentUserId, userData]);

  // calculate number of followers and following when userData is updated
  useEffect(() => {
    if (!userData) return;
    setFollowers(userData.followers.length);
    setFollowing(userData.following.length);

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

  const getFavoriteExercises = async () => {
    try {
      const response = await axios.get(BACKEND_URL + `/exercises/saved/${userId}`);
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
      const response = await axios.get(BACKEND_URL + `/user/${userId}`);
      setUserData(response.data);
      // console.log("bm - set user data: ", response.data);
    } catch (e) {
      console.log("bm - error fetching user data: ", e);
    }
  };

  const handleFollowUnfollow = async () => {
    if (isFollowing) {
      await handleUnfollow();
    } else {
      await handleFollow();
    }
    fetchUserData();
    getFavoriteExercises();
  }

  const handleFollow = async () => {
    const curUserId = await AsyncStorage.getItem("user_id");
    if (parseInt(userId) === parseInt(curUserId)) {
      Alert.alert("You can't follow yourself dum dum");
      return;
    }
    try {
      const response = await axios.post(
        BACKEND_URL + `/user/follow/${userId}`,
        {
          userId: parseInt(currentUserId),
        }
      );
      // console.log("bm - response from handleFollow: ", response.data);
      // console.log("bm - about to set isFollowing to true");
      setIsFollowing(true);
    } catch (e) {
      console.log("bm - error following user: ", e);
    }
  };

  const handleUnfollow = async () => {
    console.log("bm - handleUnfollow reached");
    console.log("bm - currentUserId: ", currentUserId);
    try {
      const response = await axios.post(
        BACKEND_URL + `/user/unfollow/${userId}`,
        {
          userId: parseInt(currentUserId),
        }
      );
      console.log("bm - response from handleUnfollow: ", response.data);
      console.log("bm - about to set isFollowing to false")
      // now need to update the isFollowing state
      setIsFollowing(false);
    } catch (e) {
      console.log("bm - error unfollowing user: ", e);
    }
  };

  const renderWorkoutItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.workoutPlan}
        onPress={() => navigation.navigate("IndividualWorkoutScreen", { workout_id: item.id, workoutFrom: "UserProfile" })}
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
      exerciseFrom: "UserProfile",
    });
  };

  // silly guy image lol
  const image = require("../../../assets/Man-Doing-Air-Squats-A-Bodyweight-Exercise-for-Legs.png");

  const renderExerciseItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.workoutPlan}
        onPress={() => {
          goToExercise(item.id);
        }}
      >
        <View style={styles.workoutMainContent}>
          <Text style={styles.workoutName}>{item.name.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</Text>
        </View>
        
        <Text style={styles.workoutTime}>favorited {formatDistanceToNow(new Date(item.timeCreated), { addSuffix: true })}</Text>

      </TouchableOpacity>
    );
    // return (
    //   <TouchableOpacity
    //     key={item.id}
    //     style={styles.exerciseContainer}
    //     onPress={() => {
    //       goToExercise(item.id);
    //     }}
    //   >
    //     <Image source={image} style={styles.exerciseImage} />
    //     <Text
    //       style={styles.exerciseName}
    //       numberOfLines={1}
    //       ellipsizeMode="tail"
    //     >
    //       {item.name
    //         .split(" ")
    //         .map(
    //           (word) => word.charAt(0).toUpperCase() + word.slice(1)
    //         )
    //         .join(" ")}
    //     </Text>
    //   </TouchableOpacity>
    // )
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await getFavoriteExercises();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
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
              onPress={() => navigation.navigate("followersList", { userId: userData.id, navigatingFrom: "UserProfile"})}
            >
              <Text style={styles.statText}>{followers} Followers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate("followingList", { userId: userData.id, navigatingFrom: "UserProfile"})}
            >
              <Text style={styles.statText}>{following} Following</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
      <View style={styles.buttonsAndIconsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleFollowUnfollow}>
          <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
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
            name="star-border"
            size={30}
            color={activeTab === 'favoriteExercises' ? '#6A5ACD' : '#aaa'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainerHeader}>
        <Text style={styles.contentContainerText}>{(activeTab === 'workouts') ? "Workout Plans" : "Favorite Exercises"}</Text>
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
    paddingTop: "6%",
    paddingHorizontal: "6%",
    paddingBottom: "5%"
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

export default UserProfileScreen;
