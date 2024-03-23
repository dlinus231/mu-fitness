import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";
import { View, VStack, Button, ButtonText, set } from "@gluestack-ui/themed";
import { MaterialIcons } from "react-native-vector-icons";
// import TopBarMenu from "../TopBarMenu";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { BACKEND_URL } from "@env";

const UserProfileScreen = ({ route, navigation, handleAuthChange }) => {
  // const handleSwitchPage = (page) => {
  //   navigation.navigate(page, { prevPage: "PersonalProfile" });
  // };

  const userIdFromRoute = route.params?.userId;

  const [userId, setUserId] = useState(userIdFromRoute); // id of user we want to display profile for (empty string means current user's profile)
  const [currentUserId, setCurrentUserId] = useState(""); // id of currently logged in user

  const [userData, setUserData] = useState(null);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  // if logged in user is looking at own profile, this has no effect (since userId is set to currentUserId)
  // if logged in user is looking at another user's profile, this will be set based on whether they follow them or not
  const [isFollowing, setIsFollowing] = useState(false);

  // when we access from a different user's profile, we need to set the userId state
  useEffect(() => {
    if (userIdFromRoute) {
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
      print("bm - checking if following")
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
    }
  }, [userId]);

  useEffect(() => {
    console.log("bm - setIsLoading useEffect reached");
    if (currentUserId !== "" && userData !== null && userId) {
      setIsLoading(false);
    }
  }, [userId, currentUserId, userData]);

  // calculate number of followers and following when userData is updated
  useEffect(() => {
    if (!userData) return;
    setFollowers(userData.followers.length);
    setFollowing(userData.following.length);
  }, [userData])

  // fetch dat associated with current user and populate the userData state
  const fetchUserData = async () => {
    try {
      // fetch user data
      const response = await axios.get(BACKEND_URL + `/user/${userId}`);
      setUserData(response.data);
      console.log("bm - set user data: ", response.data);
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
  }

  const handleFollow = async () => {
    console.log("bm - now inside handleFollow")
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
      console.log("bm - response from handleFollow: ", response.data);
      console.log("bm - about to set isFollowing to true");
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
      <TouchableOpacity style={styles.button} onPress={handleFollowUnfollow}>
        <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>
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
});

export default UserProfileScreen;
