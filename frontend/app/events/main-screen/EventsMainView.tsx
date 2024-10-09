import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
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
  ImageBackground,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { NavigationProp, useNavigation } from "@react-navigation/native";
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
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/Ionicons";
import coralImage from "../../../assets/images/bg3.jpg";

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

const MainScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchText, setSearchText] = useState("");
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
            locationName: data.location.locationName,
          },
        } as Event;
      });
      setReportData(events);
    };

    fetchReportedAreas();
  }, [userId]);

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
    
  return (
    <View style={styles.container}>
      {/* Apply Linear Gradient to the background */}
      <ImageBackground
        blurRadius={1}
        source={coralImage}
        resizeMode="cover"
        style={styles.gradientBackground}
      >
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.inputContainer}>
            <Icon
              name="search"
              size={20}
              color="#000"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Events..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </BlurView>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <BlurView intensity={90} tint="light" style={styles.blurContainer}>
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
            </View>
          </BlurView>
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
                  pinColor={getMarkerColor(event.date)}
                >
                  <Callout
                    onPress={() => handleEventPress(event)
                    }
                  >
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>
                        {event.location.locationName}
                      </Text>
                      <Text style={styles.calloutDescription}>
                        Reported by {event.organizer}
                      </Text>
                      <TouchableOpacity style={styles.dialogButton}>
                        <Text style={styles.dialogButtonText}>
                          View Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          </View>

          <BlurView
            intensity={90}
            tint="light"
            style={styles.blurButtonContainer}
          >
            <TouchableOpacity
              style={styles.organizeButton}
              onPress={() => navigation.navigate("OrganizeEvents")}
            >
              <Text style={styles.buttonText}>Organize Event</Text>
            </TouchableOpacity>
          </BlurView>

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
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "rgba(255, 255, 255, 0.3)", // You can adjust the background opacity
    borderRadius: 8,
    paddingHorizontal: 10,
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
    flexDirection: "row",
    justifyContent: "space-around",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent background for a glassy look
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#333", // Text color that contrasts with the background
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  blurView: {
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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

export default MainScreen;
