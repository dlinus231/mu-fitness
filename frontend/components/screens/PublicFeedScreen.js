import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';

import TopBarMenu from '../TopBarMenu';

import DirectMessagesScreen from './DirectMessagesScreen';
import SearchScreen from './SearchScreen';

const PublicFeedScreen = () => {
  // enum, can have values 'publicFeed', 'dms', 'search
  const [ curPage, setCurPage ] = useState('publicFeed'); 

  const handleSwitchPage = (page) => {
    setCurPage(page);
  };

  return (
    <>
      { curPage == 'dms' && <DirectMessagesScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='publicFeed'
      /> }
      { curPage == 'search' && <SearchScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='publicFeed'
      />}
      { curPage == 'publicFeed' && (
        <>
          <TopBarMenu onSwitchPage={handleSwitchPage}/>
          <View style={styles.container}>
            <Text>This is the public feed screen</Text>
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
  
export default PublicFeedScreen;