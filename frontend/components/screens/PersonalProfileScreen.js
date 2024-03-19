import React, { useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import TopBarMenu from '../TopBarMenu';

import DirectMessagesScreen from './DirectMessagesScreen';
import SearchScreen from './SearchScreen';

import PersonalProfilePageNagivator from '../PersonalProfilePageNavigator';

import AsyncStorage from "@react-native-async-storage/async-storage";

const PersonalProfileScreen = ({ handleAuthChange }) => {
  // TODO make this an enum?
  // can have values 'profile', 'dms', 'search'
  const [ curPage, setCurPage ] = useState('profile'); 

  const handleSwitchPage = (page) => {
    setCurPage(page);
  };

  return (
    <>
      { curPage == 'dms' && <DirectMessagesScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='profile'
      /> }
      { curPage == 'search' && <SearchScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='profile'
      />}
      { curPage == 'profile' && (
        <>
          <TopBarMenu onSwitchPage={handleSwitchPage}/>
          <PersonalProfilePageNagivator handleAuthChange={handleAuthChange}/>
        </>
      )}
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
  
export default PersonalProfileScreen;