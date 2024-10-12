import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from "./../../../service/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface RouteParams {
  location?: {
    latitude: number;
    longitude: number;
  };
  locationName?: string;
  report?: {
    id: string;
    pollutionLevel: string;
    priorityLevel: string;
    fullName: string;
    contactNumber: string;
    email: string;
    description: string;
    images: string[];
    location: {
      latitude: number;
      longitude: number;
      locationName: string;
    };
  };
  reportId: string
}

type RootStackParamList = {
  UpdateReportLocation: {
    currentLocation: { latitude: number; longitude: number } | undefined;
    reportId: string
  };
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const UpdateReportPage = ({ navigation }: Props) => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { location, locationName, reportId } = route.params || {};

  const [pollutionLevel, setPollutionLevel] = useState('Low');
  const [priorityLevel, setPriorityLevel] = useState('Low');
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [reportLocation, setReportLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [reportLocationName, setReportLocationName] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const addressParts = reportLocationName.split(", ");
  const shortenedAddress = addressParts.slice(0, 1).join(", ");

  const validateForm = useCallback(() => {
    const isValid = 
      fullName.trim() !== '' &&
      contactNumber.trim() !== '' &&
      email.trim() !== '' &&
      reportLocation !== undefined &&
      images.length > 0 &&
      images.length <= 4;
    setIsFormValid(isValid);
  }, [fullName, contactNumber, email, reportLocation, images]);

  useEffect(() => {
    validateForm();
  }, [fullName, contactNumber, email, reportLocation, images, validateForm]);

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (reportId) {
        const reportRef = doc(db, 'reports', reportId);
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          const data = reportSnap.data();
          setPollutionLevel(data.pollutionLevel);
          setPriorityLevel(data.priorityLevel);
          setFullName(data.fullName);
          setContactNumber(data.contactNumber);
          setEmail(data.email);
          setDescription(data.description);
          setImages(data.images || []);
          setReportLocationName(data.location.locationName);
          setReportLocation({ latitude: data.location.latitude, longitude: data.location.longitude });
        }
      }
    };

    fetchReportDetails();
  }, [reportId]);

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      setReportLocation({ latitude: location.latitude, longitude: location.longitude });
      setReportLocationName(locationName || 'Location not selected');
    }
  }, [location, locationName]);

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert('Maximum Images', 'You can only upload up to 4 images.');
      return;
    }

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
    const response = await fetch(uri);
    const blob = await response.blob();
    const metadata = {
      contentType: 'image/jpeg',
    };
    const fileName = `${new Date().getTime()}-report-image.jpg`;
    const storageRef = ref(storage, `reports/${fileName}`);

    try {
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
      console.error('Error deleting image:', error);
    }
  };

  const handlePickLocation = () => {
    if (reportId) {
      navigation.navigate('UpdateReportLocation', { currentLocation: reportLocation, reportId: reportId });
    } else {
      Alert.alert('Error', 'Report data not found.');
    }
  };

  const handleUpdateReport = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill in all required fields and upload at least one image (maximum 4).');
      return;
    }

    setLoading(true);

    const reportData = {
      fullName,
      contactNumber,
      email,
      description,
      pollutionLevel,
      priorityLevel,
      location: {
        latitude: reportLocation?.latitude || null,
        longitude: reportLocation?.longitude || null,
        locationName: reportLocationName,
      },
      images,
      status: 'pending',
      timestamp: new Date(),
    };

    try {
      if (reportId) {
        await updateDoc(doc(db, 'reports', reportId), reportData);
        Alert.alert('Success', 'Your report has been updated.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Report ID is missing.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the report.');
      console.error('Error updating document: ', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Updating your report...</Text>
        </View>
      )}
      
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Location *</Text>
        <Text style={styles.sectionDescription}>Select the reporting area from the map</Text>
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

        <TouchableOpacity style={styles.locationButton} onPress={handlePickLocation}>
          <Text style={styles.submitButtonText}>Select Location</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Report Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your description about the location"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.sectionTitle}>Pollution Level</Text>
        <View style={styles.pollutionLevelContainer}>
          {['High', 'Medium', 'Low'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.pollutionButton, pollutionLevel === level && styles.pollutionButtonSelected]}
              onPress={() => setPollutionLevel(level)}
            >
              <Text style={[styles.pollutionButtonText, pollutionLevel === level && styles.pollutionButtonTextSelected]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Enter Full Name *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your full name" 
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.sectionTitle}>Contact Number *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your contact number" 
          keyboardType="phone-pad"
          value={contactNumber}
          onChangeText={setContactNumber}
        />

        <Text style={styles.sectionTitle}>Email Address *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your email address" 
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.sectionTitle}>Images *</Text>
        <Text style={styles.sectionDescription}>Upload Images of the reporting area (1-4 images)</Text>
        <View style={styles.imagesContainer}>
          {images.length < 4 && (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
              <Text style={styles.addImageText}>+</Text>
            </TouchableOpacity>
          )}
          {images.map((imageUrl, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: imageUrl }} style={styles.uploadedImage} />
              <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(imageUrl)}>
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Priority Level</Text>
        <View style={styles.pollutionLevelContainer}>
          {['High', 'Medium', 'Low'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.pollutionButton, priorityLevel === level && styles.pollutionButtonSelected]}
              onPress={() => setPriorityLevel(level)}
            >
              <Text style={[styles.pollutionButtonText, priorityLevel === level && styles.pollutionButtonTextSelected]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, !isFormValid && styles.disabledButton]} 
          onPress={handleUpdateReport}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>Update Report</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    backgroundColor: '#ffffff',
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
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
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
    borderRadius: 8,
  },
  addImageText: {
    fontSize: 24,
    color: '#888',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  uploadedImage: {
    width: 170,
    height: 100,
    borderRadius: 8,
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 2,
  },
});

export default UpdateReportPage;
