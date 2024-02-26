import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

const JournalScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>This is the Journal screen</Text>
      <Text style={styles.align}>In the future, there will be a list of workouts you have completed here, as well as stats like calories burned, time spent, heart rate, etc.</Text>
      <TouchableOpacity onPress={() => navigation.navigate("personalProfilePageMainPage")}>
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    align: {
        textAlign: 'center',
        paddingHorizontal: '3%',
        paddingBottom: '10%',
    }
});
  
export default JournalScreen;