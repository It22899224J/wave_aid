import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";

const UpcommingEvents: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beach Cleanup</Text>
      <Text style={styles.title}>Organized By</Text>

      {/* Vertically Aligned Texts with Icons */}
      <View style={styles.verticalContainer}>
        <View style={styles.textContainer}>
          <Octicons name="organization" size={24} color="black" />
          <Text style={styles.text}>Item 1</Text>
        </View>
      </View>
      <Text style={styles.title}>Event Details</Text>

      <View style={styles.verticalContainer}>
        <View style={styles.textContainer}>
          <Octicons name="organization" size={24} color="black" />
          <Text style={styles.text}>Item 2</Text>
        </View>
        <View style={styles.textContainer}>
          <Octicons name="organization" size={24} color="black" />
          <Text style={styles.text}>Item 3</Text>
        </View>
        <View style={styles.textContainer}>
          <Octicons name="organization" size={24} color="black" />
          <Text style={styles.text}>Item 4</Text>
        </View>
      </View>

      {/* Full-sized Image */}
      <Image
        source={{ uri: "" }} 
        style={styles.image}
      />

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
        <Text style={styles.title}>Event Details</Text>
      </View>
      <View>
        <Text style={styles.title}>Event Details</Text>
        <Text style={styles.title}>Event Details</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Click Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  verticalContainer: {
    marginBottom: 16,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 18,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
