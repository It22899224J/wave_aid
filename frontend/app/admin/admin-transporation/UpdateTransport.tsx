import React, { useContext, useState, useEffect } from 'react';

type Seats = {
  seatId: string | null;
  seatNumber: number;
  status: string;
  userID: string | null;
};
import { View, TextInput, Button, Text, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute, NavigationProp } from '@react-navigation/native';
import { BusContext } from '@/context/BusContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from './../../../service/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type RouteParams = {
  transportOptions: string;
  location?: {
    longitude: any;
    latitude: any; 
    name: string 
}; 
};

type Props = {
  navigation: NavigationProp<any>;
};

const UpdateTransport = ({ navigation }: Props) => {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { transportOptions,location } = route.params;
  const { buses } = useContext(BusContext);
 



  console.log(location)

  useEffect(() => {
    if (location) {
      setPickupLocation(`(${location.latitude}, ${location.longitude})`);
      setPickupLocationName(location.name);
    }
  }, [location]);

  // Find the bus to update
  const busDetails = buses.find(bus => bus.id === transportOptions);
  if (!busDetails) {
    console.error("Bus details not found for transportOptions:", transportOptions);
    return null; // or render an error message
  }

  // States to handle form fields
  const [busName, setBusName] = useState(busDetails.busName || '');
  const [rows, setRows] = useState(String(busDetails.rows || ''));
  const [seatsPerRow, setSeatsPerRow] = useState(busDetails.seatsPerRow || 4);
  const [contactNumber, setContactNumber] = useState(String(busDetails.contactNumber || ''));
  const [pickupLocation, setPickupLocation] = useState(busDetails.pickupLocation || '');
  const [departureTime, setDepartureTime] = useState<Date | null>(null); 
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(busDetails.imageUrl || null);
  const [pickupLocationName, setPickupLocationName] = useState<string>(busDetails.pickupLocationName);

  // Convert "HH:mm:ss" string to Date object
  useEffect(() => {
    if (busDetails?.departureTime) {
      const [hours, minutes, seconds] = busDetails.departureTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds);
      setDepartureTime(date);
    }
  }, [busDetails]);

  const handleSelectLocation = () => {
    // Navigate to SelectLocation and pass the current pickup location
    navigation.navigate('SelectLocation', { location: pickupLocation ,transportOptions });
  };

  // Function to pick an image
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

  // Function to upload an image
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

  // Function to handle the update of bus details
  const updateBus = async () => {
    if (!rows || !busName || !pickupLocation || !departureTime) {
      alert("Please fill out all fields");
      return;
    }

    const imageUrl = await uploadImage() || busDetails.imageUrl;
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
    
    
    

    // Convert Date to "HH:mm:ss" string format for Firestore
    const timeString = departureTime
      ? departureTime.toTimeString().split(" ")[0]
      : busDetails?.departureTime;

    const updatedBus = {
      busName,
      rows: parseInt(rows),
      seatsPerRow,
      contactNumber: parseInt(contactNumber),
      pickupLocation,
      totalSeats,
      seats,
      pickupLocationName,
      departureTime: timeString || '', 
      imageUrl,
    };

    try {
      const busRef = doc(db, "buses", transportOptions);
      await updateDoc(busRef, updatedBus);
      alert("Bus updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Error updating bus details. Please try again.");
    }
  };

  const showTimePickerHandler = () => {
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
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
            onValueChange={(itemValue) => setSeatsPerRow(itemValue)}
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
            value={pickupLocationName}
            editable={false}  // Location is non-editable from input field
          />
          <Button title="Update Location" onPress={handleSelectLocation} />

          <Text style={styles.label}>Departure Time:</Text>
          <Button title="Select Departure Time" onPress={showTimePickerHandler} />
          {showTimePicker && (
            <DateTimePicker
              value={departureTime || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          <Text style={styles.label}>
            Selected Departure Time: {departureTime?.toLocaleTimeString() || "Not set"}
          </Text>

          <Text style={styles.label}>Bus Image:</Text>
          <Button title="Pick an image" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}

          <Button title="Update Bus" onPress={updateBus} />
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

export default UpdateTransport;
