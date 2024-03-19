import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import JournalScreen from "./screens/personalProfileTabSreens/JournalScreen";
import PersonalProfileMenuScreen from "./screens/personalProfileTabSreens/PersonalProfileMenuScreen";
import FollowingScreen from "./screens/personalProfileTabSreens/FollowingScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function PersonalProfilePageNagivator({handleAuthChange}) {
  return (
    <Stack.Navigator
      initialRouteName="personalProfilePageMainPage"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="personalProfilePageMainPage"
        initialParams={{ userId: "" }} // we want it to initially load on the current user (empty string here signifies current user)
      >
        {props => <PersonalProfileMenuScreen {...props} handleAuthChange={handleAuthChange} />}
      </Stack.Screen>
      <Stack.Screen name="journal" component={JournalScreen} />
      <Stack.Screen name="followingList" component={FollowingScreen} />
    </Stack.Navigator>
  );
}
