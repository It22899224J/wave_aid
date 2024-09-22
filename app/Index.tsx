import React, { useCallback, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import MainScreen from "./events/main-screen/EventsMainView";
import ReportMainView from "./report/report-screen/ReportMainView";
import ReportAreaPage from "./report/report-area/ReportAreaPage";
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon component
import AnalysisDashboard from "./analysis/AnalysisDashboard";
import Ionicons from "@expo/vector-icons/Ionicons";
import Profile from "./profile/Profile";
import { useAuth } from "@/context/AuthContext";
import { useAllUser } from "@/context/AllUserContext";
import AdminProfile from "./admin/admin-profile/AdminProfile";
import AdminHome from "./admin/admin-home/AdminHome";

const Tab = createBottomTabNavigator();

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { users, loading: allUserLoading } = useAllUser();
  const [userRole, setUserRole] = useState<"User" | "Admin">("User");

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
  }, [initializeUserDetails]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator>
        {userRole == "User" ? (
          <>
            {/* USER TAB SCREENS HERE */}
            <Tab.Screen
              name="Home"
              component={MainScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="home" color={color} size={size} />
                ),
              }}
            />

            <Tab.Screen
              name="Analysis"
              component={AnalysisDashboard}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="analytics" color={color} size={size} />
                ),
              }}
            />

            <Tab.Screen
              name="Report"
              component={ReportMainView}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon
                    name="document-text-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />

            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="person" color={color} size={size} />
                ),
              }}
            />
          </>
        ) : (
          <>
            {/* ADMIN TAB SCREENS HERE */}
            <Tab.Screen
              name="Admin Home"
              component={AdminHome}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="person" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Admin Profile"
              component={AdminProfile}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon name="person" color={color} size={size} />
                ),
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Index;
