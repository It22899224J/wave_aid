import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../service/firebase';
import SeatsLayout from "@mindinventory/react-native-bus-seat-layout";
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SeatBooking: React.FC = () => {
    const route = useRoute();
    const busId = (route.params as { busId: string }).busId;
    const navigation = useNavigation();
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
                                setBookedSeats([]); // Clear booked seats after update
                                navigation.navigate('BookingConfirmation' as never, {
                                    busId,
                                    bookedSeats,
                                } as never);
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
                        seatType: 'women',
                    };
                }
            }
            return null;
        })
        .filter((seat: { seatNumber: number; seatType: string } | null) => seat !== null) || [];



    return (
        <View style={styles.container}>
            {/* Seat status legend */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#B2B2B2' }]} />
                    <Text>Available</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#FF0000' }]} />
                    <Text>Booked</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#0000FF' }]} />
                    <Text>Selected</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#00FF00' }]} />
                    <Text>Your Bookings</Text>
                </View>
            </View>

            <ScrollView>
                <SeatsLayout
                    row={(busDetails?.rows) + 1 || 14}  // Default to 14 rows if not available
                    layout={layout}                     // Dynamically adjust layout
                    selectedSeats={selectedSeats}        // Pre-booked seats
                    numberTextStyle={{ fontSize: 12 }}
                    seatImage={{ image: require("../../../assets/images/seat.png"), tintColor: '#B2B2B2' }} // Default color for available seats
                    getBookedSeats={(seats) => {
                        const bookedSeatNumbers = seats.map(seat => seat.seatNo).filter((seatNo): seatNo is number => seatNo !== undefined);
                        console.log('Booked Seat IDs:', bookedSeatNumbers, user?.uid);
                        setBookedSeats(bookedSeatNumbers); // Store the booked seats
                    }}
                />
            </ScrollView>

            <View>
                <TouchableOpacity style={styles.bookButton} onPress={handleSeatBooking}>
                    <Text style={styles.bookButtonText}>Book Seat</Text>
                </TouchableOpacity>

                {/* Cancel All Bookings button */}
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAllBookings} disabled={userBookedSeats.length === 0}>
                    <Text style={styles.cancelButtonText}>Cancel All Bookings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendBox: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 5,
    },
    bookButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF0000',
    },
    cancelButtonText: {
        color: '#FF0000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default SeatBooking;
