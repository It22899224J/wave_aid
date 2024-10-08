import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../service/firebase';
import SeatsLayout from "@mindinventory/react-native-bus-seat-layout";
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    SeatBooking: { busId: string };
    BookingConfirmation: { busId: string; bookedSeats: number[] };
    BookingCanceled: { busId: string; userBookedSeats: number[] }
};

type SeatBookingRouteProp = RouteProp<RootStackParamList, 'SeatBooking'>;
type SeatBookingNavigationProp = NavigationProp<RootStackParamList>;

const SeatBooking: React.FC = () => {
    const route = useRoute<SeatBookingRouteProp>();
    const navigation = useNavigation<SeatBookingNavigationProp>();
    const { busId } = route.params;
    const { user } = useAuth();

    const [busDetails, setBusDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bookedSeats, setBookedSeats] = useState<number[]>([]);
    const [userBookedSeats, setUserBookedSeats] = useState<number[]>([]);

    const layout = busDetails?.seatsPerRow === 4 ? { columnOne: 2, columnTwo: 2 } : { columnOne: 2, columnTwo: 3 };

    useEffect(() => {
        const fetchBusDetails = async () => {
            try {
                if (busId) {
                    const busRef = doc(db, 'buses', busId);
                    const busSnap = await getDoc(busRef);

                    if (busSnap.exists()) {
                        const busData = busSnap.data();
                        setBusDetails(busData);

                        const userSeats = busData.seats.filter((seat: any) => seat.status === 'booked' && seat.userID === user?.uid);
                        setUserBookedSeats(userSeats.map((seat: any) => seat.seatNumber));
                    } else {
                        setError('Bus not found');
                    }
                }
            } catch (err) {
                setError('Error fetching bus details');
            } finally {
                setLoading(false);
            }
        };

        fetchBusDetails();
    }, [busId]);

    const handleSeatBooking = async () => {
        try {
            if (bookedSeats.length > 0) {
                Alert.alert(
                    "Confirm Booking",
                    `Are you sure you want to book these seats: ${bookedSeats.join(', ')}?`,
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: async () => {
                                const busRef = doc(db, 'buses', busId);
                                const updatedSeats = busDetails.seats.map((seat: { seatNumber: number; userID?: string | null; status: string; }) => {
                                    if (bookedSeats.includes(seat.seatNumber)) {
                                        return {
                                            ...seat,
                                            status: 'booked',
                                            userID: user?.uid
                                        };
                                    }
                                    return seat;
                                });

                                await updateDoc(busRef, { seats: updatedSeats });
                                console.log('Seats booked:', bookedSeats);
                                setBookedSeats([]);
                                navigation.navigate('BookingConfirmation', {
                                    busId,
                                    bookedSeats,
                                });
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelAllBookings = async () => {
        if (userBookedSeats.length > 0) {
            Alert.alert(
                "Confirm Cancellation",
                `Are you sure you want to cancel the bookings for seats: ${userBookedSeats.join(', ')}?`,
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
                                const updatedSeats = busDetails.seats.map((seat: { seatNumber: number; userID?: string | null; status: string; }) => {
                                    if (userBookedSeats.includes(seat.seatNumber) && seat.userID === user?.uid) {
                                        return {
                                            ...seat,
                                            status: 'available', // Mark seat as available
                                            userID: null
                                        };
                                    }
                                    return seat;
                                });

                                await updateDoc(busRef, { seats: updatedSeats });
                                console.log('Seats canceled:', userBookedSeats);

                                setUserBookedSeats([]); // Clear user booked seats after cancellation
                                navigation.navigate('BookingCanceled', { busId, userBookedSeats });
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert("No booked seats", "You have no seats booked to cancel.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    const selectedSeats = busDetails?.seats
        ?.map((seat: any) => {
            // Keep booked seats that belong to the current user unchanged
            if (seat.status === 'booked') {
                if (seat.userID === user?.uid) {
                    return {
                        seatNumber: seat.seatNumber,
                        seatType: 'booked',
                    };
                } else {
                    return {
                        seatNumber: seat.seatNumber,
                        seatType: 'bookedByothers',
                    };
                }
            }
            return null;
        })
        .filter((seat: { seatNumber: number; seatType: string } | null) => seat !== null) || [];

    return (
        <View style={styles.container}>
            <View style={styles.legendContainer}>
                {/* First row for Available and Booked */}
                <View style={[styles.legendRow, { marginRight: 18 }]}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#B2B2B2' }]} />
                        <Text style={styles.legendText}>Available</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#FF0000' }]} />
                        <Text style={[styles.legendText]}>Booked</Text>
                    </View>
                </View>
                {/* Second row for Selected and Your Bookings */}
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#0000FF' }]} />
                        <Text style={styles.legendText}>Selected</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#5FBB80' }]} />
                        <Text style={styles.legendText}>Your Bookings</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={{ flexGrow: 1 }}>
                <View style={styles.seatsLayoutContainer}>
                    <SeatsLayout
                        row={(busDetails?.rows) + 1 || 14}
                        layout={layout}
                        selectedSeats={selectedSeats}
                        numberTextStyle={{ fontSize: 12 }}
                        seatImage={{ image: require("../../../assets/images/seat.png"), tintColor: '#B2B2B2' }}
                        getBookedSeats={(seats) => {
                            const bookedSeatNumbers = seats.map(seat => seat.seatNo).filter((seatNo): seatNo is number => seatNo !== undefined);
                            console.log('Booked Seat IDs:', bookedSeatNumbers, user?.uid);
                            setBookedSeats(bookedSeatNumbers);
                        }}
                    />
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.bookButton} onPress={handleSeatBooking}>
                    <Text style={styles.bookButtonText}>Book Seat</Text>
                </TouchableOpacity>

                {/* Cancel All Bookings button */}
                {userBookedSeats.length > 0 && ( // Only render if there are booked seats
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelAllBookings}
                    >
                        <Text style={styles.cancelButtonText}>Cancel All Bookings</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#161A35',
        flex: 1, // Ensure container takes full height
    },
    legendContainer: {
        marginTop: 20,
        padding: 30,
        backgroundColor: '#161A35',
        alignItems: 'center',
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendBox: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 100,
        borderWidth: 1,
    },
    legendText: {
        color: '#fff',
    },
    bookButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: 150, // Set the desired width for the button
        alignSelf: 'center', // Center the button horizontally
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: 150,
        alignSelf: 'center',
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    buttonContainer: {
        backgroundColor: '#fff',
        paddingBottom: 20
    },
    seatsLayoutContainer: {
        paddingBottom: 20, // Add some padding if needed
    }
});

export default SeatBooking;
