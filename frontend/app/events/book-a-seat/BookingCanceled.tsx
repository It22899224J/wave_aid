import { BusContext } from '@/context/BusContext';
import { db } from '@/service/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';

type BookingCancelRoutes = {
    SelectBus: {
        eventId: string
    };
    BookingCanceled: undefined;
};

type BookingConfirmationNavigationProp = StackNavigationProp<BookingCancelRoutes, 'BookingCanceled'>;

const BookingCanceledScreen = () => {
    const route = useRoute();
    const { busId, userBookedSeats, canceledSeats } = route.params as { busId: string; userBookedSeats: string[], canceledSeats: any };
    const { buses } = useContext(BusContext);
    const navigation = useNavigation<BookingConfirmationNavigationProp>();
    const [eventDate, setEventDate] = useState<Date>();

    // Find the specific bus details
    const busDetails = buses.find(bus => bus.id === busId);

    if (!busDetails) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Bus details not found.</Text>
            </View>
        );
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

    return (

        <View style={styles.container}>
            <Text style={styles.header}>Booking Canceled</Text>

            {/* Bus Image */}
            <Image
                source={{ uri: busDetails.imageUrl }} // Assuming busDetails has an imageUrl field
                style={styles.image}
            />

            <Text style={styles.description}></Text>

            <Text style={styles.infoText}>
                We're sorry to inform you that your booking has been canceled.
            </Text>

            {/* Details Section */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>Seat Numbers</Text>
                    <Text style={styles.label}>{userBookedSeats && userBookedSeats.length > 0 ? userBookedSeats.join(', ') : canceledSeats.join(', ')}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>Event Date</Text>
                    <Text style={styles.label}>{new Date(eventDate as any).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>Depature Time</Text>
                    <Text style={styles.label}>{busDetails.departureTime}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>PickUp Location</Text>
                    <Text style={styles.label}>{busDetails.pickupLocationName}</Text>
                </View>
            </View>

            {/* Go Back Button */}
            <TouchableOpacity
                onPress={() => {
                    if (busDetails.eventID) {
                        navigation.navigate('SelectBus', { eventId: busDetails.eventID });
                    } else {
                        Alert.alert("Error", "Event ID is missing.");
                    }
                }}
                style={styles.goBackButton}>
                <Text style={styles.goBackText}>Go back</Text>
            </TouchableOpacity>
        </View>

    );
};

export default BookingCanceledScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
    },
    image: {
        width: 300,
        height: 150,
        marginTop: 20,
        borderRadius: 10,
    },
    description: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10,
        color: '#333',
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
    detailsContainer: {
        width: '100%',
        marginTop: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailBox: {
        width: '48%',
        backgroundColor: '#f1f1f1',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    detailText: {
        fontSize: 16,
        fontWeight: '500',
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    goBackButton: {
        marginTop: 30,
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 8,
    },
    goBackText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        fontSize: 18,
        color: '#f00',
        textAlign: 'center',
        marginTop: 50,
    },
});
