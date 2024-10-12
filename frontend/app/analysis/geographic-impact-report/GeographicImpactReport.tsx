import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/service/firebase";
import Loader from "@/components/loader/Loader";

const screenWidth = Dimensions.get("window").width;

const GeographicImpactReport = () => {
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
            data.eventName &&
            data.wasteCollected
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

  // Aggregate data by location
  const locationDataMap = dataList.reduce((acc, d) => {
    if (!acc[d.eventName]) {
      acc[d.eventName] = { wasteCollected: 0, cleanups: 0 };
    }
    acc[d.eventName].wasteCollected += d.wasteCollected;
    acc[d.eventName].cleanups += 1;
    return acc;
  }, {});

  const locationData = Object.entries(locationDataMap).map(([location, data]) => ({
    location,
    wasteCollected: data.wasteCollected,
    cleanups: data.cleanups,
  }));

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Waste Collected per Location
      </Text>
      <BarChart
        data={{
          labels: locationData.map((d) => d.location),
          datasets: [
            {
              data: locationData.map((d) => d.wasteCollected),
            },
          ],
        }}
        yAxisSuffix=""
        yAxisLabel=""
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 8, borderRadius: 16 }}
        // verticalLabelRotation={45}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Cleanups per Location
      </Text>
      <BarChart
        data={{
          labels: locationData.map((d) => d.location),
          datasets: [
            {
              data: locationData.map((d) => d.cleanups),
            },
          ],
        }}
        yAxisSuffix=""
        yAxisLabel=""
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 8, borderRadius: 16 }}
        // verticalLabelRotation={45}
      />
    </ScrollView>
  );
};

export default GeographicImpactReport;
