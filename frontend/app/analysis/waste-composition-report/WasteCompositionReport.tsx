import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const wasteCompositionData = [
  { type: "Plastics", percentage: 60, color: "rgba(255, 99, 132, 1)" },
  { type: "Glass", percentage: 15, color: "rgba(54, 162, 235, 1)" },
  { type: "Metal", percentage: 10, color: "rgba(255, 206, 86, 1)" },
  { type: "Paper", percentage: 10, color: "rgba(75, 192, 192, 1)" },
  { type: "Other", percentage: 5, color: "rgba(153, 102, 255, 1)" },
];

const wasteCompositionOverTime = [
  { month: "Jan", plastics: 58, glass: 16, metal: 11, paper: 10, other: 5 },
  { month: "Feb", plastics: 59, glass: 15, metal: 11, paper: 10, other: 5 },
  { month: "Mar", plastics: 60, glass: 15, metal: 10, paper: 10, other: 5 },
  { month: "Apr", plastics: 61, glass: 14, metal: 10, paper: 10, other: 5 },
  { month: "May", plastics: 62, glass: 14, metal: 9, paper: 10, other: 5 },
];

const commonWasteItems = [
  { item: "Plastic bottles", count: 500 },
  { item: "Cigarette butts", count: 450 },
  { item: "Food wrappers", count: 400 },
  { item: "Plastic bags", count: 350 },
  { item: "Bottle caps", count: 300 },
];

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: 10,
  },
};

const WasteCompositionReport = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      {/* <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Waste Composition Report
      </Text> */}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Overall Waste Composition
      </Text>
      <PieChart
        data={wasteCompositionData.map((item) => ({
          name: item.type,
          population: item.percentage,
          color: item.color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 12,
        }))}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Waste Composition Changes Over Time
      </Text>
      <LineChart
        data={{
          labels: wasteCompositionOverTime.map((d) => d.month),
          datasets: [
            {
              data: wasteCompositionOverTime.map((d) => d.plastics),
              color: () => "rgba(255, 99, 132, 1)",
              strokeWidth: 2,
            },
            {
              data: wasteCompositionOverTime.map((d) => d.glass),
              color: () => "rgba(54, 162, 235, 1)",
              strokeWidth: 2,
            },
            {
              data: wasteCompositionOverTime.map((d) => d.metal),
              color: () => "rgba(255, 206, 86, 1)",
              strokeWidth: 2,
            },
            {
              data: wasteCompositionOverTime.map((d) => d.paper),
              color: () => "rgba(75, 192, 192, 1)",
              strokeWidth: 2,
            },
            {
              data: wasteCompositionOverTime.map((d) => d.other),
              color: () => "rgba(153, 102, 255, 1)",
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
        Most Common Waste Items
      </Text>
      <BarChart
        data={{
          labels: commonWasteItems.map((item) => item.item),
          datasets: [
            {
              data: commonWasteItems.map((item) => item.count),
            },
          ],
        }}
        yAxisLabel=""
        yAxisSuffix=""
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </ScrollView>
  );
};

export default WasteCompositionReport;
