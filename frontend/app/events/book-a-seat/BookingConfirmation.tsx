import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BusContext } from '@/context/BusContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookingConfirmation = () => {
    const route = useRoute();
    const { busId, bookedSeats } = route.params as { busId: string; bookedSeats: string[] };
    const { buses } = useContext(BusContext);
    const navigation = useNavigation();

    const busDetails = buses.find(bus => bus.id === busId);

    if (!busDetails) {
        return <Text style={styles.errorText}>Bus not found</Text>;
    }

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
                        <Text style={styles.detailValue}>{bookedSeats.join(', ')}</Text>
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
                        <Text style={styles.detailValue}></Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={24} color="gray" />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Pick Up Location</Text>
                        <Text style={styles.detailValue}>{busDetails.pickupLocation}</Text>
                    </View>
                    <TouchableOpacity onPress={openLocationInMap}>
                        <Text style={styles.viewText}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => { navigation.navigate('MyEventsBooking' as never) }}
                style={styles.goBackButton}>
                <Text style={styles.goBackText}>Go back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Your existing styles...
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
    goBackButton: {
        backgroundColor: '#00acf0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
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
});

export default BookingConfirmation;
