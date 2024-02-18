import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
        }}
    >
      <Tab.Screen name="FriendFeed" component={FriendFeedScreen} />
      <Tab.Screen name="FitnessPlans" component={FitnessPlansScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="PublicFeed" component={PublicFeedScreen} />
      <Tab.Screen name="PersonalProfile">
        {props => <PersonalProfileScreen {...props} handleAuthChange={handleAuthChange} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

{/* <Stack.Screen name="signupScreen">
          {props => <SignupScreen {...props} handleAuthChange={handleAuthChange} />}
</Stack.Screen> */}