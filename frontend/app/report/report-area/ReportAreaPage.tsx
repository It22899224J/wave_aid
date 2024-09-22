import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // You need to install react-native-maps
import * as ImagePicker from 'expo-image-picker';

const ReportAreaPage = () => {

    const [pollutionLevel, setPollutionLevel] = useState('High');
    const [priorityLevel, setPriorityLevel] = useState('Medium');
  
    const handlePollutionLevelChange = (level: string) => {
      setPollutionLevel(level);
    };
  
    const handlePriorityLevelChange = (level : string) => {
      setPriorityLevel(level);
    };

    const [images, setImages] = useState([
        'https://img.freepik.com/free-photo/trash-sand-beach-showing-environmental-pollution-problem_1150-6523.jpg',
        'https://img.freepik.com/free-photo/plastic-bottles-trash-sand-beach-environmental-pollution_1150-11114.jpg',
    ]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setImages([...images, result.assets[0].uri]);
        }
      };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View>
        <Text style={styles.topic}>Report Area</Text>
      </View> */}
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Select Location</Text>
      <Text style={styles.sectionDescription}>Select the reporting area from the map</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 7.8731,
          longitude: 80.7718,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {/* <Marker coordinate={{ latitude: 6.9271, longitude: 79.8612 }} /> */}
      </MapView>

      <TouchableOpacity style={styles.locationButton}>
        <Text style={styles.submitButtonText}>Pick a Location</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Report Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your description about the location"
        multiline
        numberOfLines={4}
        textAlignVertical='top'
      />

      <Text style={styles.sectionTitle}>Pollution Level</Text>
      <View style={styles.pollutionLevelContainer}>
        {['High', 'Medium', 'Low'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.pollutionButton,
              pollutionLevel === level && styles.pollutionButtonSelected,
            ]}
            onPress={() => handlePollutionLevelChange(level)}
          >
            <Text
              style={[
                styles.pollutionButtonText,
                pollutionLevel === level && styles.pollutionButtonTextSelected,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Enter Full Name</Text>
      <TextInput style={styles.input} placeholder="Enter your full name" />

      <Text style={styles.sectionTitle}>Contact Number</Text>
      <TextInput style={styles.input} placeholder="Enter your contact number" keyboardType="phone-pad" />

      <Text style={styles.sectionTitle}>Email Address</Text>
      <TextInput style={styles.input} placeholder="Enter your email address" keyboardType="email-address" />

      <Text style={styles.sectionTitle}>Images</Text>
      <Text style={styles.sectionDescription}>Upload Images of the reported area</Text>
      <View style={styles.imagesContainer}>
        <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
          <Text style={styles.addImageText}>+</Text>
        </TouchableOpacity>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePlaceholder} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Priority Level</Text>
      <View style={styles.pollutionLevelContainer}>
        {['High', 'Medium', 'Low'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.pollutionButton,
              priorityLevel === level && styles.pollutionButtonSelected,
            ]}
            onPress={() => handlePriorityLevelChange(level)}
          >
            <Text
              style={[
                styles.pollutionButtonText,
                priorityLevel === level && styles.pollutionButtonTextSelected,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>

    </ScrollView>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 15,
            gap: 10,
        backgroundColor:"#ffffff",
    },
    topic: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
      },
      map: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
      },
      input: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
      },
      pollutionLevelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      pollutionButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
      },
      pollutionButtonSelected: {
        backgroundColor: '#007AFF',
      },
      pollutionButtonText: {
        fontSize: 16,
        color: '#666',
      },
      pollutionButtonTextSelected: {
        color: '#ffffff',
      },
      reportImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
      },
      submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
      },
      locationButton: { 
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
      },
      submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      imagePlaceholder: {
        width: 170,
        height: 100,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
      },
      addImageText: {
        fontSize: 24,
        color: '#888',
      },
    
});

export default ReportAreaPage;
