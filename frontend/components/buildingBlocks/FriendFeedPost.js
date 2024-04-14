import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Text, View, FlatList, RefreshControl } from "@gluestack-ui/themed";

import axios from "axios";
import { BACKEND_URL } from "@env";
import { formatDistanceToNow, set } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FriendFeedPost = ({ navigation, item, currentUserId, fromProfilePage, canDelete, onDeletePost }) => {
    const [liked, setLiked] = useState(item.likes.some(like => parseInt(like.userId) === parseInt(currentUserId)));
    const [likeCount, setLikeCount] = useState(item.likes.length);
    const postId = parseInt(item.id);

    const likePost = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/posts/${postId}/like`, {
                userId: parseInt(currentUserId),
            });
        } catch (error) {
            console.log("error occurred while attempting to like post: ", error);
            setLiked(false)
            setLikeCount(likeCount - 1);
        }
    }

    const unlikePost = async () => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/posts/${postId}/like/${currentUserId}`);
        } catch (error) {
            console.log("error occurred while attempting to unlike post: ", error);
            setLiked(true);
            setLikeCount(likeCount + 1);
        }
    }

    const handleLikePress = () => {
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
        <TouchableOpacity style={styles.post} onPress={() => {}}>
            <View style={styles.postHeader}>
                {!fromProfilePage && <><Text style={styles.username}>{item.username}</Text><Text>: </Text></>}
                <View style={styles.captionAndIconContainer}>
                    <Text style={styles.postCaption}>{item.caption}</Text>
                    {canDelete && (
                        <TouchableOpacity style={styles.postDeleteIcon} onPress={() => onDeletePost(postId)}>
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color="grey" />
                        </TouchableOpacity>
                    )}
                </View>
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
    )
}
const styles = StyleSheet.create({
    post: {
        backgroundColor: "#FFF",
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 3,
        flexDirection: "column",
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
    },
    captionAndIconContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
    },
    postCaption: {
        flex: 1,
        fontSize: 16,
    },
    postDeleteIcon: {
    },
    postBottomContent: {
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
    },
    postTime: {
        fontSize: 12,
        color: "#666",
    },
});

export default FriendFeedPost;