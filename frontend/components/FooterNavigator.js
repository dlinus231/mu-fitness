import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';

import FriendFeedScreen from './screens/FriendFeedScreen';
import FitnessPlansScreen from './screens/FitnessPlansScreen';
import UploadScreen from './screens/UploadScreen';
import PublicFeedScreen from './screens/PublicFeedScreen';
import PersonalProfileScreen from './screens/PersonalProfileScreen';

const Tab = createBottomTabNavigator();

export default function FooterNavigator({ handleAuthChange }) {
  return (
    <Tab.Navigator
        // initialRouteName="FriendFeed"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
    >
      <Tab.Screen name="FriendFeed" component={FriendFeedScreen} options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons name="people-sharp" size={24} color={focused ? 'blue' : 'grey'} />
        ),
      }}/>
      <Tab.Screen name="FitnessPlans" component={FitnessPlansScreen} options={{
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons name="weight-lifter" size={24} color={focused ? 'blue' : 'grey'} />
        ),
      }}/>
      <Tab.Screen name="Upload" component={UploadScreen} options={{
        tabBarIcon: ({ focused }) => (
          <Feather name="upload" size={24} color={focused ? 'blue' : 'grey'} />
        ),
      }}/>
      <Tab.Screen name="PublicFeed" component={PublicFeedScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <SimpleLineIcons name="layers" size={24} color={focused ? 'blue' : 'grey'} />
          // <MaterialCommunityIcons name="layers-triple-outline" size={24} color={focused ? 'blue' : 'grey'} />
        ),
      }}/>
      <Tab.Screen name="PersonalProfile" options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="person-circle-sharp" size={24} color={focused ? 'blue' : 'grey'} />
        ),
      }}>
        {props => <PersonalProfileScreen {...props} handleAuthChange={handleAuthChange} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

{/* <Stack.Screen name="signupScreen">
          {props => <SignupScreen {...props} handleAuthChange={handleAuthChange} />}
</Stack.Screen> */}