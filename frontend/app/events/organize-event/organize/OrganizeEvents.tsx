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
import Icon from "react-native-vector-icons/Ionicons";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/service/firebase";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import { BusContext } from "@/context/BusContext";
import * as ImageManipulator from "expo-image-manipulator";
import {
  deleteObject,
  getDownloadURL,
  uploadBytes,
  ref,
} from "firebase/storage";

interface RouteParams {
  location?: {
    latitude: number;
    longitude: number;
  };
  locationName?: string;
  report?: {
    id: string;
    contactNumber: string;
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
  busId: string;
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
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
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
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
  const [showTimeToPicker, setShowTimeToPicker] = useState(false);
  const addressParts = reportLocationName.split(", ");
  const shortenedAddress = addressParts.slice(0, 1).join(", ");
  const [contactNumber, setContactNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateContactNumber = (number: string) => {
    const isValid = /^\d{10}$/.test(number); // Check if the number has exactly 10 digits
    if (!isValid) {
      setErrorMessage("Contact number must be exactly 10 digits.");
    } else {
      setErrorMessage("");
    }
  };
  const handleContactNumberChange = (text: string) => {
    if (text.length <= 10) {
      setContactNumber(text);
      validateContactNumber(text);
    }
  };

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
          setContactNumber(data.contactNumber);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      await uploadImage(imageUri);
    }
  };
  const uploadImage = async (uri: string) => {
    setUploading(true);

    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      const metadata = {
        contentType: blob.type || "image/jpeg",
      };
      const fileName = `${new Date().getTime()}-report-image.jpg`;
      const storageRef = ref(storage, `reports/${fileName}`);
      await uploadBytes(storageRef, blob, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      setImages((prevImages) => [...prevImages, downloadURL]);
    } catch (error) {
      console.error("Error uploading image: ", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    try {
      await deleteObject(imageRef);
      setImages(images.filter((url) => url !== imageUrl));
    } catch (error) {
      console.error("Error deleting image:", error);
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
    // if (reportLocation) {
    //   await fetchTideData(
    //     reportLocation.latitude,
    //     reportLocation.longitude,
    //     date
    //   );
    // }

    const reportData = {
      userId: user ? user.uid : null,
      organizerName,
      date: date.toISOString(),
      time: { from: timeFrom.toISOString(), to: timeTo.toISOString() },
      transportOptions: busId ? busId : null,
      volunteerGuidelines,
      contactNumber,
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
      setContactNumber("");
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
    console.log("Date changed: ", currentDate);

    // Reset tide data when date changes
    // setTideDetails(null);
    // if (reportLocation) {
    //   fetchTideData(
    //     reportLocation.latitude,
    //     reportLocation.longitude,
    //     currentDate
    //   );
    // }
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
            onPress={() => setShowTimeToPicker(true)}
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
        <View style={styles.inputContainer}>
          <Icon name="call" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.inputn}
            placeholder="Enter Contact Number"
            keyboardType="numeric"
            value={contactNumber}
            onChangeText={handleContactNumberChange}
            placeholderTextColor="#666"
          />
        </View>

        <Text style={styles.sectionTitle}>Transport Options</Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            navigation.navigate("BusSetup" as never);
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            Add
          </Text>
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

        {/* Image Upload */}
        <Text style={styles.sectionTitle}>Images</Text>
        <Text style={styles.sectionDescription}>
          Upload Images of the event area
        </Text>
        <View style={styles.imagesContainer}>
          <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
          {images.map((imageUrl, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUrl }} style={styles.uploadedImage} />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => removeImage(imageUrl)}
              >
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleSubmitReport}
        >
          <Text style={styles.submitButtonText}>Organize Event</Text>
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
  inputn: {
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  locationButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 25,
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
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
  },
  date: {},
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imagePlaceholder: {
    width: 170,
    height: 100,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  addImageText: {
    fontSize: 24,
    color: "#888",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007AFF",
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  uploadedImage: {
    width: 170,
    height: 100,
    borderRadius: 8,
  },
  inputContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    borderColor: "#ccc",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  errorText: {
    color: "red",
    marginHorizontal: 10,
  },
  removeIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 2,
  },
});

export default OrganizeEvents;
