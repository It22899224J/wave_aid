import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import MainScreen from "./events/main-screen/EventsMainView";
import ReportMainView from "./report/report-screen/ReportMainView";
import ReportAreaPage from "./report/report-area/ReportAreaPage";
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon component
import AnalysisDashboard from "./analysis/AnalysisDashboard";
import Ionicons from "@expo/vector-icons/Ionicons";
import Profile from "./profile/Profile";

const Tab = createBottomTabNavigator();

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator>


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
              <Icon name="document-text-outline" color={color} size={size} />
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
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Index;
