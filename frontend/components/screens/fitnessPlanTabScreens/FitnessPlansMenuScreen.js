// LandingScreen.js
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { VStack, Button, ButtonText} from '@gluestack-ui/themed';

const FitnessPlansMenuScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
        <VStack space="md" style={styles.buttonContainer}>
            <Button
                onPress={() => navigation.navigate('WorkoutPlans')}
            >
                <ButtonText>Workout Plans</ButtonText>
            </Button>
            <Button
                onPress={() => navigation.navigate('SavedExercises')}
            >
                <ButtonText>Saved Exercises</ButtonText>
            </Button>
            <Button
                onPress={() => navigation.navigate('RecommendedExercises')}
            >
                <ButtonText>Recommended Exercises</ButtonText>
            </Button>
            <Button
                onPress={() => navigation.navigate('Leaderboards')}
            >
                <ButtonText>Leaderboards</ButtonText>
            </Button>
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
});

export default FitnessPlansMenuScreen;
