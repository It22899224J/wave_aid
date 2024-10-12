import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BusContext } from '@/context/BusContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '@/service/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface BookingConfirmationRouteParams {
    busId: string;
    bookedSeats: string[];
    seatNumbers: number[];
}

interface BookingCanceledRouteParams {
    busId: string;
    canceledSeats: number[];
}


type BookingRoutes = {
    BookingConfirmation: BookingConfirmationRouteParams;
    BookingCanceled: BookingCanceledRouteParams;
    SelectBus: {
        eventId: string
    };
};


type BookingConfirmationNavigationProp = StackNavigationProp<BookingRoutes, 'BookingConfirmation'>;
type BookingConfirmationRouteProp = RouteProp<BookingRoutes, 'BookingConfirmation'>;

const BookingConfirmation: React.FC = () => {
    const navigation = useNavigation<BookingConfirmationNavigationProp>();
    const route = useRoute<BookingConfirmationRouteProp>();
    const { buses } = useContext(BusContext);
    const { busId, bookedSeats, seatNumbers } = route.params;
    const [eventDate, setEventDate] = useState<Date>();

    const busDetails = buses.find(bus => bus.id === busId);

    if (!busDetails) {
        return <Text style={styles.errorText}>Bus not found</Text>;
    }

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (busDetails.eventID) {
                const eventRef = doc(db, "events", busDetails.eventID);
                const eventSnap = await getDoc(eventRef);

                if (eventSnap.exists()) {
                    const data = eventSnap.data();
                    setEventDate(data.date)
                } else {
                    Alert.alert("Error", "Event not found.");
                }
            }
        };

        fetchEventDetails();
    }, [busDetails.eventID]);

    const openLocationInMap = () => {
        const pickupLocation = busDetails.pickupLocation; // "(6.902516788817792, 79.87774953246117)"
        const coordinates = pickupLocation.replace(/[()]/g, '').split(','); // ["6.902516788817792", " 79.87774953246117"]

        if (coordinates.length === 2) {
            const latitude = coordinates[0].trim();
            const longitude = coordinates[1].trim();
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            Linking.openURL(url).catch(() =>
                Alert.alert("Error", "Unable to open the map.")
            );
        } else {
            Alert.alert("Error", "Location information is not available.");
        }
    };

    const handleCancelAllBookings = async () => {
        if (seatNumbers.length > 0) {
            Alert.alert(
                "Confirm Cancellation",
                `Are you sure you want to cancel the bookings for seats: ${seatNumbers.join(', ')}?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: async () => {
                            try {
                                const busRef = doc(db, 'buses', busId);

                                // Update the seats in the bus by resetting the ones booked by the user
                                const updatedSeats = busDetails.seats.map((seat: { seatNumber: number; userID?: string | null; status: string; }) => {
                                    // If the seat is in the seatNumbers array and booked by this user, reset its status and userID
                                    if (seatNumbers.includes(seat.seatNumber)) {
                                        return {
                                            ...seat,
                                            status: 'available', // Mark seat as available
                                            userID: null
                                        };
                                    }
                                    return seat;
                                });

                                // Update Firestore with the modified seats array
                                await updateDoc(busRef, { seats: updatedSeats });

                                console.log('Seats canceled:', seatNumbers);

                                // Clear the booked seats in the UI after cancellation

                                navigation.navigate('BookingCanceled', { busId, canceledSeats: seatNumbers }); // Navigate to the BookingCanceled screen
                            } catch (error) {
                                console.error("Error canceling seats:", error);
                                Alert.alert("Error", "There was a problem canceling your bookings.");
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert("No booked seats", "You have no seats booked to cancel.");
        }
    };




    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Ionicons name="checkmark-circle-outline" size={32} color="#00C78B" />
                <Text style={styles.headerText}>Your Booking is Confirmed!</Text>
            </View>

            {busDetails.imageUrl && (
                <Image
                    source={{ uri: busDetails.imageUrl }}
                    style={styles.image}
                />
            )}

            <View style={styles.summary}>
                <Text style={styles.summaryText}>Booking Summary</Text>
                <Text style={styles.summaryDetails}>Details of your booking</Text>
            </View>

            <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                    <FontAwesome5 name="chair" size={24} color="gray" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Seat Numbers</Text>
                        <Text style={styles.detailValue}>
                            {bookedSeats && bookedSeats.length > 0 ? bookedSeats.join(', ') : seatNumbers.join(', ')}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={24} color="gray" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Contact Information</Text>
                        <Text style={styles.detailValue}>{busDetails.contactNumber}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons name="event" size={24} color="gray" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Event Date</Text>
                        <Text style={styles.detailValue}>
                            {new Date(eventDate as any).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Text>

                    </View>
                </View>

                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={24} color="gray" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Pick Up Location</Text>
                        <Text style={styles.detailValue}>{busDetails.pickupLocationName}</Text>
                    </View>
                    <TouchableOpacity onPress={openLocationInMap}>
                        <Text style={styles.viewText}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (busDetails.eventID) {
                            console.log(busDetails.eventID)
                            navigation.navigate('SelectBus', { eventId: busDetails.eventID });
                        } else {
                            Alert.alert("Error", "Event ID is not available.");
                        }
                    }}
                    style={styles.goBackButton}
                >
                    <Text style={styles.buttonText}>Go back</Text>
                </TouchableOpacity>

                <View style={styles.buttonSpacing} />

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelAllBookings}
                >
                    <Text style={styles.buttonText}>Cancel All Bookings</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    headerText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00C78B',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    summary: {
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryDetails: {
        color: 'gray',
    },
    bookingDetails: {
        backgroundColor: '#F4F9FB',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    detailTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: 'gray',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewText: {
        color: '#00acf0',
        fontWeight: 'bold',
    },

    goBackText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
    },

    cancelButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row', // Align buttons in a row
        justifyContent: 'space-between', // Distribute space between the buttons
        marginTop: 30,
        marginBottom: 20,
    },
    button: {
        flex: 1, // Allow buttons to take equal space
        paddingVertical: 10, // Adjusted padding for smaller button size
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonSpacing: {
        marginLeft: 10, // Space between buttons
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14, // Change font size to 15
        textAlign: 'center', // Center the text
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    goBackButton: {
        backgroundColor: '#00acf0',
        paddingVertical: 10, // Adjust padding for smaller button size
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center', // Ensure content is centered
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 10, // Adjust padding for smaller button size
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center', // Ensure content is centered
        flex: 1,
    },
});

export default BookingConfirmation;
