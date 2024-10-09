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
import { onSnapshot } from "firebase/firestore";

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

const MyEvents = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [reportData, setReportData] = useState<Event[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid;



  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "registrations"),
        where("userId", "==", userId)
      ),
      (registrationsSnapshot) => {
        const eventIds = registrationsSnapshot.docs.map((doc) => doc.data().eventId);
        setRegisteredEventIds(eventIds);
      },
      (error) => {
        console.error("Error fetching registrations: ", error);
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const fetchReportedAreas = async () => {
      const q = query(collection(db, "events"));
      const querySnapshot = await getDocs(q);

      const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const beachName = data.location.locationName.split(",")[0];
        const wasteLevelColor = getWasteLevelColor(data.pollutionLevel);
        const statusColor = getStatusColor(data.status);

        return {
          id: doc.id,
          beachName,
          date: new Date(data.date).toLocaleDateString(),
          time: moment(data.time.from).format("hh:mm A"),
          weather: data.weather,
          tide: data.tide,
          organizer: data.organizer,
          image: data.images[0] || "default-image-url.png",
        } as Event;
      });

      // Filter events based on registered event IDs
      const filteredEvents = events.filter((event) =>
        registeredEventIds.includes(event.id)
      );
      setReportData(filteredEvents);
    };

    fetchReportedAreas();
  }, [registeredEventIds]); // Re-fetch events when registeredEventIds changes

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
    const eventDate = new Date(item.date);
    const currentDate = new Date();

    if (eventDate < currentDate) {
      navigation.navigate("PastEventDetails", { report: item });
    } else {
      navigation.navigate("MyEventDetails", { report: item });
    }
  };

  const confirmRemoveReport = (reportId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Event?",
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
          <Text style={styles.title}>My Events</Text>
        </View>
        {reportData.length > 0 ? (
          reportData.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleReportPress(item)}
            >
              <EventCard item={item} onRemove={confirmRemoveReport} />
            </TouchableOpacity>
          ))
        ) : (
          <Text>No registered events found.</Text>
        )}
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

export default MyEvents;
