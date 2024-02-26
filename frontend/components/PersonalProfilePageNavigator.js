import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import JournalScreen from "./screens/personalProfileTabSreens/JournalScreen";
import PersonalProfileMenuScreen from "./screens/personalProfileTabSreens/PersonalProfileMenuScreen";

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
      >
        {props => <PersonalProfileMenuScreen {...props} handleAuthChange={handleAuthChange} />}
      </Stack.Screen>
      <Stack.Screen name="journal" component={JournalScreen} />
    </Stack.Navigator>
  );
}
