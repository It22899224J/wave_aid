import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { NavigationProp } from "@react-navigation/native";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/service/firebase";
import { useAuth } from "@/context/AuthContext";
import UpcommingEvents from "../events-view/UpcommingEvents";
import MyEvents from "../my-events/MyEvents";
import PastEvents from "../past-events/PastEvents";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

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

const { width, height } = Dimensions.get('window');

const MainScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchText, setSearchText] = useState("");
  const [reportData, setReportData] = useState<Event[]>([]);
  const { user } = useAuth();
  const userId = user?.uid;

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 120],
    extrapolate: 'clamp',
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

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
      return "#FF6B6B"; // Soft red for past events
    } else if (eventDateObj.getTime() === today.getTime()) {
      return "#4ECDC4"; // Teal for today's event
    } else {
      return "#45B649"; // Green for future events
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
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradientBackground}
      >
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <Text style={styles.headerTitle}>Beach Cleanup Events</Text>
          <Animated.View style={[styles.inputContainer, { opacity: searchOpacity }]}>
            <Icon name="search" size={20} color="#fff" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Events"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#ccc"
            />
          </Animated.View>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.content}>
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

            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 7.8731,
                  longitude: 80.7718,
                  latitudeDelta: 5,
                  longitudeDelta: 5,
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
                          Organized by {event.organizer}
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

            <TouchableOpacity
              style={styles.organizeButton}
              onPress={() => navigation.navigate("OrganizeEvents")}
            >
              <LinearGradient
                colors={['#45B649', '#DCE35B']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Organize New Event</Text>
              </LinearGradient>
            </TouchableOpacity>

            {activeTab === "upcoming" && (
              <View style={styles.cardsContainer}>
                <UpcommingEvents navigation={navigation} />
              </View>
            )}
            {activeTab === "my events" && (
              <View style={styles.cardsContainer}>
                <MyEvents navigation={navigation} />
              </View>
            )}
            {activeTab === "past" && (
              <View style={styles.cardsContainer}>
                <PastEvents navigation={navigation} />
              </View>
            )}
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4c669f',
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: '#3b5998',
    fontWeight: '600',
    fontSize: 16,
  },
  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    width: '100%',
    height: 250,
  },
  organizeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardsContainer: {
    marginBottom: 20,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  dialogButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  dialogButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MainScreen;