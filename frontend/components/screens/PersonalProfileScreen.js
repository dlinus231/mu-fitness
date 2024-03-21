import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, SafeAreaView, Text } from "react-native";
import { View, VStack, Button, ButtonText, set } from "@gluestack-ui/themed";
// import TopBarMenu from "../TopBarMenu";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { BACKEND_URL } from "@env";

const PersonalProfileScreen = ({ route, navigation, handleAuthChange }) => {
  const [userData, setUserData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // when userId is not null and has changed, we need to fetch the user's data
  useEffect(() => {
    fetchUserData();
  }, []);

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

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: "center" }]}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* <TopBarMenu onSwitchPage={handleSwitchPage} /> */}
      <SafeAreaView style={styles.container}>
        <Text style={styles.top_text}>Welcome to your personal profile!</Text>
        <Text style={styles.mid_text}> Username: {userData.username}</Text>
        <Text style={styles.mid_text}> UserId: {userData.id}</Text>
        <Text style={styles.mid_text}> Email: {userData.email}</Text>

        <VStack space="md" style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("journal")}
          >
            <Text style={styles.text}>Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("followingList", { userId: userData.id })
            }
          >
            <Text style={styles.text}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("followersList", { userId: userData.id })
            }
          >
            <Text style={styles.text}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAuthChange}>
            <Text style={styles.text}>Sign Out</Text>
          </TouchableOpacity>
        </VStack>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
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
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PersonalProfileScreen;
