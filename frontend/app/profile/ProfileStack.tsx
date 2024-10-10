import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./Profile";
import ProfileUpdate from "./ProfileUpdate";

const Stack = createStackNavigator();

export const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        headerTitle: "Profile",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ProfileUpdate"
      component={ProfileUpdate}
      options={{
        headerTitle: "Profile Update",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
