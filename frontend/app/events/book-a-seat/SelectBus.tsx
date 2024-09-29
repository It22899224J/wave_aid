import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from './../../../service/firebase'; // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Loader from '@/components/loader/Loader';

interface Bus {
  id: string;
  busName: string;
  rows: number;
  seatsPerRow: number;
  contactNumber: number;
  pickupLocation: string;
}

const SelectBus: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const busCollection = collection(db, 'buses');
        const busSnapshot = await getDocs(busCollection);
        const busList: Bus[] = busSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Bus[];
        setBuses(busList);
      } catch (err) {
        setError('Failed to fetch buses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleBusPress = () => {
    navigation.navigate('BusLayout' as never); // Navigate to BusLayout without parameters
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <FlatList
      data={buses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.busItem}>
          <TouchableOpacity onPress={handleBusPress}>
            <Text style={styles.busName}>{item.busName}</Text>
          </TouchableOpacity>
          <Text>Rows: {item.rows}</Text>
          <Text>Seats per Row: {item.seatsPerRow}</Text>
          <Text>Contact: {item.contactNumber}</Text>
          <Text>Pickup Location: {item.pickupLocation}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  busItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue', // Indicates it's clickable
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SelectBus;
