import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./../../../service/firebase";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

interface Seats {
  seatId: string | null;
  seatNumber: number | null;
  status: string;
  userID: string | null
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
    name: string
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
    const filename = image.substring(image.lastIndexOf('/') + 1);
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
      // Check if it's the last row to add an extra seat
      const isLastRow = (row === parseInt(rows));
    
      // Determine the total number of seats for the current row
      const totalSeatsInRow = isLastRow ? seatsPerRow + 1 : seatsPerRow;
    
      for (let seat = 0; seat < totalSeatsInRow; seat++) {
        let seatNumber;
    
        if (isLastRow) {
          // For the last row, apply the same odd/even logic
          seatNumber = (row % 2 === 1) 
            ? (row - 1) * seatsPerRow + seat + 1 // Odd row: increase left to right
            : row * seatsPerRow - seat; // Even row: decrease right to left
        } else {
          // For all other rows, alternate seat numbering
          seatNumber = row % 2 === 1
            ? (row - 1) * seatsPerRow + seat + 1
            : row * seatsPerRow - seat;
        }
    
        seats.push({
          seatId: null,
          seatNumber: seatNumber,
          status: "available",
          userID: null
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
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.label}>Bus Name:</Text>
          <TextInput
            style={[styles.input, errors.busName ? styles.errorInput : null]}
            value={busName}
            onChangeText={setBusName}
            placeholder="Enter bus name"
          />
          {errors.busName ? <Text style={styles.errorText}>{errors.busName}</Text> : null}

          <Text style={styles.label}>Number of Rows:</Text>
          <TextInput
            style={[styles.input, errors.rows ? styles.errorInput : null]}
            value={rows}
            onChangeText={setRows}
            keyboardType="numeric"
            placeholder="e.g. 5"
          />
          {errors.rows ? <Text style={styles.errorText}>{errors.rows}</Text> : null}

          <Text style={styles.label}>Seats Per Row:</Text>
          <Picker
            selectedValue={seatsPerRow}
            style={styles.picker}
            onValueChange={(itemValue) => setSeatsPerRow(itemValue)}
          >
            <Picker.Item label="4 (2-2)" value={4} />
            <Picker.Item label="5 (2-3)" value={5} />
          </Picker>

          <Text style={styles.label}>Contact Number:</Text>
          <TextInput
            style={[styles.input, errors.contactNumber ? styles.errorInput : null]}
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="numeric"
            placeholder="Enter contact number"
          />
          {errors.contactNumber ? <Text style={styles.errorText}>{errors.contactNumber}</Text> : null}

          <Text style={styles.label}>Pickup Location:</Text>
          <TextInput
            style={[styles.input, errors.pickupLocation ? styles.errorInput : null]}
            value={location?.name}
            editable={false}
          />
          {errors.pickupLocation ? <Text style={styles.errorText}>{errors.pickupLocation}</Text> : null}
          <Button title="Select Location" onPress={handleSelectLocation} />

          <Text style={styles.label}>Departure Time:</Text>
          <Button title="Select Departure Time" onPress={showTimePickerHandler} />
          {showTimePicker && (
            <DateTimePicker
              value={departureTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.label}>Selected Departure Time: {departureTime.toLocaleTimeString()}</Text>

          <Text style={styles.label}>Bus Image:</Text>
          <Button title="Pick an image" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}

          <Button title="Create Bus" onPress={createBus} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  errorInput: {
    borderColor: "red",
  },
});

export default BusSetup;
