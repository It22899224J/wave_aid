import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import MainScreen from "./events/main-screen/EventsMainView";
import ReportMainView from "./report/report-screen/ReportMainView";
import ReportAreaPage from "./report/report-area/ReportAreaPage";
import AnalysisDashboard from "./analysis/AnalysisDashboard";
import Ionicons from "@expo/vector-icons/Ionicons";
import Profile from "./profile/Profile";

const Tab = createBottomTabNavigator();

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen
          name="Main"
          component={MainScreen}
          key={1}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={18}
                color={focused ? "blue" : "black"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Analysis-Dashboard"
          component={AnalysisDashboard}
          key={2}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="stats-chart"
                size={18}
                color={focused ? "blue" : "black"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          key={3}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person"
                size={18}
                color={focused ? "blue" : "black"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Index;
