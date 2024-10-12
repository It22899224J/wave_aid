import React, { useEffect, useState } from 'react';
import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/service/firebase';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';

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

interface Props {
  navigation: NavigationProp<any>;
}

const ManageReportsPage = ({ navigation }: Props) => {
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

  const renderReportCard = (report: Report) => {
    const locationParts = report.location.locationName.split(',').map(part => part.trim());
    const displayTitle = locationParts.slice(0, 2).join(', ');
    const truncatedTitle = displayTitle.length > 30 ? `${displayTitle.substring(0, 30)}...` : displayTitle;

    return (
      <View key={report.id} style={styles.reportCard}>
        <TouchableOpacity 
          style={styles.reportTitleContainer} 
          onPress={() => setExpandedReportId(expandedReportId === report.id ? null : report.id)}
        >
          <Text style={styles.reportTitle} numberOfLines={1}>{truncatedTitle}</Text>
          <Icon name={expandedReportId === report.id ? "expand-less" : "expand-more"} size={24} color="#007AFF" />
        </TouchableOpacity>
        
        {expandedReportId === report.id && (
          <View style={styles.expandedDetails}>
            <ReportDetail label="Reported by" value={report.fullName} />
            <ReportDetail label="Description" value={report.description} />
            <ReportDetail label="Pollution Level" value={report.pollutionLevel} />
            <ReportDetail label="Priority Level" value={report.priorityLevel} />
            <ReportDetail label="Contact" value={report.contactNumber} />
            <ReportDetail label="Email" value={report.email} />
            <ReportDetail label="Current Status" value={report.status} />

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

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => updateReportStatus(report.id, selectedStatus || report.status)}
            >
              <Text style={styles.buttonText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Reports..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.tabsContainer}>
        {["Pending", "Accepted", "Rejected", "Completed"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === tab.toLowerCase() && styles.activeTab]}
            onPress={() => setActiveTab(tab.toLowerCase())}
          >
            <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.activeTabText]}>
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
        <ScrollView style={styles.scrollView}>
          {filteredReports.map(renderReportCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const ReportDetail = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    margin: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333',
  },
  expandedDetails: {
    marginTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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