import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Text, View, FlatList, RefreshControl } from "@gluestack-ui/themed";
import TopBarMenu from "../TopBarMenu";

import axios from "axios";
import { BACKEND_URL } from "@env";
import { formatDistanceToNow, set } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterTab from "../FooterTab";

const FriendFeedPost = ({ navigation, item, currentUserId }) => {
    // console.log("bm - in FriendFeedPost, item: ", item)
    // console.log("bm - in FriendFeedPost, currentUserId: ", currentUserId)


    const [liked, setLiked] = useState(item.likes.some(like => parseInt(like.userId) === parseInt(currentUserId)));
    const [likeCount, setLikeCount] = useState(item.likes.length);
    const postId = parseInt(item.id);

    const likePost = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/posts/${postId}/like`, {
                userId: parseInt(currentUserId),
            });
            console.log("response from likePost: ", response.data)
        } catch (error) {
            console.log("error occurred while attempting to like post: ", error);
            setLiked(false)
            setLikeCount(likeCount - 1);
        }
    }

    const unlikePost = async () => {
        console.log("bm - attempting to unlike post: ", postId)
        try {
            const response = await axios.delete(`${BACKEND_URL}/posts/${postId}/like`, {
                userId: parseInt(currentUserId),
            });
            console.log("response from unlikePost: ", response.data)
        } catch (error) {
            console.log("error occurred while attempting to unlike post: ", error);
            setLiked(true);
            setLikeCount(likeCount + 1);
        }
    }

    const handleLikePress = () => {
        console.log("bm - inside handleLikePress: " + liked);
        if (liked) {
          setLiked(false);
          setLikeCount(likeCount - 1);
          unlikePost();
        } else {
          setLiked(true);
          setLikeCount(likeCount + 1);
          likePost();
        }
    }

    return (
        <TouchableOpacity
            style={styles.post}
            onPress={() => {}}
          >
            <View>
              <Text>
                <Text style={styles.username}>{item.username}:</Text>
                <Text style={styles.workoutDescription}> {item.caption}</Text>
              </Text>
            </View>
    
            <View style={styles.postBottomContent}>
              <TouchableOpacity style={styles.postLikesContainer} onPress={handleLikePress}>
                {liked ? (
                    <MaterialCommunityIcons name="heart" size={24} color="#a99ee1" />
                ) : (
                    <MaterialCommunityIcons name="heart-outline" size={24} />
                )}
                <Text style={styles.postLikesCount}>{likeCount}</Text>
              </TouchableOpacity>
              
              <Text style={styles.postTime}>
                {formatDistanceToNow(new Date(item.timeCreated), { addSuffix: true })}
              </Text>
            </View>
            
          </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    postDetail: {
      fontSize: 14,
    },
    postTime: {
      fontSize: 12,
      color: "#666",
      // alignSelf: "flex-end",
    },
    post: {
      backgroundColor: "#FFF",
      paddingTop: 10,
      paddingBottom: 15,
      paddingHorizontal: 20,
      marginVertical: 8,
      marginLeft: 16,
      marginRight: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      // flexDirection: "column",
      // justifyContent: "space-between",
    },
    postCaption: {
      fontSize: 16,
    },
    postBottomContent: {
      marginTop: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    postLikesContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    postLikesCount: {
      marginLeft: 5,
      fontSize: 16,
      color: "black",
    },
  });

export default FriendFeedPost;