import { capitalizeFirstLetter } from "@/utilities/capitalizeLetter";
import React, { useEffect, useState } from "react";
import {
   Image,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import UpcommingEvents from "../events-view/UpcommingEvents";
import OrganizedEvents from "../update-event/OrganizedEvents";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/service/firebase";
import { useAuth } from "@/context/AuthContext";
import moment from "moment"; // Moment.js for date handling
import MyEvents from "../my-events/MyEvents";
import PastEvents from "../past-events/PastEvents";

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
  };
}

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [reportData, setReportData] = useState<Event[]>([]);
  const { user } = useAuth();
  const userId = user?.uid;

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
          time: new Date(data.time.from).toLocaleDateString(),
          weather: data.weather,
          tide: data.tide,
          organizer: data.organizer,
          image: data.images[0] || "default-image-url.png",
          location: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
        } as Event;
      });
      setReportData(events);
    };

    fetchReportedAreas();
  }, [userId]);

  // Determine color based on the event date
const getMarkerColor = (eventDate:string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today (set time to midnight)

  const eventDateObj = new Date(eventDate); // Convert event date string to Date object

  if (eventDateObj < today) {
    return "#FF0000"; // Blue for past events
  } else if (eventDateObj.getTime() === today.getTime()) {
    return "#0000FF"; // Blue for today's event
  } else {
    return "#008000"; // Green for future events
  }
};


  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Events..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tabsContainer}>
          {["Upcoming", "My Events", "Past"].map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                activeTab === tab.toLowerCase() && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.toLowerCase())}
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
            {reportData.map((event) => (
              <Marker
                key={event.id}
                coordinate={event.location}
                title={event.beachName}
                pinColor={getMarkerColor(event.date)} // Set marker color based on date
              >
                <Callout>
                  <View style={{ width: 200, alignItems: "center"}}>
                   
                    <Image
                      source={{ uri: event.image }}
                      style={{ width:250, height:155 }}
                    />
                    <Text style={{ padding: 10, fontWeight: "600",textAlign:"center"}}>{event.beachName}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
        <TouchableOpacity
          style={styles.organizeButton}
          onPress={() => navigation.navigate("OrganizeEvents")}
        >
          <Text style={styles.buttonText}>Organize Event</Text>
        </TouchableOpacity>

        {activeTab == "upcoming" && (
          <View style={styles.cardsContainer}>
            <UpcommingEvents navigation={navigation} />
          </View>
        )}
        {activeTab == "my events" && (
          <View style={styles.cardsContainer}>
            <MyEvents navigation={navigation} />
          </View>
        )}
        {activeTab == "past" && (
          <View style={styles.cardsContainer}>
            <PastEvents navigation={navigation} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffffff",
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
  mapContainer: {
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  topic: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
  },
  organizeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MainScreen;
