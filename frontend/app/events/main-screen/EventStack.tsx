import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./EventsMainView";
import UpcommingEventsView from "./UpcommingEventsView";
import UpcommingEventWrap from "./UpcommingEventWrap";
import OrganizeEvents from "../organize-event/organize/OrganizeEvents";
import SelectEventLocation from "../organize-event/organize/SelectEventLocation";
import EventDetails from "../events-view/EventDetails";
import OrganizedEvents from "../update-event/OrganizedEvents";
import UpdateOrganizeEvents from "../update-event/UpdateOrganizeEvents";
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
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{ headerTitle: "Organize Events", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="OrganizedEvents"
        component={OrganizedEvents}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="UpdateOrganizeEvents"
        component={UpdateOrganizeEvents}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
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
