import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import BusSeatLayout from '@mindinventory/react-native-bus-seat-layout';

interface Seat {
    id: string;
    type: 'available' | 'booked';
}

const SeatBooking: React.FC = () => {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const onSeatSelected = (seatId: string) => {
        setSelectedSeats(prevSelectedSeats =>
            prevSelectedSeats.includes(seatId)
                ? prevSelectedSeats.filter(s => s !== seatId)
                : [...prevSelectedSeats, seatId]
        );
    };

    const onConfirmBooking = () => {
        // Handle booking confirmation logic
        console.log('Booked Seats:', selectedSeats);
    };

    // Example seat map
    const busSeatMap: Seat[] = [
        { id: '1', type: 'available' },
        { id: '2', type: 'available' },
        { id: '3', type: 'booked' },
        { id: '4', type: 'available' },
        // Add more seats as needed
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Seats</Text>
            <BusSeatLayout
                seatSelection={selectedSeats}
                onSeatSelected={onSeatSelected}
                busSeatMap={busSeatMap}
            />
            <Button title="Confirm Booking" onPress={onConfirmBooking} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default SeatBooking;
