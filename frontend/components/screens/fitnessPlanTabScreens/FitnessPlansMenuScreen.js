// LandingScreen.js
import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { VStack, Button, ButtonText} from '@gluestack-ui/themed';

const FitnessPlansMenuScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
        <VStack space="md" style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('WorkoutPlans')}
            >
                <Text style={styles.text}>Workout Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SavedExercises')}
            >
                <Text style={styles.text}>Saved Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('RecommendedExercises')}
            >
                <Text style={styles.text}>Recommended Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Leaderboards')}
            >
                <Text style={styles.text}>Leaderboards</Text>
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
      flex: 1,
      justifyContent: 'space-around',
      // Adjust the padding as needed
      paddingHorizontal: 10,
    },
    button: {
        borderColor: '#6A5ACD',
        backgroundColor: '#6A5ACD',
        padding: 10,
        borderRadius: 5,
        height: '17%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default FitnessPlansMenuScreen;
