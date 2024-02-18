import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

import WorkoutPlan from './workoutPlansScreenComponents/WorkoutPlan';

// temporary for display purposes before we get the backend hooked up
const dummyData = [
  { id: '1', title: 'Workout Plan 1' },
  { id: '2', title: 'Workout Plan 2' },
  { id: '3', title: 'Workout Plan 3' },
  { id: '4', title: 'Workout Plan 4' },
  { id: '5', title: 'Workout Plan 5' },
  { id: '6', title: 'Workout Plan 6' },
  { id: '7', title: 'Workout Plan 7' },
  { id: '8', title: 'Workout Plan 8' },
  { id: '9', title: 'Workout Plan 9' },
  { id: '10', title: 'Workout Plan 10' },
]


const WorkoutPlansScreen = ({ navigation }) => {
  // TODO: once backend implemented, we will fetch workout plans from backend here

  const renderItem = ({ item }) => {
    return (
      <WorkoutPlan title={item.title} id={item.id} />
    );
  }

  return (
    <SafeAreaView>
      <Text>This is the workout plans screen</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </TouchableOpacity>

      <FlatList 
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => {}} // TODO in the future this is where we would put logic to fetch more workout plans from the backend
        onEndReachedThreshold={0.3} // determines how close to end to call the onEndReached function, will probably adjust this later
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});
  
export default WorkoutPlansScreen;