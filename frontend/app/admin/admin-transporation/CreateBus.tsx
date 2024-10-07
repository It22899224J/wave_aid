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
  departureTime: string;
  imageUrl: string | null;
}

interface RouteParams {
  location?: {
    latitude: number;
    longitude: number;
  };
}

type RootStackParamList = {
  SelectLocation: {
    currentLocation: { latitude: number; longitude: number } | undefined;
  };
  // ... other routes
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

  // Update pickupLocation when location changes
  useEffect(() => {
    if (location) {
      setPickupLocation(`(${location.latitude}, ${location.longitude})`);
    }
  }, [location]);

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
    if (!rows || !busName || !pickupLocation) {
      alert("Please fill out all fields");
      return;
    }

    const imageUrl = await uploadImage();

    const seats: Seats[] = [];
    const totalSeats = (parseInt(rows) * seatsPerRow) + 1


    for (let row = 1; row <= parseInt(rows); row++) {
      for (let seat = 0; seat < seatsPerRow; seat++) {
        let seatNumber;

        if (row % 2 === 1) {

          seatNumber = (row - 1) * seatsPerRow + seat + 1;
        } else {

          seatNumber = row * seatsPerRow - seat;
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
      seatsPerRow: seatsPerRow,
      contactNumber: parseInt(contactNumber),
      totalSeats: totalSeats,
      pickupLocation,
      departureTime: departureTime.toTimeString().split(" ")[0],
      seats,
      imageUrl: imageUrl || null,
    };



    try {
      const busRef = await addDoc(collection(db, "buses"), bus);
      const busId = busRef.id;
      alert("Bus created successfully");
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
            style={styles.input}
            value={busName}
            onChangeText={setBusName}
            placeholder="Enter bus name"
          />

          <Text style={styles.label}>Number of Rows:</Text>
          <TextInput
            style={styles.input}
            value={rows}
            onChangeText={setRows}
            keyboardType="numeric"
            placeholder="e.g. 5"
          />
          <Text style={styles.label}>Seats Per Row:</Text>
          <Picker
            selectedValue={seatsPerRow}
            style={styles.picker}
            onValueChange={(itemValue) => setSeatsPerRow(itemValue)} // Directly set as a number
          >
            <Picker.Item label="4 (2-2)" value={4} />
            <Picker.Item label="5 (2-3)" value={5} />
          </Picker>


          <Text style={styles.label}>Contact Number:</Text>
          <TextInput
            style={styles.input}
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="numeric"
            placeholder="Enter contact number"
          />

          <Text style={styles.label}>Pickup Location:</Text>
          <TextInput
            style={styles.input}
            value={pickupLocation}
            editable={false}
          />
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

          <Text style={styles.label}>
            Selected Departure Time: {departureTime.toLocaleTimeString()}
          </Text>

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
});

export default BusSetup;
