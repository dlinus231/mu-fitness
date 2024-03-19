import React, { useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, SafeAreaView, Text  } from 'react-native';
import { View, VStack, Button, ButtonText} from '@gluestack-ui/themed';
import TopBarMenu from '../TopBarMenu';

import DirectMessagesScreen from './DirectMessagesScreen';
import SearchScreen from './SearchScreen';

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

import { BACKEND_URL } from "@env";


const PersonalProfileScreen = ({route, navigation, handleAuthChange }) => {
    // TODO make this an enum?
    // can have values 'profile', 'dms', 'search'
    const [ curPage, setCurPage ] = useState('profile'); 

    const handleSwitchPage = (page) => {
      setCurPage(page);
    };

    console.log("bm - route.params: ", route.params)

    const userIdFromRoute = route.params?.userId;

    const [userId, setUserId] = useState(userIdFromRoute); // id of user we want to display profile for (empty string means current user's profile)
    const [currentUserId, setCurrentUserId] = useState('');  // id of currently logged in user

    const [userData, setUserData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    // when we access from a different user's profile, we need to set the userId state
    useEffect(() => {
      if (userIdFromRoute) {
        setUserId(userIdFromRoute);
      }
    }, [userIdFromRoute])

    // fetch currently logged in user on iniital load
    useEffect(() => {
        const getCurrentUserId = async () => {
            try {
                const uId = await AsyncStorage.getItem("user_id");
                if (uId !== null) {
                    setCurrentUserId(uId);
                }

                // if userId is not set, we should just set it to the current user
                if (userId === "") {
                    setUserId(uId);
                }
            }
            catch (e) {
                console.log("bm - error getting user id: ", e);
            }
        }
        getCurrentUserId();
    }, [])
    
    // TODO set this to be loading if the userId is not set
    useEffect(() => {
        console.log("bm - setIsLoading useEffect reached")
        if (currentUserId !== '' && userData !== null && userId) {
            setIsLoading(false);
        }
    }, [userId, currentUserId, userData])
    
    // when userId is not null and has changed, we need to fetch the user's data
    useEffect(() => {
        console.log("bm - fetching user data useEffect reached")
        if (userId) {
            // fetch user data    
            fetchUserData();
        }
    }, [userId])

    // fetch dat associated with current user and populate the userData state
    const fetchUserData = async () => {
        try {
          // fetch user data
          const response = await axios.get(BACKEND_URL + `/user/${userId}`);
          setUserData(response.data);
          console.log("bm - set user data: ", response.data)
        }
        catch (e) {
          console.log("bm - error fetching user data: ", e);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        )
    }

    return (
      <>
        { curPage == 'dms' && <DirectMessagesScreen 
          onSwitchPage={handleSwitchPage} 
          rootPage='profile'
        /> }
        { curPage == 'search' && <SearchScreen 
          onSwitchPage={handleSwitchPage} 
          rootPage='profile'
        />}
        { curPage == 'profile' && (
          <>
            <TopBarMenu onSwitchPage={handleSwitchPage}/>
            <SafeAreaView style={styles.container}>
              <Text style={styles.top_text}>This is the profile screen for user with id {userId}</Text>
              <Text style={styles.mid_text}> Username: {userData.username}</Text>
              <Text style={styles.mid_text}> UserId: {userData.id}</Text>
              <Text style={styles.mid_text}> Email: {userData.email}</Text>


              <VStack space="md" style={styles.buttonContainer}>

                { userId === currentUserId ? (
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.navigate('journal')}
                    >
                        <Text style={styles.text}>Journal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('followingList', { userId: userId })}
                    >
                        <Text style={styles.text}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('followersList', { userId: userId })}
                    >
                        <Text style={styles.text}>Followers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAuthChange}
                    >
                        <Text style={styles.text}>Sign Out</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.navigate('PersonalProfile', { userId: currentUserId })}
                  >
                      <Text style={styles.text}>Back to your profile</Text>
                  </TouchableOpacity>
                )}

                  
              </VStack>  
            </SafeAreaView>
          </>
        )}
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-around',
    // Adjust the padding as needed
    paddingHorizontal: 10,
  },
  top_text: {
      textAlign: 'center',
      paddingHorizontal: '3%',
      paddingBottom: '10%',
  },
  mid_text: {
      textAlign: 'center',
      paddingHorizontal: '3%',
      paddingBottom: '3%',
  },
  button: {
      borderColor: '#6A5ACD',
      backgroundColor: '#6A5ACD',
      padding: 10,
      borderRadius: 5,
      // height: '17%',
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center',
  },
  text: {
      textAlign: 'center',
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  }
});
  
export default PersonalProfileScreen;