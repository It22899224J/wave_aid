import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";

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
  const transportOptions=route.params?.transportOptions

  
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

  console.log("Pickup Location:", pickupLocation); // Log the pickup location
  console.log("Parsed Location:", selectedLocation); // Log the parsed location

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
        navigation.navigate("UpdateTransport", { location: selectedLocation,transportOptions });
      }
    } else {
      if (selectedLocation) {
        navigation.navigate("BusSetup", { location: selectedLocation });
      }
    }
  };

  return (
    <View style={styles.container}>
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
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      {selectedLocation && (
        <Text style={styles.locationText}>
          Selected Location:{" "}
          {`(${selectedLocation.latitude}, ${selectedLocation.longitude})`}
        </Text>
      )}
      {selectedLocation && selectedLocation.name && (
        <Text style={styles.locationText}>
          Location Name: {selectedLocation.name}
        </Text>
      )}
      <TouchableOpacity onPress={handleSelect} style={styles.selectButton}>
        <Text>{pickupLocation ? "Update" : "Select"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "80%",
  },
  locationText: {
    marginTop: 10,
    fontSize: 16,
  },
  selectButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#00acf0",
    borderRadius: 5,
  },
});

export default SelectLocation;
