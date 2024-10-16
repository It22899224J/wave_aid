import React, { useCallback, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { ProfileStack } from "./profile/ProfileStack";
import { useAuth } from "@/context/AuthContext";
import { AllUserProvider, useAllUser } from "@/context/AllUserContext";
import { AnalysisStack } from "./analysis/AnalysisStack";
import { ReportStack } from "./report/ReportStack";
import { EventStack } from "./events/main-screen/EventStack";
import AdminUserManagementStack from "./admin/admin-user-management/AdminUserManagementStack";
import { AdminMainStack } from "./events/admin-screens/AdminMainStack";
import MyEvents from "./events/my-events/MyEvents";
import AdminReportMain from "./admin/admin-report/admin-report-main/AdminReportMain";
import { MyEventStack } from "./events/my-events/MyEventStack";


import { AdminProfileStack } from "./admin/admin-profile/AdminProfileStack";
import SplashScreen from "@/components/splash-screen/SplashScreen";
import { AdminReportStack } from "./admin/admin-report/AdminReportStack";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { users, loading: allUserLoading } = useAllUser();
  const [userRole, setUserRole] = useState<"User" | "Admin">("User");
  const [loading, setLoading] = useState(true);

  const initializeUserDetails = useCallback(() => {
    if (!allUserLoading && !authLoading) {
      const matchedUser = users?.find(
        (userDoc) => userDoc.userId === user?.uid
      );
      return matchedUser;
    }
  }, [allUserLoading, authLoading, users, user]);

  useEffect(() => {
    const details = initializeUserDetails();
    if (details) {
      setUserRole(details.role);
    }
    setLoading(false);
  }, [initializeUserDetails]);

  if (loading || authLoading || allUserLoading) return <SplashScreen />;

  return (
    <Tab.Navigator
    // screenOptions={{
    //   tabBarActiveTintColor: "#00acf0", // Active tab icon/text color
    //   tabBarInactiveTintColor: "#8e8e93", // Inactive tab icon/text color
    //   tabBarStyle: {
    //     backgroundColor: "#192f6a", // Make background transparent
    //     position: 'absolute', // Ensures the tab bar floats over content
    //     elevation: 0, // Removes shadow for Android
    //     borderTopWidth: 0, // Optional: Removes top border for iOS/Android
    //   },
      
    // }}
  >
      {userRole == "User" ? (
        <>
          {/* USER TAB SCREENS HERE */}
          <Tab.Screen
            name="Home"
            component={EventStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Report"
            component={ReportStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="document-text-outline" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Events"
            component={MyEventStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="calendar" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
              // headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="person" color={color} size={size} />
              ),
            }}
          />
        </>
      ) : (
        <>
          {/* ADMIN TAB SCREENS HERE */}
          {/* <Tab.Screen
            name="Home"
            component={AdminMainStack}
            options={{
              headerTitle: "Beach Cleanup Events",
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          /> */}

          <Tab.Screen
            name="Admin User Management"
            component={AdminUserManagementStack}
            options={{
              headerShown: false,
              // headerTitle: "Admin User Dashboard",
              tabBarIcon: ({ color, size }) => (
                <Icon name="people" color={color} size={size} />
              ),
              tabBarLabel: "Manage Users",
            }}
          />

          <Tab.Screen
            name="Analysis"
            component={AnalysisStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="analytics" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Home"
            component={AdminMainStack}
            options={{
              // headerShown: false,
              headerTitle: "Admin Home",
              headerTitleAlign: "center",
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Report"
            component={AdminReportStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="document" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Admin Profile"
            component={AdminProfileStack}
            options={{
              // headerShown: false,
              headerTitle: "Admin Profile",
              tabBarIcon: ({ color, size }) => (
                <Icon name="person" color={color} size={size} />
              ),
             
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default Index;
