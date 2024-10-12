import { createStackNavigator } from "@react-navigation/stack";
import AdminProfile from "./AdminProfile";
import AdminUpdateProfile from "./AdminUpdateProfile";

const Stack = createStackNavigator();

export const AdminProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminProfile"
      component={AdminProfile}
      options={{
        headerShown: false,
        // headerTitle: "Analysis Dashboard",
      }}
    />
    <Stack.Screen
      name="AdminUpdateProfile"
      component={AdminUpdateProfile}
      options={{
        headerShown: false,
        // headerTitle: "Analysis Dashboard",
      }}
    />
  </Stack.Navigator>
);
