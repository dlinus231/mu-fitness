import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import { Octicons } from '@expo/vector-icons';


const IndividualWorkoutPlanScreen = ({ 
    navigation,
    onLeaveWorkoutPlanPage,
    workout
}) => {
    // TODO once backend is implemented we will fetch additional data about the workout plan from the backend

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.chevron} onPress={onLeaveWorkoutPlanPage}>
                <Octicons name="chevron-left" size={48} color="black"/>
            </TouchableOpacity>
            <Text style={{paddingBottom: '3%'}}> Workout plan page for {workout.title} (id: {workout.id})</Text>
            <Text> In the future this will contain all of the exercises in the workout, along with stats about the workout and other stuff </Text>
        </SafeAreaView>
    );
};
  

const styles = StyleSheet.create({
    container: {
        padding: '3%',
    },
    chevron: {
        paddingTop: '6%',
        paddingLeft: '7%',
    }
});
export default IndividualWorkoutPlanScreen;