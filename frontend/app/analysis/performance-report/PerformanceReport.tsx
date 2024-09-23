import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, StackedBarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const performanceData = [
  {
    date: "2023-01",
    wastePerHour: 10,
    participants: 20,
    areaCovered: 100,
    wasteCollected: 200,
  },
  {
    date: "2023-02",
    wastePerHour: 12,
    participants: 25,
    areaCovered: 120,
    wasteCollected: 300,
  },
  {
    date: "2023-03",
    wastePerHour: 15,
    participants: 30,
    areaCovered: 150,
    wasteCollected: 450,
  },
  {
    date: "2023-04",
    wastePerHour: 11,
    participants: 22,
    areaCovered: 110,
    wasteCollected: 240,
  },
  {
    date: "2023-05",
    wastePerHour: 14,
    participants: 28,
    areaCovered: 140,
    wasteCollected: 390,
  },
];

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
  propsForLabels: {
    fontSize: 10,
  },
};

const PerformanceReport = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Performance Report
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Waste Collected per Hour
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
        Participants per Event
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
        Efficiency: Waste Collected vs Participants
      </Text>
      <StackedBarChart
        data={{
          labels: performanceData.map((d) => d.date), // X-axis labels
          legend: ["Participants", "Waste Collected"], // Legends for the stacked bar chart
          data: performanceData.map((d) => [d.participants, d.wasteCollected]), // Array of arrays where each inner array represents values for each stack
          barColors: ["#dfe4ea", "#ced6e0"], // Colors for the stacked sections
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        hideLegend={false} // Explicitly add the hideLegend property
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </ScrollView>
  );
};

export default PerformanceReport;
