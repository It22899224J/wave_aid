import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  SelectLocation: {
    location: string | undefined;
    transportOptions?: string;
  };
  BusSetup: {
    location: { latitude: number; longitude: number; name: string | null };
  };
  UpdateTransport: {
    location: { latitude: number; longitude: number; name: string | null };
    transportOptions?: string;
  };
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const SelectLocation = ({ navigation }: Props) => {
  const route = useRoute<RouteProp<RootStackParamList, "SelectLocation">>();
  const pickupLocation = route.params?.location;
  const transportOptions = route.params?.transportOptions;

  const parseLocation = (locationString: string) => {
    if (!locationString) return null;

    const trimmedLocation = locationString.replace(/[()]/g, '').trim();
    const [lat, long] = trimmedLocation.split(',').map(Number);

    return {
      latitude: lat,
      longitude: long,
      name: null,
    };
  };

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string | null;
  } | null>(pickupLocation ? parseLocation(pickupLocation) : null);

  console.log("Pickup Location:", pickupLocation); 
  console.log("Parsed Location:", selectedLocation); 

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinate.latitude}&lon=${coordinate.longitude}`
      );
      const data = await response.json();
      const address = data.display_name;

      const addressParts = address.split(", ");
      const shortenedAddress = addressParts.slice(0, 3).join(", ");

      setSelectedLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        name: shortenedAddress,
      });
    } catch (error) {
      console.error("Error fetching location name:", error);
      setSelectedLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        name: "Unknown location",
      });
    }
  };

  const handleSelect = () => {
    if (pickupLocation) {
      if (selectedLocation) {
        navigation.navigate("UpdateTransport", { location: selectedLocation, transportOptions });
      }
    } else {
      if (selectedLocation) {
        navigation.navigate("BusSetup", { location: selectedLocation });
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation?.latitude || 6.9271,
              longitude: selectedLocation?.longitude || 79.8612,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation}>
                <Ionicons name="location" size={32} color="#00acf0" />
              </Marker>
            )}
          </MapView>
          <View style={styles.infoContainer}>
            {selectedLocation && (
              <>
                <View style={styles.infoItem}>
                  <Ionicons name="navigate-outline" size={24} color="#00acf0" />
                  <Text style={styles.locationText}>
                    ({selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)})
                  </Text>
                </View>
                {selectedLocation.name && (
                  <View style={styles.infoItem}>
                    <Ionicons name="pin-outline" size={24} color="#00acf0" />
                    <Text style={styles.locationText}>{selectedLocation.name}</Text>
                  </View>
                )}
              </>
            )}
          </View>
          <TouchableOpacity onPress={handleSelect} style={styles.selectButton}>
            <Ionicons name={pickupLocation ? "refresh-outline" : "checkmark-outline"} size={24} color="#fff" />
            <Text style={styles.selectButtonText}>{pickupLocation ? "Update Location" : "Select Location"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F9FB",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  map: {
    width: "100%",
    height: 400,
    borderRadius: 15,
    overflow: 'hidden',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#00acf0",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default SelectLocation;
