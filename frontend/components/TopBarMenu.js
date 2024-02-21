import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import { View, Text} from '@gluestack-ui/themed';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const ICON_SIZE = 28;

export default function TopBarMenu ({ onSwitchPage }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSwitchPage('search')}>
        <MaterialIcons name="search" size={ICON_SIZE} color="grey" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSwitchPage('dms')}>
        <Feather name="message-square" size={ICON_SIZE} color="grey" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '12%',
    paddingHorizontal: '5%',
  },
});