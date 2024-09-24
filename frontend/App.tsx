import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Index from "./app/Index";
import SignUp from "./app/SignUp";
import SignIn from "./app/SignIn";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthContext
import { AllUserProvider } from "./context/AllUserContext";
import ReportMainView from "./app/report/report-screen/ReportMainView";
import ReportAreaPage from "./app/report/report-area/ReportAreaPage";
import ReportedAreasPage from "./app/report/reported-areas/ReportedAreasPage";
import BusSetup from "./app/admin/admin-transporation/CreateBus";
import SelectLocation from "./app/admin/admin-transporation/SelectLocation";
import Loader from "./components/loader/Loader";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AllUserProvider>
        <NavigationContainer>
          <RootLayout />
        </NavigationContainer>
      </AllUserProvider>
    </AuthProvider>
  );
}

function RootLayout() {
  const { user, loading } = useAuth(); // Use user and loading from AuthContext

  if (loading) return <Loader />;

  return (
    <Stack.Navigator>
      {user ? (
        // If user is authenticated, show main app screen
        <>
          <Stack.Screen
            name="index"
            component={Index}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportMainView"
            component={ReportMainView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportAreaPage"
            component={ReportAreaPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ReportedAreasPage"
            component={ReportedAreasPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BusSetup" // Add the CreateBus screen
            component={BusSetup}
            options={{ headerTitle: "Create Bus" }} // You can adjust header options
          />
          <Stack.Screen
            name="SelectLocation"
            component={SelectLocation}
            options={{ title: "Select Location" }}
          />
        </>
      ) : (
        // If user is not authenticated, show SignIn and SignUp screens
        <>
          <Stack.Screen
            name="signin"
            component={SignIn}
            options={{ headerTitle: "Sign In" }}
          />
          <Stack.Screen
            name="signup"
            component={SignUp}
            options={{ headerTitle: "Sign Up" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
