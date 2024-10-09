import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  BusSetup: {
    location: { latitude: number; longitude: number; name: string | null } | undefined;
  };
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const SelectLocation = ({ navigation }: Props) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string | null;
  } | null>(null);

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);

    // Reverse geocode using Nominatim (OpenStreetMap)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinate.latitude}&lon=${coordinate.longitude}`
      );
      const data = await response.json();
      const address = data.display_name;

      // Get the first 3 parts of the address
      const addressParts = address.split(", ");
      const shortenedAddress = addressParts.slice(0, 3).join(", ");

      // Update selectedLocation with the address
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
    if (selectedLocation) {
      navigation.navigate("BusSetup", { location: selectedLocation });
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
      <TouchableOpacity onPress={handleSelect}>
        <Text>Select</Text>
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
});

export default SelectLocation;
