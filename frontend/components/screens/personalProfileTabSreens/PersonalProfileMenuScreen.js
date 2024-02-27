// LandingScreen.js
import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { VStack, Button, ButtonText} from '@gluestack-ui/themed';

const PersonalProfileMenuScreen = ({ navigation, handleAuthChange }) => {
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.top_text}>This is the personal profile screen</Text>
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
