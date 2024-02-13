import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@gluestack-ui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TopBarMenu from '../TopBarMenu';
import DirectMessagesScreen from './DirectMessagesScreen';
import SearchScreen from './SearchScreen';
import WorkoutPlansScreen from './fitnessPlanTabScreens/WorkoutPlansScreen';
import FitnessPlansScreenNavigator from '../FitnessPlanScreenNavigator';

const Stack = createNativeStackNavigator();

const FitnessPlansScreen = () => {
  // can have values 'friendFeed', 'dms', 'search'
  const [ curPage, setCurPage ] = useState('fitnessPlan');

  const handleSwitchPage = (page) => {
    setCurPage(page);
  };

  return (
    <>
      { curPage == 'dms' && <DirectMessagesScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='fitnessPlan'
      /> }
      { curPage == 'search' && <SearchScreen 
        onSwitchPage={handleSwitchPage} 
        rootPage='fitnessPlan'
      />}
      { curPage == 'fitnessPlan' && (
        <>
          <TopBarMenu onSwitchPage={handleSwitchPage}/>
          {/* <View style={styles.container}>
            <Text>This is the fitness plan screen</Text>
          </View> */}
          <FitnessPlansScreenNavigator />
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
  
export default FitnessPlansScreen;