import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/service/firebase";
import Loader from "@/components/loader/Loader";

const screenWidth = Dimensions.get("window").width;

const wasteColors = {
  Plastics: "rgba(255, 99, 132, 1)",
  Glass: "rgba(54, 162, 235, 1)",
  Metal: "rgba(255, 206, 86, 1)",
  Paper: "rgba(75, 192, 192, 1)",
  Other: "rgba(153, 102, 255, 1)",
};

const WasteCompositionReport = () => {
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
          if (data.date && data.wasteTypes) {
            newDataList.push(data);
          }
        });
        console.log("Fetched data:", newDataList);
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

  // Group waste composition data by waste type
  let wasteCompositionData;
  try {
    wasteCompositionData = dataList.reduce((acc, item) => {
      if (Array.isArray(item.wasteTypes)) {
        item.wasteTypes.forEach((wasteType) => {
          const type = wasteType.type || wasteType.name;
          const percentage = parseFloat(wasteType.percentage || wasteType.value);
          if (!isNaN(percentage)) {
            if (!acc[type]) {
              acc[type] = 0;
            }
            acc[type] += percentage;
          }
        });
      }
      return acc;
    }, {});
    console.log("Grouped waste composition data:", wasteCompositionData);
  } catch (err) {
    console.error("Error grouping waste composition data:", err);
    return <Text style={{ padding: 16 }}>Error processing data. Please try again later.</Text>;
  }

  let wasteCompositionChartData;
  try {
    const totalPercentage = Object.values(wasteCompositionData).reduce((sum: number, value: number) => sum + value, 0);
    wasteCompositionChartData = Object.entries(wasteCompositionData).map(([type, percentage]) => ({
      name: "% " + type,
      population: Number(((percentage as number / totalPercentage) * 100).toFixed(2)),
      color: wasteColors[type] || `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));
    console.log("Chart data:", wasteCompositionChartData);
  } catch (err) {
    console.error("Error creating chart data:", err);
    return <Text style={{ padding: 16 }}>Error creating chart. Please try again later.</Text>;
  }

  if (wasteCompositionChartData.length === 0) {
    return <Text style={{ padding: 16 }}>No waste composition data available.</Text>;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Overall Waste Composition
      </Text>
      <PieChart
        data={wasteCompositionChartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
};

export default WasteCompositionReport;
