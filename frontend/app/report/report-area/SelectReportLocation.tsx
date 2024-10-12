import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

type RootStackParamList = {
  ReportAreaPage: {
    location: { latitude: number; longitude: number } | undefined;
    locationName: string;
  };
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const SelectReportLocation: React.FC<Props> = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinate.latitude}&lon=${coordinate.longitude}`
      );
      const data = await response.json();

      const address = data.display_name;
      const addressParts = address.split(', ');
      const shortenedAddress = addressParts.slice(0, 3).join(', ');

      setLocationName(shortenedAddress);
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Unknown location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedLocation) {
      navigation.navigate('ReportAreaPage', { location: selectedLocation, locationName });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Mark the location on the map</Text>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>

      <View style={styles.infoContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <>
            {locationName && (
              <Text style={styles.locationText}>{locationName}</Text>
            )}
            {selectedLocation && (
              <Text style={styles.locationCode}>
                ({selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)})
              </Text>
            )}
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.locationButton, !selectedLocation && styles.disabledButton]}
        onPress={handleSelect}
        disabled={!selectedLocation}
      >
        <Text style={styles.submitButtonText}>Select Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  map: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  locationCode: {
    fontSize: 14,
    color: '#666',
  },
  locationButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelectReportLocation;