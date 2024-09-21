import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import MainScreen from "./events/main-screen/EventsMainView";


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
