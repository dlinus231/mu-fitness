import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Text, View, FlatList, RefreshControl } from "@gluestack-ui/themed";

import axios from "axios";
import { BACKEND_URL } from "@env";
import { formatDistanceToNow, set } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WorkoutBlock = ({ navigation, item, currentUserId, handleWorkoutPress, fromProfilePage }) => {
    const [liked, setLiked] = useState(item.likes.some(like => parseInt(like.userId) === parseInt(currentUserId)));
    const [likeCount, setLikeCount] = useState(item.likes.length);
    const workoutId = parseInt(item.id);

    const likeWorkout = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/workout/${workoutId}/like`, {
                userId: parseInt(currentUserId),
            });
        } catch (error) {
            console.log("error occurred while attempting to like workout: ", error);
            setLiked(false)
            setLikeCount(likeCount - 1);
        }
    }

    const unlikeWorkout = async () => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/workout/${workoutId}/like/${currentUserId}`);
        } catch (error) {
            console.log("error occurred while attempting to unlike workout: ", error);
            setLiked(true);
            setLikeCount(likeCount + 1);
        }
    }

    const handleLikePress = () => {
        if (liked) {
          setLiked(false);
          setLikeCount(likeCount - 1);
          unlikeWorkout();
        } else {
          setLiked(true);
          setLikeCount(likeCount + 1);
          likeWorkout();
        }
    }

    return (
        <TouchableOpacity style={styles.workoutPlan} onPress={handleWorkoutPress} >
            <View style={styles.workoutMainContent}>
                {/* If we are rendering on a profile page, we don't need the username */}
                {!fromProfilePage && (
                    <Text>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.workoutDescription}>
                            {" "}
                            created a new workout plan
                        </Text>
                    </Text>
                )}
                <Text style={styles.workoutName}>{item.name}</Text>
            </View>

            <View style={styles.workoutBottomContent}>
                <TouchableOpacity style={styles.workoutLikesContainer} onPress={handleLikePress}>
                    {liked ? (
                        <MaterialCommunityIcons name="heart" size={24} color="#a99ee1" />
                    ) : (
                        <MaterialCommunityIcons name="heart-outline" size={24} />
                    )}
                    <Text style={styles.workoutLikesCount}>{likeCount}</Text>
                </TouchableOpacity>
                <Text style={styles.workoutTime}>
                    {formatDistanceToNow(new Date(item.timeCreated), {
                    addSuffix: true,
                    })}
                </Text>
            </View>
            
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
    workoutBottomContent: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    workoutLikesContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    workoutLikesCount: {
        marginLeft: 5,
        fontSize: 16,
        color: "black",
    },
});

export default WorkoutBlock;