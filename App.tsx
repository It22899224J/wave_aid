import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, Alert } from "react-native";
import Index from "./app/Index";
import SignUp from "./app/SignUp";
import SignIn from "./app/SignIn";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthContext
import { AllUserProvider } from "./context/AllUserContext";

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

  if (loading) {
    // Show loading spinner while checking user authentication state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // If user is authenticated, show main app screen
        <Stack.Screen
          name="index"
          component={Index}
          options={{ headerShown: false }}
        />
      ) : (
        // If user is not authenticated, show SignIn and SignUp screens
        <>
          <Stack.Screen
            name="signin"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signup"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
