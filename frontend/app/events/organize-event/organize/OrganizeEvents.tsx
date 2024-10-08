import React, { useContext, useEffect, useState } from "react";
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
  Image,
} from "react-native";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/service/firebase";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { BusContext } from "@/context/BusContext";

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
  busId: string
}

type Props = {
  navigation: NavigationProp<any>;
};

const apiKey = "ddb64a174007a68a4edc85f09f65f2e6";
const tideApiKey = "6ac3d4f9-f559-4b96-b371-ae4871e75c01";

const OrganizeEvents = ({ navigation }: Props) => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { location, locationName, report, busId } = route.params || {};

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
  const [weatherDetails, setWeatherDetails] = useState<any | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [tideDetails, setTideDetails] = useState<any | null>(null);
  const [loadingTide, setLoadingTide] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
  const [showTimeToPicker, setShowTimeToPicker] = useState(false);
  const addressParts = reportLocationName.split(", ");
  const shortenedAddress = addressParts.slice(0, 1).join(", ");

  const { buses } = useContext(BusContext);

  useEffect(() => {
    if (busId) {
      console.log("Bus ID:", busId);
      const busDetails = buses.find((bus) => bus.id === busId);
    } else {
      console.log("Bus ID is not available");
    }
  }, [busId]);



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

      // Reset weather and tide data when location changes
      fetchWeatherData(location.latitude, location.longitude);
      fetchTideData(location.latitude, location.longitude, date);
    }
  }, [location, locationName]);

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

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSubmitReport = async () => {
    if (!organizerName || !reportLocationName) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    // Fetch weather data
    if (reportLocation) {
      await fetchWeatherData(reportLocation.latitude, reportLocation.longitude);
    }

    // Fetch tide data
    if (reportLocation) {
      await fetchTideData(
        reportLocation.latitude,
        reportLocation.longitude,
        date
      );
    }

    const reportData = {
      userId: user ? user.uid : null,
      organizerName,
      date: date.toISOString(),
      time: { from: timeFrom.toISOString(), to: timeTo.toISOString() },
      transportOptions: busId,
      volunteerGuidelines,
      location: {
        latitude: reportLocation?.latitude || null,
        longitude: reportLocation?.longitude || null,
        locationName: reportLocationName,
      },
      weatherDetails,
      tideDetails,
      images,
      status: "pending",
      timestamp: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "events"), reportData);
      const eventId = docRef.id;
      Alert.alert("Success", "Your report has been submitted.");


      if (busId) {
        const busRef = doc(db, "buses", busId);
        await updateDoc(busRef, {
          eventID: eventId,
        });
        console.log(`Bus ${busId} updated with eventId ${eventId}`);
      }
      setOrganizerName("");
      setDate(new Date());
      setTimeFrom(new Date());
      setTimeTo(new Date());
      setTransportOptions("");
      setVolunteerGuidelines([""]);
      setWeatherDetails(null);
      setTideDetails(null);
      setImages([]);
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the report.");
      console.error("Error adding document: ", error);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);

    // Reset tide data when date changes
    setTideDetails(null);

    // Fetch tide data when date changes and location is set
    if (reportLocation) {
      fetchTideData(
        reportLocation.latitude,
        reportLocation.longitude,
        currentDate
      );
    }
  };

  const handleTimeFromChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || timeFrom;
    setShowTimeFromPicker(false);
    setTimeFrom(currentDate);

    // Reset tide data when time changes
    setTideDetails(null);
  };

  const handleTimeToChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || timeTo;
    setShowTimeToPicker(false);
    setTimeTo(currentDate);

    // Reset tide data when time changes
    setTideDetails(null);
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
              title={shortenedAddress}
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
            value={date.toLocaleDateString()} // Format the date to a readable format
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

        <Text style={styles.sectionTitle}>Time To</Text>
        <TouchableOpacity onPress={() => setShowTimeToPicker(true)}>
          <TextInput
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

        <Text style={styles.sectionTitle}>Transport Options</Text>
        <TouchableOpacity style={styles.imageButton}
          onPress={() => { navigation.navigate('BusSetup' as never) }}
        >
          <Text style={
            {
              color: "#ffffff"
            }
          }>Add</Text>
        </TouchableOpacity>

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
          <Text style={styles.addGuidelineText}>+ Add Guideline</Text>
        </TouchableOpacity>

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

        <Text style={styles.sectionTitle}>Upload Images</Text>
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Text style={styles.submitButtonText}>Select Images</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.imagePreview}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleSubmitReport}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  guidelineContainer: {
    marginBottom: 10,
  },
  addGuidelineText: {
    color: "#007AFF",
    marginBottom: 10,
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
  imageButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default OrganizeEvents;
