import { createStackNavigator } from "@react-navigation/stack";
import AdminAllUser from "./admin-all-user/AdminAllUser";
import AdminUpdateUser from "./admin-update-user/AdminUpdateUser";
import AdminCreateUser from "./admin-create-user/AdminCreateUser";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator();

// Define the styles

const AdminUserManagementStack = () => {
  const styles = StyleSheet.create({
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
    },
  });
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Admin All User Dashboard"
        component={AdminAllUser}
        options={{
          // headerShown: false,
          headerTitle: "User Dashboard",
          // headerTitleStyle: styles.headerTitle,
        }}
      />

      <Stack.Screen
        name="Admin Update User"
        component={AdminUpdateUser}
        options={{
          // headerShown: false,
          headerTitle: "Update User Details",
        }}
      />

      <Stack.Screen
        name="Admin Create User"
        component={AdminCreateUser}
        options={{
          // headerShown: false,
          headerTitle: "Create User Admin",
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminUserManagementStack;
