import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { NavigationProp } from "@react-navigation/native";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/service/firebase";
import { useAuth } from "@/context/AuthContext";
import moment from "moment";
import UpcommingEvents from "../events-view/UpcommingEvents";
import MyEvents from "./MyEvents";
import PastEvents from "../past-events/PastEvents";
import Icon from "react-native-vector-icons/Ionicons";

interface Event {
  id: string;
  beachName: string;
  date: string;
  time: string;
  weather: string;
  organizer: string;
  tide: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
}

interface Props {
  navigation: NavigationProp<any>;
}

const MyEventsMainView = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchText, setSearchText] = useState("");
  const [reportData, setReportData] = useState<Event[]>([]);
  const { user } = useAuth();
  const userId = user?.uid;

  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "registrations"), where("userId", "==", userId)),
      (registrationsSnapshot) => {
        const eventIds = registrationsSnapshot.docs.map(
          (doc) => doc.data().eventId
        );
        setRegisteredEventIds(eventIds);
      },
      (error) => {
        console.error("Error fetching registrations: ", error);
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const fetchReportedAreas = async () => {
      const q = query(collection(db, "events"));
      const querySnapshot = await getDocs(q);

      const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const beachName = data.location.locationName.split(",")[0];

        return {
          id: doc.id,
          beachName,
          date: new Date(data.date).toLocaleDateString(),
          time: moment(data.time.from).format("hh:mm A"),
          weather: data.weather,
          tide: data.tide,
          organizer: data.organizer,
          image: data.images[0] || "default-image-url.png",
          location: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            locationName: data.location.locationName,
          },
        } as Event;
      });

      // Filter events based on registered event IDs
      const filteredEvents = events.filter((event) =>
        registeredEventIds.includes(event.id)
      );
      setReportData(filteredEvents);
    };

    fetchReportedAreas();
  }, [registeredEventIds]);

  const getMarkerColor = (eventDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDateObj = new Date(eventDate);

    if (eventDateObj < today) {
      return "#FF0000"; // Red for past events
    } else if (eventDateObj.getTime() === today.getTime()) {
      return "#0000FF"; // Blue for today's event
    } else {
      return "#008000"; // Green for future events
    }
  };

  const handleEventPress = (item: Event) => {
    const eventDate = new Date(item.date);
    const currentDate = new Date();

    if (eventDate < currentDate) {
      navigation.navigate("PastEventDetails", { report: item });
    } else {
      navigation.navigate("MyEventDetails", { report: item });
    }
  };

  const filteredEvents = reportData.filter((event) =>
    event.beachName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Events"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#666"
        />
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* <View style={styles.tabsContainer}>
          {["Upcoming", "My Events", "Past"].map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                activeTab === tab.toLowerCase() && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.toLowerCase())}
            >
              <Text
                style={
                  activeTab === tab.toLowerCase()
                    ? styles.activeTabText
                    : styles.tabText
                }
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
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
            {filteredEvents.map((event) => (
              <Marker
                key={event.id}
                coordinate={event.location}
                title={event.beachName}
                pinColor={getMarkerColor(event.date)}
              >
                <Callout onPress={() => handleEventPress(event)}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>
                      {event.location.locationName}
                    </Text>
                    <Text style={styles.calloutDescription}>
                      Reported by {event.organizer}
                    </Text>
                    <TouchableOpacity style={styles.dialogButton}>
                      <Text style={styles.dialogButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
        {/* <TouchableOpacity
          style={styles.organizeButton}
          onPress={() => navigation.navigate("OrganizeEvents")}
        >
          <Text style={styles.buttonText}>Organize Event</Text>
        </TouchableOpacity> */}
        {/* {activeTab == "upcoming" && (
          <View style={styles.cardsContainer}>
            <UpcommingEvents navigation={navigation} />
          </View>
        )} */}

        <View style={styles.cardsContainer}>
          <MyEvents navigation={navigation} />
        </View>

        {/* {activeTab == "past" && (
          <View style={styles.cardsContainer}>
            <PastEvents navigation={navigation} />
          </View>
        )} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 10,
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    position: "relative",
  },
  blurContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  inputContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10, // Adjust the spacing between the icon and text input
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  tabsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    marginVertical: 15,
  },
  tab: {
    height: 40,
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007BFF",
    color: "#fff",
  },
  tabText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 15,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  map: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  mapContainer: {
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  cardsContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  topic: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
  },
  blurButtonContainer: {
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  organizeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff", // Text color that contrasts with the background
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  calloutContainer: {
    width: 250,
    height: "100%",
    padding: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
  },
  dialogButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  dialogButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default MyEventsMainView;
