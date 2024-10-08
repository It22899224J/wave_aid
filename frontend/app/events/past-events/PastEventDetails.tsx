import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebase"; // Replace with your Firebase config path
import { TouchableOpacity } from "react-native-gesture-handler";
interface RouteParams {
  report?: {
    id: string;
  };
}
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
  const [image, setImage] = useState<string | null>(null);
  const [weatherDetails, setWeatherDetails] = useState<any | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [tideDetails, setTideDetails] = useState<any | null>(null);
  const [loadingTide, setLoadingTide] = useState(false);
  // Weather state
  const [weather, setWeather] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [guidelines, setGuidelines] = useState<string[]>([]);

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
          setGuidelines(data.guidelines);
          setImage(data.images[0]);
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

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.eventTitle}>{organizerName}</Text>
        <Text style={styles.eventDate}>{date.toDateString()}</Text>
        <TouchableOpacity style={styles.detailRow} onPress={openLocationInMap}>
          <Image
            source={{ uri: "https://via.placeholder.com/24" }} // Placeholder location icon
            style={styles.icon}
          />
          <Text style={styles.clickableText}>{reportLocationName}</Text>
        </TouchableOpacity>
      </View>

      {/* Event Image */}
      <Image
        source={{ uri: image || "https://example.com/beach-image.jpg" }} // Replace with actual image link
        style={styles.eventImage}
      />

      {/* Weather and Tide Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Historical Weather Data</Text>
        <View style={styles.weatherContainer}>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherValue}>31°C</Text>
            <Text style={styles.weatherLabel}>Average Temperature</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherValue}>20%</Text>
            <Text style={styles.weatherLabel}>UV Index</Text>
          </View>
          <View style={styles.weatherItem}>
            <Text style={styles.weatherValue}>10 mph</Text>
            <Text style={styles.weatherLabel}>Wind Speed</Text>
          </View>
        </View>

        {/* <Text style={styles.infoTitle}>Tide Information</Text>
        <View style={styles.tideContainer}>
          <View style={styles.tideItem}>
            <Text style={styles.tideTime}>12:30 PM</Text>
            <Text style={styles.tideLabel}>High Tide</Text>
          </View>
          <View style={styles.tideItem}>
            <Text style={styles.tideTime}>6:00 PM</Text>
            <Text style={styles.tideLabel}>Low Tide</Text>
          </View>
        </View> */}

        <Text style={styles.infoTitle}>Waste Collection Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>200 lbs</Text>
            <Text style={styles.statsLabel}>Total Waste Collected</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>50</Text>
            <Text style={styles.statsLabel}>Volunteers Participated</Text>
          </View>
        </View>
      </View>

      {/* Participant Count Section */}
      <Text style={styles.participantsTitle}>Participants</Text>
      <View style={styles.participantCountContainer}>
        <Text style={styles.participantCountValue}>50 Participants</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 16,
    marginBottom: 20,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  weatherContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  weatherItem: {
    alignItems: "center",
  },
  weatherValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  tideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tideItem: {
    alignItems: "center",
  },
  tideTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tideLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statsItem: {
    alignItems: "center",
  },
  statsValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  participantCountContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  participantCountValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
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
});

export default PastEventDetails;
