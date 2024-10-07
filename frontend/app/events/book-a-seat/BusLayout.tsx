import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute to get navigation params
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../../service/firebase'; // Your Firebase config
import SeatsLayout from "@mindinventory/react-native-bus-seat-layout";
import SleeperSeatIcon from "../../../assets/images/seat.png";
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';


const SeatBooking: React.FC = () => {

    const route = useRoute(); // Get route object
    const busId = (route.params as { busId: string }).busId; // Access busId from route params
    const navigation = useNavigation();
    const { user } = useAuth();

    const [busDetails, setBusDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [bookedSeats, setBookedSeats] = useState<number[]>([]);

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
                // Show confirmation alert
                Alert.alert(
                    "Confirm Booking", // Title
                    `Are you sure you want to book these seats: ${bookedSeats.join(', ')}?`,
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: async () => {
                                // Proceed with booking if "OK" is pressed
                                const busRef = doc(db, 'buses', busId);

                                const updatedSeats = busDetails.seats.map((seat: { seatNumber: number; }) => {
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

                                setBookedSeats([]); // Clear the booked seats after booking

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

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }
    const selectedSeats = busDetails?.seats
        ?.filter((seat: any) => seat.status === 'booked') // Only include booked seats
        .map((seat: any) => ({
            seatNumber: seat.seatNumber,
            seatType: 'booked',
        })) || [];

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Render seat layout */}
                <SeatsLayout
                    row={(busDetails?.rows) + 1 || 14}
                    layout={layout}
                    selectedSeats={selectedSeats}
                    numberTextStyle={{ fontSize: 12 }}
                    seatImage={{ image: SleeperSeatIcon, tintColor: '#B2B2B2' }}
                    getBookedSeats={(seats) => {
                        const bookedSeatNumbers = seats.map(seat => seat.seatNo).filter((seatNo): seatNo is number => seatNo !== undefined); // Update to match your seat property
                        console.log('Booked Seat IDs:', bookedSeatNumbers, user?.uid);
                        setBookedSeats(bookedSeatNumbers); // Update the state with booked seats
                    }}
                />
            </ScrollView>
            <View>
                <TouchableOpacity onPress={handleSeatBooking}>
                    <Text style={styles.title}>Book Seat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default SeatBooking;
