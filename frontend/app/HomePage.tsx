// HomePage.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
 // Your existing component

const HomePage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Wave-Aid</Text>
        <Text style={styles.headerSubtitle}>Beach Cleanup and Event Organizer</Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        
        <View style={styles.feature}>
          <Ionicons name="calendar-outline" size={40} color="#00acf0" />
          <Text style={styles.featureText}>Organize Beach Cleanups</Text>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="bus-outline" size={40} color="#00acf0" />
          <Text style={styles.featureText}>Transport Management</Text>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="people-outline" size={40} color="#00acf0" />
          <Text style={styles.featureText}>Seat Booking for Events</Text>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="analytics-outline" size={40} color="#00acf0" />
          <Text style={styles.featureText}>Event Analytics</Text>
        </View>
      </View>

      {/* Upcoming Events Slider */}
      <View style={styles.sliderSection}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        
      </View>
      
      {/* CTA Button */}
      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Enroll in an Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FB', // Light background
  },
  header: {
    padding: 20,
    backgroundColor: '#00acf0', // Primary color
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
  sliderSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#00C78B', // Accent color
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
