import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";

export interface CardProps {
  _id: string;
  name: string;
  date: string;
  locationName: string;
  location: string;
  weather: string;
  organizer: string;
  image: string;
  imageUrl: string;
}

const UpcommingEvents: React.FC<{ event: CardProps }> = ({ event }) => {
  // Sample data
  const sampleEvent: CardProps = {
    _id: "1",
    name: "Beach Cleanup",
    date: "2024-09-30",
    locationName: "Sunny Beach",
    location: "123 Beach Ave, Ocean City",
    weather: "Sunny",
    organizer: "Clean Earth Org",
    image: "path/to/image.jpg",
    imageUrl: "https://example.com/sample-image.jpg", // Replace with your image URL
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.title}>Organized By: {event.organizer}</Text>

      {/* Vertically Aligned Texts with Icons */}
      <View style={styles.verticalContainer}>
        <View style={styles.textContainer}>
          <Octicons name="organization" size={24} color="black" />
          <Text style={styles.text}>Location: {event.locationName}</Text>
        </View>
      </View>

      <Text style={styles.title}>Event Details</Text>

      <View style={styles.verticalContainer}>
        <View style={styles.textContainer}>
          <Octicons name="calendar" size={24} color="black" />
          <Text style={styles.text}>Date: {event.date}</Text>
        </View>
        <View style={styles.textContainer}>
          <Octicons name="location" size={24} color="black" />
          <Text style={styles.text}>Location: {event.location}</Text>
        </View>
        <View style={styles.textContainer}>
          <Octicons name="star" size={24} color="black" />
          <Text style={styles.text}>Weather: {event.weather}</Text>
        </View>
      </View>

      {/* Full-sized Image */}
      <Image source={{ uri: event.imageUrl }} style={styles.image} />

      {/* Two Horizontally Aligned Boxes */}
      <View style={styles.horizontalContainer}>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>Box 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>Box 2</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.title}>Transport options</Text>
      </View>

      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.title}>Volunteer guidelines</Text>
        <Text style={styles.title}>Details</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  verticalContainer: {
    marginBottom: 16,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 20,
    gap: 35,
  },
  text: {
    fontSize: 18,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius:10,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  box: {
    flex: 1,
    padding: 16,
    margin: 4,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  boxText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ADD8E6", // Light blue color
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default UpcommingEvents;