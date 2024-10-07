import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./EventsMainView";
import OrganizeEvents from "../organize-event/organize/OrganizeEvents";
import UpcommingEventsView from "./UpcommingEventsView";
import UpcommingEventWrap from "./UpcommingEventWrap";
import SelectEventLocation from "../organize-event/organize/SelectEventLocation";
const Stack = createStackNavigator();

export const EventStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerTitle: "Events", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="OrganizeEvents"
        component={OrganizeEvents}
        options={{ headerTitle: "Organize Events", headerTitleAlign: "center" }}
      />
      {/* <Stack.Screen
        name="UpcommingEventWrap"
        component={UpcommingEventWrap}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      /> */}
      <Stack.Screen
        name="SelectEventLocation"
        component={SelectEventLocation}
        options={{
          headerTitle: "Select Event Location",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
