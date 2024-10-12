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
  Image,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { updateDoc, doc, getDoc, onSnapshot, where, query, collection } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/service/firebase";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import * as ImageManipulator from "expo-image-manipulator";
import {
  deleteObject,
  getDownloadURL,
  uploadBytes,
  ref,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";


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
    contactNumber: string;
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

const UpdateOrganizeEvents = ({ navigation }: Props) => {
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
  const [reportId, setReportId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
    const [contactNumber, setContactNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [participants, setParticipants] = useState();
  


useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db, "registrations"), where("eventId", "==", reportId)),
    (registrationsSnapshot) => {
      // Get the event IDs from the documents
      const eventIds = registrationsSnapshot.docs.map(
        (doc) => doc.data().eventId
      );

      // Get the document count for the eventId
      const documentCount = registrationsSnapshot.size; // Number of documents
      setParticipants(documentCount);
    },
    (error) => {
      console.error("Error fetching registrations: ", error);
    }
  );

  // Clean up the listener on component unmount
  return () => unsubscribe();
}, [reportId]);

  
  
  useEffect(() => {
    const fetchReportDetails = async () => {
      if (report) {
        if (!report) return;
        const reportRef = doc(db, "events", report.id);
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          const data = reportSnap.data();
          setReportId(report.id);
          setOrganizerName(data.organizerName);
          setDate(new Date(data.date));
          setTimeFrom(new Date(data.time.from));
          setTimeTo(new Date(data.time.to));
          setTransportOptions(data.transportOptions);
          setWeatherDetails(data.weatherDetails);
          setContactNumber(data.contactNumber);
          setVolunteerGuidelines(data.volunteerGuidelines || [""]);
          setReportLocationName(data.location.locationName);
          setImages(data.images || []);
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
    console.log("Location: ", location);
    if (location) {
      setReportLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setReportLocationName(locationName || "Location not selected");
      fetchWeatherData(location.latitude, location.longitude);
      // fetchTideData(location.latitude, location.longitude, date);
    }
  }, [location, locationName,date]);

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
    console.log("Report: ", reportId);
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
      contactNumber,
      images,
      location: {
        latitude: reportLocation?.latitude || null,
        longitude: reportLocation?.longitude || null,
        locationName: reportLocationName,
      },
    };

    {
      if (reportId)
        try {
          console.log("Report Data: ", reportData);
          const reportRef = doc(db, "events", reportId);
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
      // Compress the image before uploading
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Example: resizing the image
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } 
      );

      // Fetch and convert the image to blob format
      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      const metadata = {
        contentType: blob.type || "image/jpeg", 
      };

      const fileName = `${new Date().getTime()}-report-image.jpg`;
      const storageRef = ref(storage, `reports/${fileName}`);

      // Upload the image blob to Firebase Storage
      await uploadBytes(storageRef, blob, metadata);

      // Get the download URL after upload
      const downloadURL = await getDownloadURL(storageRef);

      // Update state with new image URL
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
        {/* Image Upload */}
        <Text style={styles.sectionTitle}>Images</Text>
        <Text style={styles.sectionDescription}>
          Upload Images of the reporting area
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

          <View style={styles.weatherContainer}>
            <Text style={styles.sectionTitle}>Registration Details</Text>
            <Text>Current Count {participants} </Text>
          </View>

        {weatherDetails && (
          <View style={styles.weatherContainer}>
            <Text style={styles.sectionTitle}>Weather Details</Text>
            <Text>Temperature: {weatherDetails.main.temp} °C</Text>
            <Text>Condition: {weatherDetails.weather[0].description}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Transport Options</Text>
        {transportOptions ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UpdateTransport", {
                reportId: reportId,
                transportOptions: transportOptions,
              });
            }}
          >
            <Text style={styles.sectionDescription}>Update Transport</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.sectionDescription}>Transport not available</Text>
        )}

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
  inputn: {
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
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
  icon: {
    marginRight: 10,
  },
  addGuidelineText: {
    color: "#007BFF",
    marginVertical: 8,
    textAlign: "center",
  },
  guidelineContainer: {
    marginVertical: 8,
  },
  weatherContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
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
  removeIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 2,
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
});

export default UpdateOrganizeEvents;
