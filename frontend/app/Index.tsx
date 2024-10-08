import React, { useCallback, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "./events/main-screen/EventsMainView";
import Icon from "react-native-vector-icons/Ionicons";
import Profile from "./profile/Profile";
import { useAuth } from "@/context/AuthContext";
import { AllUserProvider, useAllUser } from "@/context/AllUserContext";
import AdminProfile from "./admin/admin-profile/AdminProfile";
import AdminHome from "./admin/admin-home/AdminHome";
import { AnalysisStack } from "./analysis/AnalysisStack";
import { ReportStack } from "./report/ReportStack";
import { EventStack } from "./events/main-screen/EventStack";
import AdminUserManagementStack from "./admin/admin-user-management/AdminUserManagementStack";
import Loader from "@/components/loader/Loader";
import BookingConfirmation from "./events/book-a-seat/BookingConfirmation";
import { AdminMainStack } from "./events/admin-screens/AdminMainStack";
import { Booking } from "./events/book-a-seat/BookingNav";



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

  if (loading) return <Loader />;
  if (allUserLoading || authLoading) return <Loader />;

  return (
    <Tab.Navigator>
      {userRole == "User" ? (
        <>
          {/* USER TAB SCREENS HERE */}
          <Tab.Screen
            name="Home"
            component={EventStack}
            options={{
              headerTitle: "Beach Cleanup Events",
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
            name="Admin Home"
            component={AdminHome}
            options={{
              // headerShown: false,
              headerTitle: "Admin Home",
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />

          <Tab.Screen
            name="Admin User Management"
            component={AdminUserManagementStack}
            options={{
              headerShown: false,
              // headerTitle: "Admin User Dashboard",
              tabBarIcon: ({ color, size }) => (
                <Icon name="people" color={color} size={size} />
              ),
              tabBarLabel: "User Management",
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
            name="Admin Profile"
            component={AdminProfile}
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
