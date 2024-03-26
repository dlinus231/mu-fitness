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
  const prevPage = route.params?.prevPage;
  const exerciseFrom = route.params?.exerciseFrom;
  const workoutFromFrom = route.params?.workoutFromFrom;

  console.log("bm - workoutFromFrom in ExerciseScreen: ", workoutFromFrom)

  // if we come to this from a workout page, we save the id so that we can navigate back to it
  const workoutId = route.params?.workout_id;
  // const isFocused = useIsFocused();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // const fetchExerciseData = async () => {
  //   try {
  //     const response = await axios.get(
  //       BACKEND_URL + `/exercises/one/${exercise_id}`
  //     );

  //     await setExerciseData(response.data);
  //     const savedResponse = await axios.get(
  //       BACKEND_URL +
  //         `/exercises/saved/${await AsyncStorage.getItem("user_id")}/${
  //           exerciseData.id
  //         }`
  //     );
  //     setSaved(savedResponse.data.saved);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
              name: exerciseFrom,
              params: { prevPage: prevPage, workout_id: workoutId, workoutFrom: workoutFromFrom },
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
              {exerciseData.name
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <View style={styles.star}>
                {saved ? (
                  <FontAwesome name="star" size={24} color="gold" />
                ) : (
                  <FontAwesome name="star-o" size={24} color="gray" />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <YoutubePlayer
            height={195}
            play={false}
            videoId={exerciseData.video_path}
            onChangeState={onStateChange}
          />
          <ScrollView contentContainerStyle={styles.horizontalScroll}>
            {exerciseData.muscles.map((muscle) => {
              return (
                <TouchableOpacity
                  key={muscle.id}
                  style={[styles.bubble, styles.muscleGroup]}
                >
                  <Text style={styles.muscleGroupText}>
                    {muscle.name
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {exerciseData.tags.map((tag) => {
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.bubble, styles.tag]}
                >
                  <Text style={styles.tagText}>
                    {tag.name
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

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
            {exerciseData.equipment && exerciseData.equipment != "body_only"
              ? exerciseData.equipment.replace(/^\w/, (c) => c.toUpperCase())
              : "None"}
          </Text>
          {(exerciseData.description.length) > 0 && (
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
          )}
          
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backArrow: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: -20,
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  container: {
    paddingHorizontal: "5%",
    paddingVertical: "13%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  horizontalScroll: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    flexGrow: 0,
    marginBottom: 10,
  },
  instructions: {
    padding: 5,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#ebe7f7",
  },
  muscleGroup: {
    backgroundColor: "#695acd",
  },
  muscleGroupText: {
    color: "white",
  },
  tag: {
    backgroundColor: "#cd695a",
  },
  tagText: {
    color: "#FFFFFF",
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    marginTop: -10,
  },
  toggleButtonText: {
    marginTop: 3,
    marginBottom: 5,
    fontSize: 12,
    color: "#555555",
  },
});

export default ExerciseScreen;
