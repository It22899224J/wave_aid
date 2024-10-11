import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/service/firebase';

interface Report {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
  fullName: string;
  status: string;
}

interface Props {
  navigation: NavigationProp<any>;
}

const ReportMainView = ({ navigation }: Props) => {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = () => {
    const unsubscribe = onSnapshot(collection(db, 'reports'), (querySnapshot) => {
      const fetchedReports: Report[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.location && (data.status === 'completed' || data.status === 'accepted')) {
          fetchedReports.push({
            id: doc.id,
            location: {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
              locationName: data.location.locationName,
            },
            fullName: data.fullName,
            status: data.status,
          });
        }
      });

      setReports(fetchedReports);
    });

    return unsubscribe;
  };

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = fetchReports();
      return () => unsubscribe();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://globalnomadic.com/wp-content/uploads/2024/02/AdobeStock_644054501.jpeg' }}
            style={styles.headerImage}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report a Cleanup Area</Text>
          <Text style={styles.cardDescription}>
            Help us keep our beaches clean! Click the button below to report a cleanup area.
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ReportAreaPage')}
          >
            <Text style={styles.buttonText}>Report Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://www.ecowatch.com/wp-content/uploads/2022/07/GettyImages-1353301481-scaled.jpg' }}
            style={styles.headerImage}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Check Your Reported Areas</Text>
          <Text style={styles.cardDescription}>
            Check the details and the state of your reported beach cleanup areas.
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ReportedAreasPage')}
          >
            <Text style={styles.buttonText}>Reported Areas</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>All Reported Areas By Users</Text>
        <Text style={styles.sectionDescription}>Tap on a marker to view detailed report information.</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 7.8731,
            longitude: 80.7718,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
        >
          {reports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              title={report.location.locationName}
              description={`Reported by ${report.fullName}`}
            >
              <Callout onPress={() => navigation.navigate('ReportDetailsPage', { reportId: report.id })}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{report.location.locationName}</Text>
                  <Text style={styles.calloutDescription}>Reported by {report.fullName}</Text>
                  <TouchableOpacity
                    style={styles.dialogButton}
                  >
                    <Text style={styles.dialogButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginHorizontal: 0,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    marginLeft: 20,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  calloutContainer: {
    width: 250,
    height: '100%',
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  dialogButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  dialogButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ReportMainView;
