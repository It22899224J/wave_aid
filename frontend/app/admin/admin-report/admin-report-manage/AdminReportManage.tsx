import React, { useEffect, useState } from 'react';
import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/service/firebase';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have this package installed

interface Report {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
  fullName: string;
  description: string;
  contactNumber: string;
  email: string;
  images: string[];
  pollutionLevel: string;
  priorityLevel: string;
  status: string;
  timestamp: string;
}

const ManageReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setLoading(true);
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
            description: data.description,
            contactNumber: data.contactNumber,
            email: data.email,
            images: data.images || [],
            pollutionLevel: data.pollutionLevel,
            priorityLevel: data.priorityLevel,
            status: data.status,
            timestamp: data.timestamp?.toDate().toString() || '',
          });
        }
      });
      setReports(fetchedReports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const filteredReports = reports
    .filter((report) => report.status === activeTab)
    .filter((report) => {
      const locationParts = report.location.locationName.split(',').map(part => part.trim());
      const displayTitle = locationParts.slice(0, 2).join(', ');
      return displayTitle.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    const reportDoc = doc(db, 'reports', reportId);
    await updateDoc(reportDoc, { status: newStatus });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Reports..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        {["Pending", "Accepted", "Rejected", "Completed"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === tab.toLowerCase() && styles.activeTab]}
            onPress={() => setActiveTab(tab.toLowerCase())}
          >
            <Text style={activeTab === tab.toLowerCase() ? styles.activeTabText : styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : filteredReports.length === 0 ? (
        <View style={styles.noReportsContainer}>
          <Text style={styles.noReportsText}>
            No Reports {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {filteredReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              {/* Title and Dropdown Icon */}
              <TouchableOpacity 
                style={styles.reportTitleContainer} 
                onPress={() => setExpandedReportId(expandedReportId === report.id ? null : report.id)}
              >
                {/* Split the location name by commas and join the first two parts */}
                {(() => {
                  const locationParts = report.location.locationName.split(',').map(part => part.trim());
                  const displayTitle = locationParts.slice(0, 2).join(', ');
                  return (
                    <Text style={styles.reportTitle} numberOfLines={1}>
                      {displayTitle.length > 30 ? `${displayTitle.substring(0, 30)}...` : displayTitle}
                    </Text>
                  );
                })()}
                <Icon name={expandedReportId === report.id ? "expand-less" : "expand-more"} size={20} />
              </TouchableOpacity>
              
              {/* Expanded Details */}
              {expandedReportId === report.id && (
                <View style={styles.expandedDetails}>
                  <Text style={styles.reportDetails}>Reported by: {report.fullName}</Text>
                  <Text style={styles.reportDetails}>Description: {report.description}</Text>
                  <Text style={styles.reportDetails}>Pollution Level: {report.pollutionLevel}</Text>
                  <Text style={styles.reportDetails}>Priority Level: {report.priorityLevel}</Text>
                  <Text style={styles.reportDetails}>Contact: {report.contactNumber}</Text>
                  <Text style={styles.reportDetails}>Email: {report.email}</Text>
                  <Text style={styles.reportDetails}>Current Status: {report.status}</Text>

                  {/* Status Picker */}
                  <Picker
                    selectedValue={selectedStatus || report.status}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  >
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Accepted" value="accepted" />
                    <Picker.Item label="Rejected" value="rejected" />
                    <Picker.Item label="Completed" value="completed" />
                  </Picker>

                  {/* Button to update the status */}
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => updateReportStatus(report.id, selectedStatus || report.status)}
                  >
                    <Text style={styles.buttonText}>Update Status</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loader: {
    marginTop: 20,
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTab: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tabText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  reportCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    overflow: 'hidden',
    textAlign: 'left',
  },
  expandedDetails: {
    marginTop: 10,
  },
  reportDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noReportsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReportsText: {
    fontSize: 18,
    color: '#999',
  },
});

export default ManageReportsPage;
