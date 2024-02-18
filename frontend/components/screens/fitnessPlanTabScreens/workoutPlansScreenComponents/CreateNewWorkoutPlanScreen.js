import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import { Octicons } from '@expo/vector-icons';


const CreateNewWorkoutPlanScreen = ({ 
    navigation,
}) => {
    // TODO once backend is implemented we will fetch additional data about the workout plan from the backend

    return (
        <SafeAreaView>
            <Text> this is the create new workout plans screen </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text>Go back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
  
export default CreateNewWorkoutPlanScreen;