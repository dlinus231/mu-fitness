import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import { Octicons } from '@expo/vector-icons';


const WorkoutPlan = ({ 
    navigation,
    title,
    id,
    onEnterWorkoutPlanPage,
}) => {    
    return (
        <SafeAreaView style={(id % 2 === 0) ? styles.itemContainerEven : styles.itemContainerOdd}>
            <Text> {title} </Text>
            <TouchableOpacity style={styles.chevron} onPress={() => onEnterWorkoutPlanPage(id)}>
                <Octicons name="chevron-right" size={48} color="black"/>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
  
const styles = StyleSheet.create({
    itemContainerEven: {
        flexDirection: 'row',
        height: Dimensions.get('window').height / 6, 
        justifyContent: 'space-between',
        alignItems: 'top',
        borderBottomWidth: 1, 
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f0f0f0',
        paddingLeft: '3%',
        paddingTop: '4%',
    },
    itemContainerOdd: {
        flexDirection: 'row',
        height: Dimensions.get('window').height / 6, 
        justifyContent: 'space-between',
        alignItems: 'top',
        borderBottomWidth: 1, 
        borderBottomColor: '#e0e0e0',
        backgroundColor: 'gainsboro',
        paddingLeft: '3%',
        paddingTop: '4%',
    },
    chevron: {
        paddingTop: '6%',
        paddingRight: '7%',
    }
});
export default WorkoutPlan;