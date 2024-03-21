import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import axios from "axios";
import { BACKEND_URL } from "@env";
import YoutubePlayer from "react-native-youtube-iframe";
import { useIsFocused, CommonActions } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackArrowIcon from "../../icons/BackArrowIcon";

const ExerciseScreen = ({ route, navigation }) => {
  const [exerciseData, setExerciseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const exercise_id = route.params?.exercise_id;
  const isFocused = useIsFocused();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const fetchExerciseData = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + `/exercises/one/${exercise_id}`
      );

      await setExerciseData(response.data);
      const savedResponse = await axios.get(
        BACKEND_URL +
          `/exercises/saved/${await AsyncStorage.getItem("user_id")}/${
            exerciseData.id
          }`
      );
      setSaved(savedResponse.data.saved);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      if (!saved) {
        const response = await axios.post(BACKEND_URL + `/exercises/save`, {
          userId: await AsyncStorage.getItem("user_id"),
          exerciseId: exerciseData.id,
        });
      } else {
        const response = await axios.post(BACKEND_URL + `/exercises/unsave`, {
          userId: await AsyncStorage.getItem("user_id"),
          exerciseId: exerciseData.id,
        });
      }
      setSaved(!saved);
    } catch (error) {
      console.error(error);
    }
  };

  const initializeData = async () => {
    const exerciseDataTemp = route.params.exerciseData;
    setExerciseData(exerciseDataTemp);

    try {
      const savedResponse = await axios.get(
        BACKEND_URL +
          `/exercises/saved/${await AsyncStorage.getItem("user_id")}/${
            exerciseDataTemp.id
          }`
      );
      setSaved(savedResponse.data.saved);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeData();
  });

  //video player stuff
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate({
              name: "search",
              params: {},
            })
          );
        }}
      >
        <BackArrowIcon></BackArrowIcon>
      </TouchableOpacity>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {exerciseData.name.replace(/^\w/, (c) => c.toUpperCase())}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <View style={styles.star}>
                {saved ? (
                  <FontAwesome name="star" size={20} color="gold" />
                ) : (
                  <FontAwesome name="star-o" size={20} color="gray" />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <YoutubePlayer
            height={220}
            play={false}
            videoId={exerciseData.video_path}
            onChangeState={onStateChange}
          />

          <Text>
            Difficulty:{" "}
            {exerciseData.difficulty.replace(/^\w/, (c) => c.toUpperCase())}
          </Text>
          <Text>
            Type:{" "}
            {exerciseData.type
              ? exerciseData.type.replace(/^\w/, (c) => c.toUpperCase())
              : "N/A"}
          </Text>
          <Text>
            Equipment Needed:{" "}
            {exerciseData.equipment
              ? exerciseData.equipment.replace(/^\w/, (c) => c.toUpperCase())
              : "None"}
          </Text>
          <View style={styles.instructions}>
            <TouchableOpacity
              onPress={toggleExpanded}
              style={styles.toggleButton}
            >
              <Text numberOfLines={expanded ? undefined : 4}>
                Instructions: {exerciseData.description}
              </Text>

              <Text style={styles.toggleButtonText}>
                {expanded ? "Show Less▲" : "Show More▼"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backArrow: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: "5%",
    paddingVertical: "13%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  instructions: {
    padding: 5,
    marginTop: 10,
    backgroundColor: "#E0F7FA",
  },
  star: {
    width: 24,
    height: 24,
    marginTop: 6,
    marginLeft: 5,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  toggleButtonText: {
    fontSize: 12,
    color: "#555555",
  },
});

export default ExerciseScreen;
