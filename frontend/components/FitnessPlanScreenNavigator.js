import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WorkoutPlansScreen from './screens/fitnessPlanTabScreens/WorkoutPlansScreen';
import SavedExercisesScreen from './screens/fitnessPlanTabScreens/SavedExercisesScreen';
import RecommendedExercisesScreen from './screens/fitnessPlanTabScreens/RecommendedExercisesScreen';
import LeaderboardsScreen from './screens/fitnessPlanTabScreens/LeaderboardsScreen';
import FitnessPlansMenuScreen from './screens/fitnessPlanTabScreens/FitnessPlansMenuScreen';
import CreateNewWorkoutPlanScreen from './screens/fitnessPlanTabScreens/workoutPlansScreenComponents/CreateNewWorkoutPlanScreen';

const Stack = createNativeStackNavigator();

export default function FooterNavigator() {
  return (
    <Stack.Navigator
        initialRouteName="fitnessPlanPageMenu"
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="fitnessPlanPageMenu" component={FitnessPlansMenuScreen} />
        <Stack.Screen name="WorkoutPlans" component={WorkoutPlansScreen} />
        <Stack.Screen name="SavedExercises" component={SavedExercisesScreen} />
        <Stack.Screen name="RecommendedExercises" component={RecommendedExercisesScreen} />
        <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} />
        <Stack.Screen name="CreateNewWorkoutPlan" component={CreateNewWorkoutPlanScreen} />
    </Stack.Navigator>
  );
}