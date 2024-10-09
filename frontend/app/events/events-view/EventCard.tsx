import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";

interface EventCard {
  item: {
    id: string;
    beachName: string;
    organizer: string;
    date: string;
    time: string;
    weather: string;
    tide: string;
    image: string;
  };
  onRemove: (id: string) => void;
}

export const EventCard: React.FC<EventCard> = ({ item, onRemove }) => {
  return (
    <BlurView style={[styles.card,{borderRadius:10}]} intensity={90} tint="light">
     
        <View style={styles.cardInfo}>
          <Text style={styles.beachName}>{item.beachName}</Text>
          <View style={styles.row}>
            <Icon name="calendar" size={24} color="#000" />
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="time" size={24} color="#000" />
            <Text style={[styles.status]}>{item.time}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="person" size={24} color="#000" />
            <Text style={[styles.wasteLevel]}>{item.organizer}</Text>
          </View>
        </View>

        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <Icon name="trash" size={24} color="#FF0000" />
        </TouchableOpacity>
      
    </BlurView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    elevation: 10,
    overflow: "hidden",
    borderColor: "#fff", // White border
  },
  cardInfo: {
    flex: 1,
    padding: 15,
    gap: 5,
  },
  beachName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 10,
  },
  date: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  wasteLevel: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  status: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  cardImage: {
    width: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  removeButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 5,
  },
});
