import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/service/firebase";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";

interface RouteParams {
  location?: {
    latitude: number;
    longitude: number;
  };
  locationName?: string;
  report?: {
    id: string;
    organizerName: string;
    date: string;
    time: { from: string; to: string };
    transportOptions: string;
    volunteerGuidelines: string[];
    location: {
      latitude: number;
      longitude: number;
      locationName: string;
    };
  };
}

const apiKey = "ddb64a174007a68a4edc85f09f65f2e6";
const tideApiKey = "6ac3d4f9-f559-4b96-b371-ae4871e75c01";
type Props = {
  navigation: NavigationProp<any>;
};

const UpdateOrganizeEventsPast = ({ navigation }: Props) => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { location, locationName, report } = route.params || {};
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [organizerName, setOrganizerName] = useState("");
  const [date, setDate] = useState(new Date());
  const [timeFrom, setTimeFrom] = useState(new Date());
  const [timeTo, setTimeTo] = useState(new Date());
  const [transportOptions, setTransportOptions] = useState("");
  const [volunteerGuidelines, setVolunteerGuidelines] = useState<string[]>([
    "",
  ]);
  const [reportLocation, setReportLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
  const [reportLocationName, setReportLocationName] = useState<string>("");
  const [showTimeToPicker, setShowTimeToPicker] = useState(false);
  const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weatherDetails, setWeatherDetails] = useState<any | null>(null);

  // New fields for weight and total participants
  const [weight, setWeight] = useState<string>("");
  const [totalParticipants, setTotalParticipants] = useState<string>("");

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (report) {
        const reportRef = doc(db, "events", report.id);
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          const data = reportSnap.data();
          setOrganizerName(data.organizerName);
          setDate(new Date(data.date));
          setTimeFrom(new Date(data.time.from));
          setTimeTo(new Date(data.time.to));
          setTransportOptions(data.transportOptions);
          setVolunteerGuidelines(data.volunteerGuidelines || [""]);
          setReportLocationName(data.location.locationName);
          setReportLocation({
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          });
          // Set the values of new fields if they exist
          setWeight(data.weight || "");
          setTotalParticipants(data.totalParticipants || "");
        }
      }
    };
    fetchReportDetails();
  }, [report]);

  useEffect(() => {
    if (location) {
      setReportLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setReportLocationName(locationName || "Location not selected");
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location, locationName]);

  const handlePickLocation = () => {
    navigation.navigate("UpdateEventLocation", { currentLocation: location });
  };

  const handleAddGuideline = () => {
    setVolunteerGuidelines((prev) => [...prev, ""]);
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

  const handleUpdateGuideline = (text: string, index: number) => {
    const updatedGuidelines = [...volunteerGuidelines];
    updatedGuidelines[index] = text;
    setVolunteerGuidelines(updatedGuidelines);
  };

  const handleUpdateReport = async () => {
    if (!organizerName || !reportLocationName) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    const reportData = {
      organizerName,
      date: date.toISOString(),
      time: { from: timeFrom.toISOString(), to: timeTo.toISOString() },
      weatherDetails,
      transportOptions,
      volunteerGuidelines,
      location: {
        latitude: reportLocation?.latitude || null,
        longitude: reportLocation?.longitude || null,
        locationName: reportLocationName,
      },
      // Add weight and total participants to the report data
      weight,
      totalParticipants,
    };

    if (report) {
      try {
        const reportRef = doc(db, "events", report.id);
        await updateDoc(reportRef, reportData);
        Alert.alert("Success", "Your report has been updated.");
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", "An error occurred while updating the report.");
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeFromChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || timeFrom;
    setShowTimeFromPicker(false);
    const staticDate = new Date(date);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const combinedDate = new Date(staticDate.setHours(hours, minutes));
    setTimeFrom(combinedDate);
  };

  const handleTimeToChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || timeFrom;
    setShowTimeToPicker(false);
    const staticDate = new Date(date);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const combinedDate = new Date(staticDate.setHours(hours, minutes));
    setTimeTo(combinedDate);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Organizer Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={organizerName}
          onChangeText={setOrganizerName}
        />

        <Text style={styles.sectionTitle}>Location</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: reportLocation?.latitude || 7.8731,
            longitude: reportLocation?.longitude || 80.7718,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
        >
          {reportLocation && (
            <Marker
              coordinate={reportLocation}
              title={reportLocationName}
              description={reportLocationName}
            />
          )}
        </MapView>

        <TextInput
          style={styles.input}
          value={reportLocationName}
          editable={false}
          placeholder="Location not selected"
        />
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handlePickLocation}
        >
          <Text style={styles.submitButtonText}>Select Location</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Date</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity style={{ flex: 1 }}>
            <TextInput
              onTouchStart={() => setShowDatePicker(!showDatePicker)}
              style={styles.input}
              value={date.toLocaleDateString()} // Format the date to a readable format
              editable={false}
              placeholder="Select Date"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              style={styles.date}
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <Text style={styles.sectionTitle}>Time From</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity
            onPress={() => setShowTimeFromPicker(true)}
            style={{ flex: 1 }}
          >
            <TextInput
              onTouchStart={() => setShowTimeFromPicker(!showTimeFromPicker)}
              style={styles.input}
              value={timeFrom.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} // Format the time
              editable={false}
              placeholder="Select Time From"
            />
          </TouchableOpacity>
          {showTimeFromPicker && (
            <DateTimePicker
              value={timeFrom}
              mode="time"
              display="default"
              onChange={handleTimeFromChange}
            />
          )}
        </View>

        <Text style={styles.sectionTitle}>Time To</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity
            onPress={() => setShowTimeToPicker(!showTimeToPicker)}
            style={{ flex: 1 }}
          >
            <TextInput
              onTouchStart={() => setShowTimeToPicker(!showTimeToPicker)}
              style={styles.input}
              value={timeTo.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} // Format the time
              editable={false}
              placeholder="Select Time To"
            />
          </TouchableOpacity>
          {showTimeToPicker && (
            <DateTimePicker
              value={timeTo}
              mode="time"
              display="default"
              onChange={handleTimeToChange}
            />
          )}
        </View>

        <Text style={styles.sectionTitle}>Weight (in kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Total Participants</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the total number of participants"
          value={totalParticipants}
          onChangeText={setTotalParticipants}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpdateReport}
        >
          <Text style={styles.submitButtonText}>Update Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  locationButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
  },
});

export default UpdateOrganizeEventsPast;
