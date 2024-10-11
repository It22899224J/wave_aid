import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./../../../service/firebase";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';

interface Seats {
  seatId: string | null;
  seatNumber: number | null;
  status: string;
  userID: string | null;
}

interface Bus {
  rows: number;
  busName: string;
  seatsPerRow: number;
  seats: Seats[];
  eventID: string | null;
  totalSeats: number;
  contactNumber: number;
  pickupLocation: string;
  pickupLocationName: string;
  departureTime: string;
  imageUrl: string | null;
}

interface RouteParams {
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

type RootStackParamList = {
  SelectLocation: {
    currentLocation: { latitude: number; longitude: number } | undefined;
  };
  OrganizeEvents: {
    busId: string;
  };
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const BusSetup = ({ navigation }: Props) => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { location } = route.params || {};

  const [busName, setBusName] = useState<string>("");
  const [rows, setRows] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [seatsPerRow, setSeatsPerRow] = useState<number>(4); // Default to 4
  const [image, setImage] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [pickupLocationName, setPickupLocationName] = useState<string>("");

  const [errors, setErrors] = useState({
    busName: "",
    rows: "",
    contactNumber: "",
    pickupLocation: "",
  });

  useEffect(() => {
    if (location) {
      setPickupLocation(`(${location.latitude}, ${location.longitude})`);
      setPickupLocationName(location.name);
    }
  }, [location]);

  const validateFields = () => {
    const newErrors = {
      busName: busName ? "" : "Bus name is required",
      rows: rows && parseInt(rows) > 0 ? "" : "Enter a valid number of rows",
      contactNumber: contactNumber && /^\d{10}$/.test(contactNumber)
        ? ""
        : "Enter a valid 10-digit contact number",
      pickupLocation: pickupLocation ? "" : "Pickup location is required",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    const response = await fetch(image);
    const blob = await response.blob();
    const filename = image.substring(image.lastIndexOf("/") + 1);
    const storageRef = ref(storage, `bus_images/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  const createBus = async () => {
    if (!validateFields()) {
      Alert.alert("Validation Error", "Please fix the errors before proceeding.");
      return;
    }

    const imageUrl = await uploadImage();
    const seats: Seats[] = [];
    const totalSeats = (parseInt(rows) * seatsPerRow) + 1;

    for (let row = 1; row <= parseInt(rows); row++) {
      const isLastRow = row === parseInt(rows);
      const totalSeatsInRow = isLastRow ? seatsPerRow + 1 : seatsPerRow;

      for (let seat = 0; seat < totalSeatsInRow; seat++) {
        let seatNumber = row % 2 === 1
          ? (row - 1) * seatsPerRow + seat + 1
          : row * seatsPerRow - seat;

        seats.push({
          seatId: null,
          seatNumber,
          status: "available",
          userID: null,
        });
      }
    }

    const bus: Bus = {
      busName,
      rows: parseInt(rows),
      eventID: null,
      seatsPerRow,
      contactNumber: parseInt(contactNumber),
      totalSeats,
      pickupLocation,
      pickupLocationName,
      departureTime: departureTime.toTimeString().split(" ")[0],
      seats,
      imageUrl: imageUrl || null,
    };

    try {
      const busRef = await addDoc(collection(db, "buses"), bus);
      const busId = busRef.id;
      navigation.navigate("OrganizeEvents", { busId });
      Alert.alert("Success", "Bus created successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleSelectLocation = () => {
    navigation.navigate("SelectLocation", { currentLocation: location });
  };

  const showTimePickerHandler = () => {
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setDepartureTime(selectedTime);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Bus Setup</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="bus-outline" size={24} color="#00acf0" style={styles.icon} />
            <TextInput
              style={[styles.input, errors.busName ? styles.errorInput : null]}
              value={busName}
              onChangeText={setBusName}
              placeholder="Enter bus name"
              placeholderTextColor="#999"
            />
          </View>
          {errors.busName ? <Text style={styles.errorText}>{errors.busName}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="grid-outline" size={24} color="#00acf0" style={styles.icon} />
            <TextInput
              style={[styles.input, errors.rows ? styles.errorInput : null]}
              value={rows}
              onChangeText={setRows}
              keyboardType="numeric"
              placeholder="Number of rows (e.g. 5)"
              placeholderTextColor="#999"
            />
          </View>
          {errors.rows ? <Text style={styles.errorText}>{errors.rows}</Text> : null}

          <View style={styles.pickerContainer}>
            <Ionicons name="people-outline" size={24} color="#00acf0" style={styles.icon} />
            <Picker
              selectedValue={seatsPerRow}
              style={styles.picker}
              onValueChange={(itemValue) => setSeatsPerRow(itemValue)}
            >
              <Picker.Item label="4 seats per row (2-2)" value={4} />
              <Picker.Item label="5 seats per row (2-3)" value={5} />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={24} color="#00acf0" style={styles.icon} />
            <TextInput
              style={[styles.input, errors.contactNumber ? styles.errorInput : null]}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="numeric"
              placeholder="Enter contact number"
              placeholderTextColor="#999"
            />
          </View>
          {errors.contactNumber ? <Text style={styles.errorText}>{errors.contactNumber}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={24} color="#00acf0" style={styles.icon} />
            <TextInput
              style={[styles.input, errors.pickupLocation ? styles.errorInput : null]}
              value={pickupLocationName}
              editable={false}
              placeholder="Pickup location"
              placeholderTextColor="#999"
            />
          </View>
          {errors.pickupLocation ? <Text style={styles.errorText}>{errors.pickupLocation}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSelectLocation}>
            <Ionicons name="map-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Select Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showTimePickerHandler}>
            <Ionicons name="time-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Select Departure Time</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={departureTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          <Text style={styles.selectedTime}>Selected Time: {departureTime.toTimeString().split(" ")[0]}</Text>

          <Text style={styles.label}>Bus Image:</Text>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="camera-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Pick an Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={createBus}>
            <Text style={styles.submitButtonText}>Create Bus</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F9FB",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    flex: 1,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#00acf0",
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedTime: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: "#00C78B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: 'bold',
  },
});


export default BusSetup;
