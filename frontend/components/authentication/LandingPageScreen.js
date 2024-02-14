import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LandingPageScreenNavigator from './LandingPageScreenNavigator';


const LandingPageScreen = ({handleAuthChange}) => {
    return (
        <>
            <LandingPageScreenNavigator handleAuthChange={handleAuthChange}/>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});
  
export default LandingPageScreen;