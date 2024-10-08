import { BusContext } from '@/context/BusContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const BookingCanceledScreen = () => {
    const route = useRoute();
    const { busId, userBookedSeats } = route.params as { busId: string; userBookedSeats: string[] };
    const { buses } = useContext(BusContext);
    const navigation = useNavigation();

    // Find the specific bus details
    const busDetails = buses.find(bus => bus.id === busId);

    if (!busDetails) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Bus details not found.</Text>
            </View>
        );
    }

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
                    <Text style={styles.detailText}>{userBookedSeats.join(', ')}</Text>
                    <Text style={styles.label}>Seat Numbers</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}></Text>
                    <Text style={styles.label}>Event</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>{busDetails.departureTime}</Text>
                    <Text style={styles.label}>Depature Time</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>{busDetails.pickupLocation}</Text>
                    <Text style={styles.label}>PickUp Location</Text>
                </View>
            </View>

            {/* Go Back Button */}
            <TouchableOpacity
                onPress={() => { navigation.navigate('SelectBus' as never) }}
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
        marginTop: 40,
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
