import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

const FollowingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>This is the Following screen</Text>
      <Text style={styles.align}>A list of all of the users that you follow will go here in the future</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
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
  
export default FollowingScreen;