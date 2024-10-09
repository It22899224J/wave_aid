import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { BusContext } from '@/context/BusContext';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import Loader from '@/components/loader/Loader';
import { Bus } from '@/types/Bus';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import { useAuth } from '@/context/AuthContext';

type RootStackParamList = {
  SelectBus: { eventId: string };
  BusLayout: { busId: string };
  BookingDetails: { busId: string };
  BookingConfirmation: { busId: string; seatNumbers: any };
};

type SelectBusNavigationProp = NavigationProp<RootStackParamList, 'SelectBus'>;

const SelectBus: React.FC = () => {
  const { buses, loading, error } = useContext(BusContext);
  const navigation = useNavigation<SelectBusNavigationProp>();
  const { user } = useAuth();

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

  const BusCard: React.FC<{ item: Bus }> = ({ item }) => {
    // Calculate booked and available seats
    const bookedSeats = item.seats.filter((seat: { status: string; }) => seat.status === 'booked');

    const userBookedSeats = item.seats.filter((seat: { status: string; userID: string }) => {
      return seat.status === 'booked' && seat.userID === user?.uid;
    });

    if (userBookedSeats) {
      console.log(userBookedSeats);
    }

    const handleViewBookingDetails = (busId: string) => {
      const seatNumbers = userBookedSeats.map((seat: { seatNumber: any; }) => seat.seatNumber);
      navigation.navigate('BookingConfirmation', { busId, seatNumbers });
    };

    const totalSeats = item.totalSeats;
    const availableSeats = totalSeats - bookedSeats.length;

    return (
      <View style={styles.card}>
        {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
        <View style={styles.cardContent}>
          <Text style={styles.destination}>{item.busName}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.info}>Departure Time: {item.departureTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.info}>{item.pickupLocationName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#555" />
            <Text style={styles.info}>{item.contactNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="grid-outline" size={16} color="#555" />
            <Text style={styles.info}>{availableSeats} available seats</Text>
          </View>
          <View style={styles.buttonContainer}>
            {userBookedSeats.length === 0 ? (
              // Only display the Select Bus button centered
              <View style={styles.centeredButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.selectButton]}
                  onPress={() => handleBusPress(item.id)}
                >
                  <Text style={styles.buttonText}>Book a Seat</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Display both buttons as before
              <>
                <TouchableOpacity
                  style={[styles.button, styles.selectButton]}
                  onPress={() => handleBusPress(item.id)}
                >
                  <Text style={styles.buttonText}>Book a Seat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.detailsButton]}
                  onPress={() => handleViewBookingDetails(item.id)}
                >
                  <Text style={[styles.buttonText, styles.detailsButtonText]}>View Booking</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

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
    backgroundColor: '#f5f7fa',
  },
  card: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  destination: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  info: {
    fontSize: 15,
    marginLeft: 10,
    color: '#34495e',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
  },
  selectButton: {
    backgroundColor: '#3498db',
  },
  detailsButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  detailsButtonText: {
    color: '#3498db',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});
export default SelectBus;
