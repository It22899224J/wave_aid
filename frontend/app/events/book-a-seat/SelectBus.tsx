import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { BusContext } from '@/context/BusContext';
import { useNavigation } from '@react-navigation/native';
import Loader from '@/components/loader/Loader';
import { Bus } from '@/types/Bus';

const SelectBus: React.FC = () => {
  const { buses, loading, error } = useContext(BusContext);
  const navigation = useNavigation();

  const handleBusPress = (busId: string) => {
    navigation.navigate('BusLayout' as never, { busId } as never);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  const BusCard = ({ item }: { item: Bus }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
      data={buses}
      renderItem={({ item }) => <BusCard item={item} />}
      keyExtractor={item => item.id}
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
