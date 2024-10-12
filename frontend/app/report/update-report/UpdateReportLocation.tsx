import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

interface RouteParams {
  currentLocation: { latitude: number; longitude: number } | undefined;
    locationName: string;
    reportId:string
}

type RootStackParamList = {
  UpdateReportLocation: {
    location: { latitude: number; longitude: number } | undefined;
    locationName: string;
  };
  UpdateReportPage: {
    location: { latitude: number; longitude: number };
    locationName: string;
    reportId: string;
  };
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const UpdateReportLocation = ({ navigation }: Props) => {

  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { currentLocation,reportId } = route.params || {};

  console.log(currentLocation,reportId)

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(currentLocation || null);

  const [locationName, setLocationName] = useState<string>("");

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);

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
    }
  };

  const handleSelect = () => {
    if (selectedLocation) {
        navigation.navigate('UpdateReportPage', { location: selectedLocation, locationName: locationName,reportId:reportId });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Mark the location in the map</Text>

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
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>

      {locationName && <Text style={styles.locationText}>{locationName}</Text>}

      {selectedLocation && (
        <Text style={styles.locationCode}>
          ({selectedLocation.latitude}, {selectedLocation.longitude})
        </Text>
      )}

      <TouchableOpacity style={styles.locationButton} onPress={handleSelect}>
        <Text style={styles.submitButtonText}>Select Location</Text>
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
  instructionText: {
    fontSize: 14,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  locationText: {
    padding: 5,
    marginTop: 10,
    fontSize: 16,
  },
  locationCode: {
    padding: 10,
    fontSize: 16,
  },
  locationButton: {
    width: '50%',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateReportLocation;