import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import { View, Text} from '@gluestack-ui/themed';

export default function TopBarMenu ({ onSwitchPage }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSwitchPage('search')}>
        <Text>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSwitchPage('dms')}>
        <Text>DMs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 40,
  },
});