import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const SelectLocation = () => {
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const navigation = useNavigation();

    const handleMapPress = (event: any) => {
        const { coordinate } = event.nativeEvent;
        setSelectedLocation(coordinate);
    };

    const handleSelect = () => {
        if (selectedLocation) {
            navigation.navigate('BusSetup', { location: selectedLocation });
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 6.9271,
                    longitude: 79.8612,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
            >
                {selectedLocation && (
                    <Marker coordinate={selectedLocation} />
                )}
            </MapView>
            {selectedLocation && (
                <Text style={styles.locationText}>
                    Selected Location: {`(${selectedLocation.latitude}, ${selectedLocation.longitude})`}
                </Text>
            )}
            <TouchableOpacity onPress={handleSelect}>
                <Text>Select</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    locationText: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default SelectLocation;
