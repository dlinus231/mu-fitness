import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import TopBarMenu from "../TopBarMenu";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getYoutubeMeta } from "react-native-youtube-iframe";
import FooterTab from "../FooterTab";

const SavedExercisesScreen = ({ navigation }) => {
  const placeHolderImage = require("../../assets/Man-Doing-Air-Squats-A-Bodyweight-Exercise-for-Legs.png");

  const [loading, setLoading] = useState(true);
  const [savedExercises, setSavedExercises] = useState([]);
  const [thumbnails, setThumbnails] = useState({});

  const fetchThumbnails = async (data) => {
    const thumbnailData = {};
    for (const item of data) {
      if (!item.video_path) continue;
      try {
        const meta = await getYoutubeMeta(item.video_path);
        thumbnailData[item.id] = meta.thumbnail_url;
      } catch (error) {
        console.error("Error fetching YouTube meta:", error);
      }
    }
    setThumbnails(thumbnailData);
  };

  const loadSavedExercises = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL +
          `/exercises/saved/${await AsyncStorage.getItem("user_id")}`
      );
      setSavedExercises(response.data);
      setLoading(false);
      fetchThumbnails(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchPage = (page) => {
    navigation.navigate(page, { prevPage: "SavedExercises" });
  };

  const handlePress = async (id) => {
    const response = await axios.get(BACKEND_URL + `/exercises/one/${id}`);
    navigation.navigate("ExerciseScreen", {
      exerciseData: response.data,
      prevPage: null,
      exerciseFrom: "SavedExercises",
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedExercises();
    }, [])
  );

  return (
    <SafeAreaView style={{ minHeight: "100%" }}>
      {loading ? (
        <Text>Loading... </Text>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {savedExercises.length === 0 ? (
            <Text style={styles.placeholder}>
              You have not saved any exercises yet. Click the star icon when you
              search for an exercise to save it.
            </Text>
          ) : (
            <ScrollView>
              {savedExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseContainer}
                  onPress={() => {
                    handlePress(exercise.id);
                  }}
                >
                  <Image
                    source={
                      thumbnails[exercise.id]
                        ? { uri: thumbnails[exercise.id] }
                        : placeHolderImage
                    }
                    style={styles.exerciseImage}
                  />
                  <Text
                    style={styles.exerciseName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {exercise.name
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </ScrollView>
      )}

      <FooterTab focused={"SavedExercises"}></FooterTab>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 100,
    minHeight: "90%",
  },
  exerciseContainer: {
    marginBottom: 16,
  },
  exerciseImage: {
    width: 300,
    height: 175,
    borderRadius: 10,
  },
  exerciseName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  placeholder: {
    marginTop: "60%",
    fontSize: 18,
    paddingHorizontal: 30,
    textAlign: "center",
    lineHeight: 30,
  },
});

export default SavedExercisesScreen;
