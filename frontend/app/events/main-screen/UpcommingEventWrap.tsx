import React from "react";

import { View, Text } from "react-native";

import { RouteProp } from "@react-navigation/native";

import { StackNavigationProp } from "@react-navigation/stack";
import UpcommingEventsView, { CardProps } from "./UpcommingEventsView";

type RootStackParamList = {
  "upcomming event": {
    event: CardProps; 
  };
};

type UpcommingEventWrapProps = {
  route: RouteProp<RootStackParamList, "upcomming event">;

  navigation: StackNavigationProp<RootStackParamList, "upcomming event">;
};

const UpcommingEventWrap: React.FC<UpcommingEventWrapProps> = ({
  route,
  navigation,
}) => {

    const { event } = route.params; 
  return (
    <View style={{ flex: 1 }}>
      <UpcommingEventsView event={event} /> {/* Pass event to your component */}
    </View>
  );
};

export default UpcommingEventWrap;
