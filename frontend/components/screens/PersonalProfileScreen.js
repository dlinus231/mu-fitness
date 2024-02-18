import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import TopBarMenu from '../TopBarMenu';

import DirectMessagesScreen from './DirectMessagesScreen';
import SearchScreen from './SearchScreen';

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
          <View style={styles.container}>
            <Text>This is the personal profile screen</Text>
            <TouchableOpacity onPress={handleAuthChange}>
              <Text>Sign out</Text>
            </TouchableOpacity>
          </View>
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