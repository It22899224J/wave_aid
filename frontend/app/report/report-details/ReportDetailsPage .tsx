import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#4A90E2';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{report.location.locationName}</Text>
          <Text style={styles.subtitle}>Reported by {report.fullName}</Text>
        </View>

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

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Icon name="warning" size={24} color={getPriorityColor(report.priorityLevel)} />
            <Text style={styles.infoLabel}>Priority</Text>
            <Text style={[styles.infoValue, { color: getPriorityColor(report.priorityLevel) }]}>
              {report.priorityLevel}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="eco" size={24} color="#4A90E2" />
            <Text style={styles.infoLabel}>Pollution</Text>
            <Text style={styles.infoValue}>{report.pollutionLevel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="event" size={24} color="#4A90E2" />
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(report.timestamp.seconds * 1000).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              title={report.location.locationName}
            >
              {/* <View style={styles.customMarker}>
                <Icon name="place" size={24} color="#FFFFFF" />
              </View> */}
            </Marker>
          </MapView>
        </View>

        {/* Modal to view the selected image */}
        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F5F9',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  section: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  carouselContainer: {
    marginBottom: 10,
  },
  carouselImage: {
    width: '100%',
    height: 260,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4A90E2',
  },
  inactiveDot: {
    backgroundColor: '#BDC3C7',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginTop: 2,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  customMarker: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  modalImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReportDetailsPage;