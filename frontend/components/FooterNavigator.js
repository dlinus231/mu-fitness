import React from "react";

import FriendFeedScreen from "./screens/FriendFeedScreen";
import FitnessPlansScreen from "./screens/FitnessPlansScreen";
// import UploadScreen from "./screens/UploadScreen";
// import PublicFeedScreen from "./screens/PublicFeedScreen";
import PersonalProfileScreen from "./screens/PersonalProfileScreen";

import JournalScreen from "./screens/personalProfileTabSreens/JournalScreen";
import FollowingScreen from "./screens/personalProfileTabSreens/FollowingScreen";
import FollowersScreen from "./screens/personalProfileTabSreens/FollowersScreen";
import ExerciseScreen from "./screens/contentViewScreens/ExerciseScreen";
import SearchScreen from "./screens/universalSearchScreens/SearchScreen";
// import DirectMessagesScreen from "./screens/DirectMessagesScreen";
import SavedExercisesScreen from "./screens/SavedExercisesScreen";
import WorkoutPlansScreen from "./screens/fitnessPlanTabScreens/WorkoutPlansScreen";
import CreateNewWorkoutPlanScreen from "./screens/fitnessPlanTabScreens/workoutPlansScreenComponents/CreateNewWorkoutPlanScreen";
import EditWorkoutPlanScreen from "./screens/fitnessPlanTabScreens/workoutPlansScreenComponents/EditWorkoutPlanScreen";
import IndividualWorkoutPlanScreen from "./screens/fitnessPlanTabScreens/workoutPlansScreenComponents/IndividualWorkoutPlanScreen";
import UserProfileScreen from "./screens/contentViewScreens/UserProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const FooterNavigator = ({ handleAuthChange }) => {
  const handleSwitchPage = (page) => {
    console.log(page);
    navigation.navigate(page);
  };

  return (
    <Stack.Navigator
      initialRouteName="PersonalProfile"
      screenOptions={{
        headerShown: false,
        animation: "none",
        // tabBarShowLabel: false,
      }}
    >
      {/* Changed to only display workout plans */}
      <Stack.Screen name="FitnessPlans" component={WorkoutPlansScreen} />

      {/* Changed to display saved exercises */}
      <Stack.Screen name="SavedExercises" component={SavedExercisesScreen} />

      <Stack.Screen name="search" component={SearchScreen} />

      <Stack.Screen name="PersonalProfile" initialParams={{ userId: "" }}>
        {(props) => (
          <PersonalProfileScreen
            {...props}
            handleAuthChange={handleAuthChange}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="FriendFeed" component={FriendFeedScreen} />

      {/* <Stack.Screen name="journal" component={JournalScreen} /> */}
      <Stack.Screen name="followingList" component={FollowingScreen} />
      <Stack.Screen name="followersList" component={FollowersScreen} />
      <Stack.Screen name="ExerciseScreen" component={ExerciseScreen} />
      {/* <Stack.Screen name="dms" component={DirectMessagesScreen} /> */}
      <Stack.Screen
        name="CreateNewWorkoutPlan"
        component={CreateNewWorkoutPlanScreen}
      />
      <Stack.Screen name="EditWorkoutPlan" component={EditWorkoutPlanScreen} />
      <Stack.Screen
        name="IndividualWorkoutScreen"
        component={IndividualWorkoutPlanScreen}
      />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};
export default FooterNavigator;
