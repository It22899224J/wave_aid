import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./EventsMainView";
import UpcommingEventsView from "./UpcommingEventsView";
import UpcommingEventWrap from "./UpcommingEventWrap";
import OrganizeEvents from "../organize-event/organize/OrganizeEvents";
import SelectEventLocation from "../organize-event/organize/SelectEventLocation";
import EventDetails from "../events-view/EventDetails";
import OrganizedEvents from "../update-event/OrganizedEvents";
import UpdateOrganizeEvents from "../update-event/UpdateOrganizeEvents";
import UpdateEventLocation from "../update-event/UpdateEventLocation";
import MyEventDetails from "../my-events/MyEventDetails";
import MyEvents from "../my-events/MyEvents";
import OrganizedEventsPast from "../update-event/OrganizedEventsPast";
import PastEvents from "../past-events/PastEvents";
import PastEventDetails from "../past-events/PastEventDetails";
import { Booking } from "../book-a-seat/BookingNav";
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
        options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="OrganizedEventsPast"
        component={OrganizedEventsPast}
        options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="UpdateOrganizeEvents"
        component={UpdateOrganizeEvents}
        options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="SelectEventLocation"
        component={SelectEventLocation}
        options={{
          headerTitle: "Select Event Location",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="UpdateEventLocation"
        component={UpdateEventLocation}
        options={{
          headerTitle: "Select Event Location",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="PastEvents"
        component={PastEvents}
        options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="PastEventDetails"
        component={PastEventDetails}
        options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="MyEventDetails"
        component={EventDetails}
        options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="MyEvents"
        component={MyEvents}
        options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
};
