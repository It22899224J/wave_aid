import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebase';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReanimatedCarousel from 'react-native-reanimated-carousel';

interface Report {
  id: string;
  pollutionLevel: string;
  priorityLevel: string;
  fullName: string;
  contactNumber: string;
  email: string;
  description: string;
  images: string[];
  status: string;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

type ReportDetailsRouteProp = RouteProp<{ params: { reportId: string } }, 'params'>;

const ReportDetailsPage = () => {
  const route = useRoute<ReportDetailsRouteProp>();
  const { reportId } = route.params;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const docRef = doc(db, 'reports', reportId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReport(docSnap.data() as Report);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log('Error getting document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [reportId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />;
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No details available for this report.</Text>
      </View>
    );
  }

  const handleImagePress = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderCarouselItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item }} style={styles.carouselImage} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {report.images && report.images.length > 0 ? (
          <View style={styles.carouselContainer}>
            <ReanimatedCarousel
              loop
              width={screenWidth}
              height={260}
              mode="parallax"
              data={report.images}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={renderCarouselItem}
            />
            <View style={styles.pagination}>
              {report.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{report.location.locationName}</Text>
      <Text style={styles.subtitle}>Reported by {report.fullName}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{report.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Pollution Level</Text>
        <Text style={styles.value}>{report.pollutionLevel}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Priority Level</Text>
        <Text style={styles.value}>{report.priorityLevel}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: report.location.latitude,
            longitude: report.location.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          <Marker
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
            title={report.location.locationName}
          />
        </MapView>
      </View>

      <Text style={styles.timestamp}>
        Reported on: {new Date(report.timestamp.seconds * 1000).toLocaleString()}
      </Text>

      {/* Modal to view the selected image */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2980b9',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    paddingLeft: 5,
    lineHeight: 22,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carouselImage: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  inactiveDot: {
    backgroundColor: '#bdc3c7',
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  timestamp: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 50,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 10,
  },
  modalImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default ReportDetailsPage;
