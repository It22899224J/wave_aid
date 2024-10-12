import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, StackedBarChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";
import { db } from "@/service/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Loader from "@/components/loader/Loader";

const screenWidth = Dimensions.get("window").width;

// const performanceData = [
//   {
//     date: "2023-01",
//     wastePerHour: 10,
//     participants: 20,
//     areaCovered: 100,
//     wasteCollected: 200,
//   },
//   {
//     date: "2023-02",
//     wastePerHour: 12,
//     participants: 25,
//     areaCovered: 120,
//     wasteCollected: 300,
//   },
//   {
//     date: "2023-03",
//     wastePerHour: 15,
//     participants: 30,
//     areaCovered: 150,
//     wasteCollected: 450,
//   },
//   {
//     date: "2023-04",
//     wastePerHour: 11,
//     participants: 22,
//     areaCovered: 110,
//     wasteCollected: 240,
//   },
//   {
//     date: "2023-05",
//     wastePerHour: 14,
//     participants: 28,
//     areaCovered: 140,
//     wasteCollected: 390,
//   },
// ];

const PerformanceReport = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventCompletionsRef = collection(db, "eventCompletions");

    const unsubscribe = onSnapshot(
      eventCompletionsRef,
      (querySnapshot) => {
        const newDataList: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.date &&
            data.wastePerHour &&
            data.totalParticipants &&
            data.wasteCollected &&
            data.areaCovered
          ) {
            newDataList.push(data);
          }
        });
        setDataList(newDataList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Text style={{ padding: 16 }}>{error}</Text>;
  if (dataList.length === 0)
    return <Text style={{ padding: 16 }}>No data available.</Text>;

  // Combine data by month
  const performanceDataByMonth = dataList.reduce((acc, d) => {
    const date = new Date(d.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        events: 0,
        wastePerHour: 0,
        participants: 0,
        areaCovered: 0,
        wasteCollected: 0,
      };
    }
    
    acc[monthYear].events += 1;
    acc[monthYear].wastePerHour += d.wastePerHour;
    acc[monthYear].participants += d.totalParticipants;
    acc[monthYear].areaCovered += d.areaCovered;
    acc[monthYear].wasteCollected += d.wasteCollected;
    
    return acc;
  }, {});

  const performanceData = Object.entries(performanceDataByMonth).map(([date, data]) => ({
    date,
    wastePerHour: data.wastePerHour / data.events, // Average waste per hour
    participants: data.participants, // Total participants
    areaCovered: data.areaCovered, // Total area covered
    wasteCollected: data.wasteCollected, // Total waste collected
    efficiency: data.wasteCollected / data.participants, // Waste collected per participant
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ScrollView style={{ paddingHorizontal: 16, marginVertical: 16, backgroundColor: "#f0f0f0" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Average Waste Collected per Hour
      </Text>
      <LineChart
        data={{
          labels: performanceData.map((d) => d.date),
          datasets: [
            {
              data: performanceData.map((d) => d.wastePerHour),
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Total Participants per Month
      </Text>
      <BarChart
        data={{
          labels: performanceData.map((d) => d.date),
          datasets: [
            {
              data: performanceData.map((d) => d.participants),
            },
          ],
        }}
        yAxisSuffix=""
        yAxisLabel=""
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Efficiency: Waste Collected per Participant
      </Text>
      <LineChart
        data={{
          labels: performanceData.map((d) => d.date),
          datasets: [
            {
              data: performanceData.map((d) => d.efficiency),
              color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </ScrollView>
  );
};

export default PerformanceReport;
