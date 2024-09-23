import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, View, ActivityIndicator } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/service/firebase';
import { ReportCard } from './ReportCard';

interface Report {
  id: string;
  beachName: string;
  date: string;
  wasteLevel: string;
  wasteLevelColor: string;
  status: string;
  statusColor: string;
  image: string;
}

const ReportedAreasPage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  
  const [reportData, setReportData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    const fetchReportedAreas = async () => {
      const q = query(collection(db, 'reports'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const reports = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const beachName = data.location.locationName.split(',')[0]; // Get first part of locationName
        const wasteLevelColor = getWasteLevelColor(data.pollutionLevel);
        const statusColor = getStatusColor(data.status);
        
        return {
          id: doc.id,
          beachName,
          date: data.timestamp.toDate().toLocaleDateString(), // Format date if needed
          wasteLevel: data.pollutionLevel,
          wasteLevelColor,
          status: data.status,
          statusColor,
          image: data.images[0] || 'default-image-url.png', 
        } as Report;

      });
      setReportData(reports);
    };

    fetchReportedAreas();
  }, [userId]);

  const getWasteLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleReportPress = (item: Report) => {
    navigation.navigate('ReportAreaPage', { report: item });
  };

  const confirmRemoveReport = (reportId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this report?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeReport(reportId),
        },
      ],
      { cancelable: true }
    );
  };

  const removeReport = async (reportId: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      setReportData(reportData.filter((report) => report.id !== reportId));
    } catch (error) {
      console.error('Error removing report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <ScrollView style={styles.container}>
        {reportData.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleReportPress(item)}>
            <ReportCard item={item} onRemove={confirmRemoveReport} />
          </TouchableOpacity>
        ))}
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default ReportedAreasPage;
