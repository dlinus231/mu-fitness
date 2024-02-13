import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

const DirectMessagesScreen = ({ 
  onSwitchPage, // callback function
  rootPage, // string
}) => {
  return (
    <View style={styles.container}>
      <Text>This is the DMs screen</Text>
      <TouchableOpacity onPress={() => onSwitchPage(rootPage)}>
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
});

export default DirectMessagesScreen;