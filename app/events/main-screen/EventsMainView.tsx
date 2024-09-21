import CardComponent from "@/components/card-view/RoundedCard";
import { capitalizeFirstLetter } from "@/utilities/capitalizeLetter";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const beaches = [
  {
    id: "1",
    title: "Unawatuna Beach",
    coordinate: { latitude: 6.0275, longitude: 80.2184 },
    color: "green",
  },
  {
    id: "2",
    title: "Hikkaduwa Beach",
    coordinate: { latitude: 6.1349, longitude: 80.1094 },
    color: "red",
  },
  {
    id: "3",
    title: "Mirissa Beach",
    coordinate: { latitude: 5.9439, longitude: 80.4151 },
    color: "green",
  },
  {
    id: "4",
    title: "Bentota Beach",
    coordinate: { latitude: 6.394, longitude: 80.01 },
    color: "red",
  },
  {
    id: "5",
    title: "Nilaveli Beach",
    coordinate: { latitude: 8.68, longitude: 81.175 },
    color: "green",
  },
];

const cardData = [
  {
    _id: "1",
    name: "Community Gathering",
    date: "September 25, 2024",
    locationName: "City Park",
    location: "https://www.google.com/maps/place/City+Park",
    weather: "Sunny",
    organizer: "John Doe",
    image: "test",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    _id: "2",
    name: "Community Gathering",
    date: "September 25, 2024",
    locationName: "City Park",
    location: "https://www.google.com/maps/place/City+Park",
    weather: "Sunny",
    organizer: "John Doe",
    image: "test",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    _id: "3",
    name: "Community Gathering",
    date: "September 25, 2024",
    locationName: "City Park",
    location: "https://www.google.com/maps/place/City+Park",
    weather: "Sunny",
    organizer: "John Doe",
    image: "test",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    _id: "4",
    name: "Community Gathering",
    date: "September 25, 2024",
    locationName: "City Park",
    location: "https://www.google.com/maps/place/City+Park",
    weather: "Sunny",
    organizer: "John Doe",
    image: "test",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    _id: "5",
    name: "Community Gathering",
    date: "September 25, 2024",
    locationName: "City Park",
    location: "https://www.google.com/maps/place/City+Park",
    weather: "Sunny",
    organizer: "John Doe",
    image: "test",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchText, setSearchText] = useState("");

  const filteredData = cardData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.topic}>Beach Cleanup Events</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Events..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.tabsContainer}>
        {["All Events", "Upcoming", "Past"].map((tab, index) => (
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === tab.toLowerCase() && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.toLowerCase())}
            key={index}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 7.8731,
            longitude: 80.7718,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {beaches.map((beach, index) => (
            <Marker
              coordinate={beach.coordinate}
              title={beach.title}
              pinColor={beach.color}
              key={index}
            />
          ))}
        </MapView>
      </View>
      <View>
        <Text style={styles.topic}>
          {capitalizeFirstLetter(activeTab)} Cleanup Events
        </Text>
      </View>
      <View style={styles.cardsContainer}>
        <FlatList
          style={styles.flatList}
          data={cardData}
          renderItem={({ item }) => (
            <CardComponent details={item}></CardComponent>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
        gap: 10,
    backgroundColor:"#ffffff"
  },
  topic: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    backgroundColor: "#DFE7FF",
    padding: 5,
    borderRadius: 10,
  },
  tab: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 15,
  },
  map: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  mapContainer: {},
  cardsContainer: {
    height: 300,
  },
  flatList: {},
});

export default MainScreen;
