import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { BusContext } from '@/context/BusContext';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import Loader from '@/components/loader/Loader';
import { Bus } from '@/types/Bus';


type RootStackParamList = {
  SelectBus: { eventId: string };
  BusLayout: { busId: string };
};

type SelectBusNavigationProp = NavigationProp<RootStackParamList, 'SelectBus'>;

const SelectBus: React.FC = () => {
  const { buses, loading, error } = useContext(BusContext);
  const navigation = useNavigation<SelectBusNavigationProp>();

  const route = useRoute();
  const { eventId } = route.params as { eventId: string };

  const filteredBuses = buses.filter(bus => bus.eventID === eventId);

  const handleBusPress = (busId: string) => {
    navigation.navigate('BusLayout', { busId });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  const BusCard: React.FC<{ item: Bus }> = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
      <View style={styles.cardContent}>
        <Text style={styles.destination}>Bus to {item.busName}</Text>
        <Text style={styles.info}>Departure: {item.departureTime}</Text>
        <Text style={styles.info}>Pickup Location: {item.pickupLocation}</Text>
        <Text style={styles.info}>Contact: {item.contactNumber}</Text>
        <Text style={styles.info}>Rows: {item.rows}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleBusPress(item.id)}
        >
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={filteredBuses}
      renderItem={({ item }) => <BusCard item={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '30%',
    height: 'auto',
    aspectRatio: 1,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  destination: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SelectBus;