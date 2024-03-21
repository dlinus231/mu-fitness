import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  SimpleLineIcons,
} from "@expo/vector-icons";

import FriendFeedScreen from "./screens/FriendFeedScreen";
import FitnessPlansScreen from "./screens/FitnessPlansScreen";
import UploadScreen from "./screens/UploadScreen";
import PublicFeedScreen from "./screens/PublicFeedScreen";
import PersonalProfileScreen from "./screens/PersonalProfileScreen";

import JournalScreen from "./screens/personalProfileTabSreens/JournalScreen";
import FollowingScreen from "./screens/personalProfileTabSreens/FollowingScreen";
import FollowersScreen from "./screens/personalProfileTabSreens/FollowersScreen";
import ExerciseScreen from "./screens/contentViewScreens/ExerciseScreen";
import SearchScreen from "./screens/universalSearchScreens/SearchScreen";
import DirectMessagesScreen from "./screens/DirectMessagesScreen";
import SavedExercisesScreen from "./screens/SavedExercisesScreen";
import WorkoutPlansScreen from "./screens/fitnessPlanTabScreens/WorkoutPlansScreen";
import CreateNewWorkoutPlanScreen from "./screens/fitnessPlanTabScreens/workoutPlansScreenComponents/CreateNewWorkoutPlanScreen";
import EditWorkoutPlanScreen from "./screens/fitnessPlanTabScreens/workoutPlansScreenComponents/EditWorkoutPlanScreen";
import IndividualWorkoutPlanScreen from "./screens/fitnessPlanTabScreens/workoutPlansScreenComponents/IndividualWorkoutPlanScreen";
import UserProfileScreen from "./screens/contentViewScreens/UserProfileScreen";

const Tab = createBottomTabNavigator();

export default function FooterNavigator({ handleAuthChange }) {
  const handleSwitchPage = (page) => {
    console.log(page);
    navigation.navigate(page);
  };

  return (
    <Tab.Navigator
      // initialRouteName="FriendFeed"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="FriendFeed"
        component={FriendFeedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="people-sharp"
              size={24}
              color={focused ? "#6A5ACD" : "grey"}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="FitnessPlans"
        component={FitnessPlansScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              size={24}
              color={focused ? "#6A5ACD" : "grey"}
            />
          ),
        }}
      /> */}
      {/* Changed to only display workout plans */}
      <Tab.Screen
        name="FitnessPlans"
        component={WorkoutPlansScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              size={24}
              color={focused ? "#6A5ACD" : "grey"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="upload"
              size={24}
              color={focused ? "#6A5ACD" : "grey"}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="PublicFeed"
        component={PublicFeedScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <SimpleLineIcons
              name="layers"
              size={24}
              color={focused ? "#6A5ACD" : "grey"}
            />
            // <MaterialCommunityIcons name="layers-triple-outline" size={24} color={focused ? 'blue' : 'grey'} />
          ),
        }}
      /> */}
      {/* Changed to display saved exercises */}
      <Tab.Screen
        name="SavedExercises"
        component={SavedExercisesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <SimpleLineIcons
              name="layers"
              size={24}
              color={focused ? "#6A5ACD" : "grey"}
            />
            // <MaterialCommunityIcons name="layers-triple-outline" size={24} color={focused ? 'blue' : 'grey'} />
          ),
        }}
      />

      <Tab.Screen
        name="PersonalProfile"
        initialParams={{ userId: "" }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="person-circle-sharp"
              size={24}
              color={focused ? "#6A5ACD" : "grey"}
            />
          ),
        }}
      >
        {(props) => (
          <PersonalProfileScreen
            {...props}
            handleAuthChange={handleAuthChange}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="journal"
        component={JournalScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="followingList"
        component={FollowingScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="followersList"
        component={FollowersScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ExerciseScreen"
        component={ExerciseScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="dms"
        component={DirectMessagesScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="CreateNewWorkoutPlan"
        component={CreateNewWorkoutPlanScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="EditWorkoutPlan"
        component={EditWorkoutPlanScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="IndividualWorkoutScreen"
        component={IndividualWorkoutPlanScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

{
  /* <Stack.Screen name="signupScreen">
          {props => <SignupScreen {...props} handleAuthChange={handleAuthChange} />}
</Stack.Screen> */
}
