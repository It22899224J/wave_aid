import { createStackNavigator } from "@react-navigation/stack";
import OrganizeEvents from "../organize-event/organize/OrganizeEvents";
import SelectEventLocation from "../organize-event/organize/SelectEventLocation";
import EventDetails from "../events-view/EventDetails";
import OrganizedEvents from "../update-event/OrganizedEvents";
import UpdateOrganizeEvents from "../update-event/UpdateOrganizeEvents";
import UpdateEventLocation from "../update-event/UpdateEventLocation";
import OrganizedEventsPast from "../update-event/OrganizedEventsPast";
import AdminMainScreen from "./AdminMainScreen";
import UpdateOrganizeEventsPast from "../update-event/UpdateOrganizeEventsPast";
import PastEvents from "../past-events/PastEvents";
import PastEventDetails from "../past-events/PastEventDetails";
import MyEvents from "../my-events/MyEvents";
import UpdateEventLocationPast from "../update-event/UpdateEventLocationPast";
import EventCompletionForm from "../events-view/EventCompleteForm";
const Stack = createStackNavigator();

export const AdminMainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={AdminMainScreen}
        options={{ headerShown:false}}
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
        name="OrganizedEventsPast"
        component={OrganizedEventsPast}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="UpdateOrganizeEventsPast"
        component={UpdateOrganizeEventsPast}
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
      <Stack.Screen
        name="EventCompleteForm"
        component={EventCompletionForm}
        options={{
          headerTitle: "Event Completion Form",
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
        name="UpdateEventLocationPast"
        component={UpdateEventLocationPast}
        options={{ headerShown:false, headerTitleAlign: "center" }}
      />

      <Stack.Screen
        name="PastEvents"
        component={PastEvents}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="PastEventDetails"
        component={PastEventDetails}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="MyEventDetails"
        component={EventDetails}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="MyEvents"
        component={MyEvents}
        options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
};
