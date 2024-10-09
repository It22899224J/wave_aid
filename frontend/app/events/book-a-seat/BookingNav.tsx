
import BookingCanceledScreen from "./BookingCanceled";
import BookingConfirmation from "./BookingConfirmation";
import SeatBooking from "./BusLayout";
import SelectBus from "./SelectBus";
import { createStackNavigator } from "@react-navigation/stack";
import MyEvents from "../my-events/MyEvents";

const Stack = createStackNavigator();

export const Booking = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyEventsBooking"
                component={MyEvents}
                options={{ headerTitle: "PastEvents", headerTitleAlign: "center" }}
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

        </Stack.Navigator>
    );
};