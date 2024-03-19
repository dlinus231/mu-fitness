// LandingScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { VStack, Button, ButtonText} from '@gluestack-ui/themed';

import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalProfileMenuScreen = ({ route, navigation, handleAuthChange }) => {
    // if userId is not set, we should just set it to the current user
    // not having a set userId passed in means we are on the current user's profile

    const [userId, setUserId] = useState(route.params?.userId); // id of user we want to display profile for (empty string means current user's profile)
    const [currentUserId, setCurrentUserId] = useState('');  // id of currently logged in user

    const [isLoading, setIsLoading] = useState(true);

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
        console.log("bm - userId useeffect reached")
        if (currentUserId) {
            setIsLoading(false);
        }
    }, [userId, currentUserId])
    
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.top_text}>This is the profile screen</Text>
            <VStack space="md" style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('journal')}
                >
                    <Text style={styles.text}>Journal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('followingList')}
                >
                    <Text style={styles.text}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAuthChange}
                >
                    <Text style={styles.text}>Sign Out</Text>
                </TouchableOpacity>
            </VStack>  
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
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

export default PersonalProfileMenuScreen;
