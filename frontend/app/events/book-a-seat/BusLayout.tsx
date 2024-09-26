import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import SeatsLayout from "@mindinventory/react-native-bus-seat-layout";
import SleeperSeatIcon from "../../../assets/images/icon.png"

const SeatBooking: React.FC = () => {

    return (
        <View style={styles.container}>
            <SeatsLayout
                row={14}
                layout={{ columnOne: 3, columnTwo: 2 }}
                selectedSeats={[
                    { seatNumber: 1, seatType: 'booked' },
                    { seatNumber: 11, seatType: 'women' },
                    { seatNumber: 17, seatType: 'blocked' },
                    { seatNumber: 43, seatType: 'blocked' },
                ]}
                numberTextStyle={{ fontSize: 12 }}
                seatImage={{ image: SleeperSeatIcon, tintColor: '#B2B2B2' }}
                getBookedSeats={(seats) => {
                    console.log('getBookedSeats :: ', seats);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    row: {
        marginVertical: 5,
    },
});

export default SeatBooking;
