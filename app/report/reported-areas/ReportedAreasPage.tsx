import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons

// Example data
const reportData = [
  {
    id: '1',
    beachName: 'Hikkaduwa Beach',
    date: 'April 15, 2024',
    wasteLevel: 'High Waste Level',
    wasteLevelColor: 'red',
    status: 'Pending',
    statusColor: 'green',
    image: 'https://img.freepik.com/free-photo/trash-sand-beach-showing-environmental-pollution-problem_1150-6523.jpg',
  },
  {
    id: '2',
    beachName: 'Palm Cove Beach',
    date: 'July 07, 2024',
    wasteLevel: 'Low Waste Level',
    wasteLevelColor: 'orange',
    status: 'Completed',
    statusColor: 'blue',
    image: 'https://img.freepik.com/free-photo/plastic-bottles-trash-sand-beach-environmental-pollution_1150-11114.jpg',
  },
  {
    id: '3',
    beachName: 'Coral Bay Beach',
    date: 'April 10, 2024',
    wasteLevel: 'High Waste Level',
    wasteLevelColor: 'red',
    status: 'Pending',
    statusColor: 'green',
    image: 'https://img.freepik.com/free-photo/trash-seaweed-ocean-beach_1150-10776.jpg',
  },
];

// Report Card Component
const ReportCard = ({ item }: { item: any }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.beachName}>{item.beachName}</Text>
        <View style={styles.row}>
          <Icon name="calendar" size={20} color="#000" />
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="trash" size={20} color="#000" />
          <Text style={[styles.wasteLevel, { color: item.wasteLevelColor }]}>{item.wasteLevel}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="pulse" size={20} color="#000" />
          <Text style={[styles.status, { color: item.statusColor }]}>{item.status}</Text>
        </View>
      </View>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
    </View>
  );
};

import { NavigationProp } from '@react-navigation/native';

const ReportedAreasPage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View>
        <Text style={styles.topic}>Reported Areas</Text>
      </View> */}
    <ScrollView style={styles.container}>
      <View>
        {reportData.map((item) => (
          <ReportCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  topic: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardInfo: {
    flex: 1,
    padding: 15,
  },
  beachName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  date: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  wasteLevel: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  status: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardImage: {
    width: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
});

export default ReportedAreasPage;
