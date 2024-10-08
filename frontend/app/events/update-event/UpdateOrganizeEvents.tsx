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

type Props = {
  navigation: NavigationProp<any>;
};

const UpdateOrganizeEvents = ({ navigation }: Props) => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { location, locationName, report } = route.params || {};

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
  useEffect(() => {
    const fetchReportDetails = async () => {
      if (report) {
        if (!report) return;
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
        }
      }
    };
    fetchReportDetails();
  }, [report]);

  const handlePickLocation = () => {
    navigation.navigate("SelectEventLocation", { currentLocation: location });
  };

  const handleAddGuideline = () => {
    setVolunteerGuidelines((prev) => [...prev, ""]);
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
      transportOptions,
      volunteerGuidelines,
      location: {
        latitude: reportLocation?.latitude || null,
        longitude: reportLocation?.longitude || null,
        locationName: reportLocationName,
      },
    };

    {
      if (report)
        try {
          const reportRef = doc(db, "events", report.id);
          await updateDoc(reportRef, reportData);
          Alert.alert("Success", "Your report has been updated.");
          // Reset the form or navigate back if necessary
          navigation.goBack();
        } catch (error) {
          Alert.alert("Error", "An error occurred while updating the report.");
          console.error("Error updating document: ", error);
        }
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleTimeFromChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || timeFrom;
    setTimeFrom(currentDate);
  };

  const handleTimeToChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || timeTo;
    setTimeTo(currentDate);
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
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={date.toLocaleDateString()}
            editable={false}
            placeholder="Select Date"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.sectionTitle}>Time From</Text>
        <TouchableOpacity onPress={() => setShowTimeFromPicker(true)}>
          <TextInput
            style={styles.input}
            value={timeFrom.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
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

        <Text style={styles.sectionTitle}>Time To</Text>
        <TouchableOpacity onPress={() => setShowTimeToPicker(true)}>
          <TextInput
            style={styles.input}
            value={timeTo.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
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

        <Text style={styles.sectionTitle}>Transport Options</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter transport options"
          value={transportOptions}
          onChangeText={setTransportOptions}
        />

        <Text style={styles.sectionTitle}>Volunteer Guidelines</Text>
        {volunteerGuidelines.map((guideline, index) => (
          <View key={index} style={styles.guidelineContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter a guideline"
              value={guideline}
              onChangeText={(text) => handleUpdateGuideline(text, index)}
            />
          </View>
        ))}
        <TouchableOpacity onPress={handleAddGuideline}>
          <Text style={styles.addGuidelineText}>Add Guideline</Text>
        </TouchableOpacity>

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
  addGuidelineText: {
    color: "#007BFF",
    marginVertical: 8,
    textAlign: "center",
  },
  guidelineContainer: {
    marginVertical: 8,
  },
});

export default UpdateOrganizeEvents;
