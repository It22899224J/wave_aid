import { capitalizeFirstLetter } from "@/utilities/capitalizeLetter";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import UpcommingEvents from "../events-view/UpcommingEvents";
import OrganizedEvents from "../update-event/OrganizedEvents";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/service/firebase";
import { useAuth } from "@/context/AuthContext";
import moment from "moment"; // Moment.js for date handling
import PastEvents from "../past-events/PastEvents";
import MyEvents from "../my-events/MyEvents";

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
          date: data.timestamp.toDate().toLocaleDateString(),
          time: data.timestamp.toDate().toLocaleTimeString(),
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
  const getMarkerColor = (eventDate: string) => {
    const today = moment().startOf("day"); // Get today's date (start of the day)
    const eventMoment = moment(eventDate, "MM/DD/YYYY"); // Event date

    if (eventMoment.isBefore(today)) {
      return "red"; // Past event
    } else if (eventMoment.isSame(today)) {
      return "blue"; // Current event (today)
    } else {
      return "green"; // Future event
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
          {["Upcoming","My Events", "Past"].map((tab, index) => (
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
              />
            ))}
          </MapView>
        </View>
        <TouchableOpacity
          style={styles.organizeButton}
          onPress={() => navigation.navigate("OrganizeEvents")}
        >
          <Text style={styles.buttonText}>Organize Event</Text>
        </TouchableOpacity>

       {activeTab=="upcoming" && <View style={styles.cardsContainer}>
          <UpcommingEvents navigation={navigation} />
        </View>}
        {
          activeTab=="my events" && <View style={styles.cardsContainer}>
            <MyEvents navigation={navigation} />
          </View>
        }
        {
          activeTab=="past" && <View style={styles.cardsContainer}>
            <PastEvents navigation={navigation} />
            </View>
        }
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
