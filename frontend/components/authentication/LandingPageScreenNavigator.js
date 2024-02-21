import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import LandingPageMenu from "./LandingPageMenu";
import SignupScreen from "./SignupScreen";

const Stack = createNativeStackNavigator();

export default function FooterNavigator({ handleAuthChange }) {
  return (
    <Stack.Navigator
      initialRouteName="LandingPageMenu"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="landingPageMenu" component={LandingPageMenu} /> */}
      {/* <Stack.Screen name="loginScreen" component={LoginScreen} /> */}
      <Stack.Screen name="landingPageMenu">
        {(props) => (
          <LandingPageMenu {...props} handleAuthChange={handleAuthChange} />
        )}
      </Stack.Screen>
      <Stack.Screen name="loginScreen">
        {(props) => (
          <LoginScreen {...props} handleAuthChange={handleAuthChange} />
        )}
      </Stack.Screen>
      <Stack.Screen name="signupScreen">
        {(props) => (
          <SignupScreen {...props} handleAuthChange={handleAuthChange} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
