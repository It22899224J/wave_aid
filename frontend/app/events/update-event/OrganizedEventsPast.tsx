import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/service/firebase";
import { EventCard } from "../events-view/EventCard";
import moment from "moment";
import { useReportContext } from "@/context/ReportContext";

interface Event {
  id: string;
  beachName: string;
  date: string;
  time: string;
  weather: string;
  organizer: string;
  tide: string;
  image: string;
}

const OrganizedEventsPast = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [reportData, setReportData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid;

  const { reportId, setReportId } = useReportContext();

  useEffect(() => {
    if (reportId) {
      console.log("Updated reportId:", reportId);
    }
  }, [reportId]);


  useEffect(() => {
    const fetchReportedAreas = async () => {
      const currentDate = new Date().toISOString();
      const q = query(
        collection(db, "events"),
        where("userId", "==", userId),
        where("date", "<", currentDate)
      );
      const querySnapshot = await getDocs(q);

      const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const beachName = data.location.locationName.split(",")[0]; // Get first part of locationName
        const wasteLevelColor = getWasteLevelColor(data.pollutionLevel);
        const statusColor = getStatusColor(data.status);

        return {
          id: doc.id,
          beachName,
          date: new Date(data.date).toLocaleDateString(),
          time: moment(data.time.from).format("hh:mm A"),
          weather: data.weather,
          tide: data.tide,
          organizer: data.organizerName,
          image: data.images[0] || "default-image-url.png",
        } as Event;
      });
      setReportData(events);
    };

    fetchReportedAreas();
  }, [userId]);

  const getWasteLevelColor = (level: string) => {
    switch (level) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const handleReportPress = (item: Event) => {
    setReportId(item.id);
    console.log("reportId", reportId, "+++", item.id);
    navigation.navigate("UpdateOrganizeEventsPast", { report: item });
  };

  const confirmRemoveReport = (reportId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeReport(reportId),
        },
      ],
      { cancelable: true }
    );
  };

  const removeReport = async (reportId: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "events", reportId));
      setReportData(reportData.filter((report) => report.id !== reportId));
    } catch (error) {
      console.error("Error removing report:", error);
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
        <View>
          <Text style={styles.title}>Upcoming Events</Text>
        </View>
        {reportData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleReportPress(item)}
          >
            <EventCard item={item} onRemove={confirmRemoveReport} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    gap: 10,
    backgroundColor: "#ffffff",
  },
  topic: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default OrganizedEventsPast;
