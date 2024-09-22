import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, SafeAreaView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './../../../service/firebase';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

interface Bus {
    rows: number;
    seatsPerRow: number;
    busName: string;
    eventID: string | null;
    contactNumber: number;
    pickupLocation: string;
}

interface RouteParams {
    location?: {
        latitude: number;
        longitude: number;
    };
}

const BusSetup = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { location } = route.params || {};

    const [busName, setBusName] = useState<string>('');
    const [rows, setRows] = useState<string>('');
    const [seatsPerRow, setSeatsPerRow] = useState<string>('');
    const [contactNumber, setContactNumber] = useState<string>('');
    const [pickupLocation, setPickupLocation] = useState<string>('');

    // Update pickupLocation when location changes
    useEffect(() => {
        if (location) {
            setPickupLocation(`(${location.latitude}, ${location.longitude})`);
        }
    }, [location]);

    const createBus = async () => {
        if (!rows || !seatsPerRow || !busName || !pickupLocation) {
            alert('Please fill out all fields');
            return;
        }

        const bus: Bus = {
            busName,
            rows: parseInt(rows),
            seatsPerRow: parseInt(seatsPerRow),
            eventID: null,
            contactNumber: parseInt(contactNumber),
            pickupLocation,
        };

        try {
            await addDoc(collection(db, 'buses'), bus);
            alert('Bus created successfully');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleSelectLocation = () => {
        navigation.navigate('SelectLocation', { currentLocation: location });
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.label}>Bus Name:</Text>
                <TextInput
                    style={styles.input}
                    value={busName}
                    onChangeText={setBusName}
                    placeholder="Enter bus name"
                />

                <Text style={styles.label}>Number of Rows:</Text>
                <TextInput
                    style={styles.input}
                    value={rows}
                    onChangeText={setRows}
                    keyboardType="numeric"
                    placeholder="e.g. 5"
                />

                <Text style={styles.label}>Seats per Row:</Text>
                <TextInput
                    style={styles.input}
                    value={seatsPerRow}
                    onChangeText={setSeatsPerRow}
                    keyboardType="numeric"
                    placeholder="e.g. 4"
                />
                <Text style={styles.label}>Contact Number:</Text>
                <TextInput
                    style={styles.input}
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    keyboardType="numeric"
                    placeholder="Enter contact number"
                />
                <Text style={styles.label}>Pickup Location:</Text>
                <TextInput
                    style={styles.input}
                    value={pickupLocation}
                    editable={false}
                />
                <Button title="Select Location" onPress={handleSelectLocation} />
                <Button title="Create Bus" onPress={createBus} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {

        justifyContent: 'center',
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        fontSize: 16,
    },
});

export default BusSetup;
