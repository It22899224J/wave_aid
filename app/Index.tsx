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
        <Tab.Screen name="Main" component={MainScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Index;
