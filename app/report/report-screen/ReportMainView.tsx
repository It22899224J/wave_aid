import React from 'react';
import { View, Text, Image, Button, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const communityReports = [
    {
      id: '1',
      title: 'North Shore Beach',
      reporter: 'John Doe',
      image: 'https://img.freepik.com/free-photo/trash-sand-beach-showing-environmental-pollution-problem_1150-6523.jpg?t=st=1726859907~exp=1726863507~hmac=e629b8117539dbaa5a1f0e80ec4e573a16aec7a42f4b8d398a6740844b0636f1&w=1060', // Replace with actual image URL
    },
    {
      id: '2',
      title: 'Sunny Cove',
      reporter: 'Jane Smith',
      image: 'https://example.com/image2.jpg', // Replace with actual image URL
    },
    {
      id: '3',
      title: 'Ocean View Park',
      reporter: 'Alex Johnson',
      image: 'https://example.com/image3.jpg', // Replace with actual image URL
    },
  ];

import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
}

const ReportMainView= ({navigation}: Props) => {

    return (
      <View style={{ flex: 1 }}>
            <View>
                <Text style={styles.topic}>Report</Text>
            </View>
         <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://img.freepik.com/free-photo/trash-sand-beach-showing-environmental-pollution-problem_1150-6645.jpg?t=st=1726859923~exp=1726863523~hmac=20cade8c537967c9331b7eaa36cca7455e68433c872622b1010235964093b627&w=1060' }}
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
                    source={{ uri: 'https://img.freepik.com/free-photo/trash-sand-beach-showing-environmental-pollution-problem_1150-6523.jpg?t=st=1726859907~exp=1726863507~hmac=e629b8117539dbaa5a1f0e80ec4e573a16aec7a42f4b8d398a6740844b0636f1&w=1060' }}
                    style={styles.headerImage}
                />
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Check Reported Areas</Text>
                <Text style={styles.cardDescription}>
                    Check the details and the state of your reported beach cleanup areas.
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Reported Areas</Text>
                </TouchableOpacity>
            </View>
            {/* <Text style={styles.recentReportsTitle}>Recent Reports</Text>
            {communityReports.map((item) => (
                <View key={item.id} style={styles.recentReportCard}>
                <Image source={{ uri: item.image }} style={styles.recentImage} />
                <View style={styles.recentReportTextContainer}>
                    <Text style={styles.recentCardTitle}>{item.title}</Text>
                    <Text style={styles.recentCardDescription}>Reported by {item.reporter}</Text>
                </View>
                </View>
            ))} */}
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
      container: {
        display: "flex",
        flexDirection: "column",
        padding: 0,
            gap: 10,
        backgroundColor:"#ffffff"
      },
      topic: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
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
      recentReportsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginVertical: 10,
      },
      image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
      },
      recentReportCard: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
      },
      recentReportTextContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        flex: 1,
      },
      recentCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      recentCardDescription: {
        fontSize: 14,
        color: '#666',
      },
      recentImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        resizeMode: 'cover',
      },
});

export default ReportMainView;