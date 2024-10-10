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
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from "firebase/firestore"; // Import deleteDoc
import { db } from "@/service/firebase"; // Replace with your Firebase config path
import axios from "axios"; // Import axios for API calls
import { useAuth } from "@/context/AuthContext";
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


export type RootStackParamList = {
  EventDetails: undefined;
  SelectBus: { eventId: any };
};

export type EventDetailsNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'EventDetails'>,
  StackNavigationProp<RootStackParamList>
>;


interface RouteParams {
  report?: {
    id: string;
  }
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
  const [image, setImage] = useState<string | null>(null);
  const [weatherDetails, setWeatherDetails] = useState<any | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [tideDetails, setTideDetails] = useState<any | null>(null);
  const [loadingTide, setLoadingTide] = useState(false);
  const [guidelines, setGuidelines] = useState<string[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [transportOptions, setTransportOptions] = useState(); // State for registration status
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
          setImage(data.images[0]);
          setTransportOptions(data.transportOptions);
          fetchWeatherData(data.location.latitude, data.location.longitude);
          fetchTideData(
            data.location.latitude,
            data.location.longitude,
            new Date(data.date)
          );
          console.log("Transport Options:", data.transportOptions);

          // Check if the user is already registered for the event
          const registrationRef = doc(
            db,
            "registrations",
            `${userId}_${report.id}`
          );
          const registrationSnap = await getDoc(registrationRef);
          setIsRegistered(registrationSnap.exists()); // Set registration status
        } else {
          Alert.alert("Error", "Event not found.");
        }
      }
    };

    fetchReportDetails();
  }, [report, userId]); // Add userId to dependencies

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
        // Unregister the user
        await deleteDoc(doc(db, "registrations", `${userId}_${report?.id}`));
        setIsRegistered(false); // Update registration status
        Alert.alert(
          "Success",
          "You have successfully unregistered from the event."
        );
      } else {
        // Register the user
        await setDoc(
          doc(db, "registrations", `${userId}_${report?.id}`),
          registrationData
        );
        setIsRegistered(true); // Update registration status
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
    setLoadingTide(true);
    const url = `https://www.worldtides.info/api/v2/tides?lat=${latitude}&lon=${longitude}&date=${selectedDate.toISOString().split("T")[0]
      }&key=${tideApiKey}`;

    try {
      const response = await axios.get(url);
      setTideDetails(response.data);
    } catch (error) {
      console.error("Error fetching tide data: ", error);
      Alert.alert("Error", "Unable to fetch tide data.");
    } finally {
      setLoadingTide(false);
    }
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

          {/* Transport Availability */}
          <View style={styles.detailRow}>
            <Image
              source={{ uri: "https://via.placeholder.com/24" }} // Placeholder transport icon
              style={styles.icon}
            />
            <Text style={styles.transportText}>
              Transport: {transportOptions === null ? "Not Available" : "Available"}
            </Text>

            {isRegistered && transportOptions !== null && (
              <TouchableOpacity
                style={styles.bookSeatButton} // Style for the button
                onPress={() => navigation.navigate("SelectBus", { eventId: report?.id })}
              >
                <Text style={styles.bookSeatButtonText}>Book a Seat</Text>
              </TouchableOpacity>
            )}
          </View>




          {/* Event Image */}
          <Image
            source={{ uri: image || "https://via.placeholder.com/180" }} // Placeholder event image
            style={styles.eventImage}
          />

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
              <Text>Next High Tide: {tideDetails.data[0].high_tide}</Text>
              <Text>Next Low Tide: {tideDetails.data[0].low_tide}</Text>
            </View>
          )}

          {/* Registration Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: isRegistered ? "red" : "#007AFF" },
            ]}
            onPress={handleRegistration}
          >
            <Text style={styles.registerButtonText}>
              {isRegistered ? "Unregister" : "Register"}
            </Text>
          </TouchableOpacity>

          {/* Guidelines */}
          <View style={styles.guidelinesContainer}>
            <Text style={styles.sectionTitle}>Guidelines</Text>
            {guidelines ? (
              guidelines?.map((guideline, index) => (
                <Text key={index} style={styles.guidelineText}>
                  - {guideline}
                </Text>
              ))
            ) : (
              <Text style={styles.guidelineText}>No guidelines provided.</Text>
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
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
    fontWeight: "bold",
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
    color: "#007AFF",
  },
  eventImage: {
    width: "100%",
    height: 180,
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  weatherContainer: {
    marginBottom: 16,
  },
  tideContainer: {
    marginBottom: 16,
  },
  registerButton: {
    // backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  guidelinesContainer: {
    marginBottom: 16,
  },
  guidelineText: {
    fontSize: 14,
  },
  transportText: {
    marginRight: 10, // Space between text and button
  },

  bookSeatButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 4, // Reduced vertical padding
    paddingHorizontal: 8, // Reduced horizontal padding
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10, // Space between text and button
  },

  bookSeatButtonText: {
    color: "white",
    fontSize: 14, // Smaller font size for the button text
    fontWeight: "bold",
  },

});

export default EventDetails;
