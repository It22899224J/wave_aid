import React, { useCallback, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import MainScreen from "./events/main-screen/EventsMainView";
import UpcommingEvents from "./events/main-screen/UpcommingEvents";
import ReportMainView from "./report/report-screen/ReportMainView";
import ReportAreaPage from "./report/report-area/ReportAreaPage";
import Icon from "react-native-vector-icons/Ionicons";
import Profile from "./profile/Profile";
import { useAuth } from "@/context/AuthContext";
import { useAllUser } from "@/context/AllUserContext";
import AdminProfile from "./admin/admin-profile/AdminProfile";
import AdminHome from "./admin/admin-home/AdminHome";
import { createStackNavigator } from "@react-navigation/stack";
import ReportedAreasPage from "./report/reported-areas/ReportedAreasPage";
import { AnalysisStack } from "./analysis/AnalysisStack";
import SelectBus from "./events/book-a-seat/SelectBus";
import SeatBooking from "./events/book-a-seat/BusLayout";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ReportStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReportMainView"
        component={ReportMainView}
        options={{ headerTitle: "Report", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="ReportAreaPage"
        component={ReportAreaPage}
        options={{ headerTitle: "Report Area", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="ReportedAreasPage"
        component={ReportedAreasPage}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
};

const Booking = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SelectBus"
        component={SelectBus}
        options={{ headerTitle: "Select Bus" }}
      />
      <Stack.Screen
        name="BusLayout"
        component={SeatBooking}
        options={{ headerTitle: "Bus Layout" }}
      />
    </Stack.Navigator>
  );
};

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
    <Tab.Navigator>
      {userRole == "User" ? (
        <>
          {/* USER TAB SCREENS HERE */}
          <Tab.Screen
            name="Home"
            component={MainScreen}
            options={{
              headerTitle: "Beach Cleanup Events",
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
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
            name="Booking"
            component={Booking}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="bus" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Profile"
            component={Profile}
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
  );
};

export default Index;
