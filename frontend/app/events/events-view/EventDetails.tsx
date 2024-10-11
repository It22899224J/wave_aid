import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/service/firebase";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import ReanimatedCarousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");

export type RootStackParamList = {
  EventDetails: undefined;
  SelectBus: { eventId: any };
};

export type EventDetailsNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, "EventDetails">,
  StackNavigationProp<RootStackParamList>
>;

interface RouteParams {
  report?: {
    id: string;
  };
}

const apiKey = "ddb64a174007a68a4edc85f09f65f2e6";
const tideApiKey = "6ac3d4f9-f559-4b96-b371-ae4871e75c01";

const EventDetails = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { report } = route.params || {};
  const navigation = useNavigation<EventDetailsNavigationProp>();

  const [organizerName, setOrganizerName] = useState("");
  const [date, setDate] = useState(new Date());
  const [timeFrom, setTimeFrom] = useState(new Date());
  const [timeTo, setTimeTo] = useState(new Date());
  const [reportLocationName, setReportLocationName] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [image, setImage] = useState<string[] | null>(null);
  const [weatherDetails, setWeatherDetails] = useState<any | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [tideDetails, setTideDetails] = useState<any | null>(null);
  const [loadingTide, setLoadingTide] = useState(false);
  const [guidelines, setGuidelines] = useState<string[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [transportOptions, setTransportOptions] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (report?.id) {
        const reportRef = doc(db, "events", report.id);
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          const data = reportSnap.data();
          setOrganizerName(data.organizerName);
          setDate(new Date(data.date));
          setTimeFrom(new Date(data.time.from));
          setTimeTo(new Date(data.time.to));
          setReportLocationName(data.location.locationName);
          setLatitude(data.location.latitude);
          setLongitude(data.location.longitude);
          setGuidelines(data.volunteerGuidelines);
          setImage(data.images);
          setTransportOptions(data.transportOptions);
          fetchWeatherData(data.location.latitude, data.location.longitude);
          fetchTideData(
            data.location.latitude,
            data.location.longitude,
            new Date(data.date)
          );

          const registrationRef = doc(
            db,
            "registrations",
            `${userId}_${report.id}`
          );
          const registrationSnap = await getDoc(registrationRef);
          setIsRegistered(registrationSnap.exists());
        } else {
          Alert.alert("Error", "Event not found.");
        }
      }
    };

    fetchReportDetails();
  }, [report, userId]);

  const handleRegistration = async () => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to register.");
      return;
    }

    const registrationData = {
      userId: userId,
      eventId: report?.id,
      timestamp: serverTimestamp(),
    };

    try {
      if (isRegistered) {
        await deleteDoc(doc(db, "registrations", `${userId}_${report?.id}`));
        setIsRegistered(false);
        Alert.alert(
          "Success",
          "You have successfully unregistered from the event."
        );
      } else {
        await setDoc(
          doc(db, "registrations", `${userId}_${report?.id}`),
          registrationData
        );
        setIsRegistered(true);
        Alert.alert(
          "Success",
          "You have successfully registered for the event."
        );
      }
    } catch (error) {
      console.error("Error registering/unregistering for event: ", error);
      Alert.alert("Error", "Unable to process your request.");
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    setLoadingWeather(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      setWeatherDetails(response.data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
      Alert.alert("Error", "Unable to fetch weather data.");
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchTideData = async (
    latitude: number,
    longitude: number,
    selectedDate: Date
  ) => {
    // setLoadingTide(true);
    // const url = `https://www.worldtides.info/api/v2/tides?lat=${latitude}&lon=${longitude}&date=${
    //   selectedDate.toISOString().split("T")[0]
    // }&key=${tideApiKey}`;

    // try {
    //   const response = await axios.get(url);
    //   setTideDetails(response.data);
    // } catch (error) {
    //   console.error("Error fetching tide data: ", error);
    //   Alert.alert("Error", "Unable to fetch tide data.");
    // } finally {
    //   setLoadingTide(false);
    // }
  };

  const openLocationInMap = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url).catch(() =>
        Alert.alert("Error", "Unable to open the map.")
      );
    } else {
      Alert.alert("Error", "Location information is not available.");
    }
  };

  const renderCarouselItem = ({ item, index }: any) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image source={{ uri: item }} style={styles.carouselImage} />
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.content}>
        <View style={styles.organizer}>
          <Text style={styles.organizerText}>{organizerName}</Text>
        </View>
        {image && image.length > 0 ? (
          <View style={styles.carouselContainer}>
            <ReanimatedCarousel
              loop
              width={screenWidth}
              height={260}
              mode="parallax"
              data={image}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={renderCarouselItem}
            />
            <View style={styles.pagination}>
              {image.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
        ) : (
          <Text>No Images Available</Text>
        )}
        <View style={styles.card}>
          <View style={styles.eventDetails}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="event"
                size={24}
                color="#007AFF"
                style={styles.icon}
              />
              <Text style={styles.detailText}>{date.toDateString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="access-time"
                size={24}
                color="#007AFF"
                style={styles.icon}
              />
              <Text
                style={styles.detailText}
              >{`${timeFrom.toLocaleTimeString()} - ${timeTo.toLocaleTimeString()}`}</Text>
            </View>
            <TouchableOpacity
              style={styles.detailRow}
              onPress={openLocationInMap}
            >
              <MaterialIcons
                name="location-on"
                size={24}
                color="#007AFF"
                style={styles.icon}
              />
              <Text style={[styles.detailText, styles.clickableText]}>
                {reportLocationName}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons
              name="directions-bus"
              size={24}
              color="#007AFF"
              style={styles.icon}
            />
            <Text style={styles.detailText}>
              Transport:{" "}
              {transportOptions === null ? "Not Available" : "Available"}
            </Text>
            {isRegistered && transportOptions !== null && (
              <TouchableOpacity
                style={styles.bookSeatButton}
                onPress={() =>
                  navigation.navigate("SelectBus", { eventId: report?.id })
                }
              >
                <Text style={styles.bookSeatButtonText}>Book a Seat</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {loadingWeather && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Loading weather data...</Text>
          </View>
        )}

        {weatherDetails && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weather Details</Text>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="wb-sunny"
                size={24}
                color="#007AFF"
                style={styles.icon}
              />
              <Text style={styles.detailText}>
                Temperature: {weatherDetails.main.temp} °C
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="cloud"
                size={24}
                color="#007AFF"
                style={styles.icon}
              />
              <Text style={styles.detailText}>
                Condition: {weatherDetails.weather[0].description}
              </Text>
            </View>
          </View>
        )}

        {loadingTide && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Loading tide data...</Text>
          </View>
        )}

        {tideDetails && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tide Details</Text>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="waves"
                size={24}
                color="#007AFF"
                style={styles.icon}
              />
              <Text style={styles.detailText}>
                Next High Tide: {tideDetails.extremes[0].date}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcons
                name="waves"
                size={24}
                color="#007AFF"
                style={styles.icon}
              />
              <Text style={styles.detailText}>
                Next Low Tide: {tideDetails.extremes[1].date}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.registerButton,
            { backgroundColor: isRegistered ? "#FF3B30" : "#007AFF" },
          ]}
          onPress={handleRegistration}
        >
          <Text style={styles.registerButtonText}>
            {isRegistered ? "Unregister" : "Register"}
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Guidelines</Text>
          {guidelines.length > 0 ? (
            guidelines.map((guideline, index) => (
              <View key={index} style={styles.guidelineRow}>
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color="#34C759"
                  style={styles.guidelineIcon}
                />
                <Text style={styles.guidelineText}>{guideline}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.guidelineText}>No guidelines provided.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {},
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1C1C1E",
  },
  carouselContainer: {
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignContent: "center",
    justifyContent: "center",
  },
  carouselItemContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: 290,
    resizeMode: "cover",
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: "#007AFF",
  },
  organizer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "center",
    paddingTop: 16,
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  organizerText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 12,
    color: "#1C1C1E",
  },
  eventDetails: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1C1C1E",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#3A3A3C",
    fontWeight: "500",
    flex: 1,
  },
  clickableText: {
    color: "#007AFF",
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#3A3A3C",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    marginHorizontal: 16,
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
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  guidelineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  guidelineIcon: {
    marginRight: 8,
  },
  guidelineText: {
    fontSize: 16,
    color: "#3A3A3C",
    flex: 1,
  },
  bookSeatButton: {
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: "auto",
  },
  bookSeatButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth,
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007AFF",
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
});

export default EventDetails;
