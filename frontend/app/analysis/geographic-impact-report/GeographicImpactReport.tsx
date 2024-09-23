import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";

const screenWidth = Dimensions.get("window").width;

const locationData = [
  { location: "Beach A", wasteCollected: 500, cleanups: 5 },
  { location: "Beach B", wasteCollected: 750, cleanups: 7 },
  { location: "Beach C", wasteCollected: 600, cleanups: 6 },
  { location: "Beach D", wasteCollected: 400, cleanups: 4 },
];

const wasteTypeData = [
  { name: "Plastics", value: 50, color: "rgba(131, 167, 234, 1)" },
  { name: "Glass", value: 20, color: "#F00" },
  { name: "Metal", value: 15, color: "rgb(0, 0, 255)" },
  { name: "Other", value: 15, color: "rgb(0, 255, 0)" },
];

const GeographicImpactReport = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      {/* <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Geographic Impact Report
      </Text> */}

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
