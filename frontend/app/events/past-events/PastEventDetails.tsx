import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, Linking, Dimensions, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebase"; // Replace with your Firebase config path
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import coralImage from "../../../assets/images/bg3.jpg";

interface RouteParams {
  report?: {
    id: string;
  };
}
const { width: screenWidth } = Dimensions.get("window");
const PastEventDetails = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { report } = route.params || {};



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
    const [currentIndex, setCurrentIndex] = useState(0);
  // Weather state
  const [weather, setWeather] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [guidelines, setGuidelines] = useState<string[]>([]);
  const [weight, setWeight] = useState<string>("");
  
  const [totalParticipants, setTotalParticipants] = useState<string>("");

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
          if(image?.length === 0){
            setImage([coralImage]);
          }
          setWeatherDetails(data.weatherDetails);
          setWeight(data.weight || "");
          setTotalParticipants(data.totalParticipants || "");
          // fetchWeatherData(data.location.latitude, data.location.longitude);
        } else {
          Alert.alert("Error", "Event not found.");
        }
      }
    };

    fetchReportDetails();
  }, [report]);

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

          {/* <View style={styles.detailRow}>
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
          </View> */}
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

        {
          <View style={{ display: "flex" }}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Contribution Details</Text>
              <View style={styles.detailRow}>
                <MaterialIcons
                  name="people"
                  size={24}
                  color="#007AFF"
                  style={styles.icon}
                />
                <Text style={styles.detailText}>
                  Participants {totalParticipants}
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Environmental Impact</Text>
              <View style={styles.detailRow}>
                <MaterialIcons
                  name="eco"
                  size={24}
                  color="#00ff00"
                  style={styles.icon}
                />
                <Text style={styles.detailText}>
                  Collected Weight {weight} Kg
                </Text>
              </View>
            </View>
          </View>
        }

        {loadingTide && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Loading tide data...</Text>
          </View>
        )}

        {/* {tideDetails && (
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
        )} */}

        {/* <TouchableOpacity
          style={[
            styles.registerButton,
            { backgroundColor: isRegistered ? "#FF3B30" : "#007AFF" },
          ]}
          onPress={handleRegistration}
        >
          <Text style={styles.registerButtonText}>
            {isRegistered ? "Unregister" : "Register"}
          </Text>
        </TouchableOpacity> */}

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

export default PastEventDetails;
