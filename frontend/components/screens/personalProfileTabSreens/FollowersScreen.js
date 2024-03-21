import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, set } from '@gluestack-ui/themed';

import { BACKEND_URL } from "@env";
import { useFocusEffect } from '@react-navigation/native';

import axios from 'axios';

const FollowersScreen = ({route, navigation}) => {
  // userId is the id of the user whose following list we want to display
  const { userId } = route.params;

  const [followerList, setFollowerList] = useState(null);

  const fetchFollowerList = useCallback(async () => {
    const response = await axios.get(BACKEND_URL + `/user/followers/${userId}`);

    // only extract the needed information from what is returned
    const followerListResponse = response.data.map((follow) => {
      user = follow.follower;
      return {
        id: user.id,
        username: user.username,
      }
    })

    if (response.status == 200) {
      console.log("bm - follower list: ", followerListResponse);
    }

    setFollowerList(followerListResponse);
  }, [userId]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('PersonalProfile', { userId: item.id })}>
        <Text>{item.username}</Text>
      </TouchableOpacity>
    );
  }

  // on first load, we should fetch the user's following list
  // useEffect(() => {
  //   fetchFollowerList();
  // }, [userId])

  useFocusEffect(
    useCallback(() => {
      fetchFollowerList();
    }, [userId])
  )

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Your followers: </Text>
      <View>
        {followerList && followerList.map((user) => {
          return (
            <TouchableOpacity key={user.id} onPress={() => navigation.navigate('PersonalProfile', { userId: user.id })}>
              <Text>{user.username}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={styles.bottomContent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('PersonalProfile')}>
            <Text style={{ color: "white" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <FlatList 
        data={followingList}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('PersonalProfile', { userId: item.id })}>
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    display: 'flex',
    alignItems: "flex-end",
    paddingTop: 10,
  },
  align: {
    textAlign: 'center',
    paddingHorizontal: '3%',
    paddingBottom: '10%',
  },
  topText: {
    paddingBottom: '10%',
  },
  buttonContainer: {
    flexDirection: "row",
  },
  backButton: {
    borderWidth: 2,
    borderColor: "#6A5ACD",
    borderRadius: 10,
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  flatlist: {
    maxHeight: 550,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
  
export default FollowersScreen;