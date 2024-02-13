import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import TopBarMenu from '../TopBarMenu';

import DirectMessagesScreen from './DirectMessagesScreen';
import SearchScreen from './SearchScreen';

const FriendFeedScreen = () => {
  // can have values 'friendFeed', 'dms', 'search'
  const [ curPage, setCurPage ] = useState('friendFeed'); 

  const handleSwitchPage = (page) => {
    setCurPage(page);
  };

  return (
    <>
      { curPage == 'dms' && <DirectMessagesScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='friendFeed'
      /> }
      { curPage == 'search' && <SearchScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='friendFeed'
      />}
      { curPage == 'friendFeed' && (
        <>
          <TopBarMenu onSwitchPage={handleSwitchPage}/>
          <View style={styles.container}>
            <Text>This is the friend feed screen</Text>
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
  
export default FriendFeedScreen;