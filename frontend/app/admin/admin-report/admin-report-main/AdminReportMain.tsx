import { db } from "@/service/firebase";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useState } from "react";
import { Image, SafeAreaView, Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

interface Props {
    navigation: NavigationProp<any>;
}

interface Report {
    id: string;
    location: {
      latitude: number;
      longitude: number;
      locationName: string;
    };
    fullName: string;
  }

const AdminReportMain = ({navigation} : Props) => {
    const [reports, setReports] = useState<Report[]>([]);

    const fetchReports = () => {
        const unsubscribe = onSnapshot(collection(db, 'reports'), (querySnapshot) => {
          const fetchedReports: Report[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.location) {
              fetchedReports.push({
                id: doc.id,
                location: {
                  latitude: data.location.latitude,
                  longitude: data.location.longitude,
                  locationName: data.location.locationName,
                },
                fullName: data.fullName,
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
                <Text style={styles.cardTitle}>Manage User Reports</Text>
                <Text style={styles.cardDescription}>
                    Manage the reported areas submitted by users. View details of the reports and take necessary actions.
                </Text>
                <TouchableOpacity 
                    style={styles.button}
                    // onPress={() => navigation.navigate('ReportAreaPage')}
                >
                    <Text style={styles.buttonText}>Manage</Text>
                </TouchableOpacity>
                </View>
                <Text style={styles.sectionTitle}>All Reported Areas</Text>
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
                    <Callout 
                        // onPress={() => navigation.navigate('ReportDetailsPage', { reportId: report.id })}
                    >
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
}

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
      height: 250,
      resizeMode: 'cover',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    card: {
      backgroundColor: '#ffffff',
      padding: 25,
      borderRadius: 15,
      marginHorizontal: 20,
      marginTop: -40,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 8,
    },
    cardDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
      },
    cardTitle: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 15,
      textAlign: 'center',
      color: '#333', 
    },
    button: {
      backgroundColor: '#007AFF', 
      paddingVertical: 14, 
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#28a745',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700', 
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      marginLeft: 20,
      color: '#333', 
    },
    sectionDescription: {
      fontSize: 14,
      color: '#777',
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
  

export default AdminReportMain;