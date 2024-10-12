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
import EventCompletionForm from "../events-view/EventCompleteForm";
import BookingCanceledScreen from "../book-a-seat/BookingCanceled";
import BookingConfirmation from "../book-a-seat/BookingConfirmation";
import SeatBooking from "../book-a-seat/BusLayout";
import SelectBus from "../book-a-seat/SelectBus";
const Stack = createStackNavigator();

export const EventStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerShown:false }}
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
        options={{ headerTitle: "MyEventDetails", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="MyEvents"
        component={MyEvents}
        options={{ headerTitle: "MyEvents", headerTitleAlign: "center" }}
      />
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
            <Stack.Screen
                name="BookingConfirmation"
                component={BookingConfirmation}
                options={{ title: "BookingConfirmation" }}
            />
            <Stack.Screen
                name="BookingCanceled"
                component={BookingCanceledScreen}
                options={{ title: "BookingCanceled" }}
            />
      <Stack.Screen
        name="EventCompleteForm"
        component={EventCompletionForm}
        options={{
          headerTitle: "Event Completion Form",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
