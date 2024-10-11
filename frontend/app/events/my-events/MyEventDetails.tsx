import React, { useEffect, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebase"; // Replace with your Firebase config path
import axios from "axios"; // Import axios for API calls
import { useAuth } from "@/context/AuthContext";
import { ImageSlider } from "@/components/Image-slider/ImageSlider";

interface RouteParams {
  report?: {
    id: string;
  };
}
const apiKey = "ddb64a174007a68a4edc85f09f65f2e6";
const tideApiKey = "6ac3d4f9-f559-4b96-b371-ae4871e75c01";

const MyEventDetails = () => {
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
  // Weather state
  const [weather, setWeather] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [guidelines, setGuidelines] = useState<string[]>([]);
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (report?.id) {
        const reportRef = doc(db, "events", report.id);
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          const data = reportSnap.data();
          console.log(data);
          setOrganizerName(data.organizerName);
          setDate(new Date(data.date));
          setTimeFrom(new Date(data.time.from));
          setTimeTo(new Date(data.time.to));
          setReportLocationName(data.location.locationName);
          setLatitude(data.location.latitude);
          setLongitude(data.location.longitude);
          setGuidelines(data.volunteerGuidelines);
          setImage(data.images);
          fetchWeatherData(data.location.latitude, data.location.longitude);
          fetchTideData(
            data.location.latitude,
            data.location.longitude,
            new Date(data.date)
          );
        } else {
          Alert.alert("Error", "Event not found.");
        }
      }
    };

    fetchReportDetails();
  }, [report]);

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

  //unregister from event
  const removeRegistration = async () => {
    if (!userId) {
      Alert.alert(
        "Error",
        "You must be logged in to delete your registration."
      );
      return;
    }

    try {
      await deleteDoc(doc(db, "registrations", `${userId}_${report?.id}`));
      Alert.alert(
        "Success",
        "Your registration has been successfully deleted."
      );
    } catch (error) {
      console.error("Error deleting registration: ", error);
      Alert.alert("Error", "Unable to delete your registration.");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Event Title */}
          <Text style={styles.eventTitle}>Beach Cleanup</Text>

          {/* Organizer */}
          <View style={styles.organizer}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }} // Placeholder icon
              style={styles.organizerImage}
            />
            <Text style={styles.organizerText}>{organizerName}</Text>
          </View>

          {/* Event Details */}
          <View style={styles.eventDetails}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            {/* Date */}
            <View style={styles.detailRow}>
              <Image
                source={{ uri: "https://via.placeholder.com/24" }} // Placeholder date icon
                style={styles.icon}
              />
              <Text>{date.toDateString()}</Text>
            </View>
            {/* Time */}
            <View style={styles.detailRow}>
              <Image
                source={{ uri: "https://via.placeholder.com/24" }} // Placeholder time icon
                style={styles.icon}
              />
              <Text>{`${timeFrom.toLocaleTimeString()} - ${timeTo.toLocaleTimeString()}`}</Text>
            </View>
            {/* Location */}
            <TouchableOpacity
              style={styles.detailRow}
              onPress={openLocationInMap}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/24" }} // Placeholder location icon
                style={styles.icon}
              />
              <Text style={styles.clickableText}>{reportLocationName}</Text>
            </TouchableOpacity>
          </View>

          {/* Event Image */}
          {/* <Image
            source={{ uri: image || "https://via.placeholder.com/180" }} // Placeholder event image
            style={styles.eventImage}
          /> */}

          {
            image && (
              <ImageSlider images={image} />
            )
          }
          {/* Weather Info */}
          {loadingWeather && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text>Loading weather data...</Text>
            </View>
          )}

          {weatherDetails && (
            <View style={styles.weatherContainer}>
              <Text style={styles.sectionTitle}>Weather Details</Text>
              <Text>Temperature: {weatherDetails.main.temp} °C</Text>
              <Text>Condition: {weatherDetails.weather[0].description}</Text>
            </View>
          )}

          {loadingTide && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text>Loading tide data...</Text>
            </View>
          )}

          {tideDetails && (
            <View style={styles.tideContainer}>
              <Text style={styles.sectionTitle}>Tide Details</Text>
              {tideDetails.tides.map((tide: any, index: any) => (
                <Text key={index}>
                  Time: {new Date(tide.time).toLocaleString()} - Level:{" "}
                  {tide.height} m
                </Text>
              ))}
            </View>
          )}

          {/* Transportation Options */}
          <View style={styles.transportSection}>
            <Text style={styles.sectionTitle}>Transportation Options</Text>
            <TouchableOpacity style={styles.availableButton}>
              <Text style={styles.availableText}>Available</Text>
            </TouchableOpacity>
          </View>

          {/* Registration */}
          <View style={styles.registrationSection}>
            <Text style={styles.sectionTitle}>Registration Status</Text>
            <Text style={styles.descriptionText}>
              Join with us and save the environment.
            </Text>
            <TouchableOpacity style={styles.registerButton} onPress={removeRegistration}>
              <Text style={styles.registerText}>Unregister</Text>
            </TouchableOpacity>
          </View>

          {/* Volunteer Guidelines */}
          <View style={styles.volunteerSection}>
            <Text style={styles.sectionTitle}>Volunteer Guidelines</Text>
            {guidelines ? (
              guidelines.map((guideline, index) => (
                <Text key={index} style={styles.descriptionText}>
                  {guideline}
                </Text>
              ))
            ) : (
              <Text>No guidelines available</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  organizer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  organizerText: {
    fontSize: 16,
  },
  eventDetails: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  clickableText: {
    color: "#1D4ED8",
    textDecorationLine: "underline",
  },
  eventImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    padding: 16,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  infoSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  transportSection: {
    marginBottom: 16,
  },
  availableButton: {
    backgroundColor: "#4ADE80",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  availableText: {
    color: "white",
    fontWeight: "bold",
  },
  registrationSection: {
    marginBottom: 16,
  },
  descriptionText: {
    marginBottom: 8,
    color: "#374151",
  },
  registerButton: {
    backgroundColor: "#FF0000",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  registerText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  weatherContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  tideContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  volunteerSection: {
    marginBottom: 16,
  },
});

export default MyEventDetails;
