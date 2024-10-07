import { CardProps } from "@/types/events"; 
import { Link } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, StyleSheet, Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  details: CardProps;
}

const CardComponent: React.FC<Props> = (props) => {
  const { details } = props;
  console.log(details);

  const handleLocationPress = async () => {
    const supported = await Linking.canOpenURL(details.location);
    if (supported) {
      await Linking.openURL(details.location);
    } else {
      console.log("Can't handle URL: " + details.location);
    }
  };

  return (
    <View id={details._id} style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{details.name}</Text>
        <Text style={styles.details}>Date: {details.date}</Text>
        <TouchableOpacity onPress={handleLocationPress}>
          <Text style={styles.link}>Location: {details.locationName}</Text>
        </TouchableOpacity>
        <Text style={styles.details}>Weather: {details.weather}</Text>
        <Text style={styles.details}>Organizer: {details.organizer}</Text>
      </View>
      <Image
        id={details.image}
        source={{ uri: details.imageUrl }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 15,
    backgroundColor: "#F1F5FF",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    overflow: "hidden",
    marginBottom: 16,
  },
  content: {
    flex: 2,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  link: {
    fontSize: 14,
    marginVertical: 2,
    textDecorationLine: "none",
    color: "#666", // Change to a visible color
  },
  image: {
    width: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
});

export default CardComponent;
