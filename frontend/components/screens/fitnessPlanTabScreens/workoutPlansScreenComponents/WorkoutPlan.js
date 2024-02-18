import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';


const WorkoutPlan = ({ 
    navigation,
    title,
    id,
}) => {
    // TODO: once backend implemented, we will fetch workout plans from backend here
    return (
        <SafeAreaView style={(id % 2 === 0) ? styles.itemContainerEven : styles.itemContainerOdd}>
            <Text> {title} </Text>
        </SafeAreaView>
    );
};
  
const styles = StyleSheet.create({
    itemContainerEven: {
        flexDirection: 'row',
        height: Dimensions.get('window').height / 6, 
        justifyContent: 'left',
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
        justifyContent: 'left',
        alignItems: 'top',
        borderBottomWidth: 1, 
        borderBottomColor: '#e0e0e0',
        backgroundColor: 'gainsboro',
        paddingLeft: '3%',
        paddingTop: '4%',
    },
});
export default WorkoutPlan;